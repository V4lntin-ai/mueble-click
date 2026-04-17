import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Auth pages
import LoginPage from '@/features/auth/LoginPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/ResetPasswordPage';

// Feature pages
import DashboardPage from '@/features/dashboard/DashboardPage';
import MuebleriaPage from '@/features/mueblerias/MuebleriaPage';
import SucursalesPage from '@/features/sucursales/SucursalesPage';
import ProductosPage from '@/features/productos/ProductosPage';
import InventarioPage from '@/features/inventario/InventarioPage';
import EmpleadosPage from '@/features/empleados/EmpleadosPage';
import PedidosPage from '@/features/pedidos/PedidosPage';
import VentasPage from '@/features/ventas/VentasPage';
import ComisionesPage from '@/features/comisiones/ComisionesPage';
import ReportesPage from '@/features/reportes/ReportesPage';
import UsuariosPage from '@/features/usuarios/UsuariosPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected — dashboard layout */}
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"   element={<DashboardPage />} />
        <Route path="mueblerias"  element={<MuebleriaPage />} />
        <Route path="sucursales"  element={<SucursalesPage />} />
        <Route path="productos"   element={<ProductosPage />} />
        <Route path="inventario"  element={<InventarioPage />} />
        <Route path="empleados"   element={<EmpleadosPage />} />
        <Route path="pedidos"     element={<PedidosPage />} />
        <Route path="ventas"      element={<VentasPage />} />
        <Route path="comisiones"  element={<ComisionesPage />} />
        <Route path="reportes"    element={<ReportesPage />} />
        <Route path="usuarios"    element={<AdminRoute><UsuariosPage /></AdminRoute>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
