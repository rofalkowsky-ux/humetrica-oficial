// api/onboarding.ts
import type { Respuesta, Metadata } from '../onboarding/types';

export interface OnboardingRequest {
  respuestas: Respuesta[];
  metadata: Metadata;
  equipoId: string;
  miembroId?: string; // Solo para equipo
  liderId?: string;   // Solo para líder
}

export const enviarRespuestasLider = async (
  data: OnboardingRequest
): Promise<void> => {
  const response = await fetch('/api/v1/onboarding/lider', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al guardar respuestas del líder');
  }
};

export const enviarRespuestasEquipo = async (
  data: OnboardingRequest
): Promise<void> => {
  const response = await fetch('/api/v1/onboarding/equipo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al guardar respuestas del equipo');
  }
};

const getAuthToken = (): string => {
  return localStorage.getItem('auth_token') ?? '';
};
