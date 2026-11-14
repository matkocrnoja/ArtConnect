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

export type OpportunityStatus =
  | "PRIPREMA"    // "Priprema"
  | "OTVORENO"    // "Otvoreno za prijave"
  | "ZATVORENO"   // "Prijave zatvorene"
  | "ODABIR"      // "U procesu odabira"
  | "ZAVRSENO";   // "Završeno"

export type OpportunityType = {
  id: string;
  name: string;
};

export type OpportunityFile = {
  id: string;
  fileName: string;
  mimeType: string;   // dopušteni tipovi dolaze iz usePostavkeMedia()
  sizeBytes: number;
  url: string;
};

export type OpportunityLocation = {
  address: string;    // formatirana adresa iz geokodiranja
  lat: number;
  lng: number;
};

export type Opportunity = {
  id: string;
  title: string;
  typeId: string;
  areaId: string;               // ID iz req('/podrucja')
  content: string;              // Markdown
  applicationDeadline: string;  // ISO 8601
  eventStart: string;           // ISO 8601
  eventEnd: string | null;      // ISO 8601
  location: OpportunityLocation | null;
  status: OpportunityStatus;
  applicationCount: number;     // bez povučenih prijava
  files: OpportunityFile[];
  createdAt: string;
  updatedAt: string;
};

export type OpportunityInput = {
  title: string;
  typeId: string;
  areaId: string;
  content: string;
  applicationDeadline: string;
  eventStart: string;
  eventEnd: string | null;
  location: OpportunityLocation | null;
};
