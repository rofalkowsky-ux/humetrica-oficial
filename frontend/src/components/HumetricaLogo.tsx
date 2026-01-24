import { cn } from "@/lib/utils";

interface HumetricaLogoProps {
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export const HumetricaLogo = ({ 
  className, 
  variant = "light",
  size = "md" 
}: HumetricaLogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };

  const textColor = variant === "light" 
    ? "text-foreground" 
    : "text-background";

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <span 
        className={cn(
          "font-bold tracking-tight",
          textColor,
          size === "sm" && "text-lg",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl"
        )}
        style={{ 
          fontFamily: "'Inter', system-ui, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.02em"
        }}
      >
        Humétrica
      </span>
    </div>
  );
};
