export interface Opcion {
    id: string;
    texto: string;
  }
  
  export interface Dilema {
    id: number;
    dimension: string;
    texto: string;
    pregunta: string;
    opciones: Opcion[];
  }
  
  export const dilemasEquipo: Dilema[] = [
    {
      id: 1,
      dimension: "D1",
      texto: `Estás trabajando en una entrega para un cliente importante. Debe estar lista en 2 días. Lo que tenés ahora funciona, pero falta documentación completa. Para completar todo necesitarías 4 días más. El líder no está disponible para consultar.`,
      pregunta: "¿Qué hacés?",
      opciones: [
        { id: "A", texto: "Entrego lo que tengo ahora. Funciona y es mejor cumplir el deadline." },
        { id: "B", texto: "Me enfoco en terminar lo crítico. Lo secundario queda para después." },
        { id: "C", texto: "Le aviso al cliente que necesito 2 días más para entregar algo completo." },
        { id: "D", texto: "Espero a que el líder esté disponible para consultarle qué priorizar." },
        { id: "E", texto: "Trabajo horas extra para intentar terminarlo todo en tiempo." },
      ],
    },
    {
      id: 2,
      dimension: "D2",
      texto: `Resolviste un problema urgente de un cliente. La solución funcionó perfectamente y el cliente está contento, PERO no seguiste el procedimiento estándar; usaste un atajo técnico que "no deberías" usar. El líder aún no se enteró.`,
      pregunta: "¿Qué hacés?",
      opciones: [
        { id: "A", texto: "Nada. Funcionó y el cliente está contento. Sigo adelante." },
        { id: "B", texto: "Le comento al líder que usé un atajo pero que funcionó." },
        { id: "C", texto: "Documento por qué no seguí el procedimiento estándar." },
        { id: "D", texto: "Lo rehago siguiendo el procedimiento, aunque tarde más." },
      ],
    },
    {
      id: 3,
      dimension: "D3",
      texto: `Estás notando señales de que un proveedor no está funcionando bien (demoras, calidad inconsistente). Cambiarlo implicaría coordinación con otras áreas e interrumpir tu trabajo actual. No hay política clara y el líder no está hoy.`,
      pregunta: "¿Qué hacés?",
      opciones: [
        { id: "A", texto: "Empiezo a buscar alternativas y propongo el cambio." },
        { id: "B", texto: "Lo monitoreo un mes más antes de escalar el tema." },
        { id: "C", texto: "Preparo un análisis documentado y se lo presento al líder." },
        { id: "D", texto: "Le pregunto al líder qué hacer antes de moverme." },
      ],
    },
    {
      id: 4,
      dimension: "D4",
      texto: `Un cliente pide algo técnicamente simple (1-2 horas) que no está en tu habitual, no genera costo y no está prohibido ni contemplado. La política dice "Consultar excepciones", pero el cliente necesita respuesta ahora y el líder está ocupado.`,
      pregunta: "¿Qué hacés?",
      opciones: [
        { id: "A", texto: "Lo hago. Es simple, ayuda al cliente y no genera problemas." },
        { id: "B", texto: "Le pregunto al cliente por qué lo necesita. Si tiene sentido, lo hago." },
        { id: "C", texto: "Le digo al cliente que consulto y le respondo mañana." },
        { id: "D", texto: "Le explico que no puedo hacer cosas sin autorización." },
        { id: "E", texto: "Le ofrezco alternativas dentro de lo que sí puedo hacer." },
      ],
    },
    {
      id: 5,
      dimension: "D5",
      texto: `Surge una oportunidad con un cliente grande. Estimás un 40% de probabilidad de éxito. Si funciona, es un gran logro; si falla, perdés 2-3 semanas de trabajo. Debes decidir ahora y el líder confía en tu criterio.`,
      pregunta: "¿Qué decidís?",
      opciones: [
        { id: "A", texto: "Lo tomo. El retorno potencial justifica el riesgo." },
        { id: "B", texto: "Invierto unos días más en análisis antes de comprometerme." },
        { id: "C", texto: "No lo tomo. El riesgo es muy alto para un 40%." },
        { id: "D", texto: "Lo tomo pero con compromiso parcial (1 semana y evalúo)." },
      ],
    },
    {
      id: 6,
      dimension: "D6",
      texto: `Hubo un error en producción que afectó a clientes por 1 hora. El proceso se siguió bien y la persona es buena, pero el procedimiento no contemplaba este caso. Ya está resuelto. El líder aún no sabe el detalle.`,
      pregunta: "¿Qué hacés primero?",
      opciones: [
        { id: "A", texto: "Hablo con quien ejecutó el proceso para entender qué pasó." },
        { id: "B", texto: "Reviso el procedimiento completo para ver qué falla." },
        { id: "C", texto: "Propongo una reunión de equipo para analizar qué pasó." },
        { id: "D", texto: "Documento el incidente y sigo adelante. Ya está resuelto." },
      ],
    },
  ];