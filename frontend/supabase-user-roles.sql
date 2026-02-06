-- =============================================================================
-- TABLA: public.user_roles
-- Usada por: AuthContext (login) para saber si el usuario es admin o participante.
-- Ejecutar en Supabase SQL Editor.
-- =============================================================================

-- 1) Crear tabla
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'participante')),
  created_at timestamptz not null default now(),
  unique(user_id)
);

-- 2) RLS
alter table public.user_roles enable row level security;

-- Usuarios solo pueden leer su propio rol
create policy "Users can read own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

-- Solo el servicio (o un admin desde el dashboard) puede insertar/actualizar
-- Para que la app pueda asignar rol al registrarse, permitimos insert con el propio uid
create policy "Users can insert own role on signup"
  on public.user_roles for insert
  with check (auth.uid() = user_id);

-- 3) Índice
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);

-- =============================================================================
-- CREAR USUARIO ADMINISTRADOR (ejemplo)
-- 1. En Supabase: Authentication → Users → Add user
--    Email: admin@humetrica.com
--    Password: (elegí una contraseña segura)
-- 2. Copiá el UUID del usuario recién creado.
-- 3. Ejecutá la siguiente línea reemplazando TU_USER_ID por ese UUID:
--
-- insert into public.user_roles (user_id, role) values ('TU_USER_ID', 'admin');
--
-- =============================================================================
