import { RangeSlider } from '@mantine/core'

export default function Mia() {
    return (
    <RangeSlider
      color="blue"
      defaultValue={[20, 60]}
      marks={[
        { value: 20, label: '20%' },
        { value: 50, label: '50%' },
        { value: 80, label: '80%' },
      ]}
    />
  );
}