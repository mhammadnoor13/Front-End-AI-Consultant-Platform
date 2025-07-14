import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/ApiContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import SubmitCasePage from "./pages/SubmitCasePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CasesPage from "./pages/CasesPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import ReferencesPage from "./pages/ReferencesPage";
import AdminConsultantsPage from "./pages/AdminConsultantsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ApiProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/cases">
                    <SubmitCasePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/cases">
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute requireAuth={false} redirectTo="/cases">
                    <RegisterPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes - Consultant */}
              <Route 
                path="/cases" 
                element={
                  <ProtectedRoute requiredRole="consultant">
                    <CasesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cases/:caseId" 
                element={
                  <ProtectedRoute requiredRole="consultant">
                    <CaseDetailPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/references" 
                element={
                  <ProtectedRoute requiredRole="consultant">
                    <ReferencesPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Routes - Admin */}
              <Route 
                path="/admin/consultants" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminConsultantsPage />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ApiProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
