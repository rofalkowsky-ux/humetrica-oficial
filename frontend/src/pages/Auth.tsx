import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HumetricaLogo } from "@/components/HumetricaLogo";

const USER_STORAGE_KEY = "user";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Deducir rol a partir del email (simula validación de base de datos)
    const rol = email.toLowerCase().includes("lider") ? "lider" : "equipo";
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ rol }));

    // Redirección con recarga para asegurar la carga del rol
    window.location.href = "/onboarding";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <HumetricaLogo variant="dark" size="lg" />
          </div>
          <p className="text-lg text-background/70">
            Observación conductual para equipos de trabajo.
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <HumetricaLogo variant="light" size="md" className="mx-auto" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Bienvenido a Humétrica
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresá con tu email y contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center mt-6 text-xs text-muted-foreground">
            El rol se asigna según el email. Emails que contienen &quot;lider&quot; ingresan como líder; el resto, como equipo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
