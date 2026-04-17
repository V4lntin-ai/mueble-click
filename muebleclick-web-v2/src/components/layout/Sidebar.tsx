import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Store, MapPin, Package, Users,
  ShoppingCart, TrendingUp, Settings, Warehouse,
  BadgeDollarSign, BarChart3, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
  section?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',    path: '/dashboard',   icon: LayoutDashboard, roles: ['Propietario','Admin'], section: 'Principal' },
  { label: 'Mueblerías',   path: '/mueblerias',  icon: Store,           roles: ['Propietario','Admin'], section: 'Negocio' },
  { label: 'Sucursales',   path: '/sucursales',  icon: MapPin,          roles: ['Propietario','Admin'], section: 'Negocio' },
  { label: 'Empleados',    path: '/empleados',   icon: Users,           roles: ['Propietario','Admin'], section: 'Negocio' },
  { label: 'Productos',    path: '/productos',   icon: Package,         roles: ['Propietario','Admin'], section: 'Catálogo' },
  { label: 'Inventario',   path: '/inventario',  icon: Warehouse,       roles: ['Propietario','Admin'], section: 'Catálogo' },
  { label: 'Pedidos',      path: '/pedidos',     icon: ShoppingCart,    roles: ['Propietario','Admin'], section: 'Comercial' },
  { label: 'Ventas',       path: '/ventas',      icon: TrendingUp,      roles: ['Propietario','Admin'], section: 'Comercial' },
  { label: 'Comisiones',   path: '/comisiones',  icon: BadgeDollarSign, roles: ['Propietario','Admin'], section: 'Comercial' },
  { label: 'Reportes',     path: '/reportes',    icon: BarChart3,       roles: ['Propietario','Admin'], section: 'Reportes' },
  { label: 'Usuarios',     path: '/usuarios',    icon: Settings,        roles: ['Admin'], badge: 'Admin', section: 'Sistema' },
];

function NavSection({ section, items }: { section: string; items: NavItem[] }) {
  return (
    <div className="mb-1">
      <p className="px-4 mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/25 select-none">
        {section}
      </p>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'nav-item group flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl text-sm font-medium mb-0.5',
              'text-white/55 transition-all duration-200',
              isActive && 'nav-active !text-[var(--color-accent)] font-semibold',
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className={cn(
                'w-4 h-4 shrink-0 transition-all duration-200',
                isActive ? 'text-[var(--color-accent)]' : 'text-white/40 group-hover:text-white/70',
              )} />
              <span className="flex-1 leading-none">{item.label}</span>
              {item.badge && (
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-[var(--color-accent)]/20 text-[var(--color-accent)] border-[var(--color-accent)]/30">
                  {item.badge}
                </Badge>
              )}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[var(--color-accent)]/60 shrink-0" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { usuario } = useAuth();
  const rolNombre = usuario?.rol?.nombre ?? '';
  const filtered = navItems.filter((item) => item.roles.includes(rolNombre));

  const sections = [...new Set(filtered.map((i) => i.section!))];

  return (
    <aside className="bg-gradient-sidebar w-64 h-full flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 animate-pulse-gold"
            style={{
              background: 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #B8860B 100%)',
              boxShadow: '0 4px 12px rgba(201,168,76,0.35)',
            }}
          >
            <Package className="w-4.5 h-4.5 text-[#0E2418]" />
          </div>
          <div>
            <p className="text-white font-bold text-[15px] leading-none tracking-tight">
              MuebleClick
            </p>
            <p className="text-white/40 text-[10px] mt-0.5 font-medium tracking-wide">
              {rolNombre === 'Admin' ? 'Administración' : 'Panel Propietario'} · V2
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 space-y-3">
        {sections.map((section) => (
          <NavSection
            key={section}
            section={section!}
            items={filtered.filter((i) => i.section === section)}
          />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* User Info */}
      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #C9A84C, #B8860B)', color: '#0E2418' }}
          >
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/85 text-xs font-semibold truncate leading-none">
              {usuario?.nombre}
            </p>
            <p className="text-white/35 text-[10px] mt-0.5 truncate">
              {rolNombre}
            </p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-g400)] shrink-0 animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
