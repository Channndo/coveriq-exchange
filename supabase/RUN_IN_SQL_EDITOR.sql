-- =============================================================================
-- DEPRECATED — use RUN_EVERYTHING_ONCE.sql instead (one file, no Step 1).
-- Then RUN_AFTER_REGISTER.sql after you sign up on agents.cover-iq.com
-- =============================================================================

-- Helper: auto-set updated_at on row changes (from schema.sql — safe to re-run)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 1) Producer registry + agent verification columns
create table if not exists public.producer_registry (
  id uuid primary key default uuid_generate_v4(),
  npn text not null unique,
  first_name text,
  last_name text,
  licensed_states text[] default '{}',
  agency_name text,
  active boolean not null default true,
  source text not null default 'manual',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_producer_registry_npn on public.producer_registry(npn);
create index if not exists idx_producer_registry_active on public.producer_registry(active);

alter table public.producer_registry enable row level security;

drop policy if exists "Admins read producer registry" on public.producer_registry;
create policy "Admins read producer registry"
  on public.producer_registry for select
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

drop policy if exists "Admins insert producer registry" on public.producer_registry;
create policy "Admins insert producer registry"
  on public.producer_registry for insert
  with check (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

drop policy if exists "Admins update producer registry" on public.producer_registry;
create policy "Admins update producer registry"
  on public.producer_registry for update
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

alter table public.agent_profiles
  add column if not exists verification_method text default 'pending';

alter table public.agent_profiles
  add column if not exists approved_at timestamptz;

alter table public.agent_profiles
  add column if not exists registry_matched boolean not null default false;

-- 2) Make you site admin (run after you have registered once on agents.cover-iq.com)
update public.agent_profiles
set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now()
where email in ('chandler@cover-iq.com', 'chandler.hill.24@gmail.com');

-- 3) Optional: example NPN in registry (remove or edit)
-- insert into public.producer_registry (npn, first_name, last_name, agency_name, licensed_states, notes)
-- values ('12345678', 'Chandler', 'Hill', 'CoverIQ', array['IN'], 'example row')
-- on conflict (npn) do nothing;
