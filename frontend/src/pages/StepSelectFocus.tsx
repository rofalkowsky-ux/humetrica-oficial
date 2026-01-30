import { Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepSelectFocusProps {
  onNext: (focus: string) => void;
}

export const StepSelectFocus = ({ onNext }: StepSelectFocusProps) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="humetrica-title mb-2">Para comenzar, analizaremos:</h1>
      <h2 className="text-3xl font-bold text-primary mb-6">Desalineación Operativa</h2>
      
      <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Zap size={24} />
          </div>
          <p className="text-lg font-medium leading-relaxed italic">
            "Es la brecha existente entre lo que el líder cree que su equipo entiende y efectúa, 
            y lo que el equipo realmente prioriza y hace en la práctica."
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 pt-4 border-t border-primary/10">
          <Info size={16} />
          <span>Luego podrás realizar otros análisis de impacto adicionales.</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={() => onNext("desalineacion-operativa")}
          size="lg"
          className="w-full sm:w-auto px-12 h-12 shadow-lg shadow-primary/20"
        >
          Iniciar Diagnóstico
        </Button>
      </div>
    </div>
  );
};