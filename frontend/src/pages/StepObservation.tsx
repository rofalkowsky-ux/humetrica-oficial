import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StepObservationProps {
  caseName: string;
  onComplete: (response: string) => void;
}

export const StepObservation = ({ caseName, onComplete }: StepObservationProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const options = [
    {
      id: "systematic",
      label: "De forma sistemática y ordenada",
      description: "Sigue pasos claros, prioriza y organiza antes de actuar.",
    },
    {
      id: "reactive",
      label: "Reaccionando a lo que surge",
      description: "Responde a demandas inmediatas, sin un orden fijo.",
    },
    {
      id: "delegative",
      label: "Delegando cuando es posible",
      description: "Busca apoyo del equipo y distribuye responsabilidades.",
    },
    {
      id: "intensive",
      label: "Con esfuerzo intensivo puntual",
      description: "Concentra energía en momentos clave, luego reduce ritmo.",
    },
  ];

  const handleNext = () => {
    if (selectedOption) {
      onComplete(selectedOption);
    }
  };

  return (
    <div>
      <h1 className="humetrica-title mb-2 animate-slide-up">
        Observemos comportamientos habituales
      </h1>
      
      <div 
        className="bg-humetrica-surface border border-humetrica-border-subtle rounded-lg p-4 mb-8 animate-slide-up"
        style={{ animationDelay: "0.05s" }}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pensá en situaciones reales del trabajo cotidiano.
          <br />
          No en cómo debería actuar, sino en <span className="text-foreground font-medium">cómo suele hacerlo</span>.
        </p>
      </div>

      <div className="mb-8">
        <h2 
          className="humetrica-label mb-4 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          ¿Cómo resuelve {caseName} las tareas?
        </h2>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              className={cn(
                "w-full flex flex-col items-start p-4 rounded-lg border transition-all duration-200 text-left animate-slide-up",
                selectedOption === option.id
                  ? "border-primary bg-humetrica-highlight"
                  : "border-border bg-card hover:bg-humetrica-card-hover hover:border-primary/30"
              )}
              style={{ animationDelay: `${0.15 + index * 0.06}s` }}
            >
              <div className="flex items-center gap-3 w-full">
                <div 
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    selectedOption === option.id
                      ? "border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {selectedOption === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="font-medium text-foreground">{option.label}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2 ml-8">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
        <Button 
          onClick={handleNext}
          size="lg"
          disabled={!selectedOption}
          className="w-full sm:w-auto px-8 h-12 text-base font-medium"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
