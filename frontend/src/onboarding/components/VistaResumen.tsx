// components/VistaResumen.tsx
import React from 'react';
import type { ResultadosDesalineacion, Brechas } from '../dashboardTypes';
import { dimensionesInfo } from '../dashboardTypes';
import {
  clasificarBrecha,
  obtenerColorBrecha,
  obtenerIconoBrecha,
  obtenerEtiquetaBrecha,
  formatearValor,
  obtenerPorcentajeProgreso,
} from '../dashboardUtils';

interface VistaResumenProps {
  resultados: ResultadosDesalineacion;
}

const VistaResumen: React.FC<VistaResumenProps> = ({ resultados }) => {
  const { indices, brechas, patron, accionables } = resultados;

  const obtenerColorIBO = (ibo: number): string => {
    if (ibo < 0.3) return 'bg-green-500';
    if (ibo < 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const obtenerColorRiesgo = (riesgo: string): string => {
    switch (riesgo) {
      case 'bajo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medio_alto':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'alto':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'critico':
        return 'bg-red-200 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Estado Actual */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h2>

        <div className="space-y-4">
          {/* IBO */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Índice de Brecha Operativa (IBO)
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatearValor(indices.IBO)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${obtenerColorIBO(indices.IBO)} transition-all duration-500`}
                style={{ width: `${obtenerPorcentajeProgreso(indices.IBO, 1.0)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {indices.IBO < 0.3 && 'Alineación saludable'}
              {indices.IBO >= 0.3 && indices.IBO < 0.6 && 'Desalineación moderada'}
              {indices.IBO >= 0.6 && 'Desalineación crítica'}
            </p>
          </div>

          {/* Tendencia */}
          {indices.ΔIBO !== null && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Tendencia</p>
                <p className="text-xs text-gray-500 mt-1">Cambio desde última medición</p>
              </div>
              <div className="flex items-center space-x-2">
                {indices.ΔIBO > 0.05 ? (
                  <>
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-semibold text-red-600">
                      +{formatearValor(indices.ΔIBO)}
                    </span>
                    <span className="text-sm text-red-600">Empeorando</span>
                  </>
                ) : indices.ΔIBO < -0.05 ? (
                  <>
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-lg font-semibold text-green-600">
                      {formatearValor(indices.ΔIBO)}
                    </span>
                    <span className="text-sm text-green-600">Mejorando</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                      />
                    </svg>
                    <span className="text-lg font-semibold text-gray-600">
                      {formatearValor(indices.ΔIBO)}
                    </span>
                    <span className="text-sm text-gray-600">Estable</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Cohesión Interna */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">Cohesión Interna (IFD)</p>
              <p className="text-xs text-gray-500 mt-1">
                {indices.IFD < 0.3 && 'El equipo tiene criterio compartido'}
                {indices.IFD >= 0.3 && indices.IFD < 0.5 && 'Cohesión moderada'}
                {indices.IFD >= 0.5 && 'Equipo fragmentado'}
              </p>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {formatearValor(indices.IFD)}
            </span>
          </div>
        </div>
      </div>

      {/* Patrón Identificado */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Patrón Identificado</h2>

        <div
          className={`p-4 rounded-lg border-2 ${obtenerColorRiesgo(patron.nivelRiesgo)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium text-lg mb-2">
                {patron.tipo.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              <p className="text-sm">{patron.descripcion}</p>
            </div>
            <span className="ml-4 px-3 py-1 text-xs font-semibold rounded-full bg-white">
              {patron.nivelRiesgo.toUpperCase().replace(/_/g, '-')}
            </span>
          </div>
        </div>
      </div>

      {/* Brechas por Dimensión (Vista Compacta) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Desalineación por Dimensión
        </h2>

        <div className="space-y-3">
          {(Object.entries(brechas) as [keyof Brechas, number][])
            .sort(([, a], [, b]) => b - a)
            .map(([dimension, brecha]) => {
              const info = dimensionesInfo[dimension];
              return (
                <div key={dimension} className="flex items-center space-x-4">
                  <div className="w-32">
                    <p className="text-sm font-medium text-gray-900">{info.nombre}</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          brecha < 0.3
                            ? 'bg-green-500'
                            : brecha < 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${obtenerPorcentajeProgreso(brecha, 2.0)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-semibold">
                      {obtenerIconoBrecha(brecha)} {formatearValor(brecha)}
                    </span>
                  </div>
                  <div className="w-24">
                    <span
                      className={`text-xs px-2 py-1 rounded ${obtenerColorBrecha(brecha)}`}
                    >
                      {obtenerEtiquetaBrecha(brecha)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Accionables Prioritarios */}
      {accionables.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Accionables Prioritarios
          </h2>

          <div className="space-y-4">
            {accionables.slice(0, 2).map((accionable, idx) => (
              <div
                key={idx}
                className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-gray-900">
                    {dimensionesInfo[accionable.dimensionAfectada].nombre}
                  </p>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      accionable.prioridad === 'alta'
                        ? 'bg-red-100 text-red-800'
                        : accionable.prioridad === 'media'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {accionable.prioridad.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Hipótesis:</strong> {accionable.hipotesis}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Experimento:</strong> {accionable.experimento}
                </p>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos los accionables →
          </button>
        </div>
      )}
    </div>
  );
};

export default VistaResumen;
