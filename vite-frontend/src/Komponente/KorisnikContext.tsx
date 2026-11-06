import { createContext, useContext } from 'react';
import type { Korisnik } from '../api';

export const KorisnikContext = createContext<Korisnik | null>(null);

export function useKorisnik(): Korisnik {
  const korisnik = useContext(KorisnikContext);
  if (!korisnik) throw new Error('useKorisnik se smije koristiti samo unutar ProtectedRoute');
  return korisnik;
}
