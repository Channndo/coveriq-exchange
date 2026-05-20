-- Tighten leads visibility: agents see only assigned leads (not unassigned pool).
-- Admins retain full access via existing "Admins manage leads" policy.

drop policy if exists "Agents read assigned leads" on public.leads;

create policy "Agents read assigned leads"
  on public.leads for select
  using (
    assigned_to in (
      select id from public.agent_profiles where user_id = auth.uid()
    )
  );

-- Allow agents to update status on leads assigned to them
drop policy if exists "Agents update assigned leads" on public.leads;

create policy "Agents update assigned leads"
  on public.leads for update
  using (
    assigned_to in (
      select id from public.agent_profiles where user_id = auth.uid()
    )
  )
  with check (
    assigned_to in (
      select id from public.agent_profiles where user_id = auth.uid()
    )
  );
