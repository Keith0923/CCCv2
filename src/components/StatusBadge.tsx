const normalize = (value: string) => value.toLowerCase();

function variant(value: string) {
  const v = normalize(value);
  if (['healthy', 'success', 'assigned', 'reachable'].includes(v)) return 'ok';
  if (['warning', 'partial', 'pending', 'intermittent', 'running'].includes(v)) return 'warn';
  if (['critical', 'failed', 'unassigned', 'unreachable', 'degraded'].includes(v)) return 'danger';
  return 'neutral';
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge badge-${variant(value)}`}>{value}</span>;
}
