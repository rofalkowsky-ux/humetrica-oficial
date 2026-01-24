import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface CaseData {
  name: string;
  role: string;
}

interface StepAddCaseProps {
  onNext: (data: CaseData) => void;
}

export const StepAddCase = ({ onNext }: StepAddCaseProps) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const isValid = name.trim().length > 0 && role.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext({ name: name.trim(), role: role.trim() });
    }
  };

  return (
    <div>
      <h1 className="humetrica-title mb-2 animate-slide-up">
        Agrega un caso de análisis
      </h1>
      
      <p className="humetrica-subtitle mb-8 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        Vas a observar a una persona del equipo en su contexto de trabajo actual.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Label htmlFor="name" className="humetrica-label">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la persona"
            className="h-12 text-base"
            autoComplete="off"
          />
        </div>

        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <Label htmlFor="role" className="humetrica-label">
            Rol
          </Label>
          <Input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Rol o posición en el equipo"
            className="h-12 text-base"
            autoComplete="off"
          />
        </div>

        <div className="pt-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            type="submit"
            size="lg"
            disabled={!isValid}
            className="w-full sm:w-auto px-8 h-12 text-base font-medium"
          >
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
};
