// VistaAccionables.tsx – Accionables sugeridos
import React from 'react';
import type { ResultadosDesalineacion } from '../dashboardTypes';

interface VistaAccionablesProps {
  resultados: ResultadosDesalineacion;
}

const VistaAccionables: React.FC<VistaAccionablesProps> = ({ resultados }) => {
  const { accionables } = resultados;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Accionables sugeridos</h2>
        {accionables.length > 0 ? (
          <div className="space-y-6">
            {accionables.map((acc, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase text-blue-600">
                    {acc.dimensionAfectada} · Prioridad {acc.prioridad}
                  </span>
                </div>
                <p className="font-medium text-gray-900 mb-2">{acc.hipotesis}</p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Experimento:</strong> {acc.experimento}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Métrica de éxito:</strong> {acc.metricaExito}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            No hay accionables críticos en esta medición. Las brechas están por debajo del umbral (0.6) en las dimensiones evaluadas.
          </p>
        )}
      </div>
    </div>
  );
};

export default VistaAccionables;
