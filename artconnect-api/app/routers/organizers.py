import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import TrenutniKorisnik, require_role
from app.profil import provjeri_ime_prezime, razdvoji_ime_prezime, spoji_ime_prezime
from app.sesija import Uloga

router = APIRouter(prefix="/organizers", tags=["organizers"])


class ProfilOrganizatoraUlaz(BaseModel):
    # extra="forbid": e-adresa (i svako drugo nepoznato polje) ne smije se poslati.
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    ime: str = ""
    prezime: str = ""
    naziv_organizacije: str = ""


def dohvati_profil_organizatora(db: Session, organizator_id: uuid.UUID) -> dict:
    organizator = db.execute(
        text("""
            SELECT id, email, ime_prezime, naziv_organizacije, ovjeren
            FROM organizatori WHERE id = :id
        """),
        {"id": organizator_id},
    ).one()
    ime, prezime = razdvoji_ime_prezime(organizator.ime_prezime)
    return {
        "id": organizator.id,
        "ime": ime,
        "prezime": prezime,
        "email": organizator.email,
        "naziv_organizacije": organizator.naziv_organizacije or "",
        "ovjeren": organizator.ovjeren,
    }


@router.get("/me")
def moj_profil(
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.organizator)),
    db: Session = Depends(get_db),
):
    return dohvati_profil_organizatora(db, trenutni.korisnik.id)


@router.put("/me")
def spremi_moj_profil(
    podaci: ProfilOrganizatoraUlaz,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.organizator)),
    db: Session = Depends(get_db),
):
    provjeri_ime_prezime(podaci.ime, podaci.prezime)
    if not podaci.naziv_organizacije:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "naziv_organizacije_obavezan")

    organizator_id = trenutni.korisnik.id
    # UPDATE namjerno ne sadrži stupac email.
    db.execute(
        text("""
            UPDATE organizatori
            SET ime_prezime = :ime_prezime, naziv_organizacije = :naziv_organizacije
            WHERE id = :id
        """),
        {
            "id": organizator_id,
            "ime_prezime": spoji_ime_prezime(podaci.ime, podaci.prezime),
            "naziv_organizacije": podaci.naziv_organizacije,
        },
    )
    db.commit()

    return dohvati_profil_organizatora(db, organizator_id)
