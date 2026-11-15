
import { useEffect, useState } from "react";
import { Button, Center, Loader, Stack, Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";

import HeaderTabs from "../../Komponente/HeaderTabs/HeaderTabs";
import { getOpportunity } from "../../api/opportunities";
import type { Opportunity } from "../../api/types";
import { showError } from "../../KorisnickeNotifikacije/KorisnickeNotifikacije";
import OpportunityForm from "../../Komponente/Prilike/PrilikaForma";

export default function UrediPriliku() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prilika, setPrilika] = useState<Opportunity | null>(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    let aktivno = true;

    async function ucitajPriliku() {
      if (!id) {
        setGreska("Nedostaje ID prilike.");
        setUcitavanje(false);
        return;
      }

      try {
        const rezultat = await getOpportunity(id);

        if (aktivno) {
          setPrilika(rezultat);
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

    void ucitajPriliku();

    return () => {
      aktivno = false;
    };
  }, [id]);

  return (
    <>
      <HeaderTabs />

      {ucitavanje ? (
        <Center p="xl">
          <Loader />
        </Center>
      ) : greska || !prilika ? (
        <Stack p="xl" align="center">
          <Text c="red">{greska ?? "Prilika nije pronađena."}</Text>
          <Button onClick={() => navigate("/moje-prilike")}>
            Natrag na moje prilike
          </Button>
        </Stack>
      ) : (
        <OpportunityForm
          mode="edit"
          opportunity={prilika}
          onCancel={() => navigate("/moje-prilike")}
        />
      )}
    </>
  );
}
