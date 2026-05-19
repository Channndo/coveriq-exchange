#!/bin/bash
# Run these in your Mac Terminal or VS Code terminal — NOT in Supabase SQL Editor.
# Project: Cover-IQ-SUPA

set -e
cd "$(dirname "$0")/.."

PROJECT_REF="gchpujvsqnuzhytxvyoz"
SUPABASE_URL="https://gchpujvsqnuzhytxvyoz.supabase.co"

echo "CoverIQ Exchange → Supabase CLI"
echo "Project ref: $PROJECT_REF"
echo ""

# Install CLI if needed
if ! command -v supabase &>/dev/null; then
  echo "Installing Supabase CLI..."
  brew install supabase/tap/supabase
fi

echo "Log in (browser opens)..."
supabase login

echo "Linking project..."
supabase link --project-ref "$PROJECT_REF"

echo "Applying migration SQL..."
supabase db execute -f supabase/RUN_IN_SQL_EDITOR.sql

echo ""
echo "Done. Add to Vercel (coveriq-exchange) environment variables:"
echo "  NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase → Settings → API → anon public>"
echo "  SUPABASE_SERVICE_ROLE_KEY=<from Settings → API → service_role — server only>"
