import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import OnboardingLider from "./onboarding/OnboardingLider";
import OnboardingEquipo from "./onboarding/OnboardingEquipo";
import Dashboard from "./onboarding/Dashboard";
import { Gracias } from "./pages/Gracias";

interface AppProps {}

/** Obtiene el rol desde localStorage (ej. de tu sistema de autenticación o API). */
const obtenerRolDelUsuario = (): "lider" | "equipo" => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData) as { rol?: string };
      if (user.rol === "lider" || user.rol === "equipo") return user.rol;
    } catch {
      // ignore
    }
  }
  return "equipo";
};

const OnboardingPorRol: React.FC = () => {
  const rol = obtenerRolDelUsuario();
  return rol === "lider" ? <OnboardingLider /> : <OnboardingEquipo />;
};

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="/" element={<OnboardingPorRol />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
