import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  FileInput,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";

import {
  createOpportunity,
  updateOpportunity,
  getOpportunityTypes,
  getArtAreas,
} from "../../api/opportunities";

import type {
  Opportunity,
  OpportunityInput,
  OpportunityType,
  ArtArea,
} from "../../api/types";

import { usePostavkeMedia } from "../../context/KorisnikContext";

import {
  showError,
  showSuccess,
} from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";

type OpportunityFormProps = {
  mode: "create" | "edit";
  opportunity?: Opportunity;
  onCancel: () => void;
};

type FormValues = {
  title: string;
  typeId: string;
  areaId: string;
  content: string;
  applicationDeadline: string;
  eventStart: string;
  eventEnd: string;
};

function datumUISO(vrijednost: Date | string | null): string {
  if (!vrijednost) return "";

  const datum = vrijednost instanceof Date ? vrijednost : new Date(vrijednost);

  return Number.isNaN(datum.getTime()) ? "" : datum.toISOString();
}

function datumUFormu(vrijednost: string | null): Date | null {
  if (!vrijednost) return null;

  const datum = new Date(vrijednost);

  return Number.isNaN(datum.getTime()) ? null : datum;
}

export default function OpportunityForm({
  mode,
  opportunity,
  onCancel,
}: OpportunityFormProps) {
  const postavkeMedia = usePostavkeMedia();

  const [vrste, setVrste] = useState<OpportunityType[]>([]);
  const [podrucja, setPodrucja] = useState<ArtArea[]>([]);

  const [ucitavanje, setUcitavanje] = useState(true);
  const [spremanje, setSpremanje] = useState(false);

  const [datoteke, setDatoteke] = useState<File[]>([]);
  const [uklonjeniIdjevi, setUklonjeniIdjevi] = useState<string[]>([]);
  const [greskaDatoteka, setGreskaDatoteka] = useState<string | null>(null);

  const pocetneVrijednosti: FormValues = {
    title: "",
    typeId: "",
    areaId: "",
    content: "",
    applicationDeadline: "",
    eventStart: "",
    eventEnd: "",
  };

  const form = useForm<FormValues>({
    initialValues: pocetneVrijednosti,

    validate: {
      title: (value) => (!value.trim() ? "Unesi naslov prilike." : null),

      typeId: (value) => (value ? null : "Odaberi vrstu prilike."),

      areaId: (value) => (value ? null : "Odaberi umjetničko područje."),

      content: (value) => (!value.trim() ? "Unesi opis prilike." : null),

      applicationDeadline: (value) => {
        if (!value) {
          return "Odaberi rok prijave.";
        }

        if (mode === "create" && new Date(value) <= new Date()) {
          return "Rok prijave mora biti u budućnosti.";
        }

        if (
          mode === "edit" &&
          opportunity &&
          (opportunity.status === "OTVORENO" ||
            opportunity.status === "ZATVORENO") &&
          formIsRokPromijenjen() &&
          new Date(value) <= new Date(opportunity.applicationDeadline)
        ) {
          return "Rok prijave može se samo produžiti.";
        }

        return null;
      },

      eventStart: (value, values) => {
        if (!value) {
          return "Odaberi početak događanja.";
        }

        if (
          values.applicationDeadline &&
          new Date(value) < new Date(values.applicationDeadline)
        ) {
          return "Događanje ne može početi prije roka prijave.";
        }

        return null;
      },

      eventEnd: (value, values) => {
        if (
          value &&
          values.eventStart &&
          new Date(value) < new Date(values.eventStart)
        ) {
          return "Završetak ne može biti prije početka događanja.";
        }

        return null;
      },
    },
  });

  function formIsRokPromijenjen() {
    return form.isDirty("applicationDeadline");
  }

  useEffect(() => {
    let aktivno = true;

    async function ucitajPodatke() {
      try {
        const [dohvaceneVrste, dohvacenaPodrucja] = await Promise.all([
          getOpportunityTypes(),
          getArtAreas(),
        ]);

        if (aktivno) {
          setVrste(dohvaceneVrste);
          setPodrucja(dohvacenaPodrucja);
        }
      } catch (error) {
        if (aktivno) {
          showError(
            error instanceof Error
              ? error.message
              : "Nije moguće učitati vrste i područja.",
          );
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
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !opportunity) return;

    const vrijednosti: FormValues = {
      title: opportunity.title,
      typeId: opportunity.typeId,
      areaId: opportunity.areaId,
      content: opportunity.content,
      applicationDeadline: opportunity.applicationDeadline,
      eventStart: opportunity.eventStart,
      eventEnd: opportunity.eventEnd ?? "",
    };

    form.setValues(vrijednosti);
    form.resetDirty(vrijednosti);
    form.clearErrors();
  }, [mode, opportunity]);

  const postojeciPrivitci =
    opportunity?.files.filter(
      (datoteka) => !uklonjeniIdjevi.includes(datoteka.id),
    ) ?? [];

  const ukupanBrojPrivitaka = postojeciPrivitci.length + datoteke.length;

  const maksimalanBroj = postavkeMedia?.max_privitaka_po_prilici ?? 0;

  function dodajDatoteke(noveDatoteke: File[] | null) {
    if (!noveDatoteke || !postavkeMedia) return;

    setGreskaDatoteka(null);

    const prihvacene: File[] = [];
    const odbijene: string[] = [];

    const maksimalnaVelicina =
      postavkeMedia.max_velicina_datoteke_mb * 1024 * 1024;

    for (const datoteka of noveDatoteke) {
      if (!postavkeMedia.mime_types.includes(datoteka.type)) {
        odbijene.push(`${datoteka.name}: tip datoteke nije dopušten.`);
        continue;
      }

      if (datoteka.size > maksimalnaVelicina) {
        odbijene.push(`${datoteka.name}: datoteka je prevelika.`);
        continue;
      }

      if (
        postojeciPrivitci.length + datoteke.length + prihvacene.length >=
        maksimalanBroj
      ) {
        odbijene.push(
          `${datoteka.name}: dosegnut je maksimalan broj privitaka.`,
        );
        continue;
      }

      prihvacene.push(datoteka);
    }

    if (prihvacene.length > 0) {
      setDatoteke((trenutne) => [...trenutne, ...prihvacene]);
    }

    if (odbijene.length > 0) {
      setGreskaDatoteka(odbijene.join(" "));
    }
  }

  function ukloniNovuDatoteku(index: number) {
    setDatoteke((trenutne) => trenutne.filter((_, i) => i !== index));
  }

  function ukloniPostojecuDatoteku(id: string) {
    setUklonjeniIdjevi((trenutni) => [...trenutni, id]);
  }

  const rokJeZakljucan =
    mode === "edit" &&
    opportunity &&
    (opportunity.status === "ODABIR" || opportunity.status === "ZAVRSENO");

  const rokJeZaProduzenje =
    mode === "edit" &&
    opportunity &&
    (opportunity.status === "OTVORENO" || opportunity.status === "ZATVORENO");

  const opisRoka =
    opportunity?.status === "ZATVORENO"
      ? "Rok se može produžiti, ali to neće ponovno otvoriti prijave niti promijeniti status prilike."
      : rokJeZaProduzenje
        ? "Rok se može samo produžiti."
        : rokJeZakljucan
          ? "Rok se ne može mijenjati u ovom statusu."
          : undefined;

  async function spremiPriliku(vrijednosti: FormValues) {
    if (mode === "edit" && opportunity) {
      const promijenjeno = (polje: keyof FormValues) => form.isDirty(polje);

      const greske: Partial<Record<keyof FormValues, string>> = {};

      if (promijenjeno("title") && !vrijednosti.title.trim()) {
        greske.title = "Unesi naslov prilike.";
      }

      if (promijenjeno("typeId") && !vrijednosti.typeId) {
        greske.typeId = "Odaberi vrstu prilike.";
      }

      if (promijenjeno("areaId") && !vrijednosti.areaId) {
        greske.areaId = "Odaberi umjetničko područje.";
      }

      if (promijenjeno("content") && !vrijednosti.content.trim()) {
        greske.content = "Unesi opis prilike.";
      }

      if (promijenjeno("applicationDeadline")) {
        if (!vrijednosti.applicationDeadline) {
          greske.applicationDeadline = "Odaberi rok prijave.";
        } else {
          const noviRok = new Date(vrijednosti.applicationDeadline);

          if (noviRok <= new Date()) {
            greske.applicationDeadline = "Rok prijave mora biti u budućnosti.";
          } else if (
            (opportunity.status === "OTVORENO" ||
              opportunity.status === "ZATVORENO") &&
            noviRok <= new Date(opportunity.applicationDeadline)
          ) {
            greske.applicationDeadline = "Rok prijave može se samo produžiti.";
          }
        }
      }

      if (promijenjeno("applicationDeadline") || promijenjeno("eventStart")) {
        if (!vrijednosti.eventStart) {
          greske.eventStart = "Odaberi početak događanja.";
        } else if (
          vrijednosti.applicationDeadline &&
          new Date(vrijednosti.eventStart) <
            new Date(vrijednosti.applicationDeadline)
        ) {
          greske.eventStart = "Događanje ne može početi prije roka prijave.";
        }
      }

      if (promijenjeno("eventStart") || promijenjeno("eventEnd")) {
        if (
          vrijednosti.eventEnd &&
          vrijednosti.eventStart &&
          new Date(vrijednosti.eventEnd) < new Date(vrijednosti.eventStart)
        ) {
          greske.eventEnd = "Završetak ne može biti prije početka događanja.";
        }
      }

      form.setErrors(greske);

      if (Object.keys(greske).length > 0) {
        return;
      }
    }

    setSpremanje(true);

    const podaci: OpportunityInput = {
      title: vrijednosti.title.trim(),
      typeId: vrijednosti.typeId,
      areaId: vrijednosti.areaId,
      content: vrijednosti.content,
      applicationDeadline: vrijednosti.applicationDeadline,
      eventStart: vrijednosti.eventStart,
      eventEnd: vrijednosti.eventEnd || null,
      location: opportunity?.location ?? null,
    };

    try {
      if (mode === "create") {
        await createOpportunity(podaci, datoteke);
        showSuccess("Prilika je uspješno stvorena.");
      } else if (opportunity) {
        await updateOpportunity(
          opportunity.id,
          podaci,
          datoteke,
          uklonjeniIdjevi,
        );

        showSuccess("Promjene su uspješno spremljene.");
      }

      onCancel();
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Spremanje prilike nije uspjelo.",
      );
    } finally {
      setSpremanje(false);
    }
  }

  return (
    <Stack p="md" pt="xs" maw={800} mx="auto">
      <Title order={1}>
        {mode === "create" ? "Nova prilika" : "Uredi priliku"}
      </Title>

      <Text c="dimmed">
        {mode === "create"
          ? "Ispuni podatke za stvaranje nove prilike."
          : "Uredi podatke prilike. Promjene se spremaju tek klikom na Spremi."}
      </Text>

      <Paper withBorder p="lg" radius="md">
        <form onSubmit={form.onSubmit(spremiPriliku)}>
          <Stack gap="md">
            <TextInput
              label="Naslov prilike"
              placeholder="Unesi naslov"
              required
              {...form.getInputProps("title")}
            />

            <Select
              label="Vrsta prilike"
              placeholder="Odaberi vrstu"
              data={vrste.map((vrsta) => ({
                value: vrsta.id,
                label: vrsta.name,
              }))}
              required
              searchable
              disabled={ucitavanje}
              {...form.getInputProps("typeId")}
            />

            <Select
              label="Umjetničko područje"
              placeholder="Odaberi područje"
              data={podrucja.map((podrucje) => ({
                value: podrucje.sifra_podrucja,
                label: podrucje.naziv_podrucja,
              }))}
              required
              searchable
              disabled={ucitavanje}
              {...form.getInputProps("areaId")}
            />

            <DateTimePicker
              label="Rok prijave"
              placeholder="Odaberi datum i vrijeme"
              valueFormat="DD.MM.YYYY. HH:mm"
              clearable
              required
              disabled={Boolean(rokJeZakljucan)}
              description={opisRoka}
              minDate={
                rokJeZaProduzenje && opportunity
                  ? new Date(opportunity.applicationDeadline)
                  : new Date()
              }
              value={datumUFormu(form.values.applicationDeadline)}
              onChange={(value) => {
                form.setFieldValue("applicationDeadline", datumUISO(value));

                form.clearFieldError("applicationDeadline");
                form.clearFieldError("eventStart");
              }}
              error={form.errors.applicationDeadline}
            />

            <DateTimePicker
              label="Početak događanja"
              placeholder="Odaberi datum i vrijeme"
              valueFormat="DD.MM.YYYY. HH:mm"
              clearable
              required
              value={datumUFormu(form.values.eventStart)}
              onChange={(value) => {
                form.setFieldValue("eventStart", datumUISO(value));

                form.clearFieldError("eventStart");
                form.clearFieldError("eventEnd");
              }}
              error={form.errors.eventStart}
            />

            <DateTimePicker
              label="Završetak događanja (neobavezno)"
              placeholder="Odaberi datum i vrijeme"
              valueFormat="DD.MM.YYYY. HH:mm"
              clearable
              value={datumUFormu(form.values.eventEnd)}
              onChange={(value) => {
                form.setFieldValue("eventEnd", datumUISO(value));

                form.clearFieldError("eventEnd");
              }}
              error={form.errors.eventEnd}
            />

            <Textarea
              label="Opis prilike"
              placeholder="Opiši priliku..."
              minRows={10}
              autosize
              required
              {...form.getInputProps("content")}
            />

            <Stack gap="xs">
              <Text fw={500}>Privitci</Text>

              <FileInput
                multiple
                clearable
                placeholder="Odaberi datoteke"
                value={[]}
                onChange={dodajDatoteke}
                accept={postavkeMedia?.mime_types.join(",")}
                disabled={
                  !postavkeMedia || ukupanBrojPrivitaka >= maksimalanBroj
                }
              />

              <Text size="xs" c="dimmed">
                Najviše {maksimalanBroj} privitaka. Maksimalna veličina pojedine
                datoteke: {postavkeMedia?.max_velicina_datoteke_mb ?? 0} MB.
              </Text>

              {greskaDatoteka && (
                <Text size="sm" c="red">
                  {greskaDatoteka}
                </Text>
              )}

              {postojeciPrivitci.map((datoteka) => (
                <Group key={datoteka.id} justify="space-between">
                  <Text size="sm">
                    {datoteka.fileName} (
                    {(datoteka.sizeBytes / 1024 / 1024).toFixed(2)} MB)
                  </Text>

                  <ActionIcon
                    type="button"
                    color="red"
                    variant="subtle"
                    aria-label={`Ukloni ${datoteka.fileName}`}
                    onClick={() => ukloniPostojecuDatoteku(datoteka.id)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              ))}

              {datoteke.map((datoteka, index) => (
                <Group
                  key={`${datoteka.name}-${index}`}
                  justify="space-between"
                >
                  <Text size="sm">
                    {datoteka.name} ({(datoteka.size / 1024 / 1024).toFixed(2)}{" "}
                    MB)
                  </Text>

                  <ActionIcon
                    type="button"
                    color="red"
                    variant="subtle"
                    aria-label={`Ukloni ${datoteka.name}`}
                    onClick={() => ukloniNovuDatoteku(index)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>

            <Group justify="flex-end">
              <Button variant="default" type="button" onClick={onCancel}>
                Odustani
              </Button>

              <Button type="submit" loading={spremanje} disabled={ucitavanje}>
                {mode === "create" ? "Stvori priliku" : "Spremi promjene"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Stack>
  );
}
