import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Navbar } from "./components/Navbar";
import { ToastProvider } from "./components/ToastContext";

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
