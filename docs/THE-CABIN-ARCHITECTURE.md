# The Cabin — full architecture & rationale

_Last updated: 2026-05-25 (Eleanna pass)._
_Authoritative reference for every contributor working on `/cabin/*`._

This document is the canonical map of The Cabin: what it is, why it exists,
how the code is organised, what every route + table + component does, and
the design constraints that have shaped every decision so far. If a future
change contradicts anything here, this file is the doc to update.

---

## 1. What The Cabin is

**The Cabin** is a private, invitation-only portal at
`georgeyachts.com/cabin` that opens for a charter client (the **principal
charterer**) and their group **after** a Greek yacht charter has been
booked. It runs for the weeks before, during, and immediately after the
voyage. It is the single surface where the client and their guests give
George Yachts everything the chef, captain, hostess and George himself
need in order to make the week feel personal — without ever asking for
spreadsheets, PDFs or email back-and-forth.

It is not:
- A booking flow (the booking happens privately with George, often offline).
- A public marketing surface (the rest of `georgeyachts.com` is that).
- A CRM (operator work happens in the sibling repo `gy-command` at
  `command.georgeyachts.com`).

### Why it exists

George Yachts positions itself as a **luxury boutique broker**. Direct
competitors (large MYBA charter agencies) hand the client a 14-page
preference-sheet PDF + a passport-photo email + a "fill the cellar list"
spreadsheet. The result: clients drop out, half the chef's information
arrives wrong, the captain prints a stack of papers, and the experience
feels like an airline check-in. George's brief from day one:

> «Δεν θέλω να δίνουμε στους πελάτες μας ένα PDF. Θέλω μια καμπίνα — δικιά
> τους, όλη η εβδομάδα να ζει εκεί. Να μπαίνουν, να μου λένε τι θέλουν με
> τη γλώσσα τους, να βλέπουν την προετοιμασία να γίνεται.»

The Cabin is the response: a soft, magazine-styled, single-purpose web app
that **walks every client (and every guest) through the few things the
crew actually needs**, and quietly hands those things to George Yachts in
the back office. It is meant to feel like a private hotel concierge app —
not a form.

---

## 2. Architecture at a glance

```
                           ┌──────────────────────────────────┐
                           │   georgeyachts.com (this repo)   │
                           │                                  │
   public marketing  ◀──── │  /  /yachts  /destinations  …    │
                           │                                  │
   The Cabin (clients)─┐   │  /cabin/*                        │
                       │   │    ↳ Next.js App Router          │
                       │   │    ↳ "use client" forms          │
                       │   │    ↳ Server Components for pages │
                       │   │                                  │
                       │   │  /api/cabin/*                    │
                       │   │    ↳ Node runtime                │
                       │   │    ↳ Edge middleware gate        │
                       │   └──────────────────────────────────┘
                       │
                       │            Supabase Postgres
                       │              ▲       ▲
                       │              │       │
                       └──────────────┘       │
                                              │
              ┌───────────────────────────────┴──────────────────────┐
              │   command.georgeyachts.com (gy-command repo)         │
              │                                                      │
              │   /dashboard/cabins/:id   ← George's operator surface│
              │   /dashboard/newsletter   ← unrelated CRM             │
              └──────────────────────────────────────────────────────┘

External services (all free tier or already-paid):
  • Supabase (Postgres + Storage)        — DB + photo storage
  • Upstash KV (Vercel KV REST API)      — sessions + OTP + counters
  • Resend                               — transactional email
  • Telegram Bot API                     — operator notifications
  • Leaflet + OSM/CartoDB                — berth map (no key)
  • Overpass + OSRM (gy-command only)    — nearby POIs (no key)
```

### Tech stack

| Layer        | Choice                                  |
|---           |---                                      |
| Framework    | Next.js 15 App Router                   |
| Hosting      | Vercel (Pro plan)                       |
| DB           | Supabase Postgres 17                    |
| File storage | Supabase Storage (`cabin-mood-board`, `cabin-voyage`) |
| Sessions     | Vercel KV (Upstash) — REST API, no SDK  |
| Email        | Resend                                  |
| Auth         | Magic-link OTP (no passwords, no third-party auth) |
| Forms        | React Hook Form + Zod (`lib/cabin/schemas.js`)     |
| Maps         | Leaflet 1.9 + raster tiles (OSM/CartoDB) |
| Notifications| Telegram bot URL inline buttons + Resend emails    |

### Hard non-negotiables

1. **Always free at runtime.** Every service in the stack is either free
   tier or already-paid (Vercel Pro + Supabase free + Resend free).
   No new API keys, no per-request billing.
2. **Don't break the marketing site.** All cabin styling is scoped
   to `[data-cabin-mode]` (see `app/(cabin)/cabin-tones.css` and
   `cabin-luxury.css`). Marketing pages MUST never inherit cabin rules.
3. **Customer copy is English only.** The audience is international
   UHNW; even Greek POIs are transliterated (`englishName()` in
   `BerthNearby.jsx`).
4. **George is the broker, never "the captain"** in customer copy. The
   client's direct point of contact is George; the captain is on board.
5. **Every distance is metric + imperial** (`400 m · 1,310 ft`).
6. **Honest UX.** No fake-presence dots, no fake countdowns, no
   "everyone has booked!" pressure copy.

These are encoded in `CLAUDE.md` ("Working in georgeyachts.com" → "The
Cabin — what every contributor must respect"). Read those rules before
touching anything under `/cabin`.

---

## 3. Repository layout

```
app/(cabin)/                  ← route group; all routes here mount the
                                cabin layout (boutique chrome, no
                                marketing nav)
  layout.jsx                  ← injects <div data-cabin-mode> wrapper
  cabin-tones.css             ← contrast + brand-tone rules (LOAD FIRST)
  cabin-luxury.css            ← animations, hover, typography polish
  cabin/                      ← every customer-visible page
    page.jsx                  ← /cabin home (the dashboard)
    layout.jsx                ← cabin shell + auth check
    login/                    ← magic-link request form
    welcome/                  ← first-login onboarding gate
    me/                       ← "your details" (per-member)
      page.jsx                ← crew-list essentials + aboard fields
      private/                ← allergies, dietary, swimming (GDPR-private)
      at-the-table/           ← redirect → /cabin/brief/dining
      in-the-cellar/          ← redirect → /cabin/brief/beverages
    brief/                    ← the multi-section preference questionnaire
      page.jsx                ← overview / progress
      arrival/                ← Section 1 (principal-only)
      guests/                 ← Section 2 (principal-only)
      health/                 ← Section 3 (principal-only, emergency contact)
      itinerary/              ← Section 4 (principal-only)
      life-aboard/            ← Section 5 (per-member, not shared)
      dining/                 ← Section 6 (shared)
      beverages/              ← Section 7 (shared, last)
      children/               ← Section 8 (only when minors aboard)
      review/                 ← principal-only review + Send to George
    chat/                     ← WhatsApp deep link to George (only the link)
    crew/                     ← captain / chef / hostess names + bios
    guests/                   ← invite + manage cabin members
    menu/                     ← read-only sample menu
    mood/                     ← gallery hero (legacy alias of mood-board)
    mood-board/               ← inspiration photo board
    voyage-album/             ← post-voyage photo upload + carousel
    album/                    ← legacy alias of voyage-album
    before-you-sail/          ← packing checklist + practicalities
    filotimo-circle/          ← loyalty tiers (Filotimo programme)
    install/                  ← PWA add-to-home instructions
    vessel/                   ← deep dive on the boat
    time-capsule/             ← sealed messages opened on a future date
    share/[token]/            ← shareable preview link (read-only)

app/api/cabin/                ← REST endpoints (Node runtime)
  auth/                       ← request-link / verify / logout
  brief/                      ← section read/write + submit + wishlist
  me/                         ← personal_details read/write
  guests/                     ← invite & manage members (principal-side)
  mood-board/                 ← upload + reorder + delete
  voyage-album/               ← signed-upload + finalize flow
  sample-menu/                ← read-only menu fetch
  chat/                       ← (legacy internal chat, kept for CRM only)
  time-capsule/               ← seal a future-dated message
  concierge/                  ← confirm "George prepared this for me" handoff
  delegate-brief-admin/       ← principal hands brief-admin to a guest
  has-minors/                 ← thin helper used by the brief overview
  profile/                    ← welcome-page profile save
  admin/                      ← operator-side endpoints (CRM-callable)
  webhooks/                   ← (none yet — reserved)

app/components/cabin/         ← React components scoped to the cabin
  brief/                      ← every brief-form widget + helpers
  (root)                      ← shell, top-level cards, hero, photos

lib/cabin/                    ← server-only helpers (no React)
  auth.js                     ← magic-link session creation + cookies
  supabase.js                 ← server client + dbQuery wrapper
  schemas.js                  ← Zod schemas for every brief section
  brief-normalize.js          ← RHF payload → schema-friendly shape
  brief-merge.js              ← additive merge for shared brief sections
  life-aboard-format.js       ← per-member Life Aboard → bullet list
  format.js                   ← name / date / pretty helpers
  filotimo.js                 ← loyalty tier computation
  prefill.js                  ← server-side cabin "at a glance" + completion
  email.js                    ← Resend wrapper + every transactional template
  notify.js                   ← Telegram + email "ping George" helper
  audit.js                    ← writeAudit() — every meaningful action logs
  contributions.js            ← per-member contribution read/write (legacy)
  anchors.js                  ← memory anchors (post-voyage scheduled emails)
  share-tokens.js             ← short-lived /cabin/share/[token] tokens
  storage.js                  ← signed-upload helpers for mood + voyage
  vessel-photo-urls.js        ← resolve vessel brochure photo URLs
  weather.js                  ← lightweight forecast (gy-command sourced)
  menu-format.js              ← sample-menu display helpers
  chat.js                     ← legacy internal chat helpers (CRM only)
```

Size, current: **~13k lines** under `app/(cabin)/cabin/` (pages) +
**~7k** under `app/api/cabin/` (endpoints) + **~11k** under
`app/components/cabin/` + **~4k** under `lib/cabin/`.

---

## 4. Authentication

The Cabin uses **passwordless magic-link sessions** with no third-party
auth provider. There are zero passwords stored. The whole flow lives in
`lib/cabin/auth.js`.

### Token model

```
KV keys (all in Upstash):

  cabin:otp:<token>         — short-lived magic-link token
                              value: { email, target_cabin_id?, expires }
                              TTL:   90 days (OTP_TTL_SECONDS)

  cabin:session:<token>     — long-lived session cookie value
                              value: {
                                email,
                                memberships: [{ cabin_id, role, member_id, … }],
                                active_cabin_id,
                                issued_at,
                                expires
                              }
                              TTL:   365 days (SESSION_TTL_SECONDS)
```

### Flow

```
1. Client visits /cabin/login → enters email
2. POST /api/cabin/auth/request-link
   → findMembershipsForEmail() — checks cabin_members for email
   → createMagicLinkOtp() — writes cabin:otp:<random> in KV
   → sendMagicLinkEmail() — emails the link via Resend
   → Returns OK regardless of email match (no enumeration leak)
3. Client clicks link → GET /api/cabin/auth/verify?token=<otp>
   → consumeMagicLinkOtp() — reads (doesn't delete) the OTP
   → findMembershipsForEmail() — re-resolves the user's cabins
   → createSession() — writes cabin:session:<token> in KV
   → setSessionCookie() — sets `gy_cabin_session=<token>` httpOnly cookie
   → 302 redirect to /cabin (or /cabin/welcome if onboarding incomplete)
4. Every subsequent request hits middleware.js:
   → handleCabin() — has cookie? slide TTL, allow; no cookie? 401/redirect
5. Inside any /api/cabin/* route or page:
   → readSessionFromCookies() — looks up the KV value
   → pickActiveCabinId(session) — which cabin is "current"
   → resolveMembership(session, cabinId) — { role, member_id }
```

### Sessions are sticky

A user lands once on a device → cookie stays for **365 days** with
sliding renewal on every page load. The OTP is also valid for **90
days** (multi-device login from a single email). This is intentional:
George's clients receive their cabin invitation weeks or months before
the voyage and may open the cabin from their laptop on Wednesday and
their iPhone on Sunday. Friction at re-login would feel un-boutique.

### Preview sessions (admin)

The CRM at `command.georgeyachts.com/dashboard/cabins/:id` has a
"Preview as customer" button. It calls
`/api/cabin/admin/enter-preview` which:
- Mints a `cabin:session:<token>` with `preview_mode: true` (15 min TTL)
- Sets BOTH `gy_cabin_session` (the normal session) AND a second cookie
  `gy_cabin_preview` (the preview flag, also 15 min)
- The Cabin renders exactly as the principal would see it — but the
  middleware rejects every `/api/cabin/*` write because `gy_cabin_preview`
  is present (`PREVIEW_BLOCKED_METHODS = {POST, PUT, PATCH, DELETE}`).

`useBriefAutosave` detects the preview cookie and shows a calm teal
"Admin preview · changes won't be saved" pill instead of the normal
"Couldn't save" error.

### Roles

`cabin_members.role` is an enum:
- `principal_charterer` — the person who booked the charter
- `guest` — every other invited member

There is also `cabin_members.is_brief_admin` (boolean) which the
principal can flip on a guest via `/api/cabin/delegate-brief-admin`,
giving them the right to press "Send to George" on the principal's
behalf.

---

## 5. Data model

All tables live in Supabase under the `public` schema. They were
designed bottom-up to mirror what George actually needs from a real
charter, not generic SaaS abstractions.

### `cabins` — one row per booked charter

The root entity. Created in `gy-command` when George turns a deal into
an active charter.

Key columns (subset):
```
id                                  uuid pk
status                              ENUM (draft|invited|active|submitted|archived)
vessel_name                         text  — "EFFIE STAR"
vessel_make_model, vessel_length, vessel_capacity
homeport
charter_period_from, charter_period_to
port_embarkation, port_disembarkation
cruising_area
principal_charterer_name            text — the "name we use to address them"
principal_charterer_email           text — magic-link target on day 1
principal_charterer_mobile
crew_display                        jsonb — { captain: "…", chef: "…", … }
sample_menu                         jsonb — chef's working menu shown on /menu
inspiration_content                 jsonb — destination cards on /cabin home
welcome_video_url, welcome_video_title
vessel_brochure                     jsonb — extracted PDF/MYBA content
vessel_photos                       jsonb — { hero, gallery: [], …  }
berth_label                         text  — "Alimos Marina, Pier 6"
berth_lat, berth_lng                numeric — Leaflet pin
berth_nearby                        jsonb — { airports[], hospitals[], … } pre-fetched in CRM
berth_nearby_fetched_at, berth_nearby_error
brief_completion_percent            int   — 0–100, recomputed in lib/cabin/prefill.js
brief_submitted_at                  timestamptz — when principal hit "Send to George"
brief_submitted_by_member_id        uuid → cabin_members(id)
brief_locked_at                     timestamptz — currently aliased to submitted
concierge_mode_active               bool  — George edited on behalf of client
concierge_mode_activated_at/by_email
charter_fee_eur, apa_eur            numeric — internal-only; never shown
central_agent_internal, vessel_owner_internal, captain/chef/hostess_name_internal
                                    text — internal-only; never shown
contract_internal                   jsonb — MYBA contract data; internal-only
deleted_at
```

### `cabin_members` — one row per person aboard

Every person who has access to a particular cabin. The principal is one
row. Each guest the principal invites is another row.

Key columns:
```
id                                  uuid pk
cabin_id                            uuid → cabins(id)
role                                ENUM (principal_charterer|guest)
email                               text — magic-link recipient
display_name                        text — preferred form ("Patricia R. Stevens")
mobile                              text
assists_member_id                   uuid → cabin_members(id) — "I'm filling for X"
last_login_at                       timestamptz
invite_sent_at                      timestamptz
consents                            jsonb — { share_with_crew: true, … }
deleted_at                          timestamptz — soft-delete
personal_details                    jsonb — see "personal_details shape" below
personal_details_completed_at       timestamptz — set by /api/cabin/me PUT when crew list is complete
is_brief_admin                      bool — delegated by principal
brief_participation_opt_out_at      timestamptz — "leave it to the group"
brief_participation_opt_out_note    text
brief_confirmed_at                  timestamptz — pressed "I confirm my picks"
```

#### `personal_details` JSONB shape

Tracked in `sanitisePersonalDetails()` (in `app/api/cabin/me/route.js`):

```jsonc
{
  // Crew-list essentials (mandatory before brief can lock)
  "date_of_birth":     "1991-01-13",
  "gender":            "male|female|non_binary|prefer_not_say",
  "nationality":       "American",
  "passport_number":   "AE 1516161",
  "passport_expiry":   "2029-01-13",
  "mobile":            "+30 6970380999",

  // Private to this member (allergies, dietary, swimming, mobility)
  // — surfaced on /cabin/me/private only
  "allergies_dietary":     "severe shellfish allergy",
  "dietary_preferences":   ["Vegetarian"],
  "swims":                 "confident|some|non_swimmer|prefer_not_say",
  "mobility_notes":        "recent knee surgery — slow with the ladder",
  "consent_share_with_crew": true,

  // "Aboard the yacht" — social, visible across group
  "cabin_pairing":              "sharing with my husband Andreas",
  "special_dates_during_charter": "my 60th on July 14",
  "anything_else":              "…",

  // Per-member Life Aboard (Section 5) — see brief data model below
  "life_aboard_brief": {
    "crew_interaction": "balanced",
    "activities": ["swimming_snorkel", "sunset_cocktails"],
    "activities_other": "Quiet sunset moments",
    "extras_freeform": "Fresh-squeezed OJ in the morning"
  }
}
```

### `cabin_brief_sections` — the SHARED brief (one row per section per cabin)

Every cabin has up to 8 of these rows (arrival, guests, health, itinerary,
life_aboard *(legacy)*, dining, beverages, children). Multiple members
collaborate on each row — the form on `/cabin/brief/<section>` is a
shared document.

```
id                          uuid pk
cabin_id                    uuid → cabins(id)
section_key                 ENUM (arrival, guests, health, itinerary, life_aboard, dining, beverages, children, little_things)
data                        jsonb — validated against SECTION_SCHEMAS[section_key]
completed                   bool  — true when sectionCompleteness() ≥ 21 points
last_edited_at              timestamptz
last_edited_by_email        text
last_edited_by_member_id    uuid → cabin_members(id)
last_edited_concierge       bool  — true if George edited on the client's behalf
```

Unique constraint on `(cabin_id, section_key)` — there is only ever
ONE shared row per section per cabin.

### `cabin_brief_contributions` — legacy per-member contributions

Created during MUB-1 (Multi-user Brief phase 1) as a per-member rival to
`cabin_brief_sections`. After George rejected the "per-member voting" UI
(MUB pass 4 → SHARED BRIEF MODEL), this table stopped receiving new
writes. It is preserved in the DB for archeology — the principal can
still see what Bill / Vasilis / etc. had typed under the old model when
debugging. **Do not write to this table from new code.**

### `cabin_brief_wishlist_items` — additive "specific items" list

Members can add explicit one-off items (e.g. "Krug Grande Cuvée 1L",
"Vegan moussaka") under a specific brief section without touching the
shared form. Each row is an independent line.

```
id                  uuid pk
cabin_id            uuid
section_key         text (dining | beverages)
label               text
quantity            text — "1 bottle", "for the kids", free text
notes               text
added_by_member_id  uuid
added_at            timestamptz
```

Surfaced on `/cabin/brief/<section>` via `WishlistPanel` and on the
review page grouped by section.

### `cabin_guests_manifest` — the harbour-paperwork list

Independent of `cabin_members`. The principal can pre-populate this list
in their head ("we'll be 7: me, husband, our two kids, my sister, her
husband, their daughter") even before they've invited anyone. The
manifest carries enough for the harbour authorities (DOB, passport,
nationality) and an `is_minor` flag that drives whether the
`/cabin/brief/children` section appears.

### `cabin_chat_messages` — legacy internal chat

The Cabin used to carry a chat panel between client and George. George
rejected that flow (PASS 4 friend test) — clients prefer WhatsApp. The
table stays for the CRM operator surface (`gy-command` still shows
historical messages), and `/cabin/chat` now just renders a WhatsApp
deep-link card.

### `cabin_audit_log` — every meaningful action

Every brief save, brief submit, consent change, concierge mode flip,
member invite, etc. writes a row via `writeAudit()` (in
`lib/cabin/audit.js`). The CRM can reconstruct exactly what happened
when. Cheap, defensive, write-only.

### `cabin_data_consents` — GDPR consent audit

Separate from `cabin_members.consents` (which is "current state"). This
table is "every time consent was given/withdrawn, by who, for which
data point, under which legal basis". Append-only.

### `cabin_memory_anchors` — post-voyage scheduled emails

Time-Capsule + birthday + anniversary + "six months later, here's a
photo from your week" emails. Cron in `gy-command` drains these.

### `cabin_mood_board` — inspiration photos

Photos the principal (or any member) uploads pre-charter to communicate
the vibe they want. Stored in Supabase Storage bucket `cabin-mood-board`,
metadata in this table. **Note:** mood board was REMOVED from the Cabin
UI in Christos pass batch 1 (per George's "βγάλε το, τρώει χρόνο"), but
the table + API endpoints stay live for back-compat. Keep an eye on
this if/when George decides to bring it back.

### `cabin_time_capsules`, `cabin_voyage_photos`, `cabin_listing`

- `cabin_time_capsules`: "seal a message now, the recipient gets it on
  date X" — used during the voyage for sentimental moments.
- `cabin_voyage_photos`: photos uploaded by anyone aboard during the
  voyage. Bucket `cabin-voyage`. Surfaced on `/cabin/voyage-album`.
- `cabin_listing`: VIEW (not a table) — denormalised join of `cabins +
  cabin_members count` used by the CRM dashboard for fast list rendering.

---

## 6. Route map

Every URL under `/cabin/*` is listed below with its purpose, who is
allowed in, and any notable behaviour. Routes are Next.js App Router
pages unless marked otherwise.

### Public / unauthenticated

| Route                          | Purpose                                        |
|---                             |---                                             |
| `/cabin/login`                 | Magic-link request form. Always reachable.     |
| `/cabin/share/[token]`         | Read-only preview of a single cabin via a short-lived shareable token. Used when George wants to show a prospect what their cabin might look like.|

### Authenticated home + onboarding

| Route                          | Purpose                                        |
|---                             |---                                             |
| `/cabin`                       | The dashboard. Renders NextStep wizard banner, PreVoyageSteps two-step checklist, charter-at-a-glance, vessel brochure block, berth map, berth-nearby, install nudge, voyage album teaser, Filotimo circle, Greek word of the day. The most-loaded page.|
| `/cabin/welcome`               | First-login gate. Captures first name + last name + DOB + mobile. Hard-redirected from `/cabin` until those four fields are saved.|
| `/cabin/install`               | iOS / Android PWA add-to-home instructions.    |
| `/cabin/before-you-sail`       | Calm checklist of what to bring (linen, light shoes, anti-nausea, etc.).|

### Per-member personal details

| Route                          | Purpose                                        |
|---                             |---                                             |
| `/cabin/me`                    | "A few details about you" — crew-list essentials (DOB, gender, nationality, passport, mobile) + aboard-the-yacht fields (cabin pairing, celebration, anything else). One form, one explicit Save button. Race-condition guard on Back link. |
| `/cabin/me/private`            | Private health & dietary — allergies, dietary, swimming, mobility, GDPR consent. Separated from `/cabin/me` so the privacy boundary is visually obvious. |
| `/cabin/me/at-the-table`       | (Redirect) → `/cabin/brief/dining`. Kept for back-compat with the deprecated MUB-4 contribution route.|
| `/cabin/me/in-the-cellar`      | (Redirect) → `/cabin/brief/beverages`. Same back-compat story.|

### The Brief (8 sections + review)

| Route                          | Purpose                                        | Who can edit |
|---                             |---                                             |---           |
| `/cabin/brief`                 | Overview — section list, progress bar, brief-confirm CTA, opt-out toggle, opt-out badges, last-edited-by per section, principal's "Send to George" CTA. | Read: any member. Write: not applicable (this page itself is read-only). |
| `/cabin/brief/arrival`         | Section 1 — flights, transfers, where you're staying first night | Principal only |
| `/cabin/brief/guests`          | Section 2 — group composition, tone of the week, photos consent, pets | Principal only |
| `/cabin/brief/health`          | Section 3 — emergency contact ashore (slimmed down per Christos pass) | Principal only |
| `/cabin/brief/itinerary`       | Section 4 — pace, marina vs anchor, celebrations | Principal only |
| `/cabin/brief/life-aboard`     | Section 5 — **per-member**, not shared (each guest sees an empty form) | Every member fills their own |
| `/cabin/brief/dining`          | Section 6 — shared, additive-merge for guests | Anyone; meal times + service style locked to principal |
| `/cabin/brief/beverages`       | Section 7 — shared, additive-merge for guests, has a finishing "Continue to Review →" CTA at the bottom (principals) or "All done — back to the Cabin" (guests) | Anyone |
| `/cabin/brief/children`        | Section 8 — only renders when minors are aboard (per `cabin_guests_manifest`) | Shared |
| `/cabin/brief/review`          | Principal-only review screen. Section list with last-edited badges, per-member Life Aboard roll-up, group wishlist, APA disclaimer, "Send to George" double-confirm modal. After submit, brief locks. | Principal only |
| `/cabin/brief/group`           | (Redirect / legacy)                          |     |
| `/cabin/brief/little-things`   | (Retired — silently redirects to overview)   |     |

Each section page mounts:
1. **`<SectionProgress>`** at the very top — "STEP 06 OF 07 · At the Table" + dots
2. The page-specific kicker via **`<SectionTitle>`**
3. Section-specific intro paragraph via **`<IntroParagraph>`**
4. **`<AllergyAlert>`** on food-relevant sections (dining, children, review)
5. **`<SharedBriefIndicator>`** on shared sections (dining, beverages)
6. **`<GuestAdditiveBanner>`** on shared sections — only renders for guests; explains additive merge
7. The form body via **`<BriefFormShell>`** + a section-specific Fields component (`DiningFields`, `BeveragesFields`, etc.)
8. **`<WishlistPanel>`** on dining + beverages — shared specific-items list
9. The "Next step" handoff card + bottom nav (Back link · "Your answers save automatically" line · Next button) — all inside `BriefFormShell`

### Concierge + chat

| Route                          | Purpose                                        |
|---                             |---                                             |
| `/cabin/chat`                  | Single boutique card with George's avatar + "Open WhatsApp" deep link. Internal chat removed. |
| `/cabin/crew`                  | Captain / chef / hostess bios + photos. Pulled from `cabin.crew_display`. |
| `/cabin/guests`                | Principal-only: invite + manage cabin members. Send invites, delegate brief-admin, hide/show details, opt-out toggles. |

### Vessel + experience

| Route                          | Purpose                                        |
|---                             |---                                             |
| `/cabin/vessel`                | Deep brochure view (legacy — the brochure block is now inline on `/cabin` home). Kept for direct linking. |
| `/cabin/menu`                  | Read-only sample menu (curated in CRM, served via `/api/cabin/sample-menu`). |
| `/cabin/mood`, `/cabin/mood-board` | Mood board (UI suppressed; backend kept). |
| `/cabin/voyage-album`, `/cabin/album` | Post-voyage photo upload + carousel. Supabase Storage. |
| `/cabin/time-capsule`          | Seal a message for a future date.            |
| `/cabin/filotimo-circle`       | Loyalty tier (Filotimo). Currently 3 tiers (Friend / Circle / Legacy). |

---

## 7. API endpoints

All under `/api/cabin/*`. Node runtime. Middleware guards
authentication. Convention: GET = read, PUT = patch, POST = action.

### Auth

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/auth/request-link`             | POST   | Mint OTP + send email. |
| `/api/cabin/auth/verify`                   | GET    | Consume OTP, set session cookie, redirect. |
| `/api/cabin/auth/logout`                   | POST   | Clear session cookie + KV key. |

### Profile + personal details

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/profile`                       | GET/PUT| Welcome-form payload (name, DOB, mobile, optional extras). |
| `/api/cabin/me`                            | GET/PUT| Current member's `personal_details` (crew list + aboard + private). Server-side `cache: no-store` + member-scoped merge. |
| `/api/cabin/me/life-aboard`                | GET/PUT| Per-member Life Aboard answers (writes to `personal_details.life_aboard_brief`). Same shape as a brief section payload so `useBriefAutosave` can drive it. |
| `/api/cabin/me/private`                    | (page-only) | The page calls `/api/cabin/me` PUT with only the private fields. No separate endpoint. |
| `/api/cabin/me/opt-out-brief`              | POST   | Toggle "I'll leave orders & cellar to the group" on the current member. |
| `/api/cabin/me/confirm-brief`              | POST   | Stamps `brief_confirmed_at` on the current member. |
| `/api/cabin/me/contribution/[section]`     | GET/PUT| Legacy per-member contribution write path. Not used by new UI. |

### Brief

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/brief/[section]`               | GET    | Read the shared row. |
| `/api/cabin/brief/[section]`               | PUT    | Write the shared row. Validates via `SECTION_SCHEMAS[section]`. For principals: replace; for guests: `mergeForGuest()` additive merge with principal-only key strip. Refuses for principal-only sections (arrival, guests, health, itinerary). |
| `/api/cabin/brief/[section]/group-voices`  | GET    | (Legacy) per-member voices for a section. |
| `/api/cabin/brief/group-allergies`         | GET    | Aggregated allergies across all members (drives `<AllergyAlert source="aggregate">` on review). |
| `/api/cabin/brief/wishlist/[section]`      | GET/POST/DELETE | Add / remove "specific items" rows on dining and beverages. |
| `/api/cabin/brief/submit`                  | POST   | Principal (or delegated brief-admin) hits "Send to George". Validates ALL hard gates (crew-list complete for everyone, every member brief-confirmed, every section complete *including* synthesised life_aboard), stamps `cabins.brief_submitted_at`, fires Telegram + email to George + per-member confirmation emails to every cabin member. Returns 423 on subsequent calls (idempotent lock). |

### Guests + admin

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/guests`                        | GET/POST/PATCH/DELETE | Principal-only: list + invite + edit + soft-delete members. |
| `/api/cabin/guests/minor`                  | POST   | Add a minor child to the manifest (no email invite). |
| `/api/cabin/has-minors`                    | GET    | Boolean — drives the children brief section + `<SectionProgress>` total. |
| `/api/cabin/delegate-brief-admin`          | POST   | Principal flips a guest's `is_brief_admin` to true. |
| `/api/cabin/concierge/confirm`             | POST   | Client confirms "George set this up for me" — clears `concierge_mode_active`. |

### Operator side (called from CRM)

All under `/api/cabin/admin/*`. Bypass the cabin-cookie check (each
route validates an admin secret or short-lived preview token).

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/admin/start-preview`           | POST   | Mint a 15-min preview session (returns a magic URL the CRM opens in a new tab). |
| `/api/cabin/admin/enter-preview`           | GET    | Landing handler for the magic URL; sets the preview cookies. |
| `/api/cabin/admin/brief`                   | PUT    | Concierge edit of a brief section on the client's behalf (sets `last_edited_concierge=true`). |
| `/api/cabin/admin/reopen-brief`            | POST   | Unlock a submitted brief (`brief_submitted_at = null`). |
| `/api/cabin/admin/chat`                    | POST   | Internal-chat send from George (legacy). |
| `/api/cabin/admin/extract-brochure`        | POST   | Run OCR/extraction on an uploaded vessel brochure. |
| `/api/cabin/admin/extract-passport`        | POST   | OCR a passport image into manifest fields. |
| `/api/cabin/admin/extract-myba-preview`    | POST   | Pull data from a MYBA contract PDF. |
| `/api/cabin/admin/send-handoff`            | POST   | Email captain/chef the preference sheet. |
| `/api/cabin/admin/send-preference-share`   | POST   | Generate + email a shareable read-only token. |
| `/api/cabin/admin/schedule-anchors`        | POST   | Bulk-create memory anchors (birthdays, anniversaries) for the cabin. |
| `/api/cabin/admin/voyage-bundle`           | POST   | Zip a voyage album for archival. |
| `/api/cabin/admin/brochure-photos`         | PUT    | Reorder / set vessel hero photo. |

### Misc

| Endpoint                                   | Method | Purpose |
|---                                         |---     |---       |
| `/api/cabin/calendar.ics`                  | GET    | ICS feed of the charter dates (members can subscribe in their phone calendar). |
| `/api/cabin/sample-menu`                   | GET    | The chef's working menu shown on `/cabin/menu`. |
| `/api/cabin/mood-board`                    | GET/POST/PATCH/DELETE | Mood-board CRUD. UI suppressed; endpoints live. |
| `/api/cabin/mood-board/upload`             | POST   | Signed-upload start. |
| `/api/cabin/voyage-album`                  | GET    | List voyage photos. |
| `/api/cabin/voyage-album/sign-upload`      | POST   | Signed-upload URL. |
| `/api/cabin/voyage-album/finalize`         | POST   | Confirm upload + write row. |
| `/api/cabin/chat/messages`                 | GET/POST | (Legacy) internal chat. |
| `/api/cabin/time-capsule`                  | POST   | Seal a future-dated message. |

---

## 8. Brief data model

The brief is the heart of The Cabin. Eight sections, each with its own
Zod schema in `lib/cabin/schemas.js`. Storage:

```
cabin_brief_sections                    cabin_members.personal_details
─────────────────────                   ─────────────────────────────
arrival       (principal-only)            life_aboard_brief (per-member)
guests        (principal-only)            (everything else)
health        (principal-only)
itinerary     (principal-only)          cabin_brief_wishlist_items
life_aboard   (DEAD-WRITE, was shared)  ───────────────────────────
dining        (shared, additive)          dining wishlist rows
beverages     (shared, additive)          beverages wishlist rows
children      (shared; gated on minors)
```

**Life Aboard exception:** Section 5 used to write to
`cabin_brief_sections.data` like the rest. After Angeliki's pass it
became **per-member** — the form on `/cabin/brief/life-aboard` writes to
`cabin_members.personal_details.life_aboard_brief` via
`/api/cabin/me/life-aboard`. The shared row stays empty; completion is
synthesised by `lifeAboardHasContent()` across all members.

### Section-by-section validators (Zod)

`lib/cabin/schemas.js` exports `SECTION_SCHEMAS = { arrival: …,
guests: …, … }` plus a `sectionCompleteness(sectionKey, data)` heuristic
that scores 0–100 based on how many meaningful fields are filled. A
section flips to `completed=true` when score ≥ 21 (≈3 substantive
fields). Schemas tolerate the RHF payload quirks (empty strings,
false-from-unchecked, single-value-as-string from a checkbox group)
via `normalizeBriefPayload()` before validation.

### Shared brief — the additive merge

When a guest PUTs to `/api/cabin/brief/dining` (or beverages, or
children), the server doesn't just overwrite the row. Instead it calls
`mergeForGuest(existing, incoming, principalOnlyKeys)` (see
`lib/cabin/brief-merge.js`):

```
For each key in incoming:
  • Array values     → UNION with existing (de-duped by value)
  • Object values    → recurse, key-wise additive
  • Other primitives → keep existing if truthy; only accept new if
                       existing slot is empty/null/empty-string

Plus: a configured list of principal-only keys is STRIPPED entirely
      from a guest's payload before merge:
  dining   → breakfast_time, lunch_time, dinner_time,
             lunch_service, dinner_service
  beverages → (none yet)
  life_aboard → (per-member only; no shared write)
  children → (none yet)
```

Principal PUTs bypass the merger entirely — they get full replace
semantics, which is what they need on `/cabin/brief/review`.

The UI complements this server guard:

- `<GuestAdditiveBanner>` explains the model to guests at the top of the
  shared section.
- `<CheckboxGroup lockedValues={…}>` renders already-set values as
  disabled with a "group" tag.
- Text inputs / textareas / radios pre-populated by the group render
  disabled with a "group" tag.
- The principal sees nothing locked; full edit on review.

### Per-member Life Aboard (Section 5)

Why: Life Aboard collects subjective per-person answers ("how do YOU
want the crew around you", "what do YOU love"). Five answers averaged
across five members is meaningless to the chef. Eleanna's pass made
clear George wanted each member's voice separately.

Storage: `cabin_members.personal_details.life_aboard_brief` per member.
The shared `cabin_brief_sections.life_aboard` row is no longer written;
completion is synthesised. The principal sees the per-member roll-up on
`/cabin/brief/review` and George receives it as a Voices block in the
Send-to-George email plus a Telegram bullet line per member.

Format: `lib/cabin/life-aboard-format.js` exports
`formatLifeAboardHighlights(brief)` — one place defines what each
answer reads as in plain English, used by both the review UI and the
email builder so they always agree.

### The Send-to-George submit

`POST /api/cabin/brief/submit` runs three hard gates in order:

1. **Crew-list essentials** — every non-opted-out member has
   `personal_details_completed_at` set (i.e. DOB + gender + nationality +
   passport/ID + mobile all filled).
2. **Brief confirmation** — every non-opted-out member has pressed
   "Confirm my brief picks" (`brief_confirmed_at` set).
3. **Brief sections** — every visible section row has `completed=true`,
   with Life Aboard synthesised from per-member content.

If any gate fails, the route returns 409 with a `pending` list. If they
all pass:

1. Stamps `cabins.brief_submitted_at` + `brief_submitted_by_member_id`.
2. Writes an audit row (`AUDIT_ACTIONS.BRIEF_SUBMITTED`).
3. Pulls wishlist rows + per-member life_aboard, assembles
   `groupContributions` (voices block for email + Telegram).
4. Fires Telegram via `notifyGeorge()`.
5. Sends the broker email via `sendBriefSubmittedEmail()`.
6. Sends a personalised confirmation email to **every cabin member** via
   `sendBriefMemberConfirmation()` — explains the principal made the
   final call on shared choices; the per-member private answers reach
   the chef/captain/hostess as-written. Liability cover + transparency.

Subsequent submits are idempotent — return the existing
`submitted_at`. To unlock, an admin must call
`/api/cabin/admin/reopen-brief`.

---

## 9. Components

Every component under `app/components/cabin/`. Highlights:

### Shell + layout

| Component                        | Purpose |
|---                               |---       |
| `CabinShell.jsx`                 | The boutique header (logo, charter date, principal name chip), bottom nav (now hidden — `showBottomNav=false`), and the page mount cascade animation (`gy-cabin-rise`). Every authenticated cabin page is wrapped in this. |
| `CabinBodyClass.jsx`             | Sets the `body.cabin-mode` class via `useEffect` so global CSS can pick it up reliably even when the body element is server-rendered. |
| `CabinBrandMark.jsx`             | The miniature George Yachts wordmark + Filotimo subscript shown on every cabin page header. |
| `CabinIcon.jsx`                  | Inline SVG icon set used across cabin tiles + chips. |
| `IntroParagraph.jsx`             | One-line wrapper that gives every section's intro the same boutique editorial italic look. |

### Home + onboarding cards

| Component                        | Purpose |
|---                               |---       |
| `NextStep.jsx`                   | Wizard banner at the top of `/cabin` home. Decision tree picks the ONE immediate next action for this member (own crew list → brief sections → brief confirm → Send to George). Hides when the brief is submitted. |
| `PreVoyageSteps.jsx`             | Two-card "BEFORE YOU SAIL" block below `NextStep`. Card 01 (invite group / share my details), card 02 (the brief). Status lines update as state changes. |
| `CharterAtAGlance.jsx`           | The cream "EFFIE STAR · 27 Jun → 4 Jul · Patricia R. Stevens" block. |
| `VesselBrochureBlock.jsx`        | Folded-in brochure: hero + key features + photo gallery + specs + accommodation + amenities + tender & toys + spaces aboard. |
| `VesselHero.jsx`, `VesselTeaser.jsx` | (Sub-components used by `VesselBrochureBlock`.) |
| `BerthMap.jsx`                   | Leaflet map with custom gold pin. Three-tier tile provider failover (CartoDB → OSM France → standard OSM). Bulletproof safety net for tiles that load but never get the `.leaflet-tile-loaded` class (MutationObserver + sweeps + polling). |
| `BerthNearby.jsx`                | "Around your berth" museum-plate card — airports, hospitals, ATMs, pharmacy. Data pre-fetched in CRM via Overpass + OSRM (free); this just renders. |
| `InstallNudge.jsx`               | Calm prompt to add the cabin as a PWA on the user's home screen. |
| `VoyageCarousel.jsx`             | Post-voyage photo carousel for `/cabin/voyage-album`. |
| `GreekWordOfTheDay.jsx`          | Tiny editorial card with a Greek word + context. Pure delight. |
| `GroupReadiness.jsx`             | The "who's done what" panel on `/cabin/brief` showing crew-list + confirmation status per member. |
| `PhotoGallery.jsx`               | Lightbox-capable gallery used by voyage album + brochure. Lightbox rendered via `createPortal` to escape the page-mount transform trap. |
| `LoginForm.jsx`                  | The email-only form on `/cabin/login`. |
| `DateOfBirthPicker.jsx`          | Three-field DD / Month / YYYY picker (replaces the native HTML date input — Olga friend test: native picker forced 1991 by clicking month arrows back year-by-year).|
| `GhostCredit.jsx`                | Tiny footer credit linking back to the build agency. |
| `ForceDarkLabel.jsx`             | Belt-and-braces fix for cabin-tones contrast on form labels. |

### Brief widgets (`components/cabin/brief/`)

| Component                        | Purpose |
|---                               |---       |
| `BriefFormShell.jsx`             | Wraps every brief-section form. Owns RHF + autosave + bottom navigation (Back link · "Your answers save automatically" + green dot · Next button) + the "Next step" handoff card. Scrolls to top on mount. |
| `FormFields.jsx`                 | The full input toolkit: `TextField`, `OpenTextarea`, `RadioGroup`, `CheckboxGroup`, `CardChoice`, `Hairline`, `SectionTitle`, `LikeDislikeMatrix`, `FrequencyPicker`, `LabelQuantityRows`. Each input optionally accepts `lockedByGroup` / `lockedValue` / `lockedValues` props for the Phase-5 race guard. |
| `SectionProgress.jsx`            | "STEP 06 OF 07 · At the Table" strip with progress dots. Fetches `/api/cabin/has-minors` on mount and adjusts total to 7 or 8 dynamically. |
| `SaveStatus.jsx`                 | Discreet bottom-right pill (Saving… / Saved / Couldn't save / Admin preview). |
| `SharedBriefIndicator.jsx`       | Small "Last edited by X · Y ago" line under shared section titles. |
| `GuestAdditiveBanner.jsx`        | Banner that ONLY renders for guests on shared brief sections; explains the additive-merge model. |
| `PrincipalOnlyGate.jsx`          | Server component that wraps a section's children in a `<fieldset disabled>` + cream "Principal only" banner when the viewer isn't the principal (or brief-admin). Used by arrival / guests / health / itinerary layouts. |
| `AllergyAlert.jsx`               | Cross-section allergy card. Two modes: `source="self"` (this member's own personal_details — GDPR-safe on shared pages) and `source="aggregate"` (every member's allergies + dietary — used on the principal-only review page so the chef briefing is complete). |
| `SampleMenuPreview.jsx`          | Read-only preview of the chef's sample menu inside `/cabin/brief/dining` so the charterer doesn't fill a vacuum. |
| `BriefConfirmCta.jsx`            | The "Confirm my brief picks" button surfaced on `/cabin/brief` overview for each member. |
| `WishlistPanel.jsx`              | "Specific items requested" panel under dining + beverages. Add / remove rows scoped to (cabin × section). |
| `DiningFields.jsx`               | The full At-the-Table field tree. Receives `isPrincipal` + `initialData` so it can lock meal-times + service style to principal, and pass `lockedValues` to each `CheckboxGroup` for guests. |
| `BeveragesFields.jsx`            | The full In-the-Cellar field tree. Same `isPrincipal` + `initialData` pattern. |
| `GroupVoicesPanel.jsx`           | (Legacy — was used by the pre-shared-brief MUB model.) Still mounted on dining for back-compat but its underlying contributions table is no longer written. |

---

## 10. lib/cabin/* helpers

Server-only helpers — no React, no Next.js client APIs.

| File                       | Exports / purpose |
|---                         |---                 |
| `auth.js`                  | `findMembershipsForEmail`, `createMagicLinkOtp`, `consumeMagicLinkOtp`, `createSession`, `createPreviewSession`, `readSessionFromCookies`, `pickActiveCabinId`, `resolveMembership`, `setSessionCookie`, `clearSessionCookie`. Session + cookie lifecycle. |
| `supabase.js`              | `getCabinDb()` — service-role server client. `dbQuery(promise)` — uniform error throwing wrapper used everywhere. |
| `schemas.js`               | Every section's Zod schema, the `SECTION_SCHEMAS` map, `sectionCompleteness()`, enum constants. ~900 lines. |
| `brief-normalize.js`       | `normalizeBriefPayload(raw)` — strips RHF quirks (empty strings, single-string-from-checkbox, false-from-empty-bool) before schema validation. Without this 3/3 friend testers hit "Couldn't save" loops on day one. |
| `brief-merge.js`           | `mergeForGuest(existing, incoming, principalOnlyKeys)` + `SECTION_PRINCIPAL_ONLY_FIELDS` per section. The Phase-2 additive guard. |
| `life-aboard-format.js`    | `formatLifeAboardHighlights(brief)` + `lifeAboardHasContent(brief)`. Used by `/cabin/brief/review` AND by the submit email. |
| `format.js`                | `firstNameFromDisplayName`, `titleCaseName`, `prettyDate`, `crewRoles`, `joinNouns`, `theyAllOrBoth`. Pure text helpers. |
| `email.js`                 | `sendMagicLinkEmail`, `sendChatNotificationEmail`, `sendConciergeHandoffEmail`, `sendPreferenceShareEmail`, `sendBriefSubmittedEmail` (the big one), `sendBriefMemberConfirmation` (per-member after Send-to-George). Single `wrap()` HTML shell so every Cabin email looks the same. |
| `notify.js`                | `notifyGeorge({ icon, title, lines, link })` — sends a Telegram message AND a backup email to George. Both best-effort; never blocks the user-facing response. |
| `audit.js`                 | `writeAudit({ cabinId, actorEmail, actorRole, action, … })` + `AUDIT_ACTIONS` enum. |
| `contributions.js`         | Legacy MUB per-member contribution read/write. Not used by new UI. |
| `anchors.js`               | Memory anchor (post-voyage scheduled emails) helpers. |
| `share-tokens.js`          | Mint + verify short-lived `/cabin/share/[token]` URLs. |
| `storage.js`               | Supabase Storage signed-upload helpers for mood-board + voyage-album. |
| `vessel-photo-urls.js`     | Resolve vessel brochure photo URLs (handles both Sanity CDN and Supabase Storage paths). |
| `weather.js`               | Light-touch forecast helper for the cabin home (data sourced via gy-command). |
| `menu-format.js`           | Helpers for rendering the sample menu (`presentDish()` — handles either a plain string or `{ label, gloss, photo_url }`). |
| `prefill.js`               | `buildAtAGlance(cabin)` (powers `<CharterAtAGlance>`) + `recomputeCabinCompletion(cabinId)` (the % shown on `/cabin/brief`). |
| `chat.js`                  | Legacy internal-chat helpers (CRM operator surface only). |
| `filotimo.js`              | `getCircleMember(email)`, `TIERS`, `nextTierGoal()`. Loyalty programme math. |

---

## 11. Key user flows

### A. First login (new member)

```
1. George (or principal) invites email "elekarv@gmail.com" via CRM
   → creates cabin_members row, sends magic-link email
2. Elena opens email on iPhone, taps the link
3. /api/cabin/auth/verify → session cookie set → 302 /cabin/welcome
4. /cabin/welcome — mandatory fields (first name, last name, DOB, mobile)
   → PUT /api/cabin/profile → personal_details + display_name populated
   → notifyGeorge() fires automatically (welcome onboarding ping)
5. Redirect to /cabin
6. NextStep banner shows "Step 1 of 2 — share your crew-list line"
7. Elena follows the CTA → /cabin/me → fills crew-list essentials
8. From there she should be guided through /cabin/me/private (allergies)
   and the brief sections she's allowed to touch
```

### B. Principal builds + sends the brief

```
1. Principal lands on /cabin/brief — sees section list with status
2. Walks through arrival (1) → guests (2) → health (3) → itinerary (4)
   — all principal-only, locked for guests
3. Visits life-aboard (5) — fills HER OWN per-member answers
4. Visits dining (6) + beverages (7) — shared; her edits replace
5. Visits children (8) if minors aboard
6. Presses "Confirm my brief picks" on the overview (her own member row)
7. Waits for every other non-opted-out member to do the same
8. When all members are crew-list-complete AND brief-confirmed,
   the "Continue to Review →" CTA on /cabin/brief becomes active
9. /cabin/brief/review — section list, per-member Life Aboard roll-up,
   wishlist rows by section, APA disclaimer
10. Press "Send to George" → double-confirm modal → POST /api/cabin/brief/submit
11. Server validates gates, stamps brief_submitted_at, fires Telegram +
    broker email + per-member confirmation emails
12. /cabin/brief shows the "locked" banner for everyone
```

### C. Guest fills their part

```
1. Guest receives magic-link email from principal's invite
2. /cabin/welcome → /cabin (same as principal)
3. NextStep shows "Step 1 of 2 — share your crew-list line"
4. /cabin/me → crew-list essentials → /cabin/me/private → allergies
5. Optionally adds to dining + beverages (additive — can never un-tick
   someone else's pick; locked checkboxes show "group" tag)
6. Visits /cabin/brief/life-aboard → fills HER OWN per-member answers
7. Presses "Confirm my brief picks" → done
```

### D. Concierge mode (George edits on behalf)

```
1. Operator (George) opens cabin in CRM → "Preview as customer" →
   /api/cabin/admin/start-preview → magic URL with preview cookies
2. Cabin opens in new tab with both gy_cabin_session AND gy_cabin_preview
3. George can navigate, fill, see exactly what the principal sees
4. Any PUT to /api/cabin/* fails (middleware blocks because preview cookie)
5. George switches to /api/cabin/admin/brief PUT — write goes through but
   stamps last_edited_concierge=true and sets cabins.concierge_mode_active
6. When the principal next visits and edits anything themselves,
   concierge_mode_active automatically clears
```

### E. Post-voyage

```
1. Cabin status flips to "active" → "submitted" → after charter, manually "archived"
2. Voyage album becomes the primary surface
3. Memory anchors fire on schedule (birthday email, 6-month "remember this
   moment" email, anniversary nudge for next year's charter)
4. Time capsule sealed during the voyage is delivered to recipients on reveal_at
```

---

## 12. Recent evolution timeline

Pulled from the task log; one line per major pass.

```
2026-04-08  Supabase project created. Cabin v0 schema.
2026-04 … 05  First friend tests (Da$k, Eleanna r1, Alexandros) shape the
              initial UX: magic-link auth, single-page /cabin, mobile-first
              boutique aesthetic.

2026-05-16  Berth map + berth-nearby ship (Free-forever via OSM + Overpass)
2026-05-20  Christos / Helen / Tyler / Domingo friend-test passes 3–6 reshape:
              • intro paragraphs, italic boutique tone
              • DOB picker rewrite
              • mood-board demoted, music-taste removed
              • crew "captain" wording neutralised
2026-05-22  Crew-list essentials become MANDATORY; readiness % math fixed
              from "section completion" to "member participation"
2026-05-23  Multi-user Brief (MUB) passes 1–6: cabin_brief_contributions
              table, per-member contribution UI prototype, group voices panel
2026-05-23  SHARED BRIEF MODEL replaces MUB per-member UI after George
              clarifies "ένα κοινό χαρτί που το συμπληρώνουν". The
              contributions table stays for archeology; new writes go to
              cabin_brief_sections shared rows.
2026-05-24  Lock arrival + itinerary + health to principal. PrincipalOnlyGate
              component + server-side PRINCIPAL_ONLY_SECTIONS gate.
2026-05-24  Explicit brief confirmations — per-member Confirm CTA on
              /cabin/brief, count, Send-to-George gate.
2026-05-24  Christos pass (5 batches): mobile country code picker, free-text
              "other" after every food/drink subsection, service preferences
              principal-only, /cabin/me/private separate page, map fix
              (invalidateSize + ResizeObserver, later corrected to safety net).
2026-05-24  Angeliki pass (4 batches): WhatsApp name fix, Section Two
              principal-only, meal-times principal-only, beverages confirm
              CTA, /cabin/me cache no-store, navy/gold Next button,
              GuestAdditiveBanner, mergeForGuest, Life Aboard per-member,
              Send-to-George per-member confirmation emails.
2026-05-25  Phase 1 — Map bulletproof (MutationObserver safety net for
              tiles that load but never get the loaded class).
2026-05-25  Phase 2 — /cabin/me persistence end-to-end: cache no-store +
              Greek mobile CC parser (longest-prefix match) + visible error
              card + race-condition guard for save→navigate (deferred
              navigation via window.location.assign).
2026-05-25  Phase 3 — Life Aboard per-member readback: /cabin/brief/review
              per-member accordion, Send-to-George email Voices block,
              Telegram bullet lines, brief_completion_percent synthesis.
2026-05-25  Phase 4 — Systemic styled-jsx bug: <style jsx>{styles} with a
              const-stored template literal was silently emitting zero CSS.
              Fixed across 4 components (AllergyAlert, SharedBriefIndicator,
              GroupVoicesPanel, /cabin/install) via dangerouslySetInnerHTML.
2026-05-25  Phase 5 — Lock already-set values for guests on shared brief.
              CheckboxGroup lockedValues, TextField/OpenTextarea lockedByGroup,
              RadioGroup lockedValue, LikeDislikeMatrix per-key lock.
2026-05-25  Phase 6 — SectionProgress strip + "Next step" handoff card on
              every brief section page. Total adapts to has-minors (7 vs 8).
2026-05-25  Eleanna pass (investigation, this doc): duplicate "share crew-list"
              prompt on /cabin home (NextStep + PreVoyageSteps both surface it),
              + /cabin/me explicit-save dropout (typing without pressing Save
              and then navigating to /private lost the crew-list data).
              Architecture proposal: wizard /cabin/me with Step 1 (crew list) →
              Step 2 (private) → Step 3 (aboard), each Next force-saves.
```

---

## 13. Design constraints that have shaped every decision

### "Always free at runtime"

No service we depend on has a per-request or per-MB cost. The only
recurring monthly cost is Claude Max + Vercel Pro + Google Workspace,
all already-paid for the brokerage. Verified by every fix
(map = Leaflet + OSM, berth-nearby = Overpass + OSRM, sessions =
Upstash KV REST, email = Resend free tier, Telegram = bot API). The
Phase-1 map safety net works without ever calling a paid tile service;
the per-member submit broadcast uses Resend's free tier (we have far
fewer than the daily cap).

### "Boutique, not airline check-in"

Every form is editorial — italic intro, gold rule, cream cards, navy
typography. Every CTA is full-width navy/gold with a "you can do this
in two minutes" microcopy. No required-asterisks in the customer copy.
Validation errors say "couldn't save just now — keep typing to retry",
never "INVALID INPUT".

### "George is the broker, not the captain"

The Cabin never says "the captain" in customer copy where it could
imply the broker. The footer signature is George. The WhatsApp deep
link is to George. The "Open WhatsApp" card on /cabin/chat shows
George's photo + IYBA badge. The captain only appears in
context-appropriate places (Around your berth, crew bios, the
preference-sheet PDF the operator prints).

### "English-only for customer-facing copy"

Even Greek POI names from OSM are transliterated to English via
`englishName()` in `BerthNearby.jsx` (ELOT 743 + brand map for
"Eurobank" / "Alpha Bank" / etc.).

### "Mandatory but not pressured"

The crew-list essentials are MANDATORY for the brief to lock (port
authority paperwork) — but the UI never says "required". It says
"Five lines for the harbour authorities — the brief cannot be sent
to George until everyone in the group has finished this short block."
Long-form, calm, factual.

### "Honest UX"

- The "online" green dot on the chat card was replaced with an honest
  cadence label ("Usually replies in hours") because the dot was
  animating regardless of whether George was awake.
- The autosave reassurance ("Couldn't save — keep typing to retry")
  was rewritten from "retrying…" because the old copy lied (no retry
  loop existed).
- The Filotimo loyalty tiers are honest (3 tiers; no fake "exclusive
  invitation" framing).

### "Don't break anything else"

Three CSS layers, in strict load order:
1. `app/(cabin)/cabin-tones.css` — contrast + brand-tone rules
2. `app/(cabin)/cabin-luxury.css` — animations, hover, typography
3. Per-component scoped `<style>` blocks

Every cabin selector is scoped to `[data-cabin-mode]` so the marketing
site at `/` etc. is never affected.

The "transform containing block" trap: any non-`none` transform on a
parent breaks `position: fixed` for descendants (modals get trapped
inside their parent instead of the viewport). The page-mount cascade
animation MUST end at `transform: none` (not `translateY(0)`); modals
should render via `createPortal` to `document.body`.

### "Free + boutique = sometimes a slower path"

Several decisions trade speed for self-containment:
- Berth map uses raster OSM tiles instead of vector Mapbox/Google
  (free, slightly slower scroll).
- Mood-board image upload goes via Supabase Storage signed-upload
  (instead of Uploadcare / Cloudinary — both free tiers exist but add
  account dependencies).
- Sample-menu PDF extraction is a one-time CRM batch (instead of an
  always-on AI service).

---

## 14. Operator hooks (gy-command CRM)

The CRM at `command.georgeyachts.com` (sibling repo `gy-command`) is
George's day-to-day surface. It:

- Lists all cabins (uses `cabin_listing` view for fast render).
- Per-cabin detail page shows every brief section, every member,
  audit history, preference sheet preview, "Preview as customer"
  button, "Reopen brief" button, brief-admin delegation flips.
- Generates the printable preference sheet PDF (still a CRM-side
  capability — the customer never sees it).
- Schedules the Send-to-Captain / Send-to-Chef hand-off emails.
- Manages the sample menu (which lands on `/cabin/menu`).
- Edits vessel brochure + photos + crew bios.
- Uploads the welcome video.

Cross-repo contract: the only shared surface is the Supabase Postgres
schema. Both repos read/write the same tables. Schema migrations live
in the main `george-yachts` repo (this one) and are applied via
Supabase MCP migrations. The CRM repo MUST NOT add columns
unilaterally — the contract is one-way.

---

## 15. Known unfinished work (as of 2026-05-25)

Surfaced during the Eleanna pass but not yet resolved:

1. **Duplicate "share your crew-list line" cards on `/cabin` home.**
   `NextStep` banner and `PreVoyageSteps` 01 card both render the same
   call. Eleanna's UX feedback: it confuses the client. Decision pending:
   keep one, hide the other when redundant, or merge into a single block.

2. **`/cabin/me` is a single long page; should be a wizard.** Eleanna
   confirmed: filling crew-list fields then clicking "Open my private
   notes →" (without first hitting Save) silently loses the crew-list
   typing. The race-condition guard added in Phase 2 protects the Back
   link only; in-page links to other routes are still unguarded.
   Architecture proposal: split into Step 1 (crew list) → Next →
   Step 2 (private) → Next → Step 3 (aboard) → Save & Finish. Each
   Next force-saves the current step.

3. **Recovery script for users who have already lost data.** Members
   with `personal_details_completed_at = null` AND
   `personal_details.allergies_dietary != null` (i.e. they filled
   private but never finished crew list) should be surfaced to George
   for outreach.

4. **brief_completion_percent does not include the per-member Life
   Aboard count for partial completion.** Phase-3 closeout made the
   binary "complete/incomplete" honest, but a section where only 2 of
   9 members have filled their per-member answer still shows 100%. For
   most cabins this is fine — but it would understate how much George
   should still wait before chasing.

5. **Mood board has no UI surface but still has live APIs.** If George
   decides to keep it permanently retired, the endpoints + table can be
   demoted to read-only or archived behind an admin flag.

---

## 16. Pre-friend-test checklist

Before sending the cabin to any new tester cohort:

1. Smoke-test all cabin routes via curl — all return 200 or 307, never 500.
2. Hard refresh `/cabin` on desktop AND iPhone Safari — confirm berth map
   tiles render, charter-at-a-glance reads as boutique not draft,
   send-to-George modal opens centred on viewport.
3. Confirm a real guest completion lands in `george@georgeyachts.com` inbox.
4. CRM cabin detail page → confirm "Around your berth" panel populated +
   Preference Sheet PDF still generates cleanly.

---

## 17. The codebase agreement (paraphrased from CLAUDE.md)

> The Cabin is the only surface where the boutique broker promise meets
> live software. Every change must (a) keep the visual + verbal language
> editorial, (b) keep the runtime free, (c) never break anything else
> outside `/cabin`, and (d) preserve the architectural separation between
> client surface and operator surface. When in doubt, ask George first
> and document the answer in this file.

— End of document —
