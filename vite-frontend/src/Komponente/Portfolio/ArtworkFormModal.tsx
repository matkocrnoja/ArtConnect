import { useState } from "react";
import { ActionIcon, Badge, Button, Checkbox, FileInput, Group, Modal, NumberInput, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconX } from "@tabler/icons-react";
import { createArtwork, porukaGreske, updateArtwork } from "../../api/portfolio";
import type { Artwork, ArtworkFile, ArtworkInput } from "../../api/types";
import { usePostavkeMedia } from "../../context/KorisnikContext";
import { showError, showSuccess } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";

interface Props {
    artwork?: Artwork;
    onClose: () => void;
    onSaved: (artwork: Artwork) => void;
}

interface Vrijednosti {
    title: string;
    year: number | string;
    technique: string;
    dimensions: string;
    description: string;
    isPublic: boolean;
    existingFiles: ArtworkFile[];
    newFiles: File[];
}

// Izvorno ime datoteke se ne pohranjuje, pa se postojeće datoteke označavaju vrstom i rednim brojem
function oznakaDatoteke(f: ArtworkFile, indeks: number): string {
    let vrsta: string;
    if (f.mimeType === "application/pdf") {
        vrsta = "PDF dokument";
    } else {
        vrsta = "Slika";
    }
    return `${vrsta} ${indeks + 1}`;
}

// Pretvara broj bajtova u čitljiv tekst, npr. "1.3 MB" ili "250 kB"
function velicina(bajtovi: number): string {
    const jedanMegabajt = 1024 * 1024;
    if (bajtovi >= jedanMegabajt) {
        return `${(bajtovi / jedanMegabajt).toFixed(1)} MB`;
    }
    const kilobajti = Math.round(bajtovi / 1024);
    return `${Math.max(1, kilobajti)} kB`;
}

export default function ArtworkFormModal({ artwork, onClose, onSaved }: Props) {
    const postavke = usePostavkeMedia();

    const limiti = {
        maxFilesPerArtwork: postavke?.max_datoteka_po_djelu ?? 3,
        maxFileSizeMb: postavke?.max_velicina_datoteke_mb ?? 5,
        mimeTypes: postavke?.mime_types ?? [],
    };

    const mobitel = useMediaQuery("(max-width: 48em)");
    const [spremam, setSpremam] = useState(false);
    const [odbijene, setOdbijene] = useState<string[]>([]);
    const trenutnaGodina = new Date().getFullYear();

    const form = useForm<Vrijednosti>({
        initialValues: {
            title: artwork?.title ?? "",
            year: artwork?.year ?? "",
            technique: artwork?.technique ?? "",
            dimensions: artwork?.dimensions ?? "",
            description: artwork?.description ?? "",
            isPublic: artwork?.isPublic ?? false, // Novo djelo je automatski privatno
            existingFiles: artwork?.files ?? [],
            newFiles: [],
        },
        validate: {
            title: (val) => (val.trim() ? null : "Naziv je obavezan."),
            year: (val) => {
                const godinaUnesena = val !== "";
                if (godinaUnesena && Number(val) > trenutnaGodina) {
                    return `Godina ne smije biti veća od ${trenutnaGodina}.`;
                }
                return null;
            },
            // Provjerava ukupan broj datoteka (postojeće + nove)
            newFiles: (_, values) => {
                const ukupno = values.existingFiles.length + values.newFiles.length;
                if (ukupno === 0) return "Dodaj barem jednu datoteku.";
                return null;
            },
        },
    });

    const ukupnoDatoteka = form.values.existingFiles.length + form.values.newFiles.length;
    const dosegnutLimit = ukupnoDatoteka >= limiti.maxFilesPerArtwork;

    // Makne postojeću datoteku (onu koja je već spremljena na poslužitelju) iz forme
    // Stvarno brisanje događa se tek kod spremanja, preko uklonjeneDatotekeId
    const ukloniPostojecuDatoteku = (id: string) => {
        const preostale = form.values.existingFiles.filter((f) => f.id !== id);
        form.setFieldValue("existingFiles", preostale);
    };

    // Makne tek dodanu (još neprenesenu) datoteku iz forme
    const ukloniNovuDatoteku = (indeks: number) => {
        const preostale = form.values.newFiles.filter((_f, i) => i !== indeks);
        form.setFieldValue("newFiles", preostale);
    };

    // Za svaku novu datoteku provjeri vrstu, veličinu i broj
    // Valjane dodaj u formu, a za odbijene zapamti razlog
    const dodajDatoteke = (odabrane: File[]) => {
        const razlozi: string[] = [];
        const prihvacene: File[] = [];
        let slobodno = limiti.maxFilesPerArtwork - ukupnoDatoteka;

        for (const datoteka of odabrane) {
            if (limiti.mimeTypes.length > 0 && !limiti.mimeTypes.includes(datoteka.type)) {
                razlozi.push(`${datoteka.name}: vrsta datoteke nije dopuštena`);
            } else if (datoteka.size > limiti.maxFileSizeMb * 1024 * 1024) {
                razlozi.push(`${datoteka.name}: veća je od ${limiti.maxFileSizeMb} MB`);
            } else if (slobodno <= 0) {
                razlozi.push(`${datoteka.name}: najviše ${limiti.maxFilesPerArtwork} datoteka po djelu`);
            } else {
                prihvacene.push(datoteka);
                slobodno -= 1;
            }
        }

        setOdbijene(razlozi);
        if (prihvacene.length > 0) form.setFieldValue("newFiles", [...form.values.newFiles, ...prihvacene]);
    };

    const spremi = form.onSubmit(async (v) => {
        const podaci: ArtworkInput = {
            title: v.title.trim(),
            year: v.year === "" ? null : Number(v.year),
            technique: v.technique.trim() || null,
            dimensions: v.dimensions.trim() || null,
            description: v.description.trim() || null,
            isPublic: v.isPublic,
        };

        setSpremam(true);
        try {
            let spremljeno: Artwork;
            if (artwork) {
                // Skupi id-eve datoteka koje je korisnik maknuo iz forme:
                // to su one koje djelo ima na poslužitelju, a više nisu u existingFiles.
                const uklonjeneDatotekeId: string[] = [];
                for (const datoteka of artwork.files) {
                    const zadrzana = v.existingFiles.some((postojeca) => postojeca.id === datoteka.id);
                    if (!zadrzana) {
                        uklonjeneDatotekeId.push(datoteka.id);
                    }
                }
                spremljeno = await updateArtwork(artwork.id, podaci, v.newFiles, uklonjeneDatotekeId);
            } else {
                spremljeno = await createArtwork(podaci, v.newFiles);
            }

            showSuccess(artwork ? "Djelo je spremljeno." : "Djelo je dodano.");
            onSaved(spremljeno);
            onClose();
        } catch (greska) {
            showError(porukaGreske(greska));
            setSpremam(false);
        }
    });

    return (
        <Modal
            opened
            onClose={onClose}
            title={artwork ? "Uredi djelo" : "Dodaj djelo"}
            size="lg"
            fullScreen={mobitel}
            closeOnClickOutside={false}
        >
            <form onSubmit={spremi}>
                <Stack>
                    <TextInput label="Naziv" withAsterisk {...form.getInputProps("title")} />
                    <NumberInput
                        label="Godina nastanka"
                        allowDecimal={false}
                        allowNegative={false}
                        hideControls
                        {...form.getInputProps("year")}
                    />
                    <TextInput label="Tehnika" {...form.getInputProps("technique")} />
                    <TextInput label="Dimenzije" placeholder="npr. 50 x 70 cm" {...form.getInputProps("dimensions")} />
                    <Textarea label="Opis" autosize minRows={3} {...form.getInputProps("description")} />

                    <Stack gap="xs">
                        <FileInput
                            multiple
                            withAsterisk
                            label="Datoteke"
                            placeholder={dosegnutLimit ? "Dosegnut je najveći broj datoteka" : "Odaberi datoteke"}
                            description={`Do ${limiti.maxFileSizeMb} MB - najviše ${limiti.maxFilesPerArtwork} po djelu`}
                            accept={limiti.mimeTypes.join(",")}
                            disabled={dosegnutLimit}
                            value={[]}
                            onChange={dodajDatoteke}
                            error={form.errors.newFiles}
                        />
                        {odbijene.map((razlog) => <Text key={razlog} c="red" size="sm">{razlog}</Text>)}

                        {form.values.existingFiles.map((f, i) => (
                            <Group key={f.id} justify="space-between" wrap="nowrap">
                                <Text size="sm" truncate>
                                    {oznakaDatoteke(f, i)}
                                    {f.sizeBytes > 0 && <Text span c="dimmed"> ({velicina(f.sizeBytes)})</Text>}
                                </Text>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Ukloni: ${oznakaDatoteke(f, i)}`}
                                    onClick={() => ukloniPostojecuDatoteku(f.id)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                        {form.values.newFiles.map((f, i) => (
                            <Group key={`${f.name}-${i}`} justify="space-between" wrap="nowrap">
                                <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                                    <Badge size="xs" variant="light">novo</Badge>
                                    <Text size="sm" truncate>{f.name} <Text span c="dimmed">({velicina(f.size)})</Text></Text>
                                </Group>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Ukloni ${f.name}`}
                                    onClick={() => ukloniNovuDatoteku(i)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Group>
                        ))}
                    </Stack>

                    {/* Checkbox se prikazuje SAMO kod uređivanja postojećeg djela */}
                    {artwork && (
                        <Checkbox label="Javno" {...form.getInputProps("isPublic", { type: "checkbox" })} />
                    )}

                    <Group justify="flex-end">
                        <Button variant="default" onClick={onClose} disabled={spremam}>Odustani</Button>
                        <Button type="submit" loading={spremam}>Spremi</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}