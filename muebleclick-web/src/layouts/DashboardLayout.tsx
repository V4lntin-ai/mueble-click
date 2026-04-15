import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Store, MapPin, Package,
  Users, ShoppingCart, TrendingUp, LogOut,
  Menu, ChevronDown, Leaf, Settings, Warehouse,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',  path: '/dashboard',  icon: LayoutDashboard, roles: ['Propietario', 'Admin'] },
  { label: 'Mueblerías', path: '/mueblerias', icon: Store,            roles: ['Propietario', 'Admin'] },
  { label: 'Sucursales', path: '/sucursales', icon: MapPin,           roles: ['Propietario', 'Admin'] },
  { label: 'Productos',  path: '/productos',  icon: Package,          roles: ['Propietario', 'Admin'] },
  { label: 'Inventario', path: '/inventario', icon: Warehouse,        roles: ['Propietario', 'Admin'] },
  { label: 'Empleados',  path: '/empleados',  icon: Users,            roles: ['Propietario', 'Admin'] },
  { label: 'Pedidos',    path: '/pedidos',    icon: ShoppingCart,     roles: ['Propietario', 'Admin'] },
  { label: 'Ventas',     path: '/ventas',     icon: TrendingUp,       roles: ['Propietario', 'Admin'] },
  { label: 'Usuarios',   path: '/usuarios',   icon: Settings,         roles: ['Admin'], badge: 'Admin' },
];

function NavItems({ onClose }: { onClose?: () => void }) {
  const { usuario } = useAuth();
  const rol = usuario?.rol?.nombre ?? '';
  const items = navItems.filter((item) => item.roles.includes(rol));

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[var(--color-primary)] text-white shadow-md shadow-green-900/20'
                : 'text-[var(--color-muted-foreground)] hover:bg-white hover:text-[var(--color-foreground)] hover:shadow-sm',
            )
          }
        >
          <item.icon className="w-4 h-4 shrink-0" />
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200">
              {item.badge}
            </Badge>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Sidebar() {
  const { usuario } = useAuth();

  return (
    <aside
      className="w-64 h-full flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #F5F0E8 0%, #EDE0CC 100%)',
        borderRight: '1px solid #E2D9CE',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 mb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #2D6A4F, #1B4332)',
            boxShadow: '0 4px 12px rgba(27,67,50,0.35)',
          }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-[var(--color-primary-dark)] text-[15px] leading-none tracking-tight">
            MuebleClick
          </p>
          <p className="text-[11px] text-[var(--color-muted-foreground)] mt-0.5 font-medium">
            {usuario?.rol?.nombre === 'Admin' ? 'Administración' : 'Panel Propietario'}
          </p>
        </div>
      </div>

      <div className="mx-3 h-px bg-[var(--color-border)]" />

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3">
        <p className="px-6 text-[10px] font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">
          Menú principal
        </p>
        <NavItems />
      </div>

      <div className="mx-3 h-px bg-[var(--color-border)]" />

      {/* Usuario */}
      <div className="p-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-white/80 shadow-sm">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarFallback
              className="text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
            >
              {usuario?.nombre?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-[var(--color-foreground)]">
              {usuario?.nombre}
            </p>
            <p className="text-[10px] text-[var(--color-muted-foreground)] truncate">
              {usuario?.rol?.nombre}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardLayout() {
  const { usuario, logout, logoutAll } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F7F3EE' }}>
      {/* Sidebar desktop */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Sidebar mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 glass border-b flex items-center justify-between px-4 lg:px-6 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="hidden lg:block" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-white/60"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback
                    className="text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #2D6A4F, #1B4332)' }}
                  >
                    {usuario?.nombre?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">
                  {usuario?.nombre}
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--color-muted-foreground)]" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-xl border-[var(--color-border)]"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold">{usuario?.nombre}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {usuario?.correo}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogoutAll}
                className="text-orange-600 cursor-pointer focus:text-orange-600 focus:bg-orange-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar todas las sesiones
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}