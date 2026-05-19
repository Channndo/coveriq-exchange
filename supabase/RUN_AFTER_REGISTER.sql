-- =============================================================================
-- Activate existing profiles (shows rows in results — not "0 rows" confusion)
-- If this returns 0 rows here, profiles don't exist yet → run FIX_PENDING_NOW.sql
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
)
returning email, account_status, role;

-- You should see 2 rows: active / admin
-- "Success. No rows returned" WITHOUT returning = normal for plain UPDATE in Supabase UI
