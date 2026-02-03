import React, { useState, useEffect } from 'react';
import type { ResultadosDesalineacion } from './dashboardTypes';
import { calcularBrechas, calcularIBO, identificarPatron, generarAccionables } from './dashboardUtils';
import { DesalineacionDashboard } from '@/components/metricas/DesalineacionDashboard';
import { MenuLateral } from '@/components/config/MenuLateral';
import { Button } from '@/components/ui/button';
import { Eye, Users, GitCompare, RefreshCcw, Download, ChevronDown, Send, UsersRound, Check } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { EquipoPanel } from '@/components/metricas/EquipoPanel';
import { HelpTooltip, FloatingTip, useRandomTips, helpTips } from '@/components/metricas/HelpTooltips';

type VistaMetricas = 'global' | 'equipo' | 'comparar';
type InformeView = 'desalineacion-operativa';

const informeOptions: { value: InformeView; label: string }[] = [
  { value: 'desalineacion-operativa', label: 'Desalineación Operativa' },
];
// Mock data para comparación
const participantes = [
  { id: "1", nombre: "María García" },
  { id: "2", nombre: "Carlos López" },
  { id: "3", nombre: "Ana Martínez" },
  { id: "4", nombre: "Juan Rodríguez" },
  { id: "5", nombre: "Laura Sánchez" },
];

const dimensionLabels: Record<string, string> = {
  D1: "Prioridad",
  D2: "Criterio de Validación",
  D3: "Umbral de Acción",
  D4: "Interpretación de Reglas",
  D5: "Asunción de Riesgo",
  D6: "Atribución de Responsabilidad",
};
const Dashboard: React.FC = () => {
  const [resultados, setResultados] = useState<ResultadosDesalineacion | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [vistaMetricas, setVistaMetricas] = useState<VistaMetricas>('global');
  const [selectedInformes, setSelectedInformes] = useState<InformeView[]>(informeOptions.map((o) => o.value));
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [selectedParticipantes, setSelectedParticipantes] = useState<string[]>([]);
  const [reanalisisOpen, setReanalisisOpen] = useState(false);
  const [reanalisisEvento, setReanalisisEvento] = useState('');
  const [reanalisisNotas, setReanalisisNotas] = useState('');
  const { currentTip, showTip, closeTip } = useRandomTips(true, 45000);

  const isAllSelected = selectedInformes.length === informeOptions.length;

  const toggleInforme = (value: InformeView) => {
    setSelectedInformes((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedInformes([]);
    } else {
      setSelectedInformes(informeOptions.map((o) => o.value));
    }
  };

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

  const toggleParticipante = (participanteId: string) => {
    setSelectedParticipantes(prev => 
      prev.includes(participanteId) 
        ? prev.filter(p => p !== participanteId)
        : [...prev, participanteId]
    );
  };
  
  const getParticipantesLabel = () => {
    if (selectedParticipantes.length === 0) return "Seleccionar personas";
    if (selectedParticipantes.length === 1) {
      return participantes.find(p => p.id === selectedParticipantes[0])?.nombre || "";
    }
    return `${selectedParticipantes.length} personas`;
  };
  
  const generateComparisonData = (participantId: string, seed: number) => {
    const participantName = participantes.find(p => p.id === participantId)?.nombre || `Persona ${participantId}`;
    const baseValue = 55 + (seed * 7) % 35;
    return {
      id: participantId,
      name: participantName,
      D1: Math.min(100, baseValue + (seed * 3) % 20),
      D2: Math.min(100, baseValue + (seed * 5) % 25),
      D3: Math.min(100, baseValue + (seed * 7) % 18),
      D4: Math.min(100, baseValue + (seed * 11) % 22),
      D5: Math.min(100, baseValue + (seed * 13) % 16),
      D6: Math.min(100, baseValue + (seed * 17) % 24),
    };
  };
  const getComparisonChartData = () => {
    if (selectedParticipantes.length < 2) return [];
    
    const dimensions = ["D1", "D2", "D3", "D4", "D5", "D6"];
    return dimensions.map(dimId => {
      const dimName = dimensionLabels[dimId];
      const dataPoint: Record<string, string | number> = { dimension: dimName, dimId };
      
      selectedParticipantes.forEach((pId, index) => {
        const pData = generateComparisonData(pId, parseInt(pId) || index + 1);
        const dimValue = pData[dimId as keyof typeof pData];
        const pName = participantes.find(p => p.id === pId)?.nombre || `Persona ${pId}`;
        dataPoint[pName] = typeof dimValue === 'number' ? dimValue : 0;
      });
      
      return dataPoint;
    });
  };
  
  const isComparisonReady = vistaMetricas === 'comparar' && selectedParticipantes.length >= 2;
  const handleExportReport = () => {
    toast.success('Informe exportado exitosamente');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-background flex">
        <FloatingTip show={showTip} onClose={closeTip} tip={currentTip} />
        <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resultados) {
    return (
      <div className="min-h-screen bg-background flex">
        <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No hay resultados disponibles</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar análisis
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border border-border z-50 min-w-[220px]">
                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); toggleAll(); }} className="cursor-pointer font-medium flex items-center gap-2">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${isAllSelected ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {isAllSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  📊 Ver todos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {informeOptions.map((option) => (
                  <DropdownMenuItem key={option.value} onSelect={(e) => { e.preventDefault(); toggleInforme(option.value); }} className="cursor-pointer flex items-center gap-2">
                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedInformes.includes(option.value) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                      {selectedInformes.includes(option.value) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center - Toggle Global/Equipo/Comparar + Selector */}
<div className="flex items-center gap-2">
  <div className="flex items-center bg-secondary rounded-lg p-0.5">
  <HelpTooltip content={helpTips.vistaGlobal} side="bottom">
    <Button variant="ghost" size="sm" className={`gap-1.5 h-7 px-3 rounded-md transition-all ${vistaMetricas === 'global' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setVistaMetricas('global')}>
      <Users className="h-3.5 w-3.5" />
      Global
    </Button>
    </HelpTooltip>
    <Button variant="ghost" size="sm" className={`gap-1.5 h-7 px-3 rounded-md transition-all ${vistaMetricas === 'equipo' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setVistaMetricas('equipo')}>
      <UsersRound className="h-3.5 w-3.5" />
      Equipo
    </Button>
    <Button variant="ghost" size="sm" className={`gap-1.5 h-7 px-3 rounded-md transition-all ${vistaMetricas === 'comparar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setVistaMetricas('comparar')}>
      <GitCompare className="h-3.5 w-3.5" />
      Comparar
    </Button>
  </div>
  
  {/* Selector de participantes - solo visible en modo Comparar */}
  {vistaMetricas === 'comparar' && (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-[220px] h-8 justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={selectedParticipantes.length === 0 ? "text-muted-foreground" : ""}>
              {getParticipantesLabel()}
            </span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="bg-popover border border-border z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
        {participantes.map((p) => (
          <DropdownMenuItem 
            key={p.id}
            onSelect={(e) => { e.preventDefault(); toggleParticipante(p.id); }} 
            className="cursor-pointer flex items-center gap-2"
          >
            <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedParticipantes.includes(p.id) ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
              {selectedParticipantes.includes(p.id) && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            {p.nombre}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )}
</div>

          <div className="flex items-center gap-2">
            <Popover open={reanalisisOpen} onOpenChange={setReanalisisOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Reanalizar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Reanalizar métricas</h4>
                    <p className="text-xs text-muted-foreground">Agrega una nueva capa de información para incorporar al análisis</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Selecciona un nuevo evento asociado</label>
                    <Select value={reanalisisEvento} onValueChange={setReanalisisEvento}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar evento..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cambio_objetivos">Cambio de objetivos</SelectItem>
                        <SelectItem value="nueva_delegacion">Nueva delegación</SelectItem>
                        <SelectItem value="crisis_operativa">Crisis operativa</SelectItem>
                        <SelectItem value="nuevo_integrante">Nuevo integrante</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Notas (opcional)</label>
                    <Textarea placeholder="Observaciones adicionales sobre este reanálisis..." value={reanalisisNotas} onChange={(e) => setReanalisisNotas(e.target.value)} className="min-h-[80px] resize-none" maxLength={500} />
                    <p className="text-xs text-muted-foreground text-right">{reanalisisNotas.length}/500</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                  <Button variant="ghost" size="sm" onClick={() => { setReanalisisOpen(false); setReanalisisEvento(''); setReanalisisNotas(''); }}>
                    Cancelar
                  </Button>
                  <Button size="sm" disabled={!reanalisisEvento} onClick={() => { toast.success('Reanálisis iniciado', { description: `Evento: ${reanalisisEvento.replace('_', ' ')}` }); setReanalisisOpen(false); setReanalisisEvento(''); setReanalisisNotas(''); }}>
                    <Send className="h-4 w-4 mr-1" />
                    Enviar
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground" onClick={handleExportReport}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {vistaMetricas === 'equipo' ? (
      <EquipoPanel />
    ) : vistaMetricas === 'comparar' ? (
      isComparisonReady ? (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Comparativa: {selectedParticipantes.map(id => participantes.find(p => p.id === id)?.nombre).filter(Boolean).join(" vs ")}
            </h3>
            
            {/* Bar Chart */}
            <div className="mb-8">
              <h4 className="text-sm font-medium mb-3">Comparación por Dimensiones</h4>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getComparisonChartData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="dimension" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    {selectedParticipantes.map((pId, index) => {
                      const pName = participantes.find(p => p.id === pId)?.nombre || '';
                      const colors = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return <Bar key={pId} dataKey={pName} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />;
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="mb-8">
              <h4 className="text-sm font-medium mb-3">Vista Radar</h4>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getComparisonChartData()}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    {selectedParticipantes.map((pId, index) => {
                      const pName = participantes.find(p => p.id === pId)?.nombre || '';
                      const colors = ['hsl(var(--primary))', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return (
                        <Radar 
                          key={pId} 
                          name={pName} 
                          dataKey={pName} 
                          stroke={colors[index % colors.length]} 
                          fill={colors[index % colors.length]} 
                          fillOpacity={0.3} 
                        />
                      );
                    })}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comparison Table */}
            <div>
              <h4 className="text-sm font-medium mb-3">Tabla Comparativa</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium">Dimensión</th>
                      {selectedParticipantes.map(pId => {
                        const pName = participantes.find(p => p.id === pId)?.nombre || '';
                        return <th key={pId} className="text-center py-3 px-4 font-medium">{pName}</th>;
                      })}
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getComparisonChartData().map((row, idx) => {
                      const values = selectedParticipantes.map(pId => {
                        const pName = participantes.find(p => p.id === pId)?.nombre || '';
                        return (row[pName] as number) || 0;
                      });
                      const maxVal = Math.max(...values);
                      const minVal = Math.min(...values);
                      const diff = maxVal - minVal;
                      
                      return (
                        <tr key={idx} className="border-b border-border/50">
                          <td className="py-3 px-4 text-muted-foreground">{row.dimension}</td>
                          {selectedParticipantes.map(pId => {
                            const pName = participantes.find(p => p.id === pId)?.nombre || '';
                            const val = (row[pName] as number) || 0;
                            const isMax = val === maxVal;
                            return (
                              <td key={pId} className={`text-center py-3 px-4 font-medium ${isMax ? 'text-primary' : ''}`}>
                                {val}%
                              </td>
                            );
                          })}
                          <td className={`text-center py-3 px-4 font-medium ${diff > 15 ? 'text-red-500' : diff > 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {diff > 0 ? `±${diff}` : '0'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <GitCompare className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Selecciona participantes para comparar</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Elige al menos 2 personas del selector de arriba para ver una comparativa de sus resultados en las 6 dimensiones.
          </p>
        </div>
      )
    ) : (
      <DesalineacionDashboard />
    )}
  </div>
</main>
      </div>
    </div>
  );
};

export default Dashboard;