import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Leaf } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LOGIN_MUTATION } from '@/graphql/auth';
import { useAuth } from '@/context/AuthContext';

interface LoginResponse {
  login: {
    access_token: string;
    refresh_token: string;
    usuario: {
      id_usuario: number;
      nombre: string;
      correo: string;
      rol: { nombre: string };
    };
  };
}

const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [loginMutation, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { access_token, refresh_token, usuario } = data.login;
      const rol = usuario.rol.nombre;

      if (rol !== 'Propietario' && rol !== 'Admin') {
        toast.error('Acceso denegado', {
          description: 'Solo propietarios y administradores pueden acceder al panel.',
        });
        return;
      }

      login(access_token, refresh_token, usuario);
      toast.success(`Bienvenido, ${usuario.nombre}`);
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error('Error al iniciar sesión', {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation({ variables: { input: data } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige px-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-(--color-primary) opacity-5" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brown opacity-5" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-(--color-primary) flex items-center justify-center mb-4 shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary-dark">
            MuebleClick
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-xl border-(--color-border)">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              Iniciar sesión
            </CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para continuar
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Correo */}
              <div className="space-y-2">
                <Label htmlFor="correo">Correo electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  {...register('correo')}
                  className={errors.correo ? 'border-red-500' : ''}
                />
                {errors.correo && (
                  <p className="text-xs text-red-500">{errors.correo.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-(--color-foreground) transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-(--color-primary) hover:bg-primary-dark text-white font-medium h-11 mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Solo propietarios y administradores tienen acceso a este panel.
        </p>
      </div>
    </div>
  );
}