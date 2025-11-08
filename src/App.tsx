import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { LandingPage } from "@/pages/LandingPage";
import { Login } from "@/pages/Login";
import { CadastroBarbearia } from "@/pages/CadastroBarbearia";
import { StatusPendente } from "@/pages/StatusPendente";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { BarbeirosPage } from "@/pages/admin/BarbeirosPage";
import { SolicitacoesPage } from "@/pages/admin/SolicitacoesPage";
import { AgendamentosPage } from "@/pages/admin/AgendamentosPage";
import { ConfiguracoesPage } from "@/pages/admin/ConfiguracoesPage";
import { BarbeiroDashboard } from "@/pages/barbeiro/BarbeiroDashboard";
import { AgendaPage } from "@/pages/barbeiro/AgendaPage";
import { ServicosPage } from "@/pages/barbeiro/ServicosPage";
import { PerfilPage } from "@/pages/barbeiro/PerfilPage";
import { VendasPage } from "@/pages/barbeiro/VendasPage";
import { ProdutosPage } from "@/pages/barbeiro/ProdutosPage";
import { ContasReceberPage } from "@/pages/barbeiro/ContasReceberPage";
import { RelatoriosPage } from "@/pages/barbeiro/RelatoriosPage";
import { ConfiguracoesBarbeiroPage } from "@/pages/barbeiro/ConfiguracoesBarbeiroPage";
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

      {/* Cadastro */}
      <Route path="/cadastro" element={<CadastroBarbearia />} />
      <Route path="/status-pendente" element={<StatusPendente />} />

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
        path="/admin/solicitacoes"
        element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout userRole="admin">
              <SolicitacoesPage />
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
        path="/barbeiro/vendas"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <VendasPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/produtos"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <ProdutosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/contas-receber"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <ContasReceberPage />
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
        path="/barbeiro/relatorios"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <RelatoriosPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/barbeiro/configuracoes"
        element={
          <ProtectedRoute allowedRole="barbeiro">
            <DashboardLayout userRole="barbeiro">
              <ConfiguracoesBarbeiroPage />
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
