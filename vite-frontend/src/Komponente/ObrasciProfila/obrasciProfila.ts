import type { FormErrors } from "@mantine/form";
import type { PodaciOrganizatora, PodaciUmjetnika } from "../../api/profil";

// Pravila obrazaca profila za registraciju i stranicu Postavke.
// Backend provjerava ista pravila (app/profil.py); ovdje služe za brzu povratnu informaciju.

export const MAKS_POVEZNICA = 5; // mora odgovarati MAKS_POVEZNICA na backendu

// ---------- ime ----------

// Isto kao backend: NFC spaja rastavljene znakove (c + kvačica -> č), razmaci se svode na jedan.
export function normalizirajIme(vrijednost: string): string {
    return vrijednost.normalize("NFC").trim().replace(/\s+/g, " ");
}

// Samo slova (\p{L} = svako Unicode slovo, uključujući č, ć, š, ž, đ) i po jedan razmak između riječi.
const SAMO_SLOVA = /^\p{L}+( \p{L}+)*$/u;

export function jeIspravnoIme(vrijednost: string): boolean {
    return SAMO_SLOVA.test(normalizirajIme(vrijednost));
}

function provjeriIme(vrijednost: string, porukaPrazno: string): string | null {
    if (!normalizirajIme(vrijednost)) return porukaPrazno;
    if (!jeIspravnoIme(vrijednost)) return "Dozvoljena su samo slova i razmaci";
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
    dodaj(greske, "ime", provjeriIme(v.ime, "Ime je obavezno"));
    dodaj(greske, "prezime", provjeriIme(v.prezime, "Prezime je obavezno"));
    validirajDjelovanje(v, greske);
    return greske;
}

export function validirajOrganizatora(v: VrijednostiOrganizatora): FormErrors {
    const greske: FormErrors = {};
    dodaj(greske, "ime", provjeriIme(v.ime, "Ime je obavezno"));
    dodaj(greske, "prezime", provjeriIme(v.prezime, "Prezime je obavezno"));
    if (!v.nazivOrganizacije.trim()) greske.nazivOrganizacije = "Naziv organizacije je obavezan";
    return greske;
}

// Tijelo zahtjeva POST /auth/register
export function uPodatkeUmjetnika(v: VrijednostiUmjetnika) {
    return {
        ime: normalizirajIme(v.ime),
        prezime: normalizirajIme(v.prezime),
        sifre_podrucja: v.podrucja,
        poveznice: ocistiPoveznice(v.poveznice),
    };
}

export function uPodatkeOrganizatora(v: VrijednostiOrganizatora) {
    return {
        ime: normalizirajIme(v.ime),
        prezime: normalizirajIme(v.prezime),
        naziv_organizacije: v.nazivOrganizacije,
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
    dodaj(greske, "imePrezime", provjeriIme(v.imePrezime, "Ime i prezime je obavezno"));
    validirajDjelovanje(v, greske);
    return greske;
}

export function validirajPostavkeOrganizatora(v: VrijednostiPostavkiOrganizatora): FormErrors {
    const greske: FormErrors = {};
    dodaj(greske, "imePrezime", provjeriIme(v.imePrezime, "Ime i prezime je obavezno"));
    if (!v.nazivOrganizacije.trim()) greske.nazivOrganizacije = "Naziv organizacije je obavezan";
    return greske;
}

// Tijela zahtjeva PUT /artists/me i PUT /organizers/me
export function uPodatkePostavkiUmjetnika(v: VrijednostiPostavkiUmjetnika): PodaciUmjetnika {
    return {
        ime_prezime: normalizirajIme(v.imePrezime),
        sifre_podrucja: v.podrucja,
        poveznice: ocistiPoveznice(v.poveznice),
    };
}

export function uPodatkePostavkiOrganizatora(v: VrijednostiPostavkiOrganizatora): PodaciOrganizatora {
    return {
        ime_prezime: normalizirajIme(v.imePrezime),
        naziv_organizacije: v.nazivOrganizacije,
    };
}
