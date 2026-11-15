import { useEffect, useState } from "react";
import { Alert, Center, Loader, Button, Stack, Container } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOpportunity,
  getOpportunityTypes,
  getArtAreas,
} from "../../api/opportunities";
import type { ArtArea, Opportunity, OpportunityType } from "../../api/types";
import OpportunityView from "../../Komponente/Prilike/OpportunityView";

export default function PrilikaDetalji() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prilika, setPrilika] = useState<Opportunity | null>(null);
  const [vrste, setVrste] = useState<OpportunityType[]>([]);
  const [podrucja, setPodrucja] = useState<ArtArea[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState("");

  useEffect(() => {
    if (!id) {
      setGreska("Prilika nije pronađena.");
      setUcitavanje(false);
      return;
    }

    async function ucitaj() {
      try {
        setUcitavanje(true);
        setGreska("");

        const [podaciPrilike, podaciVrsta, podaciPodrucja] = await Promise.all([
          getOpportunity(id!),
          getOpportunityTypes(),
          getArtAreas(),
        ]);

        setPrilika(podaciPrilike);
        setVrste(podaciVrsta);
        setPodrucja(podaciPodrucja);
      } catch {
        setGreska("Došlo je do greške pri učitavanju prilike.");
      } finally {
        setUcitavanje(false);
      }
    }

    ucitaj();
  }, [id]);

  if (ucitavanje) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  if (greska || !prilika) {
    return (
      <Alert color="red" m="lg">
        {greska || "Prilika nije pronađena."}
      </Alert>
    );
  }

  const vrsta = vrste.find((item) => item.id === prilika.typeId);
  const podrucje = podrucja.find(
    (item) => item.sifra_podrucja === prilika.areaId,
  );

  if (!vrsta || !podrucje) {
    return (
      <Alert color="red" m="lg">
        Nije moguće pronaći vrstu ili područje ove prilike.
      </Alert>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Button
          variant="light"
          color="gray"
          w="fit-content"
          onClick={() => navigate("/moje-prilike")}
        >
          Povratak na Moje prilike
        </Button>

        <OpportunityView opportunity={prilika} type={vrsta} area={podrucje} />
      </Stack>
    </Container>
  );
}
