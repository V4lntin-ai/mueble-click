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
import { CREATE_PRODUCTO, UPDATE_PRODUCTO } from '@/graphql/productos';
import { GET_MIS_MUEBLERIAS } from '@/graphql/mueblerias';

interface MuebleriaOption {
  id_muebleria: number;
  nombre_negocio: string;
}

interface ProductoData {
  id_producto: number;
  sku?: string;
  nombre: string;
  descripcion?: string;
  categoria?: string;
  tipo_producto?: string;
  precio_venta: number | string;
  peso_kg?: number;
  imagen_url?: string;
  muebleria?: { id_muebleria: number };
}

const CATEGORIAS = ['Sala', 'Recámara', 'Comedor', 'Oficina', 'Exterior', 'Baño', 'Infantil', 'Otro'];
const TIPOS = [
  { value: 'producto_final',  label: 'Producto final' },
  { value: 'ensamblado',      label: 'Ensamblado' },
  { value: 'materia_prima',   label: 'Materia prima' },
];

const schema = z.object({
  nombre:       z.string().min(1, 'Requerido').max(150),
  sku:          z.string().optional(),
  descripcion:  z.string().optional(),
  categoria:    z.string().optional(),
  tipo_producto: z.string().optional(),
  precio_venta: z.coerce.number().min(0.01, 'Debe ser mayor a 0'),
  peso_kg:      z.coerce.number().optional(),
  imagen_url:   z.string().optional(),
  id_muebleria: z.coerce.number().min(1, 'Selecciona una mueblería'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  producto?: ProductoData;
}

export function ProductoFormDialog({ open, onClose, onSuccess, producto }: Props) {
  const isEdit = !!producto;

  const { data: muebleriaData } = useQuery(GET_MIS_MUEBLERIAS);
  const mueblerias = useMemo(() => muebleriaData?.misMueblerias ?? [], [muebleriaData?.misMueblerias]);

  const {
    register, handleSubmit, reset, setValue, control,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const categoriaVal = useWatch({ control, name: 'categoria' });
  const tipoVal      = useWatch({ control, name: 'tipo_producto' });
  const muebleriaVal = useWatch({ control, name: 'id_muebleria' });

  useEffect(() => {
    if (producto) {
      reset({
        nombre:        producto.nombre ?? '',
        sku:           producto.sku ?? '',
        descripcion:   producto.descripcion ?? '',
        categoria:     producto.categoria ?? '',
        tipo_producto: producto.tipo_producto ?? '',
        precio_venta:  Number(producto.precio_venta) || 0,
        peso_kg:       producto.peso_kg ? Number(producto.peso_kg) : undefined,
        imagen_url:    producto.imagen_url ?? '',
        id_muebleria:  producto.muebleria?.id_muebleria ?? 0,
      });
    } else {
      reset({
        nombre: '', sku: '', descripcion: '', categoria: '',
        tipo_producto: 'producto_final', precio_venta: 0,
        id_muebleria: mueblerias[0]?.id_muebleria ?? 0,
      });
    }
  }, [producto, mueblerias, reset]);

  const [createProducto, { loading: creating }] = useMutation(CREATE_PRODUCTO, {
    onCompleted: () => { toast.success('Producto creado'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error al crear producto', { description: e.message }),
  });

  const [updateProducto, { loading: updating }] = useMutation(UPDATE_PRODUCTO, {
    onCompleted: () => { toast.success('Producto actualizado'); onSuccess(); onClose(); },
    onError: (e) => toast.error('Error al actualizar', { description: e.message }),
  });

  const loading = creating || updating;

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateProducto({ variables: { input: { id_producto: producto.id_producto, ...data } } });
    } else {
      createProducto({ variables: { input: data } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar producto' : 'Nuevo producto'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Modifica los datos del producto.' : 'Completa la información del nuevo producto.'}
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
                <SelectValue placeholder="Selecciona una mueblería" />
              </SelectTrigger>
              <SelectContent>
                {mueblerias.map((m: MuebleriaOption) => (
                  <SelectItem key={m.id_muebleria} value={m.id_muebleria.toString()}>
                    {m.nombre_negocio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.id_muebleria && <p className="text-xs text-red-500">{errors.id_muebleria.message}</p>}
          </div>

          {/* Nombre + SKU */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label>Nombre <span className="text-red-500">*</span></Label>
              <Input placeholder="Silla Roble Clásica" {...register('nombre')} />
              {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>SKU</Label>
              <Input placeholder="SIL-001" {...register('sku')} />
            </div>
          </div>

          {/* Categoría + Tipo */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select value={categoriaVal} onValueChange={(v) => setValue('categoria', v)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select value={tipoVal} onValueChange={(v) => setValue('tipo_producto', v)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Precio + Peso */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Precio de venta (MXN) <span className="text-red-500">*</span></Label>
              <Input type="number" step="0.01" placeholder="0.00" {...register('precio_venta')} />
              {errors.precio_venta && <p className="text-xs text-red-500">{errors.precio_venta.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Peso (kg)</Label>
              <Input type="number" step="0.01" placeholder="0.00" {...register('peso_kg')} />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0"
              placeholder="Descripción del producto..."
              {...register('descripcion')}
            />
          </div>

          {/* Imagen URL */}
          <div className="space-y-1.5">
            <Label>URL de imagen</Label>
            <Input placeholder="https://..." {...register('imagen_url')} />
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
              {isEdit ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}