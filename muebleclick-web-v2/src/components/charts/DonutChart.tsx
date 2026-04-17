import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DonutDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DonutDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
}

const DEFAULT_COLORS = ['#1A3A2A', '#C9A84C', '#3D7A55', '#E8C97A', '#52A871', '#B8860B'];

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-xl border border-[var(--color-border)] p-3 text-sm">
      <p className="font-semibold">{payload[0].name}</p>
      <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
        {payload[0].value} ({((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%)
      </p>
    </div>
  );
}

export function DonutChart({
  data, height = 200, innerRadius = 55, outerRadius = 80, showLegend,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const enriched = data.map((d) => ({ ...d, total }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={enriched}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={3}
          dataKey="value"
          strokeWidth={0}
        >
          {enriched.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            formatter={(value) => <span className="text-xs text-[var(--color-foreground-mid)]">{value}</span>}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
