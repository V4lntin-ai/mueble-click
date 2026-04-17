import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type KPIVariant = 'green' | 'gold' | 'blue' | 'red' | 'purple' | 'teal';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
  variant?: KPIVariant;
  className?: string;
}

const variantConfig: Record<KPIVariant, {
  gradient: string;
  iconBg: string;
  iconColor: string;
  softBorder: string;
  softBg: string;
  glowColor: string;
}> = {
  green: {
    gradient: 'linear-gradient(135deg, #1A3A2A 0%, #2D5A3D 100%)',
    iconBg: 'linear-gradient(135deg, #1A3A2A 0%, #2D5A3D 100%)',
    iconColor: '#74C48D',
    softBorder: 'rgba(45,90,61,0.18)',
    softBg: 'rgba(45,90,61,0.04)',
    glowColor: 'rgba(26,58,42,0.15)',
  },
  gold: {
    gradient: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #B8860B 100%)',
    iconBg: 'linear-gradient(135deg, #C9A84C 0%, #B8860B 100%)',
    iconColor: '#0E2418',
    softBorder: 'rgba(201,168,76,0.25)',
    softBg: 'rgba(201,168,76,0.06)',
    glowColor: 'rgba(201,168,76,0.2)',
  },
  blue: {
    gradient: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
    iconBg: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)',
    iconColor: '#BFDBFE',
    softBorder: 'rgba(37,99,235,0.18)',
    softBg: 'rgba(37,99,235,0.04)',
    glowColor: 'rgba(37,99,235,0.15)',
  },
  red: {
    gradient: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
    iconBg: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
    iconColor: '#FECACA',
    softBorder: 'rgba(220,38,38,0.18)',
    softBg: 'rgba(220,38,38,0.04)',
    glowColor: 'rgba(220,38,38,0.15)',
  },
  purple: {
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
    iconBg: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%)',
    iconColor: '#DDD6FE',
    softBorder: 'rgba(109,40,217,0.18)',
    softBg: 'rgba(109,40,217,0.04)',
    glowColor: 'rgba(109,40,217,0.15)',
  },
  teal: {
    gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    iconBg: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)',
    iconColor: '#99F6E4',
    softBorder: 'rgba(15,118,110,0.18)',
    softBg: 'rgba(15,118,110,0.04)',
    glowColor: 'rgba(15,118,110,0.15)',
  },
};

export function KPICard({
  title, value, subtitle, icon: Icon, trend, trendLabel, loading, variant = 'green', className,
}: KPICardProps) {
  const cfg = variantConfig[variant];

  if (loading) {
    return (
      <div className={cn('rounded-2xl bg-white p-5 card-shadow', className)}>
        <Skeleton className="h-3 w-24 mb-4 skeleton-shimmer" />
        <Skeleton className="h-9 w-32 mb-2 skeleton-shimmer" />
        <Skeleton className="h-3 w-20 skeleton-shimmer" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group rounded-2xl p-5 bg-white transition-all duration-300 cursor-default',
        'hover:-translate-y-1 hover:card-shadow-gold',
        className,
      )}
      style={{
        border: `1px solid ${cfg.softBorder}`,
        boxShadow: `0 1px 3px rgba(0,0,0,0.04), 0 4px 16px ${cfg.glowColor}`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)] mb-2">
            {title}
          </p>
          <p className="text-[2rem] font-bold leading-none tracking-tight text-[var(--color-foreground)] mb-1.5">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[var(--color-muted-foreground)]">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-semibold',
              trend >= 0 ? 'text-emerald-600' : 'text-red-500',
            )}>
              {trend >= 0
                ? <TrendingUp className="w-3.5 h-3.5" />
                : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend)}% {trendLabel ?? 'vs mes anterior'}
            </div>
          )}
        </div>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
          style={{ background: cfg.iconBg }}
        >
          <Icon className="w-5.5 h-5.5" style={{ color: cfg.iconColor }} />
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="mt-4 h-0.5 rounded-full overflow-hidden" style={{ background: cfg.softBorder }}>
        <div
          className="h-full rounded-full transition-all duration-700 group-hover:w-full"
          style={{ background: cfg.iconBg, width: '0%' }}
        />
      </div>
    </div>
  );
}
