import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HumetricaLogo } from "@/components/HumetricaLogo";

export const OlvideContrasena = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <HumetricaLogo variant="light" size="md" className="mb-8" />
      <h1 className="text-xl font-semibold text-foreground mb-2">¿Olvidaste tu contraseña?</h1>
      <p className="text-muted-foreground text-sm text-center max-w-sm mb-6">
        Para restablecer tu contraseña, contactá al administrador o usá la opción de recuperación desde el panel de Supabase.
      </p>
      <Button asChild variant="outline">
        <Link to="/">Volver al inicio</Link>
      </Button>
    </div>
  );
};
