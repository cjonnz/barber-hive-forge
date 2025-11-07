import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { BarbeirosPage } from "@/pages/admin/BarbeirosPage";
import { AgendamentosPage } from "@/pages/admin/AgendamentosPage";
import { ConfiguracoesPage } from "@/pages/admin/ConfiguracoesPage";
import { BarbeiroDashboard } from "@/pages/barbeiro/BarbeiroDashboard";
import { AgendaPage } from "@/pages/barbeiro/AgendaPage";
import { ServicosPage } from "@/pages/barbeiro/ServicosPage";
import { PerfilPage } from "@/pages/barbeiro/PerfilPage";
import { AgendamentoPublico } from "@/pages/AgendamentoPublico";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ 
  children, 
  allowedRole 
}: { 
  children: React.ReactNode; 
  allowedRole: 'admin' | 'barbeiro' 
}) => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !userData) {
    return <Navigate to="/login" replace />;
  }

  if (userData.role !== allowedRole) {
    return <Navigate to={userData.role === 'admin' ? '/admin' : '/barbeiro'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to={userData?.role === 'admin' ? '/admin' : '/barbeiro'} replace />
          ) : (
            <LandingPage />
          )
        } 
      />

      {/* Login */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={userData?.role === 'admin' ? '/admin' : '/barbeiro'} replace />
          ) : (
            <Login />
          )
        } 
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout userRole="admin">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/barbeiros"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout userRole="admin">
              <BarbeirosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/agendamentos"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout userRole="admin">
              <AgendamentosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/configuracoes"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout userRole="admin">
              <ConfiguracoesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Barbeiro Routes */}
      <Route
        path="/barbeiro"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <BarbeiroDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/agenda"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <AgendaPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/servicos"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <ServicosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/perfil"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <PerfilPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Public Booking Route */}
      <Route path="/:linkPublico" element={<AgendamentoPublico />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
