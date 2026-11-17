"""CRUD operacije portfolija umjetnika (/me/...).

Datoteke djela žive na S3 pod ključem djela/{umjetnik_id}/{djelo_id}/{datoteka_id}{ext}
(vidi s3storage.kljuc_datoteke_djela). Ime izvorne datoteke se ne pohranjuje!!!,
a veličina se čita iz S3 lista objekata.
"""

import datetime
import json
import uuid

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, ConfigDict, ValidationError
from sqlalchemy import Row, bindparam, text
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import TrenutniKorisnik, require_role
from app.routers.media import PostavkeMedia, dohvati_postavke_media
from app.s3storage import get_bucket, get_s3, kljuc_datoteke_djela
from app.sesija import Uloga

router = APIRouter(prefix="/me", tags=["portfolio"])

MAX_DULJINA_TEKSTA = 2000

AKTIVNI_STATUSI_PRIJAVE = ("predana", "u_pregledu", "potrebna_dopuna")


# Strukture

class ProfilUnos(BaseModel):
    biography: str
    artDescription: str


class DjeloUnos(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = ""
    year: int | None = None
    technique: str | None = None
    dimensions: str | None = None
    description: str | None = None
    isPublic: bool = False


# Pomoćne funkcije

def neispravni_podaci() -> HTTPException:
    return HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "neispravni_podaci")


def procitaj_unos(data: str) -> DjeloUnos:
    """Parsira JSON iz multipart polja "data" i provodi osnovne provjere."""
    try:
        podaci = DjeloUnos.model_validate_json(data)
    except ValidationError:
        raise neispravni_podaci()
    if not podaci.title:
        raise neispravni_podaci()
    if podaci.year is not None and not 1 <= podaci.year <= datetime.date.today().year:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "godina_u_buducnosti")
    return podaci


def vlastito_djelo(
    djelo_id: uuid.UUID,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
) -> Row:
    djelo = db.execute(
        text("""
            SELECT * FROM djela
            WHERE id = :djelo_id AND umjetnik_id = :umjetnik_id AND uklonjeno_u IS NULL
        """),
        {"djelo_id": djelo_id, "umjetnik_id": trenutni.korisnik.id},
    ).first()
    if djelo is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "djelo_ne_postoji")
    return djelo


def velicine_datoteka(prefiks: str) -> dict[str, int]:
    """Vraća {datoteka_id: veličina u bajtovima} za sve S3 objekte pod prefiksom.

    Veličina nije pohranjena u bazi nego se čita iz S3; ako S3 nije dostupan,
    dohvat portfolija i dalje radi, samo s veličinom 0.
    """
    try:
        s3 = get_s3()
        bucket = get_bucket()
        velicine = {}
        for stranica in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket, Prefix=prefiks):
            for objekt in stranica.get("Contents", []):
                # Ključ izgleda kao "djela/<umjetnik>/<djelo>/<datoteka_id>.png",
                # pa iz zadnjeg dijela ključa izdvajamo id datoteke (dio prije točke).
                ime_datoteke = objekt["Key"].rsplit("/", 1)[-1]
                datoteka_id = ime_datoteke.split(".", 1)[0]
                velicine[datoteka_id] = objekt["Size"]
        return velicine
    except Exception:
        return {}


def dohvati_datoteke(db: Session, djelo_id: uuid.UUID) -> list[Row]:
    return db.execute(
        text("""
            SELECT id, mime_tip FROM datoteke_djela
            WHERE djelo_id = :djelo_id
            ORDER BY trenutak_prijenosa, id
        """),
        {"djelo_id": djelo_id},
    ).all()


def u_artwork(djelo: Row, datoteke: list[Row], velicine: dict[str, int]) -> dict:
    """Mapira retke baze u oblik Artwork koji frontend očekuje."""
    files = []
    for datoteka in datoteke:
        velicina = velicine.get(str(datoteka.id), 0)  # 0 ako S3 trenutno nije dostupan
        files.append({
            "id": str(datoteka.id),
            "mimeType": datoteka.mime_tip,
            "sizeBytes": velicina,
            "url": f"/media/djela/{djelo.umjetnik_id}/{djelo.id}/{datoteka.id}",
        })

    return {
        "id": str(djelo.id),
        "title": djelo.naziv,
        "year": djelo.godina_nastanka,
        "technique": djelo.tehnika,
        "dimensions": djelo.dimenzije,
        "description": djelo.opis,
        "isPublic": djelo.javno,
        "files": files,
        "createdAt": djelo.trenutak_izrade.isoformat(),
    }


def cijeli_artwork(db: Session, djelo: Row) -> dict:
    datoteke = dohvati_datoteke(db, djelo.id)
    velicine = velicine_datoteka(f"djela/{djelo.umjetnik_id}/{djelo.id}/")
    return u_artwork(djelo, datoteke, velicine)


def provjeri_privitke(privitci: list[UploadFile], postavke: PostavkeMedia, postojece: int):
    """Iste provjere i oblici grešaka kao u media.upload_privitaka."""
    if postojece + len(privitci) > postavke.max_datoteka_po_djelu:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "previse_privitaka")

    max_velicina_bytes = postavke.max_velicina_datoteke_mb * 1024 * 1024
    for privitak in privitci:
        if privitak.content_type not in postavke.mime_types:
            raise HTTPException(
                status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                {"greska": "nedozvoljen_tip", "datoteka": privitak.filename},
            )
        if privitak.size > max_velicina_bytes:
            raise HTTPException(
                status.HTTP_413_CONTENT_TOO_LARGE,
                {"greska": "datoteka_prevelika", "datoteka": privitak.filename},
            )


def spremi_privitke(
    db: Session, s3, bucket: str,
    umjetnik_id: uuid.UUID, djelo_id: uuid.UUID,
    privitci: list[UploadFile],
) -> None:
    """Upisuje retke u datoteke_djela, prenosi datoteke na S3 i commita.

    Sve prethodno nespremljene promjene u sesiji (npr. INSERT/UPDATE djela)
    commitaju se zajedno; kod greške se sve poništava, uključujući S3 objekte.
    """
    kljucevi = []
    try:
        for privitak in privitci:
            datoteka_id = db.execute(
                text("""
                    INSERT INTO datoteke_djela (djelo_id, mime_tip)
                    VALUES (:djelo_id, :mime_tip)
                    RETURNING id
                """),
                {"djelo_id": djelo_id, "mime_tip": privitak.content_type},
            ).scalar_one()

            kljuc = kljuc_datoteke_djela(umjetnik_id, djelo_id, datoteka_id, privitak.content_type)
            s3.upload_fileobj(
                privitak.file, bucket, kljuc, ExtraArgs={"ContentType": privitak.content_type}
            )
            kljucevi.append(kljuc)
        db.commit()
    except Exception:
        db.rollback()
        for kljuc in kljucevi:
            s3.delete_object(Bucket=bucket, Key=kljuc)
        raise


# CRUD (Create Read Update Delete) Operacije na portfoliju su tu:

@router.get("/portfolio")
def dohvati_portfolio(
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    profil = db.execute(
        text("SELECT biografija, opis FROM portfolio WHERE umjetnik_id = :umjetnik_id"),
        {"umjetnik_id": trenutni.korisnik.id},
    ).first()

    djela = db.execute(
        text("""
            SELECT * FROM djela
            WHERE umjetnik_id = :umjetnik_id AND uklonjeno_u IS NULL
            ORDER BY trenutak_izrade DESC
        """),
        {"umjetnik_id": trenutni.korisnik.id},
    ).all()

    # Datoteke svih djela dohvaćaju se jednim upitom i grupiraju po djelu.
    datoteke_po_djelu: dict = {}
    if djela:
        datoteke = db.execute(
            text("""
                SELECT id, djelo_id, mime_tip FROM datoteke_djela
                WHERE djelo_id IN :djela_id
                ORDER BY trenutak_prijenosa, id
            """).bindparams(bindparam("djela_id", expanding=True)),
            {"djela_id": [d.id for d in djela]},
        ).all()
        for datoteka in datoteke:
            if datoteka.djelo_id not in datoteke_po_djelu:
                datoteke_po_djelu[datoteka.djelo_id] = []
            datoteke_po_djelu[datoteka.djelo_id].append(datoteka)

    velicine = velicine_datoteka(f"djela/{trenutni.korisnik.id}/")

    artworks = []
    for djelo in djela:
        datoteke_djela = datoteke_po_djelu.get(djelo.id, [])
        artworks.append(u_artwork(djelo, datoteke_djela, velicine))

    # Tekstovi profila mogu biti NULL u bazi, a frontend očekuje string (može biti prazan).
    biografija = ""
    opis_umjetnosti = ""
    if profil is not None:
        if profil.biografija is not None:
            biografija = profil.biografija
        if profil.opis is not None:
            opis_umjetnosti = profil.opis

    return {
        "biography": biografija,
        "artDescription": opis_umjetnosti,
        "artworks": artworks,
    }


@router.patch("/portfolio/profile")
def uredi_profil(
    podaci: ProfilUnos,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    db: Session = Depends(get_db),
):
    if len(podaci.biography) > MAX_DULJINA_TEKSTA or len(podaci.artDescription) > MAX_DULJINA_TEKSTA:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_CONTENT, "predugacak_tekst")

    db.execute(
        text("""
            UPDATE portfolio SET biografija = :biografija, opis = :opis
            WHERE umjetnik_id = :umjetnik_id
        """),
        {
            "biografija": podaci.biography,
            "opis": podaci.artDescription,
            "umjetnik_id": trenutni.korisnik.id,
        },
    )
    db.commit()

    return {"biography": podaci.biography, "artDescription": podaci.artDescription}


# CRUD operacije koje se odnose na djela

@router.post("/artworks", status_code=status.HTTP_201_CREATED)
def novo_djelo(
    data: str = Form(),
    files: list[UploadFile] | None = None,
    trenutni: TrenutniKorisnik = Depends(require_role(Uloga.umjetnik)),
    postavke: PostavkeMedia = Depends(dohvati_postavke_media),
    db: Session = Depends(get_db),
    s3=Depends(get_s3),
    bucket: str = Depends(get_bucket),
):
    podaci = procitaj_unos(data)
    privitci = files or []
    if not privitci:
        raise neispravni_podaci()  # barem jedna datoteka (poslovno pravilo F-UP-2)
    provjeri_privitke(privitci, postavke, postojece=0)

    djelo_id = db.execute(
        text("""
            INSERT INTO djela (umjetnik_id, naziv, godina_nastanka, tehnika, dimenzije, opis, javno)
            VALUES (:umjetnik_id, :naziv, :godina_nastanka, :tehnika, :dimenzije, :opis, :javno)
            RETURNING id
        """),
        {
            "umjetnik_id": trenutni.korisnik.id,
            "naziv": podaci.title,
            "godina_nastanka": podaci.year,
            "tehnika": podaci.technique,
            "dimenzije": podaci.dimensions,
            "opis": podaci.description,
            "javno": podaci.isPublic,
        },
    ).scalar_one()

    spremi_privitke(db, s3, bucket, trenutni.korisnik.id, djelo_id, privitci)

    djelo = db.execute(
        text("SELECT * FROM djela WHERE id = :djelo_id"), {"djelo_id": djelo_id}
    ).first()
    return cijeli_artwork(db, djelo)


@router.get("/artworks/{djelo_id}")
def dohvati_djelo(
    djelo: Row = Depends(vlastito_djelo),
    db: Session = Depends(get_db),
):
    return cijeli_artwork(db, djelo)


@router.put("/artworks/{djelo_id}")
def uredi_djelo(
    data: str = Form(),
    removedFileIds: str = Form("[]"),
    files: list[UploadFile] | None = None,
    djelo: Row = Depends(vlastito_djelo),
    postavke: PostavkeMedia = Depends(dohvati_postavke_media),
    db: Session = Depends(get_db),
    s3=Depends(get_s3),
    bucket: str = Depends(get_bucket),
):
    podaci = procitaj_unos(data)
    privitci = files or []

    # removedFileIds je JSON lista id-eva datoteka koje korisnik želi maknuti s djela.
    try:
        uklonjene = set()
        for datoteka_id in json.loads(removedFileIds):
            uklonjene.add(uuid.UUID(datoteka_id))
    except (ValueError, TypeError):
        raise neispravni_podaci()

    # Podijeli postojeće datoteke djela na one koje ostaju i one koje se brišu.
    postojece = dohvati_datoteke(db, djelo.id)
    preostale = []
    za_brisanje = []
    for datoteka in postojece:
        if datoteka.id in uklonjene:
            za_brisanje.append(datoteka)
        else:
            preostale.append(datoteka)

    if len(preostale) + len(privitci) == 0:
        raise neispravni_podaci()  # djelo mora zadržati barem jednu datoteku
    provjeri_privitke(privitci, postavke, postojece=len(preostale))

    db.execute(
        text("""
            UPDATE djela
            SET naziv = :naziv, godina_nastanka = :godina_nastanka, tehnika = :tehnika,
                dimenzije = :dimenzije, opis = :opis, javno = :javno
            WHERE id = :djelo_id
        """),
        {
            "djelo_id": djelo.id,
            "naziv": podaci.title,
            "godina_nastanka": podaci.year,
            "tehnika": podaci.technique,
            "dimenzije": podaci.dimensions,
            "opis": podaci.description,
            "javno": podaci.isPublic,
        },
    )

    if za_brisanje:
        db.execute(
            text("DELETE FROM datoteke_djela WHERE id IN :datoteke_id").bindparams(
                bindparam("datoteke_id", expanding=True)
            ),
            {"datoteke_id": [d.id for d in za_brisanje]},
        )

    # Commita i UPDATE i DELETE zajedno s novim datotekama.
    spremi_privitke(db, s3, bucket, djelo.umjetnik_id, djelo.id, privitci)

    # S3 objekti uklonjenih datoteka brišu se tek nakon uspješnog commita.
    for datoteka in za_brisanje:
        try:
            s3.delete_object(
                Bucket=bucket,
                Key=kljuc_datoteke_djela(djelo.umjetnik_id, djelo.id, datoteka.id, datoteka.mime_tip),
            )
        except Exception:
            pass  # objekt bez retka u bazi više nije dohvatljiv; ne ruši se zahtjev

    svjeze = db.execute(
        text("SELECT * FROM djela WHERE id = :djelo_id"), {"djelo_id": djelo.id}
    ).first()
    return cijeli_artwork(db, svjeze)


@router.delete("/artworks/{djelo_id}", status_code=status.HTTP_204_NO_CONTENT)
def obrisi_djelo(
    djelo: Row = Depends(vlastito_djelo),
    db: Session = Depends(get_db),
):
    prilike = db.execute(
        text("""
            SELECT DISTINCT pr.id, pr.naziv
            FROM prijave_djela pd
            JOIN prijave p ON p.id = pd.prijava_id
            JOIN prilike pr ON pr.id = p.prilika_id
            WHERE pd.djelo_id = :djelo_id
              AND p.status IN :statusi
              AND pr.uklonjeno_u IS NULL
        """).bindparams(bindparam("statusi", expanding=True)),
        {"djelo_id": djelo.id, "statusi": list(AKTIVNI_STATUSI_PRIJAVE)},
    ).all()
    if prilike:
        # Frontend iz body.opportunities sastavlja poruku s nazivima prilika.
        opportunities = []
        for prilika in prilike:
            opportunities.append({"id": str(prilika.id), "title": prilika.naziv})

        return JSONResponse(
            status_code=status.HTTP_409_CONFLICT,
            content={
                "detail": "djelo_u_aktivnoj_prijavi",
                "opportunities": opportunities,
            },
        )

    # Meko brisanje: djelo može biti referencirano u starim prijavama,
    # a javni pristup datotekama blokira provjeri_pristup_datoteci.
    db.execute(
        text("""
            UPDATE djela SET uklonjeno_u = now(), razlog_uklanjanja = 'uklonio_umjetnik'
            WHERE id = :djelo_id
        """),
        {"djelo_id": djelo.id},
    )
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
