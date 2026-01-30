import { useState, useEffect, useMemo } from "react";
import { MenuLateral } from "@/components/MenuLateral";
import {
  cargarDatosRadarSupabase,
  radarDataComparativo,
  categoriaConBrecha,
} from "@/onboarding/utils";
import {
  calcularBrechas,
  calcularIBO,
  identificarPatron,
  generarAccionables,
  obtenerColorBrecha,
  obtenerIconoBrecha,
  obtenerEtiquetaBrecha,
} from "@/onboarding/dashboardUtils";
import type { Perfil } from "@/onboarding/types";
import type { Brechas, Patron, Accionable } from "@/onboarding/dashboardTypes";
import { dimensionesInfo } from "@/onboarding/dashboardTypes";
import { Download, GitCompare, BarChart3, LayoutDashboard, Layers, TrendingUp, ListChecks } from "lucide-react";
import { Button } from "@/components/button";
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
import { EquipoPanel } from "@/components/EquipoPanel";

const RADAR_VACIO = [
  { name: "Prioridad", valor: 50, equipo: 50 },
  { name: "Validación", valor: 50, equipo: 50 },
  { name: "Acción", valor: 50, equipo: 50 },
  { name: "Reglas", valor: 50, equipo: 50 },
  { name: "Riesgo", valor: 50, equipo: 50 },
  { name: "Responsabilidad", valor: 50, equipo: 50 },
];

type VistaDashboard = "resumen" | "dimensiones" | "temporal" | "accionables";

const MetricasContent = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [vistaMetricas, setVistaMetricas] = useState<"equipo" | "global">("global");
  const [vistaDashboard, setVistaDashboard] = useState<VistaDashboard>("resumen");
  const [perfilLider, setPerfilLider] = useState<Perfil | null>(null);
  const [perfilEquipo, setPerfilEquipo] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let mounted = true;
    cargarDatosRadarSupabase().then(({ perfilLider: l, perfilEquipo: e }) => {
      if (mounted) {
        setPerfilLider(l);
        setPerfilEquipo(e);
        setCargando(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const radarData =
    perfilLider != null || perfilEquipo != null
      ? radarDataComparativo(perfilLider, perfilEquipo)
      : RADAR_VACIO;
  const tieneEquipo = perfilEquipo != null;
  const insightCategoria = categoriaConBrecha(perfilLider ?? null, perfilEquipo ?? null);

  const { brechas, IBO, patron, accionables } = useMemo(() => {
    if (!perfilLider || !perfilEquipo) {
      const vacio: Brechas = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 };
      return {
        brechas: vacio,
        IBO: 0,
        patron: { tipo: "alineada" as const, nivelRiesgo: "bajo" as const, descripcion: "" },
        accionables: [] as Accionable[],
      };
    }
    const b = calcularBrechas(perfilLider, perfilEquipo);
    const ibo = calcularIBO(b);
    const p = identificarPatron(ibo, null, 0);
    const a = generarAccionables(b, perfilLider, perfilEquipo);
    return { brechas: b, IBO: ibo, patron: p, accionables: a };
  }, [perfilLider, perfilEquipo]);

  const tabsDashboard: { id: VistaDashboard; label: string; icon: React.ReactNode }[] = [
    { id: "resumen", label: "Resumen ejecutivo", icon: <LayoutDashboard size={16} /> },
    { id: "dimensiones", label: "Por dimensión", icon: <Layers size={16} /> },
    { id: "temporal", label: "Evolución", icon: <TrendingUp size={16} /> },
    { id: "accionables", label: "Accionables", icon: <ListChecks size={16} /> },
  ];

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
                {/* Tabs: 4 vistas del dashboard */}
                <div className="flex flex-wrap gap-2 border-b border-border pb-4">
                  {tabsDashboard.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={vistaDashboard === tab.id ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setVistaDashboard(tab.id)}
                      className="gap-2"
                    >
                      {tab.icon}
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* 1. Vista Principal (Resumen Ejecutivo) */}
                {vistaDashboard === "resumen" && (
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
                                Brecha detectada en <strong>{insightCategoria}</strong>. El líder y
                                el equipo perciben la toma de decisiones de forma distinta.
                              </>
                            ) : tieneEquipo ? (
                              "Los perfiles del líder y del equipo están alineados en las dimensiones evaluadas."
                            ) : (
                              "Completa la evaluación como líder y que tu equipo complete la suya para ver la comparación."
                            )}
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
                )}

                {/* 2. Vista Detallada por Dimensión */}
                {vistaDashboard === "dimensiones" && (
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
                            <div
                              key={dim}
                              className={`border rounded-xl p-4 ${clase}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold">{info.nombre}</span>
                                <span title={etiqueta}>{icono}</span>
                              </div>
                              <p className="text-sm opacity-90 mb-2">{info.descripcion}</p>
                              <p className="text-xs mb-1">
                                {info.poloNegativo} ↔ {info.poloPositivo}
                              </p>
                              <p className="text-xs font-medium">Brecha: {brecha.toFixed(2)} ({etiqueta})</p>
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
                )}

                {/* 3. Comparación Temporal (Evolución) */}
                {vistaDashboard === "temporal" && (
                  <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Comparación Temporal (Evolución)</h3>
                    <div className="bg-muted/50 rounded-xl p-6 text-center text-muted-foreground">
                      <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                      <p>
                        Con más mediciones en el tiempo podrás ver aquí la evolución del IBO y las
                        brechas por dimensión.
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
                          <Tooltip formatter={(v: number) => [`${v}%`, "IBO"]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* 4. Accionables Sugeridos */}
                {vistaDashboard === "accionables" && (
                  <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                    <h3 className="text-xl font-bold mb-6">Accionables Sugeridos</h3>
                    {perfilLider && perfilEquipo ? (
                      accionables.length > 0 ? (
                        <div className="space-y-6">
                          {accionables.map((acc, i) => (
                            <div
                              key={i}
                              className="border border-border rounded-xl p-6 bg-card shadow-sm"
                            >
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
                          No hay accionables críticos en esta medición. Las brechas están por debajo
                          del umbral (0.6) en las dimensiones evaluadas.
                        </p>
                      )
                    ) : (
                      <p className="text-muted-foreground">
                        Cargá los datos del líder y del equipo para ver accionables sugeridos.
                      </p>
                    )}
                  </div>
                )}

                {/* Bloque inferior: Tendencia (solo en resumen) */}
                {vistaDashboard === "resumen" && (
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
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MetricasContent;
