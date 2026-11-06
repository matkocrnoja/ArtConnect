import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { dohvatiKorisnika, type Korisnik } from '../api';
import { KorisnikContext } from './KorisnikContext';

// Sesija je u HttpOnly kolačiću koji JavaScript ne vidi, pa o prijavi odlučuje backend.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    // undefined = još se učitava, null = nije prijavljen
    const [korisnik, setKorisnik] = useState<Korisnik | null | undefined>(undefined);

    useEffect(() => {
        dohvatiKorisnika().then(setKorisnik);
    }, []);

    if (korisnik === undefined) return null;
    if (korisnik === null) return <Navigate to="/" replace />;
    return <KorisnikContext.Provider value={korisnik}>{children}</KorisnikContext.Provider>;
}
