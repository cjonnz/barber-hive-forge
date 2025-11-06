import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Login } from "@/pages/Login";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { BarbeirosPage } from "@/pages/admin/BarbeirosPage";
import { BarbeiroDashboard } from "@/pages/barbeiro/BarbeiroDashboard";
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

      {/* Root redirect */}
      <Route 
        path="/" 
        element={
          <Navigate to={user ? (userData?.role === 'admin' ? '/admin' : '/barbeiro') : '/login'} replace />
        } 
      />

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
