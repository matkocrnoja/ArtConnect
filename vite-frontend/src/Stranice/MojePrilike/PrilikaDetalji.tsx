import { useEffect, useState } from "react";
import {
  Anchor,
  Badge,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import HeaderTabs from "../../Komponente/HeaderTabs/HeaderTabs";
import {
  getOpportunity,
  getOpportunityTypes,
  getArtAreas,
} from "../../api/opportunities";
import type {
  Opportunity,
  OpportunityType,
  ArtArea,
} from "../../api/types";
import { showError } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";

function formatDatum(datum: string | null) {
  if (!datum) return "Nije navedeno";

  return new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(datum));
}

const statusNazivi: Record<string, string> = {
  PRIPREMA: "U pripremi",
  OTVORENO: "Otvoreno",
  ZATVORENO: "Zatvoreno",
  ODABIR: "Odabir",
  ZAVRSENO: "Završeno",
};

export default function PrilikaDetalji() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prilika, setPrilika] = useState<Opportunity | null>(null);
  const [vrste, setVrste] = useState<OpportunityType[]>([]);
  const [podrucja, setPodrucja] = useState<ArtArea[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    let aktivno = true;

    async function ucitajPodatke() {
      if (!id) {
        setGreska("Nedostaje ID prilike.");
        setUcitavanje(false);
        return;
      }

      try {
        const [rezultat, vrsteRezultat, podrucjaRezultat] =
          await Promise.all([
            getOpportunity(id),
            getOpportunityTypes(),
            getArtAreas(),
          ]);

        if (aktivno) {
          setPrilika(rezultat);
          setVrste(vrsteRezultat);
          setPodrucja(podrucjaRezultat);
        }
      } catch (error) {
        const poruka =
          error instanceof Error
            ? error.message
            : "Nije moguće učitati priliku.";

        if (aktivno) {
          setGreska(poruka);
          showError(poruka);
        }
      } finally {
        if (aktivno) {
          setUcitavanje(false);
        }
      }
    }

    void ucitajPodatke();

    return () => {
      aktivno = false;
    };
  }, [id]);

  const nazivVrste =
    vrste.find((vrsta) => vrsta.id === prilika?.typeId)?.name ??
    "Nepoznata vrsta";

  const nazivPodrucja =
    podrucja.find(
      (podrucje) =>
        podrucje.sifra_podrucja === prilika?.areaId
    )?.naziv_podrucja ?? "Nepoznato područje";

  return (
    <>
      <HeaderTabs />

      <Container size="md" py="xl">
        {ucitavanje ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : greska || !prilika ? (
          <Stack align="center" p="xl">
            <Text c="red">
              {greska ?? "Prilika nije pronađena."}
            </Text>

            <Button onClick={() => navigate("/")}>
              Natrag na početnu
            </Button>
          </Stack>
        ) : (
          <Stack gap="lg">
            <Button
              variant="subtle"
              color="gray"
              onClick={() => navigate(-1)}
              w="fit-content"
            >
              ← Natrag
            </Button>

            <Paper withBorder radius="md" p="lg">
              <Stack gap="md">
                <Group justify="space-between">
                  <Badge>
                    {statusNazivi[prilika.status] ?? prilika.status}
                  </Badge>
                </Group>

                <Title order={1}>{prilika.title}</Title>

                <Group gap="xs">
                  <Badge variant="light">{nazivVrste}</Badge>
                  <Badge variant="light" color="gray">
                    {nazivPodrucja}
                  </Badge>
                </Group>

                <Divider />

                <Stack gap={4}>
                  <Text fw={600}>Rok za prijavu</Text>
                  <Text>{formatDatum(prilika.applicationDeadline)}</Text>
                </Stack>

                <Stack gap={4}>
                  <Text fw={600}>Početak događaja</Text>
                  <Text>{formatDatum(prilika.eventStart)}</Text>
                </Stack>

                {prilika.eventEnd && (
                  <Stack gap={4}>
                    <Text fw={600}>Završetak događaja</Text>
                    <Text>{formatDatum(prilika.eventEnd)}</Text>
                  </Stack>
                )}

                {prilika.location && (
                  <Stack gap={4}>
                    <Text fw={600}>Lokacija</Text>
                    <Text>{prilika.location.address}</Text>
                  </Stack>
                )}

                <Divider />

                <Title order={2}>Opis prilike</Title>

                <div>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {prilika.content}
                  </ReactMarkdown>
                </div>

                {prilika.files.length > 0 && (
                  <>
                    <Divider />

                    <Title order={2}>Privitci</Title>

                    <Stack gap="xs">
                      {prilika.files.map((datoteka) => (
                        <Anchor
                          key={datoteka.id}
                          href={datoteka.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={datoteka.fileName}
                        >
                          {datoteka.fileName}
                        </Anchor>
                      ))}
                    </Stack>
                  </>
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Container>
    </>
  );
}