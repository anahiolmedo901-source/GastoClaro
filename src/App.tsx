// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/Authcontext';

import Layout from './componentes/Layout';
import Dashboard from './pages/Dashboard';
import NuevoGasto from './pages/NuevoGasto';
import Gastos from './pages/Gastos';
import Reportes from './pages/Reportes';
import Ajustes from './pages/Ajustes';

// Páginas de autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Componente para proteger rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas (Auth) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Protegidas */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/nuevo" element={
              <ProtectedRoute>
                <NuevoGasto />
              </ProtectedRoute>
            } />
            
            <Route path="/gastos" element={
              <ProtectedRoute>
                <Gastos />
              </ProtectedRoute>
            } />
            
            <Route path="/reportes" element={
              <ProtectedRoute>
                <Reportes />
              </ProtectedRoute>
            } />
            
            <Route path="/ajustes" element={
              <ProtectedRoute>
                <Ajustes />
              </ProtectedRoute>
            } />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;