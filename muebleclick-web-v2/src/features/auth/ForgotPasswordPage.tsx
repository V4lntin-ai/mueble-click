import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { Package, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FORGOT_PASSWORD_MUTATION } from '@/graphql/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({ correo: z.string().email('Email inválido') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await forgotPassword({ variables: { input: { correo: data.correo } } });
      setSent(true);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error al enviar');
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
          <div>
            <p className="font-bold text-[#1A3A2A] text-lg leading-none">MuebleClick</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">Recuperar acceso</p>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Correo enviado</h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Link to="/login">
              <Button variant="outline" className="rounded-xl gap-2">
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold">¿Olvidaste tu contraseña?</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1.5">
                Ingresa tu correo y te enviaremos las instrucciones.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                  <Input type="email" {...register('correo')}
                    placeholder="tu@correo.mx"
                    className="h-11 rounded-xl pl-9" />
                </div>
                {errors.correo && <p className="text-xs text-red-500">{errors.correo.message}</p>}
              </div>
              <Button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-semibold bg-gradient-primary text-white">
                {loading ? 'Enviando...' : 'Enviar instrucciones'}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
