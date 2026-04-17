import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Package, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  GET_PRODUCTOS, CREATE_PRODUCTO, UPDATE_PRODUCTO, REMOVE_PRODUCTO,
} from '@/graphql/productos';
import { GET_MIS_MUEBLERIAS } from '@/graphql/mueblerias';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { EmptyState } from '@/components/shared/EmptyState';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { formatMXN } from '@/lib/formatters';
import type { Producto } from '@/types';

const CATEGORIAS = ['Sala', 'Comedor', 'Recámara', 'Oficina', 'Cocina', 'Baño', 'Exterior', 'Decoración', 'Otro'];
const TIPOS = ['Terminado', 'En producción', 'Materia prima'];
const UNIDADES = ['pieza', 'juego', 'metro', 'kilogramo'];

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  precio_venta: z.coerce.number().min(0, 'Precio inválido'),
  peso_kg: z.coerce.number().optional(),
  tipo_producto: z.string().optional(),
  imagen_url: z.string().optional(),
  id_muebleria: z.coerce.number().min(1, 'Mueblería requerida'),
});

type FormData = z.infer<typeof schema>;

interface ProductoFormProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  producto?: Producto | null;
  mueblerias: any[];
  onSuccess: () => void;
}

function ProductoForm({ open, onOpenChange, producto, mueblerias, onSuccess }: ProductoFormProps) {
  const isEdit = !!producto;
  const [createProducto, { loading: creating }] = useMutation(CREATE_PRODUCTO, {
    refetchQueries: [{ query: GET_PRODUCTOS }],
  });
  const [updateProducto, { loading: updating }] = useMutation(UPDATE_PRODUCTO, {
    refetchQueries: [{ query: GET_PRODUCTOS }],
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: producto ? {
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      categoria: producto.categoria ?? '',
      precio_venta: producto.precio_venta,
      peso_kg: producto.peso_kg,
      tipo_producto: producto.tipo_producto ?? '',
      imagen_url: producto.imagen_url ?? '',
      id_muebleria: producto.muebleria?.id_muebleria ?? 0,
    } : { precio_venta: 0, id_muebleria: mueblerias[0]?.id_muebleria ?? 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateProducto({ variables: { input: { id_producto: producto!.id_producto, ...data } } });
        toast.success('Producto actualizado');
      } else {
        await createProducto({ variables: { input: data } });
        toast.success('Producto creado');
      }
      reset();
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al guardar');
    }
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label>Nombre *</Label>
              <Input {...register('nombre')} placeholder="Sofá Milano 3 pzas" className="rounded-xl" />
              {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Precio de venta *</Label>
              <Input type="number" step="0.01" {...register('precio_venta')} placeholder="0.00" className="rounded-xl" />
              {errors.precio_venta && <p className="text-xs text-red-500">{errors.precio_venta.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Peso (kg)</Label>
              <Input type="number" step="0.01" {...register('peso_kg')} placeholder="0.00" className="rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Controller name="categoria" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </div>

            <div className="space-y-1.5">
              <Label>Tipo de producto</Label>
              <Controller name="tipo_producto" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Mueblería *</Label>
              <Controller name="id_muebleria" control={control} render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? '')}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Seleccionar mueblería..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mueblerias.map((m: any) => (
                      <SelectItem key={m.id_muebleria} value={String(m.id_muebleria)}>
                        {m.nombre_negocio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>URL imagen</Label>
              <Input {...register('imagen_url')} placeholder="https://..." className="rounded-xl" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Descripción</Label>
              <Textarea {...register('descripcion')} placeholder="Descripción del producto..." className="rounded-xl" rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-primary text-white"
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear producto')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductosPage() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Producto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Producto | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: productosRaw, loading: loadingProductos } = useQuery(GET_PRODUCTOS);
  const { data: muebleriaRaw } = useQuery(GET_MIS_MUEBLERIAS);
  const [removeProducto, { loading: removing }] = useMutation(REMOVE_PRODUCTO, {
    refetchQueries: [{ query: GET_PRODUCTOS }],
  });

  const productosData = productosRaw as any;
  const muebleriaData = muebleriaRaw as any;
  const mueblerias = muebleriaData?.misMueblerias ?? [];
  const productos: Producto[] = productosData?.productos ?? [];

  const filtered = useMemo(() => {
    let list = productos;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.categoria?.toLowerCase().includes(q),
      );
    }
    if (categoryFilter) list = list.filter((p) => p.categoria === categoryFilter);
    return list;
  }, [productos, debouncedSearch, categoryFilter]);

  const categories = useMemo(() => [...new Set(productos.map((p) => p.categoria).filter(Boolean))], [productos]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await removeProducto({ variables: { id_producto: deleteTarget.id_producto } });
      toast.success('Producto eliminado');
      setDeleteTarget(null);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al eliminar');
    }
  };

  const columns = [
    {
      key: 'imagen_url', header: '',
      render: (p: Producto) => (
        <div className="w-9 h-9 rounded-xl overflow-hidden bg-[var(--color-background)] flex items-center justify-center shrink-0">
          {p.imagen_url
            ? <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
            : <Package className="w-4 h-4 text-[var(--color-muted)]" />}
        </div>
      ),
      width: '48px',
    },
    {
      key: 'nombre', header: 'Producto', sortable: true,
      render: (p: Producto) => (
        <div>
          <p className="font-semibold text-sm text-[var(--color-foreground)]">{p.nombre}</p>
          <p className="text-xs text-[var(--color-muted-foreground)] font-mono">{p.sku}</p>
        </div>
      ),
    },
    {
      key: 'categoria', header: 'Categoría', sortable: true,
      render: (p: Producto) => p.categoria
        ? <Badge className="text-xs bg-[var(--color-background)] text-[var(--color-foreground-mid)] border-[var(--color-border)]">{p.categoria}</Badge>
        : <span className="text-[var(--color-muted)]">—</span>,
    },
    {
      key: 'tipo_producto', header: 'Tipo', sortable: true,
      render: (p: Producto) => <span className="text-sm text-[var(--color-foreground-mid)]">{p.tipo_producto ?? '—'}</span>,
    },
    {
      key: 'precio_venta', header: 'Precio', sortable: true, align: 'right' as const,
      render: (p: Producto) => (
        <span className="text-sm font-semibold text-[var(--color-primary)]">
          {formatMXN(p.precio_venta)}
        </span>
      ),
    },
    {
      key: 'muebleria', header: 'Mueblería',
      render: (p: Producto) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">{p.muebleria?.nombre_negocio ?? '—'}</span>
      ),
    },
    {
      key: 'acciones', header: '',
      render: (p: Producto) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon"
            className="w-7 h-7 rounded-lg hover:bg-[var(--color-background)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
            onClick={(e) => { e.stopPropagation(); setEditTarget(p); setFormOpen(true); }}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon"
            className="w-7 h-7 rounded-lg hover:bg-red-50 text-[var(--color-muted-foreground)] hover:text-red-600"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle={`${filtered.length} productos en catálogo`}
        actions={
          <Button
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="bg-gradient-primary text-white rounded-xl h-9 text-sm gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo producto
          </Button>
        }
      />

      <SectionCard noPadding>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-[var(--color-border)]">
          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre, SKU o categoría..."
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[var(--color-muted-foreground)] shrink-0" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 h-9 rounded-xl text-sm">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {categories.map((c) => <SelectItem key={c!} value={c!}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loadingProductos}
          pageSize={12}
          emptyMessage="Sin productos. Crea el primero."
        />
      </SectionCard>

      {/* Form dialog */}
      <ProductoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        producto={editTarget}
        mueblerias={mueblerias}
        onSuccess={() => setEditTarget(null)}
      />

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Eliminar producto"
        description={`¿Eliminar "${deleteTarget?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        loading={removing}
        confirmLabel="Eliminar"
        variant="danger"
      />
    </div>
  );
}
