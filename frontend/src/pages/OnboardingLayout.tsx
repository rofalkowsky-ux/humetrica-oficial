import type { ReactNode } from "react";
import { HumetricaLogo } from "@/components/HumetricaLogo";

interface OnboardingLayoutProps {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
}

export const OnboardingLayout = ({ children, step, totalSteps }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-humetrica-border-subtle py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HumetricaLogo variant="light" size="sm" />
          </div>
          
          {step && totalSteps && (
            <div className="flex items-center gap-3">
              <span className="humetrica-caption">
                Paso {step} de {totalSteps}
              </span>
              <div className="w-24 humetrica-progress-bar">
                <div 
                  className="humetrica-progress-fill"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-2xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
