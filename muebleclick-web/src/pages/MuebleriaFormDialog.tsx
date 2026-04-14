import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CREATE_MUEBLERIA, UPDATE_MUEBLERIA } from '@/graphql/mueblerias';
import { useAuth } from '@/context/AuthContext';

const schema = z.object({
  nombre_negocio:    z.string().min(1, 'Requerido').max(150),
  razon_social:      z.string().optional(),
  rfc:               z.string().optional(),
  direccion_principal: z.string().optional(),
  telefono:          z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  muebleria?: any;
}

export function MuebleriaFormDialog({ open, onClose, onSuccess, muebleria }: Props) {
  const { usuario } = useAuth();
  const isEdit = !!muebleria;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (muebleria) {
      reset({
        nombre_negocio:     muebleria.nombre_negocio ?? '',
        razon_social:       muebleria.razon_social ?? '',
        rfc:                muebleria.rfc ?? '',
        direccion_principal: muebleria.direccion_principal ?? '',
        telefono:           muebleria.telefono ?? '',
      });
    } else {
      reset({ nombre_negocio: '', razon_social: '', rfc: '', direccion_principal: '', telefono: '' });
    }
  }, [muebleria, reset]);

  const [createMuebleria, { loading: creating }] = useMutation(CREATE_MUEBLERIA, {
    onCompleted: () => {
      toast.success('Mueblería creada correctamente');
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error('Error al crear mueblería', { description: e.message }),
  });

  const [updateMuebleria, { loading: updating }] = useMutation(UPDATE_MUEBLERIA, {
    onCompleted: () => {
      toast.success('Mueblería actualizada correctamente');
      onSuccess();
      onClose();
    },
    onError: (e) => toast.error('Error al actualizar mueblería', { description: e.message }),
  });

  const loading = creating || updating;

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateMuebleria({
        variables: { input: { id_muebleria: muebleria.id_muebleria, ...data } },
      });
    } else {
      createMuebleria({
        variables: {
          input: { ...data, id_propietario: usuario?.id_usuario },
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar mueblería' : 'Nueva mueblería'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos de tu mueblería.' : 'Completa los datos para registrar tu mueblería.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 gap-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label htmlFor="nombre_negocio">Nombre del negocio <span className="text-red-500">*</span></Label>
              <Input id="nombre_negocio" placeholder="Muebles El Roble" {...register('nombre_negocio')} />
              {errors.nombre_negocio && <p className="text-xs text-red-500">{errors.nombre_negocio.message}</p>}
            </div>

            {/* Razón social + RFC */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="razon_social">Razón social</Label>
                <Input id="razon_social" placeholder="SA de CV" {...register('razon_social')} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rfc">RFC</Label>
                <Input id="rfc" placeholder="ERS900101ABC" {...register('rfc')} />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-1.5">
              <Label htmlFor="direccion_principal">Dirección principal</Label>
              <Input id="direccion_principal" placeholder="Av. Principal 100, Ciudad" {...register('direccion_principal')} />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" placeholder="5551234567" {...register('telefono')} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-(--color-primary) hover:bg-primary-dark text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? 'Guardar cambios' : 'Crear mueblería'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}