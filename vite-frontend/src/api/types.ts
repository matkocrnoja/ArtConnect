export interface Korisnik {
  id: string;
  ime_prezime: string;
  email: string;
  uloga: 'umjetnik' | 'organizator' | 'administrator';
  ovjeren?: boolean; // samo za organizatora
}

export interface Podrucje {
  sifra_podrucja: string;
  naziv_podrucja: string;
  aktivno?: boolean; // samo u profilu umjetnika (GET /artists/me)
}

// Odgovor GET/PUT /artists/me
export interface ProfilUmjetnika {
  id: string;
  ime_prezime: string;
  email: string;
  podrucja: Podrucje[];
  poveznice: string[];
}

// Odgovor GET/PUT /organizers/me
export interface ProfilOrganizatora {
  id: string;
  ime_prezime: string;
  email: string;
  naziv_organizacije: string;
  ovjeren: boolean;
}

export interface PostavkeMedia {
  mime_types: string[];
  max_velicina_datoteke_mb: number,
  max_datoteka_po_djelu: number
  max_privitaka_po_prilici: number
}
