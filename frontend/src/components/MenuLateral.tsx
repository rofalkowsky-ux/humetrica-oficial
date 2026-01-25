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
  { icon: BarChart3, label: "Métricas", path: "/metricas" },
  { icon: Users, label: "Onboarding", path: "/app" },
  { icon: Settings, label: "Configuración", path: "/auth" },
  { icon: Building2, label: "Perfil", path: "/participante" },
];

export const MenuLateral = ({ collapsed, onToggle }: MenuLateralProps) => {
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
      <div className={cn(
        "flex items-center py-6 px-2 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}>
        <div className={cn(
          "relative flex flex-col bg-card border border-border rounded-2xl shadow-sm transition-all duration-300 overflow-hidden",
          collapsed ? "w-20" : "w-64"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full border border-border bg-card shadow-sm hover:bg-secondary transition-transform",
              collapsed && "rotate-180"
            )}
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>

          <nav className={cn(
            "flex flex-col gap-1 py-3 transition-all duration-300",
            collapsed ? "items-center px-2" : "items-start px-3"
          )}>
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path || 
                              (item.path === "/metricas" && location.pathname.startsWith("/metricas"));
              return (
                <Tooltip key={index} delayDuration={collapsed ? 0 : 300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size={collapsed ? "icon" : "default"}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "rounded-lg transition-colors",
                        collapsed 
                          ? "h-10 w-10" 
                          : "h-10 w-full justify-start gap-3 px-3",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          <div className={cn(
            "flex flex-col gap-1 py-3 border-t border-border transition-all duration-300",
            collapsed ? "items-center px-2" : "items-start px-3"
          )}>
            <Tooltip delayDuration={collapsed ? 0 : 300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? "icon" : "default"}
                  onClick={toggleTheme}
                  className={cn(
                    "rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary",
                    collapsed ? "h-10 w-10" : "h-10 w-full justify-start gap-3 px-3"
                  )}
                >
                  {theme === 'light' ? <Moon className="h-5 w-5 shrink-0" /> : <Sun className="h-5 w-5 shrink-0" />}
                  {!collapsed && (
                    <span className="text-sm font-medium">
                      {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
                </TooltipContent>
              )}
            </Tooltip>
            <Tooltip delayDuration={collapsed ? 0 : 300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={collapsed ? "icon" : "default"}
                  onClick={handleLogout}
                  className={cn(
                    "rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                    collapsed ? "h-10 w-10" : "h-10 w-full justify-start gap-3 px-3"
                  )}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium">Cerrar sesión</span>
                  )}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  Cerrar sesión
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
