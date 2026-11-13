import type { FormErrors } from "@mantine/form";
import type { PodaciOrganizatora, PodaciUmjetnika } from "../../api/profil";

// Pravila obrazaca profila za registraciju i stranicu Postavke.
// Backend provjerava ista pravila (app/profil.py); ovdje služe za brzu povratnu informaciju.

// Moraju odgovarati istoimenim konstantama u app/profil.py.
export const MAKS_POVEZNICA = 5;
export const MAKS_PODRUCJA = 20;
export const MAKS_DULJINA_IMENA = 100; // cijeli ime_prezime (pri registraciji: ime + razmak + prezime)
export const MAKS_DULJINA_NAZIVA = 200; // naziv organizacije

// ---------- ime i naziv organizacije ----------

// Isto kao backend: NFC spaja rastavljene znakove (c + kvačica -> č), razmaci se svode na jedan.
// Koristi se za ime i prezime i za naziv organizacije.
export function normalizirajTekst(vrijednost: string): string {
    return vrijednost.normalize("NFC").trim().replace(/\s+/g, " ");
}

// Samo slova (\p{L} = svako Unicode slovo, uključujući č, ć, š, ž, đ) i po jedan razmak između riječi.
const SAMO_SLOVA = /^\p{L}+( \p{L}+)*$/u;

export function jeIspravnoIme(vrijednost: string): boolean {
    return SAMO_SLOVA.test(normalizirajTekst(vrijednost));
}

function provjeriIme(vrijednost: string, porukaPrazno: string): string | null {
    if (!normalizirajTekst(vrijednost)) return porukaPrazno;
    if (!jeIspravnoIme(vrijednost)) return "Dozvoljena su samo slova i razmaci";
    return null;
}

// Duljina nakon normalizacije, u Unicode znakovima kao Pythonov len().
// (.length broji UTF-16 jedinice, pa bi npr. emoji u nazivu brojao kao dva znaka.)
function duljina(vrijednost: string): number {
    return [...normalizirajTekst(vrijednost)].length;
}

const PREDUGO_IME = `Ime i prezime smije imati najviše ${MAKS_DULJINA_IMENA} znakova`;

// Postavke: jedno polje "Ime i prezime".
function provjeriPunoIme(vrijednost: string): string | null {
    const greska = provjeriIme(vrijednost, "Ime i prezime je obavezno");
    if (greska) return greska;
    return duljina(vrijednost) > MAKS_DULJINA_IMENA ? PREDUGO_IME : null;
}

// Registracija: ograničenje vrijedi za spojeni "ime prezime" (tako se sprema u bazu),
// a greška se prikazuje uz polje Prezime.
function validirajImeIPrezime(v: { ime: string; prezime: string }, greske: FormErrors) {
    dodaj(greske, "ime", provjeriIme(v.ime, "Ime je obavezno"));
    dodaj(greske, "prezime", provjeriIme(v.prezime, "Prezime je obavezno"));
    if (!greske.ime && !greske.prezime && duljina(`${v.ime} ${v.prezime}`) > MAKS_DULJINA_IMENA) {
        greske.prezime = `Ime i prezime zajedno smiju imati najviše ${MAKS_DULJINA_IMENA} znakova`;
    }
}

// Naziv smije sadržavati brojeve i znakove ("Studio 54"), pa nema pravila "samo slova".
function provjeriNazivOrganizacije(vrijednost: string): string | null {
    if (!normalizirajTekst(vrijednost)) return "Naziv organizacije je obavezan";
    if (duljina(vrijednost) > MAKS_DULJINA_NAZIVA) {
        return `Naziv organizacije smije imati najviše ${MAKS_DULJINA_NAZIVA} znakova`;
    }
    return null;
}

// Mantine prihvaća objekt grešaka po putanjama; polja bez greške se izostavljaju.
function dodaj(greske: FormErrors, putanja: string, poruka: string | null) {
    if (poruka) greske[putanja] = poruka;
}

// ---------- područja i poveznice (zajedničko registraciji i postavkama umjetnika) ----------

interface Djelovanje {
    podrucja: string[]; // šifre odabranih područja
    poveznice: string[];
}

export function jeIspravanUrl(vrijednost: string): boolean {
    try {
        const url = new URL(vrijednost);
        return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
    } catch {
        return false;
    }
}

// Ključ "poveznice.2" prikazuje grešku točno uz treću poveznicu. Prazna polja se preskaču.
function validirajDjelovanje(v: Djelovanje, greske: FormErrors) {
    if (v.podrucja.length === 0) greske.podrucja = "Odaberi barem jedno područje";
    else if (v.podrucja.length > MAKS_PODRUCJA) greske.podrucja = `Odaberi najviše ${MAKS_PODRUCJA} područja`;
    v.poveznice.forEach((poveznica, i) => {
        const p = poveznica.trim();
        if (p && !jeIspravanUrl(p)) greske[`poveznice.${i}`] = "Unesi punu adresu, npr. https://primjer.hr";
    });
}

function ocistiPoveznice(poveznice: string[]): string[] {
    return poveznice.map((p) => p.trim()).filter(Boolean);
}

// ---------- registracija: zasebna polja ime i prezime ----------

export interface VrijednostiUmjetnika extends Djelovanje {
    ime: string;
    prezime: string;
}

export interface VrijednostiOrganizatora {
    ime: string;
    prezime: string;
    nazivOrganizacije: string;
}

export const prazanUmjetnik: VrijednostiUmjetnika = { ime: "", prezime: "", podrucja: [], poveznice: [] };
export const prazanOrganizator: VrijednostiOrganizatora = { ime: "", prezime: "", nazivOrganizacije: "" };

export function validirajUmjetnika(v: VrijednostiUmjetnika): FormErrors {
    const greske: FormErrors = {};
    validirajImeIPrezime(v, greske);
    validirajDjelovanje(v, greske);
    return greske;
}

export function validirajOrganizatora(v: VrijednostiOrganizatora): FormErrors {
    const greske: FormErrors = {};
    validirajImeIPrezime(v, greske);
    dodaj(greske, "nazivOrganizacije", provjeriNazivOrganizacije(v.nazivOrganizacije));
    return greske;
}

// Tijelo zahtjeva POST /auth/register
export function uPodatkeUmjetnika(v: VrijednostiUmjetnika) {
    return {
        ime: normalizirajTekst(v.ime),
        prezime: normalizirajTekst(v.prezime),
        sifre_podrucja: v.podrucja,
        poveznice: ocistiPoveznice(v.poveznice),
    };
}

export function uPodatkeOrganizatora(v: VrijednostiOrganizatora) {
    return {
        ime: normalizirajTekst(v.ime),
        prezime: normalizirajTekst(v.prezime),
        naziv_organizacije: normalizirajTekst(v.nazivOrganizacije),
    };
}

// ---------- postavke: jedno polje "Ime i prezime" ----------

export interface VrijednostiPostavkiUmjetnika extends Djelovanje {
    imePrezime: string;
}

export interface VrijednostiPostavkiOrganizatora {
    imePrezime: string;
    nazivOrganizacije: string;
}

export function validirajPostavkeUmjetnika(v: VrijednostiPostavkiUmjetnika): FormErrors {
    const greske: FormErrors = {};
    dodaj(greske, "imePrezime", provjeriPunoIme(v.imePrezime));
    validirajDjelovanje(v, greske);
    return greske;
}

export function validirajPostavkeOrganizatora(v: VrijednostiPostavkiOrganizatora): FormErrors {
    const greske: FormErrors = {};
    dodaj(greske, "imePrezime", provjeriPunoIme(v.imePrezime));
    dodaj(greske, "nazivOrganizacije", provjeriNazivOrganizacije(v.nazivOrganizacije));
    return greske;
}

// Tijela zahtjeva PUT /artists/me i PUT /organizers/me
export function uPodatkePostavkiUmjetnika(v: VrijednostiPostavkiUmjetnika): PodaciUmjetnika {
    return {
        ime_prezime: normalizirajTekst(v.imePrezime),
        sifre_podrucja: v.podrucja,
        poveznice: ocistiPoveznice(v.poveznice),
    };
}

export function uPodatkePostavkiOrganizatora(v: VrijednostiPostavkiOrganizatora): PodaciOrganizatora {
    return {
        ime_prezime: normalizirajTekst(v.imePrezime),
        naziv_organizacije: normalizirajTekst(v.nazivOrganizacije),
    };
}
