import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import OnboardingLider from "./onboarding/OnboardingLider";
import OnboardingEquipo from "./onboarding/OnboardingEquipo";
import Dashboard from "./onboarding/Dashboard";
import { Gracias } from "./pages/Gracias";
import Auth from "./pages/Auth";

interface AppProps {}

const USER_STORAGE_KEY = "user";

const obtenerRolDelUsuario = (): "lider" | "equipo" | null => {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (userData) {
    try {
      const user = JSON.parse(userData) as { rol?: string };
      if (user.rol === "lider" || user.rol === "equipo") return user.rol;
    } catch {
      // ignore
    }
  }
  return null;
};

const OnboardingPorRol: React.FC = () => {
  const rol = obtenerRolDelUsuario();
  if (rol === "lider") return <OnboardingLider />;
  if (rol === "equipo") return <OnboardingEquipo />;
  return <Navigate to="/" replace />;
};

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/onboarding" element={<OnboardingPorRol />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;