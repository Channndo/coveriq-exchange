-- =============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR (Cover-IQ-SUPA / gchpujvsqnuzhytxvyoz)
-- Creates missing agent_profiles + makes both accounts admin + active.
-- Then sign out → sign in at https://agents.cover-iq.com
-- =============================================================================

insert into public.agent_profiles (
  user_id,
  first_name,
  last_name,
  email,
  agency_name,
  npn_number,
  state,
  phone,
  account_status,
  role,
  credit_balance,
  mfa_enabled,
  preferences,
  verification_method,
  registry_matched
)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'first_name', 'Chandler'),
  coalesce(u.raw_user_meta_data->>'last_name', 'Hill'),
  u.email,
  'CoverIQ',
  '00000000',
  'TX',
  '5555555550',
  'active',
  'admin',
  0,
  false,
  '{"onboardingCompleted": true}'::jsonb,
  'manual',
  false
from auth.users u
where u.email in (
  'chandler@cover-iq.com',
  'chandler.hill.24@gmail.com'
)
on conflict (user_id) do update set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now();

-- Expect: 2 rows. Verify:
select u.email, p.account_status, p.role
from auth.users u
join public.agent_profiles p on p.user_id = u.id
where u.email in ('chandler@cover-iq.com', 'chandler.hill.24@gmail.com');
