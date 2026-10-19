import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// PoC: "logged in" = token present in localStorage
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/" replace />;
    return <>{children}</>;
}
