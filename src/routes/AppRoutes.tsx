import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "../components/PublicRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ProtectedRoute } from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import { ShoppingListDetails } from "../pages/ShoppingListDetails";
import { ProfilePage } from "../pages/ProfilePage";

// Groups sign-in pages and signed-in pages under their matching route guards.
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
        <Route path="/lists/:listId" element={<ShoppingListDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
