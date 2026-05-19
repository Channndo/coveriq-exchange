# Fix: "Supabase is not configured" on agents.cover-iq.com

> **Common mistake:** Variable named `NEX_PUBLIC_SUPABASE_URL` (missing **T**).  
> Must be **`NEXT_PUBLIC_SUPABASE_URL`**. Delete the wrong one and add the correct name.

**Beginner walkthrough:** see `SUPABASE_FOR_BEGINNERS.md` in this folder.

The database is ready. The **live site** needs env vars on **Vercel** (not Netlify).

## 1. Copy keys from Supabase

Open: https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/settings/api

Copy:

| Name in Supabase | Vercel variable name |
|------------------|----------------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

`NEXT_PUBLIC_SUPABASE_URL` must be exactly:

```
https://gchpujvsqnuzhytxvyoz.supabase.co
```

## 2. Add to Vercel

1. https://vercel.com → project **coveriq-exchange** (agents site)
2. **Settings** → **Environment Variables**
3. Add all three variables above
4. Enable for **Production**, **Preview**, and **Development**
5. **Deployments** → ⋮ on latest → **Redeploy** (required — env vars don’t apply until redeploy)

## 3. Supabase Auth URLs (one time)

https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/auth/url-configuration

**Site URL:** `https://agents.cover-iq.com`

**Redirect URLs** (add each):

```
https://agents.cover-iq.com/**
https://agents.cover-iq.com/api/auth/callback
http://localhost:3002/**

Also set `NEXT_PUBLIC_APP_URL=https://agents.cover-iq.com` on Vercel (see `FIX_PASSWORD_RESET.md`).
```

## 4. After redeploy

1. Register at https://agents.cover-iq.com/register
2. Run `RUN_AFTER_REGISTER.sql` in Supabase SQL Editor
3. Open https://agents.cover-iq.com/admin/agents

Optional (already in repo defaults):

- `NEXT_PUBLIC_AGENT_ACCOUNTS_WEB_APP_URL` = your agent Apps Script `/exec` URL
