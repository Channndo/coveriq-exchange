-- =============================================================================
-- agents.cover-iq.com — Chandler accounts (pre-filled)
-- Project: https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/sql/new
-- =============================================================================

-- BLOCK A: Check status
select
  u.id as user_id,
  u.email as auth_email,
  p.id as profile_id,
  p.account_status,
  p.role
from auth.users u
left join public.agent_profiles p on p.user_id = u.id
where u.email in ('chandler@cover-iq.com', 'chandler.hill.24@gmail.com');

-- BLOCK B: Activate by user_id (if profile already exists)
update public.agent_profiles
set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now()
where user_id in (
  '5a63562f-453f-464f-972e-9f2fa7513641',
  '25831444-b049-47f1-b095-0ca14ea5df0f'
);

-- BLOCK C: Create profile + activate (if profile_id was NULL) — run FIX_PENDING_NOW.sql instead
-- Or run the insert in FIX_PENDING_NOW.sql (handles both emails at once).
