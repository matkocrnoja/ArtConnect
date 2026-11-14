import { useEffect, useState } from "react";
import {
    Anchor, Badge, Button, Card, FileInput, Group, Image, Select, Stack, Switch, Text, TextInput, Title,
} from "@mantine/core";
import { API_URL, req_priv } from "../api/client";
import { useKorisnik, useOdjava, usePostavkeMedia } from "../context/KorisnikContext";
import { showError, showSuccess } from "../KorisnickeNotifikacije/KorisnickeNotifikacije";

interface SpremljenoDjelo {
    id: string;
    naziv: string;
    javno: boolean;
    poveznice: string[];
}

const LOCAL_KLJUC = "test-upload-djela";

function ucitajDjela(): SpremljenoDjelo[] {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_KLJUC) ?? "[]");
    } catch {
        return [];
    }
}

function porukaGreske(status: number, tijelo: unknown): string {
    const detail = (tijelo as { detail?: unknown })?.detail;
    return `${status}: ${typeof detail === "string" ? detail : JSON.stringify(detail ?? tijelo)}`;
}

function Datoteka({ putanja }: { putanja: string }) {
    const [stanje, setStanje] = useState<{ status: number; url?: string; tip?: string; greska?: string } | null>(null);

    useEffect(() => {
        let url: string | undefined;
        fetch(`${API_URL}${putanja}`, { credentials: "include" })
            .then(async (odgovor) => {
                if (!odgovor.ok) {
                    const tijelo = await odgovor.json().catch(() => null);
                    setStanje({ status: odgovor.status, greska: porukaGreske(odgovor.status, tijelo) });
                    return;
                }
                const blob = await odgovor.blob();
                url = URL.createObjectURL(blob);
                setStanje({ status: odgovor.status, url, tip: blob.type });
            })
            .catch(() => setStanje({ status: 0, greska: "backend nedostupan" }));
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [putanja]);

    return (
        <Card withBorder p="xs">
            <Group justify="space-between" mb={4}>
                <Text size="xs" ff="monospace" style={{ wordBreak: "break-all" }}>{putanja}</Text>
                {stanje && <Badge color={stanje.url ? "green" : "red"}>{stanje.status || "?"}</Badge>}
            </Group>
            {stanje?.greska && <Text c="red" size="sm">{stanje.greska}</Text>}
            {stanje?.url && stanje.tip?.startsWith("image/") && <Image src={stanje.url} mah={240} fit="contain" />}
            {stanje?.url && !stanje.tip?.startsWith("image/") && (
                <Anchor href={stanje.url} target="_blank">Otvori ({stanje.tip})</Anchor>
            )}
        </Card>
    );
}

export default function TestUpload() {
    const korisnik = useKorisnik();
    const odjava = useOdjava();
    const postavke = usePostavkeMedia();
    const jeUmjetnik = korisnik.uloga === "umjetnik";

    const [djela, setDjela] = useState<SpremljenoDjelo[]>(ucitajDjela);
    const [naziv, setNaziv] = useState("");
    const [javno, setJavno] = useState(false);
    const [odabranoDjelo, setOdabranoDjelo] = useState<string | null>(null);
    const [datoteke, setDatoteke] = useState<File[]>([]);
    const [rucnaPoveznica, setRucnaPoveznica] = useState("");
    const [provjeravanaPoveznica, setProvjeravanaPoveznica] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem(LOCAL_KLJUC, JSON.stringify(djela));
    }, [djela]);

    const stvoriDjelo = async () => {
        const odgovor = await req_priv("/art/djela", { method: "POST", body: { naziv, javno } });
        const tijelo = await odgovor.json();
        if (!odgovor.ok) return showError(porukaGreske(odgovor.status, tijelo));
        setDjela((d) => [{ id: tijelo.id, naziv, javno, poveznice: [] }, ...d]);
        setOdabranoDjelo(tijelo.id);
        setNaziv("");
        showSuccess(`Djelo stvoreno, id iz baze: ${tijelo.id}`);
    };

    const uploadaj = async () => {
        if (!odabranoDjelo) return;
        const podaci = new FormData();
        podaci.append("djelo_id", odabranoDjelo);
        for (const datoteka of datoteke) podaci.append("privitci", datoteka);

        const odgovor = await fetch(`${API_URL}/media/upload`, {
            method: "POST",
            body: podaci,
            credentials: "include",
        });
        const tijelo = await odgovor.json();
        if (!odgovor.ok) return showError(porukaGreske(odgovor.status, tijelo));

        const nove: string[] = tijelo.datoteke.map((d: { poveznica: string }) => d.poveznica);
        setDjela((sva) => sva.map((d) => (d.id === odabranoDjelo ? { ...d, poveznice: [...d.poveznice, ...nove] } : d)));
        setDatoteke([]);
        showSuccess(`Uploadano ${nove.length} datoteka na S3`);
    };

    return (
        <Stack maw={720} mx="auto" p="md">
            <Group justify="space-between">
                <Title order={3}>Test: djela i S3</Title>
                <Group gap="xs">
                    <Badge>{korisnik.uloga}</Badge>
                    <Text size="sm">{korisnik.ime_prezime}</Text>
                    <Button size="xs" variant="light" onClick={odjava}>Odjava</Button>
                </Group>
            </Group>
            <Text size="xs" c="dimmed" ff="monospace">id: {korisnik.id}</Text>

            {jeUmjetnik ? (
                <>
                    <Card withBorder>
                        <Title order={5} mb="xs">1. Novo djelo (POST /art/djela)</Title>
                        <Group align="end">
                            <TextInput
                                label="Naziv"
                                value={naziv}
                                onChange={(e) => setNaziv(e.currentTarget.value)}
                                style={{ flex: 1 }}
                            />
                            <Switch label="Javno" checked={javno} onChange={(e) => setJavno(e.currentTarget.checked)} mb={8} />
                            <Button onClick={stvoriDjelo} disabled={!naziv.trim()}>Stvori</Button>
                        </Group>
                    </Card>

                    <Card withBorder>
                        <Title order={5} mb="xs">2. Upload (POST /media/upload)</Title>
                        {!postavke && <Text c="red">Postavke medija nisu dostupne.</Text>}
                        <Stack>
                            <Select
                                label="Djelo"
                                placeholder="Odaberi djelo"
                                data={djela.map((d) => ({ value: d.id, label: `${d.naziv} (${d.javno ? "javno" : "privatno"})` }))}
                                value={odabranoDjelo}
                                onChange={(vrijednost) => setOdabranoDjelo(vrijednost === null ? null : String(vrijednost))}
                            />
                            <FileInput
                                multiple
                                label="Datoteke"
                                description={postavke && `${postavke.mime_types.join(", ")} · do ${postavke.max_velicina_datoteke_mb} MB · najviše ${postavke.max_datoteka_po_djelu} po djelu`}
                                accept={postavke?.mime_types.join(",")}
                                value={datoteke}
                                onChange={setDatoteke}
                            />
                            <Button onClick={uploadaj} disabled={!odabranoDjelo || datoteke.length === 0}>
                                Uploadaj
                            </Button>
                        </Stack>
                    </Card>
                </>
            ) : (
                <Text c="dimmed" size="sm">Prijavljen si kao {korisnik.uloga}, pa ne možeš stvarati djela. Ispod možeš provjeriti pristup.</Text>
            )}

            <Card withBorder>
                <Title order={5} mb="xs">3. Provjera pristupa (GET /media/djela/...)</Title>
                <Text size="sm" c="dimmed" mb="xs">
                    Poveznice se pamte u ovom pregledniku, pa ih vidiš i kad se prijaviš kao netko drugi.
                </Text>
                <Group align="end" mb="md">
                    <TextInput
                        label="Ručno zalijepi poveznicu"
                        placeholder="/media/djela/{umjetnik_id}/{djelo_id}/{datoteka_id}"
                        value={rucnaPoveznica}
                        onChange={(e) => setRucnaPoveznica(e.currentTarget.value)}
                        style={{ flex: 1 }}
                    />
                    <Button onClick={() => setProvjeravanaPoveznica(rucnaPoveznica.trim())} disabled={!rucnaPoveznica.trim()}>
                        Dohvati
                    </Button>
                </Group>
                {provjeravanaPoveznica && <Datoteka key={provjeravanaPoveznica} putanja={provjeravanaPoveznica} />}

                <Stack mt="md">
                    {djela.length === 0 && <Text size="sm" c="dimmed">Još nema spremljenih djela.</Text>}
                    {djela.map((d) => (
                        <Stack key={d.id} gap="xs">
                            <Group gap="xs">
                                <Text fw={600}>{d.naziv}</Text>
                                <Badge color={d.javno ? "green" : "gray"}>{d.javno ? "javno" : "privatno"}</Badge>
                                <Text size="xs" c="dimmed" ff="monospace">{d.id}</Text>
                            </Group>
                            {d.poveznice.length === 0 && <Text size="sm" c="dimmed">Bez datoteka.</Text>}
                            {d.poveznice.map((p) => <Datoteka key={p} putanja={p} />)}
                        </Stack>
                    ))}
                    {djela.length > 0 && (
                        <Button variant="subtle" color="red" size="xs" onClick={() => setDjela([])}>
                            Zaboravi spremljena djela
                        </Button>
                    )}
                </Stack>
            </Card>
        </Stack>
    );
}
