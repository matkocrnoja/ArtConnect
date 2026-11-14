import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import TrenutniKorisnik, require_role
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
