import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export const ProtectedRoute = () => {
  // Retrieves the current user's authentication status from the Redux store
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Redirects unauthenticated users to the login page, using 'replace' to keep the protected route out of browser history
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Renders the nested child components (the protected pages) if the user is successfully authenticated
  return <Outlet />;
};