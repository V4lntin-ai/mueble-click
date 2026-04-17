import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { MapPin, Plus, Pencil, ToggleLeft, ToggleRight, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { GET_SUCURSALES, CREATE_SUCURSAL, UPDATE_SUCURSAL, TOGGLE_ACTIVO_SUCURSAL } from '@/graphql/sucursales';
import { GET_MIS_MUEBLERIAS } from '@/graphql/mueblerias';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort } from '@/lib/formatters';
import type { Sucursal } from '@/types';

const schema = z.object({
  nombre_sucursal: z.string().min(1, 'Nombre requerido'),
  calle_numero: z.string().optional(),
  telefono: z.string().optional(),
  id_muebleria: z.coerce.number().min(1, 'Mueblería requerida'),
});
type FormData = z.infer<typeof schema>;

function SucursalForm({ open, onOpenChange, sucursal, mueblerias, onSuccess }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  sucursal?: Sucursal | null; mueblerias: any[]; onSuccess: () => void;
}) {
  const isEdit = !!sucursal;
  const [createSucursal, { loading: creating }] = useMutation(CREATE_SUCURSAL, { refetchQueries: [{ query: GET_SUCURSALES }] });
  const [updateSucursal, { loading: updating }] = useMutation(UPDATE_SUCURSAL, { refetchQueries: [{ query: GET_SUCURSALES }] });

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: sucursal ? {
      nombre_sucursal: sucursal.nombre_sucursal,
      calle_numero: sucursal.calle_numero ?? '',
      telefono: sucursal.telefono ?? '',
      id_muebleria: sucursal.muebleria?.id_muebleria ?? 0,
    } : { id_muebleria: mueblerias[0]?.id_muebleria ?? 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        await updateSucursal({ variables: { input: { id_sucursal: sucursal!.id_sucursal, ...data } } });
        toast.success('Sucursal actualizada');
      } else {
        await createSucursal({ variables: { input: data } });
        toast.success('Sucursal creada');
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
          <DialogTitle className="text-base font-semibold">{isEdit ? 'Editar sucursal' : 'Nueva sucursal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre *</Label>
            <Input {...register('nombre_sucursal')} placeholder="Sucursal Centro" className="rounded-xl" />
            {errors.nombre_sucursal && <p className="text-xs text-red-500">{errors.nombre_sucursal.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Mueblería *</Label>
            <Controller name="id_muebleria" control={control} render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? '')}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Mueblería..." /></SelectTrigger>
                <SelectContent>
                  {mueblerias.map((m: any) => (
                    <SelectItem key={m.id_muebleria} value={String(m.id_muebleria)}>{m.nombre_negocio}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </div>

          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <Input {...register('calle_numero')} placeholder="Av. Principal 123" className="rounded-xl" />
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input {...register('telefono')} placeholder="(55) 1234-5678" className="rounded-xl" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={creating || updating} className="rounded-xl bg-gradient-primary text-white">
              {(creating || updating) ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear sucursal')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SucursalesPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sucursal | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: raw, loading } = useQuery(GET_SUCURSALES);
  const { data: muebRaw } = useQuery(GET_MIS_MUEBLERIAS);
  const [toggleActivo, { loading: toggling }] = useMutation(TOGGLE_ACTIVO_SUCURSAL, { refetchQueries: [{ query: GET_SUCURSALES }] });

  const data = raw as any;
  const muebData = muebRaw as any;
  const mueblerias = muebData?.misMueblerias ?? [];
  const sucursales: Sucursal[] = data?.sucursales ?? [];

  const filtered = useMemo(() => {
    if (!debouncedSearch) return sucursales;
    const q = debouncedSearch.toLowerCase();
    return sucursales.filter((s) =>
      s.nombre_sucursal.toLowerCase().includes(q) ||
      s.muebleria?.nombre_negocio?.toLowerCase().includes(q) ||
      s.municipio?.nombre?.toLowerCase().includes(q),
    );
  }, [sucursales, debouncedSearch]);

  const metrics = useMemo(() => ({
    total: sucursales.length,
    activas: sucursales.filter((s) => s.activo).length,
    inactivas: sucursales.filter((s) => !s.activo).length,
  }), [sucursales]);

  const handleToggle = async (id: number) => {
    try {
      await toggleActivo({ variables: { id_sucursal: id } });
      toast.success('Estado actualizado');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const columns = [
    {
      key: 'nombre_sucursal', header: 'Sucursal', sortable: true,
      render: (s: Sucursal) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-gradient-primary">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">{s.nombre_sucursal}</p>
            {s.calle_numero && (
              <p className="text-xs text-[var(--color-muted-foreground)]">{s.calle_numero}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'muebleria', header: 'Mueblería',
      render: (s: Sucursal) => (
        <span className="text-sm text-[var(--color-foreground-mid)]">{s.muebleria?.nombre_negocio ?? '—'}</span>
      ),
    },
    {
      key: 'municipio', header: 'Ubicación',
      render: (s: Sucursal) => (
        <div>
          <p className="text-sm">{s.municipio?.nombre ?? '—'}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">{s.municipio?.estado?.nombre}</p>
        </div>
      ),
    },
    {
      key: 'telefono', header: 'Teléfono',
      render: (s: Sucursal) => <span className="text-sm">{s.telefono ?? '—'}</span>,
    },
    {
      key: 'creado_en', header: 'Registro', sortable: true,
      render: (s: Sucursal) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {s.creado_en ? formatDateShort(s.creado_en) : '—'}
        </span>
      ),
    },
    {
      key: 'activo', header: 'Estado',
      render: (s: Sucursal) => <StatusBadge status={s.activo ? 'Activo' : 'Inactivo'} size="sm" />,
    },
    {
      key: 'acciones', header: '', align: 'right' as const,
      render: (s: Sucursal) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg text-[var(--color-muted-foreground)]"
            onClick={(e) => { e.stopPropagation(); setEditTarget(s); setFormOpen(true); }}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon"
            className={`w-7 h-7 rounded-lg ${s.activo ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'} text-[var(--color-muted-foreground)]`}
            disabled={toggling}
            onClick={(e) => { e.stopPropagation(); handleToggle(s.id_sucursal); }}>
            {s.activo ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Sucursales"
        subtitle={`${filtered.length} sucursales registradas`}
        actions={
          <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="bg-gradient-primary text-white rounded-xl h-9 text-sm gap-2">
            <Plus className="w-4 h-4" /> Nueva sucursal
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <KPICard title="Total sucursales" value={metrics.total} icon={MapPin} variant="green" loading={loading} />
        <KPICard title="Activas" value={metrics.activas} icon={MapPin} variant="teal" loading={loading} />
        <KPICard title="Inactivas" value={metrics.inactivas} icon={MapPin} variant="red" loading={loading} />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por nombre, mueblería o municipio..." />
        </div>
        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loading}
          pageSize={12}
          emptyMessage="Sin sucursales registradas"
        />
      </SectionCard>

      <SucursalForm
        open={formOpen}
        onOpenChange={setFormOpen}
        sucursal={editTarget}
        mueblerias={mueblerias}
        onSuccess={() => setEditTarget(null)}
      />
    </div>
  );
}
