// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import type { ResultadosDesalineacion } from './dashboardTypes';
import { calcularBrechas, calcularIBO, identificarPatron, generarAccionables } from './dashboardUtils';
import { DesalineacionDashboard } from '@/components/metricas/DesalineacionDashboard';
import { Button } from '@/components/ui/button';
import { Eye, Users, GitCompare, RefreshCcw, Download, ChevronDown, Send, UsersRound, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type VistaMetricas = 'global' | 'equipo' | 'comparar';
type InformeView = 'desalineacion-operativa';

const informeOptions: { value: InformeView; label: string }[] = [
  { value: 'desalineacion-operativa', label: 'Desalineación Operativa' },
];

const Dashboard: React.FC = () => {
  const [resultados, setResultados] = useState<ResultadosDesalineacion | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [vistaMetricas, setVistaMetricas] = useState<VistaMetricas>('global');
  const [selectedInformes, setSelectedInformes] = useState<InformeView[]>(
    informeOptions.map((o) => o.value)
  );

  // Reanalysis popover state
  const [reanalisisOpen, setReanalisisOpen] = useState(false);
  const [reanalisisEvento, setReanalisisEvento] = useState('');
  const [reanalisisNotas, setReanalisisNotas] = useState('');

  const isAllSelected = selectedInformes.length === informeOptions.length;

  const toggleInforme = (value: InformeView) => {
    setSelectedInformes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
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

  const handleExportReport = () => {
    toast.success('Informe exportado exitosamente');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (!resultados) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No hay resultados disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header principal */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard de Desalineación</h1>
              <p className="text-sm text-muted-foreground mt-1">{resultados.equipoNombre}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Última medición</p>
              <p className="text-sm font-medium text-foreground">
                {new Date(resultados.fecha).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de controles */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        {/* Left - Visualizar análisis */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                Visualizar análisis
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-popover border border-border z-50 min-w-[220px]"
            >
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  toggleAll();
                }}
                className="cursor-pointer font-medium flex items-center gap-2"
              >
                <div
                  className={`w-4 h-4 border rounded flex items-center justify-center ${
                    isAllSelected
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {isAllSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                📊 Ver todos
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {informeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={(e) => {
                    e.preventDefault();
                    toggleInforme(option.value);
                  }}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <div
                    className={`w-4 h-4 border rounded flex items-center justify-center ${
                      selectedInformes.includes(option.value)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedInformes.includes(option.value) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center - Toggle Global/Equipo/Comparar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-7 px-3 rounded-md transition-all ${
                vistaMetricas === 'global'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setVistaMetricas('global')}
            >
              <Users className="h-3.5 w-3.5" />
              Global
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-7 px-3 rounded-md transition-all ${
                vistaMetricas === 'equipo'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setVistaMetricas('equipo')}
            >
              <UsersRound className="h-3.5 w-3.5" />
              Equipo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-7 px-3 rounded-md transition-all ${
                vistaMetricas === 'comparar'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setVistaMetricas('comparar')}
            >
              <GitCompare className="h-3.5 w-3.5" />
              Comparar
            </Button>
          </div>
        </div>

        {/* Right - Action buttons */}
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
                  <p className="text-xs text-muted-foreground">
                    Agrega una nueva capa de información para incorporar al análisis
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Selecciona un nuevo evento asociado
                  </label>
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
                  <label className="text-xs font-medium text-muted-foreground">
                    Notas (opcional)
                  </label>
                  <Textarea
                    placeholder="Observaciones adicionales sobre este reanálisis..."
                    value={reanalisisNotas}
                    onChange={(e) => setReanalisisNotas(e.target.value)}
                    className="min-h-[80px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {reanalisisNotas.length}/500
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReanalisisOpen(false);
                    setReanalisisEvento('');
                    setReanalisisNotas('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  disabled={!reanalisisEvento}
                  onClick={() => {
                    toast.success('Reanálisis iniciado', {
                      description: `Evento: ${reanalisisEvento.replace('_', ' ')}`,
                    });
                    setReanalisisOpen(false);
                    setReanalisisEvento('');
                    setReanalisisNotas('');
                  }}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Enviar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            className="gap-2 bg-primary text-primary-foreground"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DesalineacionDashboard />
      </main>
    </div>
  );
};

export default Dashboard;