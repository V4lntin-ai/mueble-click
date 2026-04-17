import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { Eye, EyeOff, Package, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LOGIN_MUTATION } from '@/graphql/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  correo: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginMutation({ variables: { input: data } });
      const { access_token, refresh_token, usuario } = (res.data as any).login;
      login(access_token, refresh_token, usuario);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      toast.error(e?.graphQLErrors?.[0]?.message ?? 'Credenciales incorrectas');
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #0E2418 0%, #1A3A2A 50%, #2D5A3D 100%)' }}
    >
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Floating cards decoration */}
        <div className="absolute top-20 left-16 w-32 h-20 rounded-2xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', transform: 'rotate(-12deg)' }} />
        <div className="absolute bottom-32 right-20 w-24 h-32 rounded-2xl opacity-10"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', transform: 'rotate(8deg)' }} />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #B8860B 100%)' }}>
            <Package className="w-10 h-10 text-[#0E2418]" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            MuebleClick
          </h1>
          <p className="text-xl text-white/60 mb-8 leading-relaxed">
            Panel de administración empresarial para gestión integral de mueblerías
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Inventario', 'Ventas', 'Pedidos', 'Comisiones', 'Reportes'].map((tag) => (
              <span key={tag}
                className="text-sm px-4 py-2 rounded-full text-white/70 border border-white/15 bg-white/5">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-10 text-xs text-white/25 font-medium tracking-widest uppercase">
            Versión 2.0 — Diseño premium
          </p>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div
          className="w-full max-w-sm rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.97)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #B8860B)' }}>
              <Package className="w-5 h-5 text-[#0E2418]" />
            </div>
            <div>
              <p className="font-bold text-[#1A3A2A] text-lg leading-none">MuebleClick</p>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Panel V2</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)] leading-tight">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1.5">
              Accede a tu panel de administración
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="correo" className="text-sm font-medium">Correo electrónico</Label>
              <Input
                id="correo"
                type="email"
                autoComplete="email"
                placeholder="usuario@muebleclick.mx"
                {...register('correo')}
                className="h-11 rounded-xl border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/30"
              />
              {errors.correo && (
                <p className="text-xs text-red-500">{errors.correo.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
                <Link to="/forgot-password"
                  className="text-xs text-[var(--color-accent)] hover:text-[var(--color-gold-600)] transition-colors font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="h-11 rounded-xl border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/30 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-semibold text-sm mt-2 gap-2 transition-all duration-200"
              style={{
                background: loading ? '#6B7280' : 'linear-gradient(135deg, #1A3A2A 0%, #2D5A3D 100%)',
                color: 'white',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(26,58,42,0.35)',
              }}
            >
              {loading ? 'Iniciando sesión...' : (
                <>Ingresar al panel <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          {/* Gold accent line */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
            <p className="text-center text-[10px] text-[var(--color-muted-foreground)]">
              MuebleClick V2 · Plataforma empresarial de gestión de mueblerías
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
