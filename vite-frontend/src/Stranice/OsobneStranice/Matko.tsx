import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './Matko.module.css';

export default function Matko() {
  return (
    <Container size={460} my={30}>
      <Title fw={100} ta="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <TextInput label="Your email" placeholder="me@mantine.dev" required />
        <Group justify="space-between" mt="lg" className={classes.controls}>
          <Anchor c="dimmed" size="sm" className={classes.control}>
            <Center inline>
              <Box ml={5}>Back to the login page</Box>
            </Center>
          </Anchor>
          <Button size={"md"}>Reset password</Button>
        </Group>
      </Paper>
    </Container>
  );
}