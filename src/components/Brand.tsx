import { ShoppingBasket } from "lucide-react";

// Keeps the WeShop name and basket mark consistent on auth pages and navigation.
export function Brand() {
  return <span className="brand"><span className="brand-mark"><ShoppingBasket size={21} aria-hidden="true" /></span>WeShop</span>;
}
