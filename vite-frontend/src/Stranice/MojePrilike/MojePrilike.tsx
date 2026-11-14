import { useEffect, useState } from "react";
import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  getMyOpportunities,
  getOpportunityTypes,
  deleteOpportunity,
} from "../../api/opportunities";
import type {
  Opportunity,
  OpportunityStatus,
  OpportunityType,
} from "../../api/types";
import {
  showError,
  showSuccess,
} from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";
import HeaderTabs from "../../Komponente/HeaderTabs/HeaderTabs";

const statusi: Record<OpportunityStatus, { label: string; color: string }> = {
  PRIPREMA: { label: "Priprema", color: "gray" },
  OTVORENO: { label: "Otvoreno za prijave", color: "green" },
  ZATVORENO: { label: "Prijave zatvorene", color: "orange" },
  ODABIR: { label: "U procesu odabira", color: "blue" },
  ZAVRSENO: { label: "Završeno", color: "dark" },
};

function formatirajDatum(datum: string): string {
  const vrijednost = new Date(datum);

  if (Number.isNaN(vrijednost.getTime())) {
    return "Nepoznat datum";
  }

  return new Intl.DateTimeFormat("hr-HR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(vrijednost);
}

export default function MojePrilike() {
  const navigate = useNavigate();

  const [prilike, setPrilike] = useState<Opportunity[]>([]);
  const [vrste, setVrste] = useState<OpportunityType[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    async function ucitajPodatke() {
      try {
        const [dohvacenePrilike, dohvaceneVrste] = await Promise.all([
          getMyOpportunities(),
          getOpportunityTypes(),
        ]);

        setPrilike(dohvacenePrilike);
        setVrste(dohvaceneVrste);
      } catch (error) {
        showError(
          error instanceof Error
            ? error.message
            : "Nije moguće učitati prilike.",
        );
      } finally {
        setUcitavanje(false);
      }
    }

    void ucitajPodatke();
  }, []);

  async function obrisiPriliku(prilika: Opportunity) {
    if (prilika.applicationCount > 0) {
      showError(
        `Prilika ima ${prilika.applicationCount} prijava i ne može se obrisati.`,
      );
      return;
    }

    const potvrda = window.confirm(
      `Želiš li zaista obrisati priliku "${prilika.title}"?`,
    );

    if (!potvrda) return;

    try {
      await deleteOpportunity(prilika.id);
      setPrilike((trenutne) =>
        trenutne.filter((item) => item.id !== prilika.id),
      );
      showSuccess("Prilika je uspješno obrisana.");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Brisanje prilike nije uspjelo.",
      );
    }
  }

  function nazivVrste(typeId: string): string {
    return (
      vrste.find((vrsta) => vrsta.id === typeId)?.name ?? "Nepoznata vrsta"
    );
  }

  return (
    <>
      <HeaderTabs />
      <Stack p="md" pt={0}>
        <Group justify="space-between" align="center">
          <Title order={1}>Moje prilike</Title>

          <Button onClick={() => navigate("/moje-prilike/nova")}>
            Nova prilika
          </Button>
        </Group>

        {ucitavanje ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} withBorder padding="lg">
                <Stack>
                  <Skeleton height={24} width="70%" />
                  <Skeleton height={18} width="45%" />
                  <Skeleton height={18} />
                  <Skeleton height={18} />
                  <Skeleton height={36} />
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        ) : prilike.length === 0 ? (
          <Card withBorder padding="xl">
            <Stack align="center" gap="sm">
              <Title order={3}>Još nemaš objavljenih prilika</Title>
              <Text c="dimmed" ta="center">
                Kada stvoriš novu priliku, ona će se prikazati ovdje.
              </Text>
              <Button onClick={() => navigate("/moje-prilike/nova")}>
                Stvori prvu priliku
              </Button>
            </Stack>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {prilike.map((prilika) => {
              const status = statusi[prilika.status];

              return (
                <Card key={prilika.id} withBorder padding="lg">
                  <Stack gap="sm">
                    <Group justify="space-between" align="flex-start">
                      <Badge color={status.color}>{status.label}</Badge>
                      <Text size="xs" c="dimmed">
                        ID: {prilika.id}
                      </Text>
                    </Group>

                    <Title order={3}>
                      <Anchor
                        component="button"
                        type="button"
                        onClick={() => navigate(`/prilike/${prilika.id}`)}
                        ta="left"
                      >
                        {prilika.title}
                      </Anchor>
                    </Title>

                    <Text size="sm">
                      <strong>Vrsta:</strong> {nazivVrste(prilika.typeId)}
                    </Text>

                    <Text size="sm">
                      <strong>Područje:</strong> ID {prilika.areaId}
                    </Text>

                    <Text size="sm">
                      <strong>Rok prijave:</strong>{" "}
                      {formatirajDatum(prilika.applicationDeadline)}
                    </Text>

                    <Text size="sm">
                      <strong>Početak događanja:</strong>{" "}
                      {formatirajDatum(prilika.eventStart)}
                    </Text>

                    {prilika.eventEnd && (
                      <Text size="sm">
                        <strong>Završetak događanja:</strong>{" "}
                        {formatirajDatum(prilika.eventEnd)}
                      </Text>
                    )}

                    <Text size="sm">
                      Broj prijava: <strong>{prilika.applicationCount}</strong>
                    </Text>

                    <Group grow mt="sm">
                      <Button
                        variant="light"
                        onClick={() =>
                          navigate(`/moje-prilike/${prilika.id}/uredi`)
                        }
                      >
                        Uredi
                      </Button>

                      <Button
                        color="red"
                        variant="light"
                        disabled={prilika.applicationCount > 0}
                        onClick={() => void obrisiPriliku(prilika)}
                      >
                        Obriši
                      </Button>
                    </Group>

                    {prilika.applicationCount > 0 && (
                      <Text size="xs" c="dimmed">
                        Prilika ima prijave i ne može se obrisati.
                      </Text>
                    )}
                  </Stack>
                </Card>
              );
            })}
          </SimpleGrid>
        )}
      </Stack>
    </>
  );
}
