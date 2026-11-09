export interface Korisnik {
  id: string;
  ime_prezime: string;
  email: string;
  uloga: 'umjetnik' | 'organizator' | 'administrator';
  ovjeren?: boolean; // samo za organizatora
}
