import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useTheme } from "./hooks/useTheme";
import OnboardingLider from "./onboarding/OnboardingLider";
import OnboardingEquipo from "./onboarding/OnboardingEquipo";
import Dashboard from "./onboarding/Dashboard";
import { Gracias } from "./pages/Gracias";
import Auth from "./pages/Auth";
import { EquipoPanel } from "./components/metricas/EquipoPanel";
import Invitaciones from './pages/Invitaciones';
import Actividades from './pages/Actividades';
import Perfil from './pages/Perfil';
import ParticipantePerfil from './pages/ParticipantePerfil';

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

/** Sincroniza el tema con el DOM desde el primer render para evitar flash al cambiar de ruta. */
const ThemeSync: React.FC = () => {
  useTheme();
  return null;
};

const App: React.FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <ThemeSync />
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/onboarding" element={<OnboardingPorRol />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/equipo" element={<EquipoPanel />} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="/invitaciones" element={<Invitaciones />} />
            <Route path="/actividades" element={<Actividades />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/participante/perfil" element={<ParticipantePerfil />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;