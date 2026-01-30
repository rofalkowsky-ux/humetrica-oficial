import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { StepWelcome } from "./StepWelcome";
// StepAddCase eliminado para simplificar el flujo inicial
import { StepSelectFocus } from "./StepSelectFocus";
import { StepObservation } from "./StepObservation";

type OnboardingStep = "welcome" | "select-focus" | "observation" | "complete";

export const LeaderOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const getStepNumber = () => {
    switch (currentStep) {
      case "select-focus":
        return 1;
      case "observation":
        return 2;
      default:
        return undefined;
    }
  };

  const getTotalSteps = () => {
    if (["select-focus", "observation"].includes(currentStep)) {
      return 2;
    }
    return undefined;
  };

  const handleCompleteObservation = () => {
    setCurrentStep("complete");
    // Redirección al Dashboard interno tras el procesamiento
    setTimeout(() => {
      navigate("/data-metrics-internal");
    }, 6000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        // Salto directo a la selección de foco
        return <StepWelcome onNext={() => setCurrentStep("select-focus")} />;
      
      case "select-focus":
        return (
          <StepSelectFocus 
            onNext={(focus) => {
              setSelectedFocus(focus);
              setCurrentStep("observation");
            }} 
          />
        );
      
      case "observation":
        return (
          <StepObservation 
            caseName="tu equipo"
            onComplete={handleCompleteObservation}
          />
        );
      
      case "complete":
        return (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Procesando la información
            </h2>
            <p className="text-muted-foreground">
              Estamos analizando los datos de tu observación...
            </p>
            <div className="mt-6 flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout step={getStepNumber()} totalSteps={getTotalSteps()}>
      {renderStep()}
    </OnboardingLayout>
  );
};