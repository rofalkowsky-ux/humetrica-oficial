import React, { useState, useEffect } from 'react';
import { OnboardingLayout } from "./OnboardingLayout";

type MemberStep = "welcome" | "dilemma-1" | "processing" | "results";

export const MemberOnboarding = () => {
  const [step, setStep] = useState<MemberStep>("welcome");

  // Efecto para pasar de "Procesando" a "Resultados" automáticamente
  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => {
        setStep("results");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-900">Bienvenido a tu equipo</h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Tu líder te ha invitado a participar. Responderás dilemas para entender cómo colaboramos mejor.
            </p>
            <button 
              onClick={() => setStep("dilemma-1")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-all mt-10"
            >
              Comenzar
            </button>
          </div>
        );

      case "dilemma-1":
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900">Dilema Operativo</h2>
              <p className="text-slate-500 mt-2">¿Cómo reaccionas ante un cambio inesperado en una entrega?</p>
            </div>
            <div className="grid gap-4">
              <button onClick={() => setStep("processing")} className="w-full text-left p-6 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                <h3 className="font-bold text-slate-900">Ajusto mi plan actual</h3>
                <p className="text-slate-500 text-sm">Priorizo la estructura y reorganizo mis tiempos.</p>
              </button>
              <button onClick={() => setStep("processing")} className="w-full text-left p-6 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                <h3 className="font-bold text-slate-900">Resuelvo sobre la marcha</h3>
                <p className="text-slate-500 text-sm">Atiendo la urgencia primero sin detenerme.</p>
              </button>
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-slate-900">Analizando tu perfil...</h2>
          </div>
        );

      case "results":
        return (
          <div className="max-w-4xl mx-auto p-6 animate-fade-in text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Tu Perfil de Interacción</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Tu Enfoque</p>
                <h3 className="text-xl font-bold mb-4 italic">"Sistemático y Ordenado"</h3>
                <p className="text-slate-400 text-sm">
                  Priorizas la estructura antes de actuar. Esto ayuda al equipo a mantener la calma en momentos de urgencia.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-emerald-900 mb-2 font-bold">Feedback</h3>
                <p className="text-emerald-800 text-sm italic">
                  "Tu capacidad de organización es el ancla del equipo para traducir metas en métricas claras."
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = "/"}
              className="mt-10 bg-slate-900 text-white px-8 py-3 rounded-lg font-medium"
            >
              Finalizar
            </button>
          </div>
        );
    }
  };

  return (
    <OnboardingLayout 
      step={step === "welcome" ? undefined : 1} 
      totalSteps={step === "welcome" ? undefined : 3}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};