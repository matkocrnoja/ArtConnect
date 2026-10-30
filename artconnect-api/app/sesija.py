import time
import uuid

import jwt
from fastapi import Response

from app.config import get_settings
from app.models import Uloga

KOLACIC_SESIJE = "sesija"
KOLACIC_REGISTRACIJE = "registracija"
ALGORITAM = "HS256"

# Kolačić živi dulje od sesije: istek provjerava backend, a da bi mogao vratiti
# "sesija_istekla", preglednik mu mora i dalje poslati istekli token.
TRAJANJE_KOLACICA_SESIJE_S = 30 * 24 * 60 * 60
TRAJANJE_REGISTRACIJE_S = 10 * 60


def _potpisi(podaci: dict) -> str:
    return jwt.encode(podaci, get_settings().secret_key.get_secret_value(), algorithm=ALGORITAM)


def stvori_token_sesije(korisnik_id: uuid.UUID, uloga: Uloga) -> str:
    # "svrha" sprječava da se token za registraciju iskoristi kao sesija i obrnuto.
    return _potpisi({
        "svrha": "sesija",
        "sub": str(korisnik_id),
        "uloga": uloga.value,
        "obnovljen": int(time.time()),
    })


def stvori_token_registracije(sub: str, email: str, ime_prezime: str, uloga: Uloga) -> str:
    return _potpisi({
        "svrha": "registracija",
        "sub": sub,
        "email": email,
        "ime_prezime": ime_prezime,
        "uloga": uloga.value,
        "exp": int(time.time()) + TRAJANJE_REGISTRACIJE_S,
    })


def _procitaj(token: str, svrha: str, obavezna_polja: list[str]) -> dict | None:
    try:
        podaci = jwt.decode(
            token,
            get_settings().secret_key.get_secret_value(),
            algorithms=[ALGORITAM],
            options={"require": obavezna_polja},
        )
    except jwt.InvalidTokenError:
        return None
    return podaci if podaci.get("svrha") == svrha else None


def procitaj_token_sesije(token: str) -> dict | None:
    return _procitaj(token, "sesija", ["sub", "uloga", "obnovljen"])


def procitaj_token_registracije(token: str) -> dict | None:
    return _procitaj(token, "registracija", ["exp"])


def postavi_kolacic(response: Response, naziv: str, vrijednost: str, max_age: int):
    response.set_cookie(
        naziv,
        vrijednost,
        max_age=max_age,
        httponly=True,
        samesite="lax",
        secure=get_settings().cookie_secure,
    )


def obrisi_kolacic(response: Response, naziv: str):
    response.delete_cookie(
        naziv,
        httponly=True,
        samesite="lax",
        secure=get_settings().cookie_secure,
    )
