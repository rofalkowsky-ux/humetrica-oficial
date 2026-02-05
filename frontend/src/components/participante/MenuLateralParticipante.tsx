import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: User, label: "Mi Perfil", path: "/participante/perfil" },
];

export const MenuLateralParticipante = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex items-center py-6 px-2">
        <div className="relative flex flex-col bg-card border border-border rounded-2xl shadow-sm">
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
