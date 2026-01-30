import React, { useState, useEffect } from 'react';
import { OnboardingLayout } from "./OnboardingLayout";
import { dilemasEquipo } from '../onboarding/dilemasEquipo';
import { Progress } from "@/components/ui/progress";

type MemberStep = "welcome" | "dilemmas" | "processing" | "results";

const TeamMemberOnboarding = () => {
  const [step, setStep] = useState<MemberStep>("welcome");
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  useEffect(() => {
    if (step === "processing") {
      const timer = setTimeout(() => {
        setStep("results");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSeleccion = (opcionId: string) => {
    const dimension = dilemasEquipo[currentDilemmaIndex].dimension;
    
    setRespuestas(prev => ({
      ...prev,
      [dimension]: opcionId
    }));

    if (currentDilemmaIndex < dilemasEquipo.length - 1) {
      setCurrentDilemmaIndex(currentDilemmaIndex + 1);
    } else {
      setStep("processing");
    }
  };

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold text-slate-900">Bienvenido a tu equipo</h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Tu líder te ha invitado a participar. Responderás 6 dilemas operativos para entender cómo colaboramos mejor.
            </p>
            <button 
              onClick={() => setStep("dilemmas")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-all mt-10"
            >
              Comenzar
            </button>
          </div>
        );

      case "dilemmas":
        const dilemaActual = dilemasEquipo[currentDilemmaIndex];
        const progreso = ((currentDilemmaIndex + 1) / dilemasEquipo.length) * 100;

        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-slate-900">Escenario {currentDilemmaIndex + 1}</h2>
                <span className="text-sm font-medium text-emerald-600">{Math.round(progreso)}%</span>
              </div>
              <Progress value={progreso} className="h-2" />
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                {dilemaActual.texto}
              </p>
              <p className="font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">
                {dilemaActual.pregunta}
              </p>
            </div>

            <div className="grid gap-3">
              {dilemaActual.opciones.map((opcion) => (
                <button 
                  key={opcion.id}
                  onClick={() => handleSeleccion(opcion.id)} 
                  className="w-full text-left p-5 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-start">
                    <span className="font-bold text-emerald-600 mr-4 group-hover:scale-110 transition-transform">
                      {opcion.id}
                    </span>
                    <p className="text-slate-700 font-medium">{opcion.texto}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "processing":
        return (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-slate-900">Analizando respuestas...</h2>
          </div>
        );

      case "results":
        return (
          <div className="max-w-4xl mx-auto p-6 animate-fade-in text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">¡Gracias por participar!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
              <div className="bg-slate-900 text-white p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4 italic">"Perfil Operativo Registrado"</h3>
                <p className="text-slate-400 text-sm">
                  Tus respuestas son anónimas y ayudarán a mejorar la dinámica del equipo.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center">
                <p className="text-emerald-800 text-sm italic">
                  "La claridad en la ejecución permite al equipo alcanzar metas extraordinarias."
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = "/"}
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Finalizar y Salir
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout 
      step={step === "welcome" ? undefined : (step === "dilemmas" ? currentDilemmaIndex + 1 : 7)} 
      totalSteps={step === "welcome" ? undefined : 7}
    >
      {renderStep()}
    </OnboardingLayout>
  );
};

export default TeamMemberOnboarding;