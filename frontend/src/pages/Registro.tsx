import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HumetricaLogo } from "@/components/HumetricaLogo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const USER_STORAGE_KEY = "user";

export const Registro = () => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    const { error: signUpError } = await signUp(email, password, fullName.trim(), "admin");

    if (signUpError) {
      setIsLoading(false);
      const msg = signUpError.message || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already exists")) {
        setError("Ese email ya está registrado. Iniciá sesión o usá otro email.");
      } else {
        setError(signUpError.message || "Error al crear la cuenta. Intentá de nuevo.");
      }
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setIsLoading(false);
      setError("Cuenta creada. Si configuraste confirmación por email, revisá tu bandeja y luego iniciá sesión.");
      return;
    }

    try {
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({ user_id: session.user.id, role: "admin" }, { onConflict: "user_id" });

      if (roleError) {
        setError("Cuenta creada pero no se pudo asignar el rol. Contactá al administrador.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ rol: "lider" }));
      window.location.href = "/onboarding";
    } catch {
      setError("Error al completar el registro. Intentá iniciar sesión.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Panel izquierdo - Branding (mismo que Auth) */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <HumetricaLogo variant="dark" size="lg" />
          </div>
          <p className="text-lg text-background/70">
            Análisis conductual en equipos de trabajo
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
              Crear cuenta
            </h1>
            <p className="text-muted-foreground text-sm">
              Registro para líderes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Tu nombre"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  )}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  )}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link to="/auth" className="text-primary font-medium hover:underline">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
