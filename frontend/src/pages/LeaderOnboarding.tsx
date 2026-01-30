import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dilemas as dilemasLider } from '../onboarding/dilemas';
import { Progress } from "@/components/ui/progress";
import { OnboardingLayout } from "./OnboardingLayout";

export const LeaderOnboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleSeleccion = (opcionId: string) => {
    const dimension = dilemasLider[currentIndex].dimension;
    
    // Guardar respuesta
    setRespuestas(prev => ({
      ...prev,
      [dimension]: opcionId
    }));

    // Pase automático
    if (currentIndex < dilemasLider.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finalizar y guardar
      console.log("Respuestas Líder:", respuestas);
      navigate('/data-metrics-internal');
    }
  };

  const dilemaActual = dilemasLider[currentIndex];
  const progreso = ((currentIndex + 1) / dilemasLider.length) * 100;

  return (
    <OnboardingLayout step={currentIndex + 1} totalSteps={dilemasLider.length}>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-bold text-slate-900">Dilema del Líder {currentIndex + 1}</h2>
            <span className="text-sm font-medium text-indigo-600">{Math.round(progreso)}%</span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
            {dilemaActual.texto}
          </p>
          <p className="font-bold text-slate-900 border-l-4 border-indigo-500 pl-4">
            {dilemaActual.pregunta}
          </p>
        </div>

        <div className="grid gap-3">
          {dilemaActual.opciones.map((opcion) => (
            <button 
              key={opcion.id}
              onClick={() => handleSeleccion(opcion.id)} 
              className="w-full text-left p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <div className="flex items-start">
                <span className="font-bold text-indigo-600 mr-4 group-hover:scale-110 transition-transform">
                  {opcion.id}
                </span>
                <p className="text-slate-700 font-medium">{opcion.texto}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </OnboardingLayout>
  );
};