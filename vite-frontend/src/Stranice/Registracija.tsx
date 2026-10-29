import { useState } from 'react';
import { Button, Group, Center } from '@mantine/core';
import ModalRegistracijaUmjetnik from '../Komponente/ModalRegistracijaUmjetnik';
import ModalRegistracijaOrganizator from '../Komponente/ModalRegistracijaOrganizator';

type Uloga = 'umjetnik' | 'organizator' | null;

function Registracija() {
  const [uloga, setUloga] = useState<Uloga>(null);
  const zatvori = () => setUloga(null);

  return (
    <>
      <Center mih="100vh">
        <Group>
            <Button onClick={() => setUloga('umjetnik')}>Registriraj se kao umjetnik</Button>
            <Button onClick={() => setUloga('organizator')}>Registriraj se kao organizator</Button>
        </Group>    
      </Center>

      <ModalRegistracijaUmjetnik opened={uloga === 'umjetnik'} onClose={zatvori} />
      <ModalRegistracijaOrganizator opened={uloga === 'organizator'} onClose={zatvori} />
    </>
  );
}

export default Registracija;