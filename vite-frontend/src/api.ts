export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

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
