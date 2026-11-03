import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { API_URL } from '../api';

// Sesija je u HttpOnly kolačiću koji JavaScript ne vidi, pa o prijavi odlučuje backend.
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [prijavljen, setPrijavljen] = useState<boolean | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/auth/me`, { credentials: 'include' })
            .then((odgovor) => setPrijavljen(odgovor.ok))
            .catch(() => setPrijavljen(false));
    }, []);

    if (prijavljen === null) return null;
    if (!prijavljen) return <Navigate to="/" replace />;
    return <>{children}</>;
}
