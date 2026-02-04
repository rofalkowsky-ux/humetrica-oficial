import { Search, User, Trash2, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface Participante {
  id: number;
  nombre: string;
  email: string;
  estado: 'Pendiente' | 'Aceptada' | 'Usada';
  area: string;
  asignaciones: number;
}

const participantesData: Participante[] = [
  { id: 1, nombre: "Agustina", email: "agussponcedeleon@gmail.com", estado: "Aceptada", area: "Ventas", asignaciones: 7 },
  { id: 2, nombre: "Alejandro", email: "ale88.quiros@gmail.com", estado: "Aceptada", area: "Ventas", asignaciones: 7 },
  { id: 3, nombre: "Daniela", email: "roxana@humetrica.com.ar", estado: "Pendiente", area: "sinInformar", asignaciones: 5 },
  { id: 4, nombre: "Eduardo", email: "eduardosoraire@gmail.com", estado: "Aceptada", area: "Ventas", asignaciones: 7 },
  { id: 5, nombre: "Giselle", email: "giselle@gmail.com", estado: "Aceptada", area: "PM", asignaciones: 4 },
  { id: 6, nombre: "José", email: "juanvoss@samprand.com", estado: "Usada", area: "Principal", asignaciones: 5 },
  { id: 7, nombre: "Linda", email: "lindacarolinafarhat@gmail.com", estado: "Aceptada", area: "RRHH", asignaciones: 0 },
];

interface ListaParticipantesProps {
  onSelectParticipante?: (participante: Participante) => void;
}

export const ListaParticipantes = ({ onSelectParticipante }: ListaParticipantesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("todos");

  const filteredParticipantes = participantesData.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = estadoFilter === "todos" || p.estado.toLowerCase() === estadoFilter.toLowerCase();
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadgeStyles = (estado: string) => {
    switch (estado) {
      case "Aceptada":
        return "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-50";
      case "Pendiente":
        return "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50";
      case "Usada":
        return "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100";
      default:
        return "";
    }
  };

  const handleLimpiarFiltros = () => {
    setSearchTerm("");
    setEstadoFilter("todos");
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="aceptada">Aceptada</SelectItem>
            <SelectItem value="usada">Usada</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleLimpiarFiltros}>
          Limpiar filtros
        </Button>
      </div>

      <div className="flex-1 overflow-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 sticky top-0">
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium w-10">
                <Checkbox />
              </th>
              <th className="text-left py-3 px-2 font-medium w-10"></th>
              <th className="text-left py-3 px-4 font-medium">Nombre</th>
              <th className="text-left py-3 px-4 font-medium">Email</th>
              <th className="text-center py-3 px-4 font-medium">Estado</th>
              <th className="text-right py-3 px-4 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipantes.map((p) => (
              <tr 
                key={p.id} 
                className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => onSelectParticipante?.(p)}
              >
                <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox />
                </td>
                <td className="py-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </td>
                <td className="py-3 px-4 font-medium">{p.nombre}</td>
                <td className="py-3 px-4 text-primary">{p.email}</td>
                <td className="py-3 px-4 text-center">
                  <Badge variant="outline" className={getEstadoBadgeStyles(p.estado)}>
                    {p.estado}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    {p.estado === "Pendiente" && (
                      <>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                          <Send className="h-3 w-3" />
                          Reenviar
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive">
                          <X className="h-3 w-3" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};