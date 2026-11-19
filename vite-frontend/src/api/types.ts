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

// Ime izvorne datoteke se ne pohranjuje; datoteku identificira id (S3 ključ),
// a veličinu backend čita iz S3 (0 ako S3 trenutno nije dostupan).
export type ArtworkFile = {
  id: string;
  mimeType: string; // npr. "image/png", "application/pdf" (ovisi o postavkama sustava)
  sizeBytes: number;
  url: string;
};

export type Artwork = {
  id: string;
  title: string;
  year: number | null;
  technique: string | null;
  dimensions: string | null;
  description: string | null;
  isPublic: boolean;
  files: ArtworkFile[];
  createdAt: string;
};

export type Portfolio = {
  biography: string;       // max 2000, može biti ""
  artDescription: string;  // max 2000, može biti ""
  artworks: Artwork[];
};

export type UploadLimits = {
  maxFilesPerArtwork: number;
  maxFileSizeMb: number;
};

// Podaci djela koje umjetnik unosi
export type ArtworkInput = {
  title: string;
  year: number | null;
  technique: string | null;
  dimensions: string | null;
  description: string | null;
  isPublic: boolean;
};

