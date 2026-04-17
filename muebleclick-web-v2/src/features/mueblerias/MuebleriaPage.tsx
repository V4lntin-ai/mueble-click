import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Store, Plus, Pencil, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { GET_MIS_MUEBLERIAS, GET_ALL_MUEBLERIAS, CREATE_MUEBLERIA, UPDATE_MUEBLERIA } from '@/graphql/mueblerias';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/shared/DataTable';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort } from '@/lib/formatters';
import type { Muebleria } from '@/types';

const schema = z.object({
  nombre_negocio: z.string().min(1, 'Nombre requerido'),
  razon_social: z.string().optional(),
  rfc: z.string().optional(),
  direccion_principal: z.string().optional(),
  telefono: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function MuebleriaForm({ open, onOpenChange, muebleria, isAdmin, onSuccess }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  muebleria?: Muebleria | null; isAdmin: boolean; onSuccess: () => void;
}) {
  const isEdit = !!muebleria;
  const refetchQuery = isAdmin ? GET_ALL_MUEBLERIAS : GET_MIS_MUEBLERIAS;
  const [createMuebleria, { loading: creating }] = useMutation(CREATE_MUEBLERIA, { refetchQueries: [{ query: refetchQuery }] });
  const [updateMuebleria, { loading: updating }] = useMutation(UPDATE_MUEBLERIA, { refetchQueries: [{ query: refetchQuery }] });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: muebleria ? {
      nombre_negocio: muebleria.nombre_negocio,
      razon_social: muebleria.razon_social ?? '',
      rfc: muebleria.rfc ?? '',
      direccion_principal: muebleria.direccion_principal ?? '',
      telefono: muebleria.telefono ?? '',
    } : {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateMuebleria({ variables: { input: { id_muebleria: muebleria!.id_muebleria, ...data } } });
        toast.success('Mueblería actualizada');
      } else {
        await createMuebleria({ variables: { input: data } });
        toast.success('Mueblería creada');
      }
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al guardar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{isEdit ? 'Editar mueblería' : 'Nueva mueblería'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre del negocio *</Label>
            <Input {...register('nombre_negocio')} placeholder="Muebles del Norte S.A." className="rounded-xl" />
            {errors.nombre_negocio && <p className="text-xs text-red-500">{errors.nombre_negocio.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Razón social</Label>
              <Input {...register('razon_social')} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label>RFC</Label>
              <Input {...register('rfc')} placeholder="ABC123456XYZ" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Dirección principal</Label>
            <Input {...register('direccion_principal')} className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input {...register('telefono')} className="rounded-xl" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={creating || updating} className="rounded-xl bg-gradient-primary text-white">
              {(creating || updating) ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear mueblería')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MuebleriaPage() {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Muebleria | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const query = isAdmin ? GET_ALL_MUEBLERIAS : GET_MIS_MUEBLERIAS;
  const dataKey = isAdmin ? 'mueblerias' : 'misMueblerias';
  const { data: raw, loading } = useQuery(query);
  const data = raw as any;

  const mueblerias: Muebleria[] = data?.[dataKey] ?? [];

  const filtered = useMemo(() => {
    if (!debouncedSearch) return mueblerias;
    const q = debouncedSearch.toLowerCase();
    return mueblerias.filter((m) =>
      m.nombre_negocio.toLowerCase().includes(q) ||
      m.rfc?.toLowerCase().includes(q) ||
      m.razon_social?.toLowerCase().includes(q),
    );
  }, [mueblerias, debouncedSearch]);

  const totalSucursales = useMemo(
    () => mueblerias.reduce((s, m) => s + (m.sucursales?.length ?? 0), 0),
    [mueblerias],
  );
  const totalActivas = useMemo(
    () => mueblerias.flatMap((m) => m.sucursales ?? []).filter((s) => s.activo).length,
    [mueblerias],
  );

  const columns = [
    {
      key: 'nombre_negocio', header: 'Mueblería', sortable: true,
      render: (m: Muebleria) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-primary">
            <Store className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">{m.nombre_negocio}</p>
            {m.razon_social && <p className="text-xs text-[var(--color-muted-foreground)]">{m.razon_social}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'rfc', header: 'RFC',
      render: (m: Muebleria) => <span className="text-sm font-mono">{m.rfc ?? '—'}</span>,
    },
    {
      key: 'propietario', header: 'Propietario',
      render: (m: Muebleria) => (
        <div>
          <p className="text-sm">{m.propietario?.usuario?.nombre ?? '—'}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">{m.propietario?.usuario?.correo}</p>
        </div>
      ),
    },
    {
      key: 'sucursales', header: 'Sucursales', align: 'center' as const,
      render: (m: Muebleria) => (
        <div className="text-center">
          <p className="text-sm font-semibold">{m.sucursales?.length ?? 0}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {m.sucursales?.filter((s) => s.activo).length ?? 0} activas
          </p>
        </div>
      ),
    },
    {
      key: 'creado_en', header: 'Registro', sortable: true,
      render: (m: Muebleria) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {m.creado_en ? formatDateShort(m.creado_en) : '—'}
        </span>
      ),
    },
    {
      key: 'acciones', header: '', align: 'right' as const,
      render: (m: Muebleria) => (
        <Button variant="ghost" size="icon"
          className="w-7 h-7 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          onClick={(e) => { e.stopPropagation(); setEditTarget(m); setFormOpen(true); }}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Mueblerías"
        subtitle={`${filtered.length} mueblerías registradas`}
        actions={
          <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="bg-gradient-primary text-white rounded-xl h-9 text-sm gap-2">
            <Plus className="w-4 h-4" /> Nueva mueblería
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KPICard title="Total mueblerías" value={mueblerias.length} icon={Store} variant="green" loading={loading} />
        <KPICard title="Sucursales" value={totalSucursales} icon={MapPin} variant="gold" loading={loading} />
        <KPICard title="Sucursales activas" value={totalActivas} icon={MapPin} variant="teal" loading={loading} />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por nombre, RFC o razón social..." />
        </div>
        {filtered.length === 0 && !loading ? (
          <EmptyState icon={Store} title="Sin mueblerías" description="Registra tu primera mueblería para comenzar" />
        ) : (
          <DataTable
            data={filtered as any}
            columns={columns as any}
            loading={loading}
            pageSize={10}
            emptyMessage="Sin mueblerías"
          />
        )}
      </SectionCard>

      <MuebleriaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        muebleria={editTarget}
        isAdmin={isAdmin}
        onSuccess={() => setEditTarget(null)}
      />
    </div>
  );
}
