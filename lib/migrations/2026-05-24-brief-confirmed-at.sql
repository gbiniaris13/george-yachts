-- =============================================================
-- 2026-05-24 — Per-member brief confirmation flag
-- =============================================================
--
-- George friend test 4 final clarification: "Πρέπει να υπάρχει
-- κουμπί είτε να λέει save σε κάθε χρήστη είτε confirm για να
-- καταλάβουμε εμείς μπροστά ότι το συμπληρώσανε όλα."
--
-- The shared brief autosaves silently as members edit. That
-- means we can't tell "Bill is done thinking" from "Bill is in
-- the middle of typing" — both look the same in the DB. So the
-- readiness count was lying ("brief voices") because it counted
-- anyone who'd touched the form, not anyone who'd actually said
-- "I'm done."
--
-- New column = explicit per-member confirmation timestamp. Set
-- when the member presses the Confirm CTA on /cabin/brief
-- overview; cleared when they revoke. The Send-to-George gate
-- now requires every non-opted-out member to have a non-null
-- value here (in addition to crew-list completion).
--
-- For the principal: their own confirmation counts too. Patricia
-- presses Confirm last, sees the bar hit 100 %, presses Send.
-- =============================================================

alter table cabin_members
  add column if not exists brief_confirmed_at timestamptz null;

-- Index supports the principal-home readiness query that COUNTs
-- WHERE brief_confirmed_at IS NOT NULL per cabin.
create index if not exists cabin_members_brief_confirmed_idx
  on cabin_members (cabin_id)
  where brief_confirmed_at is not null;
