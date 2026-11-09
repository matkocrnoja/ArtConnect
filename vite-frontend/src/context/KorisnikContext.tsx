import { createContext, useContext } from 'react';
import { odjavi } from '../api/auth';
import type { Korisnik } from '../api/types';

interface VrijednostKonteksta {
  korisnik: Korisnik;
  ocistiKorisnika: () => void;
}

export const KorisnikContext = createContext<VrijednostKonteksta | null>(null);

function useKontekst(): VrijednostKonteksta {
  const vrijednost = useContext(KorisnikContext);
  if (!vrijednost) throw new Error('Kontekst korisnika dostupan je samo unutar ProtectedRoute');
  return vrijednost;
}

export function useKorisnik(): Korisnik {
  return useKontekst().korisnik;
}

// Vraća funkciju koja odjavljuje korisnika na backendu i briše ga iz konteksta.
// ProtectedRoute nakon toga sam preusmjerava na početnu stranicu.
export function useOdjava(): () => Promise<void> {
  const { ocistiKorisnika } = useKontekst();
  return async () => {
    await odjavi();
    ocistiKorisnika();
  };
}
