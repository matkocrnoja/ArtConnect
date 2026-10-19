import { IconCurrencyBitcoin } from '@tabler/icons-react';
import { useState } from 'react';
import { Badge, Button, Flex, Group, Paper, Progress, Text, ThemeIcon } from '@mantine/core';
import classes from './Matko.module.css';

const TARGET = 150000;

export default function Matko() {
  const [btc, setBtc] = useState<number | null>(null);

  const fetchBtc = async () => {
    const res = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    const data = await res.json();
    setBtc(parseFloat(data.data.amount));
  };

  const percent = btc ? Math.min(100, (btc / TARGET) * 100) : 0;

  return (
    <Flex direction="column" justify="center" align="center" h="100vh" w="100vw">
      <Paper radius="md" withBorder className={classes.card} mt={20}>
        <ThemeIcon className={classes.icon} size={60} radius={60}>
          <IconCurrencyBitcoin size={32} stroke={1.5} />
        </ThemeIcon>

        <Text ta="center" fw={700} className={classes.title}>
          BTC price
        </Text>
        <Text c="dimmed" ta="center" fz="sm">
          Target: ${TARGET.toLocaleString()}
        </Text>

        <Group justify="space-between" mt="xs">
          <Text fz="sm" c="dimmed">
            Progress
          </Text>
          <Text fz="sm" c="dimmed">
            {percent.toFixed(1)}%
          </Text>
        </Group>

        <Progress value={percent} mt={5} aria-label="BTC progress to target" />

        <Group justify="space-between" mt="md">
          <Text fz="sm">{btc ? `$${btc.toLocaleString()}` : '—'}</Text>
          <Badge size="sm">BTC-USD</Badge>
        </Group>

        <Button fullWidth mt="md" onClick={fetchBtc}>
          Get BTC price
        </Button>
      </Paper>
    </Flex>
  );
}
