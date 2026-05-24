-- =============================================================
-- 2026-05-23 — Multi-user Brief contributions (Phase 3)
-- =============================================================
--
-- Goal (George friend-test pass 4, Vasilis on iPhone 13 Pro Max):
--   "Δεν γίνεται μόνο ο main charterer να επιλέγει την καύα.
--    Όλοι θέλουμε να έχουν πρόσβαση — μετά πρώτα φτιάχνουν,
--    τους κάνουν invite, μπαίνουν μέσα, βάζουν τα στοιχεία τους,
--    μετά πρέπει να κάνουν και αυτοί μία βόλτα από το preference
--    list ... και ύστερα ο Main Charterer το κάνει review."
--
-- Architectural decision:
--   - Existing cabin_brief_sections stays per-cabin and remains
--     the PRINCIPAL'S canonical answer for each section. Unchanged.
--   - NEW table cabin_brief_contributions captures each member's
--     PERSONAL contribution to two sections only — "At the Table"
--     (dining) and "In the Cellar" (beverages). Whitelisted at
--     the DB level via CHECK constraint so future contribution
--     scope creep is intentional.
--   - Principal sees the aggregated view in /cabin/brief/review:
--     "Vasilis chose Negroni stations + champagne. Eleanna prefers
--      wine only. Alex would like IPA."
--   - The brief submit handler bundles every contribution into the
--     Send-to-George payload so George has full group consensus
--     when planning the chef's brief and the cellar order.
--
-- Free-forever stance kept: no new services, no API keys, no
-- migrations to the existing brief flow. Existing cabins continue
-- to work without contributions; the table simply stays empty.
--
-- Idempotent + additive. Safe to re-run.
-- =============================================================

create table if not exists cabin_brief_contributions (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null
    references cabins(id) on delete cascade,
  member_id uuid not null
    references cabin_members(id) on delete cascade,
  section_key text not null
    check (section_key in ('dining', 'beverages')),
  data jsonb not null default '{}'::jsonb,
  -- Mirrors the cabin_brief_sections audit columns so principal
  -- review can show "Last edited 3h ago by Vasilis K."
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Each member can only have ONE row per section per cabin.
-- Insert vs update is resolved by the (cabin_id, member_id, section_key)
-- triple in the PUT handler's upsert.
create unique index if not exists cabin_brief_contributions_unique
  on cabin_brief_contributions (cabin_id, member_id, section_key);

-- Indexes for the two common read paths:
--   1. Guest reads their own (auth-side join via member_id)
--   2. Principal review aggregates ALL contributions for a cabin
create index if not exists cabin_brief_contributions_by_cabin
  on cabin_brief_contributions (cabin_id);

create index if not exists cabin_brief_contributions_by_member
  on cabin_brief_contributions (member_id);

-- Auto-update updated_at on every UPDATE. Keeps the audit clean
-- without requiring the PUT handler to set it manually.
create or replace function cabin_brief_contributions_touch()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists cabin_brief_contributions_touch_trigger
  on cabin_brief_contributions;
create trigger cabin_brief_contributions_touch_trigger
  before update on cabin_brief_contributions
  for each row execute function cabin_brief_contributions_touch();

-- Row-level security: the table is locked down at the API layer
-- (the PUT handler enforces session.email == member.email_for_login
-- before allowing a write). We don't enable RLS because the cabin
-- backend uses the service role key and bypasses RLS anyway —
-- enabling it would only protect against a future direct-PostgREST
-- client that we don't currently have.
