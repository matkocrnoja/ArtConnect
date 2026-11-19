import { API_URL, req_priv } from "./client";
import type {
    Artwork, ArtworkFile, ArtworkInput, Portfolio, PostavkeMedia, UploadLimits,
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

// Backend vraća url datoteke kao putanju (npr. "/media/djela/..."),
// pa ispred svake putanje dodajemo adresu poslužitelja da je preglednik može otvoriti.
function sApsolutnimUrlovima(artwork: Artwork): Artwork {
    const datoteke: ArtworkFile[] = [];
    for (const datoteka of artwork.files) {
        datoteke.push({
            id: datoteka.id,
            mimeType: datoteka.mimeType,
            sizeBytes: datoteka.sizeBytes,
            url: `${API_URL}${datoteka.url}`,
        });
    }
    return { ...artwork, files: datoteke };
}

export async function getPortfolio(): Promise<Portfolio> {
    const odgovor = await provjeri(await req_priv("/me/portfolio"));
    const portfolio: Portfolio = await odgovor.json();

    const artworks: Artwork[] = [];
    for (const artwork of portfolio.artworks) {
        artworks.push(sApsolutnimUrlovima(artwork));
    }

    return {
        biography: portfolio.biography,
        artDescription: portfolio.artDescription,
        artworks: artworks,
    };
}

export async function updateProfile(podaci: { biography: string; artDescription: string }): Promise<Pick<Portfolio, "biography" | "artDescription">> {
    const odgovor = await provjeri(await req_priv("/me/portfolio/profile", { method: "PATCH", body: podaci }));
    return odgovor.json();
}

export async function getArtwork(id: string): Promise<Artwork> {
    const odgovor = await provjeri(await req_priv(`/me/artworks/${id}`));
    return sApsolutnimUrlovima(await odgovor.json());
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
    return sApsolutnimUrlovima(await odgovor.json());
}

export async function updateArtwork(id: string, podaci: ArtworkInput, datoteke: File[], removedFileIds: string[]): Promise<Artwork> {
    const odgovor = await provjeri(await fetch(`${API_URL}/me/artworks/${id}`, {
        method: "PUT",
        body: multipart(podaci, datoteke, removedFileIds),
        credentials: "include",
    }));
    return sApsolutnimUrlovima(await odgovor.json());
}

// Brisanje djela koje je dio aktivne prijave backend odbija s 409
// i listom prilika u tijelu (vidi porukaGreske / porukaZabranjenogBrisanja).
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
