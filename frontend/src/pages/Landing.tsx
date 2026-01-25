import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Database, BarChart3, Users, Sparkles, Compass, TrendingUp, CheckCircle2, Star } from "lucide-react";
import { HumetricaLogo } from "@/components/HumetricaLogo";
import { TypingText } from "@/components/TypingText";

export const Landing = () => {
  const navigate = useNavigate();

  const handleConversemos = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HumetricaLogo variant="light" size="md" />
            <Button 
              variant="outline" 
              onClick={handleConversemos}
              className="gap-2"
            >
              Conversemos
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 lg:py-40 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Badge Métricas Humanas */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Star className="h-4 w-4 text-foreground fill-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Métricas Humanas - Psicología + Datos
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                  Conoce como funciona{" "}
                  <br />
                  <TypingText 
                    text="TU EQUIPO" 
                    className="text-primary font-bold tracking-tight"
                    speed={150}
                  />
                </h1>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Observa patrones de comportamiento
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Traduce la conducta observable en datos
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Facilita decisiones prácticas
                    </p>
                  </div>
                </div>
                <div className="animate-fade-up opacity-0 animation-delay-600">
                  <Button variant="hero" size="xl" onClick={() => navigate("/app")}>
                    Acceso a demo
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Mockup */}
              <div className="hidden lg:block">
                <div className="bg-navy rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold text-lg">Humétrica</h3>
                  </div>
                  <div className="flex gap-2 mb-6 border-b border-navy-light pb-2">
                    <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium">
                      SKILLS
                    </button>
                    <button className="px-3 py-1.5 text-muted-foreground rounded text-sm font-medium hover:text-foreground">
                      NODOS
                    </button>
                    <button className="px-3 py-1.5 text-muted-foreground rounded text-sm font-medium hover:text-foreground">
                      RUTAS
                    </button>
                    <button className="px-3 py-1.5 text-muted-foreground rounded text-sm font-medium hover:text-foreground">
                      EQUIPOS
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[73, 50, 55, 75].map((percent, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-navy-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{percent}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <div className="w-24 h-24 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué Hacemos Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <p className="text-sm uppercase tracking-wider text-primary font-semibold">QUÉ HACEMOS</p>
                <div className="h-px w-12 bg-primary" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                <span className="text-primary">HUMÉTRICA</span> observa lo que pasa en los equipos cuando trabajan.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                No interpretamos intenciones ni diagnosticamos personas. Analizamos patrones de comportamiento en situaciones reales y los transformamos en <strong>información accionable</strong>.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Eye, title: "Observación", description: "Comportamiento real en contextos laborales" },
                { icon: Database, title: "Estructuración", description: "Patrones convertidos en datos comparables" },
                { icon: BarChart3, title: "Acción", description: "Información para decisiones concretas" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Lo Hacemos Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <p className="text-sm uppercase tracking-wider text-primary font-semibold">CÓMO LO HACEMOS</p>
                <div className="h-px w-12 bg-primary" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
                Un proceso simple y riguroso
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                { number: "01", title: "Observamos", description: "Comportamiento en contextos laborales concretos" },
                { number: "02", title: "Estructuramos", description: "Lo convertimos en datos comparables en el tiempo" },
                { number: "03", title: "Generamos", description: "Insumos claros para la toma de decisiones" }
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative">
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {item.number}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 mt-4">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Para Qué Sirve Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-primary" />
                <p className="text-sm uppercase tracking-wider text-primary font-semibold">PARA QUÉ SIRVE</p>
                <div className="h-px w-12 bg-primary" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Para tomar mejores <span className="text-primary">decisiones</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Información basada en comportamiento real para cada área crítica de tu equipo.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {[
                { icon: Users, title: "Dinámicas de equipo", description: "Entender cómo interactúan las personas en contextos reales de trabajo" },
                { icon: Sparkles, title: "Desarrollo de habilidades", description: "Identificar oportunidades de crecimiento basadas en comportamiento observable" },
                { icon: Compass, title: "Liderazgo y colaboración", description: "Analizar patrones de influencia y cooperación dentro del equipo" },
                { icon: TrendingUp, title: "Intervenciones con seguimiento", description: "Medir el impacto real de las acciones de mejora implementadas" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="text-6xl text-primary leading-none">"</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              La complejidad humana no se elimina.{" "}
              <span className="text-primary">Se vuelve observable.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Las soft skills no explican a las personas: permiten leer cómo se comportan en un contexto determinado. Ese es el punto de partida para cualquier decisión seria.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                "Sin predicciones mágicas",
                "Sin diagnósticos psicológicos",
                "Conducta + Contexto + Datos"
              ].map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full border border-primary text-primary bg-background text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="animate-fade-up opacity-0 animation-delay-600">
              <Button variant="hero" size="xl" onClick={handleConversemos}>
                Conversemos
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <HumetricaLogo variant="light" size="sm" />
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
              © 2024 Humétrica. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
