-- CoverIQ Exchange — Supabase schema
-- Run in Supabase SQL Editor after creating project

-- Extensions
create extension if not exists "uuid-ossp";

-- Agent profiles (linked to auth.users)
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

create index if not exists idx_agent_profiles_user_id on public.agent_profiles(user_id);
create index if not exists idx_agent_profiles_status on public.agent_profiles(account_status);

-- Leads
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

create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_status on public.leads(status);

-- Subscriptions (Stripe sync)
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

create index if not exists idx_subscriptions_agent on public.subscriptions(agent_profile_id);

-- Admin audit log
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

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger agent_profiles_updated_at
  before update on public.agent_profiles
  for each row execute function public.set_updated_at();

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- RLS
alter table public.agent_profiles enable row level security;
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_actions enable row level security;

-- Agents read/update own profile
create policy "Agents read own profile"
  on public.agent_profiles for select
  using (auth.uid() = user_id);

create policy "Agents update own profile"
  on public.agent_profiles for update
  using (auth.uid() = user_id);

create policy "Users insert own profile on signup"
  on public.agent_profiles for insert
  with check (auth.uid() = user_id);

-- Admins read all profiles
create policy "Admins read all profiles"
  on public.agent_profiles for select
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

create policy "Admins update all profiles"
  on public.agent_profiles for update
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

-- Leads: agents see assigned leads; admins see all
create policy "Agents read assigned leads"
  on public.leads for select
  using (
    assigned_to in (
      select id from public.agent_profiles where user_id = auth.uid()
    )
    or assigned_to is null
  );

create policy "Admins manage leads"
  on public.leads for all
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

-- Subscriptions: own records
create policy "Agents read own subscriptions"
  on public.subscriptions for select
  using (
    agent_profile_id in (
      select id from public.agent_profiles where user_id = auth.uid()
    )
  );

-- Admin actions: admins only
create policy "Admins read admin actions"
  on public.admin_actions for select
  using (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );

create policy "Admins insert admin actions"
  on public.admin_actions for insert
  with check (
    exists (
      select 1 from public.agent_profiles ap
      where ap.user_id = auth.uid() and ap.role = 'admin'
    )
  );
