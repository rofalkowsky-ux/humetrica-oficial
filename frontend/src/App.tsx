import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; 
import { Landing } from "./pages/Landing";
import Auth from "./pages/Auth"; // Sin llaves, como sugirió la terminal
import { LeaderOnboarding } from "./pages/LeaderOnboarding";
import { MemberOnboarding } from "./pages/TeamMemberOnboarding"; // Nombre corregido
import MetricasContent from "./pages/MetricasContent"; // Sin llaves y nombre directo
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/system-auth-v1" element={<Auth />} />
          <Route path="/config-leader-step-01" element={<LeaderOnboarding />} />
          <Route path="/setup-member-view-02" element={<MemberOnboarding />} />
          <Route path="/data-metrics-internal" element={<MetricasContent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;