import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import { OnboardingFlow } from "./pages/OnboardingFlow";
import Metricas from "./pages/MetricasContent";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/app" element={<OnboardingFlow />} />
          <Route path="/metricas" element={<Metricas />} />
          <Route path="/participante" element={<div className="min-h-screen bg-background flex items-center justify-center"><p>Vista de Participante - En desarrollo</p></div>} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
