-- =============================================================
-- 2026-05-20 — Invite-first architecture (Phase 2)
-- =============================================================
--
-- Goal (George friend-test pass 3):
--   When a charterer opens The Cabin for the first time, the
--   primary action should be inviting their group — NOT filling
--   out a brief that asks for 6–12 other people's allergies,
--   DOBs, and passport numbers they don't remember.
--
-- Architectural shift:
--   - Each cabin_members row (every invited guest) collects their
--     OWN personal details when they log in via their own magic
--     link. The principal stops being a clerk for the whole party.
--   - We add a `personal_details` JSONB to cabin_members so each
--     member can populate it from /cabin/me.
--   - cabin_guests_manifest stays for the BRIEF view (Section 06)
--     and for the marina manifest export — but it's now a derived
--     view of what members populated, not the entry point.
--
-- This is an additive migration only. No backfill needed —
-- existing cabin_members rows get '{}' default. Existing
-- cabin_guests_manifest rows are untouched.
-- =============================================================

alter table cabin_members
  add column if not exists personal_details jsonb not null default '{}'::jsonb;

-- Lightweight column on cabin_members tracking when the member
-- last marked their personal details "complete enough". Lets us
-- show "details complete" badges on the principal's group page
-- without re-deriving from the JSONB on every render.
alter table cabin_members
  add column if not exists personal_details_completed_at timestamptz;

comment on column cabin_members.personal_details is
'JSONB blob filled by each member from /cabin/me. Keys: date_of_birth, nationality, passport_number, passport_expiry, allergies_dietary, dietary_preferences (array), swims (yes|some|no), mobility_notes, cabin_pairing, special_dates_during_charter, anything_else.';

comment on column cabin_members.personal_details_completed_at is
'Stamped when the member submits /cabin/me with the minimum fields (date_of_birth + allergies_dietary). Used for "details complete" badges on the principal''s group page.';
