"""Pravila za podatke profila, zajednička za registraciju i stranicu Postavke.

Sva pravila se provjeravaju ovdje, na backendu, bez obzira na provjere u frontendu.
Greške se bacaju kao HTTPException s kodom koji frontend prevodi u poruku.
"""

import unicodedata

from fastapi import HTTPException, status
from pydantic import HttpUrl, TypeAdapter, ValidationError
from sqlalchemy import text
from sqlalchemy.orm import Session

MAKS_POVEZNICA = 5

_provjera_url = TypeAdapter(HttpUrl)


# NFC spaja rastavljene znakove (c + kvačica -> č), a split/join svodi razmake na jedan:
# "  Pero   Perić " -> "Pero Perić".
def normaliziraj_ime(vrijednost: str) -> str:
    return " ".join(unicodedata.normalize("NFC", vrijednost).split())


# Dopuštena su samo slova (bilo kojeg pisma, uključujući č, ć, š, ž, đ) i razmaci između riječi.
# isalpha() je lažan za brojeve, crtice, apostrofe i ostale simbole.
def je_ispravno_ime(vrijednost: str) -> bool:
    return bool(vrijednost) and all(rijec.isalpha() for rijec in vrijednost.split(" "))


def _provjeri_ime(vrijednost: str, kod_obavezno: str, kod_neispravno: str) -> str:
    vrijednost = normaliziraj_ime(vrijednost)
    if not vrijednost:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, kod_obavezno)
    if not je_ispravno_ime(vrijednost):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, kod_neispravno)
    return vrijednost


# Registracija: zasebna polja ime i prezime. Vraća normalizirani par.
def provjeri_ime_prezime(ime: str, prezime: str) -> tuple[str, str]:
    return (
        _provjeri_ime(ime, "ime_obavezno", "ime_neispravno"),
        _provjeri_ime(prezime, "prezime_obavezno", "prezime_neispravno"),
    )


# Postavke: jedno polje koje se izravno sprema u ime_prezime, bez dijeljenja.
def provjeri_puno_ime(ime_prezime: str) -> str:
    return _provjeri_ime(ime_prezime, "ime_prezime_obavezno", "ime_prezime_neispravno")


# Registracija sprema ime i prezime u jedan stupac ime_prezime, odvojene razmakom.
def spoji_ime_prezime(ime: str, prezime: str) -> str:
    return f"{ime} {prezime}"


def aktivna_podrucja(db: Session, sifre: set) -> list:
    return list(db.execute(
        text("""
            SELECT * FROM podrucja_djelovanja
            WHERE sifra_podrucja = ANY(:sifre) AND aktivno
        """),
        {"sifre": list(sifre)},
    ))


# Vraća retke odabranih područja; sva moraju postojati i biti aktivna.
def provjeri_podrucja(db: Session, sifre: set) -> list:
    if not sifre:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "podrucje_obavezno")

    podrucja = aktivna_podrucja(db, sifre)
    if len(podrucja) != len(sifre):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "neispravno_podrucje")
    return podrucja


# Prazna polja se zanemaruju; ostale poveznice moraju biti ispravni http(s) URL-ovi.
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
