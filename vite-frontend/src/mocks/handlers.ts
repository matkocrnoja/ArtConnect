import { delay, http, HttpResponse } from "msw";
import { API_URL } from "../api/client";
import type { Artwork, ArtworkFile, ArtworkInput, Portfolio } from "../api/types";
import { AKTIVNE_PRIJAVE, odaberiScenarij, pocetniPortfolio } from "./data";

const KASNJENJE_MS = 800; //da se vidi skeleton i povremena greska 500
const VJEROJATNOST_GRESKE = 0.1; // za razvoj bez gresaka postavi na 0

const portfolio: Portfolio = pocetniPortfolio(odaberiScenarij());
let brojac = 100;

function noviId(prefiks: string): string {
    brojac += 1;
    return `${prefiks}-${brojac}`;
}

async function simulirajMrezu(): Promise<Response | null> {
    await delay(KASNJENJE_MS);
    if (Math.random() < VJEROJATNOST_GRESKE) {
        return HttpResponse.json({ detail: "greska_poslužitelja" }, { status: 500 });
    }
    return null;
}

function nadiDjelo(id: unknown): Artwork | undefined {
    return portfolio.artworks.find((d) => d.id === id);
}

function nepostojece(): Response {
    return HttpResponse.json({ detail: "djelo_ne_postoji" }, { status: 404 });
}

function uDatoteku(datoteka: File): ArtworkFile {
    return {
        id: noviId("datoteka"),
        fileName: datoteka.name,
        mimeType: datoteka.type as ArtworkFile["mimeType"],
        sizeBytes: datoteka.size,
        url: URL.createObjectURL(datoteka),
    };
}

async function procitajForma(request: Request): Promise<{ podaci: ArtworkInput; datoteke: File[]; uklonjene: string[] }> {
    const forma = await request.formData();
    return {
        podaci: JSON.parse(String(forma.get("data"))),
        datoteke: forma.getAll("files").filter((f): f is File => f instanceof File),
        uklonjene: JSON.parse(String(forma.get("removedFileIds") ?? "[]")),
    };
}

export const handlers = [
    http.get(`${API_URL}/me/portfolio`, async () => {
        const greska = await simulirajMrezu();
        return greska ?? HttpResponse.json(portfolio);
    }),

    http.patch(`${API_URL}/me/portfolio/profile`, async ({ request }) => {
        const greska = await simulirajMrezu();
        if (greska) return greska;
        const { biography, artDescription } = await request.json() as Pick<Portfolio, "biography" | "artDescription">;
        if (biography.length > 2000 || artDescription.length > 2000) {
            return HttpResponse.json({ detail: "predugacak_tekst" }, { status: 422 });
        }
        portfolio.biography = biography;
        portfolio.artDescription = artDescription;
        return HttpResponse.json({ biography, artDescription });
    }),

    http.post(`${API_URL}/me/artworks`, async ({ request }) => {
        const greska = await simulirajMrezu();
        if (greska) return greska;
        const { podaci, datoteke } = await procitajForma(request);
        if (!podaci.title?.trim() || datoteke.length === 0) {
            return HttpResponse.json({ detail: "neispravni_podaci" }, { status: 422 });
        }
        const sada = new Date().toISOString();
        const djelo: Artwork = {
            ...podaci,
            id: noviId("djelo"),
            files: datoteke.map(uDatoteku),
            createdAt: sada,
            updatedAt: sada,
        };
        portfolio.artworks.unshift(djelo);
        return HttpResponse.json(djelo, { status: 201 });
    }),

    http.get(`${API_URL}/me/artworks/:id`, async ({ params }) => {
        const greska = await simulirajMrezu();
        if (greska) return greska;
        const djelo = nadiDjelo(params.id);
        return djelo ? HttpResponse.json(djelo) : nepostojece();
    }),

    http.put(`${API_URL}/me/artworks/:id`, async ({ params, request }) => {
        const greska = await simulirajMrezu();
        if (greska) return greska;
        const djelo = nadiDjelo(params.id);
        if (!djelo) return nepostojece();
        const { podaci, datoteke, uklonjene } = await procitajForma(request);
        const preostale = djelo.files.filter((f) => !uklonjene.includes(f.id));
        const sveDatoteke = [...preostale, ...datoteke.map(uDatoteku)];
        if (!podaci.title?.trim() || sveDatoteke.length === 0) {
            return HttpResponse.json({ detail: "neispravni_podaci" }, { status: 422 });
        }
        Object.assign(djelo, podaci, { files: sveDatoteke, updatedAt: new Date().toISOString() });
        return HttpResponse.json(djelo);
    }),

    http.delete(`${API_URL}/me/artworks/:id`, async ({ params }) => {
        const greska = await simulirajMrezu();
        if (greska) return greska;
        const djelo = nadiDjelo(params.id);
        if (!djelo) return nepostojece();
        const prilike = AKTIVNE_PRIJAVE[djelo.id];
        if (prilike) {
            return HttpResponse.json({ detail: "djelo_u_aktivnoj_prijavi", opportunities: prilike }, { status: 409 });
        }
        portfolio.artworks = portfolio.artworks.filter((d) => d.id !== djelo.id);
        return new HttpResponse(null, { status: 204 });
    }),
];
