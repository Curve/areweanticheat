import { ThemeIcon } from '@mantine/core';
import { Check, Clock, Minus, QuestionMark, ThumbUp, X } from 'tabler-icons-react';
import { Status } from '../Classes';

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case Status.denied:
      return (
        <ThemeIcon color="red" radius="xl">
          <X size={18} />
        </ThemeIcon>
      );
    case Status.broken:
      return (
        <ThemeIcon color="orange" radius="xl">
          <Minus size={18} />
        </ThemeIcon>
      );
    case Status.supported:
      return (
        <ThemeIcon color="green" radius="xl">
          <Check size={18} />
        </ThemeIcon>
      );
    case Status.running:
      return (
        <ThemeIcon color="cyan" radius="xl">
          <ThumbUp size={18} />
        </ThemeIcon>
      );
    case Status.planned:
      return (
        <ThemeIcon color="violet" radius="xl">
          <Clock size={18} />
        </ThemeIcon>
      );
    default:
      return (
        <ThemeIcon color="gray" radius="xl">
          <QuestionMark size={18} />
        </ThemeIcon>
      );
  }
}
