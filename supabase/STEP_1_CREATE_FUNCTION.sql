-- STEP 1 — Run this FIRST in Supabase SQL Editor (select all → Run)
-- Creates the missing function. Takes 1 second.

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
