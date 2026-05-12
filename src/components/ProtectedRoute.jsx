import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <div className="p-10 text-center text-slate-300">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}
