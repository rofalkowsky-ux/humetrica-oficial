// dilemasEquipo.ts
import type { Dilema } from './types';

export const dilemasEquipo: Dilema[] = [
  {
    id: 1,
    dimension: "D1",
    texto: `Estás trabajando en una entrega para un cliente importante.

Debe estar lista en 2 días.

Lo que tenés ahora:
- Funciona correctamente
- Falta documentación completa
- Falta testing exhaustivo
- Tiene algunos detalles de pulido pendientes

Para completar TODO necesitarías 4 días más.

El líder no está disponible para consultar.`,
    pregunta: "¿Qué hacés?",
    opciones: [
      {
        id: "A",
        texto: 'Entrego lo que tengo ahora. Funciona y es mejor cumplir el deadline.',
      },
      {
        id: "B",
        texto: 'Me enfoco en terminar lo crítico. Lo secundario queda para después.',
      },
      {
        id: "C",
        texto: 'Le aviso al cliente que necesito 2 días más para entregar algo completo.',
      },
      {
        id: "D",
        texto: 'Espero a que el líder esté disponible para consultarle qué priorizar.',
      },
      {
        id: "E",
        texto: 'Trabajo horas extra para intentar terminarlo todo en tiempo.',
      },
    ],
  },
  {
    id: 2,
    dimension: "D2",
    texto: `Resolviste un problema urgente de un cliente.

La solución:
- Funcionó perfectamente
- El cliente está contento
- PERO no seguiste el procedimiento estándar
- Usaste un atajo técnico que "no deberías" usar

El problema está resuelto.
El método fue irregular.

El líder aún no se enteró.`,
    pregunta: "¿Qué hacés?",
    opciones: [
      {
        id: "A",
        texto: 'Nada. Funcionó y el cliente está contento. Sigo adelante.',
      },
      {
        id: "B",
        texto: 'Le comento al líder que usé un atajo pero que funcionó.',
      },
      {
        id: "C",
        texto: 'Documento por qué no seguí el procedimiento estándar.',
      },
      {
        id: "D",
        texto: 'Lo rehago siguiendo el procedimiento, aunque tarde más.',
      },
    ],
  },
  {
    id: 3,
    dimension: "D3",
    texto: `Estás notando señales de que un proveedor con el que trabajás no está funcionando bien:
- 3 entregas con demoras este mes
- Calidad inconsistente
- Otros compañeros también comentaron problemas

Cambiar de proveedor implicaría coordinación con otras áreas y podría interrumpir tu trabajo actual.

No hay una política clara sobre esto.
El líder no está disponible hoy.`,
    pregunta: "¿Qué hacés?",
    opciones: [
      {
        id: "A",
        texto: 'Empiezo a buscar alternativas y propongo el cambio.',
      },
      {
        id: "B",
        texto: 'Lo monitoreo un mes más antes de escalar el tema.',
      },
      {
        id: "C",
        texto: 'Preparo un análisis documentado y se lo presento al líder.',
      },
      {
        id: "D",
        texto: 'Le pregunto al líder qué hacer antes de moverme.',
      },
    ],
  },
  {
    id: 4,
    dimension: "D4",
    texto: `Un cliente importante te pide algo que:
- No está en lo que habitualmente hacés
- Es técnicamente simple (1-2 horas)
- No te genera costo
- No está explícitamente prohibido, pero tampoco contemplado

La política de tu área dice: "Consultar excepciones con el líder."

El cliente necesita una respuesta ahora.
El líder está en reuniones toda la tarde.`,
    pregunta: "¿Qué hacés?",
    opciones: [
      {
        id: "A",
        texto: 'Lo hago. Es simple, ayuda al cliente y no genera problemas.',
      },
      {
        id: "B",
        texto: 'Le pregunto al cliente por qué lo necesita. Si tiene sentido, lo hago.',
      },
      {
        id: "C",
        texto: 'Le digo al cliente que consulto y le respondo mañana.',
      },
      {
        id: "D",
        texto: 'Le explico que no puedo hacer cosas fuera de lo acordado sin autorización.',
      },
      {
        id: "E",
        texto: 'Le ofrezco alternativas dentro de lo que sí puedo hacer sin consultar.',
      },
    ],
  },
  {
    id: 5,
    dimension: "D5",
    texto: `Surge una oportunidad de trabajar con un cliente grande.

Estimás:
- 40% de probabilidad de que salga bien
- Si funciona: es un logro importante para vos y el equipo
- Si falla: perdés 2-3 semanas de trabajo

Podés empezar mañana, pero necesitás decidir ahora.
El líder confía en tu criterio para estas decisiones.`,
    pregunta: "¿Qué decidís?",
    opciones: [
      {
        id: "A",
        texto: 'Lo tomo. El retorno potencial justifica el riesgo.',
      },
      {
        id: "B",
        texto: 'Invierto unos días más en análisis antes de comprometerme.',
      },
      {
        id: "C",
        texto: 'No lo tomo. El riesgo es muy alto para un 40% de probabilidad.',
      },
      {
        id: "D",
        texto: 'Lo tomo pero con compromiso parcial (1 semana, luego evalúo).',
      },
    ],
  },
  {
    id: 6,
    dimension: "D6",
    texto: `Hubo un error en producción que afectó a clientes durante 1 hora.

Lo que sabés:
- El proceso se siguió correctamente
- La persona que lo ejecutó tiene buen historial
- Pero el procedimiento no contemplaba este caso específico

El problema ya está resuelto.
No hubo negligencia evidente.

El líder aún no se enteró del detalle.`,
    pregunta: "¿Qué hacés primero?",
    opciones: [
      {
        id: "A",
        texto: 'Hablo con quien ejecutó el proceso para entender qué pasó.',
      },
      {
        id: "B",
        texto: 'Reviso el procedimiento completo para ver qué falla.',
      },
      {
        id: "C",
        texto: 'Propongo una reunión de equipo para analizar qué pasó.',
      },
      {
        id: "D",
        texto: 'Documento el incidente y sigo adelante. Ya está resuelto.',
      },
    ],
  },
];
