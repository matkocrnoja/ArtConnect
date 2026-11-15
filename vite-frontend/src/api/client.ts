// Dev: Vite dev server + uvicorn on :8000. Prod: nginx serves the app and proxies /api to uvicorn.
export const API_URL = import.meta.env.DEV ? 'http://localhost:8000' : '/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown; // šalje se kao JSON
}

function send(path: string, credentials: RequestCredentials, { method = 'GET', body }: RequestOptions): Promise<Response> {
  const hasBody = body !== undefined;
  const isFormData = body instanceof FormData;
  return fetch(`${API_URL}${path}`, {
    method,
    credentials,
    headers: hasBody && !isFormData ? { 'Content-Type': 'application/json' } : undefined,
    body: hasBody ? isFormData ? body : JSON.stringify(body) : undefined,
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
