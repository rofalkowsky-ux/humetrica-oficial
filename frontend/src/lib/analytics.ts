import ReactGA from 'react-ga4';

/**
 * Envía un evento personalizado a Google Analytics 4.
 * @param eventName - Nombre del evento (ej: onboarding_iniciado, dilema_respondido)
 * @param params - Parámetros opcionales (aparecen en GA4 como parámetros del evento)
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  try {
    ReactGA.event(eventName, params ?? {});
  } catch {
    // No romper la app si GA no está disponible
  }
}
