-- =============================================================================
-- Run THIS only AFTER you created an account at agents.cover-iq.com/register
-- (Same email you want as admin)
-- =============================================================================

update public.agent_profiles
set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now()
where email in ('chandler@cover-iq.com', 'chandler.hill.24@gmail.com');

-- Should say "1 row" or similar — if "0 rows", register on the site first, then run again.
