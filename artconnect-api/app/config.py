from functools import lru_cache

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", env_ignore_empty=True)

    google_client_id: str
    google_client_secret: SecretStr
    google_redirect_uri: str
    frontend_url: str
    secret_key: SecretStr = Field(min_length=32)
    cookie_secure: bool = True

    @field_validator("frontend_url")
    @classmethod
    def bez_kose_crte_na_kraju(cls, vrijednost: str) -> str:
        return vrijednost.rstrip("/")


@lru_cache
def get_settings() -> Settings:
    return Settings()
