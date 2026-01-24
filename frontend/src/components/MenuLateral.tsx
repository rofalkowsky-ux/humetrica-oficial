import { Settings, Users, BarChart3, Building2, LogOut, ChevronLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";

interface MenuLateralProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: Settings, label: "Configuración", path: "/" },
  { icon: Users, label: "Actividades", path: "/actividades" },
  { icon: BarChart3, label: "Métricas", path: "/metricas" },
  { icon: Building2, label: "Perfil", path: "/perfil" },
];

export const MenuLateral = ({ collapsed: _collapsed, onToggle }: MenuLateralProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center py-6 px-2">
        <div className="relative flex flex-col bg-card border border-border rounded-2xl shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-secondary"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          <nav className="flex flex-col items-center gap-1 py-3 px-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "h-10 w-10 rounded-lg transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-1 py-3 px-2 border-t border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-10 w-10 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Cerrar sesión
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
