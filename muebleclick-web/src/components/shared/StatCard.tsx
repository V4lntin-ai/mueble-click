import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  loading?: boolean;
  color?: 'green' | 'brown' | 'blue' | 'orange';
}

const gradients = {
  green:  'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)',
  brown:  'linear-gradient(135deg, #A0522D 0%, #6B4226 100%)',
  blue:   'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
  orange: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
};

const softBg = {
  green:  'rgba(45,106,79,0.06)',
  brown:  'rgba(160,82,45,0.06)',
  blue:   'rgba(37,99,235,0.06)',
  orange: 'rgba(234,88,12,0.06)',
};

const borderColor = {
  green:  'rgba(45,106,79,0.15)',
  brown:  'rgba(160,82,45,0.15)',
  blue:   'rgba(37,99,235,0.15)',
  orange: 'rgba(234,88,12,0.15)',
};

export function StatCard({
  title, value, subtitle, icon: Icon, trend, loading, color = 'green',
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)' }}>
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-8 w-28 mb-2" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-default"
      style={{
        background: `linear-gradient(135deg, white 0%, ${softBg[color].replace('0.06', '0.3')} 100%)`,
        border: `1px solid ${borderColor[color]}`,
        boxShadow: `0 2px 8px ${softBg[color]}, 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)`,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-1.5">
            {title}
          </p>
          <p className="text-3xl font-bold text-(--color-foreground) leading-none tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-2">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-semibold',
              trend >= 0 ? 'text-emerald-600' : 'text-red-500'
            )}>
              {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}% vs mes anterior
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg"
          style={{ background: gradients[color] }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}