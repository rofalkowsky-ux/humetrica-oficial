import { useState } from "react";
import { MenuLateral } from "@/components/config/MenuLateral";
import { CheckCircle2, XCircle, ChevronRight, Clock, Target, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import { HelpTooltip } from "@/components/metricas/HelpTooltips";

const modulosTips = {
  pagina: "Los módulos de diagnóstico evalúan diferentes dimensiones de la dinámica de tu equipo.",
  duracion: "Tiempo estimado que tomará completar el diagnóstico a cada participante.",
  seleccionar: "Haz clic para configurar y asignar este diagnóstico a tus participantes.",
  proximamente: "Este módulo estará disponible pronto. Te notificaremos cuando esté listo.",
  desalineacion: "Mide la brecha entre las expectativas del líder y la realidad operativa del equipo.",
  diagnostico: "Mide la brecha entre las expectativas del líder y la realidad operativa del equipo.",
  evitacion: "Identifica patrones donde las responsabilidades no tienen dueño claro.",
  atencion: "Evalúa el balance entre metas individuales y objetivos del equipo.",
  seguridad: "Analiza el nivel de confianza para expresar ideas sin miedo.",
  conflicto: "Mide la capacidad de debatir constructivamente sin tensiones.",
  compromiso: "Detecta niveles de conexión con las decisiones grupales.",
};

type TipoActividad = "diagnostico" | "evitacion" | "atencion" | "seguridad" | "conflicto" | "compromiso";

interface ActividadCard {
  id: TipoActividad;
  title: string;
  description: string;
  isActive: boolean;
  color: string;
  bgColor: string;
  borderColor: string;
  stats: { label: string; value: string }[];
  tags: string[];
}

const actividadesData: ActividadCard[] = [
  {
    id: "diagnostico",
    title: "Desalineación Operativa",
    description: "Identifica brechas entre la visión del líder y la ejecución del equipo en 6 dimensiones clave.",
    isActive: true,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
  {
    id: "evitacion",
    title: "Evitación de Responsabilidad",
    description: "Detecta patrones donde las responsabilidades se diluyen sin seguimiento claro.",
    isActive: false,
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    borderColor: "border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
  {
    id: "atencion",
    title: "Atención Desalineada",
    description: "Evalúa cómo el equipo prioriza resultados individuales sobre objetivos colectivos.",
    isActive: false,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
  {
    id: "seguridad",
    title: "Seguridad Psicológica",
    description: "Analiza comportamientos que inhiben la confianza y apertura del equipo.",
    isActive: false,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
    borderColor: "border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
  {
    id: "conflicto",
    title: "Miedo al Conflicto",
    description: "Mide la capacidad del equipo para debatir ideas sin tensiones destructivas.",
    isActive: false,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
  {
    id: "compromiso",
    title: "Falta de Compromiso",
    description: "Identifica resistencias y desconexión con las decisiones y metas del equipo.",
    isActive: false,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600",
    stats: [
      { label: "Duración", value: "15-30 min" },
    ],
    tags: [],
  },
];

const ActividadesContent = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<TipoActividad | null>(null);
  const [hoveredActividad, setHoveredActividad] = useState<TipoActividad | null>(null);

  const handleSelectActividad = (id: TipoActividad) => {
    setSelectedActividad(id);
    // TODO: Navigate to configuration or open modal
  };

  return (
    <div className="min-h-screen flex bg-background">
      <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-lg font-semibold">Módulos</h1>
                <p className="text-sm text-muted-foreground">Selecciona una actividad para configurar</p>
              </div>
              <HelpTooltip content={modulosTips.pagina}>
                <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
              </HelpTooltip>
            </div>
          </div>

          {selectedActividad && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedActividad(null)}
            >
              Limpiar selección
            </Button>
          )}
        </header>

        {/* Main content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {actividadesData.map((actividad) => {
                const Icon = actividad.isActive ? CheckCircle2 : XCircle;
                const isSelected = selectedActividad === actividad.id;
                const isHovered = hoveredActividad === actividad.id;

                return (
                  <Card
                    key={actividad.id}
                    className={cn(
                      "relative transition-all duration-300 overflow-hidden group",
                      actividad.isActive
                        ? cn(
                            "cursor-pointer",
                            actividad.borderColor,
                            isHovered && "shadow-lg scale-[1.02]"
                          )
                        : "border-border bg-muted/40 opacity-60 cursor-not-allowed",
                      isSelected && actividad.isActive && "ring-2 ring-primary ring-offset-2"
                    )}
                    onClick={() => actividad.isActive && handleSelectActividad(actividad.id)}
                    onMouseEnter={() => actividad.isActive && setHoveredActividad(actividad.id)}
                    onMouseLeave={() => setHoveredActividad(null)}
                  >
                    {/* Background decoration */}
                    <div
                      className={cn(
                        "absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity",
                        actividad.isActive
                          ? cn(actividad.bgColor, "opacity-20", isHovered && "opacity-40")
                          : "bg-muted opacity-10"
                      )}
                    />

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-transform",
                            actividad.isActive
                              ? cn(actividad.bgColor, isHovered && "scale-110")
                              : "bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-6 w-6",
                              actividad.isActive
                                ? "text-green-600 dark:text-green-400"
                                : "text-muted-foreground/50"
                            )}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          {!actividad.isActive && (
                            <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                              Próximamente
                            </Badge>
                          )}
                          <ChevronRight
                            className={cn(
                              "h-5 w-5 transition-all",
                              actividad.isActive
                                ? cn("text-muted-foreground", isHovered && "translate-x-1 text-primary")
                                : "text-muted-foreground/30"
                            )}
                          />
                        </div>
                      </div>
                      <CardTitle
                        className={cn(
                          "text-xl mt-3 flex items-center gap-2",
                          !actividad.isActive && "text-muted-foreground"
                        )}
                      >
                        {actividad.title}
                        <HelpTooltip
                          content={modulosTips[actividad.id as keyof typeof modulosTips] || actividad.description}
                        >
                          <HelpCircle
                            className={cn(
                              "h-4 w-4 cursor-help",
                              actividad.isActive
                                ? "text-muted-foreground hover:text-primary"
                                : "text-muted-foreground/50"
                            )}
                          />
                        </HelpTooltip>
                      </CardTitle>
                      <CardDescription
                        className={cn(
                          "text-sm leading-relaxed",
                          !actividad.isActive && "text-muted-foreground/70"
                        )}
                      >
                        {actividad.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Stats */}
                      <div className="flex gap-4 mb-4">
                        {actividad.stats.map((stat, idx) => (
                          <HelpTooltip key={idx} content={modulosTips.duracion}>
                            <div
                              className={cn(
                                "flex items-center gap-2 text-sm cursor-help",
                                !actividad.isActive && "opacity-50"
                              )}
                            >
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{stat.label}:</span>
                              <span className="font-medium">{stat.value}</span>
                            </div>
                          </HelpTooltip>
                        ))}
                      </div>

                      {/* Select Button */}
                      <Button
                        size="sm"
                        disabled={!actividad.isActive}
                        className={cn(
                          "w-full transition-all",
                          actividad.isActive
                            ? isSelected
                              ? "bg-primary"
                              : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (actividad.isActive) {
                            handleSelectActividad(actividad.id);
                          }
                        }}
                      >
                        {actividad.isActive
                          ? isSelected
                            ? "Seleccionado"
                            : "Seleccionar"
                          : "No disponible"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick action hint */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Haz clic en una tarjeta para comenzar la configuración de la actividad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Actividades = () => (
  <ProtectedRoute requiredRole="admin">
    <ActividadesContent />
  </ProtectedRoute>
);

export default Actividades;
