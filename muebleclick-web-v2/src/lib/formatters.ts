import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatMXN(value: number | string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatMXNFull(value: number | string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(Number(value));
}

export function formatNumber(value: number | string): string {
  return new Intl.NumberFormat('es-MX').format(Number(value));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return `Hoy, ${format(d, 'HH:mm')}`;
  if (isYesterday(d)) return `Ayer, ${format(d, 'HH:mm')}`;
  if (isThisWeek(d)) return format(d, "EEEE, HH:mm", { locale: es });
  if (isThisMonth(d)) return format(d, "d MMM, HH:mm", { locale: es });
  return format(d, "d MMM yyyy", { locale: es });
}

export function formatDateShort(date: string | Date): string {
  return format(new Date(date), "d/MM/yyyy", { locale: es });
}

export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
}

export function formatRelative(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(date);
}

export function compactMXN(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return formatMXN(value);
}

export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('');
}
