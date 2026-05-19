-- Producer registry (NPN allowlist) — run in Supabase SQL Editor after schema.sql
-- Used for manual review today; future auto-approval when NPN matches an active row.

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

create trigger producer_registry_updated_at
  before update on public.producer_registry
  for each row execute function public.set_updated_at();

alter table public.producer_registry enable row level security;

-- Admins manage registry entries
create policy "Admins read producer registry"
  on public.producer_registry for select
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

create policy "Admins insert producer registry"
  on public.producer_registry for insert
  with check (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

create policy "Admins update producer registry"
  on public.producer_registry for update
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

-- Optional verification audit on agent profiles
alter table public.agent_profiles
  add column if not exists verification_method text default 'manual'
    check (verification_method in ('manual', 'registry', 'pending'));

alter table public.agent_profiles
  add column if not exists approved_at timestamptz;

alter table public.agent_profiles
  add column if not exists registry_matched boolean not null default false;
