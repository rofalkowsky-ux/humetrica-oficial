// src/data/dilemasLider.ts

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
  
  export const dilemasLider: Dilema[] = [
    {
      id: 1,
      dimension: "D1",
      texto: `Tu equipo está finalizando una entrega crítica para un cliente importante.\n\nFaltan 2 días para el deadline.\n\nEl trabajo funciona correctamente, pero le falta:\n- Documentación completa\n- Testing exhaustivo\n- Detalles de pulido\n\nPara completar TODO necesitarían 4 días más.`,
      pregunta: "¿Qué le decís al equipo?",
      opciones: [
        { id: "A", texto: "Entreguemos lo que tenemos. Funciona y es mejor cumplir el deadline." },
        { id: "B", texto: "Prioricemos las funciones críticas. Lo secundario queda para después." },
        { id: "C", texto: "Negociemos 2 días más con el cliente. Prefiero entregar bien que rápido." },
        { id: "D", texto: "Terminen todo correctamente. Yo manejo la relación con el cliente." },
      ],
    },
    {
      id: 2,
      dimension: "D2",
      texto: `Un miembro del equipo resolvió un problema urgente.\n\nLa solución:\n- Funcionó perfectamente\n- El cliente está satisfecho\n- PERO no siguió el procedimiento estándar\n- Usó un atajo técnico que "no debería" usarse\n\nEl problema está resuelto.\nEl método fue irregular.`,
      pregunta: "¿Cómo reaccionás?",
      opciones: [
        { id: "A", texto: "Bien hecho. Lo importante es que funciona. Sigamos adelante." },
        { id: "B", texto: "Está bien por esta vez, pero la próxima sigamos el proceso." },
        { id: "C", texto: "Funciona, pero documentá por qué no seguiste el procedimiento." },
        { id: "D", texto: "El resultado es bueno, pero rehacelo siguiendo el estándar." },
      ],
    },
    {
      id: 3,
      dimension: "D3",
      texto: `Hay señales de que un proveedor clave no está funcionando bien:\n- 3 entregas con demoras en el último mes\n- Calidad inconsistente\n- Feedback informal negativo de tu equipo\n\nCambiar de proveedor implica:\n- 2 semanas de transición\n- Riesgo de interrumpir operación actual\n\nLa evidencia es clara pero no concluyente.`,
      pregunta: "¿Qué hacés?",
      opciones: [
        { id: "A", texto: "Cambio de proveedor ahora. Las señales son suficientes." },
        { id: "B", texto: "Lo monitoreo 30 días más antes de decidir." },
        { id: "C", texto: "Pido a mi equipo que prepare un análisis detallado antes de moverme." },
        { id: "D", texto: "Escalo la decisión a mi superior." },
      ],
    },
    {
      id: 4,
      dimension: "D4",
      texto: `Un cliente importante solicita una modificación que:\n- No está en el contrato estándar\n- Es técnicamente simple (2 horas de trabajo)\n- No genera costo adicional directo\n- Podría sentar precedente para otros clientes\n\nTu política dice: "Toda excepción requiere aprobación del líder."\n\nEl cliente está esperando una respuesta.`,
      pregunta: "¿Qué le decís al equipo?",
      opciones: [
        { id: "A", texto: "Háganlo. Es un cliente importante y no cuesta nada." },
        { id: "B", texto: "Evalúen si realmente ayuda al cliente. Si sí, háganlo." },
        { id: "C", texto: "Díganle que necesitamos 24hs para evaluar el impacto." },
        { id: "D", texto: "No. Ofrézcanle alternativas dentro del estándar." },
      ],
    },
    {
      id: 5,
      dimension: "D5",
      texto: `Oportunidad de cerrar un cliente grande.\n\nAnálisis interno indica:\n- 40% de probabilidad de éxito\n- Si funciona: +$500k en ingresos\n- Si falla: 3 semanas de trabajo perdidas\n\nTu equipo puede empezar mañana, pero necesitan tu decisión ahora.`,
      pregunta: "¿Qué decidís?",
      opciones: [
        { id: "A", texto: "Lo tomamos. El retorno potencial justifica el riesgo." },
        { id: "B", texto: "Inviertimos 1 semana más en análisis antes de comprometermen." },
        { id: "C", texto: "No lo tomamos. El riesgo es demasiado alto para un 40% de probabilidad." },
        { id: "D", texto: "Lo tomamos pero con compromiso parcial (1 semana, luego evaluamos)." },
      ],
    },
    {
      id: 6,
      dimension: "D6",
      texto: `El sistema cayó en producción durante 2 horas.\n\nInvestigación inicial muestra:\n- El proceso de deploy se siguió correctamente\n- La persona que ejecutó tiene buen historial\n- Pero el procedimiento no contemplaba este caso\n\nNo hay negligencia evidente.\nEl problema está resuelto.`,
      pregunta: "¿Qué hacés primero?",
      opciones: [
        { id: "A", texto: "Reunión 1-1 con quien ejecutó el deploy para entender qué vio y qué no vio." },
        { id: "B", texto: "Revisar el proceso de deploy completo para ver qué falla." },
        { id: "C", texto: "Reunión de equipo para analizar qué pasó y cómo evitarlo." },
        { id: "D", texto: "Documentar el incidente y seguir adelante. Ya está resuelto." },
      ],
    },
  ];