// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import type { ResultadosDesalineacion } from './dashboardTypes';
import { calcularBrechas, calcularIBO, identificarPatron, generarAccionables } from './dashboardUtils';
import VistaResumen from './components/VistaResumen';
import VistaDimensiones from './components/VistaDimensiones';
import VistaEvolucion from './components/VistaEvolucion';
import VistaAccionables from './components/VistaAccionables';

type Vista = 'resumen' | 'dimensiones' | 'evolucion' | 'accionables';

const Dashboard: React.FC = () => {
  const [resultados, setResultados] = useState<ResultadosDesalineacion | null>(null);
  const [vistaActiva, setVistaActiva] = useState<Vista>('resumen');
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    cargarResultados();
  }, []);

  const cargarResultados = async (): Promise<void> => {
    try {
      const response = await fetch('/api/v1/dashboard/resultados');
      if (!response.ok) throw new Error(`API ${response.status}`);
      const data = await response.json();
      if (!data?.perfilLider || !data?.perfilEquipo) throw new Error('Datos incompletos');

      const brechas = calcularBrechas(data.perfilLider, data.perfilEquipo);
      const IBO = calcularIBO(brechas);
      const patron = identificarPatron(IBO, data.ΔIBO ?? null, data.IFD ?? 0);
      const accionables = generarAccionables(brechas, data.perfilLider, data.perfilEquipo);

      setResultados({
        ...data,
        brechas,
        indices: {
          IBO,
          IFD: data.IFD ?? 0,
          ΔIBO: data.ΔIBO ?? null,
        },
        patron,
        accionables,
      });
    } catch (error) {
      console.error('Error cargando resultados:', error);
      cargarDatosEjemplo();
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosEjemplo = (): void => {
    const perfilLider = { D1: 0.4, D2: 0.63, D3: 0.43, D4: 0.23, D5: 0.03, D6: 0.67 };
    const perfilEquipo = { D1: -0.33, D2: 0.43, D3: -0.29, D4: -0.23, D5: 0.36, D6: 0.38 };

    const brechas = calcularBrechas(perfilLider, perfilEquipo);
    const IBO = calcularIBO(brechas);
    const patron = identificarPatron(IBO, 0.08, 0.2);
    const accionables = generarAccionables(brechas, perfilLider, perfilEquipo);

    setResultados({
      fecha: new Date().toISOString(),
      equipoId: 'eq-001',
      equipoNombre: 'Equipo de Desarrollo',
      perfilLider,
      perfilEquipo,
      brechas,
      indices: { IBO, IFD: 0.2, ΔIBO: 0.08 },
      patron,
      accionables,
      historico: [
        { fecha: '2026-01-01', IBO: 0.38, brechas },
        { fecha: '2026-01-15', IBO: 0.42, brechas },
        { fecha: '2026-01-30', IBO: 0.46, brechas },
      ],
    });
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!resultados) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No hay resultados disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard de Desalineación
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {resultados.equipoNombre}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Última medición</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(resultados.fecha).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(
              [
                { id: 'resumen' as Vista, label: 'Resumen' },
                { id: 'dimensiones' as Vista, label: 'Dimensiones' },
                { id: 'evolucion' as Vista, label: 'Evolución' },
                { id: 'accionables' as Vista, label: 'Accionables' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setVistaActiva(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  vistaActiva === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vistaActiva === 'resumen' && <VistaResumen resultados={resultados} />}
        {vistaActiva === 'dimensiones' && <VistaDimensiones resultados={resultados} />}
        {vistaActiva === 'evolucion' && <VistaEvolucion resultados={resultados} />}
        {vistaActiva === 'accionables' && <VistaAccionables resultados={resultados} />}
      </main>
    </div>
  );
};

export default Dashboard;
