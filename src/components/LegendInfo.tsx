import { ColorSwatch, DefaultMantineColor, Group, Text } from '@mantine/core';

interface LegendProps {
  color: DefaultMantineColor;
  name: string;
}

export default function Legend({ color, name }: LegendProps) {
  return (
    <Group>
      <ColorSwatch color={color} />
      <Text>{name}</Text>
    </Group>
  );
}
