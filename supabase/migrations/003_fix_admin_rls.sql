-- Fix infinite recursion on agent_profiles admin policies
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.agent_profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Admins read all profiles" on public.agent_profiles;
create policy "Admins read all profiles"
  on public.agent_profiles for select
  using (public.is_admin());

drop policy if exists "Admins update all profiles" on public.agent_profiles;
create policy "Admins update all profiles"
  on public.agent_profiles for update
  using (public.is_admin());
