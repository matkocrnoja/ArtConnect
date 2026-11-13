import datetime
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import Row, text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import TrenutniKorisnik, require_role
from app.middleware import provjeri_pristup_djelu, provjeri_pristup_portfoliju
from app.sesija import Uloga

router = APIRouter(prefix="/art", tags=["art"])


class NovoDjelo(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    naziv: str = Field(min_length=1)
    godina_nastanka: int | None = Field(default=None, ge=1, le=32767)
    tehnika: str | None = None
    dimenzije: str | None = None
    opis: str | None = None
    javno: bool = False


class ProfilPortfolija(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    biografija: str = Field(max_length=2000, alias="biography")
    opis: str = Field(max_length=2000, alias="artDescription")

def dohvati_datoteke_djela(
    db: Session, 
    umjetnik_id: uuid.UUID, 
    djela_ids: list[uuid.UUID]
) -> dict[uuid.UUID, list[dict]]:
    datoteke = {djelo_id: [] for djelo_id in djela_ids}
    redovi = db.execute(
        text("""
            SELECT id, djelo_id, mime_tip FROM datoteke_djela
            WHERE djelo_id = ANY(:djela_ids)
            ORDER BY trenutak_prijenosa
        """),
        {"djela_ids": djela_ids},
    )
    for d in redovi:
        datoteke[d.djelo_id].append({
            "id": d.id,
            "mimeType": d.mime_tip,
            "url": f"/media/djela/{umjetnik_id}/{d.djelo_id}/{d.id}",
        })
    return datoteke


def djelo_u_odgovor(djelo: Row, datoteke: list[dict]) -> dict:
    return {
        "id": djelo.id,
        "title": djelo.naziv,
        "year": djelo.godina_nastanka,
        "technique": djelo.tehnika,
        "dimensions": djelo.dimenzije,
        "description": djelo.opis,
        "isPublic": djelo.javno,
        "files": datoteke,
        "createdAt": djelo.trenutak_izrade,
    }


def profil_u_odgovor(portfolio: Row) -> dict:
    return {
        "biography": portfolio.biografija or "",
        "artDescription": portfolio.opis or "",
    }

@router.post("/djela", status_code=status.HTTP_201_CREATED)
def novo_djelo(
    podaci: NovoDjelo,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    if podaci.godina_nastanka and podaci.godina_nastanka > datetime.date.today().year:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "godina_u_buducnosti")

    djelo_id = db.execute(
        text("""
            INSERT INTO djela (umjetnik_id, naziv, godina_nastanka, tehnika, dimenzije, opis, javno)
            VALUES (:umjetnik_id, :naziv, :godina_nastanka, :tehnika, :dimenzije, :opis, :javno)
            RETURNING id
        """),
        {"umjetnik_id": trenutni.korisnik.id, **podaci.model_dump()},
    ).scalar_one()
    db.commit()

    return {"id": djelo_id, "umjetnik_id": trenutni.korisnik.id}

@router.get("/portfolio/{umjetnik_id}")
def portfolio(
    umjetnik_id: uuid.UUID,
    vidi_sve: bool = Depends(provjeri_pristup_portfoliju),
    db: Session = Depends(get_db),
):
    djela = db.execute(
        text("""
            SELECT id, naziv, godina_nastanka, tehnika, dimenzije, opis, javno, trenutak_izrade
            FROM djela
            WHERE umjetnik_id = :umjetnik_id
              AND (:vidi_sve OR (javno AND uklonjeno_u IS NULL))
            ORDER BY trenutak_izrade DESC
        """),
        {"umjetnik_id": umjetnik_id, "vidi_sve": vidi_sve},
    ).all()

    datoteke = dohvati_datoteke_djela(db, umjetnik_id, [d.id for d in djela])
    return [djelo_u_odgovor(d, datoteke[d.id]) for d in djela]


@router.get("/portfolio/{umjetnik_id}/{djelo_id}")
def djelo_iz_portfolija(
    umjetnik_id: uuid.UUID,
    djelo: Row = Depends(provjeri_pristup_djelu),
    db: Session = Depends(get_db),
):
    datoteke = dohvati_datoteke_djela(db, umjetnik_id, [djelo.id])
    return djelo_u_odgovor(djelo, datoteke[djelo.id])


@router.post("/my-profile")
def uredi_profil_portfolija(
    podaci: ProfilPortfolija,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    portfolio = db.execute(
        text("""
            UPDATE portfolio SET biografija = :biografija, opis = :opis
            WHERE umjetnik_id = :umjetnik_id
            RETURNING biografija, opis
        """),
        {"umjetnik_id": trenutni.korisnik.id, **podaci.model_dump()},
    ).one()
    db.commit()

    return profil_u_odgovor(portfolio)


@router.get("/profile/{umjetnik_id}")
def profil_portfolija(
    umjetnik_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    portfolio = db.execute(
        text("SELECT biografija, opis FROM portfolio WHERE umjetnik_id = :umjetnik_id"),
        {"umjetnik_id": umjetnik_id},
    ).first()
    if portfolio is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "umjetnik_ne_postoji")

    return profil_u_odgovor(portfolio)
