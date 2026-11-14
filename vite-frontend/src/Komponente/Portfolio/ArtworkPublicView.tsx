import { Anchor, Card, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import type { Artwork } from "../../api/types";

export default function ArtworkPublicView({ artwork }: { artwork: Artwork }) {
    const podaci = [
        artwork.year,
        artwork.technique,
        artwork.dimensions,
    ].filter((x) => x !== null && x !== "");

    return (
        <Stack>
            <Stack gap={4}>
                <Title order={3}>{artwork.title}</Title>
                {podaci.length > 0 && <Text c="dimmed">{podaci.join(" · ")}</Text>}
            </Stack>

            {artwork.description && <Text style={{ whiteSpace: "pre-wrap" }}>{artwork.description}</Text>}

            <Stack>
                {artwork.files.map((datoteka) => datoteka.mimeType.startsWith("image/") ? (
                    <Image key={datoteka.id} src={datoteka.url} alt={datoteka.fileName} fit="contain" mah={600} />
                ) : (
                    <Card key={datoteka.id} withBorder padding="sm">
                        <Group gap="xs">
                            <IconFileText size={24} />
                            <Anchor href={datoteka.url} target="_blank" rel="noreferrer">{datoteka.fileName}</Anchor>
                        </Group>
                    </Card>
                ))}
            </Stack>
        </Stack>
    );
}
