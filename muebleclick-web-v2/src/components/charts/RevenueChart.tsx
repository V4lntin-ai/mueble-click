import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { compactMXN } from '@/lib/formatters';

interface RevenueDataPoint {
  label: string;
  ventas: number;
  pedidos?: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  height?: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-3 text-sm">
      <p className="font-semibold text-[var(--color-foreground)] mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-[var(--color-muted-foreground)]">{entry.name === 'ventas' ? 'Ventas' : 'Pedidos'}:</span>
          <span className="font-semibold">{entry.name === 'ventas' ? compactMXN(entry.value) : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueChart({ data, height = 200 }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#1A3A2A" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#1A3A2A" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
          </linearGradient>
        </defs>
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
          tickFormatter={compactMXN}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="ventas"
          stroke="#1A3A2A"
          strokeWidth={2}
          fill="url(#colorVentas)"
          dot={false}
          activeDot={{ r: 4, fill: '#1A3A2A', strokeWidth: 0 }}
        />
        {data[0]?.pedidos !== undefined && (
          <Area
            type="monotone"
            dataKey="pedidos"
            stroke="#C9A84C"
            strokeWidth={2}
            fill="url(#colorPedidos)"
            dot={false}
            activeDot={{ r: 4, fill: '#C9A84C', strokeWidth: 0 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
