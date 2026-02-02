import {
    obtenerColorBrecha,
    obtenerIconoBrecha,
    obtenerEtiquetaBrecha,
  } from "@/onboarding/dashboardUtils";
  import type { Perfil } from "@/onboarding/types";
  import type { Brechas } from "@/onboarding/dashboardTypes";
  import { dimensionesInfo } from "@/onboarding/dashboardTypes";
  
  interface DetalladoPorDimensionProps {
    perfilLider: Perfil | null;
    perfilEquipo: Perfil | null;
    brechas: Brechas;
  }
  
  export const DetalladoPorDimension = ({
    perfilLider,
    perfilEquipo,
    brechas,
  }: DetalladoPorDimensionProps) => {
    return (
      <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Detallada por Dimensión</h3>
        {perfilLider && perfilEquipo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(dimensionesInfo) as (keyof Perfil)[]).map((dim) => {
              const info = dimensionesInfo[dim];
              const brecha = brechas[dim];
              const clase = obtenerColorBrecha(brecha);
              const icono = obtenerIconoBrecha(brecha);
              const etiqueta = obtenerEtiquetaBrecha(brecha);
              return (
                <div key={dim} className={`border rounded-xl p-4 ${clase}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{info.nombre}</span>
                    <span title={etiqueta}>{icono}</span>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{info.descripcion}</p>
                  <p className="text-xs mb-1">
                    {info.poloNegativo} ↔ {info.poloPositivo}
                  </p>
                  <p className="text-xs font-medium">
                    Brecha: {brecha.toFixed(2)} ({etiqueta})
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Cargá los datos del líder y del equipo para ver el detalle por dimensión.
          </p>
        )}
      </div>
    );
  };