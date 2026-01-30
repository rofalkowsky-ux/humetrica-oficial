// types.ts
// Definición de todos los tipos del sistema

export interface Opcion {
    id: string;
    texto: string;
  }
  
  export interface Dilema {
    id: number;
    dimension: Dimension;
    texto: string;
    pregunta: string;
    opciones: Opcion[];
  }
  
  export type Dimension = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
  
  export interface CodificacionDimensiones {
    D1: number;
    D2: number;
    D3: number;
    D4: number;
    D5: number;
    D6: number;
  }
  
  export type CodificacionOpciones = Record<string, CodificacionDimensiones>;
  
  export type CodificacionDilema = Record<number, CodificacionOpciones>;
  
  /** Una respuesta por dilema: opción elegida, tiempo en segundos, veces que cambió. */
  export interface Respuesta {
    dilemaId: number;
    opcionId: string;
    tiempo: number;   // segundos en ese dilema
    cambios: number;  // cuántas veces cambió la respuesta
  }

  /** Perfil calculado: media por dimensión D1–D6 (valores típicos entre -1 y 1). */
  export interface Perfil {
    D1: number;
    D2: number;
    D3: number;
    D4: number;
    D5: number;
    D6: number;
  }

  /** Metadatos de la evaluación: fecha, tiempo total, perfil calculado. */
  export interface Metadata {
    tipo?: 'lider' | 'equipo';
    fechaCompleto: string;  // ISO string
    tiempoTotal: number;    // segundos totales
    perfil?: Perfil;
  }

  /**
   * Estructura completa guardada (memoria / Supabase).
   * Ejemplo: { respuestas: [{ dilemaId: 1, opcionId: "C", tiempo: 45, cambios: 1 }, ...], metadata: { fechaCompleto, tiempoTotal, perfil: { D1..D6 } }, timestamp }
   */
  export interface DatosGuardados {
    respuestas: Respuesta[];
    metadata: Metadata;
    timestamp: string;
  }
  
  export type Paso = 'intro' | 'dilemas' | 'finalizando' | 'completo';

  /** Fila de la tabla evaluaciones en Supabase */
  export interface EvaluacionRow {
    id?: string;
    user_id: string | null;
    tipo: 'lider' | 'equipo';
    perfil: Perfil;
    respuestas: Respuesta[];
    metadata: Metadata;
    created_at?: string;
  }