import { Routes, Route } from "react-router-dom";
import PublicRoute from "../components/PublicRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - only visible if NOT logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes - only visible if logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
