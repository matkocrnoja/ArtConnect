import { req, req_priv } from './client';
import { porukaGreske } from './poruke';
import type { Podrucje, ProfilOrganizatora, ProfilUmjetnika } from './types';

const NEDOSTUPAN = 'Poslužitelj nije dostupan. Pokušaj ponovno.';

// Uspjeh vraća { profil }, neuspjeh { greska } s porukom za prikaz korisniku.
export type Rezultat<T> = { profil: T } | { greska: string };

async function posalji<T>(putanja: string, zadanaGreska: string, body?: unknown): Promise<Rezultat<T>> {
  try {
    const odgovor = await req_priv(putanja, body === undefined ? {} : { method: 'PUT', body });
    if (odgovor.ok) return { profil: await odgovor.json() };
    return { greska: await porukaGreske(odgovor, zadanaGreska) };
  } catch {
    return { greska: NEDOSTUPAN };
  }
}

// Javni popis aktivnih područja (isti koji koristi registracija).
export async function dohvatiPodrucja(): Promise<Podrucje[]> {
  const odgovor = await req('/podrucja');
  if (!odgovor.ok) throw new Error('Područja nije moguće učitati');
  return odgovor.json();
}

// Tijela PUT zahtjeva. ime_prezime se sprema izravno, bez dijeljenja na ime i prezime.
export interface PodaciUmjetnika {
  ime_prezime: string;
  sifre_podrucja: string[];
  poveznice: string[];
}

export interface PodaciOrganizatora {
  ime_prezime: string;
  naziv_organizacije: string;
}

export function dohvatiProfilUmjetnika(): Promise<Rezultat<ProfilUmjetnika>> {
  return posalji('/artists/me', 'Profil nije moguće učitati.');
}

export function spremiProfilUmjetnika(podaci: PodaciUmjetnika): Promise<Rezultat<ProfilUmjetnika>> {
  return posalji('/artists/me', 'Spremanje nije uspjelo.', podaci);
}

export function dohvatiProfilOrganizatora(): Promise<Rezultat<ProfilOrganizatora>> {
  return posalji('/organizers/me', 'Profil nije moguće učitati.');
}

export function spremiProfilOrganizatora(podaci: PodaciOrganizatora): Promise<Rezultat<ProfilOrganizatora>> {
  return posalji('/organizers/me', 'Spremanje nije uspjelo.', podaci);
}
