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
MAKS_PODRUCJA = 20
MAKS_DULJINA_IMENA = 100  # cijeli ime_prezime (pri registraciji: ime + razmak + prezime)
MAKS_DULJINA_NAZIVA = 200  # naziv organizacije

_provjera_url = TypeAdapter(HttpUrl)


# Koristi se za ime i prezime i za naziv organizacije.
# NFC spaja rastavljene znakove (c + kvačica -> č), a split/join svodi razmake na jedan:
# "  Pero   Perić " -> "Pero Perić".
def normaliziraj_tekst(vrijednost: str) -> str:
    return " ".join(unicodedata.normalize("NFC", vrijednost).split())


# Dopuštena su samo slova (bilo kojeg pisma, uključujući č, ć, š, ž, đ) i razmaci između riječi.
# isalpha() je lažan za brojeve, crtice, apostrofe i ostale simbole.
def je_ispravno_ime(vrijednost: str) -> bool:
    return bool(vrijednost) and all(rijec.isalpha() for rijec in vrijednost.split(" "))


def _provjeri_ime(vrijednost: str, kod_obavezno: str, kod_neispravno: str) -> str:
    vrijednost = normaliziraj_tekst(vrijednost)
    if not vrijednost:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, kod_obavezno)
    if not je_ispravno_ime(vrijednost):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, kod_neispravno)
    return vrijednost


# Duljina se mjeri nakon normalizacije, pa višak razmaka i rastavljeni znakovi ne ulaze u nju.
# len() broji Unicode znakove (č je jedan znak).
def _provjeri_duljinu(vrijednost: str, maks: int, kod: str) -> None:
    if len(vrijednost) > maks:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, kod)


# Registracija sprema ime i prezime u jedan stupac ime_prezime, odvojene razmakom.
def spoji_ime_prezime(ime: str, prezime: str) -> str:
    return f"{ime} {prezime}"


# Registracija: zasebna polja ime i prezime. Vraća normalizirani par.
# Ograničenje duljine vrijedi za spojeni ime_prezime, jer se on sprema u bazu.
def provjeri_ime_prezime(ime: str, prezime: str) -> tuple[str, str]:
    ime = _provjeri_ime(ime, "ime_obavezno", "ime_neispravno")
    prezime = _provjeri_ime(prezime, "prezime_obavezno", "prezime_neispravno")
    _provjeri_duljinu(spoji_ime_prezime(ime, prezime), MAKS_DULJINA_IMENA, "ime_prezime_predugo")
    return ime, prezime


# Postavke: jedno polje koje se izravno sprema u ime_prezime, bez dijeljenja.
def provjeri_puno_ime(ime_prezime: str) -> str:
    ime_prezime = _provjeri_ime(ime_prezime, "ime_prezime_obavezno", "ime_prezime_neispravno")
    _provjeri_duljinu(ime_prezime, MAKS_DULJINA_IMENA, "ime_prezime_predugo")
    return ime_prezime


# Naziv organizacije: ista normalizacija kao ime, ali bez pravila "samo slova",
# jer naziv smije sadržavati brojeve i znakove ("Studio 54", "Ars & Co. d.o.o.").
def provjeri_naziv_organizacije(naziv: str | None) -> str:
    naziv = normaliziraj_tekst(naziv or "")
    if not naziv:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "naziv_organizacije_obavezan")
    _provjeri_duljinu(naziv, MAKS_DULJINA_NAZIVA, "naziv_organizacije_predug")
    return naziv


def aktivna_podrucja(db: Session, sifre: set) -> list:
    return list(db.execute(
        text("""
            SELECT * FROM podrucja_djelovanja
            WHERE sifra_podrucja = ANY(:sifre) AND aktivno
        """),
        {"sifre": list(sifre)},
    ))


# Vraća retke odabranih područja; sva moraju postojati i biti aktivna.
# Broj se provjerava prije upita u bazu (sifre je skup, pa se duplikati ne broje).
def provjeri_podrucja(db: Session, sifre: set) -> list:
    if not sifre:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "podrucje_obavezno")
    if len(sifre) > MAKS_PODRUCJA:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "previse_podrucja")

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
