import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const PublicRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;