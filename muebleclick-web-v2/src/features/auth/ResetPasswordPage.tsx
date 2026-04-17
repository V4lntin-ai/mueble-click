import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { Package, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RESET_PASSWORD_MUTATION } from '@/graphql/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Las contraseñas no coinciden', path: ['confirm'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await resetPassword({ variables: { input: { token, new_password: data.password } } });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al restablecer');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0E2418 0%, #1A3A2A 50%, #2D5A3D 100%)' }}>
      <div className="w-full max-w-sm rounded-3xl p-8"
        style={{ background: 'rgba(255,255,255,0.97)', boxShadow: '0 32px 64px rgba(0,0,0,0.35)' }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #B8860B)' }}>
            <Package className="w-5 h-5 text-[#0E2418]" />
          </div>
          <p className="font-bold text-[#1A3A2A] text-lg">MuebleClick</p>
        </div>

        {done ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">¡Contraseña actualizada!</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">Redirigiendo al inicio de sesión...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold">Nueva contraseña</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1.5">Elige una contraseña segura</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nueva contraseña</Label>
                <div className="relative">
                  <Input type={showPass ? 'text' : 'password'} {...register('password')}
                    placeholder="Mínimo 8 caracteres" className="h-11 rounded-xl pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Confirmar contraseña</Label>
                <Input type={showPass ? 'text' : 'password'} {...register('confirm')}
                  placeholder="Repite la contraseña" className="h-11 rounded-xl" />
                {errors.confirm && <p className="text-xs text-red-500">{errors.confirm.message}</p>}
              </div>
              <Button type="submit" disabled={loading || !token}
                className="w-full h-11 rounded-xl font-semibold bg-gradient-primary text-white">
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]">
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
