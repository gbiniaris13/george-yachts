# Brief 02 — Hand-off note (Session 1 → Session 2)

**Created:** 2026-05-26 (end of CP2)
**Brief:** `ROBERTO_BRIEF_02_CABIN_SINGLE_RESPONSIBILITY.md` (in Downloads)
**Session 1 outcome:** **CP1 + CP2 green. CP3 + CP4 + Final still to do.**

---

## Where to pick up

### Repos / branches / worktrees

Both repos have a fresh worktree off `main` on the branch **`claude/brief-02-single-resp`**:

- **`george-yachts`** — `/Users/.../Projects/george-yachts/.claude/worktrees/brief-02-single-resp`
  - Branched from `main` HEAD `40b6022` ("docs: comprehensive THE-CABIN-ARCHITECTURE.md")
  - All Session-1 changes are committed on this branch. Two commits:
    1. CP1 — server gate (A1.1 + A1.3)
    2. CP2 — guest read-only + force-save + shoe_size + this handoff
  - `node_modules` is a symlink to the main repo's `node_modules` (saves install time).
  - `.env.local` is a copy of the main repo's `.env.local`.

- **`gy-command`** — `/Users/.../Projects/gy-command/.claude/worktrees/brief-02-single-resp`
  - Branched from `main` HEAD `1dcccce` ("cabin/admin: airport picker now finds international (relations + score), UI summary auto-updates after refresh")
  - **No commits yet** — PART B (B1, B2, B3) is for Session 2.

### Test cabin (use ONLY this one for every acceptance check)

- **Cabin ID:** `1576342b-c921-4b29-a76c-1b8c91416076` (EFFIE STAR)
- **Principal:** `george@georgeyachts.com` — display "Patricia R. Stevens" — member `1c0ce055-50fd-413e-9d06-74ab04ea6c02`
- **Guests:** 8 friends, all test users. Use `elekarv@gmail.com` (Eleanna Karvouni, member `020735b6-6a3c-43ee-add3-466493c81ea7`) as the default guest cookie subject.

### Hard rules carried forward (do not break)

1. **Plus-addressed email swap BEFORE any submit/A6/A7 test.** Before triggering `POST /api/cabin/brief/submit`, UPDATE every `cabin_members.email` on this cabin (and `cabins.principal_charterer_email`) to throwaway plus addresses like `george+effie-principal@georgeyachts.com`, `george+effie-guest1@georgeyachts.com`, etc. Verify the swap in the DB **before** triggering submit. Broker email + Telegram to George are fine. **NEVER let test mail reach the real friend emails.**
2. **Idempotent write rule for all acceptance PUTs (CP3 onwards):** read current section data first, PUT back the exact same data. The 200 proves the write path works; the data is unchanged. **NEVER send empty `{}` or a synthetic partial payload to a populated section row.** If a test specifically needs to prove a change persists, change one harmless field, verify, then write the original back.
3. **Two-repo contract:** cabin schema lives in `george-yachts` only. `gy-command` never adds columns. Any new column needs an `apply_migration` in `george-yachts`.
4. **Boutique tone + safety:** see THE-CABIN-ARCHITECTURE.md §2 "Hard non-negotiables".

---

## What's done (CP1 + CP2)

### CP1 — Task A1: server gate
- `app/api/cabin/brief/[section]/route.js` — added `"life_aboard", "dining", "beverages"` to `PRINCIPAL_ONLY_SECTIONS` Set (with comment block referencing Brief 02). Guests now 403 on PUT to those three sections.
- `app/api/cabin/me/life-aboard/route.js` — added a `principal_charterer || is_brief_admin` gate to the PUT handler. Same 403 message shape as the brief route.
- **Acceptance pasted in the session log:**
  - Guest PUT dining/beverages/life-aboard → all **403** ✓
  - Principal PUT dining → **200** ✓

### CP2 — Task A2: guest read-only on dining/beverages
- New file `app/components/cabin/brief/GuestBriefReadOnly.jsx` (~300 LOC) — generic read-only renderer with label maps for dining + beverages keys, food_matrix sub-grid, labelQty array rendering, empty-row omission.
- `app/(cabin)/cabin/brief/dining/page.jsx` — `isPrincipal` is now **tri-state** (`null|true|false`). `null` → loading skeleton; `false` → guest branch (SectionTitle + AllergyAlert + `<GuestBriefReadOnly kind="dining" />` + "← Back to your Cabin" link, **zero form controls**); `true` → existing principal tree (unchanged). The `is_brief_admin === true` case also gets the edit tree (mirrors A1 server gate).
- `app/(cabin)/cabin/brief/beverages/page.jsx` — same pattern (no AllergyAlert there).
- **Acceptance pasted in the session log:**
  - Guest SSR — `<input>` + `<textarea>` + `<select>` = 0, `checkbox|radio` = 0 on both pages ✓
  - Principal post-mount: 31 input-rendering components in DiningFields + 20 in BeveragesFields (static count; principal branch source unchanged)

### CP2 — Task A3: `/cabin/me` force-save + shoe_size
- `app/api/cabin/me/route.js` — `sanitisePersonalDetails()` allowlist now includes `shoe_size` (cleanStr 24).
- `app/(cabin)/cabin/me/page.jsx`:
  - Form state init + load now track `shoe_size`.
  - New "Shoe size" input rendered in the "Aboard the yacht" block between cabin pairing and celebration.
  - New `onContinueToPrivate(e)` handler: if clean & idle → `router.push("/cabin/me/private")`; if dirty → set pending nav + trigger `onSave` (which navigates after the PUT lands); if mid-save → queue the nav.
  - The vanilla `<Link href="/cabin/me/private">` "Open my private notes →" replaced by an `<a>` with `onClick={onContinueToPrivate}`. Button label changes to "Saving — opening when done…" while a deferred nav is queued.
- **Acceptance pasted in the session log:**
  - PUT `/api/cabin/me` (guest, idempotent + new shoe_size) → **200** ✓
  - GET `/api/cabin/me` → returns shoe_size: "EU 39" + all prior fields preserved ✓
  - DB readback: `cabin_members.personal_details` for Eleanna now has `shoe_size: "EU 39"` and the entire pre-existing blob is intact ✓

---

## Pragmatic deviations from the brief (already flagged + acked)

1. **2-step wizard instead of strict 3-step.** Step 1 (Crew List) and Step 3 (Aboard) are both on `/cabin/me`; Step 2 (Private) on `/cabin/me/private`. Data-loss bug is closed (Private link is force-save), shoe_size is added, but the brief's literal "Step 3 on its own page" isn't there. To close the gap: create `app/(cabin)/cabin/me/aboard/page.jsx` (~150 LOC of similar plumbing: form state for cabin_pairing/shoe_size/special_dates/anything_else + force-save "Save & Finish" button → `/cabin`). Remove those four fields from `/cabin/me`. Add "Step N of 3" eyebrows on each page.
2. **No "Step N of 2/3" eyebrow yet.** Pure visual polish; force-save behavior matters more. Add in CP3 or whenever Step 3 page lands.
3. **Tri-state shimmer (A2).** Principal sees ~150ms of skeleton on first paint while the role resolves. Could be eliminated by resolving role server-side (convert pages to RSC + cookie read). Out of scope for today; noted as polish.
4. **`.claude/launch.json` mishap.** Original was overwritten when I tried to wire Claude Preview MCP. Restored to best-guess (`gy-dev` + `gy-prod` standard Next.js configs on port 3000). Gitignored, so no history to recover; if originals had custom ports or args, re-tune.

---

## CP3 — A4 through A8 (next session)

Brief paths (all in `george-yachts`):

### A4 — `life-aboard` follows the new model
- **Preferred (A4.1):** `app/(cabin)/cabin/brief/life-aboard/page.jsx` wraps in `<PrincipalOnlyGate>` so guests see the "Principal only" banner. Principal writes to the shared `cabin_brief_sections.life_aboard` row via the standard `/api/cabin/brief/life-aboard` endpoint (NOT `/api/cabin/me/life-aboard`, which is now principal-only at the server but writes to `cabin_members.personal_details.life_aboard_brief` — wrong table for the new model).
- **Fallback (A4.3) if A4.1 risky:** hide the life-aboard section from the brief flow for everyone.
- Acceptance: guest GET of `/cabin/brief/life-aboard` shows the principal-only banner (or redirect), never a form. (Server gate already in place from CP1.)
- Files: `app/(cabin)/cabin/brief/life-aboard/page.jsx`, possibly `lib/cabin/prefill.js` for completion %, `app/components/cabin/NextStep.jsx` (remove life-aboard from guest decision tree per A4.2).

### A5 — Guest "you're done" + dedupe crew-list nag
- After a guest finishes their Crew List, route to a calm done-state with the joy features (WhatsApp, berth map, crew bios, album). Could be `/cabin` home with the right state.
- Fix the duplicate crew-list prompt on `/cabin` home (NextStep + PreVoyageSteps both render it). Keep one. When complete, neither nags.
- `NextStep.jsx` decision tree for guests: only point at (a) Crew List or (b) done. Never dining, beverages, life-aboard, or "confirm brief picks".
- Files: `app/components/cabin/NextStep.jsx`, `app/components/cabin/PreVoyageSteps.jsx`, possibly `app/(cabin)/cabin/page.jsx`.

### A6 — Children + per-member allergy roll-up
- `app/(cabin)/cabin/brief/children/page.jsx` — wrap in `<PrincipalOnlyGate>` (server gate is NOT yet covering children; needs to be added to `PRINCIPAL_ONLY_SECTIONS` Set in `app/api/cabin/brief/[section]/route.js` AND the UI gate).
- `lib/cabin/email.js → sendBriefSubmittedEmail` (and the Telegram payload) — assemble a per-member allergy roll-up from every member's `personal_details.allergies_dietary`. Reuse the existing `/api/cabin/brief/group-allergies` aggregator logic.
- Acceptance: trigger a test submit (PLUS-EMAIL SWAP FIRST, per hard rule 1). Paste the broker-email section that lists each member's allergies. Confirm a member who set an allergy in `/cabin/me/private` appears in the roll-up even though the principal didn't type it into dining.
- Files: `app/api/cabin/brief/[section]/route.js` (add `"children"` to Set), `app/(cabin)/cabin/brief/children/page.jsx`, `lib/cabin/email.js`.

### A7 — Confirmation email copy under new model
- `lib/cabin/email.js → sendBriefMemberConfirmation` — rewrite the copy:
  > *"The Main Charterer made the final choices for the itinerary, dining and the cellar on behalf of the group. Your own details and any allergies you noted have been passed to the crew exactly as you entered them."*
- Remove any old wording implying shared/contributed choices.
- Acceptance: paste the rendered plain-text copy.

### A8 — Disable dead code
- Remove `<GuestAdditiveBanner>` mounts from dining + beverages pages (both branches — currently kept in the principal branch of /cabin/brief/dining + /cabin/brief/beverages from CP2; need to remove there too).
- Remove `<GroupVoicesPanel>` mount from `/cabin/brief/dining/page.jsx`.
- Verify `mergeForGuest` in `lib/cabin/brief-merge.js` has no live call paths reachable by a guest (the route 403s before reaching it, so it's effectively dead). Leave the function in the file.
- Confirm zero live links to: `/cabin/me/contribution/*`, `/cabin/me/at-the-table`, `/cabin/me/in-the-cellar`, opt-out toggle. Grep + remove from active components. Leave route files orphaned (back-compat).
- Disable the opt-out toggle UI in `/cabin/me/page.jsx` (the `<details className="me-contribute__optout">` block, lines ~803-844). Keep the `brief_participation_opt_out_at` column read on the CRM preference sheet (PART B already reads it). Do NOT delete the column or the submit-gate logic yet.
- Acceptance: paste greps showing zero live mounts + zero live hrefs.

---

## CP4 — PART B (gy-command, next session)

In the **`gy-command` worktree** at `/Users/.../Projects/gy-command/.claude/worktrees/brief-02-single-resp` on branch `claude/brief-02-single-resp`.

### B1 — Extract `mergeGuestRecords` shared helper
- Extract `merge(members, manifest, principalSeed)` from `src/app/dashboard/cabins/[id]/crew-list/page.tsx` (lines 108-181 per the recon report) into a new `src/lib/cabin-guest-merge.ts`.
- New shape adds fields the preference sheet + print need: `cabin_pairing`, `shoe_size`, `allergies_dietary`, `allergies_severity`, `emergency_note`. Pull from `personal_details` first, fall back to manifest (member-self wins, same rule).
- Rewrite `src/app/dashboard/cabins/[id]/preference-sheet/page.tsx` `GuestCard` to source from `mergeGuestRecords(...)`.
- Rewrite `src/app/dashboard/cabins/[id]/print/page.tsx` guest `SubBlock` to source from `mergeGuestRecords(...)`.
- `crew-list/page.tsx` imports the shared helper (no behavior change).
- The merge must include every non-deleted `cabin_members` row even if there's NO matching manifest row (new-model guests live only in personal_details).
- Acceptance: in EFFIE STAR, ensure at least one guest has crew-list data ONLY in `personal_details`. Open `/dashboard/cabins/[id]/preference-sheet` and `/print` and confirm that guest's DOB + passport + allergy now render (not a blank dash). Paste the values from both pages.

### B2 — Chef-facing aggregated allergy roll-up
- On `/dashboard/cabins/[id]/preference-sheet/page.tsx`, in the Health & Safety section (around line 665), ADD a new sub-block titled **"Allergies across the whole party (chef briefing)"**.
- One line per member who has any allergy/dietary note, format `{member name}: {allergies_dietary}`. If `allergies_severity === "life_threatening"`, render with the existing red life-threatening styling (already used in the GuestCard around lines 1188-1217).
- Source: `mergeGuestRecords(...)` from B1.
- If no member has an allergy: render one calm line "No allergies reported by the party." (Don't hide the block — absence-of-allergy is itself information the chef wants confirmed.)
- Keep the principal's free-text `health.allergies_dietary` row too.
- Acceptance: give two members two different allergies via `personal_details` (one life-threatening). Open `/preference-sheet`, paste the rendered block.

### B3 — Brief-progress labels (light touch)
- `src/app/dashboard/cabins/[id]/page.tsx` — the `SECTION_LABELS` map has 9 entries. After PART A, `life_aboard` may be handled differently. If A4.3 fallback was taken (life-aboard disabled), make sure its dot doesn't drag the percentage down. Coordinate with whatever `brief_completion_percent` is computed from on the public-site side (`lib/cabin/prefill.js → recomputeCabinCompletion`).
- Do NOT redesign the cabin detail page. Do NOT touch the action bar. Out of scope today.

---

## Final — C1 + builds (last)

After CP3 + CP4 land:

### C1 — End-to-end on EFFIE STAR (no real mail per hard rule 1)
1. As a guest (Eleanna's session token in KV, or freshly minted), fill ONLY the Crew List via the new `/cabin/me` flow (DOB, passport, an allergy).
2. Confirm the guest cannot reach or write dining/beverages/life-aboard (403 + read-only view).
3. As the principal (george@georgeyachts.com session), fill dining + beverages + itinerary, then Send to George. **PLUS-EMAIL SWAP DB UPDATE FIRST** so no friend gets a test email. Use throwaway plus-addresses on every member.
4. In the CRM, open `/dashboard/cabins/[id]/preference-sheet`: confirm the guest's self-filled passport + allergy appear (B1) and the chef allergy roll-up lists that guest (B2).
5. Confirm dining/beverages on the preference sheet reflect the principal's choices.

Paste a short narrative with the key values observed.

### Builds
- `cd /Users/.../Projects/george-yachts/.claude/worktrees/brief-02-single-resp && npm run build` → paste final success line
- `cd /Users/.../Projects/gy-command/.claude/worktrees/brief-02-single-resp && npm run build` → paste final success line
- **If a build fails the brief is NOT done.** Fix and re-build before claiming green.

### Final report message (exact wording per brief line 295)
> **"Brief 02 complete. Both repos changed and built green. Evidence in the completion report. No mail sent to the real client."**

---

## Session 1 leftovers (transient state)

- **Dev server** that was running on port 3100 in the worktree — **stopped at end of Session 1**. To restart in Session 2: `cd <worktree> && PORT=3100 npm run dev`.
- **KV sessions** minted for Patricia (principal) and Eleanna (guest) under tokens `brief02test-principal-1779787626` and `brief02test-guest-1779787626` — TTL 1h, expired by Session 2 start. Mint fresh ones via the same `curl POST /set/cabin:session:<token>` pattern in `/tmp/brief02-a3-test.sh` if needed.
- **Stale `/tmp` artifacts:** `/tmp/brief02-tokens.env`, `/tmp/brief02-a3-test.sh`, `/tmp/a3-payload.json`, `/tmp/r{1..4}.json`, `/tmp/reseed.json`, `/tmp/put.json`, `/tmp/get.json`, `/tmp/brief02-guest-dining.html`. Disposable; ignore or `rm`.
- **/cabin/me/page.jsx** has had the `Open my private notes →` Link replaced. The button text changes to "Saving — opening when done…" while a deferred nav is queued (pendingNav state surfaces it). Eleanna's specific bug path is closed.
- **EFFIE STAR dining** was nuked during CP1 acceptance test 4 (empty PUT) and re-seeded with a realistic Patricia Stevens blob — completed=true, 100% overall. The realistic blob is documented inline in the session log + on the DB row at `cabin_brief_sections` where `cabin_id='1576342b-…'` and `section_key='dining'`.

---

End of hand-off.
