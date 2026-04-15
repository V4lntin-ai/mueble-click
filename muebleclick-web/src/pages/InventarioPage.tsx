import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Warehouse, AlertTriangle, Package,
  Search, AlertCircle, Plus,
  ArrowUp, ArrowDown, Settings2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  GET_INVENTARIO_POR_SUCURSAL,
  UPDATE_INVENTARIO,
  CREATE_MOVIMIENTO_INVENTARIO,
} from '@/graphql/inventario';
import { GET_SUCURSALES } from '@/graphql/sucursales';

function formatMXN(v: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(v);
}

const movimientoSchema = z.object({
  tipo:     z.enum(['entrada', 'salida', 'ajuste']),
  cantidad: z.coerce.number().min(1, 'Mínimo 1'),
  nota:     z.string().optional(),
});
type MovimientoForm = z.infer<typeof movimientoSchema>;

function MovimientoDialog({
  open, onClose, inventario, onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  inventario: any;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<MovimientoForm>({ resolver: zodResolver(movimientoSchema), defaultValues: { tipo: 'entrada' } });

  const tipo = watch('tipo');

  const [createMovimiento, { loading }] = useMutation(CREATE_MOVIMIENTO_INVENTARIO, {
    onCompleted: () => {
      toast.success('Movimiento registrado');
      reset();
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const onSubmit = (data: MovimientoForm) => {
    createMovimiento({
      variables: {
        input: {
          id_sucursal: inventario.sucursal_id,
          id_producto: inventario.producto.id_producto,
          tipo: data.tipo,
          cantidad: data.cantidad,
          nota: data.nota,
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            {inventario?.producto?.nombre} — Stock actual: {inventario?.cantidad}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Tipo */}
          <div className="grid grid-cols-3 gap-2">
            {(['entrada', 'salida', 'ajuste'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue('tipo', t)}
                className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  tipo === t
                    ? t === 'entrada'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : t === 'salida'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:bg-[var(--color-beige)]'
                }`}
              >
                {t === 'entrada' ? '↑ Entrada' : t === 'salida' ? '↓ Salida' : '⇄ Ajuste'}
              </button>
            ))}
          </div>

          {/* Cantidad */}
          <div className="space-y-1.5">
            <Label>Cantidad <span className="text-red-500">*</span></Label>
            <Input type="number" min="1" placeholder="0" {...register('cantidad')} />
            {errors.cantidad && <p className="text-xs text-red-500">{errors.cantidad.message}</p>}
          </div>

          {/* Nota */}
          <div className="space-y-1.5">
            <Label>Nota</Label>
            <Input placeholder="Motivo del movimiento..." {...register('nota')} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white"
            >
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function InventarioPage() {
  const { isPropietario, isAdmin } = useAuth();
  const [sucursalId, setSucursalId] = useState<number | null>(null);
  const [search, setSearch]         = useState('');
  const [tab, setTab]               = useState('todos');
  const [movDialogOpen, setMovDialogOpen] = useState(false);
  const [selectedInv, setSelectedInv]     = useState<any>(null);

  const { data: sucursalData } = useQuery(GET_SUCURSALES);
  const sucursales = sucursalData?.sucursales ?? [];

  const currentSucursal = sucursalId ?? sucursales[0]?.id_sucursal ?? null;

  const { data, loading, error, refetch } = useQuery(GET_INVENTARIO_POR_SUCURSAL, {
    variables: { id_sucursal: currentSucursal },
    skip: !currentSucursal,
  });

  const inventarios = data?.inventarioPorSucursal ?? [];

  const filtered = useMemo(() => {
    return inventarios.filter((inv: any) => {
      const matchSearch =
        !search ||
        inv.producto?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        inv.producto?.sku?.toLowerCase().includes(search.toLowerCase());
      const esCritico = Number(inv.cantidad) <= Number(inv.stock_min);
      const matchTab =
        tab === 'todos' ||
        (tab === 'critico' && esCritico) ||
        (tab === 'ok' && !esCritico);
      return matchSearch && matchTab;
    });
  }, [inventarios, search, tab]);

  const criticos = inventarios.filter((i: any) => Number(i.cantidad) <= Number(i.stock_min)).length;

  const handleMovimiento = (inv: any) => {
    setSelectedInv({ ...inv, sucursal_id: currentSucursal });
    setMovDialogOpen(true);
  };

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Stock de productos por sucursal"
      />

      {/* Selector de sucursal */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="w-full sm:w-64">
          <Select
            value={currentSucursal?.toString()}
            onValueChange={(v) => setSucursalId(Number(v))}
          >
            <SelectTrigger className="rounded-xl">
              <Warehouse className="w-4 h-4 mr-2 text-[var(--color-muted-foreground)]" />
              <SelectValue placeholder="Selecciona sucursal" />
            </SelectTrigger>
            <SelectContent>
              {sucursales.map((s: any) => (
                <SelectItem key={s.id_sucursal} value={s.id_sucursal.toString()}>
                  {s.nombre_sucursal}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="bg-white border border-[var(--color-border)] rounded-xl h-10">
            <TabsTrigger value="todos"   className="rounded-lg text-xs">Todos ({inventarios.length})</TabsTrigger>
            <TabsTrigger value="critico" className="rounded-lg text-xs">
              <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
              Stock crítico {criticos > 0 && `(${criticos})`}
            </TabsTrigger>
            <TabsTrigger value="ok" className="rounded-lg text-xs">OK</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Alerta stock crítico */}
      {criticos > 0 && (
        <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {criticos} producto(s) con stock crítico en esta sucursal.
          </AlertDescription>
        </Alert>
      )}

      {/* Grid */}
      {!currentSucursal ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Warehouse className="w-12 h-12 text-[var(--color-muted)] mb-3" />
          <p className="text-sm text-[var(--color-muted-foreground)]">Selecciona una sucursal para ver el inventario.</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="w-12 h-12 text-[var(--color-muted)] mb-3" />
          <p className="text-sm text-[var(--color-muted-foreground)]">Sin productos en inventario.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((inv: any) => {
            const cantidad   = Number(inv.cantidad);
            const reservado  = Number(inv.reservado);
            const disponible = cantidad - reservado;
            const stockMin   = Number(inv.stock_min);
            const stockMax   = Number(inv.stock_max);
            const esCritico  = cantidad <= stockMin;
            const pct        = stockMax > 0 ? Math.min((cantidad / stockMax) * 100, 100) : 0;

            return (
              <div
                key={inv.id_inventario}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                  esCritico ? 'border-amber-200' : 'border-[var(--color-border)]'
                }`}
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {inv.producto?.imagen_url ? (
                      <img src={inv.producto.imagen_url} className="w-10 h-10 rounded-xl object-cover border border-[var(--color-border)]" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-beige-dark)] flex items-center justify-center">
                        <Package className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold leading-tight">{inv.producto?.nombre}</p>
                      {inv.producto?.sku && (
                        <p className="text-xs font-mono text-[var(--color-muted-foreground)] mt-0.5">{inv.producto.sku}</p>
                      )}
                    </div>
                  </div>
                  {esCritico && (
                    <Badge className="bg-amber-50 text-amber-700 border-0 text-xs shrink-0 gap-1">
                      <AlertTriangle className="w-3 h-3" /> Crítico
                    </Badge>
                  )}
                </div>

                {/* Barra de stock */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--color-muted-foreground)]">Stock</span>
                    <span className="font-bold">{cantidad} / {stockMax || '∞'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-beige-dark)] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        esCritico ? 'bg-amber-400' : pct > 60 ? 'bg-emerald-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 rounded-xl bg-[var(--color-beige)]">
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">Disponible</p>
                    <p className="text-sm font-bold text-emerald-600">{disponible}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[var(--color-beige)]">
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">Reservado</p>
                    <p className="text-sm font-bold text-blue-600">{reservado}</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-[var(--color-beige)]">
                    <p className="text-[10px] text-[var(--color-muted-foreground)]">Mín.</p>
                    <p className={`text-sm font-bold ${esCritico ? 'text-amber-600' : 'text-[var(--color-foreground)]'}`}>
                      {stockMin}
                    </p>
                  </div>
                </div>

                {/* Precio + acciones */}
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--color-primary-dark)]">
                    {formatMXN(Number(inv.producto?.precio_venta))}
                  </span>
                  {(isPropietario || isAdmin) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs rounded-lg gap-1.5"
                      onClick={() => handleMovimiento(inv)}
                    >
                      <Settings2 className="w-3 h-3" />
                      Movimiento
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedInv && (
        <MovimientoDialog
          open={movDialogOpen}
          onClose={() => setMovDialogOpen(false)}
          inventario={selectedInv}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}