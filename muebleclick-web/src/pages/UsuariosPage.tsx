import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  Users, Search, AlertCircle,
  Shield, UserX, UserCheck, Mail,
  Calendar, Store, ShoppingBag,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { GET_USUARIOS, DEACTIVATE_USUARIO } from '@/graphql/usuarios';

const rolConfig: Record<string, { cls: string; icon: string }> = {
  Admin:       { cls: 'bg-purple-50 text-purple-700', icon: '⚙️' },
  Propietario: { cls: 'bg-amber-50 text-amber-700',   icon: '🏪' },
  Empleado:    { cls: 'bg-blue-50 text-blue-700',     icon: '👤' },
  Cliente:     { cls: 'bg-emerald-50 text-emerald-700', icon: '🛒' },
};

const avatarColors = [
  'linear-gradient(135deg, #2D6A4F, #1B4332)',
  'linear-gradient(135deg, #7C3AED, #5B21B6)',
  'linear-gradient(135deg, #A0522D, #6B4226)',
  'linear-gradient(135deg, #2563EB, #1D4ED8)',
  'linear-gradient(135deg, #EA580C, #C2410C)',
];

function getColor(id: number) { return avatarColors[id % avatarColors.length]; }
function iniciales(n: string) { return n?.split(' ').slice(0, 2).map((x) => x[0]).join('').toUpperCase() ?? '?'; }

export default function UsuariosPage() {
  const [search, setSearch] = useState('');
  const [tab, setTab]       = useState('todos');

  const { data, loading, error, refetch } = useQuery(GET_USUARIOS);
  const usuarios = data?.usuarios ?? [];

  const [deactivate] = useMutation(DEACTIVATE_USUARIO, {
    onCompleted: () => { toast.success('Usuario desactivado'); refetch(); },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const filtered = useMemo(() => {
    return usuarios.filter((u: any) => {
      const matchSearch =
        !search ||
        u.nombre.toLowerCase().includes(search.toLowerCase()) ||
        u.correo.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        tab === 'todos' ||
        (tab === 'activos'    && u.activo) ||
        (tab === 'inactivos'  && !u.activo) ||
        u.rol?.nombre?.toLowerCase() === tab;
      return matchSearch && matchTab;
    });
  }, [usuarios, search, tab]);

  const counts = useMemo(() => ({
    total:       usuarios.length,
    activos:     usuarios.filter((u: any) => u.activo).length,
    propietario: usuarios.filter((u: any) => u.rol?.nombre === 'Propietario').length,
    empleado:    usuarios.filter((u: any) => u.rol?.nombre === 'Empleado').length,
    cliente:     usuarios.filter((u: any) => u.rol?.nombre === 'Cliente').length,
  }), [usuarios]);

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión global de usuarios del sistema"
      />

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
            title="Total usuarios"
            value={counts.total}
            subtitle="Registrados en el sistema"
            icon={Users}
            color="green"
            loading={loading}
        />
        <StatCard
            title="Propietarios"
            value={counts.propietario}
            subtitle="Con mueblerías activas"
            icon={Store}
            color="brown"
            loading={loading}
        />
        <StatCard
            title="Empleados"
            value={counts.empleado}
            subtitle="Personal de sucursales"
            icon={UserCheck}
            color="blue"
            loading={loading}
        />
        <StatCard
            title="Clientes"
            value={counts.cliente}
            subtitle="Compradores registrados"
            icon={ShoppingBag}
            color="orange"
            loading={loading}
        />
        </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <Tabs value={tab} onValueChange={setTab} className="flex-1">
          <TabsList className="bg-white border border-[var(--color-border)] rounded-xl h-10">
            <TabsTrigger value="todos"       className="rounded-lg text-xs">Todos</TabsTrigger>
            <TabsTrigger value="activos"     className="rounded-lg text-xs">Activos ({counts.activos})</TabsTrigger>
            <TabsTrigger value="propietario" className="rounded-lg text-xs">Propietarios</TabsTrigger>
            <TabsTrigger value="empleado"    className="rounded-lg text-xs">Empleados</TabsTrigger>
            <TabsTrigger value="cliente"     className="rounded-lg text-xs">Clientes</TabsTrigger>
            <TabsTrigger value="inactivos"   className="rounded-lg text-xs">Inactivos</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
          <Input
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Tabla */}
      <div
        className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}
      >
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-12 h-12 text-[var(--color-muted)] mb-3" />
            <p className="text-sm text-[var(--color-muted-foreground)]">Sin usuarios que coincidan.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[var(--color-beige)] hover:bg-[var(--color-beige)]">
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Usuario</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Correo</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Rol</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Estado</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide">Registro</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u: any) => {
                const rol = rolConfig[u.rol?.nombre] ?? { cls: 'bg-gray-100 text-gray-600', icon: '👤' };
                return (
                  <TableRow key={u.id_usuario} className="hover:bg-[var(--color-beige)] transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback
                            className="text-white text-xs font-bold"
                            style={{ background: getColor(u.id_usuario) }}
                          >
                            {iniciales(u.nombre)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">{u.nombre}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                        <Mail className="w-3 h-3" />
                        {u.correo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 gap-1 ${rol.cls}`}>
                        <span>{rol.icon}</span>
                        {u.rol?.nombre}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border-0 ${u.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(u.fecha_registro), "d MMM yyyy", { locale: es })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {u.activo ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs rounded-lg hover:bg-red-50 hover:text-red-600 gap-1"
                            onClick={() => {
                              if (window.confirm(`¿Desactivar a ${u.nombre}?`)) {
                                deactivate({ variables: { id_usuario: u.id_usuario } });
                              }
                            }}
                          >
                            <UserX className="w-3 h-3" />
                            Desactivar
                          </Button>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}