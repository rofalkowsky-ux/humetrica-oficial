import { useState } from "react";
import { MenuLateral } from "@/components/config/MenuLateral";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Calendar,
  Edit2,
  Camera,
  Shield,
  Bell,
  Key,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const PerfilContent = () => {
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: "TechCorp Solutions",
    email: "admin@techcorp.com",
    phone: "+52 55 1234 5678",
    address: "Av. Reforma 123, CDMX",
    website: "www.techcorp.com",
    employees: "250",
    founded: "2015",
    industry: "Tecnología",
  });
  const companyInfo = {
    name: "TechCorp Solutions",
    logo: "",
    email: "admin@techcorp.com",
    phone: "+52 55 1234 5678",
    address: "Av. Reforma 123, CDMX",
    website: "www.techcorp.com",
    employees: 250,
    founded: "2015",
    industry: "Tecnología",
    plan: "Enterprise",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {!menuCollapsed && (
        <MenuLateral
          collapsed={menuCollapsed}
          onToggle={() => setMenuCollapsed(!menuCollapsed)}
        />
      )}

      {menuCollapsed && (
        <button
          type="button"
          onClick={() => setMenuCollapsed(false)}
          className="fixed left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full border border-border bg-card shadow-md flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">Perfil de Empresa</h1>
              <p className="text-xs text-muted-foreground">
                Gestiona la información de tu organización
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Plan {companyInfo.plan}
          </Badge>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24 rounded-xl">
                        <AvatarImage src={companyInfo.logo} />
                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-2xl font-bold">
                          TC
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <Input
                              value={companyData.name}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, name: e.target.value })
                              }
                              className="text-2xl font-bold h-auto py-1 px-2 mb-1"
                            />
                          ) : (
                            <h2 className="text-2xl font-bold">{companyData.name}</h2>
                          )}
                          {isEditing ? (
                            <Input
                              value={companyData.industry}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, industry: e.target.value })
                              }
                              className="text-muted-foreground h-auto py-1 px-2"
                            />
                          ) : (
                            <p className="text-muted-foreground">{companyData.industry}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.email}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, email: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span className="truncate">{companyData.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.phone}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, phone: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span>{companyData.phone}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.address}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, address: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span className="truncate">{companyData.address}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.website}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, website: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span className="truncate">{companyData.website}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.employees}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, employees: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span>{companyData.employees} empleados</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm min-w-0">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          {isEditing ? (
                            <Input
                              value={companyData.founded}
                              onChange={(e) =>
                                setCompanyData({ ...companyData, founded: e.target.value })
                              }
                              className="h-8 text-sm flex-1 min-w-0"
                            />
                          ) : (
                            <span>Fundada en {companyData.founded}</span>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <Button className="mt-4" onClick={() => setIsEditing(false)}>
                          Guardar cambios
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Preferencias de cuenta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Notificaciones por email</p>
                        <p className="text-xs text-muted-foreground">
                          Recibe alertas sobre actividades
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Autenticación de dos factores</p>
                        <p className="text-xs text-muted-foreground">
                          Mayor seguridad para tu cuenta
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Cambiar contraseña</p>
                        <p className="text-xs text-muted-foreground">
                          Actualiza tu contraseña regularmente
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Cambiar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Actividad reciente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      action: "Nuevo diagnóstico creado",
                      time: "Hace 2 horas",
                      type: "create",
                    },
                    {
                      action: "Simulación completada",
                      time: "Hace 5 horas",
                      type: "complete",
                    },
                    {
                      action: "Participante agregado",
                      time: "Hace 1 día",
                      type: "add",
                    },
                    {
                      action: "Métricas actualizadas",
                      time: "Hace 2 días",
                      type: "update",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div
                        className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                          activity.type === "create"
                            ? "bg-blue-500"
                            : activity.type === "complete"
                              ? "bg-green-500"
                              : activity.type === "add"
                                ? "bg-purple-500"
                                : "bg-orange-500"
                        }`}
                      />
                      <div className="min-w-0">
                        <p>{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">186</p>
                  <p className="text-xs text-muted-foreground">Participantes activos</p>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-green-500/10 text-green-600"
                  >
                    +12%
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Plan Enterprise</p>
                      <p className="text-xs text-muted-foreground">Acceso completo</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usuarios</span>
                      <span className="font-medium">Ilimitados</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actividades</span>
                      <span className="font-medium">Ilimitadas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Próx. renovación</span>
                      <span className="font-medium">15 Ene 2025</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Gestionar suscripción
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Perfil = () => (
  <ProtectedRoute requiredRole="admin">
    <PerfilContent />
  </ProtectedRoute>
);

export default Perfil;
