// OnboardingEquipo.tsx – Mismo estilo que líder: OnboardingLayout, tokens de diseño. Inicio propio (intro equipo) y cierre con Gracias → /gracias
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '@/pages/OnboardingLayout';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Check } from 'lucide-react';
import { dilemasEquipo } from './dilemasEquipo';
import { codificacionEquipo } from './codificacionEquipo';
import { calcularPerfil, guardarRespuestas } from './utils';
import type { Paso } from './types';
import { trackEvent } from '@/lib/analytics';

const OnboardingEquipo: React.FC = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState<Paso>('intro');
  const [dilemaActual, setDilemaActual] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiemposPorDilema, setTiemposPorDilema] = useState<Record<number, number>>({});
  const [tiempoInicioDilema, setTiempoInicioDilema] = useState<number | null>(null);
  const [cambiosRespuesta, setCambiosRespuesta] = useState<Record<number, number>>({});
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState<boolean>(false);

  useEffect(() => {
    if (paso === 'dilemas') {
      setTiempoInicioDilema(Date.now());
    }
  }, [dilemaActual, paso]);

  const iniciarEvaluacion = (): void => {
    trackEvent('onboarding_iniciado', { tipo: 'equipo' });
    setPaso('dilemas');
  };

  const seleccionarOpcion = (opcionId: string): void => {
    const dilemaId = dilemasEquipo[dilemaActual].id;
    if (respuestas[dilemaId]) {
      setCambiosRespuesta(prev => ({
        ...prev,
        [dilemaId]: (prev[dilemaId] || 0) + 1,
      }));
    }
    setRespuestas(prev => ({ ...prev, [dilemaId]: opcionId }));

    if (tiempoInicioDilema) {
      const tiempoEnSegundos = Math.floor((Date.now() - tiempoInicioDilema) / 1000);
      setTiemposPorDilema(prev => ({ ...prev, [dilemaId]: tiempoEnSegundos }));
    }

    if (dilemaActual < dilemasEquipo.length - 1) {
      setDilemaActual(dilemaActual + 1);
    } else {
      setMostrarConfirmacion(true);
    }
  };

  const confirmarFinalizacion = async (): Promise<void> => {
    setMostrarConfirmacion(false);
    setPaso('finalizando');

    const respuestasArray = Object.entries(respuestas).map(([dilemaId, opcionId]) => ({
      dilemaId: parseInt(dilemaId, 10),
      opcionId,
      tiempo: tiemposPorDilema[parseInt(dilemaId, 10)] || 0,
      cambios: cambiosRespuesta[parseInt(dilemaId, 10)] || 0,
    }));

    const metadata = {
      tipo: 'equipo' as const,
      fechaCompleto: new Date().toISOString(),
      tiempoTotal: Object.values(tiemposPorDilema).reduce((a, b) => a + b, 0),
    };

    const perfil = calcularPerfil(respuestasArray, codificacionEquipo);

    try {
      await guardarRespuestas(respuestasArray, { ...metadata, perfil });
    } catch (e) {
      console.error('Error al guardar respuestas:', e);
    }

    setTimeout(() => navigate('/gracias'), 1500);
  };

  const cancelarFinalizacion = (): void => setMostrarConfirmacion(false);

  const totalSteps = 8;
  const stepNumber =
    paso === 'intro' ? 1
    : paso === 'dilemas' ? 2 + dilemaActual
    : paso === 'finalizando' ? 8
    : 1;

  const renderStep = () => {
    // Intro: bienvenida equipo (inicio propio, anónimo)
    if (paso === 'intro') {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="humetrica-title mb-2">Evaluación de Equipo</h1>
            <p className="text-sm font-medium text-primary">100% ANÓNIMO</p>
          </div>

          <div className="text-left space-y-4 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">Tu líder <strong>NO verá</strong> tus respuestas individuales</p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">Solo verá el <strong>promedio del equipo</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">Esto <strong>NO afecta</strong> tu evaluación de desempeño</p>
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            Vas a ver <strong>6 situaciones</strong> del día a día. Elegí lo que <strong>REALMENTE</strong> harías, no lo que &quot;deberías&quot; hacer.
          </p>
          <p className="text-muted-foreground text-sm">No hay respuestas correctas. Tiempo estimado: 10 minutos.</p>

          <Button onClick={iniciarEvaluacion} size="lg" className="mt-4 px-8 py-4 text-lg font-medium">
            Comenzar
          </Button>
        </div>
      );
    }

    // Dilemas (mismo estilo visual que líder: Progress, card, primary)
    if (paso === 'dilemas') {
      const dilema = dilemasEquipo[dilemaActual];
      const respuestaActual = respuestas[dilema.id];
      const progreso = ((dilemaActual + 1) / dilemasEquipo.length) * 100;

      return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-2xl font-bold text-foreground">Escenario {dilemaActual + 1}</h2>
              <span className="text-sm font-medium text-primary">{Math.round(progreso)}%</span>
            </div>
            <Progress value={progreso} className="h-2" />
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Respuestas anónimas
          </p>

          <div className="bg-card p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
              {dilema.texto}
            </p>
            <p className="font-bold text-foreground border-l-4 border-primary pl-4">
              {dilema.pregunta}
            </p>
          </div>

          <div className="grid gap-3">
            {dilema.opciones.map((opcion) => (
              <label
                key={opcion.id}
                className={`flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all ${
                  respuestaActual === opcion.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name={`dilema-${dilema.id}`}
                  value={opcion.id}
                  checked={respuestaActual === opcion.id}
                  onChange={() => seleccionarOpcion(opcion.id)}
                  className="mt-1 mr-4 h-4 w-4 text-primary accent-primary"
                />
                <div className="flex-1">
                  <span className="font-bold text-primary mr-2">{opcion.id}.</span>
                  <span className="text-foreground">{opcion.texto}</span>
                </div>
              </label>
            ))}
          </div>

        </div>
      );
    }

    // Finalizando: spinner y luego redirige a /gracias (una sola pantalla de gracias)
    if (paso === 'finalizando') {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-foreground">Guardando tus respuestas...</h2>
          <p className="text-muted-foreground mt-2">Tus respuestas se envían de forma anónima</p>
        </div>
      );
    }

    return null;
  };

  return (
    <OnboardingLayout step={stepNumber} totalSteps={totalSteps}>
      {renderStep()}

      {/* Modal confirmación (estilo design system) */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              ¿Terminaste de revisar todas tus respuestas?
            </h3>
            <p className="text-muted-foreground mb-6">
              Una vez que finalices, no podrás cambiarlas.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={cancelarFinalizacion} className="flex-1">
                Revisar
              </Button>
              <Button onClick={confirmarFinalizacion} className="flex-1">
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default OnboardingEquipo;
