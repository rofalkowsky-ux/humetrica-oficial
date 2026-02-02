import { useState } from "react";
import { Users, TrendingDown, TrendingUp, Minus, AlertTriangle, AlertCircle, CheckCircle2, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MemberDetailView } from "./MemberDetailView";

export interface TeamMember {
  id: string;
  nombre: string;
  iniciales: string;
  rol: string;
  score: number;
  tendencia: "subiendo" | "bajando" | "estable";
  etiqueta: string;
  tiempoEnEquipo: string;
  ultimaSemana: { tipo: "positiva" | "negativa"; cantidad: number };
  riesgo: "alto" | "medio" | "optimo";
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    nombre: "Carlos Mendoza",
    iniciales: "CM",
    rol: "Tech Lead",
    score: 95,
    tendencia: "bajando",
    etiqueta: "Impacto",
    tiempoEnEquipo: "48m en equipo",
    ultimaSemana: { tipo: "negativa", cantidad: 1 },
    riesgo: "alto",
  },
  {
    id: "2",
    nombre: "Miguel Torres",
    iniciales: "MT",
    rol: "Backend Developer",
    score: 95,
    tendencia: "estable",
    etiqueta: "Compensación",
    tiempoEnEquipo: "36m en equipo",
    ultimaSemana: { tipo: "negativa", cantidad: 2 },
    riesgo: "alto",
  },
  {
    id: "3",
    nombre: "Laura Fernández",
    iniciales: "LF",
    rol: "QA Engineer",
    score: 45,
    tendencia: "subiendo",
    etiqueta: "Reconocimiento",
    tiempoEnEquipo: "18m en equipo",
    ultimaSemana: { tipo: "negativa", cantidad: 1 },
    riesgo: "medio",
  },
  {
    id: "4",
    nombre: "Sofía Ramírez",
    iniciales: "SR",
    rol: "Sr Developer",
    score: 37,
    tendencia: "bajando",
    etiqueta: "Aprendizaje",
    tiempoEnEquipo: "24m en equipo",
    ultimaSemana: { tipo: "positiva", cantidad: 2 },
    riesgo: "optimo",
  },
  {
    id: "5",
    nombre: "Ana García",
    iniciales: "AG",
    rol: "Product Designer",
    score: 5,
    tendencia: "bajando",
    etiqueta: "Autonomía",
    tiempoEnEquipo: "8m en equipo",
    ultimaSemana: { tipo: "positiva", cantidad: 2 },
    riesgo: "optimo",
  },
];

const getScoreColor = (score: number) => {
  if (score >= 70) return "bg-red-500 text-white";
  if (score >= 40) return "bg-emerald-500 text-white";
  return "bg-emerald-500 text-white";
};

const getTendenciaIcon = (tendencia: TeamMember["tendencia"]) => {
  switch (tendencia) {
    case "subiendo":
      return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
    case "bajando":
      return <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />;
    case "estable":
      return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

const getTendenciaLabel = (tendencia: TeamMember["tendencia"]) => {
  switch (tendencia) {
    case "subiendo":
      return "subiendo";
    case "bajando":
      return "bajando";
    case "estable":
      return "estable";
  }
};

const getEtiquetaColor = (etiqueta: string) => {
  const colors: Record<string, string> = {
    "Impacto": "bg-slate-700 text-white",
    "Compensación": "bg-teal-600 text-white",
    "Reconocimiento": "bg-teal-600 text-white",
    "Aprendizaje": "bg-emerald-500 text-white",
    "Autonomía": "bg-teal-600 text-white",
  };
  return colors[etiqueta] || "bg-primary text-primary-foreground";
};

export const EquipoPanel = () => {
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const riesgoCounts = {
    alto: mockTeamMembers.filter(m => m.riesgo === "alto").length,
    medio: mockTeamMembers.filter(m => m.riesgo === "medio").length,
    optimo: mockTeamMembers.filter(m => m.riesgo === "optimo").length,
  };

  if (selectedMember) {
    return (
      <MemberDetailView 
        member={selectedMember} 
        onBack={() => setSelectedMember(null)} 
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Equipo</h2>
            <p className="text-sm text-muted-foreground">{mockTeamMembers.length} colaboradores</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 bg-red-500/10 text-red-500 border-red-500/30">
              <AlertTriangle className="h-3 w-3" />
              {riesgoCounts.alto} alto riesgo
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-amber-500/10 text-amber-500 border-amber-500/30">
              <AlertCircle className="h-3 w-3" />
              {riesgoCounts.medio} medio
            </Badge>
            <Badge variant="outline" className="gap-1.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
              <CheckCircle2 className="h-3 w-3" />
              {riesgoCounts.optimo} óptimo
            </Badge>
          </div>

          <div className="flex items-center bg-secondary rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-8 px-3 rounded-md transition-all ${viewMode === "cards" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="h-4 w-4" />
              Cards
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1.5 h-8 px-3 rounded-md transition-all ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
          </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${viewMode === "cards" ? "grid grid-cols-3 gap-4 auto-rows-min" : "flex flex-col gap-3"}`}>
        {mockTeamMembers.map((member) => (
          viewMode === "cards" ? (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onClick={() => setSelectedMember(member)}
            />
          ) : (
            <TeamMemberListItem 
              key={member.id} 
              member={member}
              onClick={() => setSelectedMember(member)}
            />
          )
        ))}
      </div>
    </div>
  );
};

const TeamMemberCard = ({ member, onClick }: { member: TeamMember; onClick: () => void }) => {
  return (
    <button 
      type="button"
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50 text-left w-full"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {member.iniciales}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{member.nombre}</h3>
            <p className="text-xs text-muted-foreground">{member.rol}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Badge className={`${getScoreColor(member.score)} text-xs font-medium px-2`}>
            {member.riesgo === "alto" && <AlertTriangle className="h-3 w-3 mr-1" />}
            {member.riesgo === "optimo" && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {member.score}%
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {getTendenciaIcon(member.tendencia)}
            <span>{getTendenciaLabel(member.tendencia)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={`${getEtiquetaColor(member.etiqueta)} text-xs`}>
          {member.etiqueta}
        </Badge>
        <span className="text-xs text-muted-foreground">{member.tiempoEnEquipo}</span>
      </div>

      <div className="pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Última semana: </span>
        <Badge 
          variant="outline" 
          className={`text-xs ${member.ultimaSemana.tipo === "positiva" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-red-500/10 text-red-500 border-red-500/30"}`}
        >
          {member.ultimaSemana.cantidad} {member.ultimaSemana.tipo === "positiva" ? "positivas" : "negativas"}
        </Badge>
      </div>
    </button>
  );
};

const TeamMemberListItem = ({ member, onClick }: { member: TeamMember; onClick: () => void }) => {
  return (
    <button 
      type="button"
      className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50 w-full text-left"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {member.iniciales}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{member.nombre}</h3>
          <p className="text-xs text-muted-foreground">{member.rol}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge className={`${getEtiquetaColor(member.etiqueta)} text-xs`}>
          {member.etiqueta}
        </Badge>
        <span className="text-xs text-muted-foreground">{member.tiempoEnEquipo}</span>
        <Badge 
          variant="outline" 
          className={`text-xs ${member.ultimaSemana.tipo === "positiva" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-red-500/10 text-red-500 border-red-500/30"}`}
        >
          {member.ultimaSemana.cantidad} {member.ultimaSemana.tipo === "positiva" ? "positivas" : "negativas"}
        </Badge>
        <div className="flex items-center gap-2">
          <Badge className={`${getScoreColor(member.score)} text-xs font-medium px-2`}>
            {member.riesgo === "alto" && <AlertTriangle className="h-3 w-3 mr-1" />}
            {member.riesgo === "optimo" && <CheckCircle2 className="h-3 w-3 mr-1" />}
            {member.score}%
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {getTendenciaIcon(member.tendencia)}
            <span>{getTendenciaLabel(member.tendencia)}</span>
          </div>
        </div>
      </div>
    </button>
  );
};