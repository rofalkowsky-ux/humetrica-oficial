import { useState, useEffect } from "react";
import { Lightbulb, X, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Tips contextuales para diferentes elementos de la UI
export const helpTips = {
  vistaGlobal: "Vista Global muestra métricas agregadas de todo el equipo para tener una perspectiva general del rendimiento.",
  vistaEquipo: "Vista Equipo permite explorar el rendimiento de cada miembro individualmente con indicadores de riesgo.",
  vistaComparar: "Modo Comparación permite analizar las diferencias entre 2 o más participantes en las 6 dimensiones.",
  selectorAnalisis: "Selecciona qué tipo de análisis deseas visualizar. Cada informe ofrece una perspectiva diferente.",
  reanalizar: "Reanaliza los datos con contexto adicional para obtener insights más precisos.",
  exportar: "Exporta los resultados del análisis en formato PDF o imagen para compartir con tu equipo.",
  dimensionesIBO: "El IBO (Índice de Brecha Operacional) mide la distancia entre expectativas y resultados.",
  dimensionesIFD: "El IFD (Índice de Fricción Decisional) indica el nivel de desalineación en la toma de decisiones.",
  radarCompetencias: "El radar muestra el perfil de competencias. Áreas cerca del centro necesitan desarrollo.",
  seleccionParticipantes: "Selecciona múltiples personas para compararlas en todas las dimensiones de análisis.",
};

// Tips aleatorios que aparecen periódicamente
const randomTips = [
  {
    icon: Lightbulb,
    title: "💡 Consejo",
    message: "Usa el modo Comparar para identificar patrones de desalineación entre miembros del equipo.",
  },
  {
    icon: Sparkles,
    title: "✨ Tip rápido",
    message: "Haz clic en 'Reanalizar' después de eventos importantes para actualizar las métricas.",
  },
  {
    icon: HelpCircle,
    title: "📊 Sabías que...",
    message: "Las dimensiones con mayor dispersión suelen indicar oportunidades de mejora en comunicación.",
  },
  {
    icon: Lightbulb,
    title: "💡 Consejo",
    message: "El IBO alto sugiere que las expectativas no están bien alineadas con la realidad operativa.",
  },
  {
    icon: Sparkles,
    title: "✨ Tip rápido",
    message: "Exporta tus análisis para compartirlos en reuniones de retrospectiva.",
  },
  {
    icon: HelpCircle,
    title: "📈 Insight",
    message: "Las tendencias en la pestaña Evolución revelan patrones estacionales en el rendimiento.",
  },
  {
    icon: Lightbulb,
    title: "💡 Consejo",
    message: "Revisa los Accionables Prioritarios para intervenciones de alto impacto.",
  },
  {
    icon: Sparkles,
    title: "✨ Tip rápido",
    message: "La vista Equipo te permite ver el nivel de riesgo de cada participante de un vistazo.",
  },
];

// Componente de tooltip de ayuda para hover
interface HelpTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export const HelpTooltip = ({ content, children, side = "top" }: HelpTooltipProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          className="max-w-[250px] bg-popover border-border text-popover-foreground z-50"
        >
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">{content}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Componente de tip flotante aleatorio
interface FloatingTipProps {
  show: boolean;
  onClose: () => void;
  tip: typeof randomTips[0] | null;
}

export const FloatingTip = ({ show, onClose, tip }: FloatingTipProps) => {
  if (!show || !tip) return null;

  const Icon = tip.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-card border-2 border-primary/30 rounded-xl shadow-2xl p-4 max-w-[300px] relative">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl blur-lg -z-10" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3 pr-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground mb-1">{tip.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{tip.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook para mostrar tips aleatorios
export const useRandomTips = (enabled: boolean = true, intervalMs: number = 45000) => {
  const [currentTip, setCurrentTip] = useState<typeof randomTips[0] | null>(null);
  const [showTip, setShowTip] = useState(false);
  const [shownTips, setShownTips] = useState<number[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Mostrar primer tip después de 10 segundos
    const initialTimeout = setTimeout(() => {
      showNextTip();
    }, 10000);

    // Mostrar tips periódicamente
    const interval = setInterval(() => {
      showNextTip();
    }, intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [enabled, intervalMs]);

  const showNextTip = () => {
    // Obtener tips no mostrados
    const availableTips = randomTips
      .map((tip, index) => ({ tip, index }))
      .filter(({ index }) => !shownTips.includes(index));

    // Si ya se mostraron todos, reiniciar
    const tipsToChooseFrom = availableTips.length > 0 
      ? availableTips 
      : randomTips.map((tip, index) => ({ tip, index }));

    if (availableTips.length === 0) {
      setShownTips([]);
    }

    // Seleccionar tip aleatorio
    const randomIndex = Math.floor(Math.random() * tipsToChooseFrom.length);
    const selected = tipsToChooseFrom[randomIndex];

    setCurrentTip(selected.tip);
    setShowTip(true);
    setShownTips(prev => [...prev, selected.index]);

    // Auto-cerrar después de 8 segundos
    setTimeout(() => {
      setShowTip(false);
    }, 8000);
  };

  const closeTip = () => {
    setShowTip(false);
  };

  return { currentTip, showTip, closeTip };
};

// Pequeño indicador de ayuda que se puede añadir junto a elementos
interface HelpIndicatorProps {
  tooltip: string;
  className?: string;
}

export const HelpIndicator = ({ tooltip, className }: HelpIndicatorProps) => {
  return (
    <HelpTooltip content={tooltip}>
      <span className={cn("inline-flex cursor-help", className)}>
        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground hover:text-primary transition-colors" />
      </span>
    </HelpTooltip>
  );
};
