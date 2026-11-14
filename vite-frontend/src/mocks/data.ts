import type { Artwork, ArtworkFile, Portfolio } from "../api/types";


export type Scenarij = "zadano" | "prazno";

const KLJUC_SCENARIJA = "mock-scenarij";

export function odaberiScenarij(): Scenarij {
    const parametar = new URLSearchParams(window.location.search).get("mock");
    if (parametar === "zadano" || parametar === "prazno") sessionStorage.setItem(KLJUC_SCENARIJA, parametar);
    return sessionStorage.getItem(KLJUC_SCENARIJA) === "prazno" ? "prazno" : "zadano";
}

function slika(boja: string, oznaka: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">`
        + `<rect width="600" height="450" fill="${boja}"/>`
        + `<text x="300" y="235" font-family="sans-serif" font-size="36" fill="white" text-anchor="middle">${oznaka}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PDF_URL = URL.createObjectURL(new Blob(
    ["%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n"
        + "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF"],
    { type: "application/pdf" },
));

function slikovnaDatoteka(id: string, naziv: string, boja: string): ArtworkFile {
    return { id, fileName: naziv, mimeType: "image/jpeg", sizeBytes: 1_200_000, url: slika(boja, naziv) };
}

function pdfDatoteka(id: string, naziv: string): ArtworkFile {
    return { id, fileName: naziv, mimeType: "application/pdf", sizeBytes: 800_000, url: PDF_URL };
}

const SADA = "2026-09-01T10:00:00.000Z";

// Id djela čije brisanje vraća 409 
export const ID_DJELA_409 = "djelo-5";

const djela: Artwork[] = [
    {
        // Javno djelo
        id: "djelo-1",
        title: "Djelo 1",
        year: 2024,
        technique: "Ulje na platnu",
        dimensions: "50 x 70 cm",
        description: "Opis djela 1.",
        isPublic: true,
        files: [slikovnaDatoteka("datoteka-1", "djelo-1.jpg", "#3b6ea5")],
        createdAt: SADA,
        updatedAt: SADA,
    },
    {
        // Privatno djelo
        id: "djelo-2",
        title: "Djelo 2",
        year: 2023,
        technique: "Ugljen na papiru",
        dimensions: null,
        description: null,
        isPublic: false,
        files: [slikovnaDatoteka("datoteka-2", "djelo-2.jpg", "#6b4e71")],
        createdAt: SADA,
        updatedAt: SADA,
    },
    {
        // PDF - kartica prikazuje ikonu dokumenta
        id: "djelo-3",
        title: "Djelo 3",
        year: 2025,
        technique: null,
        dimensions: null,
        description: null,
        isPublic: true,
        files: [pdfDatoteka("datoteka-3", "djelo-3.pdf")],
        createdAt: SADA,
        updatedAt: SADA,
    },
    {
        // Najveći dopušteni broj datoteka - FileInput mora biti onemogućen
        id: "djelo-4",
        title: "Djelo 4",
        year: 2022,
        technique: "Akril na platnu",
        dimensions: null,
        description: null,
        isPublic: false,
        files: [
            slikovnaDatoteka("datoteka-4a", "djelo-4-a.jpg", "#2f7d6d"),
            slikovnaDatoteka("datoteka-4b", "djelo-4-b.jpg", "#a5683b"),
            slikovnaDatoteka("datoteka-4c", "djelo-4-c.jpg", "#7d2f4a"),
        ],
        createdAt: SADA,
        updatedAt: SADA,
    },
    {
        // Poseban slučaj: brisanje vraća 409 jer je djelo dio aktivne prijave
        id: ID_DJELA_409,
        title: "Mladost",
        year: 2025,
        technique: "Digitalna ilustracija",
        dimensions: null,
        description: null,
        isPublic: true,
        files: [slikovnaDatoteka("datoteka-5", "mladost.jpg", "#b08a2e")],
        createdAt: SADA,
        updatedAt: SADA,
    },
];

export function pocetniPortfolio(scenarij: Scenarij): Portfolio {
    return {
        biography: "",
        artDescription: "Bavim se slikarstvom.",
        artworks: scenarij === "prazno" ? [] : structuredClone(djela),
    };
}

// Prilike u kojima je pojedino djelo već prijavljeno (za 409)
export const AKTIVNE_PRIJAVE: Record<string, { id: string; title: string }[]> = {
    [ID_DJELA_409]: [{ id: "prilika-1", title: "Mladi umjetnici 2026" }],
};