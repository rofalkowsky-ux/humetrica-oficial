// utils.ts (versión actualizada con API)
import type { Respuesta, Perfil, Metadata, DatosGuardados, CodificacionDilema } from './types';
import { enviarRespuestasLider, enviarRespuestasEquipo } from '../api/onboarding';
import type { OnboardingRequest } from '../api/onboarding';
import { supabase } from '@/lib/supabase';

const DIMENSION_LABELS: Record<keyof Perfil, string> = {
  D1: 'Prioridad',
  D2: 'Validación',
  D3: 'Acción',
  D4: 'Reglas',
  D5: 'Riesgo',
  D6: 'Responsabilidad',
};

const DIMENSIONES: (keyof Perfil)[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
const TABLA = 'respuestas_evaluacion';

export const calcularPerfil = (
  respuestas: Respuesta[],
  codificacion: CodificacionDilema
): Perfil => {
  const perfil = {} as Perfil;

  DIMENSIONES.forEach(dim => {
    let suma = 0;
    let count = 0;

    respuestas.forEach(respuesta => {
      const { dilemaId, opcionId } = respuesta;
      const valorDimension = codificacion[dilemaId]?.[opcionId]?.[dim];

      if (valorDimension !== undefined) {
        suma += valorDimension;
        count++;
      }
    });

    perfil[dim] = count > 0 ? suma / count : 0;
  });

  return perfil;
};

export const guardarRespuestas = async (
  respuestas: Respuesta[],
  metadata: Metadata
): Promise<DatosGuardados> => {
  const timestamp = new Date().toISOString();
  const tipo = (metadata.tipo ?? 'lider').toLowerCase() as 'lider' | 'equipo';
  const metadataCompleto = { ...metadata, tipo };
  const data: DatosGuardados = {
    respuestas,
    metadata: metadataCompleto,
    timestamp,
  };

  try {
    const requestData: OnboardingRequest = {
      respuestas,
      metadata: metadataCompleto,
      equipoId: getEquipoId(),
      miembroId: tipo === 'equipo' ? getMiembroId() : undefined,
      liderId: tipo === 'lider' ? getLiderId() : undefined,
    };

    if (tipo === 'lider') {
      await enviarRespuestasLider(requestData);
    } else {
      await enviarRespuestasEquipo(requestData);
    }

    localStorage.setItem(
      `onboarding_${tipo}_${timestamp}`,
      JSON.stringify(data)
    );

    return data;
  } catch (error) {
    console.error('Error guardando respuestas:', error);
    localStorage.setItem(
      `onboarding_${tipo}_${timestamp}`,
      JSON.stringify(data)
    );
    throw error;
  }
};

export const formatearTiempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  return `${minutos}:${segs.toString().padStart(2, '0')}`;
};

// Helpers para la API (localStorage)
const getEquipoId = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('equipoId') ?? '';
};

const getMiembroId = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('miembroId') ?? '';
};

const getLiderId = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('liderId') ?? '';
};

// ——— Dashboard (Supabase) ———

/** Una sola consulta a Supabase: trae todo y devuelve último líder + promedio aritmético del equipo. */
export type DatosRadar = { perfilLider: Perfil | null; perfilEquipo: Perfil | null };

export const cargarDatosRadarSupabase = async (): Promise<DatosRadar> => {
  const { data: rows, error } = await supabase
    .from(TABLA)
    .select('tipo, perfil, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[cargarDatosRadarSupabase]', error.message);
    return { perfilLider: null, perfilEquipo: null };
  }
  if (!rows?.length) return { perfilLider: null, perfilEquipo: null };

  const lider = rows.find((r: { tipo: string }) => r.tipo === 'lider');
  const equipoRows = rows.filter((r: { tipo: string }) => r.tipo === 'equipo');

  const perfilLider: Perfil | null =
    lider?.perfil && typeof lider.perfil === 'object'
      ? (lider.perfil as Perfil)
      : null;

  let perfilEquipo: Perfil | null = null;
  if (equipoRows.length > 0) {
    const n = equipoRows.length;
    const promedio: Perfil = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 };
    DIMENSIONES.forEach(dim => {
      let suma = 0;
      equipoRows.forEach((row: { perfil?: Perfil }) => {
        const v = (row.perfil as Perfil)?.[dim];
        if (typeof v === 'number') suma += v;
      });
      promedio[dim] = n > 0 ? suma / n : 0;
    });
    perfilEquipo = promedio;
  }

  return { perfilLider, perfilEquipo };
};

const perfilValueTo100 = (v: number): number => Math.round((v + 1) * 50);

export const radarDataComparativo = (
  perfilLider: Perfil | null,
  perfilEquipo: Perfil | null
): { name: string; valor: number; equipo?: number }[] =>
  DIMENSIONES.map(dim => ({
    name: DIMENSION_LABELS[dim],
    valor: perfilLider ? perfilValueTo100(perfilLider[dim]) : 0,
    equipo: perfilEquipo != null ? perfilValueTo100(perfilEquipo[dim]) : undefined,
  }));

const UMBRAL_BRECHA = 0.35;

export const categoriaConBrecha = (
  perfilLider: Perfil | null,
  perfilEquipo: Perfil | null
): string | null => {
  if (!perfilLider || !perfilEquipo) return null;
  let maxDiff = 0;
  let categoria: string | null = null;
  DIMENSIONES.forEach(dim => {
    const diff = Math.abs(perfilLider[dim] - perfilEquipo[dim]);
    if (diff >= UMBRAL_BRECHA && diff > maxDiff) {
      maxDiff = diff;
      categoria = DIMENSION_LABELS[dim];
    }
  });
  return categoria;
};
