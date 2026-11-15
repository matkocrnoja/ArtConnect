import { Anchor, Badge, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import type {
  ArtArea,
  Opportunity,
  OpportunityType,
} from "../../api/types";
import MarkdownView from "./MarkdownView";
import LocationMap from "./LocationMap";

interface OpportunityViewProps {
  opportunity: Opportunity;
  type: OpportunityType;
  area: ArtArea;
}

function formatDatum(datum: string) {
  return new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(datum));
}

export default function OpportunityView({
  opportunity,
  type,
  area,
}: OpportunityViewProps) {
  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <div>
          <Badge mb="sm">{type.name}</Badge>
          <Title order={1}>{opportunity.title}</Title>
          <Text c="dimmed" mt="xs">
            Područje umjetnosti: {area.naziv_podrucja}
          </Text>
        </div>

        <Card withBorder>
          <Stack gap="sm">
            <div>
              <Text fw={600}>Rok za prijavu</Text>
              <Text>{formatDatum(opportunity.applicationDeadline)}</Text>
            </div>

            <div>
              <Text fw={600}>Početak događanja</Text>
              <Text>{formatDatum(opportunity.eventStart)}</Text>
            </div>

            {opportunity.eventEnd && (
              <div>
                <Text fw={600}>Završetak događanja</Text>
                <Text>{formatDatum(opportunity.eventEnd)}</Text>
              </div>
            )}
          </Stack>
        </Card>

        <section>
          <Title order={2} size="h3" mb="sm">
            Opis prilike
          </Title>
          <MarkdownView content={opportunity.content} />
        </section>

        {opportunity.files.length > 0 && (
          <section>
            <Title order={2} size="h3" mb="sm">
              Privici
            </Title>
            <Stack gap="xs">
              {opportunity.files.map((file) => (
                <Anchor
                  key={file.id}
                  href={file.url}
                  download={file.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.fileName}
                </Anchor>
              ))}
            </Stack>
          </section>
        )}

        {opportunity.location && (
          <section>
            <Title order={2} size="h3" mb="sm">
              Lokacija
            </Title>
            <Text mb="sm">{opportunity.location.address}</Text>
            <LocationMap location={opportunity.location} />
          </section>
        )}
      </Stack>
    </Container>
  );
}
