import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MenuLateral } from "@/components/MenuLateral";
import { ChevronDown, Download, Send, Eye, BarChart3, Paperclip, Loader2, X, Save, FileText, Check, User, Users, GitCompare, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EquipoPanel } from "@/components/EquipoPanel";

// Tipos para el desplegable del header (Visualizar informes)
type InformeView = "analisis1" | "ruta-decisiones" | "matriz-critico" | "comparar" | "nivel-potencial" | "role-fit" | "blind-spots" | "patrones-riesgo" | "clima-laboral" | "brecha-habilidad" | "evaluacion-360";

const informeOptions: { value: InformeView; label: string }[] = [
  { value: "analisis1", label: "Análisis 1" },
  { value: "ruta-decisiones", label: "Ruta de decisiones" },
  { value: "matriz-critico", label: "Matriz de análisis crítico" },
  { value: "comparar", label: "Comparar" },
  { value: "nivel-potencial", label: "Nivel Actual vs. Potencial" },
  { value: "role-fit", label: "Ajuste de Rol (Role-Fit)" },
  { value: "blind-spots", label: "Blind Spots Conductuales" },
  { value: "patrones-riesgo", label: "Patrones de Riesgo" },
  { value: "clima-laboral", label: "Clima Laboral" },
  { value: "brecha-habilidad", label: "Brecha de Habilidad Crítica" },
  { value: "evaluacion-360", label: "Evaluación 360°" },
];


const ANALYSIS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metrics-analysis`;

// Chart colors
const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

interface ChartData {
  chartType: "bar" | "radar" | "pie" | "line";
  title: string;
  data: Array<{ name: string; value: number }>;
  description: string;
}

// Dynamic chart renderer component
const DynamicChart = ({ chartData }: { chartData: ChartData }) => {
  const { chartType, title, data, description } = chartData;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mt-4">
      <h4 className="text-sm font-semibold mb-2">{title}</h4>
      <p className="text-xs text-muted-foreground mb-4">{description}</p>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === "radar" ? (
            <RadarChart data={data}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Valor" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
            </RadarChart>
          ) : chartType === "pie" ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
            </PieChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Parse chart data from AI response
const parseChartData = (text: string): { textContent: string; chartData: ChartData | null } => {
  const startMarker = "---CHART_DATA_START---";
  const endMarker = "---CHART_DATA_END---";
  
  const startIndex = text.indexOf(startMarker);
  const endIndex = text.indexOf(endMarker);
  
  if (startIndex === -1 || endIndex === -1) {
    return { textContent: text, chartData: null };
  }
  
  const textContent = text.substring(0, startIndex).trim();
  const jsonStr = text.substring(startIndex + startMarker.length, endIndex).trim();
  
  try {
    const chartData = JSON.parse(jsonStr) as ChartData;
    return { textContent, chartData };
  } catch {
    return { textContent: text, chartData: null };
  }
};

interface SavedAnalysis {
  id: string;
  name: string;
  query: string;
  text_content: string | null;
  chart_type: string | null;
  chart_title: string | null;
  chart_data: unknown;
  chart_description: string | null;
  created_at: string;
}

const MetricasContent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _navigate = useNavigate();
  const { user } = useAuth();
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [selectedInformes, setSelectedInformes] = useState<InformeView[]>(informeOptions.map(o => o.value));
  
  const isAllSelected = selectedInformes.length === informeOptions.length;
  
  const toggleInforme = (value: InformeView) => {
    setSelectedInformes(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };
  
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedInformes([]);
    } else {
      setSelectedInformes(informeOptions.map(o => o.value));
    }
  };
  
  const [vistaMetricas, setVistaMetricas] = useState<"equipo" | "individual" | "global" | "comparar">("equipo");
  
  // Individual view selectors
  const [selectedParticipante, _setSelectedParticipante] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Comparison mode selectors
  const [selectedParticipantes, setSelectedParticipantes] = useState<string[]>([]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _toggleParticipante = (participanteId: string) => {
    setSelectedParticipantes(prev => 
      prev.includes(participanteId) 
        ? prev.filter(p => p !== participanteId)
        : [...prev, participanteId]
    );
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getParticipantesLabel = () => {
    if (selectedParticipantes.length === 0) return "Seleccionar personas";
    if (selectedParticipantes.length === 1) {
      return participantes.find(p => p.id === selectedParticipantes[0])?.nombre || "";
    }
    return `${selectedParticipantes.length} personas`;
  };
  
  const getComparisonTitle = (baseTitle: string) => {
    return baseTitle;
  };
  
  // Mock data for participants and skills
  const participantes = [
    { id: "1", nombre: "María García" },
    { id: "2", nombre: "Carlos López" },
    { id: "3", nombre: "Ana Martínez" },
    { id: "4", nombre: "Juan Rodríguez" },
    { id: "5", nombre: "Laura Sánchez" },
  ];
  
  const skills = [
    { id: "liderazgo", nombre: "Liderazgo" },
    { id: "comunicacion", nombre: "Comunicación" },
    { id: "trabajo-equipo", nombre: "Trabajo en Equipo" },
    { id: "resolucion", nombre: "Resolución de Problemas" },
    { id: "adaptabilidad", nombre: "Adaptabilidad" },
    { id: "creatividad", nombre: "Creatividad" },
    { id: "gestion-tiempo", nombre: "Gestión del Tiempo" },
    { id: "pensamiento-critico", nombre: "Pensamiento Crítico" },
  ];
  
  const isAllSkillsSelected = selectedSkills.length === skills.length;
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(s => s !== skillId)
        : [...prev, skillId]
    );
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _toggleAllSkills = () => {
    if (isAllSkillsSelected) {
      setSelectedSkills([]);
    } else {
      setSelectedSkills(skills.map(s => s.id));
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getSkillsLabel = () => {
    if (selectedSkills.length === 0) return "Seleccionar skills";
    if (isAllSkillsSelected) return "Todas las skills";
    if (selectedSkills.length === 1) {
      return skills.find(s => s.id === selectedSkills[0])?.nombre || "";
    }
    return `${selectedSkills.length} skills`;
  };
  
  // Get selected participant name
  const getSelectedParticipanteName = () => {
    if (!selectedParticipante) return "";
    return participantes.find(p => p.id === selectedParticipante)?.nombre || "";
  };
  
  // Get selected skills names
  const getSelectedSkillsNames = () => {
    if (selectedSkills.length === 0) return "";
    if (isAllSkillsSelected) return "todas las skills";
    return selectedSkills
      .map(id => skills.find(s => s.id === id)?.nombre)
      .filter(Boolean)
      .join(" y ");
  };
  
  // Generate dynamic chart title based on selection
  const getChartTitle = (baseTitle: string) => {
    if (vistaMetricas === "global") return baseTitle;
    
    if (vistaMetricas === "comparar") {
      return getComparisonTitle(baseTitle);
    }
    
    // Individual mode
    const participante = getSelectedParticipanteName();
    const skillsText = getSelectedSkillsNames();
    
    if (!participante && !skillsText) return baseTitle;
    
    let title = baseTitle;
    if (participante) {
      title += ` - ${participante}`;
    }
    if (skillsText) {
      title += ` (${skillsText})`;
    }
    return title;
  };
  
  // Generate mock data for individual view based on participant and skills
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getIndividualData = (baseData: Array<{ name?: string; label?: string; value?: number; [key: string]: unknown }>) => {
    if (vistaMetricas === "global" || !selectedParticipante) return baseData;
    
    // Generate slightly different data for each participant (mock)
    const participantIndex = parseInt(selectedParticipante) || 1;
    const modifier = (participantIndex * 7) % 20 - 10; // -10 to +10 variation
    
    return baseData.map(item => {
      const newItem = { ...item };
      if (typeof item.value === 'number') {
        newItem.value = Math.max(0, Math.min(100, item.value + modifier + Math.floor(Math.random() * 10)));
      }
      return newItem;
    });
  };
  
  // Generate comparison data for multiple participants
  const generateComparisonData = (participantId: string, seed: number) => {
    const participantName = participantes.find(p => p.id === participantId)?.nombre || `Persona ${participantId}`;
    const baseValue = 60 + (seed * 7) % 30; // 60-90 range
    return {
      id: participantId,
      name: participantName,
      liderazgo: Math.min(100, baseValue + (seed * 3) % 15),
      comunicacion: Math.min(100, baseValue + (seed * 5) % 20),
      "trabajo-equipo": Math.min(100, baseValue + (seed * 7) % 18),
      resolucion: Math.min(100, baseValue + (seed * 11) % 22),
      adaptabilidad: Math.min(100, baseValue + (seed * 13) % 16),
      creatividad: Math.min(100, baseValue + (seed * 17) % 25),
      "gestion-tiempo": Math.min(100, baseValue + (seed * 19) % 20),
      "pensamiento-critico": Math.min(100, baseValue + (seed * 23) % 19),
    };
  };
  
  // Get comparison chart data
  const getComparisonChartData = () => {
    if (selectedParticipantes.length === 0 || selectedSkills.length === 0) {
      return [];
    }
    
    // Generate data for each selected skill comparing all selected participants
    return selectedSkills.map(skillId => {
      const skillName = skills.find(s => s.id === skillId)?.nombre || skillId;
      const dataPoint: Record<string, string | number> = { skill: skillName };
      
      selectedParticipantes.forEach((pId, index) => {
        const pData = generateComparisonData(pId, parseInt(pId) || index + 1);
        const skillValue = pData[skillId as keyof typeof pData];
        const pName = participantes.find(p => p.id === pId)?.nombre || `Persona ${pId}`;
        dataPoint[pName] = typeof skillValue === 'number' ? skillValue : 0;
      });
      
      return dataPoint;
    });
  };
  
  // Check if comparison mode is ready to show data
  const isComparisonReady = vistaMetricas === "comparar" && selectedParticipantes.length >= 1 && selectedSkills.length >= 1;
  
  const [queryInput, setQueryInput] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [generatedChart, setGeneratedChart] = useState<ChartData | null>(null);
  const resultScrollRef = useRef<HTMLDivElement>(null);
  
  // Save dialog state
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Saved analyses
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  // Mock data for heatmap
  const heatmapData = [
    [3, 2, 1, 2, 3],
    [2, 3, 2, 1, 2],
    [1, 2, 3, 2, 1],
    [2, 1, 2, 3, 2],
    [3, 2, 1, 2, 3],
  ];

  const competenciasData = [
    { label: "Liderazgo", value: 85 },
    { label: "Comunicación", value: 78 },
    { label: "Trabajo en Equipo", value: 92 },
    { label: "Resolución", value: 65 },
    { label: "Adaptabilidad", value: 70 },
  ];

  // Metrics context for AI
  const metricsContext = {
    participacionTotal: 89,
    ahorroMensual: 15,
    matrizAnalisisCritico: {
      altaPotencia: 5,
      necesitaDesarrollo: 8,
      buenEjecutor: 7,
      requiereAtencion: 5,
    },
    competencias: competenciasData,
    sesgosLiderazgo: {
      autoritario: 25,
      consensuador: 30,
      evitativo: 15,
      transformador: 30,
      estiloDominante: "Transformador",
    },
    metricasVocales: {
      confianza: 65,
      vacilacion: 35,
    },
    rendimientoGeneral: 78,
  };

  // Load saved analyses
  useEffect(() => {
    const loadSavedAnalyses = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setSavedAnalyses(data as SavedAnalysis[]);
      }
    };
    loadSavedAnalyses();
  }, [user]);

  useEffect(() => {
    if (resultScrollRef.current) {
      resultScrollRef.current.scrollTop = resultScrollRef.current.scrollHeight;
    }
  }, [analysisResult]);

  // Parse chart data when analysis is complete
  useEffect(() => {
    if (analysisResult && !isAnalyzing) {
      const { textContent, chartData } = parseChartData(analysisResult);
      if (chartData) {
        setAnalysisResult(textContent);
        setGeneratedChart(chartData);
      }
    }
  }, [analysisResult, isAnalyzing]);

  const handleAnalysis = async () => {
    if (!queryInput.trim() || isAnalyzing) return;

    const currentQuery = queryInput.trim();
    setLastQuery(currentQuery);
    setIsAnalyzing(true);
    setAnalysisResult("");
    setGeneratedChart(null);

    try {
      const resp = await fetch(ANALYSIS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          query: currentQuery,
          metricsContext
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({ error: "Error de conexión" }));
        if (resp.status === 429) {
          toast.error("Límite de solicitudes excedido. Por favor intenta más tarde.");
        } else if (resp.status === 402) {
          toast.error("Se requiere agregar créditos a tu cuenta.");
        } else {
          toast.error(errorData.error || "Error al generar el análisis");
        }
        throw new Error(errorData.error || "Error de conexión");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let resultContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              resultContent += content;
              setAnalysisResult(resultContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setQueryInput("");
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAnalysis();
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setGeneratedChart(null);
    setLastQuery("");
  };

  // Save analysis to database
  const handleSaveAnalysis = async () => {
    if (!user || !saveName.trim()) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('saved_analyses').insert({
        user_id: user.id,
        name: saveName.trim(),
        query: lastQuery,
        text_content: analysisResult,
        chart_type: generatedChart?.chartType || null,
        chart_title: generatedChart?.title || null,
        chart_data: generatedChart?.data || null,
        chart_description: generatedChart?.description || null,
      });

      if (error) throw error;

      toast.success("Análisis guardado exitosamente");
      setShowSaveDialog(false);
      setSaveName("");
      
      // Reload saved analyses
      const { data } = await supabase
        .from('saved_analyses')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setSavedAnalyses(data as SavedAnalysis[]);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error al guardar el análisis");
    } finally {
      setIsSaving(false);
    }
  };

  // Export full report as HTML document
  const handleExportReport = () => {
    const date = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Build report content based on selected informes
    let reportSections = '';
    
    if (selectedInformes.includes("analisis1")) {
      reportSections += `
        <div class="section">
          <h3>Competencias por Área</h3>
          <table>
            ${competenciasData.map(item => `
              <tr><td>${item.label}</td><td>${item.value}%</td></tr>
            `).join('')}
          </table>
        </div>
      `;
    }
    
    if (selectedInformes.includes("matriz-critico")) {
      reportSections += `
        <div class="section">
          <h3>Matriz de Análisis Crítico</h3>
          <p>Alta potencia: ${metricsContext.matrizAnalisisCritico.altaPotencia}</p>
          <p>Necesita desarrollo: ${metricsContext.matrizAnalisisCritico.necesitaDesarrollo}</p>
          <p>Buen ejecutor: ${metricsContext.matrizAnalisisCritico.buenEjecutor}</p>
          <p>Requiere atención: ${metricsContext.matrizAnalisisCritico.requiereAtencion}</p>
        </div>
      `;
    }
    
    if (selectedInformes.includes("nivel-potencial")) {
      reportSections += `
        <div class="section">
          <h3>Nivel Actual vs. Potencial</h3>
          <table>
            <tr><th>Área</th><th>Actual</th><th>Potencial</th></tr>
            <tr><td>Liderazgo</td><td>65%</td><td>85%</td></tr>
            <tr><td>Comunicación</td><td>72%</td><td>88%</td></tr>
            <tr><td>Estrategia</td><td>58%</td><td>80%</td></tr>
            <tr><td>Innovación</td><td>70%</td><td>90%</td></tr>
          </table>
        </div>
      `;
    }
    
    if (selectedInformes.includes("patrones-riesgo")) {
      reportSections += `
        <div class="section">
          <h3>Patrones de Riesgo</h3>
          <p>Tendencia de riesgo analizada durante los últimos 6 meses.</p>
        </div>
      `;
    }
    
    if (selectedInformes.includes("clima-laboral")) {
      reportSections += `
        <div class="section">
          <h3>Clima Laboral</h3>
          <table>
            <tr><td>Satisfacción</td><td>78%</td></tr>
            <tr><td>Compromiso</td><td>82%</td></tr>
            <tr><td>Bienestar</td><td>70%</td></tr>
            <tr><td>Colaboración</td><td>85%</td></tr>
          </table>
        </div>
      `;
    }
    
    // Add comparison data if in compare mode
    if (vistaMetricas === "comparar" && isComparisonReady) {
      const comparisonData = getComparisonChartData();
      reportSections += `
        <div class="section">
          <h3>Comparativa de Participantes</h3>
          <p>Personas: ${selectedParticipantes.map(id => participantes.find(p => p.id === id)?.nombre).filter(Boolean).join(" vs ")}</p>
          <p>Skills: ${selectedSkills.map(id => skills.find(s => s.id === id)?.nombre).filter(Boolean).join(", ")}</p>
          <table>
            <tr>
              <th>Skill</th>
              ${selectedParticipantes.map(pId => `<th>${participantes.find(p => p.id === pId)?.nombre}</th>`).join('')}
            </tr>
            ${comparisonData.map(row => `
              <tr>
                <td>${row.skill}</td>
                ${selectedParticipantes.map(pId => {
                  const pName = participantes.find(p => p.id === pId)?.nombre || '';
                  return `<td>${row[pName]}%</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
    
    // Add Humi analysis if exists
    if (analysisResult) {
      reportSections += `
        <div class="section">
          <h3>Análisis de Humi</h3>
          <p class="query"><strong>Consulta:</strong> ${lastQuery}</p>
          <div class="analysis">${analysisResult.replace(/\n/g, '<br>')}</div>
          ${generatedChart ? `
            <div class="chart-info">
              <h4>${generatedChart.title}</h4>
              <p>${generatedChart.description}</p>
              <table>
                ${generatedChart.data.map(d => `<tr><td>${d.name}</td><td>${d.value}</td></tr>`).join('')}
              </table>
            </div>
          ` : ''}
        </div>
      `;
    }
    
    // Add saved analyses
    if (savedAnalyses.length > 0) {
      reportSections += `
        <div class="section">
          <h3>Informes Guardados</h3>
          ${savedAnalyses.map(a => `
            <div class="saved-analysis">
              <h4>${a.name}</h4>
              <p class="query"><strong>Consulta:</strong> ${a.query}</p>
              <p>${a.text_content || ''}</p>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Informe de Métricas - ${date}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; color: #333; }
          h1 { color: #1a1a2e; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
          h2 { color: #4f46e5; margin-top: 30px; }
          h3 { color: #1a1a2e; margin-top: 25px; padding: 10px; background: #f5f5f7; border-radius: 8px; }
          h4 { color: #666; margin-top: 15px; }
          .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; background: #fff; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: #f9fafb; font-weight: 600; }
          .query { color: #666; font-style: italic; margin-bottom: 10px; }
          .analysis { background: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6; }
          .chart-info { background: #eef2ff; padding: 15px; border-radius: 8px; margin-top: 15px; }
          .saved-analysis { margin: 15px 0; padding: 15px; border-left: 3px solid #4f46e5; background: #fafafa; }
          .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; color: #666; }
          @media print { body { padding: 20px; } .section { break-inside: avoid; } }
        </style>
      </head>
      <body>
        <h1>📊 Informe de Métricas</h1>
        <div class="header-info">
          <span>Fecha: ${date}</span>
          <span>Vista: ${vistaMetricas === 'individual' ? 'Individual' : vistaMetricas === 'comparar' ? 'Comparativa' : 'Global'}</span>
        </div>
        
        <h2>Resumen Ejecutivo</h2>
        <div class="section">
          <p><strong>Participación Total:</strong> ${metricsContext.participacionTotal}%</p>
          <p><strong>Rendimiento General:</strong> ${metricsContext.rendimientoGeneral}%</p>
          <p><strong>Estilo de Liderazgo Dominante:</strong> ${metricsContext.sesgosLiderazgo.estiloDominante}</p>
        </div>
        
        ${reportSections}
        
        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 12px;">
          <p>Generado por Humétrica - ${date}</p>
        </footer>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe-metricas-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Informe exportado");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar informes
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover border border-border z-50 min-w-[220px] max-h-[400px] overflow-y-auto">
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
                {savedAnalyses.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Informes Guardados</div>
                    {savedAnalyses.map((analysis) => (
                      <DropdownMenuItem key={analysis.id} onSelect={() => {
                        setAnalysisResult(analysis.text_content);
                        setLastQuery(analysis.query);
                        if (analysis.chart_type && analysis.chart_data) {
                          setGeneratedChart({
                            chartType: analysis.chart_type as ChartData['chartType'],
                            title: analysis.chart_title || "",
                            data: analysis.chart_data as ChartData['data'],
                            description: analysis.chart_description || "",
                          });
                        } else {
                          setGeneratedChart(null);
                        }
                      }} className="cursor-pointer flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{analysis.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center bg-secondary rounded-lg p-0.5">
              {["equipo", "individual", "global", "comparar"].map((vista) => (
                <Button key={vista} variant="ghost" size="sm" className={`gap-1.5 h-7 px-3 rounded-md transition-all ${vistaMetricas === vista ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setVistaMetricas(vista as typeof vistaMetricas)}>
                  {vista === "equipo" && <UsersRound className="h-3.5 w-3.5" />}
                  {vista === "individual" && <User className="h-3.5 w-3.5" />}
                  {vista === "global" && <Users className="h-3.5 w-3.5" />}
                  {vista === "comparar" && <GitCompare className="h-3.5 w-3.5" />}
                  {vista.charAt(0).toUpperCase() + vista.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button size="sm" className="gap-2 bg-primary text-primary-foreground" onClick={handleExportReport}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 grid grid-cols-12 gap-4 overflow-hidden">
          {vistaMetricas === "equipo" ? (
            <div className="col-span-12 overflow-y-auto">
              <EquipoPanel />
            </div>
          ) : (
            <>
              {!isAllSelected && (
                <div className="col-span-6 flex flex-col gap-4 overflow-hidden">
                  <div className="bg-card border border-border rounded-lg flex flex-col h-full">
                    <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-sm">🤖</span>
                        </div>
                        <h3 className="font-semibold text-sm">Consultas & Análisis</h3>
                      </div>
                      {(analysisResult || generatedChart) && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => setShowSaveDialog(true)} title="Guardar análisis">
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => {
                            let content = `Consulta: ${lastQuery}\n\n`;
                            if (analysisResult) content += `Análisis:\n${analysisResult}\n\n`;
                            if (generatedChart) {
                              content += `Gráfica: ${generatedChart.title}\nTipo: ${generatedChart.chartType}\nDescripción: ${generatedChart.description}\nDatos:\n${JSON.stringify(generatedChart.data, null, 2)}`;
                            }
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `analisis-${new Date().toISOString().split('T')[0]}.txt`;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            toast.success("Análisis descargado");
                          }} title="Descargar análisis">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={clearAnalysis} title="Limpiar">
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-3 border-b border-border shrink-0">
                      <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary shrink-0">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input placeholder="Pregunta a Humi sobre tus métricas..." className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm" value={queryInput} onChange={(e) => setQueryInput(e.target.value)} onKeyDown={handleKeyPress} disabled={isAnalyzing} />
                        <Button size="icon" className="rounded-lg h-7 w-7 bg-primary shrink-0" onClick={handleAnalysis} disabled={isAnalyzing || !queryInput.trim()}>
                          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-1">
                      {(analysisResult || generatedChart) ? (
                        <div className="p-3" ref={resultScrollRef}>
                          {analysisResult && <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{analysisResult}</div>}
                          {generatedChart && <DynamicChart chartData={generatedChart} />}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                            <BarChart3 className="h-6 w-6 text-primary" />
                          </div>
                          <p className="text-sm text-muted-foreground">Pregunta a Humi para generar análisis</p>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              )}

              <div className={`${isAllSelected ? "col-span-12 grid grid-cols-3 gap-4" : "col-span-6 flex flex-col gap-4"} overflow-y-auto`}>
                {selectedInformes.includes("analisis1") && (
                  <div className="bg-card border border-border rounded-lg p-4 shrink-0">
                    <h3 className="text-sm font-semibold mb-4">{getChartTitle("Competencias por Área")}</h3>
                    <div className="space-y-3">
                      {competenciasData.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedInformes.includes("matriz-critico") && (
                  <div className="bg-card border border-border rounded-lg p-4 shrink-0">
                    <h3 className="text-sm font-semibold mb-3">{getChartTitle("Matriz de Análisis Crítico")}</h3>
                    <div className="grid grid-cols-5 gap-1.5">
                      {heatmapData.flat().map((value, i) => (
                        <div key={i} className={`h-10 rounded-md ${value === 1 ? 'bg-primary/20' : value === 2 ? 'bg-primary/50' : 'bg-primary'}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guardar Análisis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre del informe</label>
              <Input placeholder="Ej: Análisis de liderazgo Q4" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveAnalysis} disabled={!saveName.trim() || isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// En desarrollo, renderizar directamente sin ProtectedRoute
const Metricas = () => {
  // Modo desarrollo: permitir acceso directo
  const isDevelopment = 
    import.meta.env.DEV || 
    import.meta.env.MODE === 'development' || 
    typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isDevelopment) {
    return <MetricasContent />;
  }

  // En producción, usar ProtectedRoute
  return (
    <ProtectedRoute requiredRole="admin">
      <MetricasContent />
    </ProtectedRoute>
  );
};

export default Metricas;
