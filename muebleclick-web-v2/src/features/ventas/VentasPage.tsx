import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { TrendingUp, Filter, Eye, Download, RefreshCw } from 'lucide-react';
import { isThisMonth, isThisWeek, isToday } from 'date-fns';
import { GET_VENTAS, GET_DETALLE_VENTA } from '@/graphql/ventas';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/shared/DataTable';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMXN, formatDate, compactMXN } from '@/lib/formatters';
import { subDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Venta, EstadoVenta } from '@/types';

const ESTADOS: EstadoVenta[] = ['Completada', 'Reembolsada', 'Cancelada'];

function VentaDetail({ venta, onClose }: { venta: Venta; onClose: () => void }) {
  const { data: detRaw, loading } = useQuery(GET_DETALLE_VENTA, {
    variables: { id_venta: venta.id_venta },
  });
  const detData = detRaw as any;
  const detalles = detData?.detalleVenta ?? [];

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">Venta #{venta.id_venta}</DialogTitle>
            <StatusBadge status={venta.estado_venta} />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Cliente</p>
              <p className="font-medium">{venta.cliente?.usuario?.nombre ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Fecha</p>
              <p className="font-medium">{formatDate(venta.fecha_venta)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Vendedor</p>
              <p className="font-medium">{venta.vendedor?.usuario?.nombre ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Método de pago</p>
              <p className="font-medium">{venta.metodo_pago?.tipo_pago ?? '—'}</p>
            </div>
            {venta.cupon && (
              <div className="col-span-2">
                <p className="text-xs text-[var(--color-muted-foreground)]">Cupón</p>
                <p className="font-medium text-amber-700">{venta.cupon.codigo} ({venta.cupon.descuento_porcentaje}% off)</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">
              Productos
            </p>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 skeleton-shimmer" />)}
              </div>
            ) : detalles.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">Sin detalles</p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d: any) => (
                  <div key={d.id_detalle_venta} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--color-background)]">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{d.producto?.nombre}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{d.cantidad} × {formatMXN(d.precio_unitario)}</p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{formatMXN(d.subtotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-[var(--color-foreground-mid)]">
              <span>Subtotal</span>
              <span>{formatMXN(venta.sub_total ?? venta.total_venta)}</span>
            </div>
            {(venta.descuento ?? 0) > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Descuento</span>
                <span>-{formatMXN(venta.descuento!)}</span>
              </div>
            )}
            {(venta.comision ?? 0) > 0 && (
              <div className="flex justify-between text-amber-600">
                <span>Comisión</span>
                <span>{formatMXN(venta.comision!)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-1 border-t border-[var(--color-border)]">
              <span>Total</span>
              <span className="text-[var(--color-primary)]">{formatMXN(venta.total_venta)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function buildChartData(ventas: Venta[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    days[format(d, 'EEE', { locale: es })] = 0;
  }
  ventas.forEach((v) => {
    if (isThisWeek(new Date(v.fecha_venta))) {
      const label = format(new Date(v.fecha_venta), 'EEE', { locale: es });
      if (label in days) days[label] += Number(v.total_venta);
    }
  });
  return Object.entries(days).map(([label, ventas]) => ({ label, ventas }));
}

export default function VentasPage() {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: raw, loading, refetch } = useQuery(GET_VENTAS);
  const data = raw as any;
  const ventas: Venta[] = data?.ventas ?? [];

  const filtered = useMemo(() => {
    let list = ventas;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((v) =>
        String(v.id_venta).includes(q) ||
        v.cliente?.usuario?.nombre?.toLowerCase().includes(q) ||
        v.vendedor?.usuario?.nombre?.toLowerCase().includes(q),
      );
    }
    if (estadoFilter) list = list.filter((v) => v.estado_venta === estadoFilter);
    if (periodFilter === 'today') list = list.filter((v) => isToday(new Date(v.fecha_venta)));
    if (periodFilter === 'week')  list = list.filter((v) => isThisWeek(new Date(v.fecha_venta)));
    if (periodFilter === 'month') list = list.filter((v) => isThisMonth(new Date(v.fecha_venta)));
    return [...list].sort((a, b) =>
      new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime(),
    );
  }, [ventas, debouncedSearch, estadoFilter, periodFilter]);

  const metrics = useMemo(() => {
    const mes = ventas.filter((v) => isThisMonth(new Date(v.fecha_venta)));
    const hoy = ventas.filter((v) => isToday(new Date(v.fecha_venta)));
    return {
      totalMes: mes.reduce((s, v) => s + Number(v.total_venta), 0),
      totalHoy: hoy.reduce((s, v) => s + Number(v.total_venta), 0),
      comisionesMes: mes.reduce((s, v) => s + Number(v.comision ?? 0), 0),
      countMes: mes.length,
      completadas: ventas.filter((v) => v.estado_venta === 'Completada').length,
    };
  }, [ventas]);

  const chartData = useMemo(() => buildChartData(ventas), [ventas]);

  const columns = [
    {
      key: 'id_venta', header: '# Venta', sortable: true,
      render: (v: Venta) => <span className="font-mono text-sm font-semibold">#{v.id_venta}</span>,
    },
    {
      key: 'fecha_venta', header: 'Fecha', sortable: true,
      render: (v: Venta) => <span className="text-xs text-[var(--color-foreground-mid)]">{formatDate(v.fecha_venta)}</span>,
    },
    {
      key: 'cliente', header: 'Cliente',
      render: (v: Venta) => (
        <div>
          <p className="text-sm font-medium">{v.cliente?.usuario?.nombre ?? '—'}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">{v.cliente?.usuario?.correo}</p>
        </div>
      ),
    },
    {
      key: 'vendedor', header: 'Vendedor',
      render: (v: Venta) => (
        <div>
          <p className="text-sm">{v.vendedor?.usuario?.nombre ?? '—'}</p>
          {v.vendedor?.codigo_vendedor && (
            <p className="text-[10px] font-mono text-[var(--color-muted-foreground)]">{v.vendedor.codigo_vendedor}</p>
          )}
        </div>
      ),
    },
    {
      key: 'metodo_pago', header: 'Pago',
      render: (v: Venta) => (
        <span className="text-xs text-[var(--color-foreground-mid)]">{v.metodo_pago?.tipo_pago ?? '—'}</span>
      ),
    },
    {
      key: 'estado_venta', header: 'Estado', sortable: true,
      render: (v: Venta) => <StatusBadge status={v.estado_venta} />,
    },
    {
      key: 'comision', header: 'Comisión', align: 'right' as const,
      render: (v: Venta) => (
        <span className="text-xs font-medium text-amber-700">{formatMXN(v.comision ?? 0)}</span>
      ),
    },
    {
      key: 'total_venta', header: 'Total', sortable: true, align: 'right' as const,
      render: (v: Venta) => (
        <span className="text-sm font-bold text-[var(--color-primary)]">{formatMXN(v.total_venta)}</span>
      ),
    },
    {
      key: 'acciones', header: '',
      render: (v: Venta) => (
        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg"
          onClick={(e) => { e.stopPropagation(); setSelectedVenta(v); }}>
          <Eye className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle={`${filtered.length} ventas · análisis de ingresos`}
        actions={
          <Button variant="outline" className="rounded-xl h-9 text-sm gap-2" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" /> Actualizar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        <KPICard title="Ventas hoy" value={formatMXN(metrics.totalHoy)} icon={TrendingUp} variant="green" loading={loading} />
        <KPICard title="Ventas del mes" value={compactMXN(metrics.totalMes)} icon={TrendingUp} variant="gold" loading={loading} />
        <KPICard title="Transacciones mes" value={metrics.countMes} icon={TrendingUp} variant="blue" loading={loading} />
        <KPICard title="Completadas" value={metrics.completadas} icon={TrendingUp} variant="teal" loading={loading} />
        <KPICard title="Comisiones mes" value={formatMXN(metrics.comisionesMes)} icon={TrendingUp} variant="purple" loading={loading} className="col-span-2 sm:col-span-1" />
      </div>

      {/* Chart */}
      <SectionCard title="Ventas — esta semana" subtitle="Ingresos diarios" className="mb-6">
        {loading
          ? <Skeleton className="h-44 skeleton-shimmer" />
          : <RevenueChart data={chartData} height={180} />
        }
      </SectionCard>

      <SectionCard noPadding>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por #, cliente o vendedor..." className="flex-1" />
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-32 h-9 rounded-xl text-sm">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-36 h-9 rounded-xl text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {ESTADOS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loading}
          pageSize={12}
          emptyMessage="Sin ventas encontradas"
          onRowClick={(v: any) => setSelectedVenta(v)}
        />
      </SectionCard>

      {selectedVenta && (
        <VentaDetail venta={selectedVenta} onClose={() => setSelectedVenta(null)} />
      )}
    </div>
  );
}
