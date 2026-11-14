import uuid

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import TrenutniKorisnik, require_role
from app.profil import ocisti_poveznice, provjeri_podrucja, provjeri_puno_ime
from app.sesija import Uloga

router = APIRouter(prefix="/artists", tags=["artists"])


class ProfilUmjetnikaUlaz(BaseModel):
    # extra="forbid": model nema polje email, pa pokušaj slanja e-adrese (ili bilo čega
    # nepoznatog) završava s 422. E-adresa dolazi iz Google računa i ne mijenja se.
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    ime_prezime: str = ""  # jedno polje, sprema se izravno u stupac ime_prezime
    sifre_podrucja: list[uuid.UUID] = []
    poveznice: list[str] = []


def dohvati_profil_umjetnika(db: Session, umjetnik_id: uuid.UUID) -> dict:
    umjetnik = db.execute(
        text("SELECT id, email, ime_prezime, poveznice FROM umjetnici WHERE id = :id"),
        {"id": umjetnik_id},
    ).one()
    podrucja = db.execute(
        text("""
            SELECT p.sifra_podrucja, p.naziv_podrucja, p.aktivno
            FROM umjetnici_podrucja up
            JOIN podrucja_djelovanja p ON p.sifra_podrucja = up.sifra_podrucja
            WHERE up.umjetnik_id = :id
            ORDER BY p.naziv_podrucja
        """),
        {"id": umjetnik_id},
    )
    return {
        "id": umjetnik.id,
        "ime_prezime": umjetnik.ime_prezime or "",
        "email": umjetnik.email,
        "podrucja": [
            {
                "sifra_podrucja": p.sifra_podrucja,
                "naziv_podrucja": p.naziv_podrucja,
                "aktivno": p.aktivno,
            }
            for p in podrucja
        ],
        "poveznice": umjetnik.poveznice or [],
    }


@router.get("/me")
def moj_profil(
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    return dohvati_profil_umjetnika(db, trenutni.korisnik.id)


@router.put("/me")
def spremi_moj_profil(
    podaci: ProfilUmjetnikaUlaz,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    # Sve provjere prije prvog pisanja u bazu.
    ime_prezime = provjeri_puno_ime(podaci.ime_prezime)
    podrucja = provjeri_podrucja(db, set(podaci.sifre_podrucja))
    poveznice = ocisti_poveznice(podaci.poveznice)

    umjetnik_id = trenutni.korisnik.id
    # UPDATE namjerno ne sadrži stupac email.
    db.execute(
        text("""
            UPDATE umjetnici
            SET ime_prezime = :ime_prezime, poveznice = :poveznice
            WHERE id = :id
        """),
        {
            "id": umjetnik_id,
            "ime_prezime": ime_prezime,
            "poveznice": poveznice,
        },
    )
    # Veza M:N: stari skup područja se briše i upisuje novi, u istoj transakciji.
    db.execute(
        text("DELETE FROM umjetnici_podrucja WHERE umjetnik_id = :id"),
        {"id": umjetnik_id},
    )
    db.execute(
        text("""
            INSERT INTO umjetnici_podrucja (umjetnik_id, sifra_podrucja)
            VALUES (:umjetnik_id, :sifra_podrucja)
        """),
        [{"umjetnik_id": umjetnik_id, "sifra_podrucja": p.sifra_podrucja} for p in podrucja],
    )
    db.commit()

    return dohvati_profil_umjetnika(db, umjetnik_id)
