import type { FormErrors } from "@mantine/form";
import type { PodaciOrganizatora, PodaciUmjetnika } from "../../api/profil";

// Pravila obrazaca profila, zajednička za registraciju i stranicu Postavke.
// Backend provjerava ista pravila (app/profil.py); ovdje služe za brzu povratnu informaciju.

export const MAKS_POVEZNICA = 5; // mora odgovarati MAKS_POVEZNICA na backendu

export interface VrijednostiUmjetnika {
    ime: string;
    prezime: string;
    podrucja: string[]; // šifre odabranih područja
    poveznice: string[];
}

export interface VrijednostiOrganizatora {
    ime: string;
    prezime: string;
    nazivOrganizacije: string;
}

export const prazanUmjetnik: VrijednostiUmjetnika = { ime: "", prezime: "", podrucja: [], poveznice: [] };
export const prazanOrganizator: VrijednostiOrganizatora = { ime: "", prezime: "", nazivOrganizacije: "" };

// Odgovara backendovom HttpUrl: puna adresa s http ili https protokolom.
export function jeIspravanUrl(vrijednost: string): boolean {
    try {
        const url = new URL(vrijednost);
        return (url.protocol === "http:" || url.protocol === "https:") && url.hostname !== "";
    } catch {
        return false;
    }
}

// Ključevi su putanje polja ("poveznice.2"), pa se greška prikazuje uz točno to polje.
export function validirajUmjetnika(v: VrijednostiUmjetnika): FormErrors {
    const greske: FormErrors = {};
    if (!v.ime.trim()) greske.ime = "Ime je obavezno";
    if (!v.prezime.trim()) greske.prezime = "Prezime je obavezno";
    if (v.podrucja.length === 0) greske.podrucja = "Odaberi barem jedno područje";
    v.poveznice.forEach((poveznica, i) => {
        const p = poveznica.trim();
        if (p && !jeIspravanUrl(p)) greske[`poveznice.${i}`] = "Unesi punu adresu, npr. https://primjer.hr";
    });
    return greske;
}

export function validirajOrganizatora(v: VrijednostiOrganizatora): FormErrors {
    const greske: FormErrors = {};
    if (!v.ime.trim()) greske.ime = "Ime je obavezno";
    if (!v.prezime.trim()) greske.prezime = "Prezime je obavezno";
    if (!v.nazivOrganizacije.trim()) greske.nazivOrganizacije = "Naziv organizacije je obavezan";
    return greske;
}

// Vrijednosti obrasca -> tijelo zahtjeva. Prazna polja poveznica se zanemaruju.
export function uPodatkeUmjetnika(v: VrijednostiUmjetnika): PodaciUmjetnika {
    return {
        ime: v.ime,
        prezime: v.prezime,
        sifre_podrucja: v.podrucja,
        poveznice: v.poveznice.map((p) => p.trim()).filter(Boolean),
    };
}

export function uPodatkeOrganizatora(v: VrijednostiOrganizatora): PodaciOrganizatora {
    return { ime: v.ime, prezime: v.prezime, naziv_organizacije: v.nazivOrganizacije };
}
