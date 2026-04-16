import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Leaf, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from '@/components/ui/card';
import { FORGOT_PASSWORD_MUTATION } from '@/graphql/auth';

const schema = z.object({
  correo: z.string().email('Correo inválido'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [enviado, setEnviado] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION, {
    onCompleted: () => setEnviado(true),
    onError: () => setEnviado(true), // Por seguridad siempre mostramos éxito
  });

  const onSubmit = (data: FormData) => {
    setCorreoEnviado(data.correo);
    forgotPassword({ variables: { input: { correo: data.correo } } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)] px-4">
      {/* Fondo decorativo */}
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
          {!enviado ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-xl text-center">
                  Recuperar contraseña
                </CardTitle>
                <CardDescription className="text-center">
                  Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="correo">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                      <Input
                        id="correo"
                        type="email"
                        placeholder="tu@correo.com"
                        className={`pl-9 ${errors.correo ? 'border-red-500' : ''}`}
                        {...register('correo')}
                      />
                    </div>
                    {errors.correo && (
                      <p className="text-xs text-red-500">{errors.correo.message}</p>
                    )}
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
                        Enviando...
                      </>
                    ) : (
                      'Enviar enlace de recuperación'
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4">
                <div className="flex justify-center mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                </div>
                <CardTitle className="text-xl text-center">
                  Revisa tu correo
                </CardTitle>
                <CardDescription className="text-center">
                  Si existe una cuenta con{' '}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {correoEnviado}
                  </span>
                  , recibirás un enlace para restablecer tu contraseña en los próximos minutos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 rounded-xl bg-[var(--color-beige)] text-xs text-[var(--color-muted-foreground)] text-center mb-4">
                  El enlace expira en <strong>1 hora</strong>. Revisa también tu carpeta de spam.
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEnviado(false)}
                >
                  Intentar con otro correo
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        <div className="flex justify-center mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}