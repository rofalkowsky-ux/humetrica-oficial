// dashboardUtils.ts
import type { Perfil, Brechas, Patron, Accionable } from './dashboardTypes';

export const calcularBrechas = (perfilLider: Perfil, perfilEquipo: Perfil): Brechas => {
  return {
    D1: Math.abs(perfilLider.D1 - perfilEquipo.D1),
    D2: Math.abs(perfilLider.D2 - perfilEquipo.D2),
    D3: Math.abs(perfilLider.D3 - perfilEquipo.D3),
    D4: Math.abs(perfilLider.D4 - perfilEquipo.D4),
    D5: Math.abs(perfilLider.D5 - perfilEquipo.D5),
    D6: Math.abs(perfilLider.D6 - perfilEquipo.D6),
  };
};

export const calcularIBO = (brechas: Brechas): number => {
  const valores = Object.values(brechas);
  const suma = valores.reduce((acc, val) => acc + val, 0);
  return suma / valores.length;
};

export const clasificarBrecha = (brecha: number): 'alineado' | 'moderado' | 'critico' => {
  if (brecha < 0.3) return 'alineado';
  if (brecha < 0.6) return 'moderado';
  return 'critico';
};

export const obtenerColorBrecha = (brecha: number): string => {
  const clasificacion = clasificarBrecha(brecha);
  switch (clasificacion) {
    case 'alineado': return 'text-green-600 bg-green-50 border-green-200';
    case 'moderado': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critico': return 'text-red-600 bg-red-50 border-red-200';
  }
};

export const obtenerIconoBrecha = (brecha: number): string => {
  const clasificacion = clasificarBrecha(brecha);
  switch (clasificacion) {
    case 'alineado': return '✅';
    case 'moderado': return '⚠️';
    case 'critico': return '🚨';
  }
};

export const obtenerEtiquetaBrecha = (brecha: number): string => {
  const clasificacion = clasificarBrecha(brecha);
  switch (clasificacion) {
    case 'alineado': return 'Alineado';
    case 'moderado': return 'Moderado';
    case 'critico': return 'Crítico';
  }
};

export const formatearValor = (valor: number): string => {
  return valor.toFixed(2);
};

export const obtenerPorcentajeProgreso = (valor: number, max: number = 2.0): number => {
  return (valor / max) * 100;
};

export const identificarPatron = (
  IBO: number,
  ΔIBO: number | null,
  IFD: number
): Patron => {
  // Patrón: Alineada
  if (IBO < 0.3 && Math.abs(ΔIBO || 0) < 0.1 && IFD < 0.3) {
    return {
      tipo: 'alineada',
      nivelRiesgo: 'bajo',
      descripcion: 'El equipo está alineado con tu criterio decisional.',
    };
  }

  // Patrón: Alta y Persistente
  if (IBO >= 0.6 && Math.abs(ΔIBO || 0) < 0.1 && IFD < 0.4) {
    return {
      tipo: 'alta_persistente',
      nivelRiesgo: 'critico',
      descripcion: 'El equipo ejecuta una estrategia distinta de forma consistente.',
    };
  }

  // Patrón: Creciente
  if (IBO < 0.6 && (ΔIBO || 0) > 0.15) {
    return {
      tipo: 'creciente',
      nivelRiesgo: 'alto',
      descripcion: 'La brecha está creciendo rápidamente.',
    };
  }

  // Patrón: Fragmentada
  if (IBO < 0.4 && IFD >= 0.5) {
    return {
      tipo: 'fragmentada',
      nivelRiesgo: 'alto',
      descripcion: 'El equipo no tiene criterio compartido internamente.',
    };
  }

  // Patrón: Volátil
  if (IBO < 0.4 && Math.abs(ΔIBO || 0) > 0.2) {
    return {
      tipo: 'volatil',
      nivelRiesgo: 'medio',
      descripcion: 'El criterio del equipo es inconsistente en el tiempo.',
    };
  }

  // Patrón: Moderada pero Creciente
  if (IBO >= 0.4 && IBO < 0.6 && (ΔIBO || 0) > 0.05) {
    return {
      tipo: 'moderada_creciente',
      nivelRiesgo: 'medio_alto',
      descripcion: 'Hay desalineación moderada que está empeorando.',
    };
  }

  // Patrón: Moderada Estable
  return {
    tipo: 'moderada_estable',
    nivelRiesgo: 'medio',
    descripcion: 'Hay desalineación moderada pero estable.',
  };
};

export const generarAccionables = (
  brechas: Brechas,
  perfilLider: Perfil,
  perfilEquipo: Perfil
): Accionable[] => {
  const accionables: Accionable[] = [];

  // Ordenar dimensiones por brecha (mayor a menor)
  const dimensionesOrdenadas = (Object.entries(brechas) as [keyof Perfil, number][])
    .sort(([, a], [, b]) => b - a);

  // Generar accionables para las 2 dimensiones con mayor brecha (si son críticas)
  for (let i = 0; i < Math.min(2, dimensionesOrdenadas.length); i++) {
    const [dimension, brecha] = dimensionesOrdenadas[i];

    if (brecha >= 0.6) {
      const accionable = generarAccionablePorDimension(
        dimension,
        brecha,
        perfilLider[dimension],
        perfilEquipo[dimension]
      );
      if (accionable) {
        accionables.push(accionable);
      }
    }
  }

  return accionables;
};

const generarAccionablePorDimension = (
  dimension: keyof Perfil,
  brecha: number,
  valorLider: number,
  valorEquipo: number
): Accionable | null => {
  const diferencia = valorLider - valorEquipo;

  switch (dimension) {
    case 'D1':
      return {
        dimensionAfectada: 'D1',
        hipotesis: diferencia > 0
          ? 'Tu equipo prioriza velocidad mientras vos esperás calidad.'
          : 'Tu equipo prioriza calidad mientras vos esperás velocidad.',
        experimento: 'Antes de cada delegación crítica, verbalizar explícitamente: "En este caso, prefiero que [velocidad/calidad]"',
        metricaExito: 'La brecha en Prioridad baja de ' + brecha.toFixed(2) + ' a < 0.50 en la próxima medición',
        prioridad: 'alta',
      };

    case 'D2':
      return {
        dimensionAfectada: 'D2',
        hipotesis: diferencia > 0
          ? 'Tu equipo valida por proceso mientras vos validás por resultado.'
          : 'Tu equipo valida por resultado mientras vos validás por proceso.',
        experimento: 'En las próximas revisiones de trabajo, explicitar: "Lo que importa aquí es [el proceso/el resultado]"',
        metricaExito: 'La brecha en Criterio baja de ' + brecha.toFixed(2) + ' a < 0.50',
        prioridad: 'alta',
      };

    case 'D3':
      return {
        dimensionAfectada: 'D3',
        hipotesis: diferencia > 0
          ? 'Tu equipo decide rápido mientras vos esperás más análisis.'
          : 'Tu equipo espera más certeza mientras vos esperás que decidan más rápido.',
        experimento: 'Establecer umbral explícito: "Si tenés menos del X% de certeza sobre Y, consultame antes de decidir"',
        metricaExito: 'La brecha en Umbral baja de ' + brecha.toFixed(2) + ' a < 0.50',
        prioridad: 'alta',
      };

    case 'D4':
      return {
        dimensionAfectada: 'D4',
        hipotesis: diferencia > 0
          ? 'Tu equipo es más literal con las reglas de lo que vos esperás.'
          : 'Tu equipo es más flexible con las reglas de lo que vos esperás.',
        experimento: 'Aclarar explícitamente cuándo las excepciones son aceptables y cuándo no',
        metricaExito: 'La brecha en Reglas baja de ' + brecha.toFixed(2) + ' a < 0.50',
        prioridad: 'media',
      };

    case 'D5':
      return {
        dimensionAfectada: 'D5',
        hipotesis: diferencia > 0
          ? 'Tu equipo tolera menos riesgo del que vos esperás.'
          : 'Tu equipo tolera más riesgo del que vos esperás.',
        experimento: 'Definir explícitamente qué nivel de riesgo es aceptable para qué tipo de decisiones',
        metricaExito: 'La brecha en Riesgo baja de ' + brecha.toFixed(2) + ' a < 0.50',
        prioridad: 'media',
      };

    case 'D6':
      return {
        dimensionAfectada: 'D6',
        hipotesis: diferencia > 0
          ? 'Tu equipo busca más en personas mientras vos buscás más en procesos.'
          : 'Tu equipo busca más en procesos mientras vos buscás más en personas.',
        experimento: 'En el próximo error, modelar explícitamente el enfoque que esperás: "Revisemos el proceso" o "Hablemos con quien lo hizo"',
        metricaExito: 'La brecha en Responsabilidad baja de ' + brecha.toFixed(2) + ' a < 0.50',
        prioridad: 'baja',
      };

    default:
      return null;
  }
};
