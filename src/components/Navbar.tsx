import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import ConfirmOverlay from "./ConfirmOverlay";
import { User } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] =
    useState(false);
  if (!isAuthenticated) return null;

  const handleLogout = () => {
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
