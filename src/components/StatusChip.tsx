import { StatusBadge } from './StatusBadge';

export function StatusChip({ value }: { value: string }) {
  return <StatusBadge value={value} />;
}
