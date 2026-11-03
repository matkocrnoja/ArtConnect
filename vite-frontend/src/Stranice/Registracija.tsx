import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Group, Center } from '@mantine/core';
import ModalRegistracijaUmjetnik from '../Komponente/ModalRegistracijaUmjetnik';
import ModalRegistracijaOrganizator from '../Komponente/ModalRegistracijaOrganizator';
import { API_URL } from '../api';

type Uloga = 'umjetnik' | 'organizator' | null;

function Registracija() {
  // Ulogu određuje Google prijava: backend preusmjerava na /registracija?uloga=...
  const [parametri] = useSearchParams();
  const ulogaIzPrijave = parametri.get('uloga');
  const pocetnaUloga: Uloga =
    ulogaIzPrijave === 'umjetnik' || ulogaIzPrijave === 'organizator' ? ulogaIzPrijave : null;

  const [uloga, setUloga] = useState<Uloga>(pocetnaUloga);
  const zatvori = () => setUloga(null);

  // Forma radi samo nakon Google prijave, pa bez uloge u adresi gumb prvo vodi na Google.
  const odaberi = (odabrana: 'umjetnik' | 'organizator') => {
    if (pocetnaUloga) setUloga(odabrana);
    else window.location.assign(`${API_URL}/auth/google/login?uloga=${odabrana}`);
  };

  return (
    <>
      <Center mih="100vh">
        <Group>
            {pocetnaUloga !== 'organizator' && (
              <Button onClick={() => odaberi('umjetnik')}>Registriraj se kao umjetnik</Button>
            )}
            {pocetnaUloga !== 'umjetnik' && (
              <Button onClick={() => odaberi('organizator')}>Registriraj se kao organizator</Button>
            )}
        </Group>
      </Center>

      <ModalRegistracijaUmjetnik opened={uloga === 'umjetnik'} onClose={zatvori} />
      <ModalRegistracijaOrganizator opened={uloga === 'organizator'} onClose={zatvori} />
    </>
  );
}

export default Registracija;