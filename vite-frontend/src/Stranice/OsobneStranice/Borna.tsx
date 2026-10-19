import { Chip, Stack, NumberInput } from '@mantine/core';

export default function Demo() {
  return (
    <Stack>
      <Chip color="orange" m="md" defaultChecked>
        Najdraža boja: narančasta
      </Chip>
      <NumberInput m="md" 
        size="s"
        radius="md"
        w={200}
        label="Koji ti je najdraži broj?"
        placeholder="Broj"
      />
    </Stack>
  );
}
