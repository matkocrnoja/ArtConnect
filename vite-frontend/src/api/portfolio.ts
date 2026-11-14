import { API_URL, req_priv } from "./client";
import type {
    Artwork, ArtworkInput, DeletableCheck, Portfolio, PostavkeMedia, UploadLimits,
} from "./types";

export class ApiError extends Error {
    status: number;
    body: unknown;

    constructor(status: number, body: unknown) {
        super(`HTTP ${status}`);
        this.status = status;
        this.body = body;
    }
}

async function provjeri(odgovor: Response): Promise<Response> {
    if (odgovor.ok) return odgovor;
    const tijelo = await odgovor.json().catch(() => null);
    throw new ApiError(odgovor.status, tijelo);
}

export function porukaGreske(greska: unknown): string {
    if (greska instanceof ApiError) {
        if (greska.status === 409) {
            const prilike = (greska.body as { opportunities?: { title: string }[] } | null)?.opportunities;
            if (prilike?.length) return porukaZabranjenogBrisanja(prilike);
        }
        if (greska.status >= 500) return "Poslužitelj trenutno ne radi. Pokušaj ponovno.";
        return "Radnja nije uspjela. Pokušaj ponovno.";
    }
    return "Poslužitelj nije dostupan. Pokušaj ponovno.";
}

export function porukaZabranjenogBrisanja(prilike: { title: string }[]): string {
    const nazivi = prilike.map((p) => `'${p.title}'`).join(", ");
    return prilike.length === 1
        ? `Djelo nije moguće obrisati jer je dio aktivne prijave na prilici ${nazivi}.`
        : `Djelo nije moguće obrisati jer je dio aktivnih prijava na prilikama ${nazivi}.`;
}

export async function getPortfolio(): Promise<Portfolio> {
    const odgovor = await provjeri(await req_priv("/me/portfolio"));
    return odgovor.json();
}

export async function updateProfile(podaci: { biography: string; artDescription: string }): Promise<Pick<Portfolio, "biography" | "artDescription">> {
    const odgovor = await provjeri(await req_priv("/me/portfolio/profile", { method: "PATCH", body: podaci }));
    return odgovor.json();
}

export async function getArtwork(id: string): Promise<Artwork> {
    const odgovor = await provjeri(await req_priv(`/me/artworks/${id}`));
    return odgovor.json();
}

function multipart(podaci: ArtworkInput, datoteke: File[], removedFileIds?: string[]): FormData {
    const forma = new FormData();
    forma.append("data", JSON.stringify(podaci));
    for (const datoteka of datoteke) forma.append("files", datoteka);
    if (removedFileIds) forma.append("removedFileIds", JSON.stringify(removedFileIds));
    return forma;
}

export async function createArtwork(podaci: ArtworkInput, datoteke: File[]): Promise<Artwork> {
    const odgovor = await provjeri(await fetch(`${API_URL}/me/artworks`, {
        method: "POST",
        body: multipart(podaci, datoteke),
        credentials: "include",
    }));
    return odgovor.json();
}

export async function updateArtwork(id: string, podaci: ArtworkInput, datoteke: File[], removedFileIds: string[]): Promise<Artwork> {
    const odgovor = await provjeri(await fetch(`${API_URL}/me/artworks/${id}`, {
        method: "PUT",
        body: multipart(podaci, datoteke, removedFileIds),
        credentials: "include",
    }));
    return odgovor.json();
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function checkArtworkDeletable(_id: string): Promise<DeletableCheck> {
    return { ok: true };
}

export async function deleteArtwork(id: string): Promise<void> {
    await provjeri(await req_priv(`/me/artworks/${id}`, { method: "DELETE" }));
}

export function getUploadLimits(postavke: PostavkeMedia | null): UploadLimits | null {
    if (!postavke) return null;
    return {
        maxFilesPerArtwork: postavke.max_datoteka_po_djelu,
        maxFileSizeMb: postavke.max_velicina_datoteke_mb,
    };
}
