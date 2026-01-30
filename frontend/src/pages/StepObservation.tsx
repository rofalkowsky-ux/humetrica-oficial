import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const dilemas = [
  {
    id: 1,
    dimension: "Prioridad",
    texto: `Tu equipo está finalizando una entrega crítica para un cliente importante.

Faltan 2 días para el deadline.

El trabajo funciona correctamente, pero le falta:
- Documentación completa
- Testing exhaustivo
- Detalles de pulido

Para completar TODO necesitarían 4 días más.`,
    pregunta: "¿Qué le decís al equipo?",
    opciones: [
      { id: "A", texto: 'Entreguemos lo que tenemos. Funciona y es mejor cumplir el deadline.' },
      { id: "B", texto: 'Prioricemos las funciones críticas. Lo secundario queda para después.' },
      { id: "C", texto: 'Negociemos 2 días más con el cliente. Prefiero entregar bien que rápido.' },
      { id: "D", texto: 'Terminen todo correctamente. Yo manejo la relación con el cliente.' },
    ],
  },
  {
    id: 2,
    dimension: "Criterio de Validación",
    texto: `Un miembro del equipo resolvió un problema urgente.

La solución:
- Funcionó perfectamente
- El cliente está satisfecho
- PERO no siguió el procedimiento estándar
- Usó un atajo técnico que "no debería" usarse

El problema está resuelto.
El método fue irregular.`,
    pregunta: "¿Cómo reaccionás?",
    opciones: [
      { id: "A", texto: 'Bien hecho. Lo importante es que funciona. Sigamos adelante.' },
      { id: "B", texto: 'Está bien por esta vez, pero la próxima sigamos el proceso.' },
      { id: "C", texto: 'Funciona, pero documentá por qué no seguiste el procedimiento.' },
      { id: "D", texto: 'El resultado es bueno, pero rehacelo siguiendo el estándar.' },
    ],
  },
  {
    id: 3,
    dimension: "Umbral de Acción",
    texto: `Hay señales de que un proveedor clave no está funcionando bien:
- 3 entregas con demoras en el último mes
- Calidad inconsistente
- Feedback informal negativo de tu equipo

Cambiar de proveedor implica:
- 2 semanas de transición
- Riesgo de interrumpir operación actual`,
    pregunta: "¿Qué hacés?",
    opciones: [
      { id: "A", texto: 'Cambio de proveedor ahora. Las señales son suficientes.' },
      { id: "B", texto: 'Lo monitoreo 30 días más antes de decidir.' },
      { id: "C", texto: 'Pido a mi equipo que prepare un análisis detallado antes de moverme.' },
      { id: "D", texto: 'Escalo la decisión a mi superior.' },
    ],
  },
  {
    id: 4,
    dimension: "Interpretación de Reglas",
    texto: `Un cliente importante solicita una modificación que:
- No está en el contrato estándar
- Es técnicamente simple (2 horas de trabajo)
- Podría sentar precedente para otros clientes

Tu política dice: "Toda excepción requiere aprobación del líder."`,
    pregunta: "¿Qué le decís al equipo?",
    opciones: [
      { id: "A", texto: 'Háganlo. Es un cliente importante y no cuesta nada.' },
      { id: "B", texto: 'Evalúen si realmente ayuda al cliente. Si sí, háganlo.' },
      { id: "C", texto: 'Díganle que necesitamos 24hs para evaluar el impacto.' },
      { id: "D", texto: 'No. Ofrézcanle alternativas dentro del estándar.' },
    ],
  },
  {
    id: 5,
    dimension: "Asunción de Riesgo",
    texto: `Oportunidad de cerrar un cliente grande.

Análisis interno indica:
- 40% de probabilidad de éxito
- Si funciona: +$500k en ingresos
- Si falla: 3 semanas de trabajo perdidas

Necesitan tu decisión ahora.`,
    pregunta: "¿Qué decidís?",
    opciones: [
      { id: "A", texto: 'Lo tomamos. El retorno potencial justifica el riesgo.' },
      { id: "B", texto: 'Invertimos 1 semana más en análisis antes de comprometernos.' },
      { id: "C", texto: 'No lo tomamos. El riesgo es demasiado alto.' },
      { id: "D", texto: 'Lo tomamos pero con compromiso parcial.' },
    ],
  },
  {
    id: 6,
    dimension: "Atribución de Responsabilidad",
    texto: `El sistema cayó en producción durante 2 horas.

Investigación inicial muestra:
- El proceso de deploy se siguió correctamente
- La persona que ejecutó tiene buen historial
- Pero el procedimiento no contemplaba este caso`,
    pregunta: "¿Qué hacés primero?",
    opciones: [
      { id: "A", texto: 'Reunión 1-1 con quien ejecutó para entender su visión.' },
      { id: "B", texto: 'Revisar el proceso de deploy completo para ver qué falla.' },
      { id: "C", texto: 'Reunión de equipo para analizar qué pasó y evitarlo.' },
      { id: "D", texto: 'Documentar el incidente y seguir adelante.' },
    ],
  },
];

export const StepObservation = ({ onComplete }: { onComplete: () => void }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentDilema = dilemas[activeStep];
  const isLastStep = activeStep === dilemas.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setActiveStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      {/* Indicador de Progreso Interno */}
      <div className="flex gap-1.5 mb-8">
        {dilemas.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= activeStep ? "bg-primary" : "bg-humetrica-border"
            }`} 
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Dimensión: {currentDilema.dimension}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {activeStep + 1} / {dilemas.length}
        </span>
      </div>

      <div key={activeStep} className="animate-slide-up">
        {/* Escenario */}
        <div className="bg-card border border-humetrica-border-subtle rounded-2xl p-7 mb-8 shadow-sm">
          <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-[17px]">
            {currentDilema.texto}
          </p>
        </div>

        {/* Pregunta */}
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          {currentDilema.pregunta}
        </h2>

        {/* Opciones */}
        <div className="grid gap-3 mb-10">
          {currentDilema.opciones.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setAnswers({ ...answers, [currentDilema.id]: opt.id })}
              className={`group p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                answers[currentDilema.id] === opt.id 
                  ? "border-primary bg-primary/5 ring-1 ring-primary" 
                  : "border-humetrica-border hover:border-primary/40 bg-card"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  answers[currentDilema.id] === opt.id ? "bg-primary border-primary text-white" : "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {answers[currentDilema.id] === opt.id ? <Check size={14} strokeWidth={4} /> : <span className="text-[10px] font-bold">{opt.id}</span>}
                </div>
                <span className={`flex-1 text-sm font-medium ${answers[currentDilema.id] === opt.id ? "text-primary" : "text-foreground/80"}`}>
                  {opt.texto}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center pt-6 border-t border-humetrica-border-subtle">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={activeStep === 0}
          className="text-muted-foreground"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Anterior
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!answers[currentDilema.id]}
          size="lg"
          className="px-10 h-12 shadow-lg shadow-primary/10"
        >
          {isLastStep ? "Finalizar Análisis" : "Siguiente"} 
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};