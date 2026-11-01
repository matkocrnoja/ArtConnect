from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import PodrucjeDjelovanja

router = APIRouter(prefix="/podrucja", tags=["podrucja"])


# Javna ruta jer je obrazac za registraciju treba prije nego što korisnik ima sesiju.
@router.get("")
def podrucja(db: Session = Depends(get_db)):
    upit = (
        select(PodrucjeDjelovanja)
        .where(PodrucjeDjelovanja.aktivno)
        .order_by(PodrucjeDjelovanja.naziv_podrucja)
    )
    return [
        {"sifra_podrucja": p.sifra_podrucja, "naziv_podrucja": p.naziv_podrucja}
        for p in db.scalars(upit)
    ]
