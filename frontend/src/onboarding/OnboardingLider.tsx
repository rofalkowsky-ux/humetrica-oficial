// OnboardingLider.tsx – Flujo: StepWelcome → StepSelectFocus → Encuadre → Dilemas → Completo
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/pages/OnboardingLayout';
import { StepWelcome } from '@/pages/StepWelcome';
import { StepSelectFocus } from '@/pages/StepSelectFocus';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { dilemas } from './dilemas';
import { codificacion } from './codificacion';
import { calcularPerfil, guardarRespuestas } from './utils';
import { trackEvent } from '@/lib/analytics';

/** step 0: StepWelcome | 1: StepSelectFocus | 2: Encuadre | 3: Dilemas (test) | 4: finalizando | 5: completo */
const OnboardingLider: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dilemaActual, setDilemaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiemposPorDilema, setTiemposPorDilema] = useState<Record<number, number>>({});
  const [tiempoInicioDilema, setTiempoInicioDilema] = useState<number | null>(null);
  const [cambiosRespuesta, setCambiosRespuesta] = useState<Record<number, number>>({});
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    if (step === 3) {
      setTiempoInicioDilema(Date.now());
    }
  }, [dilemaActual, step]);

  useEffect(() => {
    if (step !== 4) return;

    const run = async () => {
      const respuestasArray = Object.entries(respuestas).map(([dilemaId, opcionId]) => ({
        dilemaId: parseInt(dilemaId, 10),
        opcionId,
        tiempo: tiemposPorDilema[parseInt(dilemaId, 10)] ?? 0,
        cambios: cambiosRespuesta[parseInt(dilemaId, 10)] ?? 0,
      }));

      const metadata = {
        tipo: 'lider' as const,
        fechaCompleto: new Date().toISOString(),
        tiempoTotal: Object.values(tiemposPorDilema).reduce((a, b) => a + b, 0),
      };

      const perfil = calcularPerfil(respuestasArray, codificacion);
      try {
        await guardarRespuestas(respuestasArray, { ...metadata, perfil });
        setErrorGuardado(false);
      } catch {
        setErrorGuardado(true);
      }
      setStep(5);
    };

    run();
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al entrar en step 4

  const handleSeleccion = (opcionId: string) => {
    const dilemaId = dilemas[dilemaActual].id;

    if (respuestas[dilemaId]) {
      setCambiosRespuesta(prev => ({
        ...prev,
        [dilemaId]: (prev[dilemaId] ?? 0) + 1,
      }));
    }

    setRespuestas(prev => ({ ...prev, [dilemaId]: opcionId }));

    if (tiempoInicioDilema) {
      const tiempoEnSegundos = Math.floor((Date.now() - tiempoInicioDilema) / 1000);
      setTiemposPorDilema(prev => ({ ...prev, [dilemaId]: tiempoEnSegundos }));
    }

    if (dilemaActual < dilemas.length - 1) {
      setDilemaActual(dilemaActual + 1);
    } else {
      setStep(4);
    }
  };

  const irAlDashboard = () => navigate('/dashboard');

  const iniciarDilemas = () => {
    trackEvent('onboarding_iniciado');
    setStep(3);
  };

  const renderStep = () => {
    // Step 0: Bienvenida
    if (step === 0) {
      return <StepWelcome onNext={() => setStep(1)} />;
    }

    // Step 1: Selección de foco (Desalineación Operativa)
    if (step === 1) {
      return <StepSelectFocus onNext={() => setStep(2)} />;
    }

    // Step 2: Encuadre – instrucciones técnicas de los dilemas
    if (step === 2) {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-slate-900">Instrucciones del test</h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            Vas a ver <strong>6 situaciones de liderazgo</strong>. Elegí lo que <strong>REALMENTE</strong> harías, no lo que &quot;deberías&quot; hacer. No hay respuestas correctas ni incorrectas.
          </p>
          <p className="text-slate-500">
            Cada escenario tiene varias opciones. Seleccioná la que mejor refleje tu criterio decisional.
          </p>
          <Button
            onClick={iniciarDilemas}
            size="lg"
            className="mt-6 px-8 py-4 text-lg font-medium"
          >
            Comenzar test
          </Button>
        </div>
      );
    }

    // Step 3: Dilemas (test)
    if (step === 3) {
      const dilema = dilemas[dilemaActual];
      const progreso = ((dilemaActual + 1) / dilemas.length) * 100;

      return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-slate-900">Escenario {dilemaActual + 1}</h2>
              <span className="text-sm font-medium text-emerald-600">{Math.round(progreso)}%</span>
            </div>
            <Progress value={progreso} className="h-2" />
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
              {dilema.texto}
            </p>
            <p className="font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">
              {dilema.pregunta}
            </p>
          </div>

          <div className="grid gap-3">
            {dilema.opciones.map((opcion) => (
              <button
                key={opcion.id}
                type="button"
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
    }

    // Step 4: Finalizando
    if (step === 4) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-slate-900">Analizando respuestas...</h2>
        </div>
      );
    }

    // Step 5: Completo
    if (step === 5) {
      return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in text-center">
          {errorGuardado && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xl text-left">
              Error al guardar en BD. Revisa la consola del navegador y que la tabla <code className="bg-red-200 px-1">respuestas_evaluacion</code> exista en Supabase (SQL Editor).
            </div>
          )}
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Evaluación completa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
            <div className="bg-slate-900 text-white p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 italic">&quot;Perfil de Liderazgo Registrado&quot;</h3>
              <p className="text-slate-400 text-sm">
                Tus resultados están disponibles en el dashboard.
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center">
              <p className="text-emerald-800 text-sm italic">
                &quot;La claridad en la ejecución permite al equipo alcanzar metas extraordinarias.&quot;
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={irAlDashboard}
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      );
    }

    return null;
  };

  const totalSteps = 9;
  const stepNumber =
    step === 0 ? 1
    : step === 1 ? 2
    : step === 2 ? 3
    : step === 3 ? 4 + dilemaActual
    : step === 4 || step === 5 ? 9
    : 1;

  return (
    <OnboardingLayout step={stepNumber} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingLider;
