// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Alineado con el enum de roles de tu backend NestJS
export type Role = 'Cliente' | 'Empleado' | 'Propietario' | null;

interface AuthState {
  role: Role;
  isLoading: boolean;
  login: (selectedRole: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos la carga inicial (ej. leyendo un token de AsyncStorage)
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
  };

  const logout = () => {
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