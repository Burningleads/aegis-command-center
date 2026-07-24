export function formatPercentage(v: number | undefined | null) {
  if (v === undefined || v === null) return '—';
  return `${Math.round(v * 100)}%`;
}
