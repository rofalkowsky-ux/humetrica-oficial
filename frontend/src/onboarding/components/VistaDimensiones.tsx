// VistaDimensiones.tsx – Detallada por dimensión (brechas + dimensionesInfo)
import React from 'react';
import type { ResultadosDesalineacion } from '../dashboardTypes';
import { dimensionesInfo } from '../dashboardTypes';
import { obtenerColorBrecha, obtenerIconoBrecha, obtenerEtiquetaBrecha } from '../dashboardUtils';
import type { Perfil } from '../types';

interface VistaDimensionesProps {
  resultados: ResultadosDesalineacion;
}

const DIM_KEYS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;

const VistaDimensiones: React.FC<VistaDimensionesProps> = ({ resultados }) => {
  const { brechas, perfilLider, perfilEquipo } = resultados;

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Detallada por dimensión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIM_KEYS.map((dim) => {
            const info = dimensionesInfo[dim];
            const brecha = brechas[dim];
            const clase = obtenerColorBrecha(brecha);
            const icono = obtenerIconoBrecha(brecha);
            const etiqueta = obtenerEtiquetaBrecha(brecha);
            const valorLider = perfilLider[dim];
            const valorEquipo = perfilEquipo[dim];
            return (
              <div key={dim} className={`border rounded-xl p-4 ${clase}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">{info.nombre}</span>
                  <span title={etiqueta}>{icono}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{info.descripcion}</p>
                <p className="text-xs text-gray-600 mb-1">
                  {info.poloNegativo} ↔ {info.poloPositivo}
                </p>
                <p className="text-xs font-medium mb-1">
                  Brecha: {brecha.toFixed(2)} ({etiqueta})
                </p>
                <p className="text-xs opacity-80">
                  Líder: {valorLider.toFixed(2)} · Equipo: {valorEquipo.toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VistaDimensiones;
