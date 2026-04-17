/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Users, Plus, Pencil, ToggleLeft, ToggleRight, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { GET_EMPLEADOS, CREATE_EMPLEADO, UPDATE_EMPLEADO, TOGGLE_ACTIVO_EMPLEADO } from '@/graphql/empleados';
import { GET_SUCURSALES } from '@/graphql/sucursales';
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
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort, initials } from '@/lib/formatters';
import type { Empleado } from '@/types';

const PUESTOS = ['Gerente', 'Vendedor', 'Cajero', 'Almacenista', 'Supervisor', 'Administrativo', 'Otro'];

const schema = z.object({
  id_usuario: z.coerce.number().min(1, 'ID de usuario requerido'),
  id_sucursal: z.coerce.number().min(1, 'Sucursal requerida'),
  puesto: z.string().min(1, 'Puesto requerido'),
  fecha_ingreso: z.string().min(1, 'Fecha requerida'),
  es_vendedor: z.boolean(),
  comision_pct: z.coerce.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof schema>;

function EmpleadoForm({ open, onOpenChange, empleado, sucursales, onSuccess }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  empleado?: Empleado | null; sucursales: any[]; onSuccess: () => void;
}) {
  const isEdit = !!empleado;
  const [createEmpleado, { loading: creating }] = useMutation(CREATE_EMPLEADO, { refetchQueries: [{ query: GET_EMPLEADOS }] });
  const [updateEmpleado, { loading: updating }] = useMutation(UPDATE_EMPLEADO, { refetchQueries: [{ query: GET_EMPLEADOS }] });

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: empleado ? {
      id_usuario: empleado.id_usuario,
      id_sucursal: empleado.sucursal?.id_sucursal ?? 0,
      puesto: empleado.puesto ?? '',
      fecha_ingreso: empleado.fecha_ingreso?.slice(0, 10) ?? '',
      es_vendedor: empleado.es_vendedor,
      comision_pct: empleado.comision_pct ?? 0,
    } : { es_vendedor: false, comision_pct: 0 },
  });

  const esVendedor = watch('es_vendedor');

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id_usuario: _uid, ...rest } = data;
        await updateEmpleado({ variables: { input: { id_usuario: empleado!.id_usuario, ...rest } } });
        toast.success('Empleado actualizado');
      } else {
        await createEmpleado({ variables: { input: data } });
        toast.success('Empleado registrado');
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
          <DialogTitle className="text-base font-semibold">
            {isEdit ? 'Editar empleado' : 'Nuevo empleado'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-2">
          {!isEdit && (
            <div className="space-y-1.5">
              <Label>ID de usuario existente *</Label>
              <Input type="number" {...register('id_usuario')} className="rounded-xl" placeholder="ID del usuario" />
              {errors.id_usuario && <p className="text-xs text-red-500">{errors.id_usuario.message}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Puesto *</Label>
              <Controller name="puesto" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Puesto..." /></SelectTrigger>
                  <SelectContent>{PUESTOS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </div>

            <div className="space-y-1.5">
              <Label>Sucursal *</Label>
              <Controller name="id_sucursal" control={control} render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? '')}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Sucursal..." /></SelectTrigger>
                  <SelectContent>
                    {sucursales.map((s: any) => (
                      <SelectItem key={s.id_sucursal} value={String(s.id_sucursal)}>{s.nombre_sucursal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )} />
            </div>

            <div className="col-span-2 space-y-1.5">
              <Label>Fecha de ingreso *</Label>
              <Input type="date" {...register('fecha_ingreso')} className="rounded-xl" />
            </div>

            <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-[var(--color-background)]">
              <div>
                <p className="text-sm font-medium">¿Es vendedor?</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">Puede registrar ventas y generar comisiones</p>
              </div>
              <Controller name="es_vendedor" control={control} render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )} />
            </div>

            {esVendedor && (
              <div className="col-span-2 space-y-1.5">
                <Label>Comisión (%)</Label>
                <Input type="number" step="0.5" min="0" max="100" {...register('comision_pct')} className="rounded-xl" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={creating || updating} className="rounded-xl bg-gradient-primary text-white">
              {(creating || updating) ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Registrar empleado')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EmpleadosPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Empleado | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: empRaw, loading } = useQuery(GET_EMPLEADOS);
  const { data: sucRaw } = useQuery(GET_SUCURSALES);
  const [toggleActivo, { loading: toggling }] = useMutation(TOGGLE_ACTIVO_EMPLEADO, {
    refetchQueries: [{ query: GET_EMPLEADOS }],
  });

  const empData = empRaw as any;
  const sucData = sucRaw as any;
  const sucursales: any[] = sucData?.sucursales ?? [];
  const empleados: Empleado[] = empData?.empleados ?? [];

  const filtered = useMemo(() => {
    if (!debouncedSearch) return empleados;
    const q = debouncedSearch.toLowerCase();
    return empleados.filter((e) =>
      e.usuario?.nombre?.toLowerCase().includes(q) ||
      e.puesto?.toLowerCase().includes(q) ||
      e.sucursal?.nombre_sucursal?.toLowerCase().includes(q) ||
      e.codigo_vendedor?.toLowerCase().includes(q),
    );
  }, [empleados, debouncedSearch]);

  const metrics = useMemo(() => ({
    total: empleados.length,
    activos: empleados.filter((e) => e.activo).length,
    vendedores: empleados.filter((e) => e.es_vendedor).length,
    inactivos: empleados.filter((e) => !e.activo).length,
  }), [empleados]);

  const handleToggle = async (id: number) => {
    try {
      await toggleActivo({ variables: { id_usuario: id } });
      toast.success('Estado actualizado');
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const columns = [
    {
      key: 'usuario', header: 'Empleado',
      render: (e: Empleado) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #1A3A2A, #2D5A3D)', color: '#E8C97A' }}>
            {e.usuario?.nombre ? initials(e.usuario.nombre) : 'E'}
          </div>
          <div>
            <p className="text-sm font-semibold">{e.usuario?.nombre ?? '—'}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{e.usuario?.correo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'puesto', header: 'Puesto', sortable: true,
      render: (e: Empleado) => <span className="text-sm">{e.puesto ?? '—'}</span>,
    },
    {
      key: 'sucursal', header: 'Sucursal',
      render: (e: Empleado) => (
        <div>
          <p className="text-sm">{e.sucursal?.nombre_sucursal ?? '—'}</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">{(e.sucursal as any)?.muebleria?.nombre_negocio}</p>
        </div>
      ),
    },
    {
      key: 'es_vendedor', header: 'Rol vendedor',
      render: (e: Empleado) => e.es_vendedor ? (
        <div className="flex items-center gap-1.5">
          <StatusBadge status="Vendedor" size="sm" />
          {e.comision_pct != null && (
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
              {e.comision_pct}%
            </span>
          )}
        </div>
      ) : <span className="text-xs text-[var(--color-muted-foreground)]">No vendedor</span>,
    },
    {
      key: 'fecha_ingreso', header: 'Ingreso', sortable: true,
      render: (e: Empleado) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {e.fecha_ingreso ? formatDateShort(e.fecha_ingreso) : '—'}
        </span>
      ),
    },
    {
      key: 'activo', header: 'Estado',
      render: (e: Empleado) => <StatusBadge status={e.activo ? 'Activo' : 'Inactivo'} size="sm" />,
    },
    {
      key: 'acciones', header: '', align: 'right' as const,
      render: (e: Empleado) => (
        <div className="flex items-center gap-1 justify-end">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"
                className="w-7 h-7 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                onClick={(ev) => { ev.stopPropagation(); setEditTarget(e); setFormOpen(true); }}>
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"
                className={`w-7 h-7 rounded-lg ${e.activo ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-emerald-50 hover:text-emerald-600'} text-[var(--color-muted-foreground)]`}
                disabled={toggling}
                onClick={(ev) => { ev.stopPropagation(); handleToggle(e.id_usuario); }}>
                {e.activo ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{e.activo ? 'Desactivar' : 'Activar'}</TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Empleados"
        subtitle={`${filtered.length} empleados registrados`}
        actions={
          <Button onClick={() => { setEditTarget(null); setFormOpen(true); }}
            className="bg-gradient-primary text-white rounded-xl h-9 text-sm gap-2">
            <Plus className="w-4 h-4" /> Nuevo empleado
          </Button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total empleados" value={metrics.total} icon={Users} variant="green" loading={loading} />
        <KPICard title="Activos" value={metrics.activos} icon={Users} variant="teal" loading={loading} />
        <KPICard title="Vendedores" value={metrics.vendedores} icon={BadgeDollarSign} variant="gold" loading={loading} />
        <KPICard title="Inactivos" value={metrics.inactivos} icon={Users} variant="red" loading={loading} />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por nombre, puesto o sucursal..." />
        </div>
        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loading}
          pageSize={12}
          emptyMessage="Sin empleados registrados"
        />
      </SectionCard>

      <EmpleadoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        empleado={editTarget}
        sucursales={sucursales}
        onSuccess={() => setEditTarget(null)}
      />
    </div>
  );
}
