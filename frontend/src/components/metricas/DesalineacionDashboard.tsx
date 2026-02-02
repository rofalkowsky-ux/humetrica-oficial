// src/components/metricas/DesalineacionDashboard.tsx

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, Cell, Legend, ReferenceLine, LineChart, Line
} from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown, Target, Activity, Users, Layers, GitBranch, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  dimensionesInfo,
  type Perfil,
  type Brechas,
  type Indices,
  type Patron,
  type Accionable,
  type MedicionHistorica,
  type ResultadosDesalineacion
} from "@/onboarding/dashboardTypes";
import { obtenerColorBrecha, obtenerIconoBrecha, obtenerEtiquetaBrecha } from "@/onboarding/dashboardUtils";

// Mock data
const mockResultados: ResultadosDesalineacion = {
  fecha: '2026-01-31',
  equipoId: 'eq-001',
  equipoNombre: 'Equipo Alpha',
  perfilLider: { D1: 0.75, D2: 0.60, D3: 0.45, D4: 0.80, D5: 0.55, D6: 0.70 },
  perfilEquipo: { D1: 0.50, D2: 0.75, D3: 0.65, D4: 0.55, D5: 0.70, D6: 0.45 },
  brechas: { D1: 0.25, D2: 0.15, D3: 0.20, D4: 0.25, D5: 0.15, D6: 0.25 },
  indices: { IBO: 0.67, IFD: 0.45, ΔIBO: 0.05 },
  patron: {
    tipo: 'moderada_creciente',
    nivelRiesgo: 'medio_alto',
    descripcion: 'Desalineación moderada con tendencia creciente en las últimas mediciones',
  },
  accionables: [
    {
      dimensionAfectada: 'D1',
      hipotesis: 'El líder prioriza calidad pero el equipo está enfocado en velocidad',
      experimento: 'Sesión de alineación sobre criterios de entrega',
      metricaExito: 'Reducir brecha D1 a <0.15 en 30 días',
      prioridad: 'alta',
    },
    {
      dimensionAfectada: 'D4',
      hipotesis: 'Diferencias en interpretación de normas generan conflictos',
      experimento: 'Workshop de casos límite para establecer criterios',
      metricaExito: 'Reducir incidentes de interpretación en 50%',
      prioridad: 'media',
    },
    {
      dimensionAfectada: 'D6',
      hipotesis: 'Equipo busca causas sistémicas mientras líder busca responsables',
      experimento: 'Implementar retrospectivas con formato blameless',
      metricaExito: 'Mejorar NPS de retrospectivas en 20 puntos',
      prioridad: 'alta',
    },
  ],
  historico: [
    { fecha: '2025-10', IBO: 0.52, brechas: { D1: 0.15, D2: 0.10, D3: 0.12, D4: 0.18, D5: 0.08, D6: 0.15 } },
    { fecha: '2025-11', IBO: 0.58, brechas: { D1: 0.18, D2: 0.12, D3: 0.15, D4: 0.20, D5: 0.10, D6: 0.18 } },
    { fecha: '2025-12', IBO: 0.62, brechas: { D1: 0.22, D2: 0.14, D3: 0.18, D4: 0.22, D5: 0.12, D6: 0.22 } },
    { fecha: '2026-01', IBO: 0.67, brechas: { D1: 0.25, D2: 0.15, D3: 0.20, D4: 0.25, D5: 0.15, D6: 0.25 } },
  ],
};

// Colors
const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const getRiesgoColor = (nivel: string) => {
  switch (nivel) {
    case 'bajo': return 'text-success bg-success/10 border-success/30';
    case 'medio': return 'text-warning bg-warning/10 border-warning/30';
    case 'medio_alto': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
    case 'alto': return 'text-destructive bg-destructive/10 border-destructive/30';
    case 'critico': return 'text-destructive bg-destructive/20 border-destructive/50';
    default: return 'text-muted-foreground bg-muted border-border';
  }
};

const getPrioridadColor = (prioridad: string) => {
  switch (prioridad) {
    case 'alta': return 'bg-destructive text-destructive-foreground';
    case 'media': return 'bg-warning text-warning-foreground';
    case 'baja': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const DesalineacionDashboard = () => {
  const data = mockResultados;

  // Convertir valores decimales a porcentajes para visualización
  const IBOPorcentaje = Math.round(data.indices.IBO * 100);
  const IFDPorcentaje = Math.round(data.indices.IFD * 100);

  // Prepare data for charts
  const brechasChartData = Object.entries(data.brechas).map(([key, value]) => ({
    dimension: dimensionesInfo[key as keyof Perfil].nombre,
    brecha: Math.abs(value) * 100, // Convertir a porcentaje
    direccion: value > 0 ? 'Líder +' : 'Equipo +',
    valor: value,
  }));

  const perfilRadarData = Object.keys(data.perfilLider).map((key) => ({
    dimension: dimensionesInfo[key as keyof Perfil].nombre,
    lider: data.perfilLider[key as keyof Perfil] * 100, // Convertir a porcentaje
    equipo: data.perfilEquipo[key as keyof Perfil] * 100,
  }));

  const historicoData = data.historico?.map((h) => ({
    fecha: h.fecha,
    IBO: Math.round(h.IBO * 100),
  })) || [];

  // Sorted brechas for dimension view
  const brechasOrdenadas = (Object.entries(data.brechas) as [keyof Brechas, number][])
    .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a));

  // Scatter data for team dispersion
  const scatterData = [
    { equipo: 'Alpha', IBO: 67, IFD: 45, size: 85 },
    { equipo: 'Beta', IBO: 42, IFD: 55, size: 72 },
    { equipo: 'Gamma', IBO: 78, IFD: 38, size: 90 },
    { equipo: 'Delta', IBO: 35, IFD: 62, size: 65 },
    { equipo: 'Epsilon', IBO: 55, IFD: 48, size: 78 },
    { equipo: 'Zeta', IBO: 82, IFD: 72, size: 95 },
    { equipo: 'Eta', IBO: 28, IFD: 32, size: 55 },
    { equipo: 'Theta', IBO: 60, IFD: 58, size: 82 },
  ];

  return (
    <Tabs defaultValue="resumen" className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-4">
        <TabsTrigger value="resumen" className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Resumen
        </TabsTrigger>
        <TabsTrigger value="dimensiones" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          Dimensiones
        </TabsTrigger>
        <TabsTrigger value="evolucion" className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Evolución
        </TabsTrigger>
        <TabsTrigger value="dispersion" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Dispersión
        </TabsTrigger>
        <TabsTrigger value="accionables" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Accionables
        </TabsTrigger>
      </TabsList>

      {/* Tab: Resumen */}
      <TabsContent value="resumen" className="space-y-4">
        {/* Índices + Brechas en layout horizontal */}
        <div className="grid grid-cols-3 gap-4">
          {/* Columna 1: Índices apilados verticalmente */}
          <div className="col-span-1 flex flex-col gap-4">
            {/* IBO */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Índice de Brecha Operativa (IBO)</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-foreground">{IBOPorcentaje}</span>
                {data.indices.ΔIBO !== null && (
                  <div className={`flex items-center gap-1 text-sm ${data.indices.ΔIBO > 0 ? 'text-destructive' : data.indices.ΔIBO < 0 ? 'text-success' : 'text-muted-foreground'}`}>
                    {data.indices.ΔIBO > 0 ? <TrendingUp className="h-4 w-4" /> : data.indices.ΔIBO < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                    <span>{data.indices.ΔIBO > 0 ? '+' : ''}{Math.round(data.indices.ΔIBO * 100)}</span>
                    <span className="text-[10px] ml-1">
                      {data.indices.ΔIBO > 0.05 ? 'Empeorando' : data.indices.ΔIBO < -0.05 ? 'Mejorando' : 'Estable'}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    IBOPorcentaje < 30 ? 'bg-success' :
                    IBOPorcentaje < 60 ? 'bg-warning' :
                    'bg-destructive'
                  }`}
                  style={{ width: `${Math.min(IBOPorcentaje, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {IBOPorcentaje < 30 && 'Alineación saludable'}
                {IBOPorcentaje >= 30 && IBOPorcentaje < 60 && 'Desalineación moderada'}
                {IBOPorcentaje >= 60 && 'Desalineación crítica'}
              </p>
            </div>

            {/* IFD */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-chart-2" />
                <span className="text-xs text-muted-foreground">Índice de Fricción Decisional (IFD)</span>
              </div>
              <span className="text-3xl font-bold text-foreground">{IFDPorcentaje}</span>
              <p className="text-[10px] text-muted-foreground mt-2">
                {IFDPorcentaje < 30 && 'El equipo tiene criterio compartido'}
                {IFDPorcentaje >= 30 && IFDPorcentaje < 50 && 'Cohesión moderada'}
                {IFDPorcentaje >= 50 && 'Equipo fragmentado'}
              </p>
            </div>

            {/* Patrón */}
            <div className="bg-card border border-border rounded-lg p-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-xs text-muted-foreground">Patrón de Desalineación</span>
              </div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className={`inline-flex px-2 py-1 rounded-md border text-xs font-medium ${getRiesgoColor(data.patron.nivelRiesgo)}`}>
                  {data.patron.tipo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${getRiesgoColor(data.patron.nivelRiesgo)}`}>
                  {data.patron.nivelRiesgo.toUpperCase().replace(/_/g, '-')}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{data.patron.descripcion}</p>
            </div>
          </div>

          {/* Columna 2: Brechas por Dimensión */}
          <div className="col-span-2 bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Brechas por Dimensión</h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={brechasChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 30]} />
                  <YAxis dataKey="dimension" type="category" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value, name, props) => [
                      `${value} (${props.payload.direccion})`,
                      'Brecha'
                    ]}
                  />
                  <Bar dataKey="brecha" radius={[0, 4, 4, 0]}>
                    {brechasChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.valor > 0 ? 'hsl(var(--primary))' : 'hsl(var(--chart-2))'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Líder mayor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-2" />
                <span className="text-muted-foreground">Equipo mayor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accionables + Detalle de Dimensiones lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          {/* Accionables Prioritarios (solo 2) */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Accionables Prioritarios</h3>
            <div className="space-y-3">
              {data.accionables.slice(0, 2).map((accion, index) => (
                <div key={index} className="border border-border rounded-lg p-3 bg-secondary/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {dimensionesInfo[accion.dimensionAfectada].nombre}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getPrioridadColor(accion.prioridad)}`}>
                          {accion.prioridad.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{accion.hipotesis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalle de Dimensiones (compacto) */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Detalle de Dimensiones</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(dimensionesInfo).slice(0, 4).map(([key, info]) => {
                const brecha = data.brechas[key as keyof Brechas];
                const brechaPercent = Math.round(Math.abs(brecha) * 100);
                return (
                  <div key={key} className="border border-border rounded-lg p-2 bg-secondary/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{info.nombre}</span>
                      <span className={`text-xs font-bold ${brechaPercent > 20 ? 'text-destructive' : brechaPercent > 10 ? 'text-warning' : 'text-success'}`}>
                        {brecha > 0 ? '+' : ''}{brechaPercent}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-chart-2">{info.poloNegativo}</span>
                      <span className="text-primary">{info.poloPositivo}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Tab: Dimensiones */}
      <TabsContent value="dimensiones" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Radar de Perfiles */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Perfil Líder vs Equipo</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={perfilRadarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar name="Líder" dataKey="lider" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Radar name="Equipo" dataKey="equipo" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Brechas ordenadas */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Desalineación por Dimensión</h3>
            <div className="space-y-3">
              {brechasOrdenadas.map(([dimension, brecha]) => {
                const info = dimensionesInfo[dimension];
                const absBrecha = Math.abs(brecha);
                const brechaPercent = Math.round(absBrecha * 100);
                return (
                  <div key={dimension} className="flex items-center space-x-3">
                    <div className="w-28">
                      <p className="text-xs font-medium">{info.nombre}</p>
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            brechaPercent < 10 ? 'bg-success' :
                            brechaPercent < 20 ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${Math.min((brechaPercent / 30) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-right">
                      <span className="text-xs font-semibold">{obtenerIconoBrecha(absBrecha)} {brechaPercent}</span>
                    </div>
                    <div className="w-20">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${obtenerColorBrecha(absBrecha)}`}>
                        {obtenerEtiquetaBrecha(absBrecha)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalle completo de dimensiones */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Análisis Detallado por Dimensión</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(dimensionesInfo).map(([key, info]) => {
              const brecha = data.brechas[key as keyof Brechas];
              const valorLider = data.perfilLider[key as keyof Perfil];
              const valorEquipo = data.perfilEquipo[key as keyof Perfil];
              const brechaPercent = Math.round(brecha * 100);
              return (
                <div key={key} className="border border-border rounded-lg p-4 bg-secondary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{info.nombre}</span>
                    <span className={`text-sm font-bold ${Math.abs(brechaPercent) > 20 ? 'text-destructive' : Math.abs(brechaPercent) > 10 ? 'text-warning' : 'text-success'}`}>
                      Δ {brechaPercent > 0 ? '+' : ''}{brechaPercent}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-3">{info.descripcion}</p>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-primary">Líder: {Math.round(valorLider * 100)}</span>
                    <span className="text-chart-2">Equipo: {Math.round(valorEquipo * 100)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] border-t border-border pt-2">
                    <span className="text-muted-foreground">{info.poloNegativo}</span>
                    <span className="text-muted-foreground">{info.poloPositivo}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground italic mt-2">{info.preguntaClave}</p>
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      {/* Tab: Evolución */}
      <TabsContent value="evolucion" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Gráfico de evolución del IBO */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Evolución del IBO</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <ReferenceLine y={30} stroke="hsl(var(--success))" strokeDasharray="5 5" label={{ value: 'Saludable', fill: 'hsl(var(--success))', fontSize: 10 }} />
                  <ReferenceLine y={60} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'Crítico', fill: 'hsl(var(--destructive))', fontSize: 10 }} />
                  <Line type="monotone" dataKey="IBO" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencia y predicción */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-4">Análisis de Tendencia</h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {data.indices.ΔIBO && data.indices.ΔIBO > 0 ? (
                    <TrendingUp className="h-5 w-5 text-destructive" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-success" />
                  )}
                  <span className="text-sm font-medium">
                    {data.indices.ΔIBO && data.indices.ΔIBO > 0 ? 'Tendencia Creciente' : 'Tendencia Decreciente'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {data.indices.ΔIBO && data.indices.ΔIBO > 0 
                    ? 'La brecha operativa está aumentando. Se requiere intervención.'
                    : 'La brecha operativa está disminuyendo. Mantener las acciones actuales.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground">Historial de Mediciones</h4>
                {data.historico?.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-secondary/20 rounded">
                    <span className="text-xs">{h.fecha}</span>
                    <span className={`text-xs font-bold ${Math.round(h.IBO * 100) < 30 ? 'text-success' : Math.round(h.IBO * 100) < 60 ? 'text-warning' : 'text-destructive'}`}>
                      IBO: {Math.round(h.IBO * 100)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Tab: Dispersión */}
      <TabsContent value="dispersion" className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Dispersión: IBO vs IFD por Equipo</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  dataKey="IBO" 
                  name="IBO" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: 'Índice de Brecha Operativa (IBO)', position: 'bottom', offset: 20, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                />
                <YAxis 
                  type="number" 
                  dataKey="IFD" 
                  name="IFD" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  label={{ value: 'Índice Fricción Decisional (IFD)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  domain={[0, 100]}
                />
                <ZAxis type="number" dataKey="size" range={[80, 500]} name="Rendimiento" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-sm mb-1">Equipo {data.equipo}</p>
                          <p className="text-xs text-muted-foreground">IBO: <span className="font-medium text-foreground">{data.IBO}</span></p>
                          <p className="text-xs text-muted-foreground">IFD: <span className="font-medium text-foreground">{data.IFD}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={50} stroke="hsl(var(--warning))" strokeDasharray="5 5" />
                <ReferenceLine y={50} stroke="hsl(var(--warning))" strokeDasharray="5 5" />
                <Scatter name="Equipos" data={scatterData} fill="hsl(var(--primary))">
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.IBO > 50 || entry.IFD > 50 ? 'hsl(var(--destructive))' : 'hsl(var(--success))'} 
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-muted-foreground">Zona segura ({"<"}50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Zona de riesgo (≥50)</span>
            </div>
          </div>
        </div>

        {/* Tabla de equipos */}
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Detalle por Equipo</h3>
          <div className="grid grid-cols-4 gap-3">
            {scatterData.map((equipo) => (
              <div 
                key={equipo.equipo} 
                className={`border rounded-lg p-3 ${
                  equipo.IBO > 50 || equipo.IFD > 50 
                    ? 'border-destructive/50 bg-destructive/5' 
                    : 'border-success/50 bg-success/5'
                }`}
              >
                <p className="text-sm font-semibold mb-2">Equipo {equipo.equipo}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">IBO:</span>
                  <span className={`font-medium ${equipo.IBO > 50 ? 'text-destructive' : 'text-success'}`}>{equipo.IBO}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">IFD:</span>
                  <span className={`font-medium ${equipo.IFD > 50 ? 'text-destructive' : 'text-success'}`}>{equipo.IFD}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* Tab: Accionables */}
      <TabsContent value="accionables" className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Todos los Accionables</h3>
          <div className="space-y-4">
            {data.accionables.map((accion, index) => (
              <div key={index} className="border-l-4 border-primary bg-secondary/30 p-4 rounded-r-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold">{dimensionesInfo[accion.dimensionAfectada].nombre}</p>
                    <p className="text-xs text-muted-foreground">{dimensionesInfo[accion.dimensionAfectada].descripcion}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-semibold ${getPrioridadColor(accion.prioridad)}`}>
                    {accion.prioridad.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Hipótesis</p>
                    <p className="text-sm">{accion.hipotesis}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Experimento Sugerido</p>
                    <p className="text-sm">{accion.experimento}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Métrica de Éxito</p>
                    <p className="text-sm text-primary">{accion.metricaExito}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DesalineacionDashboard;