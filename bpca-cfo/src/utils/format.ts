export function formatIndianCurrency(value: number, prefix: string = '₹'): string {
  const abs = Math.abs(value);
  if (abs >= 10000000) {
    return `${prefix}${(value / 10000000).toFixed(1)} Cr`;
  }
  if (abs >= 100000) {
    return `${prefix}${(value / 100000).toFixed(1)} L`;
  }
  if (abs >= 1000) {
    return `${prefix}${(value / 1000).toFixed(1)} K`;
  }
  return `${prefix}${value.toFixed(0)}`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDays(value: number): string {
  return `${value}d`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getChangeColor(value: number): string {
  if (value > 0) return 'text-teal';
  if (value < 0) return 'text-red-400';
  return 'text-gray-400';
}

export function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (['ready', 'done', 'approved', 'live', 'configured', 'closed won'].includes(s)) return 'badge-ready';
  if (['review', 'in review', 'medium', 'amber'].includes(s)) return 'badge-review';
  if (['draft', 'grey', 'not configured', 'normal'].includes(s)) return 'badge-draft';
  if (['pending', 'queued', 'blue', 'prospecting', 'qualified'].includes(s)) return 'badge-pending';
  if (['high', 'high risk', 'exception', 'red', 'overdue'].includes(s)) return 'badge-high-risk';
  return 'badge-draft';
}

export function getHealthColor(score: number): string {
  if (score >= 80) return '#00D4B4';
  if (score >= 60) return '#C9A84C';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}
