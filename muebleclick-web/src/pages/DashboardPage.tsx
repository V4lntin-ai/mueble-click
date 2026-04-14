import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  Store,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Users,
  AlertCircle,
} from 'lucide-react';
import { format, isToday, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/shared/StatCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import {
  GET_DASHBOARD_PROPIETARIO,
  GET_DASHBOARD_ADMIN,
} from '@/graphql/dashboard';

interface DashboardPropietarioData {
  misMueblerias: any[];
  ventas: any[];
  pedidos: any[];
  productos: any[];
}

interface DashboardAdminData {
  mueblerias: any[];
  usuarios: any[];
  ventas: any[];
  pedidos: any[];
}

function formatMXN(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(value);
}

function estadoBadgeColor(estado: string) {
  const map: Record<string, string> = {
    Pendiente:  'bg-amber-100 text-amber-700',
    Confirmado: 'bg-blue-100 text-blue-700',
    Enviado:    'bg-purple-100 text-purple-700',
    Entregado:  'bg-emerald-100 text-emerald-700',
    Cancelado:  'bg-red-100 text-red-600',
    Completada: 'bg-emerald-100 text-emerald-700',
    Reembolsada:'bg-gray-100 text-gray-600',
  };
  return map[estado] ?? 'bg-gray-100 text-gray-600';
}

// ─── Dashboard Propietario ────────────────────────────────────────────────────
function DashboardPropietario() {
  const { data, loading, error } = useQuery<DashboardPropietarioData>(GET_DASHBOARD_PROPIETARIO);

  const stats = useMemo(() => {
    if (!data) return null;

    const ventasHoy = (data.ventas ?? []).filter((v: any) =>
      isToday(new Date(v.fecha_venta)),
    );
    const ventasMes = (data.ventas ?? []).filter((v: any) =>
      isThisMonth(new Date(v.fecha_venta)),
    );
    const totalHoy = ventasHoy.reduce(
      (sum: number, v: any) => sum + Number(v.total_venta), 0,
    );
    const totalMes = ventasMes.reduce(
      (sum: number, v: any) => sum + Number(v.total_venta), 0,
    );
    const pedidosPendientes = (data.pedidos ?? []).filter(
      (p: any) => p.estado_pedido === 'Pendiente',
    ).length;
    const totalSucursales = (data.misMueblerias ?? []).reduce(
      (sum: number, m: any) => sum + (m.sucursales?.length ?? 0), 0,
    );

    return {
      totalHoy,
      totalMes,
      pedidosPendientes,
      totalSucursales,
      totalMueblerias: data.misMueblerias?.length ?? 0,
      totalProductos: data.productos?.length ?? 0,
      totalVentasHoy: ventasHoy.length,
    };
  }, [data]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Ventas hoy"
          value={stats ? formatMXN(stats.totalHoy) : '—'}
          subtitle={`${stats?.totalVentasHoy ?? 0} transacciones`}
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Ventas del mes"
          value={stats ? formatMXN(stats.totalMes) : '—'}
          subtitle="Mes actual"
          icon={TrendingUp}
          color="brown"
          loading={loading}
        />
        <StatCard
          title="Pedidos pendientes"
          value={stats?.pedidosPendientes ?? '—'}
          subtitle="Requieren atención"
          icon={ShoppingCart}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Sucursales activas"
          value={stats?.totalSucursales ?? '—'}
          subtitle={`En ${stats?.totalMueblerias ?? 0} mueblería(s)`}
          icon={MapPin}
          color="blue"
          loading={loading}
        />
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas ventas */}
        <Card className="rounded-2xl border-(--color-border) card-shadow bg-white">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-(--color-foreground)">
                Últimas ventas
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {data?.ventas?.length ?? 0} total
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            {loading ? (
              <div className="space-y-2 px-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : (data?.ventas ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <TrendingUp className="w-10 h-10 text-muted mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Sin ventas registradas
                </p>
              </div>
            ) : (
              <div>
                {(data?.ventas ?? [])
                  .slice()
                  .sort((a: any, b: any) =>
                    new Date(b.fecha_venta).getTime() -
                    new Date(a.fecha_venta).getTime(),
                  )
                  .slice(0, 6)
                  .map((venta: any) => (
                    <div
                      key={venta.id_venta}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-beige transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Venta #{venta.id_venta}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(venta.fecha_venta), "d MMM, HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadgeColor(venta.estado_venta)}`}>
                          {venta.estado_venta}
                        </span>
                        <span className="text-sm font-bold text-primary-dark">
                          {formatMXN(Number(venta.total_venta))}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pedidos recientes */}
        <Card className="rounded-2xl border-(--color-border) card-shadow bg-white">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-(--color-foreground)">
                Pedidos recientes
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {data?.pedidos?.length ?? 0} total
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-2 pb-3">
            {loading ? (
              <div className="space-y-2 px-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : (data?.pedidos ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ShoppingCart className="w-10 h-10 text-muted mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Sin pedidos registrados
                </p>
              </div>
            ) : (
              <div>
                {(data?.pedidos ?? [])
                  .slice()
                  .sort((a: any, b: any) =>
                    new Date(b.fecha_pedido).getTime() -
                    new Date(a.fecha_pedido).getTime(),
                  )
                  .slice(0, 6)
                  .map((pedido: any) => (
                    <div
                      key={pedido.id_pedido}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-beige transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-3.5 h-3.5 text-orange-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Pedido #{pedido.id_pedido}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(pedido.fecha_pedido), "d MMM, HH:mm", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadgeColor(pedido.estado_pedido)}`}>
                          {pedido.estado_pedido}
                        </span>
                        <span className="text-sm font-bold text-primary-dark">
                          {formatMXN(Number(pedido.total))}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mueblerías */}
      <Card className="rounded-2xl border-(--color-border) card-shadow bg-white">
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-(--color-foreground)">
              Mis mueblerías
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {data?.misMueblerias?.length ?? 0} registradas
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(data?.misMueblerias ?? []).map((m: any) => (
                <div
                  key={m.id_muebleria}
                  className="p-4 rounded-xl border border-(--color-border) bg-beige hover:border-(--color-primary) hover:shadow-md transition-all duration-200 cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
                    >
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-(--color-foreground)">
                        {m.nombre_negocio}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {m.sucursales?.length ?? 0} sucursal(es)
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {(m.sucursales ?? []).slice(0, 3).map((s: any) => (
                          <Badge
                            key={s.id_sucursal}
                            className={`text-[10px] px-1.5 py-0 border-0 ${
                              s.activo
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {s.nombre_sucursal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Dashboard Admin ──────────────────────────────────────────────────────────
function DashboardAdmin() {
  const { data, loading, error } = useQuery<DashboardAdminData>(GET_DASHBOARD_ADMIN);

  const stats = useMemo(() => {
    if (!data) return null;

    const ventasMes = (data.ventas ?? []).filter((v: any) =>
      isThisMonth(new Date(v.fecha_venta)),
    );
    const totalMes = ventasMes.reduce(
      (sum: number, v: any) => sum + Number(v.total_venta), 0,
    );
    const pedidosPendientes = (data.pedidos ?? []).filter(
      (p: any) => p.estado_pedido === 'Pendiente',
    ).length;
    const usuariosActivos = (data.usuarios ?? []).filter(
      (u: any) => u.activo,
    ).length;

    return {
      totalMes,
      pedidosPendientes,
      usuariosActivos,
      totalMueblerias: data.mueblerias?.length ?? 0,
    };
  }, [data]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Ventas del mes"
          value={stats ? formatMXN(stats.totalMes) : '—'}
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Mueblerías"
          value={stats?.totalMueblerias ?? '—'}
          subtitle="Registradas en el sistema"
          icon={Store}
          color="brown"
          loading={loading}
        />
        <StatCard
          title="Pedidos pendientes"
          value={stats?.pedidosPendientes ?? '—'}
          icon={ShoppingCart}
          color="orange"
          loading={loading}
        />
        <StatCard
          title="Usuarios activos"
          value={stats?.usuariosActivos ?? '—'}
          icon={Users}
          color="blue"
          loading={loading}
        />
      </div>

      <Card className="rounded-2xl border-(--color-border) card-shadow bg-white">
        <CardHeader className="pb-2 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Últimas ventas del sistema
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {data?.ventas?.length ?? 0} total
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          {loading ? (
            <div className="space-y-2 px-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div>
              {(data?.ventas ?? [])
                .slice()
                .sort((a: any, b: any) =>
                  new Date(b.fecha_venta).getTime() -
                  new Date(a.fecha_venta).getTime(),
                )
                .slice(0, 8)
                .map((venta: any) => (
                  <div
                    key={venta.id_venta}
                    className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-beige transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          Venta #{venta.id_venta}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(venta.fecha_venta), "d MMM yyyy, HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadgeColor(venta.estado_venta)}`}>
                        {venta.estado_venta}
                      </span>
                        <span className="text-sm font-bold text-primary-dark">
                        {formatMXN(Number(venta.total_venta))}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { usuario, isPropietario, isAdmin } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${usuario?.nombre?.split(' ')[0]} 👋`}
        subtitle={
          isAdmin
            ? 'Vista general del sistema MuebleClick'
            : 'Resumen de tu negocio'
        }
      />
      {isPropietario && <DashboardPropietario />}
      {isAdmin && <DashboardAdmin />}
    </div>
  );
}