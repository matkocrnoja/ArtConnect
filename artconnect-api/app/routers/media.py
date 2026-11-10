import mimetypes
import uuid
from dataclasses import dataclass

from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.s3storage import get_bucket, get_s3

router = APIRouter(prefix="/media", tags=["media"])

# Dohvat postavki koje definiraju šta zapravo smije doći na bucket
# Određuje ih administrator, ali žive u bazi podataka

@dataclass
class PostavkeMedia:
    mime_types: list[str]
    max_velicina_datoteke_mb: int
    max_datoteka_po_djelu: int
    max_privitaka_po_prilici: int

@router.get("/settings", status_code=status.HTTP_200_OK)
def dohvati_postavke_media(db: Session = Depends(get_db)) -> PostavkeMedia:
    redovi = db.execute(
        text("""
            SELECT kljuc, vrijednost FROM postavke_sustava
            WHERE kljuc IN ('mime_types', 'max_velicina_datoteke_mb',
                            'max_datoteka_po_djelu', 'max_privitaka_po_prilici')
        """)
    )
    postavke = {r.kljuc: r.vrijednost for r in redovi}

    return PostavkeMedia(
        # mime_types je npr. "image/png,image/jpeg,image/webp"
        mime_types=[t.strip() for t in postavke["mime_types"].split(",") if t.strip()],
        max_velicina_datoteke_mb=int(postavke["max_velicina_datoteke_mb"]),
        max_datoteka_po_djelu=int(postavke["max_datoteka_po_djelu"]),
        max_privitaka_po_prilici=int(postavke["max_privitaka_po_prilici"]),
    )

# POST metoda za objavu datoteka u bucket
@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_privitaka(
    privitci: list[UploadFile],
    postavke: PostavkeMedia = Depends(dohvati_postavke_media), # Dohvacanje limita za datoteke
    s3=Depends(get_s3), # Dohvat S3 wrappera
    bucket: str = Depends(get_bucket), # Dohvat samog bucketa
):

    direktorij="/uploadane_slike"
    # Konkretna implementacija:
    # direktorij = "/djela/{umjetnik.umjetnik_id}/{djelo_id}"
    # umjetnik_id zaključiti na temelju pošiljatelja zahtjeva
    # djelo_id na temelju body.djelo_id
    # (utvrditi da djelo_id u tijelu UISTINU pripada umjetniku prije nastavka dalje!!!)

    # Provjera zadovoljavaju li datoteke limite
    if len(privitci) > postavke.max_datoteka_po_djelu:
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

    # Ako smo došli do ovdje, sve datoteke zadovoljavaju limite
    kljucevi = []
    for privitak in privitci:
        extension = mimetypes.guess_extension(privitak.content_type) or "." + privitak.content_type.split("/")[-1]
        # Kako guess_extension na win64 sustavima za content_type="image/webp" vraća None
        # napravljen je fallback koji "image/webp" rastavlja na listu ["image", "webp"] i bira
        # zadnji dio (-1.) liste - što je upravo "webp"

        identifikator = uuid.uuid4();
        # Konkretna implementacija:
        # identifikator = izvrši(INSERT INTO datoteke_djela (djelo_id, mime_tip) RETURNING id).rezultat["id"]

        kljuc = direktorij + f"/{identifikator}{extension}"
        s3.upload_fileobj(
            privitak.file, bucket, kljuc, ExtraArgs={"ContentType": privitak.content_type}
        )
        kljucevi.append(kljuc);
    return {"kljucevi": kljucevi}
        # https://docs.aws.amazon.com/boto3/latest/reference/services/s3/client/upload_fileobj.html

# :path govori FastAPI-ju da ovaj parametar sadrži generalno višestruko znakova "/"
@router.get("/get_file/{kljuc:path}")
def dohvati_datoteku(
    kljuc: str,
    s3=Depends(get_s3),
    bucket: str = Depends(get_bucket),
):
    try:
        objekt = s3.get_object(Bucket=bucket, Key=kljuc)
    except ClientError as e:
        if e.response["Error"]["Code"] in ("NoSuchKey", "404"):
            raise HTTPException(status.HTTP_404_NOT_FOUND, "datoteka_ne_postoji")
        raise
    return StreamingResponse(
        objekt["Body"].iter_chunks(), media_type=objekt["ContentType"]
    )

# Privremena helper GET metoda za dohvat liste direktorija
# @router.get("/getdirs")
# def s3_ls(
#     s3=Depends(get_s3),
#     bucket: str = Depends(get_bucket),
# ):
#     paginator = s3.get_paginator("list_objects_v2")
#     stranice = paginator.paginate(Bucket=bucket, Delimiter="/")
#     direktoriji = []
#     for prefix in stranice.search("CommonPrefixes"):
#         # search vraca None ako bucket nema nijedan direktorij
#         if prefix:
#             direktoriji.append(prefix["Prefix"])

#     return direktoriji

