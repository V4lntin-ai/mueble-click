/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { BadgeDollarSign, TrendingUp, Users, Filter } from 'lucide-react';
import { isThisMonth } from 'date-fns';
import { GET_COMISIONES } from '@/graphql/comisiones';
import { GET_EMPLEADOS } from '@/graphql/empleados';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { DataTable } from '@/components/shared/DataTable';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMXN, formatDate, compactMXN, initials } from '@/lib/formatters';
import type { Comision } from '@/types';

export default function ComisionesPage() {
  const [search, setSearch] = useState('');
  const [empleadoFilter, setEmpleadoFilter] = useState<string>('');
  const debouncedSearch = useDebounce(search, 250);

  const { data: comRaw, loading } = useQuery(GET_COMISIONES);
  const { data: empRaw } = useQuery(GET_EMPLEADOS);
  const comData = comRaw as any;
  const empData = empRaw as any;

  const comisiones: Comision[] = comData?.comisiones ?? [];
  const empleados = (empData?.empleados ?? []).filter((e: any) => e.es_vendedor);

  const filtered = useMemo(() => {
    let list = comisiones;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((c) =>
        c.empleado?.usuario?.nombre?.toLowerCase().includes(q) ||
        c.empleado?.codigo_vendedor?.toLowerCase().includes(q),
      );
    }
    if (empleadoFilter) list = list.filter((c) => String(c.empleado?.id_usuario) === empleadoFilter);
    return [...list].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [comisiones, debouncedSearch, empleadoFilter]);

  const metrics = useMemo(() => {
    const mes = comisiones.filter((c) => isThisMonth(new Date(c.fecha)));
    const totalMes = mes.reduce((s, c) => s + Number(c.monto), 0);
    const totalAll = comisiones.reduce((s, c) => s + Number(c.monto), 0);
    const byEmpleado: Record<string, number> = {};
    comisiones.forEach((c) => {
      const nombre = c.empleado?.usuario?.nombre ?? 'N/A';
      byEmpleado[nombre] = (byEmpleado[nombre] ?? 0) + Number(c.monto);
    });
    return { totalMes, totalAll, countMes: mes.length, byEmpleado };
  }, [comisiones]);

  const chartData = useMemo(() =>
    Object.entries(metrics.byEmpleado)
      .map(([label, value]) => ({ label: label.split(' ')[0], value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8),
    [metrics.byEmpleado],
  );

  const columns = [
    {
      key: 'empleado', header: 'Vendedor',
      render: (c: Comision) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #B8860B)', color: '#0E2418' }}>
            {c.empleado?.usuario?.nombre ? initials(c.empleado.usuario.nombre) : 'V'}
          </div>
          <div>
            <p className="text-sm font-semibold">{c.empleado?.usuario?.nombre ?? '—'}</p>
            {c.empleado?.codigo_vendedor && (
              <p className="text-[10px] font-mono text-[var(--color-muted-foreground)]">{c.empleado.codigo_vendedor}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'fecha', header: 'Fecha', sortable: true,
      render: (c: Comision) => <span className="text-xs text-[var(--color-foreground-mid)]">{formatDate(c.fecha)}</span>,
    },
    {
      key: 'venta', header: 'Venta',
      render: (c: Comision) => (
        <div>
          <span className="text-sm font-mono">#{c.venta?.id_venta ?? '—'}</span>
          {c.venta?.total_venta && (
            <p className="text-xs text-[var(--color-muted-foreground)]">{formatMXN(c.venta.total_venta)}</p>
          )}
        </div>
      ),
    },
    {
      key: 'sucursal', header: 'Sucursal',
      render: (c: Comision) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {c.empleado?.sucursal?.nombre_sucursal ?? '—'}
        </span>
      ),
    },
    {
      key: 'comision_pct', header: 'Tasa',
      render: (c: Comision) => (
        <span className="text-xs font-medium text-[var(--color-foreground-mid)]">
          {c.empleado?.comision_pct != null ? `${c.empleado.comision_pct}%` : '—'}
        </span>
      ),
    },
    {
      key: 'monto', header: 'Comisión', sortable: true, align: 'right' as const,
      render: (c: Comision) => (
        <span className="text-sm font-bold" style={{ color: 'var(--color-gold-600)' }}>
          {formatMXN(c.monto)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Comisiones" subtitle="Seguimiento de comisiones por vendedor" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KPICard title="Comisiones este mes" value={formatMXN(metrics.totalMes)} icon={BadgeDollarSign} variant="gold" loading={loading} />
        <KPICard title="Total acumulado" value={compactMXN(metrics.totalAll)} icon={TrendingUp} variant="green" loading={loading} />
        <KPICard title="Transacciones mes" value={metrics.countMes} icon={BadgeDollarSign} variant="blue" loading={loading} />
        <KPICard title="Vendedores activos" value={empleados.length} icon={Users} variant="purple" loading={loading} />
      </div>

      {chartData.length > 0 && (
        <SectionCard title="Top vendedores" subtitle="Total de comisiones acumuladas" className="mb-6">
          <BarChartComponent data={chartData} height={180} currency />
        </SectionCard>
      )}

      <SectionCard noPadding>
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar vendedor..." className="flex-1" />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Select value={empleadoFilter} onValueChange={setEmpleadoFilter}>
              <SelectTrigger className="w-44 h-9 rounded-xl text-sm">
                <SelectValue placeholder="Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {empleados.map((e: any) => (
                  <SelectItem key={e.id_usuario} value={String(e.id_usuario)}>
                    {e.usuario?.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loading}
          pageSize={12}
          emptyMessage="Sin comisiones registradas"
        />
      </SectionCard>
    </div>
  );
}
