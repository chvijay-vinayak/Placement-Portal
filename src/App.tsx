import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import OfficerDashboard from "./pages/OfficerDashboard";
import NotFound from "./pages/NotFound";
import PostedJobs from '@/pages/PostedJobs';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (user.role !== allowedRole) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          {/* Top-left site logo: put your file at public/KL_University_logo.svg */}
          <a href="/" className="site-logo" aria-label="Home">
            <img
              src="/KL_University_logo.svg"
              alt="KL University logo"
              onError={(e) => {
                // hide broken image and log guidance so it's obvious why it didn't show
                // eslint-disable-next-line no-param-reassign
                e.currentTarget.style.display = 'none';
                // keep the message short and actionable for the developer
                // eslint-disable-next-line no-console
                console.warn('Logo not found at /KL_University_logo.svg — copy your logo to public/KL_University_logo.svg or update the img src in src/App.tsx');
              }}
            />
          </a>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login/:role" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/student" element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer" element={
                <ProtectedRoute allowedRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/officer" element={
                <ProtectedRoute allowedRole="officer">
                  <OfficerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/posted-jobs" element={<PostedJobs />} />

              {/* officer-only view (protected) — officers sign in and open this to accept jobs */}
              <Route
                path="/officer/posted-jobs"
                element={
                  <ProtectedRoute allowedRole="officer">
                    <PostedJobs />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
