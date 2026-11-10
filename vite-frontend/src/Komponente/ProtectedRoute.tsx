import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { dohvatiKorisnika } from '../api/auth';
import { dohvatiPostavkeMedia } from '../api/media';
import { KorisnikContext } from '../context/KorisnikContext';
import type { Korisnik, PostavkeMedia } from '../api/types';

// Sesija je u HttpOnly kolačiću koji JavaScript ne vidi, pa o prijavi odlučuje backend.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    // undefined = još se učitava, null = nije prijavljen
    const [korisnik, setKorisnik] = useState<Korisnik | null | undefined>(undefined);
    // undefined = još se učitava, null = dohvat nije uspio (stranica radi, ali upload nije moguć)
    const [postavkeDatoteke, setPostavkeDatoteke] = useState<PostavkeMedia | null | undefined>(undefined);

    useEffect(() => {
        dohvatiKorisnika().then(setKorisnik);
        dohvatiPostavkeMedia().then(setPostavkeDatoteke);
    }, []);

    if (korisnik === undefined || postavkeDatoteke === undefined) return null;
    if (korisnik === null) return <Navigate to="/" replace />;
    return (
        <KorisnikContext.Provider value={{ korisnik, postavkeDatoteke, ocistiKorisnika: () => setKorisnik(null) }}>
            {children}
        </KorisnikContext.Provider>
    );
}
