export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface Korisnik {
  id: string;
  ime_prezime: string;
  email: string;
  uloga: 'umjetnik' | 'organizator' | 'administrator';
  ovjeren?: boolean; // samo za organizatora
}

// Vraća prijavljenog korisnika, ili null ako nitko nije prijavljen.
export async function dohvatiKorisnika(): Promise<Korisnik | null> {
  try {
    const odgovor = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
    return odgovor.ok ? await odgovor.json() : null;
  } catch {
    return null;
  }
}

export async function odjavi(): Promise<void> {
  try {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch {
    // Ako backend nije dostupan, korisnika svejedno vodimo na početnu.
  }
}

const PORUKE: Record<string, string> = {
  registracija_istekla: 'Registracija je istekla. Ponovno se prijavi preko Googlea.',
  ime_obavezno: 'Ime je obavezno.',
  prezime_obavezno: 'Prezime je obavezno.',
  vec_registriran:'Ovaj Google račun je već registriran.',
  podrucje_obavezno: 'Odaberi barem jedno područje.',
  neispravno_podrucje: 'Odabrano područje više nije dostupno.',
  previse_poveznica: 'Dopušteno je najviše 5 poveznica.',
  neispravna_poveznica: 'Poveznica mora biti puna adresa, npr. https://primjer.hr.',
  naziv_organizacije_obavezan: 'Naziv organizacije je obavezan.',
};

// Vraća poruku greške, ili null ako je registracija uspjela.
export async function registriraj(podaci: object): Promise<string | null> {
  try {
    const odgovor = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(podaci),
    });
    if (odgovor.ok) return null;

    const { detail } = await odgovor.json();
    return PORUKE[detail] ?? 'Registracija nije uspjela.';
  } catch {
    return 'Poslužitelj nije dostupan. Pokušaj ponovno.';
  }
}
