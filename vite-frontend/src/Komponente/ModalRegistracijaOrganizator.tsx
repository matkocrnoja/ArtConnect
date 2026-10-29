import { Modal, TextInput, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';

interface Props {
  opened: boolean;
  onClose: () => void;
}

function ModalRegistracijaOrganizator({ opened, onClose }: Props) {
  const form = useForm({
    initialValues: {
      ime: '',
      prezime: '',
      nazivOrganizacije: '',
    },
    validate: {
      ime: (v) => (v.trim() ? null : 'Ime je obavezno'),
      prezime: (v) => (v.trim() ? null : 'Prezime je obavezno'),
      nazivOrganizacije: (v) => (v.trim() ? null : 'Naziv organizacije je obavezan'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    console.log('POST /register/organizator', values);
    // await fetch('/register/organizator', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values),
    // });
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Registracija organizatora" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Ime" {...form.getInputProps('ime')} />
          <TextInput label="Prezime" {...form.getInputProps('prezime')} />
          <TextInput label="Naziv organizacije" {...form.getInputProps('nazivOrganizacije')} />
          <Button type="submit">Podnesi registraciju</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default ModalRegistracijaOrganizator;