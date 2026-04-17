import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeLabels: Record<string, string> = {
  dashboard:  'Dashboard',
  mueblerias: 'Mueblerías',
  sucursales: 'Sucursales',
  productos:  'Productos',
  inventario: 'Inventario',
  empleados:  'Empleados',
  pedidos:    'Pedidos',
  ventas:     'Ventas',
  comisiones: 'Comisiones',
  reportes:   'Reportes',
  usuarios:   'Usuarios',
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm">
      <Link
        to="/dashboard"
        className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const label = routeLabels[seg] ?? seg;
        const path = '/' + segments.slice(0, i + 1).join('/');
        return (
          <div key={seg} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-[var(--color-subtle)]" />
            {isLast ? (
              <span className={cn('font-semibold text-[var(--color-foreground)]')}>
                {label}
              </span>
            ) : (
              <Link
                to={path}
                className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
