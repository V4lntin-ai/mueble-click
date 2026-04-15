import { useState, useMemo } from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  ShoppingCart, Search, AlertCircle,
  ChevronDown, ChevronUp, Package,
  MapPin, Truck, Store,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { GET_PEDIDOS, UPDATE_ESTADO_PEDIDO, GET_DETALLE_PEDIDO } from '@/graphql/pedidos';

function formatMXN(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(value);
}

const ESTADOS = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];

const estadoConfig: Record<string, { cls: string; dot: string }> = {
  Pendiente:  { cls: 'bg-amber-50 text-amber-700',    dot: 'bg-amber-400' },
  Confirmado: { cls: 'bg-blue-50 text-blue-700',      dot: 'bg-blue-400' },
  Enviado:    { cls: 'bg-purple-50 text-purple-700',  dot: 'bg-purple-400' },
  Entregado:  { cls: 'bg-emerald-50 text-emerald-700',dot: 'bg-emerald-400' },
  Cancelado:  { cls: 'bg-red-50 text-red-600',        dot: 'bg-red-400' },
};

function EstadoBadge({ estado }: { estado: string }) {
  const cfg = estadoConfig[estado] ?? { cls: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {estado}
    </span>
  );
}

function PedidoRow({ pedido, onRefetch }: { pedido: any; onRefetch: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(pedido.estado_pedido);

  const [getDetalle, { data: detalleData, loading: loadingDetalle }] =
    useLazyQuery(GET_DETALLE_PEDIDO);

  const [updateEstado, { loading: updating }] = useMutation(UPDATE_ESTADO_PEDIDO, {
    onCompleted: () => { toast.success('Estado actualizado'); onRefetch(); },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const handleExpand = () => {
    if (!expanded) {
      getDetalle({ variables: { id_pedido: pedido.id_pedido } });
    }
    setExpanded(!expanded);
  };

  const handleUpdateEstado = () => {
    if (nuevoEstado === pedido.estado_pedido) return;
    updateEstado({ variables: { input: { id_pedido: pedido.id_pedido, estado_pedido: nuevoEstado } } });
  };

  const detalles = detalleData?.detallePedido ?? [];

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden transition-all duration-200"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[var(--color-beige)] transition-colors"
        onClick={handleExpand}
      >
        {/* Número */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}>
          <ShoppingCart className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
          {/* ID + Cliente */}
          <div>
            <p className="text-sm font-bold">Pedido #{pedido.id_pedido}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {pedido.cliente?.usuario?.nombre}
            </p>
          </div>

          {/* Fecha */}
          <div className="hidden md:block">
            <p className="text-xs text-[var(--color-muted-foreground)]">Fecha</p>
            <p className="text-sm font-medium">
              {format(new Date(pedido.fecha_pedido), "d MMM, HH:mm", { locale: es })}
            </p>
          </div>

          {/* Total */}
          <div className="hidden md:block">
            <p className="text-xs text-[var(--color-muted-foreground)]">Total</p>
            <p className="text-sm font-bold text-[var(--color-primary-dark)]">
              {formatMXN(Number(pedido.total))}
            </p>
          </div>

          {/* Estado */}
          <div className="flex justify-end md:justify-start">
            <EstadoBadge estado={pedido.estado_pedido} />
          </div>
        </div>

        {/* Expand */}
        <div className="shrink-0 text-[var(--color-muted-foreground)]">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Detalle expandido */}
      {expanded && (
        <div className="border-t border-[var(--color-border)] px-5 py-4 bg-[var(--color-beige)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Entrega */}
            <div className="flex items-start gap-2">
              {pedido.tipo_entrega === 'Envio' ? (
                <Truck className="w-4 h-4 text-[var(--color-muted-foreground)] mt-0.5" />
              ) : (
                <Store className="w-4 h-4 text-[var(--color-muted-foreground)] mt-0.5" />
              )}
              <div>
                <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide">
                  {pedido.tipo_entrega === 'Envio' ? 'Envío a domicilio' : 'Recolección en tienda'}
                </p>
                {pedido.direccion && (
                  <p className="text-xs mt-0.5">
                    {pedido.direccion.calle_numero}
                    {pedido.direccion.municipio && `, ${pedido.direccion.municipio.nombre}`}
                  </p>
                )}
                {pedido.sucursal_origen && (
                  <p className="text-xs mt-0.5">{pedido.sucursal_origen.nombre_sucursal}</p>
                )}
              </div>
            </div>

            {/* Actualizar estado */}
            <div className="md:col-span-2 flex items-end gap-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide mb-1.5">
                  Actualizar estado
                </p>
                <Select value={nuevoEstado} onValueChange={setNuevoEstado}>
                  <SelectTrigger className="rounded-xl bg-white h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e} value={e}>{e}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                onClick={handleUpdateEstado}
                disabled={updating || nuevoEstado === pedido.estado_pedido}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl h-9"
              >
                {updating ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>

          {/* Productos */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wide mb-2">
              Productos del pedido
            </p>
            {loadingDetalle ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-10 w-full rounded-xl" />)}
              </div>
            ) : detalles.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)] italic">Sin productos registrados</p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d: any) => (
                  <div key={d.id_detalle_pedido}
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

export default function PedidosPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('Todos');

  const { data, loading, error, refetch } = useQuery(GET_PEDIDOS);
  const pedidos = data?.pedidos ?? [];

  const filtered = useMemo(() => {
    return pedidos.filter((p: any) => {
      const matchSearch =
        !search ||
        String(p.id_pedido).includes(search) ||
        p.cliente?.usuario?.nombre?.toLowerCase().includes(search.toLowerCase());
      const matchTab = tab === 'Todos' || p.estado_pedido === tab;
      return matchSearch && matchTab;
    });
  }, [pedidos, search, tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { Todos: pedidos.length };
    ESTADOS.forEach((e) => {
      c[e] = pedidos.filter((p: any) => p.estado_pedido === e).length;
    });
    return c;
  }, [pedidos]);

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle="Gestiona y actualiza el estado de los pedidos"
      />

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="bg-white border border-[var(--color-border)] rounded-xl h-10 flex-wrap">
            {['Todos', ...ESTADOS].map((e) => (
              <TabsTrigger key={e} value={e} className="rounded-lg text-xs">
                {e} {counts[e] ? `(${counts[e]})` : ''}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar pedido o cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}>
            <ShoppingCart className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold mb-1">Sin pedidos</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No hay pedidos que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered
            .slice()
            .sort((a: any, b: any) =>
              new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime()
            )
            .map((p: any) => (
              <PedidoRow key={p.id_pedido} pedido={p} onRefetch={refetch} />
            ))}
        </div>
      )}
    </div>
  );
}