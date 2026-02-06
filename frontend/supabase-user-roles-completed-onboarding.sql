-- =============================================================================
-- Agregar columna completed_onboarding a public.user_roles
-- Ejecutar en Supabase SQL Editor (después de tener la tabla user_roles).
-- =============================================================================

alter table public.user_roles
  add column if not exists completed_onboarding boolean not null default false;

-- Permitir que el usuario actualice su propia fila (para marcar onboarding completado)
create policy "Users can update own role"
  on public.user_roles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
