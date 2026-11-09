export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown; // šalje se kao JSON
}

function send(path: string, credentials: RequestCredentials, { method = 'GET', body }: RequestOptions): Promise<Response> {
  const hasBody = body !== undefined;
  return fetch(`${API_URL}${path}`, {
    method,
    credentials,
    headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
  });
}

// Javni poziv: ne šalje kolačić sesije. Za podatke dostupne svima.
// Baca iznimku ako poslužitelj nije dostupan.
export function req(path: string, options: RequestOptions = {}): Promise<Response> {
  return send(path, 'omit', options);
}

// Privilegirani poziv: šalje kolačić sesije, pa backend zna tko je korisnik.
// Baca iznimku ako poslužitelj nije dostupan.
export function req_priv(path: string, options: RequestOptions = {}): Promise<Response> {
  return send(path, 'include', options);
}
