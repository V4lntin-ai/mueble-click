import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
      >
        <Icon className="w-7 h-7 text-[var(--color-accent)]" />
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-[var(--color-muted-foreground)] max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
