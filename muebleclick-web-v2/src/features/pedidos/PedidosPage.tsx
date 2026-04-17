import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { ShoppingCart, Eye, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  GET_PEDIDOS, UPDATE_ESTADO_PEDIDO, GET_DETALLE_PEDIDO,
} from '@/graphql/pedidos';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMXN, formatDate } from '@/lib/formatters';
import type { Pedido, EstadoPedido } from '@/types';

const ESTADOS: EstadoPedido[] = ['Pendiente', 'Confirmado', 'Enviado', 'Entregado', 'Cancelado'];

function PedidoDetail({ pedido, onClose }: { pedido: Pedido; onClose: () => void }) {
  const { data: detRaw, loading } = useQuery(GET_DETALLE_PEDIDO, {
    variables: { id_pedido: pedido.id_pedido },
  });
  const [updateEstado, { loading: updating }] = useMutation(UPDATE_ESTADO_PEDIDO, {
    refetchQueries: [{ query: GET_PEDIDOS }],
  });

  const handleEstado = async (estado: EstadoPedido) => {
    try {
      await updateEstado({ variables: { input: { id_pedido: pedido.id_pedido, estado_pedido: estado } } });
      toast.success(`Estado actualizado a "${estado}"`);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al actualizar');
    }
  };

  const detData = detRaw as any;
  const detalles = detData?.detallePedido ?? [];
  const nextEstado: Partial<Record<EstadoPedido, EstadoPedido>> = {
    Pendiente: 'Confirmado',
    Confirmado: 'Enviado',
    Enviado: 'Entregado',
  };
  const next = nextEstado[pedido.estado_pedido];

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              Pedido #{pedido.id_pedido}
            </DialogTitle>
            <StatusBadge status={pedido.estado_pedido} />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Cliente</p>
              <p className="font-medium">{pedido.cliente?.usuario?.nombre ?? 'N/A'}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{pedido.cliente?.usuario?.correo}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Fecha</p>
              <p className="font-medium">{formatDate(pedido.fecha_pedido)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Tipo entrega</p>
              <StatusBadge status={pedido.tipo_entrega ?? ''} size="sm" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-muted-foreground)]">Sucursal</p>
              <p className="font-medium text-xs">{pedido.sucursal_origen?.nombre_sucursal ?? '—'}</p>
            </div>
            {pedido.direccion && (
              <div className="col-span-2">
                <p className="text-xs text-[var(--color-muted-foreground)]">Dirección</p>
                <p className="font-medium text-xs">
                  {pedido.direccion.calle_numero}, {pedido.direccion.municipio?.nombre}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Products */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">
              Productos
            </p>
            {loading ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">Cargando...</p>
            ) : detalles.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">Sin detalles disponibles</p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d: any) => (
                  <div key={d.id_detalle_pedido} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--color-background)]">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-3.5 h-3.5 text-[var(--color-muted)]" />
                    </div>
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

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Total del pedido</span>
            <span className="text-lg font-bold text-[var(--color-primary)]">{formatMXN(pedido.total)}</span>
          </div>

          {/* Actions */}
          {next && pedido.estado_pedido !== 'Cancelado' && (
            <div className="flex gap-2 pt-2">
              <Button
                className="flex-1 rounded-xl bg-gradient-primary text-white"
                disabled={updating}
                onClick={() => handleEstado(next)}
              >
                Marcar como {next}
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                disabled={updating}
                onClick={() => handleEstado('Cancelado')}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function PedidosPage() {
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<string>('');
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: raw, loading, refetch } = useQuery(GET_PEDIDOS);
  const data = raw as any;
  const pedidos: Pedido[] = data?.pedidos ?? [];

  const filtered = useMemo(() => {
    let list = pedidos;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) =>
        String(p.id_pedido).includes(q) ||
        p.cliente?.usuario?.nombre?.toLowerCase().includes(q),
      );
    }
    if (estadoFilter) list = list.filter((p) => p.estado_pedido === estadoFilter);
    return [...list].sort((a, b) =>
      new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime(),
    );
  }, [pedidos, debouncedSearch, estadoFilter]);

  const metrics = useMemo(() => {
    const pendientes = pedidos.filter((p) => p.estado_pedido === 'Pendiente').length;
    const confirmados = pedidos.filter((p) => p.estado_pedido === 'Confirmado').length;
    const enviados = pedidos.filter((p) => p.estado_pedido === 'Enviado').length;
    const entregados = pedidos.filter((p) => p.estado_pedido === 'Entregado').length;
    return { pendientes, confirmados, enviados, entregados };
  }, [pedidos]);

  const columns = [
    {
      key: 'id_pedido', header: '# Pedido', sortable: true,
      render: (p: Pedido) => (
        <span className="font-mono text-sm font-semibold text-[var(--color-foreground)]">
          #{p.id_pedido}
        </span>
      ),
    },
    {
      key: 'cliente', header: 'Cliente',
      render: (p: Pedido) => (
        <div>
          <p className="text-sm font-medium">{p.cliente?.usuario?.nombre ?? 'N/A'}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">{p.cliente?.usuario?.correo}</p>
        </div>
      ),
    },
    {
      key: 'fecha_pedido', header: 'Fecha', sortable: true,
      render: (p: Pedido) => (
        <span className="text-xs text-[var(--color-foreground-mid)]">{formatDate(p.fecha_pedido)}</span>
      ),
    },
    {
      key: 'tipo_entrega', header: 'Entrega',
      render: (p: Pedido) => p.tipo_entrega
        ? <StatusBadge status={p.tipo_entrega} size="sm" />
        : <span className="text-[var(--color-muted)]">—</span>,
    },
    {
      key: 'estado_pedido', header: 'Estado', sortable: true,
      render: (p: Pedido) => <StatusBadge status={p.estado_pedido} />,
    },
    {
      key: 'sucursal', header: 'Sucursal',
      render: (p: Pedido) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {p.sucursal_origen?.nombre_sucursal ?? '—'}
        </span>
      ),
    },
    {
      key: 'total', header: 'Total', sortable: true, align: 'right' as const,
      render: (p: Pedido) => (
        <span className="text-sm font-bold text-[var(--color-primary)]">{formatMXN(p.total)}</span>
      ),
    },
    {
      key: 'acciones', header: '',
      render: (p: Pedido) => (
        <Button variant="ghost" size="icon"
          className="w-7 h-7 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          onClick={(e) => { e.stopPropagation(); setSelectedPedido(p); }}>
          <Eye className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${filtered.length} pedidos · gestión y seguimiento`}
        actions={
          <Button variant="outline" className="rounded-xl h-9 text-sm gap-2" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" /> Actualizar
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KPICard title="Pendientes" value={metrics.pendientes} icon={ShoppingCart} variant="gold" loading={loading} />
        <KPICard title="Confirmados" value={metrics.confirmados} icon={ShoppingCart} variant="blue" loading={loading} />
        <KPICard title="En camino" value={metrics.enviados} icon={ShoppingCart} variant="purple" loading={loading} />
        <KPICard title="Entregados" value={metrics.entregados} icon={ShoppingCart} variant="green" loading={loading} />
      </div>

      <SectionCard noPadding>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por # o cliente..." className="flex-1" />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Select value={estadoFilter} onValueChange={setEstadoFilter}>
              <SelectTrigger className="w-40 h-9 rounded-xl text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
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
          emptyMessage="Sin pedidos encontrados"
          onRowClick={(p: any) => setSelectedPedido(p)}
        />
      </SectionCard>

      {selectedPedido && (
        <PedidoDetail pedido={selectedPedido} onClose={() => setSelectedPedido(null)} />
      )}
    </div>
  );
}
