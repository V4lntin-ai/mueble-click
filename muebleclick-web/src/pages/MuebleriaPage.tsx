import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Plus, Store, MapPin, Phone, Building2, Pencil, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MuebleriaFormDialog } from './MuebleriaFormDialog';
import { GET_MIS_MUEBLERIAS, GET_ALL_MUEBLERIAS } from '@/graphql/mueblerias';

interface MuebleriaQueryData {
  misMueblerias?: any[];
  mueblerias?: any[];
}

export default function MuebleriaPage() {
  const { isPropietario, isAdmin } = useAuth();
  const [dialogOpen, setDialogOpen]   = useState(false);
  const [selected, setSelected]       = useState<any>(null);

  const query  = isPropietario ? GET_MIS_MUEBLERIAS : GET_ALL_MUEBLERIAS;
  const field = (isPropietario ? 'misMueblerias' : 'mueblerias') as keyof MuebleriaQueryData;

  const { data, loading, error, refetch } = useQuery<MuebleriaQueryData>(query);
  const mueblerias = data?.[field] ?? [];

  const handleEdit = (m: any) => { setSelected(m); setDialogOpen(true); };
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
        title="Mueblerías"
        subtitle={isPropietario ? 'Gestiona tus negocios registrados' : 'Todas las mueblerías del sistema'}
        action={
          isPropietario && (
            <Button
              onClick={handleNew}
              className="bg-(--color-primary) hover:bg-primary-dark text-white rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva mueblería
            </Button>
          )
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : mueblerias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
          >
            <Store className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Sin mueblerías registradas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Crea tu primera mueblería para empezar a gestionar tu negocio.
          </p>
          {isPropietario && (
            <Button
              onClick={handleNew}
              className="bg-(--color-primary) hover:bg-primary-dark text-white rounded-xl gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear mueblería
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mueblerias.map((m: any) => (
            <MuebleriaCard
              key={m.id_muebleria}
              muebleria={m}
              canEdit={isPropietario || isAdmin}
              onEdit={() => handleEdit(m)}
            />
          ))}
        </div>
      )}

      <MuebleriaFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => refetch()}
        muebleria={selected}
      />
    </div>
  );
}

function MuebleriaCard({
  muebleria: m,
  canEdit,
  onEdit,
}: {
  muebleria: any;
  canEdit: boolean;
  onEdit: () => void;
}) {
  const sucursalesActivas = (m.sucursales ?? []).filter((s: any) => s.activo).length;

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-(--color-border) transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)', boxShadow: '0 4px 12px rgba(27,67,50,0.25)' }}
          >
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base text-(--color-foreground) leading-tight">
              {m.nombre_negocio}
            </h3>
            {m.razon_social && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.razon_social}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {m.propietario?.verificado && (
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs">
              ✓ Verificado
            </Badge>
          )}
          {canEdit && (
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-(--color-border)"
              onClick={onEdit}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        {m.rfc && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>RFC: {m.rfc}</span>
          </div>
        )}
        {m.telefono && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{m.telefono}</span>
          </div>
        )}
        {m.direccion_principal && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{m.direccion_principal}</span>
          </div>
        )}
      </div>

      {/* Sucursales */}
      <div className="pt-3 border-t border-(--color-border)">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Sucursales
          </p>
          <span className="text-xs text-muted-foreground">
            {sucursalesActivas} activa(s) de {m.sucursales?.length ?? 0}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(m.sucursales ?? []).length === 0 ? (
            <span className="text-xs text-muted-foreground italic">
              Sin sucursales
            </span>
          ) : (
            (m.sucursales ?? []).map((s: any) => (
              <Badge
                key={s.id_sucursal}
                className={`text-xs px-2 py-0.5 border-0 rounded-lg ${
                  s.activo
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {s.nombre_sucursal}
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-(--color-border)">
        <p className="text-[11px] text-muted-foreground">
          Registrada el{' '}
          {format(new Date(m.creado_en), "d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </div>
    </div>
  );
}