-- 2026-06-25 — Enable Row Level Security on the last 7 exposed tables.
-- ============================================================
-- The Supabase advisor flagged 7 public tables with RLS disabled, i.e.
-- readable/writable by anyone holding the public anon key. Verified SAFE
-- to lock down: every one is accessed ONLY server-side via the
-- SERVICE_ROLE client (lib/cabin/* + /api routes) — which bypasses RLS —
-- and the app has NO client-side (anon-key) Supabase access at all. So
-- enabling RLS with no policies blocks the public roles while all server
-- code keeps working unchanged.
--
-- Applied to the live project (lquxemsonehfltdzdbhq) via the Supabase MCP
-- on 2026-06-25. This file is the repo record. (push_subscriptions was
-- already secured the same day — see 2026-06-25-push-subscriptions.sql.)
-- After this, every table in the public schema has RLS enabled.
-- ============================================================

alter table public.health_score_history       enable row level security;
alter table public.cabin_brief_contributions   enable row level security;
alter table public.cabin_brief_wishlist_items  enable row level security;
alter table public._brief02_orig_member_emails enable row level security;
alter table public._brief02_orig_principal_email enable row level security;
alter table public._brief02_orig_member_gates  enable row level security;
alter table public.filotimo_referrals          enable row level security;
