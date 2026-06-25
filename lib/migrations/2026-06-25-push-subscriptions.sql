-- 2026-06-25 — Web Push subscriptions.
-- ============================================================
-- Stores the browser push subscriptions captured by the discreet
-- PushOptIn prompt (app/components/PushOptIn.jsx). One row per
-- browser/device. The endpoint is the unique key — the same browser
-- re-subscribing upserts rather than duplicating.
--
-- Free: lives in the existing george-yachts Supabase project (same
-- DB the Cabin + visitor-intelligence tables use). No new service.
--
-- Apply once via the Supabase SQL editor (same way the cabin
-- migrations were applied). Safe to re-run (IF NOT EXISTS guards).
-- ============================================================

create table if not exists push_subscriptions (
  id           uuid primary key default gen_random_uuid(),
  endpoint     text not null unique,          -- the push service URL (unique per browser)
  p256dh       text not null,                 -- client public key (from PushSubscription)
  auth         text not null,                 -- client auth secret (from PushSubscription)
  user_agent   text,                          -- for debugging / segmentation only
  page         text,                          -- where they opted in (e.g. /yachts/genny)
  created_at   timestamptz not null default now(),
  last_sent_at timestamptz,                   -- updated by /api/push/send
  active       boolean not null default true  -- flipped false when the push service returns 404/410
);

create index if not exists idx_push_subscriptions_active
  on push_subscriptions (active, created_at desc);
