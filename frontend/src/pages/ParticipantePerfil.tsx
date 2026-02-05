import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MenuLateralParticipante } from "@/components/participante/MenuLateralParticipante";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Pencil, Save, X, Shield } from "lucide-react";

const ParticipantePerfilContent = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: user?.email ?? "",
    telefono: "",
    fechaNacimiento: "",
    sexo: "",
    ocupacion: "",
    tarea: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <MenuLateralParticipante />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 bg-card border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Mi Perfil</h1>
          <p className="text-sm text-muted-foreground">Información de tu cuenta</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg">Mis datos</CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar datos
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre" className="text-muted-foreground text-sm">
                      Nombre
                    </Label>
                    {isEditing ? (
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                        placeholder="Tu nombre"
                      />
                    ) : (
                      <p className="text-foreground py-2 border-b border-border">
                        {formData.nombre || "—"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido" className="text-muted-foreground text-sm">
                      Apellido
                    </Label>
                    {isEditing ? (
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange("apellido", e.target.value)}
                        placeholder="Tu apellido"
                      />
                    ) : (
                      <p className="text-foreground py-2 border-b border-border">
                        {formData.apellido || "—"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground text-sm">
                    Email
                  </Label>
                  <p className="text-foreground py-2 border-b border-border">
                    {formData.email || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="text-muted-foreground text-sm">
                      Teléfono
                    </Label>
                    {isEditing ? (
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        placeholder="+54 9 11 1234 5678"
                      />
                    ) : (
                      <p className="text-foreground py-2 border-b border-border">
                        {formData.telefono || "—"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fechaNacimiento" className="text-muted-foreground text-sm">
                      Fecha de nacimiento
                    </Label>
                    {isEditing ? (
                      <Input
                        id="fechaNacimiento"
                        type="date"
                        value={formData.fechaNacimiento}
                        onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                      />
                    ) : (
                      <p className="text-foreground py-2 border-b border-border">
                        {formData.fechaNacimiento || "—"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sexo" className="text-muted-foreground text-sm">
                      Sexo
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.sexo}
                        onValueChange={(value) => handleInputChange("sexo", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                          <SelectItem value="prefiero_no_decir">Prefiero no decir</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-foreground py-2 border-b border-border capitalize">
                        {formData.sexo || "—"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ocupacion" className="text-muted-foreground text-sm">
                      Ocupación
                    </Label>
                    {isEditing ? (
                      <Input
                        id="ocupacion"
                        value={formData.ocupacion}
                        onChange={(e) => handleInputChange("ocupacion", e.target.value)}
                        placeholder="Tu ocupación"
                      />
                    ) : (
                      <p className="text-foreground py-2 border-b border-border">
                        {formData.ocupacion || "—"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tarea" className="text-muted-foreground text-sm">
                    Tarea
                  </Label>
                  {isEditing ? (
                    <Input
                      id="tarea"
                      value={formData.tarea}
                      onChange={(e) => handleInputChange("tarea", e.target.value)}
                      placeholder="Tu tarea o rol"
                    />
                  ) : (
                    <p className="text-foreground py-2 border-b border-border">
                      {formData.tarea || "—"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Política de Privacidad</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fecha de última actualización: 5 de julio de 2025
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  En Humetrica, tu privacidad y la seguridad de tus datos personales son
                  fundamentales. Esta política describe cómo recopilamos, usamos y protegemos tu
                  información, y cómo puedes ejercer tus derechos como usuario.
                </p>
                <p>
                  Procesamos datos conforme a la Ley 25.326 de Protección de Datos Personales
                  (Argentina), el Reglamento General de Protección de Datos (GDPR, UE) y otras
                  normativas vigentes.
                </p>

                <Separator />

                <div>
                  <h4 className="font-semibold text-foreground mb-2">1. ¿Quiénes somos?</h4>
                  <p className="mb-2">
                    Humetrica es una plataforma digital que utiliza inteligencia artificial,
                    análisis de datos y psicología aplicada para evaluar y desarrollar habilidades
                    blandas (soft skills) en personas y organizaciones.
                  </p>
                  <div className="space-y-1">
                    <p>
                      <span className="font-medium text-foreground">Datos de contacto:</span>
                    </p>
                    <p>Email: privacidad@humetrica.com.ar</p>
                    <p>Dirección: Virgen de la Merced 72, San Miguel de Tucumán, Tucumán, Argentina</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    2. ¿Qué datos personales recopilamos?
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <span className="font-medium text-foreground">Datos de registro:</span> nombre,
                      apellido, correo electrónico, teléfono, empresa u organización.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Datos de perfil:</span> fecha de
                      nacimiento, género, ocupación, cargo, intereses profesionales, información
                      sobre habilidades, respuestas a tests y evaluaciones, progreso y resultados de
                      entrenamientos.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Datos de uso:</span> actividad en
                      la plataforma, resultados de evaluaciones, preferencia, fecha y hora de acceso,
                      dirección IP, tipo de dispositivo, sistema operativo y navegador.
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-foreground mb-2">3. Tus derechos</h4>
                  <p>
                    Tienes derecho a acceder, rectificar, eliminar y portar tus datos personales. Para
                    ejercer estos derechos, contáctanos a privacidad@humetrica.com.ar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParticipantePerfil = () => {
  return (
    <ProtectedRoute allowedRoles={["participante"]}>
      <ParticipantePerfilContent />
    </ProtectedRoute>
  );
};

export default ParticipantePerfil;
