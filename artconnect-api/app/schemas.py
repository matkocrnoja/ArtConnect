import uuid

from pydantic import BaseModel, ConfigDict, HttpUrl, TypeAdapter, field_validator

MAKS_POVEZNICA = 5

_provjera_url = TypeAdapter(HttpUrl)


class Registracija(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    ime_prezime: str | None = None
    naziv_organizacije: str | None = None
    sifre_podrucja: list[uuid.UUID] = []
    poveznice: list[str] = []

    @field_validator("poveznice")
    @classmethod
    def provjeri_poveznice(cls, vrijednosti: list[str]) -> list[str]:
        poveznice = [poveznica for poveznica in vrijednosti if poveznica]
        if len(poveznice) > MAKS_POVEZNICA:
            raise ValueError(f"Dopušteno je najviše {MAKS_POVEZNICA} poveznica")
        for poveznica in poveznice:
            _provjera_url.validate_python(poveznica)
        return poveznice
