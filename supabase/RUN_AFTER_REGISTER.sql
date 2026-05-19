-- =============================================================================
-- Only works AFTER agent_profiles rows exist. If 0 rows, run FIX_PENDING_NOW.sql first.
-- =============================================================================

update public.agent_profiles
set
  role = 'admin',
  account_status = 'active',
  verification_method = 'manual',
  approved_at = now()
where lower(email) in (
  lower('chandler@cover-iq.com'),
  lower('chandler.hill.24@gmail.com')
);
