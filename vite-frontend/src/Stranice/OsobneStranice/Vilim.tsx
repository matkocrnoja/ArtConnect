import { Button, Container, Group, Text, Title } from '@mantine/core';
import { Illustration } from './vilim_modules/Illustration';
import classes from './vilim_modules/ServerOverload.module.css';

export default function Vilim() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.inner}>
          <Illustration className={classes.image} />
          <div className={classes.content}>
            <Title className={classes.title}>All of our servers are busy</Title>
            <Text size="lg" ta="center" className={classes.description}>
              We cannot handle your request right now, please wait for a couple of minutes and
              refresh the page. Our team is already working on this issue.
            </Text>
            <Group justify="center">
              <Button size="md" variant="white">
                Refresh the page
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
}