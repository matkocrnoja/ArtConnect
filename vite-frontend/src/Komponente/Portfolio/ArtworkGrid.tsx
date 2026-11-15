import { Button, Card, Group, SimpleGrid, Skeleton, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { Artwork } from "../../api/types";
import ArtworkCard from "./ArtworkCard";

const STUPCI = { base: 1, sm: 2, md: 3 };

interface Props {
    artworks: Artwork[];
    zauzetoId: string | null;
    onAdd: () => void;
    onEdit: (artwork: Artwork) => void;
    onDelete: (artwork: Artwork) => void;
    onPreview: (artwork: Artwork) => void;
}

export function ArtworkGridSkeleton() {
    return (
        <SimpleGrid cols={STUPCI}>
            {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} withBorder padding="md">
                    <Card.Section><Skeleton h={180} radius={0} /></Card.Section>
                    <Skeleton h={20} mt="md" w="70%" />
                    <Skeleton h={14} mt="xs" w="40%" />
                    <Skeleton h={28} mt="md" />
                </Card>
            ))}
        </SimpleGrid>
    );
}

export default function ArtworkGrid({ artworks, zauzetoId, onAdd, onEdit, onDelete, onPreview }: Props) {
    const dodaj = (
        <Button leftSection={<IconPlus size={16} />} onClick={onAdd}>Dodaj</Button>
    );

    if (artworks.length === 0) {
        return (
            <Card withBorder py="xl">
                <Stack align="center" gap="xs">
                    <Title order={4}>Još nemaš nijedno djelo</Title>
                    <Text c="dimmed" ta="center" maw={420}>
                        Dodaj prvo djelo i priloži njegove slike ili PDF. Novo djelo je privatno dok ga ne označiš kao javno.
                    </Text>
                    {dodaj}
                </Stack>
            </Card>
        );
    }

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={4}>Moja djela</Title>
                {dodaj}
            </Group>
            <SimpleGrid cols={STUPCI}>
                {artworks.map((a) => (
                    <ArtworkCard
                        key={a.id}
                        artwork={a}
                        zauzeto={zauzetoId === a.id}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onPreview={onPreview}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    );
}
