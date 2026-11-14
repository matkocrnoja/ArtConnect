import time
import uuid
from dataclasses import dataclass

from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy import Row, text
from sqlalchemy.orm import Session

from app.database import get_db
from app.sesija import (
    KOLACIC_SESIJE,
    Uloga,
    postavi_sesiju,
    procitaj_token_sesije,
)

TABLICE_ULOGA = {
    Uloga.umjetnik: "umjetnici",
    Uloga.organizator: "organizatori",
    Uloga.administrator: "administratori",
}


@dataclass
class TrenutniKorisnik:
    korisnik: Row
    uloga: Uloga


def je_blokiran(korisnik) -> bool:
    # administrator nema status_racuna
    return getattr(korisnik, "status_racuna", None) == "blokiran"


def trajanje_sesije_s(db: Session, uloga: Uloga) -> int:
    vrijednost = db.execute(
        text("SELECT vrijednost FROM postavke_sustava WHERE kljuc = :kljuc"),
        {"kljuc": f"trajanje_sesije_{uloga.value}_h"},      # za sql injection
    ).scalar_one()
    return int(vrijednost) * 60 * 60


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

    korisnik = db.execute(
        text(f"SELECT * FROM {TABLICE_ULOGA[uloga]} WHERE id = :id"),
        {"id": uuid.UUID(sesija["sub"])},
    ).first()
    if korisnik is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "nije_prijavljen")
    if je_blokiran(korisnik):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "racun_blokiran")

    if proteklo > trajanje / 2:
        postavi_sesiju(response, korisnik.id, uloga)

    return TrenutniKorisnik(korisnik, uloga)


# za rute za koje nije potrebno biti prijavljen: 
# onda postoje dva slučaja što se prikazuje
def get_optional_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
) -> TrenutniKorisnik | None:
    try:
        return get_current_user(request, response, db)
    except HTTPException:
        return None


def require_role(*dopustene_uloge: Uloga):
    def provjeri_ulogu(
        trenutni: TrenutniKorisnik = Depends(get_current_user),
    ) -> TrenutniKorisnik:
        if trenutni.uloga not in dopustene_uloge:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "zabranjen_pristup")
        return trenutni

    return provjeri_ulogu
