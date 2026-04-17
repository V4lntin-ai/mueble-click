import { createContext, useContext, useState, type ReactNode } from 'react';
import { apolloClient } from '@/lib/apollo';
import { gql } from '@apollo/client';
import type { AuthUser } from '@/types';

const LOGOUT_MUTATION = gql`mutation Logout { logout }`;
const LOGOUT_ALL_MUTATION = gql`mutation LogoutAll { logoutAll }`;

interface AuthContextType {
  usuario: AuthUser | null;
  token: string | null;
  login: (token: string, refreshToken: string, usuario: AuthUser) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  isAuthenticated: boolean;
  isPropietario: boolean;
  isAdmin: boolean;
  isEmpleado: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('access_token'),
  );

  const login = (accessToken: string, refreshToken: string, user: AuthUser) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(accessToken);
    setUsuario(user);
  };

  const clearLocal = () => {
    localStorage.clear();
    setToken(null);
    setUsuario(null);
    apolloClient.clearStore();
  };

  const logout = async () => {
    try { await apolloClient.mutate({ mutation: LOGOUT_MUTATION }); } catch { /* silent */ }
    finally { clearLocal(); }
  };

  const logoutAll = async () => {
    try { await apolloClient.mutate({ mutation: LOGOUT_ALL_MUTATION }); } catch { /* silent */ }
    finally { clearLocal(); }
  };

  const rolNombre = usuario?.rol?.nombre ?? '';

  return (
    <AuthContext.Provider value={{
      usuario,
      token,
      login,
      logout,
      logoutAll,
      isAuthenticated: !!token,
      isPropietario: rolNombre === 'Propietario',
      isAdmin: rolNombre === 'Admin',
      isEmpleado: rolNombre === 'Empleado',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
