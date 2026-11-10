import { useState } from "react";
import { Button, FileInput, Image, Stack, Text, TextInput } from "@mantine/core";
import { API_URL } from "../api/client";
import { usePostavkeMedia } from "../context/KorisnikContext";
import { showError, showSuccess } from "../KorisnickeNotifikacije/KorisnickeNotifikacije";

// Minimalni primjer za media.py: upload na POST /media/upload i dohvat s GET /media/get_file/{kljuc}
export default function TestUpload() {
    // Limiti iz postavki sustava (dohvaća ih ProtectedRoute); null ako backend nije vratio postavke
    const postavke = usePostavkeMedia();
    const [datoteke, setDatoteke] = useState<File[]>([]);
    const [kljucevi, setKljucevi] = useState<string[]>([]);
    const [greska, setGreska] = useState<string | null>(null);

    const [kljuc, setKljuc] = useState("");
    const [urlSlike, setUrlSlike] = useState<string | null>(null);

    const uploadaj = async () => {
        setGreska(null);
        if (!postavke) return;

        // Ista provjera kao na backendu, samo da korisnik ne čeka upload koji će sigurno pasti
        const maxBajtova = postavke.max_velicina_datoteke_mb * 1024 * 1024;
        const prevelika = datoteke.find((d) => d.size > maxBajtova);
        let lokalnaGreska: string | null = null;
        if (datoteke.length > postavke.max_datoteka_po_djelu)
            lokalnaGreska = `Najviše ${postavke.max_datoteka_po_djelu} datoteka odjednom`;
        else if (prevelika)
            lokalnaGreska = `${prevelika.name} je veća od ${postavke.max_velicina_datoteke_mb} MB`;
        if (lokalnaGreska) {
            setGreska(lokalnaGreska);
            showError(lokalnaGreska);
            return;
        }

        // Svaka datoteka ide pod isto ime polja "privitci", tako backend dobije list[UploadFile]
        const podaci = new FormData();
        for (const datoteka of datoteke) podaci.append("privitci", datoteka);

        // Ne koristimo req() iz client.ts jer šalje JSON; Content-Type za FormData postavlja browser
        const odgovor = await fetch(`${API_URL}/media/upload`, { method: "POST", body: podaci });
        const tijelo = await odgovor.json();
        if (!odgovor.ok) {
            const poruka = JSON.stringify(tijelo.detail);
            setGreska(poruka);
            showError(poruka);
            return;
        }
        showSuccess("Uspješan upload privitaka");
        setDatoteke([]);
        setKljucevi(tijelo.kljucevi);
    };

    // <img> sam napravi GET zahtjev, pa je dovoljno složiti URL
    const dohvati = () => setUrlSlike(`${API_URL}/media/get_file/${kljuc}`);

    if (!postavke) return <Text c="red">Postavke medija nisu dostupne, upload nije moguć.</Text>;

    return (
        <Stack maw={500} mx="auto" p="md">
            <FileInput
                multiple
                label="Datoteke"
                description={`${postavke.mime_types.join(", ")} · do ${postavke.max_velicina_datoteke_mb} MB · najviše ${postavke.max_datoteka_po_djelu} datoteka`}
                accept={postavke.mime_types.join(",")}
                value={datoteke}
                onChange={setDatoteke}
            />
            <Button onClick={uploadaj} disabled={datoteke.length === 0}>
                Uploadaj
            </Button>
            {greska && <Text c="red">{greska}</Text>}
            {kljucevi.map((k) => (
                <Text key={k} size="sm" style={{ cursor: "pointer" }} onClick={() => setKljuc(k)}>
                    {k}
                </Text>
            ))}

            <TextInput label="Ključ" value={kljuc} onChange={(e) => setKljuc(e.currentTarget.value)} />
            <Button onClick={dohvati} disabled={!kljuc}>
                Dohvati
            </Button>
            {urlSlike && <Image src={urlSlike} />}
        </Stack>
    );
}
