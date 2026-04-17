import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  goldAccent?: boolean;
}

export function SectionCard({
  title, subtitle, actions, children, className, noPadding, goldAccent,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl card-shadow overflow-hidden',
        goldAccent && 'ring-1 ring-[rgba(201,168,76,0.2)]',
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-[var(--color-foreground)] leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5')}>{children}</div>
    </div>
  );
}
