// src/components/ProtectedRoute.tsx
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type AppRole = 'admin' | 'participante';

export interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  
  // Modo desarrollo: SIEMPRE permitir acceso sin autenticación
  // Esto permite navegar libremente durante el desarrollo
  const isDevelopment = 
    import.meta.env.DEV || 
    import.meta.env.MODE === 'development' || 
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost');

  // En desarrollo, permitir acceso inmediatamente sin verificar nada
  // Esto evita cualquier bloqueo por loading o autenticación
  if (isDevelopment) {
    return <>{children}</>;
  }

  // Solo en producción verificar autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check required role (single role)
  if (requiredRole && role !== requiredRole) {
    if (role === 'participante') {
      return <Navigate to="/participante" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check allowed roles (multiple roles)
  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    if (role === 'participante') {
      return <Navigate to="/participante" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
