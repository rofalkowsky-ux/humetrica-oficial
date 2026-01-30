// OnboardingRouter.tsx – Muestra OnboardingLider u OnboardingEquipo según el rol del usuario
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import OnboardingLider from './OnboardingLider';
import OnboardingEquipo from './OnboardingEquipo';

export type RolOnboarding = 'lider' | 'equipo';

/**
 * Obtiene el rol para el onboarding:
 * 1. Query param (?rol=lider | ?rol=equipo) – para links de invitación
 * 2. Rol en AuthContext: admin → lider, participante → equipo
 * 3. localStorage user.rol (ej. desde tu sistema de auth)
 * 4. Por defecto: equipo (para usuarios anónimos / invitados)
 */
export function obtenerRolDelUsuario(
  roleFromAuth: 'admin' | 'participante' | null,
  searchParams: URLSearchParams
): RolOnboarding {
  const rolQuery = searchParams.get('rol')?.toLowerCase();
  if (rolQuery === 'lider' || rolQuery === 'equipo') {
    return rolQuery;
  }
  if (roleFromAuth === 'admin') return 'lider';
  if (roleFromAuth === 'participante') return 'equipo';
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData) as { rol?: string };
        if (user.rol === 'lider' || user.rol === 'equipo') return user.rol;
      } catch {
        // ignore
      }
    }
  }
  return 'equipo';
}

const OnboardingRouter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { role } = useAuth();

  const rol = useMemo(
    () => obtenerRolDelUsuario(role ?? null, searchParams),
    [role, searchParams]
  );

  return rol === 'lider' ? <OnboardingLider /> : <OnboardingEquipo />;
};

export default OnboardingRouter;
