import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Users, Search, Pencil, AlertCircle,
  UserX, UserCheck, Star,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmpleadoFormDialog } from './EmpleadoFormDialog';
import { GET_EMPLEADOS, TOGGLE_ACTIVO_EMPLEADO } from '@/graphql/empleados';

interface EmpleadoData {
  id_usuario: number;
  puesto: string;
  fecha_ingreso?: string;
  activo: boolean;
  es_vendedor: boolean;
  codigo_vendedor?: string;
  comision_pct?: number | string;
  usuario?: { id_usuario: number; nombre: string; correo: string; activo: boolean };
  sucursal?: { id_sucursal: number; nombre_sucursal: string; muebleria?: { nombre_negocio: string } };
}

function iniciales(nombre: string) {
  return nombre?.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase() ?? '?';
}

const avatarColors = [
  'linear-gradient(135deg, #2D6A4F, #1B4332)',
  'linear-gradient(135deg, #A0522D, #6B4226)',
  'linear-gradient(135deg, #2563EB, #1D4ED8)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #EA580C, #C2410C)',
];

function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export default function EmpleadosPage() {
  const { isPropietario, isAdmin } = useAuth();
  const [search, setSearch]         = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected]     = useState<EmpleadoData | null>(null);
  const [tab, setTab]               = useState('todos');

  const { data, loading, error, refetch } = useQuery(GET_EMPLEADOS);
  const empleados = useMemo(() => data?.empleados ?? [], [data?.empleados]);

  const [toggleActivo] = useMutation(TOGGLE_ACTIVO_EMPLEADO, {
    onCompleted: (d) => {
      const activo = d.toggleActivoEmpleado.activo;
      toast.success(activo ? 'Empleado activado' : 'Empleado desactivado');
      refetch();
    },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const filtered = useMemo(() => {
    return empleados.filter((e: EmpleadoData) => {
      const matchSearch =
        !search ||
        e.usuario?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
        e.usuario?.correo?.toLowerCase().includes(search.toLowerCase()) ||
        e.puesto?.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        tab === 'todos' ||
        (tab === 'activos'    && e.activo) ||
        (tab === 'inactivos'  && !e.activo) ||
        (tab === 'vendedores' && e.es_vendedor);
      return matchSearch && matchTab;
    });
  }, [empleados, search, tab]);

  const handleEdit   = (e: EmpleadoData) => { setSelected(e); setDialogOpen(true); };
  const handleToggle = (id: number) => toggleActivo({ variables: { id_usuario: id } });

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Empleados"
        subtitle="Gestiona el personal de tus sucursales"
      />

      {/* Tabs + Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="bg-white border border-[var(--color-border)] rounded-xl h-10">
            <TabsTrigger value="todos"      className="rounded-lg text-xs">Todos ({empleados.length})</TabsTrigger>
            <TabsTrigger value="activos"    className="rounded-lg text-xs">Activos</TabsTrigger>
            <TabsTrigger value="vendedores" className="rounded-lg text-xs">Vendedores</TabsTrigger>
            <TabsTrigger value="inactivos"  className="rounded-lg text-xs">Inactivos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar empleado..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
          >
            <Users className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold mb-1">Sin empleados</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No hay empleados que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((emp: EmpleadoData) => (
            <EmpleadoCard
              key={emp.id_usuario}
              empleado={emp}
              canEdit={isPropietario || isAdmin}
              onEdit={() => handleEdit(emp)}
              onToggle={() => handleToggle(emp.id_usuario)}
            />
          ))}
        </div>
      )}

      <EmpleadoFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => refetch()}
        empleado={selected}
      />
    </div>
  );
}

function EmpleadoCard({
  empleado: emp,
  canEdit,
  onEdit,
  onToggle,
}: {
  empleado: EmpleadoData;
  canEdit: boolean;
  onEdit: () => void;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        emp.activo ? 'border-[var(--color-border)]' : 'border-dashed border-gray-200 opacity-75'
      }`}
      style={{ boxShadow: emp.activo ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' : 'none' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-11 h-11">
            <AvatarFallback
              className="text-white text-sm font-bold"
              style={{ background: getAvatarColor(emp.id_usuario) }}
            >
              {iniciales(emp.usuario?.nombre ?? '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-[var(--color-foreground)] leading-tight">
                {emp.usuario?.nombre}
              </p>
              {emp.es_vendedor && (
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              )}
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              {emp.usuario?.correo}
            </p>
          </div>
        </div>

        {/* Estado */}
        <Badge
          className={`text-xs border-0 shrink-0 ${
            emp.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {emp.activo ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-muted-foreground)]">Puesto</span>
          <span className="text-xs font-semibold">{emp.puesto ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--color-muted-foreground)]">Sucursal</span>
          <span className="text-xs font-semibold truncate max-w-[140px]">
            {emp.sucursal?.nombre_sucursal ?? '—'}
          </span>
        </div>
        {emp.es_vendedor && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-muted-foreground)]">Comisión</span>
            <span className="text-xs font-semibold text-amber-600">
              {emp.comision_pct ? `${emp.comision_pct}%` : '—'}
            </span>
          </div>
        )}
        {emp.es_vendedor && emp.codigo_vendedor && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-muted-foreground)]">Código</span>
            <span className="text-xs font-mono bg-[var(--color-beige)] px-2 py-0.5 rounded-md">
              {emp.codigo_vendedor}
            </span>
          </div>
        )}
        {emp.fecha_ingreso && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-muted-foreground)]">Ingreso</span>
            <span className="text-xs font-semibold">
              {format(new Date(emp.fecha_ingreso), "d MMM yyyy", { locale: es })}
            </span>
          </div>
        )}
      </div>

      {/* Acciones */}
      {canEdit && (
        <div className="pt-3 border-t border-[var(--color-border)] flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs rounded-lg gap-1.5"
            onClick={onEdit}
          >
            <Pencil className="w-3 h-3" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 h-8 text-xs rounded-lg gap-1.5 ${
              emp.activo
                ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
            }`}
            onClick={onToggle}
          >
            {emp.activo ? (
              <><UserX className="w-3 h-3" /> Desactivar</>
            ) : (
              <><UserCheck className="w-3 h-3" /> Activar</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}