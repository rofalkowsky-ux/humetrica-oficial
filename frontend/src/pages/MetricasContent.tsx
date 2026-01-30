import { useState } from "react";
import { MenuLateral } from "@/components/MenuLateral";
import { Download, GitCompare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { EquipoPanel } from "@/components/EquipoPanel";

const MetricasContent = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [vistaMetricas, setVistaMetricas] = useState<"equipo" | "global">("global");
  const [queryInput, setQueryInput] = useState("");

  return (
    <div className="min-h-screen bg-background flex w-full">
      <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Dashboard Humétrica</h2>
            <div className="flex bg-muted p-1 rounded-lg">
              <Button 
                variant={vistaMetricas === "equipo" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setVistaMetricas("equipo")}
              >
                Equipo
              </Button>
              <Button 
                variant={vistaMetricas === "global" ? "secondary" : "ghost"} 
                size="sm" 
                onClick={() => setVistaMetricas("global")}
              >
                Global
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Exportar
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {vistaMetricas === "equipo" ? (
              <div className="animate-fade-in">
                <EquipoPanel />
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                
                {/* RADAR DE DESALINEACIÓN */}
                <div className="bg-card border border-primary/20 rounded-xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                        <GitCompare size={24} /> Análisis de Desalineación Operativa
                      </h3>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-3 py-1 rounded-full uppercase">
                      Diagnóstico Inicial
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="h-[350px] w-full bg-white rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[
                          { name: 'Prioridad', valor: 85, equipo: 60 },
                          { name: 'Validación', valor: 70, equipo: 45 },
                          { name: 'Acción', valor: 90, equipo: 50 },
                          { name: 'Reglas', valor: 65, equipo: 75 },
                          { name: 'Riesgo', valor: 80, equipo: 40 },
                          { name: 'Responsabilidad', valor: 75, equipo: 55 },
                        ]}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Radar name="Tu Percepción" dataKey="valor" stroke="#00A381" fill="#00A381" fillOpacity={0.5} />
                          <Radar name="Realidad Equipo" dataKey="equipo" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl shadow-sm">
                        <h4 className="text-sm font-bold text-primary mb-2 uppercase">Insight</h4>
                        <p className="text-foreground/80 leading-relaxed text-base">
                          Brecha detectada en <strong>Prioridad</strong>. Tu equipo percibe los tiempos de forma distinta.
                        </p>
                      </div>
                      <Button 
                        className="w-full py-6 text-lg" 
                        onClick={() => alert("Abriendo chat con Humi...")}
                      >
                        <BarChart3 className="mr-2" size={20} /> Ver Plan de Acción
                      </Button>
                    </div>
                  </div>
                </div>

                {/* GRÁFICO EXTRA DE RELLENO */}
                <div className="bg-card border border-border rounded-xl p-6 h-[300px]">
                  <h4 className="font-semibold mb-4">Tendencia de Participación</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{n: 'S1', v: 40}, {n: 'S2', v: 60}, {n: 'S3', v: 75}]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="n" />
                      <YAxis />
                      <Bar dataKey="v" fill="#00A381" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MetricasContent;