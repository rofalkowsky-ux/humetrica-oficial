import { ArrowLeft, Clock, Users2, MessageSquare, Shield, Info, TrendingDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import type { TeamMember } from "./EquipoPanel";

interface MemberDetailViewProps {
  member: TeamMember;
  onBack: () => void;
}

const weeklyObservations = [
  {
    semana: "Semana del 13 de enero",
    eventos: [
      { tipo: "conflict", puntos: 20, descripcion: "Conflicto con producto sobre prioridades" }
    ]
  },
  {
    semana: "Semana del 20 de enero",
    eventos: [
      { tipo: "conflict", puntos: 20, descripcion: null },
      { tipo: "participacion", puntos: 10, descripcion: "Menos participativo/a" }
    ]
  },
  {
    semana: "Semana del 27 de enero",
    eventos: [
      { tipo: "qualityDrop", puntos: 15, descripcion: null },
      { tipo: "comentario", puntos: 0, descripcion: "Code reviews más superficiales" }
    ]
  }
];

const intervenciones = [
  { nombre: "Reconocimiento", valor: 70 },
  { nombre: "Aumento salarial", valor: 60 },
  { nombre: "Nuevo proyecto", valor: 45 },
];

export const MemberDetailView = ({ member, onBack }: MemberDetailViewProps) => {
  const getRiesgoColor = () => {
    switch (member.riesgo) {
      case "alto": return "text-red-500";
      case "medio": return "text-amber-500";
      case "optimo": return "text-emerald-500";
    }
  };

  const getRiesgoLabel = () => {
    switch (member.riesgo) {
      case "alto": return "Alto";
      case "medio": return "Medio";
      case "optimo": return "Óptimo";
    }
  };

  const getEventoIcon = (tipo: string) => {
    switch (tipo) {
      case "conflict":
        return <Info className="h-3.5 w-3.5 text-amber-500" />;
      case "participacion":
        return <Info className="h-3.5 w-3.5 text-amber-500" />;
      case "qualityDrop":
        return <Info className="h-3.5 w-3.5 text-amber-500" />;
      case "comentario":
        return <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />;
      default:
        return <Info className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const getEventoColor = (tipo: string) => {
    switch (tipo) {
      case "conflict":
      case "participacion":
      case "qualityDrop":
        return "text-amber-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al equipo
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{member.nombre}</h2>
            <p className="text-sm text-muted-foreground">{member.rol}</p>
          </div>
        </div>
        <Button className="gap-2 bg-primary">
          <CheckCircle2 className="h-4 w-4" />
          Quick Check
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-14 w-14 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    <Users2 className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{member.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{member.rol}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>30m en rol</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{member.tiempoEnEquipo}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <span className="text-amber-500">♀</span> Motivador principal
                  </p>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {member.etiqueta}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <MessageSquare className="h-3 w-3" /> Comunicación
                  </p>
                  <Badge variant="outline">Directa</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Shield className="h-3 w-3" /> Ante conflictos
                  </p>
                  <Badge variant="outline">Media</Badge>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Índice de Riesgo</h4>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke="hsl(var(--border))"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      stroke={member.riesgo === "alto" ? "#ef4444" : member.riesgo === "medio" ? "#f59e0b" : "#10b981"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${member.score * 3.02} 302`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getRiesgoColor()}`}>{member.score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nivel de riesgo</p>
                    <p className={`font-semibold ${getRiesgoColor()}`}>{getRiesgoLabel()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm">Mejorando</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Confianza: 50%</p>
                    <Progress value={50} className="h-1.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 h-full">
              <h4 className="font-medium mb-4">Patrones Históricos</h4>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de perfil</p>
                  <p className="font-medium">senior_leader</p>
                  <p className="text-xs text-muted-foreground">23 casos similares analizados</p>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Tasa de renuncia histórica</span>
                  <span className="font-bold text-amber-600">65%</span>
                </div>
                <p className="text-xs text-muted-foreground">De 23 perfiles similares, 15 renunciaron</p>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📊</span>
                  <h5 className="font-medium text-sm">Efectividad de Intervenciones</h5>
                </div>
                <div className="space-y-3">
                  {intervenciones.map((intervencion) => (
                    <div key={intervencion.nombre}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className={intervencion.valor >= 60 ? "text-emerald-600" : "text-amber-600"}>
                          {intervencion.nombre}
                        </span>
                        <span className="font-medium">{intervencion.valor}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${intervencion.valor >= 60 ? "bg-emerald-500" : "bg-amber-500"}`}
                          style={{ width: `${intervencion.valor}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2 text-teal-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium text-sm">Recomendación</span>
                </div>
                <p className="text-sm">
                  Para perfiles como {member.nombre.split(' ')[0]}, asignar <strong>proyectos nuevos con tecnologías desafiantes</strong> tiene 75% de efectividad.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="bg-card border border-border rounded-xl p-5 h-full">
              <h4 className="font-medium mb-4">Observaciones Semanales</h4>
              
              <div className="space-y-6">
                {weeklyObservations.map((obs, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-background" />
                    
                    {idx < weeklyObservations.length - 1 && (
                      <div className="absolute -left-0.5 top-4 w-0.5 h-full bg-border" />
                    )}
                    
                    <div className="ml-4">
                      <h5 className="font-medium text-sm mb-2">{obs.semana}</h5>
                      <div className="space-y-2">
                        {obs.eventos.map((evento, eventIdx) => (
                          <div key={eventIdx} className="flex items-start gap-2">
                            {getEventoIcon(evento.tipo)}
                            <div className="flex-1">
                              <span className={`text-sm ${getEventoColor(evento.tipo)}`}>
                                {evento.tipo === "conflict" ? "conflict" : 
                                 evento.tipo === "participacion" ? "Menos participativo/a" :
                                 evento.tipo === "qualityDrop" ? "qualityDrop" :
                                 evento.descripcion}
                              </span>
                              {evento.puntos > 0 && (
                                <span className="text-xs text-amber-600 ml-1">(+{evento.puntos})</span>
                              )}
                              {evento.descripcion && evento.tipo !== "comentario" && evento.tipo !== "participacion" && (
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {evento.descripcion}
                                </p>
                              )}
                              {evento.tipo === "comentario" && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {evento.descripcion}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
