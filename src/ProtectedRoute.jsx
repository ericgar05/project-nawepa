import { Outlet, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "./componets/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
