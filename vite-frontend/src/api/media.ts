import { req } from './client';
import type { PostavkeMedia } from './types';

// Vraća limite za datoteke (tipovi, veličina, broj privitaka), ili null ako dohvat nije uspio.
// Javni poziv jer postavke nisu tajne i ne ovise o korisniku.
export async function dohvatiPostavkeMedia(): Promise<PostavkeMedia | null> {
  try {
    const odgovor = await req('/media/settings');
    return odgovor.ok ? await odgovor.json() : null;
  } catch {
    return null;
  }
}
