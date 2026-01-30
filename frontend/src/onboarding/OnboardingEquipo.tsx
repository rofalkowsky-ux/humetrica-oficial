// OnboardingEquipo.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dilemasEquipo } from './dilemasEquipo';
import { codificacionEquipo } from './codificacionEquipo';
import { calcularPerfil, guardarRespuestas } from './utils';
import type { Paso } from './types';
import { trackEvent } from '@/lib/analytics';

const OnboardingEquipo: React.FC = () => {
  const [paso, setPaso] = useState<Paso>('intro');
  const [dilemaActual, setDilemaActual] = useState<number>(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiemposPorDilema, setTiemposPorDilema] = useState<Record<number, number>>({});
  const [tiempoInicioDilema, setTiempoInicioDilema] = useState<number | null>(null);
  const [cambiosRespuesta, setCambiosRespuesta] = useState<Record<number, number>>({});
  const [mostrarAdvertencia, setMostrarAdvertencia] = useState<boolean>(false);
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

    setRespuestas(prev => ({
      ...prev,
      [dilemaId]: opcionId,
    }));

    setMostrarAdvertencia(false);
  };

  const siguiente = (): void => {
    const dilemaId = dilemasEquipo[dilemaActual].id;

    if (!respuestas[dilemaId]) {
      setMostrarAdvertencia(true);
      return;
    }

    if (tiempoInicioDilema) {
      const tiempoEnSegundos = Math.floor((Date.now() - tiempoInicioDilema) / 1000);
      setTiemposPorDilema(prev => ({
        ...prev,
        [dilemaId]: tiempoEnSegundos,
      }));
    }

    if (dilemaActual < dilemasEquipo.length - 1) {
      setDilemaActual(dilemaActual + 1);
      setMostrarAdvertencia(false);
    } else {
      setMostrarConfirmacion(true);
    }
  };

  const anterior = (): void => {
    if (dilemaActual > 0) {
      setDilemaActual(dilemaActual - 1);
      setMostrarAdvertencia(false);
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

    setTimeout(() => {
      setPaso('completo');
    }, 1500);
  };

  const cancelarFinalizacion = (): void => {
    setMostrarConfirmacion(false);
  };

  const cerrar = (): void => {
    navigate('/gracias');
  };

  // Render Intro
  if (paso === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Evaluación de Equipo
              </h1>
              <p className="text-sm text-blue-600 font-medium">
                🔒 100% ANÓNIMO
              </p>
            </div>

            <div className="text-left space-y-4 text-gray-700 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Tu líder <strong>NO verá</strong> tus respuestas individuales</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Solo verá el <strong>promedio del equipo</strong></p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">Esto <strong>NO afecta</strong> tu evaluación de desempeño</p>
              </div>
            </div>

            <div className="text-left space-y-3 text-gray-700">
              <p>Vas a ver 6 situaciones del día a día.</p>
              <p>Elegí lo que <strong>REALMENTE</strong> harías, no lo que &quot;deberías&quot; hacer.</p>
              <p className="text-sm text-gray-500">No hay respuestas correctas.</p>
            </div>

            <div className="text-sm text-gray-500">
              Tiempo estimado: 10 minutos
            </div>

            <button
              type="button"
              onClick={iniciarEvaluacion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              COMENZAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Dilemas
  if (paso === 'dilemas') {
    const dilema = dilemasEquipo[dilemaActual];
    const respuestaActual = respuestas[dilema.id];
    const progreso = ((dilemaActual + 1) / dilemasEquipo.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex space-x-1">
                {dilemasEquipo.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      idx <= dilemaActual ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {idx < dilemaActual ? '●' : idx + 1}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {dilemaActual + 1} de {dilemasEquipo.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          <div className="mb-4 flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Respuestas anónimas</span>
          </div>

          <div className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                {dilema.texto}
              </p>
            </div>

            <div className="pt-4">
              <p className="text-lg font-medium text-gray-900 mb-4">
                {dilema.pregunta}
              </p>

              <div className="space-y-3">
                {dilema.opciones.map((opcion) => (
                  <label
                    key={opcion.id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      respuestaActual === opcion.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`dilema-${dilema.id}`}
                      value={opcion.id}
                      checked={respuestaActual === opcion.id}
                      onChange={() => seleccionarOpcion(opcion.id)}
                      className="mt-1 mr-3 h-4 w-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 mr-2">
                        {opcion.id}.
                      </span>
                      <span className="text-gray-700">{opcion.texto}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {mostrarAdvertencia && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Por favor elegí una opción antes de continuar
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={anterior}
              disabled={dilemaActual === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                dilemaActual === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← ANTERIOR
            </button>

            <button
              type="button"
              onClick={siguiente}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              {dilemaActual === dilemasEquipo.length - 1 ? 'FINALIZAR' : 'SIGUIENTE →'}
            </button>
          </div>
        </div>

        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ¿Terminaste de revisar todas tus respuestas?
              </h3>
              <p className="text-gray-600 mb-6">
                Una vez que finalices, no podrás cambiarlas.
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={cancelarFinalizacion}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  REVISAR
                </button>
                <button
                  type="button"
                  onClick={confirmarFinalizacion}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  CONFIRMAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Finalizando
  if (paso === 'finalizando') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6" />
          <p className="text-gray-600">Guardando tus respuestas...</p>
        </div>
      </div>
    );
  }

  // Render Completo
  if (paso === 'completo') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            ¡Gracias!
          </h2>

          <p className="text-gray-600 mb-4">
            Tus respuestas fueron guardadas de forma anónima.
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Los resultados estarán disponibles para tu líder en el dashboard del equipo.
          </p>

          <button
            type="button"
            onClick={cerrar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            CERRAR
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OnboardingEquipo;
