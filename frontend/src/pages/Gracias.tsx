import { Link } from 'react-router-dom';

export const Gracias = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-4">Gracias por participar</h1>
        <p className="text-slate-600 mb-8">
          Tu evaluación fue registrada. Podés cerrar esta pestaña o volver al inicio.
        </p>
        <Link
          to="/"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors text-center"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};
