import { Send, CheckCircle, Clock } from "lucide-react";

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
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="text-sm text-muted-foreground">Confirmados:</span>
          <span className="text-sm font-bold text-emerald-500">{participantesConfirmados}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary rounded-full">
          <Clock className="w-4 h-4 text-amber-500" />
          <span className="text-sm text-muted-foreground">Pendientes:</span>
          <span className="text-sm font-bold text-amber-500">{pendientes}</span>
        </div>
      </div>
    </header>
  );
};