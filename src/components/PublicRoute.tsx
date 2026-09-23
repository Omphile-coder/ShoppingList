import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const PublicRoute = () => {
  // Retrieves the current user's authentication status from the Redux store
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Redirects already authenticated users away from public pages (like login/signup) and sends them to the home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // Renders the nested child components if the user is not authenticated
  return <Outlet />;
};

export default PublicRoute;