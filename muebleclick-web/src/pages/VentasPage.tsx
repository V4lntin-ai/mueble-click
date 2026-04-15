import { useState, useMemo } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import {
  TrendingUp, Search, AlertCircle,
  ChevronDown, ChevronUp, Package,
  Tag, CreditCard, User,
} from 'lucide-react';
import { format, isToday, isThisMonth } from 'date-fns';
import { es } from 'date-fns/locale';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { GET_VENTAS, GET_DETALLE_VENTA } from '@/graphql/ventas';

function formatMXN(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(value);
}

const estadoConfig: Record<string, string> = {
  Completada:  'bg-emerald-50 text-emerald-700',
  Reembolsada: 'bg-gray-100 text-gray-600',
  Cancelada:   'bg-red-50 text-red-600',
};

function VentaRow({ venta }: { venta: any }) {
  const [expanded, setExpanded] = useState(false);

  const [getDetalle, { data: detalleData, loading: loadingDetalle }] =
    useLazyQuery(GET_DETALLE_VENTA);

  const handleExpand = () => {
    if (!expanded) getDetalle({ variables: { id_venta: venta.id_venta } });
    setExpanded(!expanded);
  };

  const detalles = detalleData?.detalleVenta ?? [];

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--color-beige)] transition-colors"
        onClick={handleExpand}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #A0522D, #6B4226)' }}>
          <TrendingUp className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          <div>
            <p className="text-sm font-bold">Venta #{venta.id_venta}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {venta.cliente?.usuario?.nombre}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-[var(--color-muted-foreground)]">Fecha</p>
            <p className="text-sm font-medium">
              {format(new Date(venta.fecha_venta), "d MMM, HH:mm", { locale: es })}
            </p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-[var(--color-muted-foreground)]">Método</p>
            <p className="text-sm font-medium">{venta.metodo_pago?.tipo_pago}</p>
          </div>
          <div className="hidden md:block">
            <p className="text-xs text-[var(--color-muted-foreground)]">Vendedor</p>
            <p className="text-sm font-medium">{venta.vendedor?.usuario?.nombre ?? '—'}</p>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${estadoConfig[venta.estado_venta] ?? 'bg-gray-100 text-gray-600'}`}>
              {venta.estado_venta}
            </span>
            <span className="text-base font-bold text-[var(--color-primary-dark)]">
              {formatMXN(Number(venta.total_venta))}
            </span>
          </div>
        </div>

        <div className="shrink-0 text-[var(--color-muted-foreground)]">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Detalle */}
      {expanded && (
        <div className="border-t border-[var(--color-border)] px-5 py-4 bg-[var(--color-beige)]">
          {/* Resumen financiero */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-[var(--color-muted-foreground)]">Subtotal</p>
              <p className="text-sm font-bold mt-0.5">{formatMXN(Number(venta.sub_total))}</p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center">
              <p className="text-xs text-[var(--color-muted-foreground)]">Descuento</p>
              <p className="text-sm font-bold mt-0.5 text-red-500">
                -{formatMXN(Number(venta.descuento))}
              </p>
            </div>
            <div className="bg-white rounded-xl px-4 py-3 text-center border-2 border-[var(--color-primary)]">
              <p className="text-xs text-[var(--color-muted-foreground)]">Total</p>
              <p className="text-sm font-bold mt-0.5 text-[var(--color-primary-dark)]">
                {formatMXN(Number(venta.total_venta))}
              </p>
            </div>
          </div>

          {/* Tags de info */}
          <div className="flex flex-wrap gap-2 mb-4">
            {venta.cupon && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">
                <Tag className="w-3 h-3" />
                Cupón {venta.cupon.codigo} ({venta.cupon.descuento_porcentaje}% off)
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              <CreditCard className="w-3 h-3" />
              {venta.metodo_pago?.tipo_pago}
            </span>
            {venta.vendedor && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                <User className="w-3 h-3" />
                {venta.vendedor.usuario.nombre}
                {venta.comision && ` — comisión ${formatMXN(Number(venta.comision))}`}
              </span>
            )}
            {venta.pedido && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                Pedido #{venta.pedido.id_pedido}
              </span>
            )}
          </div>

          {/* Productos */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide mb-2">
              Productos vendidos
            </p>
            {loadingDetalle ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
              </div>
            ) : detalles.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)] italic">Sin detalle</p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d: any) => (
                  <div key={d.id_detalle_venta}
                    className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      {d.producto?.imagen_url ? (
                        <img src={d.producto.imagen_url} className="w-8 h-8 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-beige-dark)] flex items-center justify-center">
                          <Package className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold">{d.producto?.nombre}</p>
                        {d.producto?.sku && (
                          <p className="text-xs font-mono text-[var(--color-muted-foreground)]">{d.producto.sku}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--color-primary-dark)]">
                        {formatMXN(Number(d.subtotal))}
                      </p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">
                        {d.cantidad} × {formatMXN(Number(d.precio_unitario))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VentasPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('Todas');

  const { data, loading, error } = useQuery(GET_VENTAS);
  const ventas = data?.ventas ?? [];

  const stats = useMemo(() => {
    const hoy   = ventas.filter((v: any) => isToday(new Date(v.fecha_venta)));
    const mes   = ventas.filter((v: any) => isThisMonth(new Date(v.fecha_venta)));
    return {
      totalHoy: hoy.reduce((s: number, v: any) => s + Number(v.total_venta), 0),
      totalMes: mes.reduce((s: number, v: any) => s + Number(v.total_venta), 0),
      countHoy: hoy.length,
      countMes: mes.length,
    };
  }, [ventas]);

  const filtered = useMemo(() => {
    return ventas.filter((v: any) => {
      const matchSearch =
        !search ||
        String(v.id_venta).includes(search) ||
        v.cliente?.usuario?.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === 'Todas' || v.estado_venta === tab;
      return matchSearch && matchTab;
    });
  }, [ventas, search, tab]);

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle="Historial completo de transacciones"
      />

      {/* KPIs mini */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ventas hoy"
          value={formatMXN(stats.totalHoy)}
          subtitle={`${stats.countHoy} transacciones`}
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Ventas del mes"
          value={formatMXN(stats.totalMes)}
          subtitle={`${stats.countMes} transacciones`}
          icon={TrendingUp}
          color="brown"
          loading={loading}
        />
        <StatCard
          title="Total registradas"
          value={ventas.length}
          subtitle="Historial completo"
          icon={TrendingUp}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Completadas"
          value={ventas.filter((v: any) => v.estado_venta === 'Completada').length}
          subtitle={`${ventas.length > 0 ? Math.round((ventas.filter((v: any) => v.estado_venta === 'Completada').length / ventas.length) * 100) : 0}% del total`}
          icon={TrendingUp}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="bg-white border border-[var(--color-border)] rounded-xl h-10">
            {['Todas', 'Completada', 'Reembolsada', 'Cancelada'].map((e) => (
              <TabsTrigger key={e} value={e} className="rounded-lg text-xs">{e}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar venta o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #A0522D, #6B4226)' }}>
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold mb-1">Sin ventas</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No hay ventas que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered
            .slice()
            .sort((a: any, b: any) =>
              new Date(b.fecha_venta).getTime() - new Date(a.fecha_venta).getTime()
            )
            .map((v: any) => (
              <VentaRow key={v.id_venta} venta={v} />
            ))}
        </div>
      )}
    </div>
  );
}