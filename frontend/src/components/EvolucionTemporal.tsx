import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface EvolucionTemporalProps {
  IBO: number;
}

export const EvolucionTemporal = ({ IBO }: EvolucionTemporalProps) => {
  return (
    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
      <h3 className="text-xl font-bold mb-6">Comparación Temporal (Evolución)</h3>
      <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground">
        <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
        <p>
          Con más mediciones en el tiempo podrás ver aquí la evolución del IBO y las brechas por
          dimensión.
        </p>
        <p className="text-sm mt-2">Índice actual (esta medición): IBO = {IBO.toFixed(2)}</p>
      </div>
      <div className="mt-6 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[{ n: "Medición actual", v: Math.round(IBO * 100) }]}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="n" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Bar dataKey="v" fill="#00A381" radius={[4, 4, 0, 0]} name="IBO (%)" />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};