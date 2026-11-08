import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../features/auth/authSlice";
import { setLists } from "../features/shoppingLists/shoppingListsSlice";
import { setItems } from "../features/shoppingLists/shoppingItemSlice";
import ConfirmOverlay from "./ConfirmOverlay";
import { Brand } from "./Brand";

// Shows app navigation only after sign-in and clears the current user's data on sign-out.
export function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signedIn = useAppSelector((state) => state.auth.isAuthenticated);
  const [confirming, setConfirming] = useState(false);

  // Clears Redux and the saved session before returning to the sign-in screen.
  function handleLogout() {
    setConfirming(false);
    dispatch(setLists([]));
    dispatch(setItems([]));
    dispatch(logout());
    navigate("/login", { replace: true });
  }

  if (!signedIn) return null;
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="WeShop home"><Brand /></Link>
        <div className="nav-links">
          <NavLink to="/profile" className="nav-link"><UserRound size={17} /> Profile</NavLink>
          <button type="button" className="action-btn edit-btn" onClick={() => setConfirming(true)}>Sign out</button>
        </div>
      </div>
      {confirming && <ConfirmOverlay title="Sign out?" message="You can sign back in to see your lists." confirmText="Sign out"
        onConfirm={handleLogout} onCancel={() => setConfirming(false)} />}
    </nav>
  );
}
