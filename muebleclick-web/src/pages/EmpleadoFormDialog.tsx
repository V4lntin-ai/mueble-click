import { useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { CREATE_EMPLEADO, UPDATE_EMPLEADO } from '@/graphql/empleados';
import { GET_SUCURSALES } from '@/graphql/sucursales';

interface SucursalOption {
  id_sucursal: number;
  nombre_sucursal: string;
  muebleria?: { nombre_negocio: string };
}

interface EmpleadoData {
  id_usuario: number;
  puesto: string;
  fecha_ingreso?: string;
  activo: boolean;
  es_vendedor: boolean;
  codigo_vendedor?: string;
  comision_pct?: number | string;
  sucursal?: { id_sucursal: number };
}

const PUESTOS = ['Vendedor', 'Cajero', 'Almacenista', 'Gerente', 'Administrativo', 'Otro'];

const schema = z.object({
  id_sucursal:      z.coerce.number().min(1, 'Selecciona una sucursal'),
  puesto:           z.string().min(1, 'Requerido'),
  fecha_ingreso:    z.string().optional(),
  es_vendedor:      z.boolean().optional(),
  codigo_vendedor:  z.string().optional(),
  comision_pct:     z.coerce.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  empleado?: EmpleadoData;
  id_usuario_nuevo?: number;
}

export function EmpleadoFormDialog({ open, onClose, onSuccess, empleado, id_usuario_nuevo }: Props) {
  const isEdit = !!empleado;

  const { data: sucursalData } = useQuery(GET_SUCURSALES);
  const sucursales = useMemo(() => sucursalData?.sucursales ?? [], [sucursalData?.sucursales]);

  const {
    register, handleSubmit, reset, setValue, control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const sucursalVal  = useWatch({ control, name: 'id_sucursal' });
  const esVendedor   = useWatch({ control, name: 'es_vendedor' });
  const puestoVal    = useWatch({ control, name: 'puesto' });

  useEffect(() => {
    if (empleado) {
      reset({
        id_sucursal:     empleado.sucursal?.id_sucursal ?? 0,
        puesto:          empleado.puesto ?? '',
        fecha_ingreso:   empleado.fecha_ingreso ?? '',
        es_vendedor:     empleado.es_vendedor ?? false,
        codigo_vendedor: empleado.codigo_vendedor ?? '',
        comision_pct:    empleado.comision_pct ? Number(empleado.comision_pct) : 0,
      });
    } else {
      reset({
        id_sucursal: sucursales[0]?.id_sucursal ?? 0,
        puesto: '',
        es_vendedor: false,
        comision_pct: 0,
      });
    }
  }, [empleado, sucursales, reset]);

  const [createEmpleado, { loading: creating }] = useMutation(CREATE_EMPLEADO, {
    onCompleted: () => { toast.success('Empleado registrado'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const [updateEmpleado, { loading: updating }] = useMutation(UPDATE_EMPLEADO, {
    onCompleted: () => { toast.success('Empleado actualizado'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error', { description: e.message }),
  });

  const loading = creating || updating;

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateEmpleado({
        variables: { input: { id_usuario: empleado.id_usuario, ...data } },
      });
    } else if (id_usuario_nuevo) {
      createEmpleado({
        variables: { input: { id_usuario: id_usuario_nuevo, ...data } },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar empleado' : 'Asignar a sucursal'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del empleado.' : 'Asigna el empleado a una sucursal y configura su rol.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Sucursal */}
          <div className="space-y-1.5">
            <Label>Sucursal <span className="text-red-500">*</span></Label>
            <Select
              value={sucursalVal?.toString()}
              onValueChange={(v) => setValue('id_sucursal', Number(v))}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecciona sucursal" />
              </SelectTrigger>
              <SelectContent>
                {sucursales.map((s: SucursalOption) => (
                  <SelectItem key={s.id_sucursal} value={s.id_sucursal.toString()}>
                    {s.nombre_sucursal}
                    {s.muebleria && (
                      <span className="text-[var(--color-muted-foreground)] ml-1">
                        — {s.muebleria.nombre_negocio}
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_sucursal && <p className="text-xs text-red-500">{errors.id_sucursal.message}</p>}
          </div>

          {/* Puesto */}
          <div className="space-y-1.5">
            <Label>Puesto <span className="text-red-500">*</span></Label>
            <Select
              value={puestoVal}
              onValueChange={(v) => setValue('puesto', v)}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecciona puesto" />
              </SelectTrigger>
              <SelectContent>
                {PUESTOS.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.puesto && <p className="text-xs text-red-500">{errors.puesto.message}</p>}
          </div>

          {/* Fecha ingreso */}
          <div className="space-y-1.5">
            <Label>Fecha de ingreso</Label>
            <Input type="date" {...register('fecha_ingreso')} />
          </div>

          {/* Es vendedor */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-beige)] border border-[var(--color-border)]">
            <input
              type="checkbox"
              id="es_vendedor"
              className="w-4 h-4 rounded accent-[var(--color-primary)]"
              {...register('es_vendedor')}
            />
            <div>
              <Label htmlFor="es_vendedor" className="cursor-pointer font-semibold">
                Es vendedor
              </Label>
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Activa el seguimiento de comisiones
              </p>
            </div>
          </div>

          {/* Código vendedor + Comisión — solo si es vendedor */}
          {esVendedor && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Código vendedor</Label>
                <Input placeholder="VND-001" {...register('codigo_vendedor')} />
              </div>
              <div className="space-y-1.5">
                <Label>Comisión (%)</Label>
                <Input type="number" step="0.1" min="0" max="100" placeholder="5.5" {...register('comision_pct')} />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Asignar empleado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}