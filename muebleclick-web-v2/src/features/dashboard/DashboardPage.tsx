/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Store, MapPin, ShoppingCart, TrendingUp, Users,
  Package, AlertCircle, BadgeDollarSign, Warehouse,
} from 'lucide-react';
import { isToday, isThisMonth, format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';
import { GET_DASHBOARD_PROPIETARIO, GET_DASHBOARD_ADMIN } from '@/graphql/dashboard';
import { PageHeader } from '@/components/shared/PageHeader';
import { KPICard } from '@/components/shared/KPICard';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { BarChartComponent } from '@/components/charts/BarChartComponent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMXN, formatDate, compactMXN } from '@/lib/formatters';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function buildDailyRevenue(ventas: any[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    days[format(d, 'EEE', { locale: es })] = 0;
  }
  ventas.forEach((v: any) => {
    const d = new Date(v.fecha_venta);
    if (isThisMonth(d)) {
      const label = format(d, 'EEE', { locale: es });
      if (label in days) days[label] += Number(v.total_venta);
    }
  });
  return Object.entries(days).map(([label, ventas]) => ({ label, ventas }));
}

function buildMonthlyRevenue(ventas: any[]) {
  const months: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = subDays(new Date(), i * 30);
    months[format(d, 'MMM', { locale: es })] = 0;
  }
  ventas.forEach((v: any) => {
    const label = format(new Date(v.fecha_venta), 'MMM', { locale: es });
    if (label in months) months[label] += Number(v.total_venta);
  });
  return Object.entries(months).map(([label, ventas]) => ({ label, ventas }));
}

function DashboardPropietario() {
  const { data: raw, loading, error } = useQuery(GET_DASHBOARD_PROPIETARIO);
  const data = raw as any;

  const metrics = useMemo(() => {
    if (!data) return null;
    const ventas = data.ventas ?? [];
    const pedidos = data.pedidos ?? [];
    const ventasHoy = ventas.filter((v: any) => isToday(new Date(v.fecha_venta)));
    const ventasMes = ventas.filter((v: any) => isThisMonth(new Date(v.fecha_venta)));
    const totalHoy = ventasHoy.reduce((s: number, v: any) => s + Number(v.total_venta), 0);
    const totalMes = ventasMes.reduce((s: number, v: any) => s + Number(v.total_venta), 0);
    const comisionesMes = ventasMes.reduce((s: number, v: any) => s + Number(v.comision ?? 0), 0);
    const pedidosPendientes = pedidos.filter((p: any) => p.estado_pedido === 'Pendiente').length;
    const sucursales = (data.misMueblerias ?? []).flatMap((m: any) => m.sucursales ?? []);
    const sucursalesActivas = sucursales.filter((s: any) => s.activo).length;
    const empleadosActivos = (data.empleados ?? []).filter((e: any) => e.activo).length;
    return {
      totalHoy, totalMes, comisionesMes,
      pedidosPendientes, sucursalesActivas,
      totalMueblerias: data.misMueblerias?.length ?? 0,
      totalProductos: data.productos?.length ?? 0,
      empleadosActivos,
      ventasHoyCount: ventasHoy.length,
    };
  }, [data]);

  const chartData = useMemo(() => buildDailyRevenue(data?.ventas ?? []), [data]);

  const pedidosByEstado = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.pedidos ?? []).forEach((p: any) => { map[p.estado_pedido] = (map[p.estado_pedido] ?? 0) + 1; });
    const colors: Record<string, string> = { Pendiente: '#F59E0B', Confirmado: '#3B82F6', Enviado: '#8B5CF6', Entregado: '#10B981', Cancelado: '#EF4444' };
    return Object.entries(map).map(([name, value]) => ({ name, value, color: colors[name] }));
  }, [data]);

  const categoriaVentas = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.productos ?? []).forEach((p: any) => { const c = p.categoria ?? 'Sin categoría'; map[c] = (map[c] ?? 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [data]);

  if (error) return <Alert variant="destructive"><AlertCircle className="w-4 h-4" /><AlertDescription>{error.message}</AlertDescription></Alert>;

  const recentVentas = [...(data?.ventas ?? [])].sort((a: any, b: any) => new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime()).slice(0, 7);
  const recentPedidos = [...(data?.pedidos ?? [])].sort((a: any, b: any) => new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()).slice(0, 7);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Ventas hoy" value={loading ? '—' : formatMXN(metrics?.totalHoy ?? 0)} subtitle={`${metrics?.ventasHoyCount ?? 0} transacciones`} icon={TrendingUp} variant="green" loading={loading} />
        <KPICard title="Ventas del mes" value={loading ? '—' : compactMXN(metrics?.totalMes ?? 0)} subtitle="Mes actual" icon={BadgeDollarSign} variant="gold" loading={loading} />
        <KPICard title="Pedidos pendientes" value={loading ? '—' : (metrics?.pedidosPendientes ?? 0)} subtitle="Requieren atención" icon={ShoppingCart} variant="blue" loading={loading} />
        <KPICard title="Sucursales activas" value={loading ? '—' : (metrics?.sucursalesActivas ?? 0)} subtitle={`En ${metrics?.totalMueblerias ?? 0} mueblería(s)`} icon={MapPin} variant="teal" loading={loading} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Empleados activos" value={loading ? '—' : (metrics?.empleadosActivos ?? 0)} icon={Users} variant="purple" loading={loading} />
        <KPICard title="Productos en catálogo" value={loading ? '—' : (metrics?.totalProductos ?? 0)} icon={Package} variant="blue" loading={loading} />
        <KPICard title="Comisiones del mes" value={loading ? '—' : formatMXN(metrics?.comisionesMes ?? 0)} subtitle="Total generado" icon={BadgeDollarSign} variant="gold" loading={loading} />
        <KPICard title="Mueblerías" value={loading ? '—' : (metrics?.totalMueblerias ?? 0)} subtitle="Registradas" icon={Store} variant="green" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Ventas — últimos 7 días" subtitle="Ingresos diarios" className="lg:col-span-2">
          {loading ? <Skeleton className="h-48 w-full skeleton-shimmer" /> : <RevenueChart data={chartData} height={200} />}
        </SectionCard>
        <SectionCard title="Pedidos por estado" subtitle="Distribución actual">
          {loading ? <Skeleton className="h-48 w-full skeleton-shimmer" /> : pedidosByEstado.length === 0 ? <EmptyState icon={ShoppingCart} title="Sin pedidos" /> : (
            <>
              <DonutChart data={pedidosByEstado} height={160} showLegend />
              <div className="mt-3 grid grid-cols-2 gap-1">
                {pedidosByEstado.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-[var(--color-muted-foreground)] truncate">{d.name}</span>
                    <span className="font-semibold ml-auto">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </SectionCard>
      </div>

      {categoriaVentas.length > 0 && (
        <SectionCard title="Productos por categoría" subtitle="Distribución del catálogo">
          {loading ? <Skeleton className="h-40 w-full skeleton-shimmer" /> : <BarChartComponent data={categoriaVentas} height={160} />}
        </SectionCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title="Ventas recientes" subtitle={`${data?.ventas?.length ?? 0} total`} noPadding>
          {loading ? (
            <div className="space-y-0 p-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl mb-2 skeleton-shimmer" />)}</div>
          ) : recentVentas.length === 0 ? <EmptyState icon={TrendingUp} title="Sin ventas registradas" /> : (
            <div>
              {recentVentas.map((v: any) => (
                <div key={v.id_venta} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-background)] transition-colors border-b border-[var(--color-border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
                    <div>
                      <p className="text-sm font-semibold">Venta #{v.id_venta}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{v.cliente?.usuario?.nombre ?? 'Cliente'} · {formatDate(v.fecha_venta)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.estado_venta} size="sm" />
                    <span className="text-sm font-bold text-[var(--color-primary)]">{formatMXN(v.total_venta)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Pedidos recientes" subtitle={`${data?.pedidos?.length ?? 0} total`} noPadding>
          {loading ? (
            <div className="space-y-0 p-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl mb-2 skeleton-shimmer" />)}</div>
          ) : recentPedidos.length === 0 ? <EmptyState icon={ShoppingCart} title="Sin pedidos registrados" /> : (
            <div>
              {recentPedidos.map((p: any) => (
                <div key={p.id_pedido} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-background)] transition-colors border-b border-[var(--color-border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><ShoppingCart className="w-4 h-4 text-amber-600" /></div>
                    <div>
                      <p className="text-sm font-semibold">Pedido #{p.id_pedido}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{p.cliente?.usuario?.nombre ?? 'Cliente'} · {formatDate(p.fecha_pedido)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.estado_pedido} size="sm" />
                    <span className="text-sm font-bold text-[var(--color-primary)]">{formatMXN(p.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {(data?.misMueblerias ?? []).length > 0 && (
        <SectionCard title="Mis mueblerías">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(data?.misMueblerias ?? []).map((m: any) => (
              <div key={m.id_muebleria} className="p-4 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-md transition-all duration-200 group cursor-default">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-gradient-primary">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-foreground)] truncate group-hover:text-[var(--color-primary)]">{m.nombre_negocio}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{m.sucursales?.length ?? 0} sucursal(es)</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {(m.sucursales ?? []).slice(0, 3).map((s: any) => (
                        <StatusBadge key={s.id_sucursal} status={s.activo ? 'Activo' : 'Inactivo'} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function DashboardAdmin() {
  const { data: raw, loading, error } = useQuery(GET_DASHBOARD_ADMIN);
  const data = raw as any;

  const metrics = useMemo(() => {
    if (!data) return null;
    const ventas = data.ventas ?? [];
    const pedidos = data.pedidos ?? [];
    const usuarios = data.usuarios ?? [];
    const mueblerias = data.mueblerias ?? [];
    const ventasMes = ventas.filter((v: any) => isThisMonth(new Date(v.fecha_venta)));
    const totalMes = ventasMes.reduce((s: number, v: any) => s + Number(v.total_venta), 0);
    const comisionesMes = ventasMes.reduce((s: number, v: any) => s + Number(v.comision ?? 0), 0);
    const pedidosPendientes = pedidos.filter((p: any) => p.estado_pedido === 'Pendiente').length;
    const usuariosActivos = usuarios.filter((u: any) => u.activo).length;
    const sucursalesTotal = mueblerias.reduce((s: number, m: any) => s + (m.sucursales?.length ?? 0), 0);
    const sucursalesActivas = mueblerias.flatMap((m: any) => m.sucursales ?? []).filter((s: any) => s.activo).length;
    return {
      totalMes, comisionesMes, pedidosPendientes, usuariosActivos,
      totalMueblerias: mueblerias.length, sucursalesTotal, sucursalesActivas,
      totalVentas: ventas.length,
      empleadosActivos: (data.empleados ?? []).filter((e: any) => e.activo).length,
    };
  }, [data]);

  const chartData = useMemo(() => buildMonthlyRevenue(data?.ventas ?? []), [data]);

  const rolesDist = useMemo(() => {
    const map: Record<string, number> = {};
    (data?.usuarios ?? []).forEach((u: any) => { const r = u.rol?.nombre ?? 'Sin rol'; map[r] = (map[r] ?? 0) + 1; });
    const colors: Record<string, string> = { Admin: '#C9A84C', Propietario: '#1A3A2A', Empleado: '#3B82F6', Cliente: '#F59E0B' };
    return Object.entries(map).map(([name, value]) => ({ name, value, color: colors[name] }));
  }, [data]);

  if (error) return <Alert variant="destructive"><AlertCircle className="w-4 h-4" /><AlertDescription>{error.message}</AlertDescription></Alert>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Ventas del mes" value={loading ? '—' : compactMXN(metrics?.totalMes ?? 0)} subtitle={`${metrics?.totalVentas ?? 0} ventas totales`} icon={TrendingUp} variant="green" loading={loading} />
        <KPICard title="Mueblerías activas" value={loading ? '—' : (metrics?.totalMueblerias ?? 0)} subtitle={`${metrics?.sucursalesActivas ?? 0} sucursales activas`} icon={Store} variant="gold" loading={loading} />
        <KPICard title="Pedidos pendientes" value={loading ? '—' : (metrics?.pedidosPendientes ?? 0)} subtitle="Requieren atención" icon={ShoppingCart} variant="blue" loading={loading} />
        <KPICard title="Usuarios activos" value={loading ? '—' : (metrics?.usuariosActivos ?? 0)} icon={Users} variant="purple" loading={loading} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard title="Comisiones del mes" value={loading ? '—' : formatMXN(metrics?.comisionesMes ?? 0)} icon={BadgeDollarSign} variant="gold" loading={loading} />
        <KPICard title="Sucursales registradas" value={loading ? '—' : (metrics?.sucursalesTotal ?? 0)} subtitle={`${metrics?.sucursalesActivas ?? 0} activas`} icon={Warehouse} variant="teal" loading={loading} />
        <KPICard title="Empleados activos" value={loading ? '—' : (metrics?.empleadosActivos ?? 0)} icon={Users} variant="purple" loading={loading} />
        <KPICard title="Total ventas" value={loading ? '—' : (metrics?.totalVentas ?? 0)} subtitle="Historial completo" icon={TrendingUp} variant="green" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Ventas — últimos 6 meses" subtitle="Ingresos mensuales" className="lg:col-span-2">
          {loading ? <Skeleton className="h-48 skeleton-shimmer" /> : <RevenueChart data={chartData} height={200} />}
        </SectionCard>
        <SectionCard title="Usuarios por rol" subtitle="Distribución del sistema">
          {loading ? <Skeleton className="h-48 skeleton-shimmer" /> : (
            rolesDist.length === 0 ? <EmptyState icon={Users} title="Sin usuarios" /> : (
              <>
                <DonutChart data={rolesDist} height={160} />
                <div className="mt-3 space-y-1.5">
                  {rolesDist.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-[var(--color-muted-foreground)]">{d.name}</span>
                      <span className="font-semibold ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </SectionCard>
      </div>

      <SectionCard title="Últimas ventas del sistema" subtitle={`${data?.ventas?.length ?? 0} registradas`} noPadding>
        {loading ? (
          <div className="p-4 space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 w-full skeleton-shimmer" />)}</div>
        ) : (
          <div>
            {[...(data?.ventas ?? [])].sort((a: any, b: any) => new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime()).slice(0, 8).map((v: any) => (
              <div key={v.id_venta} className="flex items-center justify-between px-5 py-3.5 hover:bg-[var(--color-background)] transition-colors border-b border-[var(--color-border)] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><TrendingUp className="w-4 h-4 text-emerald-600" /></div>
                  <div>
                    <p className="text-sm font-semibold">Venta #{v.id_venta}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{format(new Date(v.fecha_venta), "d MMM yyyy, HH:mm", { locale: es })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={v.estado_venta} size="sm" />
                  <span className="text-sm font-bold text-[var(--color-primary)]">{formatMXN(v.total_venta)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default function DashboardPage() {
  const { usuario, isPropietario, isAdmin } = useAuth();
  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${usuario?.nombre?.split(' ')[0] ?? 'usuario'}`}
        subtitle={isAdmin ? 'Vista global del sistema MuebleClick' : 'Resumen de tu negocio'}
      />
      {isPropietario && <DashboardPropietario />}
      {isAdmin && <DashboardAdmin />}
    </div>
  );
}
