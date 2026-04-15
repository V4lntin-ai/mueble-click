import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Plus, Package, Search, Filter,
  Pencil, Trash2, AlertCircle, Tag,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ProductoFormDialog } from './ProductoFormDialog';
import { GET_PRODUCTOS, REMOVE_PRODUCTO } from '@/graphql/productos';

interface ProductoData {
  id_producto: number;
  sku?: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tipo_producto: string;
  precio_venta: number | string;
  peso_kg?: number;
  imagen_url?: string;
  muebleria?: { id_muebleria: number; nombre_negocio: string };
}

const CATEGORIAS = ['Todas', 'Sala', 'Recámara', 'Comedor', 'Oficina', 'Exterior', 'Baño', 'Infantil', 'Otro'];

function formatMXN(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 0,
  }).format(value);
}

function tipoBadge(tipo: string) {
  const map: Record<string, string> = {
    producto_final: 'bg-emerald-50 text-emerald-700',
    ensamblado:     'bg-blue-50 text-blue-700',
    materia_prima:  'bg-amber-50 text-amber-700',
  };
  const label: Record<string, string> = {
    producto_final: 'Final',
    ensamblado:     'Ensamblado',
    materia_prima:  'Materia prima',
  };
  return { cls: map[tipo] ?? 'bg-gray-100 text-gray-600', label: label[tipo] ?? tipo };
}

export default function ProductosPage() {
  const { isPropietario, isAdmin } = useAuth();
  const [search, setSearch]         = useState('');
  const [categoria, setCategoria]   = useState('Todas');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected]     = useState<ProductoData | null>(null);
  const [deleteId, setDeleteId]     = useState<number | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_PRODUCTOS);
  const productos = useMemo(() => data?.productos ?? [], [data?.productos]);

  const [removeProducto, { loading: removing }] = useMutation(REMOVE_PRODUCTO, {
    onCompleted: () => { toast.success('Producto eliminado'); refetch(); setDeleteId(null); },
    onError: (e) => toast.error('Error al eliminar', { description: e.message }),
  });

  const filtered = useMemo(() => {
    return productos.filter((p: ProductoData) => {
      const matchSearch =
        !search ||
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoria === 'Todas' || p.categoria === categoria;
      return matchSearch && matchCat;
    });
  }, [productos, search, categoria]);

  const handleEdit   = (p: ProductoData) => { setSelected(p); setDialogOpen(true); };
  const handleNew    = () => { setSelected(null); setDialogOpen(true); };
  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      removeProducto({ variables: { id_producto: id } });
    }
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
        title="Productos"
        subtitle="Catálogo de productos de tus mueblerías"
        action={
          isPropietario && (
            <Button
              onClick={handleNew}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo producto
            </Button>
          )
        }
      />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl">
            <Filter className="w-4 h-4 mr-2 text-[var(--color-muted-foreground)]" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contador */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {filtered.length} producto(s) encontrado(s)
        </p>
      </div>

      {/* Tabla */}
      <div
        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}
      >
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
            >
              <Package className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-base font-semibold mb-1">Sin productos</h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {search || categoria !== 'Todas'
                ? 'No hay productos que coincidan con los filtros.'
                : 'Agrega tu primer producto al catálogo.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--color-beige)] hover:bg-[var(--color-beige)]">
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Producto</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">SKU</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Categoría</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Tipo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-right">Precio</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Mueblería</TableHead>
                {(isPropietario || isAdmin) && (
                  <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">
                    Acciones
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p: ProductoData) => {
                const { cls, label } = tipoBadge(p.tipo_producto);
                return (
                  <TableRow
                    key={p.id_producto}
                    className="hover:bg-[var(--color-beige)] transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {p.imagen_url ? (
                          <img
                            src={p.imagen_url}
                            alt={p.nombre}
                            className="w-9 h-9 rounded-lg object-cover border border-[var(--color-border)]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-[var(--color-beige-dark)] flex items-center justify-center">
                            <Package className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold">{p.nombre}</p>
                          {p.descripcion && (
                            <p className="text-xs text-[var(--color-muted-foreground)] truncate max-w-[180px]">
                              {p.descripcion}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.sku ? (
                        <span className="text-xs font-mono bg-[var(--color-beige)] px-2 py-0.5 rounded-md">
                          {p.sku}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--color-muted-foreground)]">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {p.categoria ? (
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-[var(--color-muted-foreground)]" />
                          <span className="text-sm">{p.categoria}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-muted-foreground)]">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 ${cls}`}>{label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-bold text-[var(--color-primary-dark)]">
                        {formatMXN(Number(p.precio_venta))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        {p.muebleria?.nombre_negocio}
                      </span>
                    </TableCell>
                    {(isPropietario || isAdmin) && (
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => handleEdit(p)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDelete(p.id_producto)}
                            disabled={removing && deleteId === p.id_producto}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <ProductoFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => refetch()}
        producto={selected}
      />
    </div>
  );
}