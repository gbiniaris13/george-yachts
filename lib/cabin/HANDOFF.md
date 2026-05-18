# The Cabin · Filotimo — Handoff for next chat session

**Last updated:** 2026-05-18 by Roberto (Claude Opus 4.7 1M)
**Owner:** George P. Biniaris · George Yachts Brokerage House LLC
**Branch in `george-yachts`:** `claude/strange-yonath-963c3a` (worktree)
**Branch in `gy-command`:** `main` (already pushed to production)

---

## TL;DR — What this is

A client portal for George's yacht charter clients. They get a magic link,
log in, fill a Charter Brief (8-9 sections), seal a time capsule, chat
with George, view the voyage album after their week at sea, and join the
Filotimo Circle loyalty club. George manages everything from
`command.georgeyachts.com/dashboard/cabins`.

Brand: navy `#0D1B2A` · gold `#C9A84C` · ivory `#F8F5F0`. Fonts via
existing Sentient / General Sans / Switzer / Fraunces. Mobile-first PWA.

---

## Current state (2026-05-18)

### ✅ DEPLOYED TO PRODUCTION
- **gy-command** (admin): merged to main → `command.georgeyachts.com` live
  - Sidebar nav has 🧭 **The Cabin** under OPERATE group
  - `/dashboard/cabins` list + `/dashboard/cabins/[id]` detail working
  - `/dashboard/cabins/new` rewritten as **friendly form** (no JSON paste),
    rendered as fullscreen overlay above the matrix dashboard chrome
  - Friendly form sections: Vessel, Charter window, Principal charterer,
    collapsed Internal/ops + Crew profiles. Power-user JSON paste preserved
    in collapsed `<details>`.
- **george-yachts** (public site / cabin client): on branch
  `claude/strange-yonath-963c3a`, **NOT YET PUSHED TO MAIN**. Local dev
  works; preview deploy URL exists at
  `george-yachts-git-claude-strang-a767ab-george-biniaris-projects.vercel.app`.

### ⏳ NOT YET ON PRODUCTION (george-yachts main)
- Everything under `app/(cabin)/*`, `app/api/cabin/*`, `lib/cabin/*`,
  `lib/cost-cap.js`, `lib/anthropic-client.js`, `lib/gemini-client.js`,
  `lib/__tests__/*`, the 6 SQL migrations, the CSP changes in
  `next.config.mjs`. **Need to merge to main when George is ready.**

### 🧪 Test cabin in DB
- Supabase project: `lquxemsonehfltdzdbhq`
- Test cabin id: `06d7729b-a582-4443-bae6-1da9bddaedb7`
- Vessel: `M/Y Test Vessel`
- Principal charterer: `george@georgeyachts.com` (so George can log in himself
  via magic link to see the client side)

---

## What we built (full inventory)

### Public site (`/Users/.../george-yachts/.claude/worktrees/strange-yonath-963c3a/`)
- **`app/(cabin)/cabin/*`** — 15 routes:
  - `/login` (magic-link request)
  - `/welcome` (first-login onboarding: name, DOB, hometown)
  - `/` (Charter At-a-Glance home)
  - `/brief` + 9 section forms (arrival, guests, health, itinerary,
    life-aboard, dining, beverages, little-things, children)
  - `/chat` (5s-polled private chat with George)
  - `/before-you-sail` (welcome video + Open-Meteo weather + Greek phrases)
  - `/guests` (invite multi-guests, with bulk paste)
  - `/mood-board` (Pinterest-style)
  - `/voyage-album` (post-charter photos + videos)
  - `/time-capsule` (sealed paragraph)
  - `/crew`, `/menu`, `/vessel` (read-only, white-labeled)
  - `/filotimo-circle` (loyalty tier)
  - `/your-data` (Transparency Dashboard)
- **`app/api/cabin/*`** — 17 routes including auth, brief, chat,
  mood-board (regular + upload), voyage-album, time-capsule, guests,
  profile, concierge/confirm, your-data, admin endpoints (brief, chat,
  schedule-anchors, send-handoff)
- **`app/api/cron/cabin-memory-anchors`** — daily 06:00 UTC
- **`app/api/cron/cabin-time-capsules`** — daily reveal cron
- **`lib/cabin/*`** — 12 files (auth, supabase, email, schemas, prefill,
  audit, filotimo, anchors, storage, weather, chat, notify)
- **`lib/migrations/2026-05-16-the-cabin-*.sql`** — 6 migrations
  (foundation, foundation-patch, storage, chat, voyage-album,
  welcome-video, seed). ALL APPLIED to production Supabase via MCP.

### Admin (`/Users/.../gy-command/src/`)
- **`app/dashboard/cabins/page.tsx`** — list
- **`app/dashboard/cabins/new/page.tsx`** — friendly form (overlay)
- **`app/dashboard/cabins/[id]/page.tsx`** — detail
- **`app/dashboard/cabins/[id]/{edit,content,chat,audit,print,preference-sheet}/page.tsx`**
- **`app/api/cabins/route.ts`** + **`app/api/cabins/[id]/*/route.ts`** —
  11 admin routes proxying to public-site `/api/cabin/admin/*`
- **`lib/cabin-admin.ts`** — service-role helper
- **`app/dashboard/layout.tsx`** — added "The Cabin" nav entry

### Cost cap (€10/month per AI provider) — IMPORTANT
After the Vercel €20→€90 disaster, George demanded bulletproof cost
protection. 4-layer defense:

1. **`AI_FEATURES_ENABLED` env** (master kill switch, default `false`).
   Currently set to `true` in Vercel production + development for
   george-yachts so existing Ask George / AI visibility / etc keep working.
2. **`lib/cost-cap.js`** — per-provider monthly cap with KV counter,
   Telegram alerts at 80% + 100%.
3. **`lib/anthropic-client.js` + `lib/gemini-client.js`** — mandatory
   wrappers. Every AI call routes through these.
4. **`lib/__tests__/ai-usage-guard.test.js`** — build-time test that
   FAILS if any code outside the wrappers tries to hit `api.anthropic.com`,
   `api.openai.com`, or `generativelanguage.googleapis.com`.

13/13 tests pass. Live spend dashboard: `GET /api/admin/cost-cap?secret=<CABIN_ADMIN_SECRET>`.

Refactored existing files to go through the wrappers:
- `lib/aiMonitoring.js` (Anthropic), `lib/contentPipeline.js` (Anthropic)
- `lib/ai-visibility.js` (Gemini), `app/api/ask-george/route.js` (Gemini stream)

### What's NOT covered by the cap
- gy-command has its own Gemini + OpenAI usage (newsletter, voice-brief,
  visitor-intel, command-center/ask). These are in a separate repo and
  do NOT go through our cap. George knows; he can ask for extension later.

---

## Key environment variables

### george-yachts Vercel production
Set + verified:
- `CRM_SUPABASE_URL`, `CRM_SUPABASE_SERVICE_KEY` (cabin falls back to these)
- `RESEND_API_KEY` (sensitive — empty in pull, real in dashboard)
- `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- `CRON_SECRET`
- `CABIN_ADMIN_SECRET` (added this session)
- `CABIN_PUBLIC_URL=https://georgeyachts.com` (added this session)
- `GY_COMMAND_URL=https://command.georgeyachts.com` (added this session)
- `AI_FEATURES_ENABLED=true` (added this session)
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (sensitive, empty in pull)

### gy-command Vercel production
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side)
- `CABIN_ADMIN_SECRET` (must match george-yachts')
- `CABIN_PUBLIC_URL=https://georgeyachts.com`
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` (Gemini OpenAI shim, existing)
- `OPENAI_API_KEY` (existing, voice-brief)

### Local dev
- `.env.local` in BOTH george-yachts and gy-command (copies of Vercel pull
  + manually-added CABIN_ADMIN_SECRET, CABIN_PUBLIC_URL=http://localhost:3000)

---

## How George tests / uses

### His admin entry
`https://command.georgeyachts.com/dashboard/cabins`
(or local: `http://localhost:3001/dashboard/cabins`)

### Client entry (for testers/friends)
`https://georgeyachts.com/cabin/login` (once we merge to main)
OR currently preview URL or `http://localhost:3000/cabin/login`

### Plan for friend-testing (today's question)
George creates 5-6 SEPARATE cabins (one per friend) so each tester is a
principal_charterer experiencing the full client flow. Not guests in one
cabin (limited role).

---

## Known issues / pending decisions

### Pending (not blockers)
- **Videos on voyage album** — built but George undecided about €4-20/year
  storage cost. Currently 50MB limit, MIME = mp4/mov/webm allowed.
- **PDF auto-fill** — discussed but not built. Cost: ~$0.005/PDF via
  claude-haiku. Wrapper ready; awaiting George's go-ahead.
- **gy-command AI cap extension** — Gemini + OpenAI in gy-command repo
  are uncapped. Easy to extend; awaits George's decision.
- **Merge george-yachts cabin branch to main** — currently on worktree
  branch; needs merge + Vercel production deploy.

### Yellow items (documented in audit, not blockers)
- Rate limit on admin endpoints (CABIN_ADMIN_SECRET leak = abuse)
- Magic-byte MIME sniff on uploads (`file.type` is spoofable)
- Athens DST off-by-one in memory anchor scheduled times
- At-least-once email delivery semantics (rare duplicates possible)
- Anchor randomized dates re-shuffle on re-schedule

### Critical fixes already applied this session
1. CSP block on Supabase Storage URLs (photos showed broken) — fixed in
   `next.config.mjs`
2. `cabin_guests_manifest` is a TABLE not column — fixed in brief overview
3. Cross-cabin role escalation (`memberships[0].role`) — fixed with
   `resolveMembership(session, cabinId)` helper
4. `kvSet` object-form bug — fixed (was breaking magic link entirely)
5. ChatLog NUL byte in regex — fixed
6. Multiple page null-guard crashes — fixed
7. Anthropic + Gemini cost-cap wrappers — built
8. Friendly /dashboard/cabins/new form (matrix theme escape) — built

---

## Things George cares about (carry into next chat)

1. **Don't break working features.** When adding caps/restrictions, make
   sure existing AI features (Ask George chatbot, AI visibility cron,
   newsletter generation) keep functioning. He said: "κάνουμε
   αναβαθμίσεις, όχι πισωγύρισμα".
2. **Cost discipline.** Vercel €20→€90 trauma. Always show €/€ before
   suggesting anything paid. Default new features to OFF, not ON.
3. **Mobile-first.** Charterers will use this on phones during voyage.
   Test on iPhone Safari.
4. **No PII to yachts.** Preference sheet (for owner/captain) must be
   PII-stripped. Crew list is the only place names go to vessel side.
5. **Privacy first.** Photos always opt-in. Time capsule never readable
   by George. Charter brief PII visible only to George, never to vessel.
6. **Greek-friendly explanations.** George speaks Greek; explain things
   in Greek when he asks. Code is English.
7. **Telegram alerts.** Most operator notifications go to Telegram (chat
   notifications, brief submitted, cost-cap thresholds, time capsule
   sealed). Token in Vercel env (sensitive).

---

## Next steps the user is likely to ask about

1. Merge `claude/strange-yonath-963c3a` branch to main for `george-yachts`
   so cabin features go live at `georgeyachts.com/cabin/login`.
2. Make `/dashboard/cabins/new` validation tighter / add more polish
3. Build the post-charter voyage bundle generator (manual trigger button
   that emails a PDF + photos summary to the cabin members).
4. Build PDF auto-fill (drop MYBA contract → claude-haiku extracts fields).
5. Extend cost-cap to gy-command's existing Gemini + OpenAI calls.
6. Form-based crew/menu editor at `/dashboard/cabins/[id]/content`
   (currently still a JSON textarea — flagged in user feedback).
7. Friend test rollout (today George creates 5-6 cabins for testers).

---

## Files I touched this session — quick map

**george-yachts repo:**
- New: `app/(cabin)/**`, `app/api/cabin/**`, `app/api/cron/cabin-*`,
  `app/api/admin/cost-cap`, `app/components/cabin/**`, `lib/cabin/**`,
  `lib/cost-cap.js`, `lib/anthropic-client.js`, `lib/gemini-client.js`,
  `lib/__tests__/cost-cap.test.js`, `lib/__tests__/ai-usage-guard.test.js`,
  `lib/migrations/2026-05-16-the-cabin-*.sql` (6 files),
  `middleware.js`, `public/cabin/**` (icons + manifest)
- Modified: `next.config.mjs` (CSP for Supabase + AI providers),
  `app/globals.css` (cabin-mode hides chrome), `app/api/ask-george/route.js`
  (routes through cap), `lib/aiMonitoring.js`, `lib/contentPipeline.js`,
  `lib/ai-visibility.js`, `vercel.json` (cabin cron entries),
  `package.json` (added @hookform/resolvers, @supabase/ssr,
  @supabase/supabase-js, react-hook-form)

**gy-command repo:**
- New: 11 admin route handlers + 8 dashboard pages under `app/api/cabins/**`
  and `app/dashboard/cabins/**`, plus `lib/cabin-admin.ts`
- Modified: `app/dashboard/layout.tsx` (added "The Cabin" nav item)

---

## How to resume next chat

Read this file first. Then:
- If George wants to keep iterating on the form / new feature: look at
  the relevant route file + commit log.
- If George wants to merge to main for georgeyachts.com:
  `cd /Users/.../george-yachts && git checkout main && git pull && git
  merge claude/strange-yonath-963c3a --no-ff && git push`. Verify Vercel
  build succeeds (the Sanity build error was pre-existing, not caused by us).
- If George reports a bug: check the test cabin id above, log into local
  dev, reproduce.

Good luck, future-self.

— Roberto
