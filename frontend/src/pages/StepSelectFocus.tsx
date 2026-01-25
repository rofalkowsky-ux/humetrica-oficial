import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Clock, AlertTriangle, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepSelectFocusProps {
  onNext: (focus: string) => void;
}

export const StepSelectFocus = ({ onNext }: StepSelectFocusProps) => {
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const focusOptions = [
    {
      id: "deadlines",
      icon: Clock,
      title: "Comunicación",
    },
    {
      id: "errors",
      icon: AlertTriangle,
      title: "Trabajo en equipo",
    },
    {
      id: "resources",
      icon: BarChart3,
      title: "Orientación a resultados",
    },
    {
      id: "dynamics",
      icon: Users,
      title: "Liderazgo",
    },
  ];

  const handleContinue = () => {
    if (selectedFocus) {
      onNext(selectedFocus);
    }
  };

  return (
    <div>
      <h1 className="humetrica-title mb-2 animate-slide-up">
        ¿Qué impacto querés analizar primero?
      </h1>
      
      <p className="humetrica-subtitle mb-8 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        Para simplificar el diagnóstico inicial, vamos a enfocarnos en un impacto principal.
      </p>

      <div className="space-y-3 mb-6">
        {focusOptions.map((option, index) => (
          <button
            key={option.id}
            onClick={() => setSelectedFocus(option.id)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 text-left animate-slide-up",
              selectedFocus === option.id
                ? "border-primary bg-humetrica-highlight"
                : "border-border bg-card hover:bg-humetrica-card-hover hover:border-primary/30"
            )}
            style={{ animationDelay: `${0.1 + index * 0.06}s` }}
          >
            <div 
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                selectedFocus === option.id
                  ? "bg-primary"
                  : "bg-secondary"
              )}
            >
              <option.icon 
                className={cn(
                  "w-5 h-5 transition-colors",
                  selectedFocus === option.id
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                )}
              />
            </div>
            <span className="font-medium text-foreground">{option.title}</span>
          </button>
        ))}
      </div>

      <p 
        className="humetrica-note mb-8 animate-slide-up"
        style={{ animationDelay: "0.35s" }}
      >
        Luego podrás explorar otros impactos relacionados.
      </p>

      <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Button 
          onClick={handleContinue}
          size="lg"
          disabled={!selectedFocus}
          className="w-full sm:w-auto px-8 h-12 text-base font-medium"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
