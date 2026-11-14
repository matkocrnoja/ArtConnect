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

function velicina(bajtovi: number): string {
    return bajtovi >= 1024 * 1024
        ? `${(bajtovi / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bajtovi / 1024))} kB`;
}

export default function ArtworkFormModal({ artwork, onClose, onSaved }: Props) {
    const postavke = usePostavkeMedia();

    const limiti = {
        maxFilesPerArtwork: postavke?.max_datoteka_po_djelu ?? 3,
        maxFileSizeMb: postavke?.max_velicina_datoteke_mb ?? 5,
        mime_types: postavke?.mime_types ?? [],
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
            year: (val) => (val !== "" && Number(val) > trenutnaGodina ? `Godina ne smije biti veća od ${trenutnaGodina}.` : null),
            newFiles: (_, values) => (values.existingFiles.length + values.newFiles.length === 0 ? "Dodaj barem jednu datoteku." : null),
        },
    });

    const ukupnoDatoteka = form.values.existingFiles.length + form.values.newFiles.length;
    const dosegnutLimit = ukupnoDatoteka >= limiti.maxFilesPerArtwork;

    const dodajDatoteke = (odabrane: File[]) => {
        const razlozi: string[] = [];
        const prihvacene: File[] = [];
        let slobodno = limiti.maxFilesPerArtwork - ukupnoDatoteka;

        for (const datoteka of odabrane) {
            if (limiti.mime_types.length > 0 && !limiti.mime_types.includes(datoteka.type)) {
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
            const spremljeno = artwork
                ? await updateArtwork(
                    artwork.id,
                    podaci,
                    v.newFiles,
                    artwork.files.filter((f) => !v.existingFiles.some((e) => e.id === f.id)).map((f) => f.id),
                )
                : await createArtwork(podaci, v.newFiles);

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
                            description={`Do ${limiti.maxFileSizeMb} MB · najviše ${limiti.maxFilesPerArtwork} po djelu`}
                            accept={limiti.mime_types.join(",")}
                            disabled={dosegnutLimit}
                            value={[]}
                            onChange={dodajDatoteke}
                            error={form.errors.newFiles}
                        />
                        {odbijene.map((razlog) => <Text key={razlog} c="red" size="sm">{razlog}</Text>)}

                        {form.values.existingFiles.map((f) => (
                            <Group key={f.id} justify="space-between" wrap="nowrap">
                                <Text size="sm" truncate>{f.fileName} <Text span c="dimmed">({velicina(f.sizeBytes)})</Text></Text>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    aria-label={`Ukloni ${f.fileName}`}
                                    onClick={() => form.setFieldValue("existingFiles", form.values.existingFiles.filter((e) => e.id !== f.id))}
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
                                    onClick={() => form.setFieldValue("newFiles", form.values.newFiles.filter((_, j) => j !== i))}
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