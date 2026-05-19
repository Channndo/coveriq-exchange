-- =============================================================================
-- agents.cover-iq.com — activate YOUR producer account (run in Supabase SQL Editor)
-- https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/sql/new
-- =============================================================================

-- STEP 1: See who exists (run this first)
select
  u.id as user_id,
  u.email as auth_email,
  p.email as profile_email,
  p.account_status,
  p.role,
  p.created_at
from auth.users u
left join public.agent_profiles p on p.user_id = u.id
order by u.created_at desc;

-- STEP 2: Activate + make admin — replace the email with YOUR row from step 1
update public.agent_profiles p
set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now()
from auth.users u
where p.user_id = u.id
  and lower(u.email) = lower('chandler@cover-iq.com');  -- ← change this email

-- Should say "1 row". Then refresh https://agents.cover-iq.com/pending

-- STEP 3: If step 2 says "0 rows" but step 1 shows auth_email with NO profile_email,
-- register once more at /register, or ask dev to fix profile insert.
