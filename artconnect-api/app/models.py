import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Table, Text, func, text
from sqlalchemy.dialects.postgresql import ARRAY, ENUM
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


# Modeli opisuju tablice koje već postoje u bazi. Shemu ne stvaramo iz koda (bez create_all).
class Base(DeclarativeBase):
    type_annotation_map = {
        str: Text,
        datetime: DateTime(timezone=True),
    }


class StatusRacuna(enum.Enum):
    aktivan = "aktivan"
    blokiran = "blokiran"


class Uloga(enum.Enum):
    umjetnik = "umjetnik"
    organizator = "organizator"
    administrator = "administrator"


status_racuna_tip = ENUM(StatusRacuna, name="status_racuna", create_type=False)


class KorisnikMixin:
    google_subject_id: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str]
    ime_prezime: Mapped[str]
    trenutak_izrade: Mapped[datetime] = mapped_column(server_default=func.now())


umjetnici_podrucja = Table(
    "umjetnici_podrucja",
    Base.metadata,
    Column("umjetnik_id", ForeignKey("umjetnici.id"), primary_key=True),
    Column("sifra_podrucja", ForeignKey("podrucja_djelovanja.sifra_podrucja"), primary_key=True),
)


class PodrucjeDjelovanja(Base):
    __tablename__ = "podrucja_djelovanja"

    sifra_podrucja: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    naziv_podrucja: Mapped[str] = mapped_column(unique=True)
    aktivno: Mapped[bool] = mapped_column(server_default=text("true"))


class Portfolio(Base):
    __tablename__ = "portfolio"

    umjetnik_id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    biografija: Mapped[str | None]
    opis: Mapped[str | None]


class Umjetnik(KorisnikMixin, Base):
    __tablename__ = "umjetnici"

    # id je strani ključ na portfolio, pa se portfolio mora upisati prvi i on određuje id.
    id: Mapped[uuid.UUID] = mapped_column(ForeignKey("portfolio.umjetnik_id"), primary_key=True)
    poveznice: Mapped[list[str]] = mapped_column(ARRAY(Text), server_default=text("'{}'"))
    status_racuna: Mapped[StatusRacuna] = mapped_column(
        status_racuna_tip, server_default=text("'aktivan'")
    )

    portfolio: Mapped[Portfolio] = relationship()
    podrucja: Mapped[list[PodrucjeDjelovanja]] = relationship(secondary=umjetnici_podrucja)


class Organizator(KorisnikMixin, Base):
    __tablename__ = "organizatori"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    naziv_organizacije: Mapped[str]
    ovjeren: Mapped[bool] = mapped_column(server_default=text("false"))
    status_racuna: Mapped[StatusRacuna] = mapped_column(
        status_racuna_tip, server_default=text("'aktivan'")
    )


class Administrator(KorisnikMixin, Base):
    __tablename__ = "administratori"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)


MODELI_ULOGA = {
    Uloga.umjetnik: Umjetnik,
    Uloga.organizator: Organizator,
    Uloga.administrator: Administrator,
}


class PostavkaSustava(Base):
    __tablename__ = "postavke_sustava"

    kljuc: Mapped[str] = mapped_column(primary_key=True)
    vrijednost: Mapped[str]
