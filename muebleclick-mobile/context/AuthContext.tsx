// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Storage from '../lib/storage'; 

export type Role = 'Cliente' | 'Empleado' | 'Propietario' | null;

interface AuthState {
  role: Role;
  isLoading: boolean;
  login: (token: string, selectedRole: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const storedToken = await Storage.getItemAsync('access_token');
        const storedRole = await Storage.getItemAsync('user_role');
        
        if (storedToken && storedRole) {
          setRole(storedRole as Role);
        }
      } catch (error) {
        console.error("Error cargando la sesión:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredSession();
  }, []);

  const login = async (token: string, selectedRole: Role) => {
    await Storage.setItemAsync('access_token', token);
    await Storage.setItemAsync('user_role', selectedRole || '');
    setRole(selectedRole);
  };

  const logout = async () => {
    await Storage.deleteItemAsync('access_token');
    await Storage.deleteItemAsync('user_role');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de AuthProvider');
  return context;
};