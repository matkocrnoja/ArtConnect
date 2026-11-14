// Backend vraća greške kao { detail: "kod_greske" }; ovdje se kodovi prevode u poruke.
// Zajedničko za registraciju i spremanje profila jer obje koriste ista pravila.
const PORUKE: Record<string, string> = {
  registracija_istekla: 'Registracija je istekla. Ponovno se prijavi preko Googlea.',
  nije_prijavljen: 'Nisi prijavljen. Ponovno se prijavi.',
  sesija_istekla: 'Sesija je istekla. Ponovno se prijavi.',
  zabranjen_pristup: 'Nemaš pravo na ovu radnju.',
  ime_obavezno: 'Ime je obavezno.',
  prezime_obavezno: 'Prezime je obavezno.',
  ime_neispravno: 'Ime smije sadržavati samo slova i razmake.',
  prezime_neispravno: 'Prezime smije sadržavati samo slova i razmake.',
  ime_prezime_obavezno: 'Ime i prezime je obavezno.',
  ime_prezime_neispravno: 'Ime i prezime smije sadržavati samo slova i razmake.',
  ime_prezime_predugo: 'Ime i prezime smije imati najviše 100 znakova.',
  vec_registriran: 'Ovaj Google račun je već registriran.',
  podrucje_obavezno: 'Odaberi barem jedno područje.',
  neispravno_podrucje: 'Odabrano područje više nije dostupno.',
  previse_podrucja: 'Dopušteno je najviše 20 područja.',
  previse_poveznica: 'Dopušteno je najviše 5 poveznica.',
  neispravna_poveznica: 'Poveznica mora biti puna adresa, npr. https://primjer.hr.',
  naziv_organizacije_obavezan: 'Naziv organizacije je obavezan.',
  naziv_organizacije_predug: 'Naziv organizacije smije imati najviše 200 znakova.',
};

// Iz neuspjelog odgovora pročita kod greške i vrati poruku (ili zadanu ako je kod nepoznat).
export async function porukaGreske(odgovor: Response, zadana: string): Promise<string> {
  try {
    const { detail } = await odgovor.json();
    return (typeof detail === 'string' && PORUKE[detail]) || zadana;
  } catch {
    return zadana;
  }
}
