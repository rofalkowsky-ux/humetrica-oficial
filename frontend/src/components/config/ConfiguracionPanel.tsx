import { Mail, Upload, Send, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { HelpTooltip } from "@/components/metricas/HelpTooltips";

const invitacionesTips = {
  panel: "Gestiona las invitaciones a los participantes de tu organización. Los correos serán enviados automáticamente.",
  agregarParticipantes: "Ingresa los emails de los participantes. Puedes separarlos con comas o saltos de línea.",
  subirCSV: "Sube un archivo CSV con los correos electrónicos para agregar múltiples participantes a la vez.",
  procesar: "Procesa los correos ingresados para validarlos antes de enviar las invitaciones.",
  previsualizacion: "Revisa los correos procesados antes de enviar las invitaciones oficiales.",
  enviar: "Envía las invitaciones a todos los participantes listados en la previsualización.",
};

export const ConfiguracionPanel = () => {
  const [emails, setEmails] = useState("juan@humetrica.com.ar,\nroxana@humetrica.com.ar\nmarco@humetrica.com.ar");
  const [previewEmails, setPreviewEmails] = useState<string[]>([]);

  const handleProcesar = () => {
    const parsed = emails.split(/[,\n]/).map(e => e.trim()).filter(e => e);
    setPreviewEmails(parsed);
  };

  const handleLimpiar = () => {
    setPreviewEmails([]);
    setEmails("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold">Invitaciones</h1>
            <p className="text-sm text-muted-foreground">Gestión de invitaciones a participantes</p>
          </div>
          <HelpTooltip content={invitacionesTips.panel}>
            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
          </HelpTooltip>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Agregar participantes</CardTitle>
            <HelpTooltip content={invitacionesTips.agregarParticipantes}>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-help" />
            </HelpTooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="Ingrese emails separados por coma o salto de línea"
            className="min-h-[120px] resize-none"
          />
          <div className="flex items-center justify-between">
            <HelpTooltip content={invitacionesTips.subirCSV}>
              <button className="flex items-center gap-2 text-primary text-sm hover:underline">
                <Upload className="h-4 w-4" />
                Subir CSV
              </button>
            </HelpTooltip>
            <HelpTooltip content={invitacionesTips.procesar}>
              <Button onClick={handleProcesar} className="bg-primary hover:bg-primary/90">
                Procesar
              </Button>
            </HelpTooltip>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Previsualización</CardTitle>
            <HelpTooltip content={invitacionesTips.previsualizacion}>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-primary cursor-help" />
            </HelpTooltip>
          </div>
        </CardHeader>
        <CardContent>
          {previewEmails.length > 0 ? (
            <div className="space-y-2">
              {previewEmails.map((email, i) => (
                <div key={i} className="text-sm py-1 px-2 bg-muted rounded">
                  {email}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aún no agregaste correos.</p>
          )}
          <div className="flex items-center justify-between mt-4">
            <button 
              onClick={handleLimpiar}
              className="text-primary text-sm hover:underline"
              disabled={previewEmails.length === 0}
            >
              Limpiar
            </button>
            <HelpTooltip content={invitacionesTips.enviar}>
              <Button 
                className="bg-primary hover:bg-primary/90"
                disabled={previewEmails.length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </HelpTooltip>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};