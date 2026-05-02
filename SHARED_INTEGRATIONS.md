# Cross-repo integrations — george-yachts ↔ gy-command

> **Purpose:** Single source of truth for the boundary between the
> public site (this repo) and the CRM (gy-command). Every shared
> secret, every cross-repo HTTP call, every Vercel KV key the CRM
> reads through the proxy — listed here so future-Claude-when-coding
> doesn't have to reverse-engineer it from logs.
>
> **The two apps:**
>
> - **`george-yachts`** (this repo) → public site `georgeyachts.com`
>   on Vercel project `george-yachts`. Owns: marketing pages,
>   newsletter subscriber data (Vercel KV), inbound contact form,
>   newsletter sender, Resend webhook receiver.
> - **`gy-command`** (`/Users/.../Desktop/gy-command`) → CRM
>   `command.georgeyachts.com` on Vercel project `gy-command`. Owns:
>   inbox / cockpit / charters / pillars 4-5 / IG / brand radar /
>   command center. Reads newsletter subscriber data via the proxy.
>
> **Direction of dependency:** the CRM reads from the public site,
> not the other way around. The public site is intentionally the
> simpler app and never reaches into the CRM.

---

## 1. Shared secrets (the handshake)

| Env var name | Set on | Same value as | Purpose |
|---|---|---|---|
| `NEWSLETTER_PROXY_SECRET` | gy-command (Vercel) | `NEWSLETTER_UNSUB_SECRET` on george-yachts | The CRM proxies newsletter admin calls to the public site, signed with this. The browser never sees it. |
| `NEWSLETTER_UNSUB_SECRET` | george-yachts (Vercel) | mirrored as `NEWSLETTER_PROXY_SECRET` on gy-command | Validates inbound calls at the public-site admin endpoints (one-click unsubscribe + admin proxy paths) |
| `NEWSLETTER_PUBLIC_BASE_URL` | gy-command (Vercel, optional) | n/a | Override base URL of the public site (default `https://georgeyachts.com`). Used for staging. |
| `RESEND_WEBHOOK_SECRET` | george-yachts (Vercel) | matches the secret configured in Resend dashboard | Verifies Svix-signed webhooks at `/api/webhooks/resend` |
| `RESEND_API_KEY` | george-yachts (Vercel) | n/a | Sender-side; CRM never sees it |
| `RESEND_FROM_ADDRESS` | george-yachts (Vercel) | n/a | Must stay on the `send.` subdomain — the apex SPF record only authorises that subdomain. Don't change without updating DNS. |

**Rotation contract:** `NEWSLETTER_PROXY_SECRET` and
`NEWSLETTER_UNSUB_SECRET` must be rotated **as a pair**. Rotate one,
the proxy 401s instantly. The CRM-side rotation runbook is in
`gy-command/PLAYBOOKS.md` §12.

---

## 2. The newsletter proxy

The CRM cannot talk to Vercel KV directly — KV credentials live on
the `george-yachts` Vercel project and are not shared. Instead the
CRM calls public-site HTTPS endpoints, signed with the shared secret.

### CRM-side (gy-command)

- **Helper:** [gy-command:src/lib/newsletter-proxy.ts](../gy-command/src/lib/newsletter-proxy.ts)
- **Caller:** the operator UI at
  `gy-command:src/app/dashboard/newsletter/`
- **Pattern:** `${PUBLIC_BASE}${path}?key=${secret}` — the secret is
  passed as a query param so multipart/JSON bodies stay clean.

### Public-site endpoints called

All of these accept `?key=…` and reject with 401 on mismatch.

| Path (on `georgeyachts.com`) | What it does | Used from CRM page |
|---|---|---|
| `/api/admin/newsletter-status` | Returns `{ flag, subscriber_count, counts: { bridge, wake, compass, greece } }` | Status widget |
| `/api/admin/newsletter-add-subscribers` | Bulk add (POST or GET) | Manual add form |
| `/api/admin/newsletter-remove-subscriber` | Remove + optional suppress | Operator action |
| `/api/admin/newsletter-prepare-issue-1` | Build draft + Telegram approval card | Compose flow |
| `/api/admin/newsletter-compose` / `/-compose-options` | Draft composer | Compose flow |
| `/api/admin/newsletter-issue-stats` | Per-issue counters (sent / delivered / opens / clicks / bounces) | Issue analytics |
| `/api/admin/newsletter-engagement` | Per-subscriber engagement | Engagement view |
| `/api/admin/newsletter-queue` | Queue depth + flush state | Operator dashboard |
| `/api/admin/newsletter-reengage` | Re-engagement trigger | Re-engagement campaign |
| `/api/admin/newsletter-migrate` | One-shot legacy → 4-stream KV migrator | Setup only |
| `/api/admin/newsletter-season` | Force / inspect seasonal phase (Bridge cadence) | Diagnostic |
| `/api/admin/newsletter-issue-1-topup` | Top up drained Issue #1 audience | Recovery |

**Don't add new admin endpoints from gy-command** — they live on the
public site. Add the route there, then add a typed wrapper in
`newsletter-proxy.ts`.

---

## 3. Vercel KV — keys the CRM reads (via proxy)

KV lives on `george-yachts` Vercel project. The CRM never opens a
direct KV connection. The patterns below are documented so the CRM
team knows what's available to query through the proxy.

### Subscribers (Sets)

| Key | Type | Notes |
|---|---|---|
| `subscribers:bridge` | Set\<email\> | "The Bridge" stream subscribers |
| `subscribers:wake` | Set\<email\> | "The Wake" stream subscribers |
| `subscribers:compass` | Set\<email\> | "The Compass" stream subscribers |
| `subscribers:greece` | Set\<email\> | "Από την Ελλάδα" subscribers |
| `newsletter:subscribers` | Set\<email\> | **Legacy** total. Still read by the legacy weekly cron until cut-over (per public-site CLAUDE.md). |
| `suppression:emails` | Set\<email\> | Hard-bounced + complained — never re-add |

### Per-subscriber profile + engagement

| Key | Type | Notes |
|---|---|---|
| `profile:<email>` | Hash | Profile attributes (name, language, joined_at, source) |
| `engagement:<email>` | Hash | `last_send`, `last_open`, `last_click`, `sends_total`, `opens_total`, `clicks_total` — all driven by Resend webhook events |
| `reengagement:<email>` | Hash | Re-engagement campaign state (status, attempts, last_attempt_at) |

### Per-issue analytics (Phase 6)

| Key pattern | Type | Producer |
|---|---|---|
| `issue_stats:<stream>:<num>` | Hash (counters JSON) | `lib/newsletter/resend.js` increments `sent`; webhook increments `delivered/opened/clicked/bounced_hard/soft/complained` |
| `issue_opens:<stream>:<num>` | Set\<email\> | Webhook `email.opened` events — Set guarantees unique-recipient counting |
| `issue_clicks:<stream>:<num>` | Set\<email\> | Webhook `email.clicked` — same |
| `issue_pings:<draftId>` | Hash | Per-draft idempotency flags for the 1h + 24h post-send Telegram pings |
| `recent_sends` | Set\<draftId\> | Drives the post-send-pings cron (`/api/cron/newsletter-issue-pings`, hourly :05) |

### Quota / send pacing

| Key | Notes |
|---|---|
| `last_send_at:<stream>` | Updated by the daily flush cron when it finalises a draft. Auto-cron cadence gate uses this so multi-day drained sends count as "real sends". |
| `quota_alert:<YYYY-MM>:<pct>` | Once-per-month idempotency flag for the 80%/90%/95% Telegram quota warnings (Phase 6) |

### Auto-mode (Phase 4)

| Key | Notes |
|---|---|
| `featured_yachts:bridge` | Set of yacht ids surfaced in Bridge issues. Optimistically marked when the menu tap fires, NOT on final send — yachts get their rotation slot once George opens the picker, even if the draft is aborted. |
| Wake / Compass queue entries | Optimistically marked `used` on draft creation. If aborted, the entry is "lost" — re-add via the CRM Queues tab. |

---

## 4. Cron schedules — newsletter (informational)

**Don't trigger these from gy-command** — they fire on the public
site's Vercel project. Listed here so the CRM operator UI can show
"next scheduled send" hints without surprises.

| Time (UTC) | Endpoint | Purpose |
|---|---|---|
| `0 6 * * 4` | `/api/cron/newsletter-bridge-auto` | Bridge weekly Thursday — internal logic decides fire vs skip based on `getCurrentSeason()` (weekly Nov-Jun, biweekly Jul-Oct) |
| `0 6 15 * *` | `/api/cron/newsletter-wake-auto` | Wake monthly, 15th of every month |
| `0 6 1 2,4,6,8,10,12 *` | `/api/cron/newsletter-compass-auto` | Compass bimonthly, 1st of even months |
| Hourly :05 | `/api/cron/newsletter-issue-pings` | Post-send observability (1h bounce-guardian + 24h recap) |
| Hourly | `/api/cron/newsletter-flush-queue` | Drain the 95/day Resend free-tier-friendly queue |
| Daily 23:00 | `/api/cron/cleanup-expired-drafts` | Cleanup |
| Daily 08:00 | `/api/cron/newsletter-health` | Health check |
| Daily | `/api/cron/newsletter-daily-digest` | Daily digest |
| Daily | `/api/cron/newsletter-reengage-followup` | Re-engagement |
| Legacy | `/api/cron/weekly-newsletter` | Reads `newsletter:subscribers` until cut-over |

**Cadence canonical rules (from public-site CLAUDE.md):**

- Bridge: weekly Thursdays Nov-Jun, biweekly Jul-Oct.
- Wake: monthly on the 15th.
- Compass: 1 Feb / 1 Apr / 1 Jun / 1 Aug / 1 Oct / 1 Dec.
- Από την Ελλάδα: ad hoc (no cron).

If George says "I thought we send every 15 days" he's recalling the
original brief; Update 1 explicitly switched Bridge to weekly during
the decision phase. Don't revert — Issue #1's body promises the next
issue lands "next Thursday" and reverting breaks that promise to the
first 80 subscribers.

---

## 5. The Resend webhook (engagement + bounces)

Endpoint: `https://georgeyachts.com/api/webhooks/resend`. Owns:
- `email.delivered` → engagement.last_send + sends_total
- `email.opened` → engagement.last_open + opens_total
- `email.clicked` → engagement.last_click + clicks_total
- `email.bounced` → auto-suppression on hard bounce
- `email.complained` → auto-suppression on spam mark
- `email.delivery_delayed` → alerts only on the hard variant

**Setup runbook** (one-time, from public-site CLAUDE.md):

1. Generate a strong random string (≥32 chars). Set as
   `RESEND_WEBHOOK_SECRET` on george-yachts Vercel (Production +
   Preview + Development).
2. Resend dashboard → Webhooks → Add endpoint:
   - URL: `https://georgeyachts.com/api/webhooks/resend`
   - Secret: same string
   - Events: subscribe to all six listed above
3. Resend "Send test event" — should return `{ ok: true, result: … }`.

Until step 2 is wired, opens + clicks **don't track**. Re-engagement
candidate detection still works on the send-only baseline (it just
thinks everyone is a candidate after 90+ days, which is conservative).

---

## 6. The Telegram approval contract

The two apps share a Telegram convention but **deliberately do not
share a webhook**:

- **gy-command's bot** owns the `https://gy-command.vercel.app/api/webhooks/telegram-approval`
  webhook. Handles IG caption-approval `callback_query` taps and the
  `/status` text command (Tier 3a of Command Center).
- **The public-site newsletter** uses **URL inline buttons** (open
  preview / approve / cancel as plain links carrying a signed
  query param). They never `callback_query` — that would route into
  gy-command's webhook and conflict.

**Don't break this contract.** Adding a callback button to a
newsletter card means the CRM webhook would receive it and silently
drop it, leaving the newsletter operator confused.

---

## 7. Other shared boundaries (smaller)

| Boundary | Direction | Notes |
|---|---|---|
| `https://georgeyachts.com/sitemap.xml` | CRM reads | Sitemap intel widget at `gy-command:src/app/api/intel/sitemap/route.ts:6` |
| `https://georgeyachts.com` HEAD ping | CRM reads | Security widget at `gy-command:src/app/dashboard/SecurityWidget.tsx:17` |
| Google PageSpeed | CRM calls Google → measures `georgeyachts.com` | `gy-command:src/app/api/intel/pagespeed/route.ts:12` |
| Google OAuth redirect URI | Configured at Google → comes back to CRM | `https://command.georgeyachts.com/api/auth/gmail/callback` |
| Yacht detail deep-links | CRM links out | `https://georgeyachts.com/yachts/<slug>` from fleet client |
| Visitor analytics | Public site → KV → CRM reads through internal API | `/api/visitor-ping` writes, the dashboard reads via the public-site analytics endpoints |

---

## 8. When to update this doc

- A new shared env var is introduced
- A new admin endpoint is added on the public site (and consumed by gy-command)
- A new KV key pattern enters service
- A cron schedule or stream contract changes
- The webhook contract evolves (new event types, new headers)

The corresponding gy-command file is `ARCHITECTURE.md`. Keep them
mutually consistent — when you add a row here, link it from the
matching subsystem entry there.
