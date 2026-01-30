-- =============================================================================
-- TABLA: public.respuestas_evaluacion
-- Esta tabla es DISTINTA de team_members. Aquí se guardan las evaluaciones
-- (perfil D1-D6 y respuestas) del onboarding LÍDER y del EQUIPO para el radar.
--
-- Pasos:
-- 1. En Supabase: Table Editor → SQL Editor (o New query).
-- 2. Pega TODO este script y ejecuta (Run).
-- 3. Verifica que aparezca la tabla respuestas_evaluacion en el menú izquierdo.
-- =============================================================================

create table if not exists public.respuestas_evaluacion (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tipo text not null check (tipo in ('lider', 'equipo')),
  perfil jsonb not null default '{}',
  respuestas jsonb not null default '[]'
);

alter table public.respuestas_evaluacion enable row level security;

-- Políticas para que la app pueda insertar y leer sin errores
drop policy if exists "Allow insert respuestas_evaluacion" on public.respuestas_evaluacion;
create policy "Allow insert respuestas_evaluacion"
  on public.respuestas_evaluacion for insert
  with check (true);

drop policy if exists "Allow select respuestas_evaluacion" on public.respuestas_evaluacion;
create policy "Allow select respuestas_evaluacion"
  on public.respuestas_evaluacion for select
  using (true);

create index if not exists idx_respuestas_evaluacion_tipo on public.respuestas_evaluacion(tipo);
create index if not exists idx_respuestas_evaluacion_created_at on public.respuestas_evaluacion(created_at desc);
