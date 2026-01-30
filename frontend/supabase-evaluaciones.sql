-- =============================================================================
-- TABLA: public.evaluaciones
-- Usada por: guardarRespuestas (insert) y Dashboard (select líder + equipo).
-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/TU_PROYECTO/sql
-- =============================================================================

-- 1) Crear tabla (si no existe)
create table if not exists public.evaluaciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  tipo text not null default 'lider' check (tipo in ('lider', 'equipo')),
  perfil jsonb not null default '{}',
  respuestas jsonb not null default '[]',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- 2) RLS
alter table public.evaluaciones enable row level security;

-- Borrar políticas antiguas si las creaste antes (opcional, por si cambian de nombre)
-- drop policy if exists "Users can insert own evaluaciones" on public.evaluaciones;
-- drop policy if exists "Users can select own evaluaciones" on public.evaluaciones;

-- INSERT: el usuario puede insertar filas con su user_id o user_id null
create policy "Users can insert own evaluaciones"
  on public.evaluaciones for insert
  with check (auth.uid() = user_id or user_id is null);

-- SELECT propias: el usuario ve sus propias filas (lider o equipo)
create policy "Users can select own evaluaciones"
  on public.evaluaciones for select
  using (auth.uid() = user_id or user_id is null);

-- SELECT equipo para Dashboard: cualquier usuario autenticado puede leer
-- todas las filas tipo='equipo' para calcular el promedio en el Dashboard
create policy "Authenticated can read equipo evaluaciones"
  on public.evaluaciones for select
  using (auth.role() = 'authenticated' and tipo = 'equipo');

-- 3) Índices
create index if not exists idx_evaluaciones_user_id on public.evaluaciones(user_id);
create index if not exists idx_evaluaciones_tipo on public.evaluaciones(tipo);
create index if not exists idx_evaluaciones_created_at on public.evaluaciones(created_at desc);

-- 4) Comprobar que existe (opcional)
-- select count(*) from public.evaluaciones;
