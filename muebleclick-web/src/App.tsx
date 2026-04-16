import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import MuebleriaPage from './pages/MuebleriaPage';
import ProductosPage from './pages/ProductosPage';
import EmpleadosPage from './pages/EmpleadosPage';
import PedidosPage from './pages/PedidosPage';
import VentasPage  from './pages/VentasPage';
import SucursalesPage from './pages/SucursalesPage';
import InventarioPage from './pages/InventarioPage';
import UsuariosPage   from './pages/UsuariosPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"  element={<DashboardPage />} />
        <Route path="mueblerias" element={<MuebleriaPage />} />
        <Route path="sucursales" element={<SucursalesPage />} />
        <Route path="productos"  element={<ProductosPage />} />
        <Route path="inventario" element={<InventarioPage />} />
        <Route path="empleados"  element={<EmpleadosPage />} />
        <Route path="pedidos"    element={<PedidosPage />} />
        <Route path="ventas"     element={<VentasPage />} />
        <Route path="usuarios"   element={<UsuariosPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}