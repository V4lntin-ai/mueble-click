import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import MuebleriaPage from './pages/MuebleriaPage';

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
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="mueblerias" element={<MuebleriaPage />} />
        <Route path="sucursales" element={<div className="p-4">Sucursales — próximamente</div>} />
        <Route path="productos" element={<div className="p-4">Productos — próximamente</div>} />
        <Route path="inventario" element={<div className="p-4">Inventario — próximamente</div>} />
        <Route path="empleados" element={<div className="p-4">Empleados — próximamente</div>} />
        <Route path="pedidos" element={<div className="p-4">Pedidos — próximamente</div>} />
        <Route path="ventas" element={<div className="p-4">Ventas — próximamente</div>} />
        <Route path="usuarios" element={<div className="p-4">Usuarios — solo Admin</div>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}