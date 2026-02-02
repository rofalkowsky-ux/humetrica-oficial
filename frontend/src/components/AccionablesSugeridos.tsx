import type { Perfil } from "@/onboarding/types";
import type { Accionable } from "@/onboarding/dashboardTypes";

interface AccionablesSugeridosProps {
  perfilLider: Perfil | null;
  perfilEquipo: Perfil | null;
  accionables: Accionable[];
}

export const AccionablesSugeridos = ({
  perfilLider,
  perfilEquipo,
  accionables,
}: AccionablesSugeridosProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Accionables Sugeridos</h3>
      {perfilLider && perfilEquipo ? (
        accionables.length > 0 ? (
          <div className="space-y-6">
            {accionables.map((acc, i) => (
              <div key={i} className="border border-border rounded-xl p-6 bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase text-primary">
                    {acc.dimensionAfectada} · Prioridad {acc.prioridad}
                  </span>
                </div>
                <p className="font-medium text-foreground mb-2">{acc.hipotesis}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Experimento:</strong> {acc.experimento}
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Métrica de éxito:</strong> {acc.metricaExito}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No hay accionables críticos en esta medición. Las brechas están por debajo del umbral
            (0.6) en las dimensiones evaluadas.
          </p>
        )
      ) : (
        <p className="text-muted-foreground">
          Cargá los datos del líder y del equipo para ver accionables sugeridos.
        </p>
      )}
    </div>
  );
};