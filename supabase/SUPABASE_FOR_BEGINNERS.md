# CoverIQ + Supabase — complete beginner guide

Your database is already set up (you ran `RUN_EVERYTHING_ONCE.sql` successfully).
This guide only connects the **website** to that database and lets you sign up.

---

## Part A — Fix Vercel (this was blocking signup)

Your screenshot shows the URL variable is named **`NEX_PUBLIC_SUPABASE_URL`** — that is a **typo**.
It must be **`NEXT_PUBLIC_SUPABASE_URL`** (with a **T** after NEX).

### A1. Delete the wrong variable

1. Go to [vercel.com](https://vercel.com) and log in.
2. Open project **`coveriq-exchange-6em7`** (or whatever hosts agents.cover-iq.com).
3. Click **Settings** (top).
4. Click **Environment Variables** (left sidebar).
5. Find **`NEX_PUBLIC_SUPABASE_URL`** (wrong name).
6. Click the **⋯** menu on that row → **Delete** → confirm.

### A2. Add the correct URL variable

1. Still on **Environment Variables**.
2. Click **Add New** (or **Add Environment Variable**).
3. Fill in exactly:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://gchpujvsqnuzhytxvyoz.supabase.co`
   - **Environments:** check **Production**, **Preview**, and **Development**
4. Click **Save**.

### A3. Confirm the other two variables exist (names must match exactly)

You should have exactly these three keys (spelling matters):

| Key (copy exactly) | Where to get value |
|--------------------|--------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gchpujvsqnuzhytxvyoz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Part B below |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Part B below |

If `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing, add it (Part B).

### A4. Redeploy (required)

1. Click **Deployments** (top).
2. Click the **top** deployment (most recent).
3. Click **⋯** (three dots) → **Redeploy**.
4. Leave **Use existing Build Cache** unchecked if you see it → **Redeploy**.
5. Wait until status is **Ready** (green, ~1–2 minutes).
6. Hard-refresh register page: **Cmd+Shift+R** on https://agents.cover-iq.com/register

The red “Supabase is not configured” banner should be **gone**.

---

## Part B — Copy keys from Supabase (first time)

### B1. Open API settings

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click project **Cover-IQ-SUPA**.
3. Left sidebar → click **Project Settings** (gear at bottom).
4. Click **API** (under Configuration).

### B2. Copy Project URL

- Under **Project URL**, click **Copy**.
- It should be: `https://gchpujvsqnuzhytxvyoz.supabase.co`
- Paste into Vercel as `NEXT_PUBLIC_SUPABASE_URL` (Part A2).

### B3. Copy anon key

- Scroll to **Project API keys**.
- Find **`anon`** / **`public`**.
- Click **Copy** on that key (long string starting with `eyJ...`).
- In Vercel, variable name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Paste the key as the value.

### B4. Copy service_role key (optional for signup, add anyway)

- Same section, find **`service_role`** / **`secret`**.
- Click **Reveal** then **Copy**.
- In Vercel: `SUPABASE_SERVICE_ROLE_KEY`
- **Never** put this in the browser or GitHub — Vercel only.

---

## Part C — Supabase Auth (so login/signup works)

### C1. Open URL configuration

1. Supabase dashboard → project **Cover-IQ-SUPA**.
2. Left sidebar → **Authentication**.
3. Click **URL Configuration**.

### C2. Set Site URL

- **Site URL** field: type exactly  
  `https://agents.cover-iq.com`
- Click **Save** if there is a save button.

### C3. Add Redirect URLs

- Find **Redirect URLs** (list).
- Click **Add URL** and add each line (one at a time):

```
https://agents.cover-iq.com/**
```

```
https://agents.cover-iq.com/api/auth/callback
```

- Click **Save**.

### C4. Turn on email signup — **turn OFF confirm email** (important)

Supabase’s default sends a “confirm your email” message. On the free tier that email often **never arrives**, and you get stuck.

1. Left sidebar → **Authentication** → **Providers**.
2. Click **Email**.
3. **Enable Email provider** → **ON**.
4. **Confirm email** → **OFF** ← do this
5. **Save**.

You do **not** need a confirmation email for agents. After signup you go straight to **Application under review** (`/pending`).

---

## Part D — Register on the site

1. After Vercel redeploy (Part A4), open https://agents.cover-iq.com/register
2. Fill the form → **Submit application**.
3. You should go to **Application under review** (`/pending`) — that means it worked.

If you see a different error (not “Supabase is not configured”), copy the **exact** text.

---

## Part E — Make yourself admin (after signup)

1. Supabase → **SQL Editor** → **New query**.
2. Open file `RUN_AFTER_REGISTER.sql` in your repo.
3. Copy all → paste → **Run**.
4. Should say **1 row** updated (or success).
5. Go to https://agents.cover-iq.com/admin/agents

---

## Quick checklist

- [ ] Vercel has `NEXT_PUBLIC_SUPABASE_URL` (not `NEX_...`)
- [ ] Vercel has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Redeployed on Vercel after fixing
- [ ] Supabase Auth → Site URL = agents.cover-iq.com
- [ ] Supabase Auth → Redirect URLs added
- [ ] Registered on site → pending page
- [ ] Ran `RUN_AFTER_REGISTER.sql`

---

## Part F — "Failed to fetch" on register (you are here)

This means the site has env vars but **cannot talk to Supabase over the internet**.

### F1. Is the project paused?

1. [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open **Cover-IQ-SUPA**
3. If you see **"Project is paused"** → click **Restore project** → wait 2 minutes

### F2. Copy the URL again (do not type it)

1. **Project Settings** (gear) → **API**
2. Under **Project URL**, click **Copy**
3. Vercel → **Environment Variables** → edit **`NEXT_PUBLIC_SUPABASE_URL`**
4. Delete the old value → paste what you just copied
5. Must look like: `https://xxxxxxxx.supabase.co` (no spaces, no quotes)
6. **Production** checked → **Save**
7. **Deployments** → **Redeploy** → wait for **Ready**

### F3. Confirm anon key matches the same project

1. Same **API** page → copy **`anon` `public`** key
2. Vercel → `NEXT_PUBLIC_SUPABASE_ANON_KEY` → paste → Save → **Redeploy** again

### F4. Test in browser

Paste your **Project URL** in a new tab, add `/auth/v1/health` at the end, e.g.:

`https://YOUR-REF.supabase.co/auth/v1/health`

You should see JSON like `{"version":"..."}` — not an error page.

### F5. Auth email (Supabase)

1. **Authentication** → **Providers** → **Email** → ON
2. Turn **Confirm email** OFF for now → Save

### F6. Try register again

Hard refresh: **Cmd+Shift+R** on https://agents.cover-iq.com/register

---

## Still stuck?

Send a screenshot of:

1. Supabase **Settings → API** (blur keys, show **Project URL**)
2. Vercel env var **names** (values blurred)
