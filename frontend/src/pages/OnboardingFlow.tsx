import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { StepWelcome } from "./StepWelcome";
import { StepAddCase } from "./StepAddCase";
import { StepSelectFocus } from "./StepSelectFocus";
import { StepObservation } from "./StepObservation";

type OnboardingStep = "welcome" | "add-case" | "select-focus" | "observation" | "complete";

interface CaseData {
  name: string;
  role: string;
}

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [currentCaseData, setCurrentCaseData] = useState<CaseData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);

  const getStepNumber = () => {
    switch (currentStep) {
      case "add-case":
        return 1;
      case "select-focus":
        return 2;
      case "observation":
        return 3;
      default:
        return undefined;
    }
  };

  const getTotalSteps = () => {
    if (["add-case", "select-focus", "observation"].includes(currentStep)) {
      return 3;
    }
    return undefined;
  };

  const handleNewCase = (data: { name: string; role: string }) => {
    setCurrentCaseData(data);
    setCurrentStep("select-focus");
  };

  const handleCompleteObservation = () => {
    setCurrentStep("complete");
    // Navegar al Dashboard de métricas después de 2 segundos
    setTimeout(() => {
      navigate("/metricas");
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "welcome":
        return <StepWelcome onNext={() => setCurrentStep("add-case")} />;
      
      case "add-case":
        return <StepAddCase onNext={handleNewCase} />;
      
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
            caseName={currentCaseData?.name || "esta persona"}
            onComplete={handleCompleteObservation}
          />
        );
      
      case "complete":
        return (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Observación completada
            </h2>
            <p className="text-muted-foreground">
              Gracias por completar el análisis de {currentCaseData?.name}.
            </p>
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
