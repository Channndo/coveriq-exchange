-- =============================================================================
-- COVERIQ — RUN THIS ONE FILE ONLY (Supabase SQL Editor)
-- Project: Cover-IQ-SUPA (gchpujvsqnuzhytxvyoz)
--
-- 1. New query → delete everything in the box
-- 2. Paste THIS ENTIRE FILE (scroll to bottom — do not skip the top)
-- 3. Click Run (do NOT highlight only part of the file)
--
-- You do NOT need STEP_1 or schema.sql separately.
-- After success: register at agents.cover-iq.com, then run RUN_AFTER_REGISTER.sql
-- =============================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------------
-- Core tables (safe to re-run)
-- ---------------------------------------------------------------------------

create table if not exists public.agent_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  agency_name text not null,
  npn_number text not null,
  state text not null,
  phone text not null,
  account_status text not null default 'pending_verification'
    check (account_status in ('pending_verification', 'active', 'suspended', 'rejected')),
  role text not null default 'agent' check (role in ('agent', 'admin')),
  subscription_plan text,
  subscription_status text,
  stripe_customer_id text,
  credit_balance integer not null default 0,
  mfa_enabled boolean not null default false,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  state text not null,
  product_type text not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'closed', 'lost')),
  assigned_date timestamptz not null default now(),
  assigned_to uuid references public.agent_profiles(id) on delete set null,
  source text not null default 'CoverIQ Exchange',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  agent_profile_id uuid not null references public.agent_profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan_id text not null,
  status text not null default 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_actions (
  id uuid primary key default uuid_generate_v4(),
  admin_user_id uuid not null references auth.users(id) on delete cascade,
  target_agent_id uuid references public.agent_profiles(id) on delete set null,
  action_type text not null,
  previous_status text,
  new_status text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists agent_profiles_updated_at on public.agent_profiles;
create trigger agent_profiles_updated_at
  before update on public.agent_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Producer registry + extra agent columns
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

alter table public.agent_profiles
  add column if not exists verification_method text default 'pending';
alter table public.agent_profiles
  add column if not exists approved_at timestamptz;
alter table public.agent_profiles
  add column if not exists registry_matched boolean not null default false;

-- ---------------------------------------------------------------------------
-- RLS (drop + recreate so re-run works)
-- ---------------------------------------------------------------------------

alter table public.agent_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_actions enable row level security;
alter table public.producer_registry enable row level security;

drop policy if exists "Agents read own profile" on public.agent_profiles;
create policy "Agents read own profile"
  on public.agent_profiles for select using (auth.uid() = user_id);

drop policy if exists "Agents update own profile" on public.agent_profiles;
create policy "Agents update own profile"
  on public.agent_profiles for update using (auth.uid() = user_id);

drop policy if exists "Users insert own profile on signup" on public.agent_profiles;
create policy "Users insert own profile on signup"
  on public.agent_profiles for insert with check (auth.uid() = user_id);

drop policy if exists "Admins read all profiles" on public.agent_profiles;
create policy "Admins read all profiles"
  on public.agent_profiles for select
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Admins update all profiles" on public.agent_profiles;
create policy "Admins update all profiles"
  on public.agent_profiles for update
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Agents read assigned leads" on public.leads;
create policy "Agents read assigned leads"
  on public.leads for select
  using (
    assigned_to in (select id from public.agent_profiles where user_id = auth.uid())
    or assigned_to is null
  );

drop policy if exists "Admins manage leads" on public.leads;
create policy "Admins manage leads"
  on public.leads for all
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Agents read own subscriptions" on public.subscriptions;
create policy "Agents read own subscriptions"
  on public.subscriptions for select
  using (agent_profile_id in (select id from public.agent_profiles where user_id = auth.uid()));

drop policy if exists "Admins read admin actions" on public.admin_actions;
create policy "Admins read admin actions"
  on public.admin_actions for select
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Admins insert admin actions" on public.admin_actions;
create policy "Admins insert admin actions"
  on public.admin_actions for insert
  with check (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Admins read producer registry" on public.producer_registry;
create policy "Admins read producer registry"
  on public.producer_registry for select
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Admins insert producer registry" on public.producer_registry;
create policy "Admins insert producer registry"
  on public.producer_registry for insert
  with check (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

drop policy if exists "Admins update producer registry" on public.producer_registry;
create policy "Admins update producer registry"
  on public.producer_registry for update
  using (exists (select 1 from public.agent_profiles ap where ap.user_id = auth.uid() and ap.role = 'admin'));

-- Done — admin promotion is in RUN_AFTER_REGISTER.sql (after you sign up on the site)
