import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Users, Shield, Pencil, UserX, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { GET_USUARIOS, UPDATE_USUARIO, DEACTIVATE_USUARIO, GET_ROLES } from '@/graphql/usuarios';
import { PageHeader } from '@/components/shared/PageHeader';
import { SectionCard } from '@/components/shared/SectionCard';
import { KPICard } from '@/components/shared/KPICard';
import { SearchFilter } from '@/components/shared/SearchFilter';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DataTable } from '@/components/shared/DataTable';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDateShort, initials } from '@/lib/formatters';
import type { Usuario } from '@/types';

const schema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  correo: z.string().email('Email inválido'),
  id_rol: z.coerce.number().min(1, 'Rol requerido'),
});
type FormData = z.infer<typeof schema>;

function UsuarioForm({ open, onOpenChange, usuario, roles, onSuccess }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  usuario?: Usuario | null; roles: any[]; onSuccess: () => void;
}) {
  const [updateUsuario, { loading }] = useMutation(UPDATE_USUARIO, { refetchQueries: [{ query: GET_USUARIOS }] });

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: usuario ? {
      nombre: usuario.nombre,
      correo: usuario.correo,
      id_rol: usuario.rol?.id_rol ?? 0,
    } : {},
  });

  const onSubmit = async (data: FormData) => {
    if (!usuario) return;
    try {
      await updateUsuario({ variables: { input: { id_usuario: usuario.id_usuario, ...data } } });
      toast.success('Usuario actualizado');
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al actualizar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Editar usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nombre *</Label>
            <Input {...register('nombre')} className="rounded-xl" />
            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Correo *</Label>
            <Input type="email" {...register('correo')} className="rounded-xl" />
            {errors.correo && <p className="text-xs text-red-500">{errors.correo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Rol *</Label>
            <Controller name="id_rol" control={control} render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? '')}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Rol..." /></SelectTrigger>
                <SelectContent>
                  {roles.map((r: any) => (
                    <SelectItem key={r.id_rol} value={String(r.id_rol)}>{r.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancelar</Button>
            <Button type="submit" disabled={loading} className="rounded-xl bg-gradient-primary text-white">
              {loading ? 'Guardando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Usuario | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Usuario | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  const { data: raw, loading } = useQuery(GET_USUARIOS);
  const { data: rolesRaw } = useQuery(GET_ROLES);
  const [deactivateUsuario, { loading: deactivating }] = useMutation(DEACTIVATE_USUARIO, {
    refetchQueries: [{ query: GET_USUARIOS }],
  });

  const data = raw as any;
  const rolesData = rolesRaw as any;
  const usuarios: Usuario[] = data?.usuarios ?? [];
  const roles = rolesData?.roles ?? [];

  const filtered = useMemo(() => {
    if (!debouncedSearch) return usuarios;
    const q = debouncedSearch.toLowerCase();
    return usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(q) ||
      u.correo.toLowerCase().includes(q) ||
      u.rol?.nombre.toLowerCase().includes(q),
    );
  }, [usuarios, debouncedSearch]);

  const metrics = useMemo(() => {
    const rolesMap: Record<string, number> = {};
    usuarios.forEach((u) => {
      const r = u.rol?.nombre ?? 'Sin rol';
      rolesMap[r] = (rolesMap[r] ?? 0) + 1;
    });
    return {
      total: usuarios.length,
      activos: usuarios.filter((u) => u.activo).length,
      rolesMap,
    };
  }, [usuarios]);

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      await deactivateUsuario({ variables: { id_usuario: deactivateTarget.id_usuario } });
      toast.success('Usuario desactivado');
      setDeactivateTarget(null);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    }
  };

  const columns = [
    {
      key: 'nombre', header: 'Usuario',
      render: (u: Usuario) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: u.activo ? 'linear-gradient(135deg, #1A3A2A, #2D5A3D)' : '#E5E7EB', color: u.activo ? '#E8C97A' : '#9CA3AF' }}>
            {initials(u.nombre)}
          </div>
          <div>
            <p className="text-sm font-semibold">{u.nombre}</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">{u.correo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rol', header: 'Rol', sortable: true,
      render: (u: Usuario) => <StatusBadge status={u.rol?.nombre ?? 'Sin rol'} size="sm" />,
    },
    {
      key: 'fecha_registro', header: 'Registro', sortable: true,
      render: (u: Usuario) => (
        <span className="text-xs text-[var(--color-muted-foreground)]">
          {u.fecha_registro ? formatDateShort(u.fecha_registro) : '—'}
        </span>
      ),
    },
    {
      key: 'activo', header: 'Estado',
      render: (u: Usuario) => <StatusBadge status={u.activo ? 'Activo' : 'Inactivo'} size="sm" />,
    },
    {
      key: 'acciones', header: '', align: 'right' as const,
      render: (u: Usuario) => (
        <div className="flex items-center gap-1 justify-end">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-lg text-[var(--color-muted-foreground)]"
            onClick={(e) => { e.stopPropagation(); setEditTarget(u); setFormOpen(true); }}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          {u.activo && (
            <Button variant="ghost" size="icon"
              className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-600 text-[var(--color-muted-foreground)]"
              onClick={(e) => { e.stopPropagation(); setDeactivateTarget(u); }}>
              <UserX className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de usuarios del sistema"
        actions={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--color-border-gold)] bg-[var(--color-gold-50)]">
            <Shield className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-semibold text-[var(--color-accent)]">Solo administradores</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <KPICard title="Total usuarios" value={metrics.total} icon={Users} variant="green" loading={loading} />
        <KPICard title="Activos" value={metrics.activos} icon={Users} variant="teal" loading={loading} />
        <KPICard title="Propietarios" value={metrics.rolesMap['Propietario'] ?? 0} icon={Shield} variant="gold" loading={loading} />
        <KPICard title="Empleados" value={metrics.rolesMap['Empleado'] ?? 0} icon={Users} variant="blue" loading={loading} />
      </div>

      <SectionCard noPadding>
        <div className="p-4 border-b border-[var(--color-border)]">
          <SearchFilter value={search} onChange={setSearch} placeholder="Buscar por nombre, correo o rol..." />
        </div>
        <DataTable
          data={filtered as any}
          columns={columns as any}
          loading={loading}
          pageSize={12}
          emptyMessage="Sin usuarios registrados"
        />
      </SectionCard>

      <UsuarioForm
        open={formOpen}
        onOpenChange={setFormOpen}
        usuario={editTarget}
        roles={roles}
        onSuccess={() => setEditTarget(null)}
      />

      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(v) => !v && setDeactivateTarget(null)}
        title="Desactivar usuario"
        description={`¿Desactivar a "${deactivateTarget?.nombre}"? No podrá acceder al sistema.`}
        onConfirm={handleDeactivate}
        loading={deactivating}
        confirmLabel="Desactivar"
        variant="danger"
      />
    </div>
  );
}
