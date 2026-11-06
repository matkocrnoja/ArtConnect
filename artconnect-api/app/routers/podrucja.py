from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(prefix="/podrucja", tags=["podrucja"])


# Javna ruta jer je obrazac za registraciju treba prije nego što korisnik ima sesiju.
@router.get("")
def podrucja(db: Session = Depends(get_db)):
    upit = text("""
        SELECT sifra_podrucja, naziv_podrucja
        FROM podrucja_djelovanja
        WHERE aktivno
        ORDER BY naziv_podrucja
    """)
    return [
        {"sifra_podrucja": p.sifra_podrucja, "naziv_podrucja": p.naziv_podrucja}
        for p in db.execute(upit)
    ]
