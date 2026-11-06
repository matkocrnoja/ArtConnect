import secrets
import uuid

#library imports
import httpx
from authlib.common.errors import AuthlibBaseError
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import RedirectResponse
from joserfc.errors import JoseError
from pydantic import BaseModel, ConfigDict, HttpUrl, TypeAdapter, ValidationError
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

#importovi iz drugih fajlova
from app.config import get_settings
from app.database import get_db
from app.dependencies import TABLICE_ULOGA, TrenutniKorisnik, get_current_user, je_blokiran
from app.google import oauth
from app.sesija import (
    KOLACIC_REGISTRACIJE,
    KOLACIC_SESIJE,
    TRAJANJE_REGISTRACIJE_S,
    Uloga,
    obrisi_kolacic,
    postavi_kolacic,
    postavi_sesiju,
    procitaj_token_registracije,
    stvori_token_registracije,
)

router = APIRouter(prefix="/auth", tags=["auth"])

MAKS_POVEZNICA = 5

_provjera_url = TypeAdapter(HttpUrl)


class Registracija(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    ime: str = ""
    prezime: str = ""
    naziv_organizacije: str | None = None
    sifre_podrucja: list[uuid.UUID] = []
    poveznice: list[str] = []


def preusmjeri(putanja: str) -> RedirectResponse:
    return RedirectResponse(f"{get_settings().frontend_url}{putanja}", status_code=302)


def preusmjeri_s_greskom(kod: str) -> RedirectResponse:
    return preusmjeri(f"/?greska={kod}")


def pronadi_korisnika(db: Session, uloga: Uloga, sub: str):
    return db.execute(
        text(f"SELECT * FROM {TABLICE_ULOGA[uloga]} WHERE google_subject_id = :sub"),
        {"sub": sub},
    ).first()


def aktivna_podrucja(db: Session, sifre: set) -> list:
    return list(db.execute(
        text("""
            SELECT * FROM podrucja_djelovanja
            WHERE sifra_podrucja = ANY(:sifre) AND aktivno
        """),
        {"sifre": list(sifre)},
    ))


def ocisti_poveznice(vrijednosti: list[str]) -> list[str]:
    poveznice = [poveznica for poveznica in vrijednosti if poveznica]
    if len(poveznice) > MAKS_POVEZNICA:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "previse_poveznica")

    try:
        for poveznica in poveznice:
            _provjera_url.validate_python(poveznica)
    except ValidationError:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "neispravna_poveznica")

    return poveznice


def novi_umjetnik(db: Session, podaci: Registracija, zajednicko: dict) -> uuid.UUID:
    sifre = set(podaci.sifre_podrucja)
    if not sifre:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "podrucje_obavezno")

    podrucja = aktivna_podrucja(db, sifre)
    if len(podrucja) != len(sifre):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "neispravno_podrucje")

    poveznice = ocisti_poveznice(podaci.poveznice)

    # Portfolio mora postojati prije umjetnika jer je umjetnici.id strani ključ na njega.
    korisnik_id = db.execute(
        text("INSERT INTO portfolio (umjetnik_id) VALUES (gen_random_uuid()) RETURNING umjetnik_id")
    ).scalar_one()
    db.execute(
        text("""
            INSERT INTO umjetnici (id, google_subject_id, email, ime_prezime, poveznice)
            VALUES (:id, :google_subject_id, :email, :ime_prezime, :poveznice)
        """),
        {"id": korisnik_id, **zajednicko, "poveznice": poveznice},
    )
    db.execute(
        text("""
            INSERT INTO umjetnici_podrucja (umjetnik_id, sifra_podrucja)
            VALUES (:umjetnik_id, :sifra_podrucja)
        """),
        [{"umjetnik_id": korisnik_id, "sifra_podrucja": p.sifra_podrucja} for p in podrucja],
    )
    return korisnik_id


def novi_organizator(db: Session, podaci: Registracija, zajednicko: dict) -> uuid.UUID:
    if not podaci.naziv_organizacije:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "naziv_organizacije_obavezan")

    return db.execute(
        text("""
            INSERT INTO organizatori (id, google_subject_id, email, ime_prezime, naziv_organizacije)
            VALUES (gen_random_uuid(), :google_subject_id, :email, :ime_prezime, :naziv_organizacije)
            RETURNING id
        """),
        {**zajednicko, "naziv_organizacije": podaci.naziv_organizacije},
    ).scalar_one()

#3
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(
    podaci: Registracija,
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    # Identitet i uloga dolaze iz potpisanog kolačića, nikad iz tijela zahtjeva.
    identitet = procitaj_token_registracije(request.cookies.get(KOLACIC_REGISTRACIJE, ""))
    if identitet is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "registracija_istekla")

    uloga = Uloga(identitet["uloga"])
    if uloga == Uloga.administrator:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "registracija_nije_dopustena")

    if pronadi_korisnika(db, uloga, identitet["sub"]) is not None:
        raise HTTPException(status.HTTP_409_CONFLICT, "vec_registriran")

    if not podaci.ime:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "ime_obavezno")
    if not podaci.prezime:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "prezime_obavezno")

    zajednicko = {
        "google_subject_id": identitet["sub"],
        "email": identitet["email"],
        "ime_prezime": f"{podaci.ime} {podaci.prezime}",
    }
    try:
        if uloga == Uloga.umjetnik:
            korisnik_id = novi_umjetnik(db, podaci, zajednicko)
        else:
            korisnik_id = novi_organizator(db, podaci, zajednicko)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "vec_registriran")

    postavi_sesiju(response, korisnik_id, uloga)
    obrisi_kolacic(response, KOLACIC_REGISTRACIJE)
    return {"id": korisnik_id, "uloga": uloga.value}

#1
@router.get("/google/login")
async def google_login(request: Request, uloga: Uloga):
    state = f"{uloga.value}.{secrets.token_urlsafe(24)}"
    return await oauth.google.authorize_redirect(
        request, get_settings().google_redirect_uri, state=state
    )

#2
@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    if request.query_params.get("error") == "access_denied":
        return preusmjeri_s_greskom("odustanak")

    try:
        token = await oauth.google.authorize_access_token(request)
    except (AuthlibBaseError, JoseError, httpx.HTTPError):
        return preusmjeri_s_greskom("neuspjela_prijava")

    podaci = token.get("userinfo") or {}
    sub, email = podaci.get("sub"), podaci.get("email")
    if not sub or not email:
        return preusmjeri_s_greskom("neuspjela_prijava")

    uloga = Uloga(request.query_params["state"].split(".")[0])
    korisnik = await run_in_threadpool(pronadi_korisnika, db, uloga, sub)

    if korisnik is None:
        if uloga == Uloga.administrator:
            return preusmjeri_s_greskom("nije_administrator")

        odgovor = preusmjeri(f"/registracija?uloga={uloga.value}")
        postavi_kolacic(
            odgovor,
            KOLACIC_REGISTRACIJE,
            stvori_token_registracije(sub, email, uloga),
            TRAJANJE_REGISTRACIJE_S,
        )
        return odgovor

    if je_blokiran(korisnik):
        return preusmjeri_s_greskom("racun_blokiran")

    odgovor = preusmjeri("/dashboard")
    postavi_sesiju(odgovor, korisnik.id, uloga)
    obrisi_kolacic(odgovor, KOLACIC_REGISTRACIJE)
    return odgovor

#4
@router.get("/me")
def me(trenutni: TrenutniKorisnik = Depends(get_current_user)):
    korisnik = trenutni.korisnik
    odgovor = {
        "id": korisnik.id,
        "ime_prezime": korisnik.ime_prezime,
        "email": korisnik.email,
        "uloga": trenutni.uloga.value,
    }
    if trenutni.uloga == Uloga.organizator:
        odgovor["ovjeren"] = korisnik.ovjeren
    return odgovor


# Bez get_current_user: odjava mora proći i s isteklom sesijom, a obnova bi vratila kolačić.
#5
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    obrisi_kolacic(response, KOLACIC_SESIJE)
