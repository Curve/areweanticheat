import { ThemeIcon, Tooltip } from '@mantine/core';
import { Award } from 'tabler-icons-react';

interface NativeBadgeProps {
  native: boolean;
}

export default function NativeBadge({ native }: NativeBadgeProps) {
  if (native) {
    return (
      <Tooltip withArrow label="Also runs native">
        <ThemeIcon color="green" radius="xl">
          <Award size={16} />
        </ThemeIcon>
      </Tooltip>
    );
  } else {
    return <></>;
  }
}
