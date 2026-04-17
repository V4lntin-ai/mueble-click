import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Warehouse, AlertTriangle, CheckCircle, TrendingDown,
  RefreshCw, ArrowUpDown, Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GET_INVENTARIO_POR_SUCURSAL, UPDATE_INVENTARIO, CREATE_MOVIMIENTO_INVENTARIO,
} from '@/graphql/inventario';
import { GET_SUCURSALES } from '@/graphql/sucursales';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useForm, Controller } from 'react-hook-form';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/formatters';
import type { Inventario } from '@/types';

type StockStatus = 'crítico' | 'bajo' | 'normal' | 'exceso';

function getStockStatus(inv: Inventario): StockStatus {
  const { cantidad, stock_min, stock_max } = inv;
  if (cantidad <= 0) return 'crítico';
  if (cantidad <= stock_min) return 'bajo';
  if (cantidad >= stock_max) return 'exceso';
  return 'normal';
}

function StockStatusBadge({ status }: { status: StockStatus }) {
  const cfg = {
    crítico: 'bg-red-50 text-red-700 border-red-200',
    bajo:    'bg-amber-50 text-amber-700 border-amber-200',
    normal:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    exceso:  'bg-blue-50 text-blue-700 border-blue-200',
  }[status];
  const icons = {
    crítico: '🔴', bajo: '🟡', normal: '🟢', exceso: '🔵',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg}`}>
      <span className="text-[10px]">{icons[status]}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function StockBar({ inv }: { inv: Inventario }) {
  const pct = inv.stock_max > 0 ? Math.min((inv.cantidad / inv.stock_max) * 100, 100) : 0;
  const status = getStockStatus(inv);
  const color = {
    crítico: 'bg-red-500',
    bajo: 'bg-amber-500',
    normal: 'bg-emerald-500',
    exceso: 'bg-blue-500',
  }[status];
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <Progress value={pct} className="h-1.5 flex-1" indicatorClassName={color} />
      <span className="text-[10px] text-[var(--color-muted-foreground)] w-8 text-right">{Math.round(pct)}%</span>
    </div>
  );
}

function MovimientoDialog({
  open, onClose, inventario,
}: { open: boolean; onClose: () => void; inventario: Inventario | null }) {
  const [createMov, { loading }] = useMutation(CREATE_MOVIMIENTO_INVENTARIO);
  const { register, handleSubmit, reset } = useForm<{
    tipo: string; cantidad: number; motivo?: string;
  }>({ defaultValues: { tipo: 'Entrada', cantidad: 1 } });

  const onSubmit = async (data: any) => {
    if (!inventario) return;
    try {
      await createMov({
        variables: {
          input: {
            id_inventario: inventario.id_inventario,
            tipo: data.tipo,
            cantidad: Number(data.cantidad),
            motivo: data.motivo,
          },
        },
        refetchQueries: [{ query: GET_INVENTARIO_POR_SUCURSAL, variables: { id_sucursal: inventario.sucursal?.id_sucursal } }],
      });
      toast.success('Movimiento registrado');
      reset();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al registrar movimiento');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Registrar movimiento
          </DialogTitle>
          {inventario && (
            <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
              {inventario.producto?.nombre} · Stock actual: <strong>{inventario.cantidad}</strong>
            </p>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Tipo de movimiento</Label>
            <select {...register('tipo')} className="w-full h-9 px-3 rounded-xl border border-[var(--color-border)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30">
              <option>Entrada</option>
              <option>Salida</option>
              <option>Ajuste</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Cantidad</Label>
            <Input type="number" min={1} {...register('cantidad')} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Motivo (opcional)</Label>
            <Input {...register('motivo')} placeholder="Compra, devolución, ajuste..." className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-primary text-white">
              {loading ? 'Guardando...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InventarioPage() {
  const [sucursalId, setSucursalId] = useState<string>('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [movTarget, setMovTarget] = useState<Inventario | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: sucursalesRaw } = useQuery(GET_SUCURSALES);
  const { data: invRaw, loading } = useQuery(GET_INVENTARIO_POR_SUCURSAL, {
    variables: { id_sucursal: Number(sucursalId) },
    skip: !sucursalId,
  });

  const sucursalesData = sucursalesRaw as any;
  const invData = invRaw as any;
  const sucursales = sucursalesData?.sucursales ?? [];
  const inventario: Inventario[] = (invData?.inventarioPorSucursal ?? []).map((inv: any) => ({
    ...inv,
    sucursal: sucursales.find((s: any) => s.id_sucursal === Number(sucursalId)),
  }));

  const filtered = useMemo(() => {
    let list = inventario;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((i) =>
        i.producto?.nombre?.toLowerCase().includes(q) ||
        i.producto?.sku?.toLowerCase().includes(q),
      );
    }
    if (statusFilter) list = list.filter((i) => getStockStatus(i) === statusFilter);
    return list;
  }, [inventario, debouncedSearch, statusFilter]);

  const metrics = useMemo(() => {
    const total = inventario.length;
    const critico = inventario.filter((i) => getStockStatus(i) === 'crítico').length;
    const bajo = inventario.filter((i) => getStockStatus(i) === 'bajo').length;
    const normal = inventario.filter((i) => getStockStatus(i) === 'normal').length;
    return { total, critico, bajo, normal };
  }, [inventario]);

  const columns = [
    {
      key: 'producto', header: 'Producto', sortable: true,
      render: (inv: Inventario) => (
        <div>
          <p className="font-semibold text-sm">{inv.producto?.nombre ?? '—'}</p>
          <p className="text-[10px] font-mono text-[var(--color-muted-foreground)]">{inv.producto?.sku}</p>
        </div>
      ),
    },
    {
      key: 'cantidad', header: 'Stock actual', sortable: true, align: 'center' as const,
      render: (inv: Inventario) => (
        <div className="text-center">
          <p className="font-bold text-sm text-[var(--color-foreground)]">{inv.cantidad}</p>
          <p className="text-[10px] text-[var(--color-muted-foreground)]">Res: {inv.reservado}</p>
        </div>
      ),
    },
    {
      key: 'stock_min', header: 'Mín / Máx', align: 'center' as const,
      render: (inv: Inventario) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {inv.stock_min} / {inv.stock_max}
        </span>
      ),
    },
    {
      key: 'bar', header: 'Nivel',
      render: (inv: Inventario) => <StockBar inv={inv} />,
    },
    {
      key: 'status', header: 'Estado',
      render: (inv: Inventario) => <StockStatusBadge status={getStockStatus(inv)} />,
    },
    {
      key: 'ultimo_movimiento', header: 'Último mov.', sortable: true,
      render: (inv: Inventario) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {inv.ultimo_movimiento ? formatDate(inv.ultimo_movimiento) : '—'}
        </span>
      ),
    },
    {
      key: 'acciones', header: '',
      render: (inv: Inventario) => (
        <Button variant="ghost" size="sm"
          className="h-7 px-2.5 rounded-lg text-xs gap-1.5 text-[var(--color-primary)] hover:bg-[var(--color-g50)]"
          onClick={(e) => { e.stopPropagation(); setMovTarget(inv); }}>
          <ArrowUpDown className="w-3 h-3" /> Movimiento
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Control de stock por sucursal"
        actions={
          <Button
            variant="outline"
            className="rounded-xl h-9 text-sm gap-2"
            onClick={() => setSucursalId('')}
          >
            <RefreshCw className="w-4 h-4" /> Actualizar
          </Button>
        }
      />

      {/* Sucursal selector */}
      <div className="mb-6">
        <Select value={sucursalId} onValueChange={setSucursalId}>
          <SelectTrigger className="w-72 h-10 rounded-xl bg-white">
            <SelectValue placeholder="Seleccionar sucursal..." />
          </SelectTrigger>
          <SelectContent>
            {sucursales.map((s: any) => (
              <SelectItem key={s.id_sucursal} value={String(s.id_sucursal)}>
                {s.nombre_sucursal} — {s.muebleria?.nombre_negocio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!sucursalId ? (
        <SectionCard>
          <EmptyState
            icon={Warehouse}
            title="Selecciona una sucursal"
            description="Elige una sucursal para visualizar su inventario en tiempo real"
          />
        </SectionCard>
      ) : (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KPICard title="Total productos" value={metrics.total} icon={Warehouse} variant="green" loading={loading} />
            <KPICard title="Estado crítico" value={metrics.critico} icon={AlertTriangle} variant="red" loading={loading} />
            <KPICard title="Stock bajo" value={metrics.bajo} icon={TrendingDown} variant="gold" loading={loading} />
            <KPICard title="Stock normal" value={metrics.normal} icon={CheckCircle} variant="teal" loading={loading} />
          </div>

          {/* Alert critico */}
          {metrics.critico > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  {metrics.critico} producto(s) en estado crítico
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Requieren reabastecimiento inmediato
                </p>
              </div>
            </div>
          )}

          {/* Table */}
          <SectionCard noPadding>
            <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--color-border)]">
              <SearchFilter value={search} onChange={setSearch} placeholder="Buscar producto o SKU..." className="flex-1" />
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 h-9 rounded-xl text-sm">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="crítico">Crítico</SelectItem>
                    <SelectItem value="bajo">Bajo</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="exceso">Exceso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DataTable
              data={filtered as any}
              columns={columns as any}
              loading={loading}
              pageSize={12}
              emptyMessage="Sin productos en inventario"
            />
          </SectionCard>
        </div>
      )}

      <MovimientoDialog
        open={!!movTarget}
        onClose={() => setMovTarget(null)}
        inventario={movTarget}
      />
    </div>
  );
}
