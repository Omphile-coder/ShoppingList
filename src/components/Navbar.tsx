import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import ConfirmOverlay from "./ConfirmOverlay";
import { User } from "lucide-react";

export const Navbar = () => {
  // Retrieves routing, Redux dispatch, and auth state, while managing the visibility of the logout modal
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false);

  // Ensures the confirmation modal is closed automatically if the authentication state changes
  useEffect(() => {
    setIsLogoutConfirmationOpen(false);
  }, [isAuthenticated]);

  // Hides the navbar entirely so unauthenticated users don't see navigation controls
  if (!isAuthenticated) return null;

  // Closes the modal, clears the user's session via Redux, and redirects them to the login page
  const handleLogout = () => {
    setIsLogoutConfirmationOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        ShopList Pro
      </Link>

      <div className="nav-links">
        <Link to="/profile" className="nav-link">
          <User />
        </Link>
        <button
          onClick={() => setIsLogoutConfirmationOpen(true)}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      {/* Conditionally renders the reusable confirmation overlay when the user initiates a logout */}
      {isLogoutConfirmationOpen && (
        <ConfirmOverlay
          title="Log out?"
          message="Are you sure you want to log out of your account?"
          confirmText="Log out"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmationOpen(false)}
        />
      )}
    </nav>
  );
};