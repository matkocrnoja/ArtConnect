import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Alert, Anchor, Button, Center, Stack, Text, Title } from '@mantine/core';
import ModalRegistracijaUmjetnik from './Registracija/ModalRegistracijaUmjetnik';
import ModalRegistracijaOrganizator from './Registracija/ModalRegistracijaOrganizator';
import { prijavi } from '../api/auth';
import { API_URL } from '../api/client';
import type { Korisnik } from '../api/types';

type Uloga = Korisnik['uloga'];

interface Props {
  nacin: 'prijava' | 'registracija';
}

// Administrator se ovdje ne nudi ni za prijavu ni za registraciju.
const ULOGE: Uloga[] = ['umjetnik', 'organizator'];

export default function ObjedinjenaPrijavaRegistracija({ nacin }: Props) {
  const jePrijava = nacin === 'prijava';
  const [parametri, setParametri] = useSearchParams();
  const [greska, setGreska] = useState<string | null>(
    parametri.get('greska') === 'nije_registriran'
      ? 'Ovaj Google račun nije registriran u odabranoj ulozi.'
      : null,
  );

  // Nakon Google prijave backend novog korisnika vraća na /registracija?uloga=...,
  // pa uloga u adresi otvara formu, a zatvaranje forme briše je iz adrese.
  const ulogaIzAdrese = parametri.get('uloga');
  const zatvoriModal = () => setParametri({});

  // Oba načina vode na Google: registracija izravno, a prijava preko adrese koju vrati backend.
  const odaberi = async (uloga: Uloga) => {
    if (!jePrijava) {
      window.location.assign(`${API_URL}/auth/google/login?uloga=${uloga}`);
      return;
    }

    const rezultat = await prijavi(uloga);
    if ('url' in rezultat) window.location.assign(rezultat.url);
    else setGreska(rezultat.greska);
  };

  return (
    <>
      <Center mih="100vh">
        <Stack align="center">
          <Title order={2}>{jePrijava ? 'Prijava' : 'Registracija'}</Title>

          {greska && <Alert color="red">{greska}</Alert>}

          {ULOGE.map((uloga) => (
            <Button key={uloga} w={300} onClick={() => odaberi(uloga)}>
              {jePrijava ? 'Prijavi se' : 'Registriraj se'} kao {uloga}
            </Button>
          ))}

          <Text size="sm" c="dimmed">
            {jePrijava ? 'Nemaš račun? ' : 'Već imaš račun? '}
            <Anchor component={Link} to={jePrijava ? '/registracija' : '/prijava'} size="sm">
              {jePrijava ? 'Registriraj se' : 'Prijavi se'}
            </Anchor>
          </Text>

          <Text size="sm" c="dimmed">
            {"Vrati me na "}
            <Anchor component={Link} to={'/'} size="sm">
              početnu stranicu
            </Anchor>
          </Text>
        </Stack>
      </Center>

      <ModalRegistracijaUmjetnik opened={ulogaIzAdrese === 'umjetnik'} onClose={zatvoriModal} />
      <ModalRegistracijaOrganizator
        opened={ulogaIzAdrese === 'organizator'}
        onClose={zatvoriModal}
      />
    </>
  );
}
