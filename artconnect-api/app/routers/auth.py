import secrets

import httpx
from authlib.common.errors import AuthlibBaseError
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import RedirectResponse
from joserfc.errors import JoseError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.dependencies import TrenutniKorisnik, get_current_user, je_blokiran
from app.google import oauth
from app.models import (
    MODELI_ULOGA,
    Organizator,
    PodrucjeDjelovanja,
    Portfolio,
    Uloga,
    Umjetnik,
)
from app.schemas import Registracija
from app.sesija import (
    KOLACIC_REGISTRACIJE,
    KOLACIC_SESIJE,
    TRAJANJE_KOLACICA_SESIJE_S,
    TRAJANJE_REGISTRACIJE_S,
    obrisi_kolacic,
    postavi_kolacic,
    procitaj_token_registracije,
    stvori_token_registracije,
    stvori_token_sesije,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def preusmjeri(putanja: str) -> RedirectResponse:
    return RedirectResponse(f"{get_settings().frontend_url}{putanja}", status_code=302)


def preusmjeri_s_greskom(kod: str) -> RedirectResponse:
    return preusmjeri(f"/?greska={kod}")


def pronadi_korisnika(db: Session, uloga: Uloga, sub: str):
    model = MODELI_ULOGA[uloga]
    return db.scalar(select(model).where(model.google_subject_id == sub))


def aktivna_podrucja(db: Session, sifre: set) -> list[PodrucjeDjelovanja]:
    upit = select(PodrucjeDjelovanja).where(
        PodrucjeDjelovanja.sifra_podrucja.in_(sifre), PodrucjeDjelovanja.aktivno
    )
    return list(db.scalars(upit))


def novi_umjetnik(db: Session, podaci: Registracija, zajednicko: dict) -> Umjetnik:
    sifre = set(podaci.sifre_podrucja)
    if not sifre:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "podrucje_obavezno")

    podrucja = aktivna_podrucja(db, sifre)
    if len(podrucja) != len(sifre):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "neispravno_podrucje")

    # Portfolio mora postojati prije umjetnika jer je umjetnici.id strani ključ na njega.
    return Umjetnik(
        **zajednicko, portfolio=Portfolio(), podrucja=podrucja, poveznice=podaci.poveznice
    )


def novi_organizator(podaci: Registracija, zajednicko: dict) -> Organizator:
    if not podaci.naziv_organizacije:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "naziv_organizacije_obavezan")

    return Organizator(**zajednicko, naziv_organizacije=podaci.naziv_organizacije)


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

    zajednicko = {
        "google_subject_id": identitet["sub"],
        "email": identitet["email"],
        "ime_prezime": podaci.ime_prezime or identitet["ime_prezime"],
    }
    if uloga == Uloga.umjetnik:
        korisnik = novi_umjetnik(db, podaci, zajednicko)
    else:
        korisnik = novi_organizator(podaci, zajednicko)

    db.add(korisnik)
    try:
        db.commit()
    except IntegrityError:
        # Dva istovremena zahtjeva: oba su prošla provjeru, a UNIQUE u bazi je pustio samo jedan.
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "vec_registriran")

    postavi_kolacic(
        response,
        KOLACIC_SESIJE,
        stvori_token_sesije(korisnik.id, uloga),
        TRAJANJE_KOLACICA_SESIJE_S,
    )
    obrisi_kolacic(response, KOLACIC_REGISTRACIJE)
    return {"id": korisnik.id, "uloga": uloga.value}


@router.get("/google/login")
async def google_login(request: Request, uloga: Uloga):
    # Uloga putuje unutar state vrijednosti koju Authlib pri povratku provjerava prema sesiji.
    state = f"{uloga.value}.{secrets.token_urlsafe(24)}"
    return await oauth.google.authorize_redirect(
        request, get_settings().google_redirect_uri, state=state
    )


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
    # Baza je sinkrona, a ova funkcija asinkrona, pa upit ide u zasebnu dretvu.
    korisnik = await run_in_threadpool(pronadi_korisnika, db, uloga, sub)

    if korisnik is None:
        if uloga == Uloga.administrator:
            return preusmjeri_s_greskom("nije_administrator")

        odgovor = preusmjeri(f"/registracija?uloga={uloga.value}")
        ime_prezime = podaci.get("name") or email
        postavi_kolacic(
            odgovor,
            KOLACIC_REGISTRACIJE,
            stvori_token_registracije(sub, email, ime_prezime, uloga),
            TRAJANJE_REGISTRACIJE_S,
        )
        return odgovor

    if je_blokiran(korisnik):
        return preusmjeri_s_greskom("racun_blokiran")

    odgovor = preusmjeri("/dashboard")
    postavi_kolacic(
        odgovor,
        KOLACIC_SESIJE,
        stvori_token_sesije(korisnik.id, uloga),
        TRAJANJE_KOLACICA_SESIJE_S,
    )
    obrisi_kolacic(odgovor, KOLACIC_REGISTRACIJE)
    return odgovor


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
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    obrisi_kolacic(response, KOLACIC_SESIJE)
