import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Breadcrumbs } from './Breadcrumbs';
import { initials } from '@/lib/formatters';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { usuario, logout, logoutAll } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const handleLogoutAll = async () => { await logoutAll(); navigate('/login'); };

  return (
    <header
      className="h-14 glass border-b flex items-center justify-between px-4 lg:px-6 shrink-0 z-40"
      style={{ borderColor: 'rgba(229,224,216,0.6)' }}
    >
      {/* Left: menu + breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden w-8 h-8 rounded-lg text-[var(--color-foreground-mid)]"
          onClick={onMenuClick}
        >
          <Menu className="w-4.5 h-4.5" />
        </Button>
        <div className="hidden lg:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg relative text-[var(--color-foreground-mid)] hover:bg-black/5"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] ring-1 ring-white" />
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-8 px-2.5 rounded-xl hover:bg-black/5 transition-all"
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback
                  className="text-[10px] font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #1A3A2A, #2D5A3D)',
                    color: '#E8C97A',
                  }}
                >
                  {usuario ? initials(usuario.nombre) : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:block text-[var(--color-foreground-mid)] max-w-[120px] truncate">
                {usuario?.nombre}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--color-muted)] hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl shadow-xl border-[var(--color-border)] bg-white/95 backdrop-blur-xl p-1.5"
          >
            <DropdownMenuLabel className="font-normal px-3 py-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-[var(--color-foreground)]">{usuario?.nombre}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{usuario?.correo}</p>
                <span className="inline-flex mt-1 w-fit text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(201,168,76,0.12)', color: 'var(--color-gold-600)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  {usuario?.rol?.nombre}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 rounded-xl text-sm"
            >
              <LogOut className="w-4 h-4 mr-2.5" />
              Cerrar sesión
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleLogoutAll}
              className="text-orange-600 cursor-pointer focus:text-orange-600 focus:bg-orange-50 rounded-xl text-sm"
            >
              <LogIn className="w-4 h-4 mr-2.5 rotate-180" />
              Cerrar todas las sesiones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
