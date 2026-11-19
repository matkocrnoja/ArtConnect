from dataclasses import dataclass

from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy import Row, text
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware import provjeri_pristup_datoteci, provjeri_vlasnistvo_djela
from app.s3storage import get_bucket, get_s3, kljuc_datoteke_djela

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
    djelo: Row = Depends(provjeri_vlasnistvo_djela),
    postavke: PostavkeMedia = Depends(dohvati_postavke_media), # Dohvacanje limita za datoteke
    db: Session = Depends(get_db),
    s3=Depends(get_s3), # Dohvat S3 wrappera
    bucket: str = Depends(get_bucket), # Dohvat samog bucketa
):
    postojece = db.execute(
        text("SELECT count(*) FROM datoteke_djela WHERE djelo_id = :djelo_id"),
        {"djelo_id": djelo.id},
    ).scalar_one()

    # Provjera zadovoljavaju li datoteke limite
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

    # Ako smo došli do ovdje, sve datoteke zadovoljavaju limite
    kljucevi = []
    datoteke = []
    try:
        for privitak in privitci:
            datoteka_id = db.execute(
                text("""
                    INSERT INTO datoteke_djela (djelo_id, mime_tip)
                    VALUES (:djelo_id, :mime_tip)
                    RETURNING id
                """),
                {"djelo_id": djelo.id, "mime_tip": privitak.content_type},
            ).scalar_one()

            kljuc = kljuc_datoteke_djela(
                djelo.umjetnik_id, djelo.id, datoteka_id, privitak.content_type
            )
            s3.upload_fileobj(
                privitak.file, bucket, kljuc, ExtraArgs={"ContentType": privitak.content_type}
            )
            # https://docs.aws.amazon.com/boto3/latest/reference/services/s3/client/upload_fileobj.html
            kljucevi.append(kljuc)
            datoteke.append({
                "id": datoteka_id,
                "poveznica": f"/media/djela/{djelo.umjetnik_id}/{djelo.id}/{datoteka_id}",
            })
        db.commit()
    except Exception:
        db.rollback()
        for kljuc in kljucevi:
            s3.delete_object(Bucket=bucket, Key=kljuc)
        raise

    return {"djelo_id": djelo.id, "datoteke": datoteke}


@router.get("/djela/{umjetnik_id}/{djelo_id}/{datoteka_id}")
def dohvati_datoteku(
    kljuc: str = Depends(provjeri_pristup_datoteci),
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

