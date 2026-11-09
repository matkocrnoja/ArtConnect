import { IconCheck, IconMacro, IconStarFilled, IconZoom } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Button, Container, Divider, Group, List, Text, ThemeIcon, Title, Image } from '@mantine/core';
import classes from './Home.module.css';

export default function Home() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <Image src="/images/logo.svg" alt="ArtConnect" h={80} w="auto" fit="contain" mb="xl" />

        <div className={classes.content}>
          <Title className={classes.title}>
            Dobrodošli na <span className={classes.highlight}>ArtConnect</span>
          </Title>
          <Text c="dimmed" mt="md">
            ArtConnect je web platforma namijenjena mladim umjetnicima koja im omogućuje
            predstavljanje vlastitog rada, pronalaženje umjetničkih natječaja i prilika za
            izlaganje te povezivanje s galerijama, kulturnim institucijama i organizatorima
            događanja. Cilj platforme je mladim umjetnicima olakšati ulazak u profesionalni svijet
            umjetnosti i omogućiti im da na jednom mjestu upravljaju svojim portfolijom i prijavama
            na različite umjetničke prilike.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconStarFilled size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Portfolio</b> - predstavi svoj rad i upravljaj njime na jednom mjestu
            </List.Item>
            <List.Item>
              <b>Natječaji i izložbe</b> - pronađi umjetničke prilike i prijavi se na njih
            </List.Item>
            <List.Item>
              <b>Povezivanje</b> - upoznaj galerije, kulturne institucije i organizatore događanja
            </List.Item>
          </List>

          <Group mt={30}>
            <Button component={Link} to="/prijava" radius="xl" size="md" className={classes.control}>
              Prijavi se
            </Button>
            <Button
              component={Link}
              to="/registracija"
              variant="default"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Registriraj se
            </Button>
          </Group>

          <Divider my={50} />

          <Title order={2} className={classes.subtitle}>
            Samo gledaš?
          </Title>
          <Text c="dimmed" mt="md">
            Za razgledavanje ti ne treba račun. Pretraži umjetnike, njihove radove te aktualne
            natječaje i izložbe, pa se registriraj tek kad poželiš sudjelovati.
          </Text>
          <Button variant="light" radius="xl" size="md" mt={30} className={classes.control} leftSection={<IconZoom/>}>
            Pretražuj umjetnike, radove, organizatore...
          </Button>
        </div>
      </div>
    </Container>
  );
}
