import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { compactMXN } from '@/lib/formatters';

interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartComponentProps {
  data: BarDataPoint[];
  height?: number;
  currency?: boolean;
  barColor?: string;
  highlightMax?: boolean;
}

function CustomTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-3 text-sm">
      <p className="font-semibold text-[var(--color-foreground)] mb-1">{label}</p>
      <p className="text-xs text-[var(--color-muted-foreground)]">
        {currency ? compactMXN(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
}

export function BarChartComponent({
  data, height = 200, currency = false, barColor = '#1A3A2A', highlightMax = true,
}: BarChartComponentProps) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={currency ? compactMXN : undefined}
        />
        <Tooltip content={(props) => <CustomTooltip {...props} currency={currency} />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.color ?? (highlightMax && entry.value === max ? '#C9A84C' : barColor)}
              fillOpacity={entry.value === max || !highlightMax ? 1 : 0.65}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
