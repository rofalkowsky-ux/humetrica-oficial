import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Database, BarChart3, Users, Sparkles, Compass, TrendingUp, CheckCircle2, Star } from "lucide-react";
import { HumetricaLogo } from "@/components/HumetricaLogo";
import { TypingText } from "@/components/TypingText";
import dashboardImg from '../assets/dashboard-hero.png';

export const Landing = () => {
  const navigate = useNavigate();

  const handleConversemos = () => {
    window.open("https://calendly.com/hola-humetrica/30min", "_blank");
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
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                  <Star className="h-4 w-4 text-foreground fill-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Métricas Humanas - Psicología + Datos
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight tracking-tight">
  Descubre cómo funciona realmente{" "}
  <br />
  <TypingText 
    text="TU EQUIPO" 
    className="text-primary font-extrabold"
    speed={150}
  />
  </h1>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Analizamos patrones de comportamiento grupal
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Detectamos riesgos que pueden convertirse en problemas 
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-lg text-foreground">
                      Te brindamos información para tomar decisiones
                    </p>
                  </div>
                </div>
                <div className="animate-fade-up opacity-0 animation-delay-600">
                <Button variant="hero" size="xl" onClick={handleConversemos}>
                    Agendar una demo
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Right Mockup */}
<div className="block mt-12 lg:mt-0 lg:scale-125 lg:translate-x-12 transition-all duration-500 ease-in-out">
  <img 
    src={dashboardImg} 
    alt="Dashboard Humétrica" 
    className="w-full h-auto drop-shadow-2xl mx-auto"
  />
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
                <span className="text-primary">HUMÉTRICA</span> detecta lo que pasa en los equipos cuando trabajan.
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                No usamos encuestas ni diagnosticamos personas. Analizamos patrones de comportamiento en situaciones reales y los transformamos en <strong>información accionable</strong>.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { icon: Eye, title: "Detección", description: "Comportamiento real en contextos laborales" },
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
                { number: "01", title: "Dilemas", description: "Usamos dilemas que exigen decisiones y activan la conducta subyacente" },
                { number: "02", title: "Análisis", description: "Identificamos patrones de interacción, sesgos y alineación operativa" },
                { number: "03", title: "Informe", description: "Traducimos los hallazgos en métricas claras parala toma de decisiones " }
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



{/* FAQ Section */}
<section className="py-24 bg-slate-50/50">
  <div className="container mx-auto px-4 max-w-4xl">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Preguntas Frecuentes
      </h2>
      <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
    </div>
    
    <div className="grid gap-6">
      {[
        {
          q: "¿Qué es People Analytics?",
          a: "Es el uso de datos y metodología científica para entender y optimizar el comportamiento de los equipos en el trabajo, facilitando decisiones basadas en evidencia."
        },
        {
          q: "¿Cómo ayuda Humétrica a mi equipo?",
          a: "Traducimos la conducta observable en métricas cuantitativas, eliminando sesgos subjetivos y detectando patrones de riesgo grupal de forma temprana."
        },
        {
          q: "¿Para quién está diseñada esta plataforma?",
          a: "Para líderes de equipo y especialistas en RRHH que buscan herramientas precisas para diagnosticar la salud organizacional y mejorar la coherencia interna."
        }
      ].map((faq, index) => (
        <div key={index} className="group p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
          <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary/80">
            {faq.q}
          </h3>
          <p className="text-slate-600 leading-relaxed text-lg">
            {faq.a}
          </p>
        </div>
      ))}
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
              <span className="text-primary">Se vuelve observable para tomar mejores decisiones.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Deja de adivinar qué pasa en tu equipo. Identificamos los patrones de interacción que impactan en tus resultados.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                "Detección precisa",
                "Accionables específicos",
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
              © 2025 Humétrica SAS. Todos los derechos reservados.
            </p>
            <button 
  onClick={() => alert("Política de Privacidad de Humétrica:\n\n1. Recopilamos datos de patrones de interacción para diagnósticos.\n2. Los datos son confidenciales y para fines de People Analytics.\n3. Aplicamos medidas técnicas de seguridad de datos.")}
  className="text-xs text-muted-foreground hover:text-primary underline transition-colors block mt-2"
>
  Política de Privacidad
</button>
          </div>
        </div>
        </footer>

{/* Cookie Banner Optimizado para Celulares */}
<div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm p-5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Utilizamos cookies para analizar el tráfico y mejorar tu experiencia técnica en **Humétrica**.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={(e) => e.currentTarget.closest('.fixed')?.remove()}
              className="flex-1 text-xs bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              Aceptar
            </button>
            <button 
              onClick={(e) => e.currentTarget.closest('.fixed')?.remove()}
              className="flex-1 text-xs bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div> // Esta llave cierra el div principal de la Landing
  );
}