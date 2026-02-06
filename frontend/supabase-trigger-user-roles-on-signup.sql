-- =============================================================================
-- TRIGGER: Crear fila en user_roles cuando se crea un usuario en auth.users
-- Rol por defecto: admin | completed_onboarding: false
-- Ejecutar en Supabase SQL Editor.
-- =============================================================================

-- 1) Función que se ejecuta después de cada INSERT en auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role, completed_onboarding)
  values (new.id, 'admin', false);
  return new;
end;
$$;

-- 2) Trigger en auth.users (AFTER INSERT)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- =============================================================================
-- NOTA: Si la tabla user_roles aún no tiene la columna completed_onboarding,
-- ejecutá antes: supabase-user-roles-completed-onboarding.sql
-- =============================================================================
