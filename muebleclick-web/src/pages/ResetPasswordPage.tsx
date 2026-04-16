import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Leaf, ArrowLeft, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from '@/components/ui/card';
import { RESET_PASSWORD_MUTATION } from '@/graphql/auth';

const schema = z
  .object({
    nueva_password: z.string().min(6, 'Mínimo 6 caracteres'),
    confirmar:      z.string().min(6, 'Mínimo 6 caracteres'),
  })
  .refine((d) => d.nueva_password === d.confirmar, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmar'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [exito, setExito] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register, handleSubmit, formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_MUTATION, {
    onCompleted: () => {
      setExito(true);
      setTimeout(() => navigate('/login'), 3000);
    },
    onError: (e) => {
      toast.error('Error al restablecer', { description: e.message });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!token) return;
    resetPassword({
      variables: {
        input: { token, nueva_password: data.nueva_password },
      },
    });
  };

  // Token inválido o ausente
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)] px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <CardTitle>Enlace inválido</CardTitle>
            <CardDescription>
              Este enlace de recuperación no es válido o ha expirado.
              Solicita uno nuevo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/forgot-password">
              <Button className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white">
                Solicitar nuevo enlace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-primary)] opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--color-brown)] opacity-5" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            MuebleClick
          </h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            Panel de administración
          </p>
        </div>

        <Card className="shadow-xl border-[var(--color-border)]">
          {!exito ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">
                  Nueva contraseña
                </CardTitle>
                <CardDescription className="text-center">
                  Ingresa y confirma tu nueva contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Nueva contraseña */}
                  <div className="space-y-2">
                    <Label>Nueva contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pr-10 ${errors.nueva_password ? 'border-red-500' : ''}`}
                        {...register('nueva_password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      >
                        {showPass
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                    {errors.nueva_password && (
                      <p className="text-xs text-red-500">{errors.nueva_password.message}</p>
                    )}
                  </div>

                  {/* Confirmar */}
                  <div className="space-y-2">
                    <Label>Confirmar contraseña</Label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`pr-10 ${errors.confirmar ? 'border-red-500' : ''}`}
                        {...register('confirmar')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                      >
                        {showConfirm
                          ? <EyeOff className="w-4 h-4" />
                          : <Eye className="w-4 h-4" />
                        }
                      </button>
                    </div>
                    {errors.confirmar && (
                      <p className="text-xs text-red-500">{errors.confirmar.message}</p>
                    )}
                  </div>

                  {/* Requisitos */}
                  <div className="p-3 rounded-xl bg-[var(--color-beige)] text-xs text-[var(--color-muted-foreground)] space-y-1">
                    <p className="font-semibold text-[var(--color-foreground)]">Requisitos:</p>
                    <p>• Mínimo 6 caracteres</p>
                    <p>• Ambas contraseñas deben coincidir</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 text-white font-medium"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Restablecer contraseña'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardHeader className="space-y-1 pb-6 pt-8">
              <div className="flex justify-center mb-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <CardTitle className="text-xl text-center">
                ¡Contraseña actualizada!
              </CardTitle>
              <CardDescription className="text-center">
                Tu contraseña fue restablecida correctamente.
                Serás redirigido al login en unos segundos...
              </CardDescription>
            </CardHeader>
          )}
        </Card>

        {!exito && (
          <div className="flex justify-center mt-6">
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}