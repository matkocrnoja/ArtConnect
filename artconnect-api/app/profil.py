"""Pravila za podatke profila, zajednička za registraciju i stranicu Postavke.

Sva pravila se provjeravaju ovdje, na backendu, bez obzira na provjere u frontendu.
Greške se bacaju kao HTTPException s kodom koji frontend prevodi u poruku.
"""

from fastapi import HTTPException, status
from pydantic import HttpUrl, TypeAdapter, ValidationError
from sqlalchemy import text
from sqlalchemy.orm import Session

MAKS_POVEZNICA = 5

_provjera_url = TypeAdapter(HttpUrl)


def provjeri_ime_prezime(ime: str, prezime: str) -> None:
    if not ime:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "ime_obavezno")
    if not prezime:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "prezime_obavezno")


# U bazi je jedan stupac ime_prezime, a obrasci imaju zasebna polja.
# Spaja se razmakom, a dijeli na prvom razmaku: "Ana Marija Horvat" -> ("Ana", "Marija Horvat").
def spoji_ime_prezime(ime: str, prezime: str) -> str:
    return f"{ime} {prezime}"


def razdvoji_ime_prezime(ime_prezime: str | None) -> tuple[str, str]:
    ime, _, prezime = (ime_prezime or "").partition(" ")
    return ime, prezime


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
