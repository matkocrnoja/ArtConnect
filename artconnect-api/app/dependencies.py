import time
import uuid
from dataclasses import dataclass

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    MODELI_ULOGA,
    Administrator,
    Organizator,
    PostavkaSustava,
    StatusRacuna,
    Uloga,
    Umjetnik,
)
from app.sesija import (
    KOLACIC_SESIJE,
    postavi_sesiju,
    procitaj_token_sesije,
)


@dataclass
class TrenutniKorisnik:
    korisnik: Umjetnik | Organizator | Administrator
    uloga: Uloga


def je_blokiran(korisnik) -> bool:
    # Administratori nemaju status_racuna.
    return getattr(korisnik, "status_racuna", None) == StatusRacuna.blokiran


def trajanje_sesije_s(db: Session, uloga: Uloga) -> int:
    postavka = db.get(PostavkaSustava, f"trajanje_sesije_{uloga.value}_h")
    return int(postavka.vrijednost) * 60 * 60


def get_current_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> TrenutniKorisnik:
    sesija = procitaj_token_sesije(request.cookies.get(KOLACIC_SESIJE, ""))
    if sesija is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "nije_prijavljen")

    uloga = Uloga(sesija["uloga"])
    trajanje = trajanje_sesije_s(db, uloga)
    proteklo = int(time.time()) - sesija["obnovljen"]
    if proteklo > trajanje:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "sesija_istekla")

    korisnik = db.get(MODELI_ULOGA[uloga], uuid.UUID(sesija["sub"]))
    if korisnik is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "nije_prijavljen")
    if je_blokiran(korisnik):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "racun_blokiran")

    if proteklo > trajanje / 2:
        postavi_sesiju(response, korisnik.id, uloga)

    return TrenutniKorisnik(korisnik, uloga)


def require_role(*dopustene_uloge: Uloga):
    def provjeri_ulogu(
        trenutni: TrenutniKorisnik = Depends(get_current_user),
    ) -> TrenutniKorisnik:
        if trenutni.uloga not in dopustene_uloge:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "zabranjen_pristup")
        return trenutni

    return provjeri_ulogu
