import { useState } from "react";
import { Header } from "@/components/simulation/Header";
import { ConfiguracionPanel } from "@/components/config/ConfiguracionPanel";
import { ListaParticipantes } from "@/components/config/ListaParticipantes";
import { MenuLateral } from "@/components/config/MenuLateral";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface Participante {
  id: number;
  nombre: string;
  email: string;
  estado: string;
  area: string;
}

const Invitaciones = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(true);
  const [selectedParticipante, setSelectedParticipante] = useState<Participante | null>(null);
  const [perfilData, setPerfilData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    telefono2: "",
    area: "",
    tareas: ""
  });

  const handleSelectParticipante = (participante: Participante) => {
    setSelectedParticipante(participante);
    setPerfilData({
      nombre: participante.nombre,
      apellido: "",
      telefono: "",
      telefono2: "",
      area: participante.area,
      tareas: ""
    });
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background flex">
        <MenuLateral collapsed={menuCollapsed} onToggle={() => setMenuCollapsed(!menuCollapsed)} />

        <div className="flex-1 flex flex-col">
          <Header 
            invitacionesEnviadas={24}
            participantesConfirmados={18}
            pendientes={6}
          />

          <div className="flex-1 grid grid-cols-[320px_1fr] gap-6 p-6">
            <div className="overflow-y-auto">
              <ConfiguracionPanel />
            </div>

            <div className="overflow-y-auto">
              <ListaParticipantes onSelectParticipante={handleSelectParticipante} />
            </div>
          </div>
        </div>

        <Sheet open={!!selectedParticipante} onOpenChange={(open) => !open && setSelectedParticipante(null)}>
          <SheetContent className="w-[400px] sm:w-[450px]">
            <SheetHeader>
              <SheetTitle>Perfil del participante</SheetTitle>
              <span className="text-sm text-muted-foreground">100 entrenamientos disponibles</span>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  value={perfilData.nombre} 
                  onChange={(e) => setPerfilData({...perfilData, nombre: e.target.value})} 
                  placeholder="Nombre" 
                />
                <Input 
                  value={perfilData.apellido} 
                  onChange={(e) => setPerfilData({...perfilData, apellido: e.target.value})} 
                  placeholder="Apellido" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  value={perfilData.telefono} 
                  onChange={(e) => setPerfilData({...perfilData, telefono: e.target.value})} 
                  placeholder="Teléfono" 
                />
                <Input 
                  value={perfilData.telefono2}
                  onChange={(e) => setPerfilData({...perfilData, telefono2: e.target.value})}
                  placeholder="Teléfono 2" 
                />
              </div>
              <Input 
                value={perfilData.area} 
                onChange={(e) => setPerfilData({...perfilData, area: e.target.value})} 
                placeholder="Área" 
              />
              <Input 
                value={perfilData.tareas} 
                onChange={(e) => setPerfilData({...perfilData, tareas: e.target.value})} 
                placeholder="Tareas" 
              />
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Guardar cambios
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </ProtectedRoute>
  );
};

export default Invitaciones;