import { Badge, Button, Card, Center, Group, Image, Stack, Text } from "@mantine/core";
import { IconEye, IconFileText, IconPencil, IconTrash } from "@tabler/icons-react";
import type { Artwork } from "../../api/types";

interface Props {
    artwork: Artwork;
    zauzeto: boolean; // true dok se dohvaćaju detalji ovog djela (gumbi Uredi/Preview su pokrenuti)
    onEdit: (artwork: Artwork) => void;
    onDelete: (artwork: Artwork) => void;
    onPreview: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, zauzeto, onEdit, onDelete, onPreview }: Props) {
    const slika = artwork.files.find((f) => f.mimeType.startsWith("image/"));
    const podaci = [artwork.year, artwork.technique].filter((x) => x !== null && x !== "").join(" - ");

    return (
        <Card withBorder padding="md" h="100%">
            <Card.Section>
                {slika ? (
                    <Image src={slika.url} alt={artwork.title} h={180} fit="cover" />
                ) : (
                    <Center h={180} bg="gray.1" c="gray.6" aria-label="Djelo ima samo PDF dokument">
                        <IconFileText size={64} stroke={1.2} />
                    </Center>
                )}
            </Card.Section>

            <Stack gap="xs" mt="md" style={{ flex: 1 }}>
                <Group justify="space-between" wrap="nowrap" align="flex-start">
                    <Text fw={600} lineClamp={2} style={{ minWidth: 0 }}>{artwork.title}</Text>
                    <Badge color={artwork.isPublic ? "green" : "gray"} variant="light" style={{ flexShrink: 0 }}>
                        {artwork.isPublic ? "Javno" : "Privatno"}
                    </Badge>
                </Group>
                {podaci && <Text size="sm" c="dimmed">{podaci}</Text>}
            </Stack>

            <Group gap={6} mt="md" wrap="nowrap">
                <Button size="compact-sm" variant="light" leftSection={<IconPencil size={14} />} loading={zauzeto} onClick={() => onEdit(artwork)}>
                    Uredi
                </Button>
                <Button size="compact-sm" variant="light" leftSection={<IconEye size={14} />} loading={zauzeto} onClick={() => onPreview(artwork)}>
                    Preview
                </Button>
                <Button size="compact-sm" variant="light" color="red" leftSection={<IconTrash size={14} />} onClick={() => onDelete(artwork)}>
                    Obriši
                </Button>
            </Group>
        </Card>
    );
}
