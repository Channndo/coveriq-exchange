# Fix: "new row violates row-level security policy for table agent_profiles"

**What happened:** Supabase created your login, but blocked saving your producer profile (security rules).

## Fix A — Supabase setting (try first, no code deploy)

1. [Supabase Dashboard](https://supabase.com/dashboard) → **Cover-IQ-SUPA**
2. **Authentication** → **Providers** → **Email**
3. Turn **Confirm email** → **OFF**
4. **Save**
5. Register again at https://agents.cover-iq.com/register

## Fix B — Vercel (required for code fix)

Add **`SUPABASE_SERVICE_ROLE_KEY`** if missing:

1. Supabase → **Project Settings** → **API**
2. Copy **`service_role`** **secret** key
3. Vercel → **Environment Variables** → add:
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste key)
   - **Production** checked
4. **Redeploy**

Then push/deploy the latest `coveriq-exchange` code (uses `/api/agent-profile`).
