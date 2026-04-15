import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { apolloClient } from '@/lib/apollo';
import { gql } from '@apollo/client';

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const LOGOUT_ALL_MUTATION = gql`
  mutation LogoutAll {
    logoutAll
  }
`;

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: { nombre: string };
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, refreshToken: string, usuario: Usuario) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  isAuthenticated: boolean;
  isPropietario: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('access_token'),
  );

  const login = (
    accessToken: string,
    refreshToken: string,
    user: Usuario,
  ) => {
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
    try {
      await apolloClient.mutate({ mutation: LOGOUT_MUTATION });
    } catch {
      // Si falla igual limpiamos local
    } finally {
      clearLocal();
    }
  };

  const logoutAll = async () => {
    try {
      await apolloClient.mutate({ mutation: LOGOUT_ALL_MUTATION });
    } catch {
      // Si falla igual limpiamos local
    } finally {
      clearLocal();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        logoutAll,
        isAuthenticated: !!token,
        isPropietario: usuario?.rol?.nombre === 'Propietario',
        isAdmin: usuario?.rol?.nombre === 'Admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}