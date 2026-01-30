// dashboardTypes.ts – Tipos para el dashboard de brechas e índices

import type { Perfil as PerfilBase } from './types';

export type { PerfilBase as Perfil };

/** Brechas por dimensión (valor absoluto líder - equipo). */
export interface Brechas {
  D1: number;
  D2: number;
  D3: number;
  D4: number;
  D5: number;
  D6: number;
}

export interface Indices {
  IBO: number;
  IFD: number;
  ΔIBO: number | null;
}

export type TipoPatron =
  | 'alineada'
  | 'moderada_estable'
  | 'moderada_creciente'
  | 'alta_persistente'
  | 'creciente'
  | 'volatil'
  | 'fragmentada';

export type NivelRiesgo =
  | 'bajo'
  | 'medio'
  | 'medio_alto'
  | 'alto'
  | 'critico';

export interface Patron {
  tipo: TipoPatron;
  nivelRiesgo: NivelRiesgo;
  descripcion: string;
}

export interface Accionable {
  dimensionAfectada: keyof PerfilBase;
  hipotesis: string;
  experimento: string;
  metricaExito: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export interface MedicionHistorica {
  fecha: string;
  IBO: number;
  brechas: Brechas;
}

/** Resultado completo de desalineación para el dashboard. */
export interface ResultadosDesalineacion {
  fecha: string;
  equipoId: string;
  equipoNombre: string;
  perfilLider: PerfilBase;
  perfilEquipo: PerfilBase;
  brechas: Brechas;
  indices: Indices;
  patron: Patron;
  accionables: Accionable[];
  historico?: MedicionHistorica[];
}

export interface DimensionInfo {
  id: keyof PerfilBase;
  nombre: string;
  descripcion: string;
  poloNegativo: string;
  poloPositivo: string;
  preguntaClave: string;
}

export const dimensionesInfo: Record<keyof PerfilBase, DimensionInfo> = {
  D1: {
    id: 'D1',
    nombre: 'Prioridad',
    descripcion: 'Qué se optimiza cuando no se puede optimizar todo',
    poloNegativo: 'Velocidad',
    poloPositivo: 'Calidad',
    preguntaClave: '¿Qué sacrificás primero cuando hay presión?',
  },
  D2: {
    id: 'D2',
    nombre: 'Criterio de Validación',
    descripcion: 'Qué define que algo está "bien hecho"',
    poloNegativo: 'Proceso',
    poloPositivo: 'Resultado',
    preguntaClave: '¿Cómo validás el trabajo?',
  },
  D3: {
    id: 'D3',
    nombre: 'Umbral de Acción',
    descripcion: 'Cuánta certeza se necesita antes de decidir',
    poloNegativo: 'Decide rápido',
    poloPositivo: 'Analiza mucho',
    preguntaClave: '¿Cuánta información necesitás para actuar?',
  },
  D4: {
    id: 'D4',
    nombre: 'Interpretación de Reglas',
    descripcion: 'Cómo se lee la norma ante casos no previstos',
    poloNegativo: 'Literal',
    poloPositivo: 'Contextual',
    preguntaClave: '¿Cómo aplicás las reglas?',
  },
  D5: {
    id: 'D5',
    nombre: 'Asunción de Riesgo',
    descripcion: 'Qué tipo de error se tolera más',
    poloNegativo: 'Hacer mal',
    poloPositivo: 'No hacer',
    preguntaClave: '¿Qué error preferís tolerar?',
  },
  D6: {
    id: 'D6',
    nombre: 'Atribución de Responsabilidad',
    descripcion: 'Dónde se busca la causa cuando algo falla',
    poloNegativo: 'Persona',
    poloPositivo: 'Sistema',
    preguntaClave: '¿Dónde buscás el problema?',
  },
};
