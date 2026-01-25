import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { HumetricaLogo } from "@/components/HumetricaLogo";
import { supabase } from "@/lib/supabase"; // Verifica que esta ruta sea correcta

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Modo desarrollo: Navegar inmediatamente sin esperar autenticación
    // Esto permite probar todas las pantallas sin bloqueos
    setTimeout(() => {
      setIsLoading(false);
      navigate("/app"); // Ir al onboarding por defecto
    }, 300); // Pequeño delay para simular carga
    
    // Intentar autenticación en segundo plano (opcional, no bloquea)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email || "demo@humetrica.com",
        password: password || "demo123",
      });

      if (!error) {
        // Si la autenticación funciona, ir al dashboard
        navigate("/metricas");
      }
    } catch (err) {
      // Ignorar errores en modo desarrollo
      console.log("Modo desarrollo: continuando sin autenticación");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Login con Google");
  };

  // Modo desarrollo: permitir navegación sin autenticación
  const handleSkipAuth = () => {
    navigate("/app"); // Ir al onboarding
  };

  const handleGoToDashboard = () => {
    navigate("/metricas"); // Ir directo al dashboard
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
            <h2 className="text-2xl font-medium text-foreground mb-2">
              Bienvenido
            </h2>
            <p className="text-muted-foreground text-sm">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="demo@humetrica.com (opcional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground"
                  onClick={() => console.log("Recuperar")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="•••••••• (opcional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Entrar"}
            </Button>
          </form>

          <div className="relative my-8">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
              o
            </span>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
            Continuar con Google
          </Button>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="text-foreground font-medium hover:underline"
              onClick={() => console.log("Ir a registro")}
            >
              Regístrate
            </button>
          </p>

          {/* Modo desarrollo: Navegación rápida */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              ⚡ Acceso rápido (modo desarrollo)
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleSkipAuth}
              >
                📋 Onboarding
              </Button>
              <Button
                type="button"
                variant="default"
                size="sm"
                className="flex-1 text-xs"
                onClick={handleGoToDashboard}
              >
                📊 Dashboard
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              O simplemente presiona "Entrar" arriba
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;