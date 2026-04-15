import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  MapPin, Plus, Search, Pencil,
  Phone, Clock, AlertCircle,
  ToggleLeft, ToggleRight, Store,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SucursalFormDialog } from './SucursalFormDialog';
import {
  GET_SUCURSALES,
  TOGGLE_ACTIVO_SUCURSAL,
} from '@/graphql/sucursales';

export default function SucursalesPage() {
  const { isPropietario, isAdmin } = useAuth();
  const [search, setSearch]         = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected]     = useState<any>(null);

  const { data, loading, error, refetch } = useQuery(GET_SUCURSALES);
  const sucursales = data?.sucursales ?? [];

  const [toggleActivo] = useMutation(TOGGLE_ACTIVO_SUCURSAL, {
    onCompleted: (d) => {
      toast.success(d.toggleActivoSucursal.activo ? 'Sucursal activada' : 'Sucursal desactivada');
      refetch();
    },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const filtered = useMemo(() => {
    if (!search) return sucursales;
    return sucursales.filter((s: any) =>
      s.nombre_sucursal.toLowerCase().includes(search.toLowerCase()) ||
      s.muebleria?.nombre_negocio.toLowerCase().includes(search.toLowerCase()),
    );
  }, [sucursales, search]);

  const handleEdit = (s: any) => { setSelected(s); setDialogOpen(true); };
  const handleNew  = () => { setSelected(null); setDialogOpen(true); };

  if (error) return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );

  return (
    <div>
      <PageHeader
        title="Sucursales"
        subtitle="Puntos de venta y bodegas de tus mueblerías"
        action={
          isPropietario && (
            <Button
              onClick={handleNew}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva sucursal
            </Button>
          )
        }
      />

      {/* Búsqueda */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
        <Input
          placeholder="Buscar sucursal o mueblería..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}>
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-base font-semibold mb-1">Sin sucursales</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {search ? 'No coincide con la búsqueda.' : 'Agrega tu primera sucursal.'}
          </p>
          {isPropietario && !search && (
            <Button onClick={handleNew} className="mt-4 bg-[var(--color-primary)] text-white rounded-xl gap-2">
              <Plus className="w-4 h-4" /> Nueva sucursal
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s: any) => (
            <SucursalCard
              key={s.id_sucursal}
              sucursal={s}
              canEdit={isPropietario || isAdmin}
              onEdit={() => handleEdit(s)}
              onToggle={() => toggleActivo({ variables: { id_sucursal: s.id_sucursal } })}
            />
          ))}
        </div>
      )}

      <SucursalFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => refetch()}
        sucursal={selected}
      />
    </div>
  );
}

function SucursalCard({
  sucursal: s,
  canEdit,
  onEdit,
  onToggle,
}: {
  sucursal: any;
  canEdit: boolean;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const horario = s.horario
    ? typeof s.horario === 'string'
      ? (() => { try { return JSON.parse(s.horario); } catch { return null; } })()
      : s.horario
    : null;

  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        s.activo ? 'border-[var(--color-border)]' : 'border-dashed border-gray-200 opacity-70'
      }`}
      style={{ boxShadow: s.activo ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' : 'none' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: s.activo
                ? 'linear-gradient(135deg, #2D6A4F, #1B4332)'
                : 'linear-gradient(135deg, #9CA3AF, #6B7280)',
              boxShadow: s.activo ? '0 4px 12px rgba(27,67,50,0.25)' : 'none',
            }}
          >
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">{s.nombre_sucursal}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Store className="w-3 h-3 text-[var(--color-muted-foreground)]" />
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {s.muebleria?.nombre_negocio}
              </p>
            </div>
          </div>
        </div>
        <Badge className={`text-xs border-0 shrink-0 ${s.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
          {s.activo ? 'Activa' : 'Inactiva'}
        </Badge>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {s.calle_numero && (
          <div className="flex items-start gap-2 text-xs text-[var(--color-muted-foreground)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{s.calle_numero}</span>
          </div>
        )}
        {s.municipio && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <MapPin className="w-3.5 h-3.5 shrink-0 opacity-0" />
            <span>{s.municipio.nombre}, {s.municipio.estado?.nombre}</span>
          </div>
        )}
        {s.telefono && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{s.telefono}</span>
          </div>
        )}
        {horario && (
          <div className="flex items-start gap-2 text-xs text-[var(--color-muted-foreground)]">
            <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              {Object.entries(horario).map(([key, val]) => (
                <span key={key}>
                  <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {val as string}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[var(--color-border)]">
        <p className="text-[11px] text-[var(--color-muted-foreground)] mb-3">
          Creada el {format(new Date(s.creado_en), "d 'de' MMMM, yyyy", { locale: es })}
        </p>
        {canEdit && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs rounded-lg gap-1.5" onClick={onEdit}>
              <Pencil className="w-3 h-3" /> Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 h-8 text-xs rounded-lg gap-1.5 ${
                s.activo
                  ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
              }`}
              onClick={onToggle}
            >
              {s.activo
                ? <><ToggleLeft className="w-3 h-3" /> Desactivar</>
                : <><ToggleRight className="w-3 h-3" /> Activar</>
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}