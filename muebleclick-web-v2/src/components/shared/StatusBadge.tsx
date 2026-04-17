import { cn } from '@/lib/utils';
import type { EstadoPedido, EstadoVenta } from '@/types';

type Status = EstadoPedido | EstadoVenta | string;

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const statusMap: Record<string, { bg: string; text: string; dot: string; label?: string }> = {
  Pendiente:   { bg: 'bg-amber-50 border border-amber-200',   text: 'text-amber-700',   dot: 'bg-amber-500' },
  Confirmado:  { bg: 'bg-blue-50 border border-blue-200',     text: 'text-blue-700',    dot: 'bg-blue-500' },
  Enviado:     { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700',  dot: 'bg-purple-500' },
  Entregado:   { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Cancelado:   { bg: 'bg-red-50 border border-red-200',       text: 'text-red-600',     dot: 'bg-red-500' },
  Completada:  { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Reembolsada: { bg: 'bg-gray-50 border border-gray-200',     text: 'text-gray-600',    dot: 'bg-gray-400' },
  Activo:      { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Inactivo:    { bg: 'bg-gray-50 border border-gray-200',     text: 'text-gray-500',    dot: 'bg-gray-400' },
  Vendedor:    { bg: 'bg-blue-50 border border-blue-200',     text: 'text-blue-700',    dot: 'bg-blue-500' },
  Admin:       { bg: 'bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.3)]', text: 'text-[#9A6F00]', dot: 'bg-[#C9A84C]' },
  Propietario: { bg: 'bg-[rgba(26,58,42,0.08)] border border-[rgba(26,58,42,0.2)]',   text: 'text-[#1A3A2A]', dot: 'bg-[#2D5A3D]' },
  Empleado:    { bg: 'bg-sky-50 border border-sky-200',       text: 'text-sky-700',     dot: 'bg-sky-500' },
  Cliente:     { bg: 'bg-orange-50 border border-orange-200', text: 'text-orange-700',  dot: 'bg-orange-500' },
  Envio:       { bg: 'bg-purple-50 border border-purple-200', text: 'text-purple-700',  dot: 'bg-purple-500', label: 'Envío' },
  Recoleccion: { bg: 'bg-teal-50 border border-teal-200',     text: 'text-teal-700',    dot: 'bg-teal-500',   label: 'Recolección' },
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const cfg = statusMap[status] ?? {
    bg: 'bg-gray-50 border border-gray-200',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      cfg.bg,
      cfg.text,
      className,
    )}>
      <span className={cn('rounded-full shrink-0', cfg.dot, size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5')} />
      {cfg.label ?? status}
    </span>
  );
}
