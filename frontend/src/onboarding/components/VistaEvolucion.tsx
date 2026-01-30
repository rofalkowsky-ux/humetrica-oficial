// VistaEvolucion.tsx – Comparación temporal (histórico IBO)
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ResultadosDesalineacion } from '../dashboardTypes';

interface VistaEvolucionProps {
  resultados: ResultadosDesalineacion;
}

const VistaEvolucion: React.FC<VistaEvolucionProps> = ({ resultados }) => {
  const { indices, historico } = resultados;
  const datos = historico?.length
    ? historico.map((h) => ({
        fecha: new Date(h.fecha).toLocaleDateString('es-AR', { month: 'short', day: 'numeric', year: '2-digit' }),
        IBO: Math.round(h.IBO * 100),
      }))
    : [
        {
          fecha: new Date(resultados.fecha).toLocaleDateString('es-AR', { month: 'short', day: 'numeric', year: '2-digit' }),
          IBO: Math.round(indices.IBO * 100),
        },
      ];

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Evolución (IBO en el tiempo)</h2>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datos} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'IBO']} />
              <Line type="monotone" dataKey="IBO" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="IBO (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          IBO actual: <strong>{(indices.IBO * 100).toFixed(0)}%</strong>
          {indices.ΔIBO != null && (
            <> · ΔIBO: {indices.ΔIBO >= 0 ? '+' : ''}{(indices.ΔIBO * 100).toFixed(0)}%</>
          )}
        </p>
      </div>
    </div>
  );
};

export default VistaEvolucion;
