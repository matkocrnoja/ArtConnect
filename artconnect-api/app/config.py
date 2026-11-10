from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_DATOTEKA = Path(__file__).resolve().parent.parent / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_DATOTEKA, extra="ignore", env_ignore_empty=True
    )

    database_url: SecretStr
    db_pool_size: int = 5
    db_max_overflow: int = 10
    google_client_id: str
    google_client_secret: SecretStr
    google_redirect_uri: str
    frontend_url: str
    secret_key: SecretStr = Field(min_length=32)
    cookie_secure: bool = True

    # S3 je opcionalan da aplikacija radi i bez njega; rute za slike tada vraćaju 503.
    s3_bucket: str | None = None
    s3_region: str = "eu-central-1"
    s3_access_key_id: str | None = None
    s3_secret_access_key: SecretStr | None = None
    # Za S3-kompatibilne servise (MinIO, Cloudflare R2...); prazno = AWS
    s3_endpoint_url: str | None = None

    @field_validator("frontend_url")
    @classmethod
    def bez_kose_crte_na_kraju(cls, vrijednost: str) -> str:
        return vrijednost.rstrip("/")


@lru_cache
def get_settings() -> Settings:
    return Settings()
