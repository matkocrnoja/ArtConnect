from functools import lru_cache

import boto3
from fastapi import HTTPException, status

from app.config import get_settings

@lru_cache
def get_s3():
    postavke = get_settings()
    if not postavke.s3_bucket:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "s3_nije_konfiguriran")

    tajni_kljuc = postavke.s3_secret_access_key
    return boto3.client(
        "s3",
        region_name=postavke.s3_region,
        endpoint_url=postavke.s3_endpoint_url,
        aws_access_key_id=postavke.s3_access_key_id,
        aws_secret_access_key=tajni_kljuc.get_secret_value() if tajni_kljuc else None,
    )


def get_bucket() -> str:
    get_s3()  # baca 503 ako S3 nije konfiguriran
    return get_settings().s3_bucket
