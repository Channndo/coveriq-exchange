# Fix password reset links (wrong site / expired)

Reset emails use **Supabase Auth URL configuration**, not your laptop’s port 3000.

## 1. Supabase → Authentication → URL configuration

https://supabase.com/dashboard/project/gchpujvsqnuzhytxvyoz/auth/url-configuration

| Field | Value |
|-------|--------|
| **Site URL** | `https://agents.cover-iq.com` |
| **Redirect URLs** | Add each line below |

```
https://agents.cover-iq.com/**
https://agents.cover-iq.com/api/auth/callback
http://localhost:3002/**
```

Save.

## 2. Vercel env (coveriq-exchange)

Add or update:

```
NEXT_PUBLIC_APP_URL=https://agents.cover-iq.com
```

Redeploy.

## 3. Request a new reset link

Old links expire. Use https://agents.cover-iq.com/forgot-password after step 1–2.

## 4. Skip email (fastest)

Supabase → **Authentication → Users** → your user → set password directly → log in at `/login`.
