import { req_priv } from './client';
import type { Korisnik } from './types';

// Vraća prijavljenog korisnika, ili null ako nitko nije prijavljen.
export async function dohvatiKorisnika(): Promise<Korisnik | null> {
  try {
    const odgovor = await req_priv('/auth/me');
    return odgovor.ok ? await odgovor.json() : null;
  } catch {
    return null;
  }
}

export async function odjavi(): Promise<void> {
  try {
    await req_priv('/auth/logout', { method: 'POST' });
  } catch {
    // Ako backend nije dostupan, korisnika svejedno vodimo na početnu.
  }
}

// Vraća Googleovu adresu na koju treba preusmjeriti preglednik, ili poruku greške.
// Mora biti req_priv: odgovor postavlja kolačić koji Google prijava treba pri povratku.
export async function prijavi(uloga: Korisnik['uloga']): Promise<{ url: string } | { greska: string }> {
  try {
    const odgovor = await req_priv('/auth/prijava', { method: 'POST', body: { uloga } });
    if (odgovor.ok) return await odgovor.json();
    return { greska: 'Prijava nije uspjela. Pokušaj ponovno.' };
  } catch {
    return { greska: 'Poslužitelj nije dostupan. Pokušaj ponovno.' };
  }
}

const PORUKE: Record<string, string> = {
  registracija_istekla: 'Registracija je istekla. Ponovno se prijavi preko Googlea.',
  ime_obavezno: 'Ime je obavezno.',
  prezime_obavezno: 'Prezime je obavezno.',
  vec_registriran: 'Ovaj Google račun je već registriran.',
  podrucje_obavezno: 'Odaberi barem jedno područje.',
  neispravno_podrucje: 'Odabrano područje više nije dostupno.',
  previse_poveznica: 'Dopušteno je najviše 5 poveznica.',
  neispravna_poveznica: 'Poveznica mora biti puna adresa, npr. https://primjer.hr.',
  naziv_organizacije_obavezan: 'Naziv organizacije je obavezan.',
};

// Vraća poruku greške, ili null ako je registracija uspjela.
export async function registriraj(podaci: object): Promise<string | null> {
  try {
    const odgovor = await req_priv('/auth/register', { method: 'POST', body: podaci });
    if (odgovor.ok) return null;

    const { detail } = await odgovor.json();
    return PORUKE[detail] ?? 'Registracija nije uspjela.';
  } catch {
    return 'Poslužitelj nije dostupan. Pokušaj ponovno.';
  }
}
