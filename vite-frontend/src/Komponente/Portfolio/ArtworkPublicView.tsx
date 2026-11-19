import { Anchor, Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import type { Artwork } from "../../api/types";

export default function ArtworkPublicView({ artwork }: { artwork: Artwork }) {
    // Red ispod naslova: godina, tehnika i dimenzije (samo ona polja koja su ispunjena)
    const podaci: (string | number)[] = [];
    if (artwork.year !== null) {
        podaci.push(artwork.year);
    }
    if (artwork.technique) {
        podaci.push(artwork.technique);
    }
    if (artwork.dimensions) {
        podaci.push(artwork.dimensions);
    }

    return (
        <Stack>
            <Stack gap={4}>
                <Title order={3}>{artwork.title}</Title>
                {podaci.length > 0 && <Text c="dimmed">{podaci.join(" - ")}</Text>}
            </Stack>
            {artwork.description && <Text style={{ whiteSpace: "pre-wrap" }}>{artwork.description}</Text>}

            <Stack>
                {artwork.files.map((datoteka) => {
                    // Slike se prikazuju direktno, a ostale datoteke (PDF) kao poveznica
                    const jeSlika = datoteka.mimeType.startsWith("image/");
                    if (jeSlika) {
                        return (
                            <Image key={datoteka.id} src={datoteka.url} alt={artwork.title} fit="contain" mah={600} />
                        );
                    }
                    return (
                        <Card key={datoteka.id} withBorder padding="sm">
                            <Group gap="xs">
                                <IconFileText size={24} />
                                <Anchor href={datoteka.url} target="_blank" rel="noreferrer">Otvori dokument (PDF)</Anchor>
                            </Group>
                        </Card>
                    );
                })}
            </Stack>
        </Stack>
    );
}
