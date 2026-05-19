# Fix auth redirects (do this now — 60 seconds)

Password reset and signup emails use **Supabase Site URL**. If it says `http://localhost:3000`, links open whatever runs on port 3000 — not CoverIQ.

## Steps

1. Open: https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/auth/url-configuration

2. **Site URL** — delete `localhost:3000`, set exactly:
   ```
   https://agents.cover-iq.com
   ```

3. **Redirect URLs** — add (keep existing if any):
   ```
   https://agents.cover-iq.com/**
   https://agents.cover-iq.com/api/auth/callback
   http://localhost:3002/**
   ```

4. **Save**

5. **Vercel** → coveriq-exchange → Environment Variables:
   - `NEXT_PUBLIC_APP_URL` = `https://agents.cover-iq.com`
   - Redeploy

6. Request a **new** reset link (old links still point at the old URL).

**Fast bypass:** Supabase → Authentication → Users → your user → set password → login at https://agents.cover-iq.com/login
