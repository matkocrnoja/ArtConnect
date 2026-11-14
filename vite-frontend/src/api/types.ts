export interface Korisnik {
  id: string;
  ime_prezime: string;
  email: string;
  uloga: 'umjetnik' | 'organizator' | 'administrator';
  ovjeren?: boolean; // samo za organizatora
}

export interface PostavkeMedia {
  mime_types: string[];
  max_velicina_datoteke_mb: number,
  max_datoteka_po_djelu: number
  max_privitaka_po_prilici: number
}
