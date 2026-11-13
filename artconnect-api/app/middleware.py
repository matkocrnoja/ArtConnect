import uuid

from fastapi import Depends, FastAPI, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Row, text
from sqlalchemy.orm import Session
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings
from app.database import get_db
from app.dependencies import TrenutniKorisnik, get_optional_user, require_role
from app.s3storage import kljuc_datoteke_djela
from app.sesija import Uloga


def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[get_settings().frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def setup_session(app: FastAPI):
    # Služi samo za state i nonce tijekom odlaska na Google, a prava sesija je kolačić "sesija".
    settings = get_settings()
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.secret_key.get_secret_value(),
        session_cookie="oauth_state",
        max_age=10 * 60,
        same_site="lax",
        https_only=settings.cookie_secure,
    )


def provjeri_vlasnistvo_djela(
    djelo_id: uuid.UUID = Form(),
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
) -> Row:
    djelo = db.execute(
        text("""
            SELECT id, umjetnik_id FROM djela
            WHERE id = :djelo_id AND umjetnik_id = :umjetnik_id
        """),
        {"djelo_id": djelo_id, "umjetnik_id": trenutni.korisnik.id},
    ).first()
    if djelo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "djelo_ne_postoji")
    return djelo

def je_vlasnik(trenutni: TrenutniKorisnik | None, umjetnik_id: uuid.UUID) -> bool:
    return (
        trenutni is not None
        and trenutni.uloga == Uloga.umjetnik
        and trenutni.korisnik.id == umjetnik_id
    )


def provjeri_pristup_datoteci(
    umjetnik_id: uuid.UUID,
    djelo_id: uuid.UUID,
    datoteka_id: uuid.UUID,
    trenutni: TrenutniKorisnik | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> str:
    datoteka = db.execute(
        text("""
            SELECT dd.mime_tip, d.javno, d.uklonjeno_u
            FROM datoteke_djela dd
            JOIN djela d ON d.id = dd.djelo_id
            WHERE dd.id = :datoteka_id
              AND d.id = :djelo_id
              AND d.umjetnik_id = :umjetnik_id
        """),
        {"datoteka_id": datoteka_id, "djelo_id": djelo_id, "umjetnik_id": umjetnik_id},
    ).first()
    if datoteka is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "datoteka_ne_postoji")

    vlasnik = je_vlasnik(trenutni, umjetnik_id)
    javno_dostupno = datoteka.javno and datoteka.uklonjeno_u is None
    if not vlasnik and not javno_dostupno:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "zabranjen_pristup")

    return kljuc_datoteke_djela(umjetnik_id, djelo_id, datoteka_id, datoteka.mime_tip)


def provjeri_pristup_portfoliju(
    umjetnik_id: uuid.UUID,
    trenutni: TrenutniKorisnik | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> bool:
    umjetnik = db.execute(
        text("SELECT id FROM umjetnici WHERE id = :umjetnik_id"),
        {"umjetnik_id": umjetnik_id},
    ).first()
    if umjetnik is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "umjetnik_ne_postoji")

    return je_vlasnik(trenutni, umjetnik_id)

def provjeri_pristup_djelu(
    umjetnik_id: uuid.UUID,
    djelo_id: uuid.UUID,
    trenutni: TrenutniKorisnik | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> Row:
    djelo = db.execute(
        text("""
            SELECT id, umjetnik_id, naziv, godina_nastanka, tehnika, dimenzije, opis,
                   javno, uklonjeno_u, trenutak_izrade
            FROM djela
            WHERE id = :djelo_id AND umjetnik_id = :umjetnik_id
        """),
        {"djelo_id": djelo_id, "umjetnik_id": umjetnik_id},
    ).first()
    if djelo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "djelo_ne_postoji")

    vlasnik = je_vlasnik(trenutni, umjetnik_id)
    javno_dostupno = djelo.javno and djelo.uklonjeno_u is None
    if not vlasnik and not javno_dostupno:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "zabranjen_pristup")

    return djelo
