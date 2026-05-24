-- =============================================================
-- 2026-05-23 — Multi-user Brief (Phase 3, MUB-C) — Specific
-- items wishlist (shared, per-section).
-- =============================================================
--
-- Goal (George friend test 4):
--   "Από την άλλη όμως, αν ο πελάτης θέλει να πάρει ας πούμε
--    ένα μπουκάλι τεκίλα ή 12 ουίσια, να έχει την επιλογή να
--    μπορεί να το κάνει, αν θέλει, να είναι optional."
--
-- The default cellar/dining model stays frequency-based ("we
-- drink beer often / sometimes / rarely") so the hostess owns
-- the F&B work — the client isn't pushed into being a barman.
-- This new wishlist is the OPTIONAL escape hatch for the
-- handful of cases where a specific bottle, brand or dish
-- matters enough to name explicitly.
--
-- Architecturally:
--   • SHARED per cabin per section (not per-member private).
--     Anyone in the cabin can add an item; everyone sees them
--     together. Vasilis adds "Don Julio Reposado", Patricia
--     opens the cellar and sees it.
--   • Per-item attribution via added_by_member_id so the
--     hostess (and George reading the email) knows who asked
--     for what.
--   • Optional quantity field — free text. The principal who
--     wants "12 bottles" can write that; the one who just
--     wants "a Don Julio" leaves it blank and the hostess
--     decides quantity from the consensus frequency picks.
--   • Optional notes — "for my husband's birthday on day 4".
--   • Locked when cabin.brief_submitted_at is set, matching
--     every other brief surface.
--
-- Removal policy: enforced at the API layer (the writer can
-- delete their own; principal can delete any). DB-level we
-- only constrain integrity (cascade on cabin / member delete).
-- =============================================================

create table if not exists cabin_brief_wishlist_items (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null
    references cabins(id) on delete cascade,
  section_key text not null
    check (section_key in ('dining', 'beverages')),
  -- Free-text item label written by the member. We do NOT
  -- enum-constrain this — the whole point of the wishlist is
  -- to let clients name specific bottles/brands/dishes that
  -- don't fit any structured category.
  label text not null check (length(label) between 1 and 200),
  -- Optional. Free text: "1 bottle", "12 bottles", "1 case",
  -- "for the entire week", etc. No parsing — the hostess reads.
  quantity text null check (quantity is null or length(quantity) <= 100),
  -- Optional contextual notes.
  notes text null check (notes is null or length(notes) <= 500),
  added_by_member_id uuid null
    references cabin_members(id) on delete set null,
  added_at timestamptz not null default now()
);

-- Indexes for the two common read paths:
--   1. Render the cabin's wishlist on every collaborative
--      section page (ordered by added_at desc for "newest first").
--   2. The CRM later joining by member for per-attribute audit.
create index if not exists cabin_brief_wishlist_items_by_cabin
  on cabin_brief_wishlist_items (cabin_id, section_key, added_at desc);

create index if not exists cabin_brief_wishlist_items_by_member
  on cabin_brief_wishlist_items (added_by_member_id)
  where added_by_member_id is not null;

-- Row-level security: same posture as cabin_brief_contributions.
-- The Cabin backend uses the service-role key and bypasses RLS;
-- the API handler is the auth gate.
