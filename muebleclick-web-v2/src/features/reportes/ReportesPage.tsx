import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { BarChart3, TrendingUp, ShoppingCart, Package, Users, MapPin } from 'lucide-react';
import { isThisMonth, isThisWeek, format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { GET_VENTAS } from '@/graphql/ventas';
import { GET_PEDIDOS } from '@/graphql/pedidos';
import { GET_PRODUCTOS } from '@/graphql/productos';
import { GET_EMPLEADOS } from '@/graphql/empleados';
import { GET_SUCURSALES } from '@/graphql/sucursales';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { formatMXN, compactMXN, formatPercent } from '@/lib/formatters';
import type { Venta, Pedido } from '@/types';

function buildMonthlyTrend(ventas: Venta[]) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const label = format(d, 'MMM', { locale: es });
    const month = d.getMonth();
    const year = d.getFullYear();
    const total = ventas
      .filter((v) => {
        const vd = new Date(v.fecha_venta);
        return vd.getMonth() === month && vd.getFullYear() === year;
      })
      .reduce((s, v) => s + Number(v.total_venta), 0);
    return { label, ventas: total };
  });
}

export default function ReportesPage() {
  const { data: ventasRaw, loading: lv } = useQuery(GET_VENTAS);
  const { data: pedidosRaw, loading: lp } = useQuery(GET_PEDIDOS);
  const { data: productosRaw, loading: lprod } = useQuery(GET_PRODUCTOS);
  const { data: empRaw } = useQuery(GET_EMPLEADOS);
  const { data: sucRaw } = useQuery(GET_SUCURSALES);

  const ventasData = ventasRaw as any;
  const pedidosData = pedidosRaw as any;
  const productosData = productosRaw as any;
  const empData = empRaw as any;
  const sucData = sucRaw as any;

  const ventas: Venta[] = ventasData?.ventas ?? [];
  const pedidos: Pedido[] = pedidosData?.pedidos ?? [];

  const ventaMetrics = useMemo(() => {
    const mes = ventas.filter((v) => isThisMonth(new Date(v.fecha_venta)));
    const semana = ventas.filter((v) => isThisWeek(new Date(v.fecha_venta)));
    const totalMes = mes.reduce((s, v) => s + Number(v.total_venta), 0);
    const totalSemana = semana.reduce((s, v) => s + Number(v.total_venta), 0);
    const completadas = ventas.filter((v) => v.estado_venta === 'Completada').length;
    const tasaCompletadas = ventas.length > 0 ? (completadas / ventas.length) * 100 : 0;
    const comisionesMes = mes.reduce((s, v) => s + Number(v.comision ?? 0), 0);
    return { totalMes, totalSemana, completadas, tasaCompletadas, comisionesMes, totalVentas: ventas.length };
  }, [ventas]);

  const pedidoMetrics = useMemo(() => {
    const pendientes = pedidos.filter((p) => p.estado_pedido === 'Pendiente').length;
    const entregados = pedidos.filter((p) => p.estado_pedido === 'Entregado').length;
    const cancelados = pedidos.filter((p) => p.estado_pedido === 'Cancelado').length;
    const tasaEntrega = pedidos.length > 0 ? (entregados / pedidos.length) * 100 : 0;
    const promedio = pedidos.length > 0 ? pedidos.reduce((s, p) => s + Number(p.total), 0) / pedidos.length : 0;
    return { pendientes, entregados, cancelados, tasaEntrega, promedio, total: pedidos.length };
  }, [pedidos]);

  const monthlyTrend = useMemo(() => buildMonthlyTrend(ventas), [ventas]);

  const pedidosByEstado = useMemo(() => {
    const map: Record<string, number> = {};
    pedidos.forEach((p) => { map[p.estado_pedido] = (map[p.estado_pedido] ?? 0) + 1; });
    const colors: Record<string, string> = { Pendiente: '#F59E0B', Confirmado: '#3B82F6', Enviado: '#8B5CF6', Entregado: '#10B981', Cancelado: '#EF4444' };
    return Object.entries(map).map(([name, value]) => ({ name, value, color: colors[name] }));
  }, [pedidos]);

  const topProductos = useMemo(() => {
    const map: Record<string, number> = {};
    ventas.forEach((v) => { /* aggregate by vendor — approximate */ });
    const productos = productosData?.productos ?? [];
    const byCat: Record<string, number> = {};
    productos.forEach((p: any) => {
      const c = p.categoria ?? 'Sin categoría';
      byCat[c] = (byCat[c] ?? 0) + 1;
    });
    return Object.entries(byCat).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [productosData]);

  const topVendedores = useMemo(() => {
    const map: Record<string, { nombre: string; total: number; count: number }> = {};
    ventas.forEach((v) => {
      const nombre = v.vendedor?.usuario?.nombre ?? 'Sin asignar';
      if (!map[nombre]) map[nombre] = { nombre, total: 0, count: 0 };
      map[nombre].total += Number(v.total_venta);
      map[nombre].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [ventas]);

  const loading = lv || lp;

  return (
    <div>
      <PageHeader
        title="Reportes"
        subtitle="Análisis integral del desempeño del negocio"
      />

      <Tabs defaultValue="ventas">
        <TabsList className="mb-6 h-10 bg-white border border-[var(--color-border)] rounded-xl p-1">
          {[
            { value: 'ventas', label: 'Ventas', icon: TrendingUp },
            { value: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
            { value: 'productos', label: 'Catálogo', icon: Package },
            { value: 'operaciones', label: 'Operaciones', icon: BarChart3 },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}
              className="flex items-center gap-1.5 text-sm rounded-lg data-[state=active]:bg-[var(--color-primary)] data-[state=active]:text-white">
              <Icon className="w-3.5 h-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Ventas ── */}
        <TabsContent value="ventas" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard title="Total ventas" value={ventaMetrics.totalVentas} icon={TrendingUp} variant="green" loading={loading} />
            <KPICard title="Ventas del mes" value={compactMXN(ventaMetrics.totalMes)} icon={TrendingUp} variant="gold" loading={loading} />
            <KPICard title="Esta semana" value={compactMXN(ventaMetrics.totalSemana)} icon={TrendingUp} variant="blue" loading={loading} />
            <KPICard title="Completadas" value={ventaMetrics.completadas} icon={TrendingUp} variant="teal" loading={loading} />
            <KPICard title="Tasa completadas" value={`${ventaMetrics.tasaCompletadas.toFixed(0)}%`} icon={TrendingUp} variant="purple" loading={loading} />
            <KPICard title="Comisiones mes" value={formatMXN(ventaMetrics.comisionesMes)} icon={TrendingUp} variant="gold" loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Tendencia de ingresos" subtitle="Últimos 6 meses">
              {loading ? <Skeleton className="h-48 skeleton-shimmer" /> : <RevenueChart data={monthlyTrend} height={200} />}
            </SectionCard>

            <SectionCard title="Top 5 vendedores" subtitle="Por volumen de ventas">
              {topVendedores.length === 0 ? (
                <p className="text-sm text-[var(--color-muted-foreground)] py-8 text-center">Sin datos de vendedores</p>
              ) : (
                <div className="space-y-3 mt-2">
                  {topVendedores.map((v, i) => {
                    const max = topVendedores[0]?.total ?? 1;
                    const pct = (v.total / max) * 100;
                    return (
                      <div key={v.nombre} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold"
                              style={{ background: i === 0 ? 'linear-gradient(135deg, #C9A84C, #B8860B)' : 'var(--color-background)', color: i === 0 ? '#0E2418' : 'var(--color-foreground-mid)' }}>
                              {i + 1}
                            </span>
                            <span className="font-medium">{v.nombre}</span>
                          </div>
                          <span className="font-semibold text-[var(--color-primary)]">{compactMXN(v.total)}</span>
                        </div>
                        <Progress value={pct} className="h-1.5" indicatorClassName={i === 0 ? 'bg-gradient-gold' : 'bg-gradient-primary'} />
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>
        </TabsContent>

        {/* ── Pedidos ── */}
        <TabsContent value="pedidos" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard title="Total pedidos" value={pedidoMetrics.total} icon={ShoppingCart} variant="green" loading={loading} />
            <KPICard title="Pendientes" value={pedidoMetrics.pendientes} icon={ShoppingCart} variant="gold" loading={loading} />
            <KPICard title="Entregados" value={pedidoMetrics.entregados} icon={ShoppingCart} variant="teal" loading={loading} />
            <KPICard title="Cancelados" value={pedidoMetrics.cancelados} icon={ShoppingCart} variant="red" loading={loading} />
            <KPICard title="Tasa entrega" value={`${pedidoMetrics.tasaEntrega.toFixed(0)}%`} icon={ShoppingCart} variant="blue" loading={loading} />
            <KPICard title="Ticket promedio" value={formatMXN(pedidoMetrics.promedio)} icon={ShoppingCart} variant="purple" loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Distribución de estados">
              {pedidosByEstado.length === 0 ? (
                <p className="text-sm text-[var(--color-muted-foreground)] text-center py-8">Sin datos</p>
              ) : (
                <DonutChart data={pedidosByEstado} height={200} showLegend />
              )}
            </SectionCard>

            <SectionCard title="Resumen de operaciones">
              <div className="space-y-4 mt-2">
                {pedidosByEstado.map((d) => {
                  const pct = pedidoMetrics.total > 0 ? (d.value / pedidoMetrics.total) * 100 : 0;
                  return (
                    <div key={d.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{d.name}</span>
                        <span className="text-[var(--color-muted-foreground)]">{d.value} ({pct.toFixed(0)}%)</span>
                      </div>
                      <Progress value={pct} className="h-1.5" indicatorClassName="" style={{ '--tw-bg-opacity': 1 } as any} />
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* ── Catálogo ── */}
        <TabsContent value="productos" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard title="Total productos" value={productosData?.productos?.length ?? 0} icon={Package} variant="green" loading={lprod} />
            <KPICard title="Sucursales" value={sucData?.sucursales?.length ?? 0} icon={MapPin} variant="gold" loading={false} />
            <KPICard title="Empleados" value={empData?.empleados?.length ?? 0} icon={Users} variant="blue" loading={false} />
            <KPICard title="Vendedores" value={(empData?.empleados ?? []).filter((e: any) => e.es_vendedor).length} icon={Users} variant="teal" loading={false} />
          </div>

          <SectionCard title="Productos por categoría" subtitle="Distribución del catálogo">
            {lprod ? <Skeleton className="h-48 skeleton-shimmer" /> :
              topProductos.length === 0
                ? <p className="text-sm text-center text-[var(--color-muted-foreground)] py-8">Sin productos</p>
                : <BarChartComponent data={topProductos} height={200} />
            }
          </SectionCard>
        </TabsContent>

        {/* ── Operaciones ── */}
        <TabsContent value="operaciones" className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard title="Ingresos mensuales" subtitle="Últimos 6 meses">
              {loading ? <Skeleton className="h-48 skeleton-shimmer" /> : <RevenueChart data={monthlyTrend} height={200} />}
            </SectionCard>
            <SectionCard title="Estado de pedidos">
              {pedidosByEstado.length === 0
                ? <p className="text-sm text-center text-[var(--color-muted-foreground)] py-8">Sin pedidos</p>
                : <DonutChart data={pedidosByEstado} height={200} showLegend />
              }
            </SectionCard>
          </div>

          <SectionCard title="Indicadores clave de desempeño">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Tasa de conversión (ventas)', value: ventaMetrics.tasaCompletadas, color: 'bg-gradient-primary' },
                { label: 'Tasa de entrega (pedidos)', value: pedidoMetrics.tasaEntrega, color: 'bg-gradient-gold' },
                { label: 'Sucursales activas', value: sucData ? (sucData.sucursales?.filter((s: any) => s.activo).length / Math.max(sucData.sucursales?.length, 1)) * 100 : 0, color: 'bg-teal-500' },
              ].map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl bg-[var(--color-background)]">
                  <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{kpi.label}</p>
                  <p className="text-2xl font-bold text-[var(--color-foreground)] mb-2">{kpi.value.toFixed(1)}%</p>
                  <Progress value={kpi.value} className="h-2" indicatorClassName={kpi.color} />
                </div>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
