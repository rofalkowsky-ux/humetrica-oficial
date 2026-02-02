import { GitCompare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { Perfil } from "@/onboarding/types";

interface ResumenEjecutivoProps {
  radarData: Array<{ name: string; valor: number; equipo: number }>;
  tieneEquipo: boolean;
  perfilLider: Perfil | null;
  insightCategoria: string | null;
}

export const ResumenEjecutivo = ({
  radarData,
  tieneEquipo,
  perfilLider,
  insightCategoria,
}: ResumenEjecutivoProps) => {
  return (
    <>
      <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <GitCompare size={24} /> Análisis de Desalineación Operativa
          </h3>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase">
            Diagnóstico Inicial
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-[350px] w-full bg-white rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} />
                <Radar
                  name="Líder"
                  dataKey="valor"
                  stroke="#00A381"
                  fill="#00A381"
                  fillOpacity={0.5}
                  strokeWidth={2}
                />
                {tieneEquipo && (
                  <Radar
                    name="Equipo (promedio)"
                    dataKey="equipo"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="6 4"
                  />
                )}
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            {!tieneEquipo && perfilLider != null && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Esperando datos del equipo
              </p>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl shadow-sm">
              <h4 className="text-sm font-bold text-primary mb-2 uppercase">Insight</h4>
              <p className="text-foreground/80 leading-relaxed text-base">
                {insightCategoria ? (
                  <>
                    Brecha detectada en <strong>{insightCategoria}</strong>. El líder y el equipo
                    perciben la toma de decisiones de forma distinta.
                  </>
                ) : tieneEquipo ? (
                  "Los perfiles del líder y del equipo están alineados en las dimensiones evaluadas."
                ) : (
                  "Completa la evaluación como líder y que tu equipo complete la suya para ver la comparación."
                )}
              </p>
            </div>
            <Button className="w-full py-6 text-lg" onClick={() => alert("Abriendo chat con Humi...")}>
              <BarChart3 className="mr-2" size={20} /> Ver Plan de Acción
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 h-[300px]">
        <h4 className="font-semibold mb-4">Tendencia de Participación</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { n: "S1", v: 40 },
              { n: "S2", v: 60 },
              { n: "S3", v: 75 },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" />
            <YAxis />
            <Bar dataKey="v" fill="#00A381" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};