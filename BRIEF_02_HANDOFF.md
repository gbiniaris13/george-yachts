# Brief 02 — Hand-off note (Sessions 1+2 → Session 3 / Final)

**Updated:** 2026-05-26 (end of CP4)
**Brief:** `ROBERTO_BRIEF_02_CABIN_SINGLE_RESPONSIBILITY.md` (in Downloads)
**Status:** **CP1 + CP2 + CP3 + CP4 green. ONLY the Final (C1 e2e + builds + report message) remains.**

---

## Where to pick up

### Repos / branches / worktrees

Both repos on the branch **`claude/brief-02-single-resp`**:

- **`george-yachts`** — `/Users/.../Projects/george-yachts/.claude/worktrees/brief-02-single-resp`
  - 3 commits ahead of main (40b6022):
    ```
    f865b58  Brief 02 / CP3 — A4-A8: life-aboard + children principal-only, guest done-state, per-member allergy roll-up, dead-code unmount
    bed4baa  Brief 02 / CP2 — A2 guest read-only + A3 shoe_size + force-save Continue
    9d82431  Brief 02 / CP1 — A1 server gate: dining/beverages/life_aboard principal-only
    ```
  - `node_modules` is a symlink to the main repo's `node_modules`.
  - `.env.local` is a copy of the main repo's `.env.local`.

- **`gy-command`** — `/Users/.../Projects/gy-command/.claude/worktrees/brief-02-single-resp`
  - 1 commit ahead of main (1dcccce):
    ```
    02ed3eb  Brief 02 / CP4 (gy-command) — B1 mergeGuestRecords helper + B2 chef allergy block
    ```
  - `node_modules` symlinked from `/Users/.../Projects/gy-command/node_modules`.
  - `.env.local` copied from `/Users/.../Projects/gy-command/.env.local`.

### Test cabin (use ONLY this one for every acceptance check)

- **Cabin ID:** `1576342b-c921-4b29-a76c-1b8c91416076` (EFFIE STAR)
- **Principal:** `george@georgeyachts.com` — display "Patricia R. Stevens" — member `1c0ce055-50fd-413e-9d06-74ab04ea6c02`
- **Guests:** 8 friends, all test users. Default guest for tests: `elekarv@gmail.com` (Eleanna Karvouni, member `020735b6-6a3c-43ee-add3-466493c81ea7`).

### Hard rules (do not break)

1. **Plus-addressed email swap BEFORE any submit test.** Before triggering `POST /api/cabin/brief/submit`, UPDATE every `cabin_members.email` AND `cabins.principal_charterer_email` to throwaway plus addresses. Verify the swap in DB before submit. Restore originals AFTER. NEVER let test mail reach the real friend emails.
2. **Idempotent write rule for PUTs:** read current section data first, PUT back the same data. NEVER send empty `{}` or synthetic partial payload to a populated section row.
3. **Two-repo contract:** schema lives in `george-yachts` only.

---

## What's done (CP1 → CP4)

### CP1 — Task A1 (george-yachts, commit 9d82431)
- `app/api/cabin/brief/[section]/route.js`: added `life_aboard`, `dining`, `beverages` to `PRINCIPAL_ONLY_SECTIONS`.
- `app/api/cabin/me/life-aboard/route.js`: PUT now requires principal/brief-admin (403 for guests).
- **Acceptance: guest PUT × 3 = 403, principal PUT dining = 200.** ✓

### CP2 — Tasks A2 + A3 (george-yachts, commit bed4baa)
- A2 — NEW `app/components/cabin/brief/GuestBriefReadOnly.jsx`. Both `/cabin/brief/dining/page.jsx` and `/cabin/brief/beverages/page.jsx` are tri-state on `isPrincipal` (null=loading, true=editable, false=read-only render with zero form controls).
- A3 — `shoe_size` added to `sanitisePersonalDetails()` allowlist + `/cabin/me/page.jsx` form state + Aboard input. `onContinueToPrivate` force-save handler replaces the bare `<Link href="/cabin/me/private">` (Eleanna's data-loss bug closed).
- **Acceptance: guest SSR = 0 form controls; shoe_size round-trips to DB + GET; preserves Eleanna's prior personal_details.** ✓

### CP3 — Tasks A4-A8 (george-yachts, commit f865b58)
- **A4.1** life-aboard → principal-only via NEW `life-aboard/layout.jsx` wrapping `<PrincipalOnlyGate>`. Page rewired to write to the shared `cabin_brief_sections.life_aboard` row (sectionKey `life_aboard`, no more endpointBase override). Per-member "Private to you" banner + endpoint removed.
- **A4.2 + A5.3** `NextStep.jsx` guest tree rewritten: only Crew List → done. No more "Step 2 of 2 — add brief picks + confirm".
- **A5.1** Done-state copy points guests at the joy features ("The Main Charterer is taking care of the rest…").
- **A5.2** `/cabin/page.jsx` gates `<PreVoyageSteps>` mount on `isPrincipal` so the duplicate crew-list nag is gone for guests.
- **A6.1** `children` added to `PRINCIPAL_ONLY_SECTIONS`. NEW `children/layout.jsx` wraps `<PrincipalOnlyGate>`.
- **A6.2** Submit handler builds an `allergyRollup` from every member's `personal_details.allergies_dietary` + `dietary_preferences[]` (principal first, then alphabetical). Passed as new `allergyRollup` param to `sendBriefSubmittedEmail`. Also adds Telegram bullet lines.
- **A7** `sendBriefMemberConfirmation` body rewritten verbatim per brief A7.1 — states the Main Charterer made the final choices, member's own details + allergies passed to the crew as entered.
- **A8.1+A8.2** `<GuestAdditiveBanner>` mounts removed from dining + beverages. `<GroupVoicesPanel>` was never mounted.
- **A8.5** Entire "Help fill the group brief" guest-only block in `/cabin/me/page.jsx` unmounted (the brief Open-link + opt-out toggle). The `brief_participation_opt_out_at` column + submit-gate + CRM preference-sheet reader are intentionally LEFT in place per the brief.
- **Acceptance:** 5×403 (CP1 regression + A6.1 children), banner+readonly mounted for guest on life-aboard, NextStep done-state fires for Eleanna, PreVoyageSteps 0 for guest / 11 for principal, A8 grep = 0 live mounts. ✓

### CP4 — Tasks B1-B3 (gy-command, commit 02ed3eb)
- **B1** NEW `src/lib/cabin-guest-merge.ts` (~190 LOC). Shared `mergeGuestRecords()` extracted from crew-list's inline merge() + extended with chef-relevant fields (cabin_pairing, shoe_size, allergies_dietary, dietary[], allergies_severity, emergency_note, is_minor).
- **B1** preference-sheet + print + crew-list all use the shared helper. preference-sheet `GuestCard` prop type now `MergedGuest` (full_name → name). §02 Manifest renders one card per cabin_member (not just one card per manifest row) — so EFFIE STAR went from 1 card to 9 cards.
- **B2** NEW `<ChefAllergyBlock guests={mergedGuests} />` mounted in §03 Health & Safety. Per-member: name + Principal chip + severity tag + allergies text + dietary line + emergency note. Filter accepts allergies OR dietary; "none" skipped from allergies. Calm "No allergies reported by the party." fallback. Empty per-member skipped silently.
- **B3** No-op. After A4.1 life_aboard stays a real brief section, so `SECTION_LABELS` map + completion % semantics unchanged.
- **Acceptance:** `npx tsc --noEmit` → exit 0. Live HTML capture deferred to Final (route is auth-gated by Supabase middleware — needs a real admin session). Trace of expected output for EFFIE STAR is in the commit message.

---

## Final — what's still to do

### C1 — Cross-repo end-to-end on EFFIE STAR
Strict five-step end-to-end (brief lines 256-263, do them in order):

1. **As a guest** (Eleanna's cookie, or fresh mint): fill ONLY the Crew List via the new `/cabin/me` wizard. Verify the wizard's "Continue to Private notes →" button persists the typed data (CP2's A3 already proved this for shoe_size — re-confirm end-to-end).
2. **As a guest, confirm 403 + read-only**: PUT `/api/cabin/brief/dining`, `/beverages`, `/api/cabin/me/life-aboard` → all 403. GET `/cabin/brief/dining`, `/beverages`, `/life-aboard` → guest sees read-only renders / Principal-only banner, never a form.
3. **PLUS-EMAIL DB SWAP** — *before any submit*:
   ```sql
   -- Snapshot first so we can restore!
   create temp table _orig_emails as
     select id, email from cabin_members
     where cabin_id = '1576342b-c921-4b29-a76c-1b8c91416076';
   create temp table _orig_principal_email as
     select id, principal_charterer_email from cabins
     where id = '1576342b-c921-4b29-a76c-1b8c91416076';

   -- Swap to plus addresses
   update cabin_members
   set email = 'george+effie-' || regexp_replace(lower(coalesce(display_name, email)), '[^a-z0-9]+', '-', 'g') || '@georgeyachts.com'
   where cabin_id = '1576342b-c921-4b29-a76c-1b8c91416076';
   update cabins
   set principal_charterer_email = 'george+effie-principal@georgeyachts.com'
   where id = '1576342b-c921-4b29-a76c-1b8c91416076';

   -- VERIFY: SELECT id, email FROM cabin_members WHERE cabin_id = '…' — every email must contain "george+"
   ```
4. **As the principal**: ensure dining + beverages + itinerary have realistic data (use the read-modify-write idempotent rule — see CP1's restoration of dining for the realistic blob shape). Then trigger `POST /api/cabin/brief/submit`. Capture:
   - The Telegram payload (`notifyGeorge`) — check it includes the "Allergies & dietary (per member):" block with Bill (Nuts allergy) and Olga (pineapple allergy).
   - The broker email body — should contain the new "Allergies across the whole party (chef briefing)" HTML block. Bill + Olga + Eleanna + Patricia per the trace in `02ed3eb`'s commit message.
   - The per-member confirmation emails — paste the rendered text (per A7.1 wording).
5. **REOPEN THE BRIEF then RESTORE EMAILS**:
   ```sql
   update cabin_members
   set email = (select email from _orig_emails where id = cabin_members.id)
   where cabin_id = '1576342b-c921-4b29-a76c-1b8c91416076';
   update cabins
   set principal_charterer_email = (select principal_charterer_email from _orig_principal_email where id = cabins.id)
   where id = '1576342b-c921-4b29-a76c-1b8c91416076';
   -- Reopen brief (so future tests can submit again)
   update cabins set brief_submitted_at = NULL, brief_submitted_by_member_id = NULL
   where id = '1576342b-c921-4b29-a76c-1b8c91416076';
   ```
6. **Live preference-sheet capture** (the part that needs a real Supabase admin session):
   - Sign into the gy-command CRM at `command.georgeyachts.com` (or localhost dev with a real Supabase session — set up via the Supabase Studio auth flow OR via your existing browser session).
   - Navigate to `/dashboard/cabins/1576342b-c921-4b29-a76c-1b8c91416076/preference-sheet`.
   - Paste:
     * Number of GuestCards in §02 Manifest (expect **9**, was **1** before CP4).
     * The §03 Chef Allergy Block content (expect 4 lines: Patricia Vegetarian, Bill Nuts+No pork, Chris Nothing, Eleanna Vegetarian).
     * One self-filled guest's specific fields visible (e.g. Bill's allergies + cabin pairing + nationality).
   - **Bonus test for severity styling:** temporarily UPDATE `cabin_guests_manifest` to add a row for Bill with `allergies_severity = 'life_threatening'`, refresh, capture the red life-threatening styling, then DELETE that row.

### Builds — both repos must build green

```
cd /Users/.../Projects/george-yachts/.claude/worktrees/brief-02-single-resp
npm run build      # paste final success line

cd /Users/.../Projects/gy-command/.claude/worktrees/brief-02-single-resp
npm run build      # paste final success line
```

If a build fails, fix and rebuild before claiming green.

### Final report message (exact wording per brief line 295)
> **"Brief 02 complete. Both repos changed and built green. Evidence in the completion report. No mail sent to the real client."**

---

## Pragmatic deviations carried forward (already flagged + acked)

1. **2-step `/cabin/me` wizard instead of strict 3-step** (Aboard kept on `/cabin/me` alongside Crew List). Data-loss bug is closed + shoe_size added. To meet the literal brief, future cleanup creates `/cabin/me/aboard/page.jsx` + adds "Step N of 3" eyebrows.
2. **Tri-state shimmer** on `/cabin/brief/dining` + beverages first paint (~150ms). Could be eliminated by RSC + cookie-side role check.
3. **`.claude/launch.json`** restored to best-guess (`gy-dev` + `gy-prod` on port 3000) after a session-1 mishap. Gitignored; re-tune if needed.
4. **Orphan `s()` + `fmtIsoSafe` helpers** remain in `gy-command crew-list/page.tsx` (no longer called after merge() extraction). TS compile clean. Cleanup follow-up.
5. **Orphan opt-out CSS** classes (`me-contribute__optout*`) remain in the `<style>` block of `/cabin/me/page.jsx` even though the JSX is gone. Harmless dead CSS; cleanup follow-up.

---

## Session-2 transient state (cleanup)

- **Dev server** that was on port 3100 in the worktree — **stopped at end of Session 2**.
- **KV sessions** minted as `cabin:session:brief02test-p-1779791134` (principal) + `cabin:session:brief02test-g-1779791134` (guest) for CP3 tests. TTL 1h, expired by Session 3 start. Mint fresh via the same KV `POST /set/...` pattern (see `/tmp/brief02-a3-test.sh` for the recipe).
- **Stale `/tmp` artifacts:** `/tmp/brief02-cp3-tokens.env`, `/tmp/brief02-cp3-a4-test.sh`, `/tmp/brief02-cp3-a5-a8.sh`, `/tmp/brief02-tokens.env`, `/tmp/brief02-a3-test.sh`, `/tmp/_cabin_{guest,princ}.html`, `/tmp/_la_{guest,princ}.html`, etc. Disposable.
- **EFFIE STAR dining** still has the realistic Patricia Stevens blob from CP1 cleanup (`completed=true`, 100%).
- **EFFIE STAR member emails** are the REAL friend emails. Final must run the plus-email swap BEFORE the submit test.

---

End of hand-off.
