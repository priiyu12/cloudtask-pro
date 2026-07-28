import { Navigate, Outlet } from "react-router";
import { getTokenPayload } from "../lib/api";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const payload = getTokenPayload();
  
  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && payload.role && !allowedRoles.includes(payload.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <Outlet />;
}
