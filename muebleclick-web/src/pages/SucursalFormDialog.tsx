import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { CREATE_SUCURSAL, UPDATE_SUCURSAL } from '@/graphql/sucursales';
import { GET_MIS_MUEBLERIAS } from '@/graphql/mueblerias';

const schema = z.object({
  nombre_sucursal: z.string().min(1, 'Requerido').max(150),
  id_muebleria:    z.coerce.number().min(1, 'Selecciona una mueblería'),
  calle_numero:    z.string().optional(),
  telefono:        z.string().optional(),
  horario:         z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sucursal?: any;
}

export function SucursalFormDialog({ open, onClose, onSuccess, sucursal }: Props) {
  const isEdit = !!sucursal;

  const { data: muebleriaData } = useQuery(GET_MIS_MUEBLERIAS);
  const mueblerias = muebleriaData?.misMueblerias ?? [];

  const {
    register, handleSubmit, reset, setValue, watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const muebleriaVal = watch('id_muebleria');

  useEffect(() => {
    if (sucursal) {
      reset({
        nombre_sucursal: sucursal.nombre_sucursal ?? '',
        id_muebleria:    sucursal.muebleria?.id_muebleria ?? 0,
        calle_numero:    sucursal.calle_numero ?? '',
        telefono:        sucursal.telefono ?? '',
        horario:         sucursal.horario
          ? typeof sucursal.horario === 'string'
            ? sucursal.horario
            : JSON.stringify(sucursal.horario)
          : '',
      });
    } else {
      reset({
        nombre_sucursal: '',
        id_muebleria: mueblerias[0]?.id_muebleria ?? 0,
        calle_numero: '',
        telefono: '',
        horario: '',
      });
    }
  }, [sucursal, mueblerias, reset]);

  const [createSucursal, { loading: creating }] = useMutation(CREATE_SUCURSAL, {
    onCompleted: () => { toast.success('Sucursal creada'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error al crear', { description: e.message }),
  });

  const [updateSucursal, { loading: updating }] = useMutation(UPDATE_SUCURSAL, {
    onCompleted: () => { toast.success('Sucursal actualizada'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error al actualizar', { description: e.message }),
  });

  const loading = creating || updating;

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateSucursal({
        variables: { input: { id_sucursal: sucursal.id_sucursal, ...data } },
      });
    } else {
      createSucursal({ variables: { input: data } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar sucursal' : 'Nueva sucursal'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos de la sucursal.' : 'Registra una nueva sucursal.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Mueblería */}
          <div className="space-y-1.5">
            <Label>Mueblería <span className="text-red-500">*</span></Label>
            <Select
              value={muebleriaVal?.toString()}
              onValueChange={(v) => setValue('id_muebleria', Number(v))}
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Selecciona mueblería" />
              </SelectTrigger>
              <SelectContent>
                {mueblerias.map((m: any) => (
                  <SelectItem key={m.id_muebleria} value={m.id_muebleria.toString()}>
                    {m.nombre_negocio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_muebleria && <p className="text-xs text-red-500">{errors.id_muebleria.message}</p>}
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <Label>Nombre de la sucursal <span className="text-red-500">*</span></Label>
            <Input placeholder="Sucursal Centro" {...register('nombre_sucursal')} />
            {errors.nombre_sucursal && <p className="text-xs text-red-500">{errors.nombre_sucursal.message}</p>}
          </div>

          {/* Dirección + Teléfono */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Dirección</Label>
              <Input placeholder="Av. Principal 100" {...register('calle_numero')} />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <Input placeholder="5551234567" {...register('telefono')} />
            </div>
          </div>

          {/* Horario */}
          <div className="space-y-1.5">
            <Label>Horario <span className="text-xs text-[var(--color-muted-foreground)]">(JSON)</span></Label>
            <Input
              placeholder='{"lunes_viernes":"9:00-18:00","sabado":"9:00-14:00"}'
              {...register('horario')}
            />
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Formato JSON: {`{"lunes_viernes": "9:00-18:00"}`}
            </p>
          </div>

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
              {isEdit ? 'Guardar cambios' : 'Crear sucursal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}