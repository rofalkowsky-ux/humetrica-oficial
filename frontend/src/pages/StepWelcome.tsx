import { Button } from "@/components/ui/button";

interface StepWelcomeProps {
  onNext: () => void;
}

export const StepWelcome = ({ onNext }: StepWelcomeProps) => {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="humetrica-title mb-6 animate-slide-up">
        Analicemos un primer caso de tu equipo
      </h1>
      
      <p className="text-muted-foreground leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        Partimos de tu observación como líder. El sistema identifica patrones y señales 
        que luego se contrastan con otras fuentes de información.
      </p>

      <div 
        className="humetrica-highlight-box mb-10 animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <p className="text-foreground font-medium text-center">
          "Tu percepción es un punto de partida, no un veredicto."
        </p>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.15s" }}>
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto px-8 h-12 text-base font-medium"
        >
          Empezar análisis
        </Button>
      </div>
    </div>
  );
};
