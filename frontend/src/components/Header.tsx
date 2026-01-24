import { Send, CheckCircle, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  invitacionesEnviadas?: number;
  participantesConfirmados?: number;
  pendientes?: number;
}

export const Header = ({ 
  invitacionesEnviadas = 24, 
  participantesConfirmados = 18, 
  pendientes = 6 
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full">
          <Send className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Invitaciones:</span>
          <span className="text-sm font-bold text-foreground">{invitacionesEnviadas}</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full">
          <CheckCircle className="w-4 h-4 text-success" />
          <span className="text-sm text-muted-foreground">Confirmados:</span>
          <span className="text-sm font-bold text-success">{participantesConfirmados}</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full">
          <Clock className="w-4 h-4 text-warning" />
          <span className="text-sm text-muted-foreground">Pendientes:</span>
          <span className="text-sm font-bold text-warning">{pendientes}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        <span className="text-sm font-medium text-foreground">Configuración en progreso</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="default" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Finalizar sesión de configuración
        </Button>
      </div>
    </header>
  );
};
