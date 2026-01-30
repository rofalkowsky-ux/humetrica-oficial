// OnboardingLider.tsx – Misma UX que TeamMemberOnboarding; al final redirige al Dashboard
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingLayout } from '@/pages/OnboardingLayout';
import { Progress } from '@/components/ui/progress';
import { dilemas } from './dilemas';
import { codificacion } from './codificacion';
import { calcularPerfil, guardarRespuestas } from './utils';
import { trackEvent } from '@/lib/analytics';

type Step = 'intro' | 'dilemas' | 'finalizando' | 'completo';

const OnboardingLider: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paso, setPaso] = useState<Step>('intro');
  const [dilemaActual, setDilemaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiemposPorDilema, setTiemposPorDilema] = useState<Record<number, number>>({});
  const [tiempoInicioDilema, setTiempoInicioDilema] = useState<number | null>(null);
  const [cambiosRespuesta, setCambiosRespuesta] = useState<Record<number, number>>({});
  const [errorGuardado, setErrorGuardado] = useState(false);

  useEffect(() => {
    if (paso === 'dilemas') {
      setTiempoInicioDilema(Date.now());
    }
  }, [dilemaActual, paso]);

  useEffect(() => {
    if (paso !== 'finalizando') return;

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
      setPaso('completo');
    };

    run();
  }, [paso]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al entrar en finalizando

  const iniciarEvaluacion = () => {
    trackEvent('onboarding_iniciado');
    setPaso('dilemas');
  };

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
      setPaso('finalizando');
    }
  };

  const irAlDashboard = () => navigate('/dashboard');

  const renderStep = () => {
    if (paso === 'intro') {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-900">Evaluación de Criterio Decisional</h2>
          <p className="text-xl text-slate-500 leading-relaxed">
            Vas a ver 6 situaciones de liderazgo. Elegí lo que <strong>REALMENTE</strong> harías, no lo que &quot;deberías&quot; hacer. No hay respuestas correctas.
          </p>
          <button
            onClick={iniciarEvaluacion}
            className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-all mt-10"
          >
            Comenzar
          </button>
        </div>
      );
    }

    if (paso === 'dilemas') {
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

    if (paso === 'finalizando') {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-slate-900">Analizando respuestas...</h2>
        </div>
      );
    }

    if (paso === 'completo') {
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

  const stepNumber = paso === 'intro' ? undefined : paso === 'dilemas' ? dilemaActual + 1 : paso === 'finalizando' ? 7 : 7;
  const totalSteps = paso === 'intro' ? undefined : 7;

  return (
    <OnboardingLayout step={stepNumber} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
  );
};

export default OnboardingLider;
