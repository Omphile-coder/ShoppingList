import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Navbar } from "./components/Navbar";
import { ToastProvider } from "./components/ToastContext";

// Connects the router, navigation, and notifications to every page.
function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        <AppRoutes />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
