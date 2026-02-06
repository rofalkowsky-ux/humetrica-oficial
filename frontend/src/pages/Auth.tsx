import { useState, useEffect } from "react";
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

type RolApp = "lider" | "equipo";

async function applyRoleAndRedirect(roleSupabase: "admin" | "participante", completedOnboarding: boolean) {
  const rolApp: RolApp = roleSupabase === "admin" ? "lider" : "equipo";
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ rol: rolApp }));
  if (completedOnboarding) {
    window.location.href = "/dashboard";
  } else {
    window.location.href = "/onboarding";
  }
}

const Auth = () => {
  const { signIn, signInWithGoogle, user, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir cuando ya hay sesión (ej. vuelta de OAuth con Google)
  useEffect(() => {
    if (!user || !role) return;
    let mounted = true;
    supabase
      .from("user_roles")
      .select("completed_onboarding")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (!mounted) return;
        const completed = data?.completed_onboarding === true;
        applyRoleAndRedirect(role, completed);
      })
      .catch(() => {
        if (mounted) applyRoleAndRedirect(role, false);
      });
    return () => { mounted = false; };
  }, [user, role]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setIsLoading(false);
      setError(signInError.message || "Error al iniciar sesión. Revisá email y contraseña.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setIsLoading(false);
      setError("No se pudo obtener la sesión.");
      return;
    }

    try {
      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role, completed_onboarding")
        .eq("user_id", session.user.id)
        .single();

      if (roleError || !roleRow?.role) {
        setError("Tu usuario no tiene rol asignado. Contactá al administrador.");
        setIsLoading(false);
        return;
      }

      const roleSupabase = roleRow.role as "admin" | "participante";
      const completedOnboarding = roleRow.completed_onboarding === true;
      await applyRoleAndRedirect(roleSupabase, completedOnboarding);
    } catch {
      setError("Error al cargar tu rol. Intentá de nuevo.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message || "Error al iniciar con Google.");
      setIsGoogleLoading(false);
    }
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
              Bienvenido
            </h1>
            <p className="text-muted-foreground text-sm">
              Ingresá a tu cuenta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/olvide-contrasena"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">o</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full bg-background border-border hover:bg-muted/50"
            disabled={isGoogleLoading}
            onClick={handleGoogleLogin}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? "Conectando..." : "Continuar con Google"}
          </Button>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link to="/registro" className="text-primary font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
