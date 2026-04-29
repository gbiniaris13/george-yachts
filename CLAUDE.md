# Working in georgeyachts.com (the public site)

## House rules — non-negotiable

- **George's full name is "George P. Biniaris".** Never write
  "George Biniaris" without the middle initial when used as a formal
  signature, byline, or attribution. The warm in-letter sign-off
  "— George" stays as is for The Bridge / personal contexts. Update
  any blog/article schema, structured data, or template byline that
  drops the middle initial.
- **Public site = this repo (george-yachts).** CRM lives at
  `/Users/.../gy-command` (`command.georgeyachts.com`).
- **Newsletter source-of-truth.** The Roberto Newsletter Brief
  (29 Apr 2026) is canonical. The four streams are The Bridge,
  The Wake, The Compass, Από την Ελλάδα. Subscriber data is in
  Vercel KV (`subscribers:bridge` / `:wake` / `:compass` / `:greece`
  + `profile:<email>` hashes + `suppression:emails`). The §6 routing
  matrix and §13 hard rules are encoded in
  `lib/newsletter/router.js` and `lib/newsletter/validator.js` —
  never bypass either at send time.
- **The CRM is the operator surface.** Admin actions on subscribers
  live in `command.georgeyachts.com/dashboard/newsletter`. Public
  site only exposes `/newsletter` (signup) and the orphan
  `/admin/newsletter-add` page (kept noindex'd as a fallback).
  Don't link the orphan from anywhere.
- **Approval gate is non-negotiable.** Every newsletter send goes
  through Telegram URL inline buttons. URL buttons (not callback
  buttons) so we stay out of the existing CRM bot webhook's path.

## Cadence — canonical (Update 1 §4 wins over original Brief §5)

**The Bridge — seasonal.** The cron runs every Thursday 06:00 UTC;
the LOGIC inside picks fire vs skip based on `getCurrentSeason()`:

| Period (Athens TZ) | Phase | Cadence |
|---|---|---|
| 1 Nov – 30 Jun | consideration → decision | **Weekly** (every Thursday) |
| 1 Jul – 31 Aug | high season / in-charter | **Bi-weekly** (alternate Thursdays) |
| 1 Sep – 31 Oct | shoulder | **Bi-weekly** |

This is the most-confused rule. If George says "but we send every 15
days right?" — he's recalling the original Brief §5 which had Bridge
biweekly year-round. Update 1 explicitly switched it to weekly during
decision phase to capture buyer-shortlist-building (Nov–Feb) and the
heat of closing (Mar–Jun). Issue #1's body literally says *"Issue #2
lands next Thursday"* — reverting to biweekly would break that
written promise to the first 80 subscribers.

**The Wake — monthly, 15th of every month** at 06:00 UTC. Editorial
mode varies per season per Update 1 §4.2 (education / booking_signals
/ last_minute / preview_2027) but the schedule is fixed.

**The Compass — bimonthly**, 1st of every even calendar month at
06:00 UTC: 1 Feb / 1 Apr / 1 Jun / 1 Aug / 1 Oct / 1 Dec.

**Από την Ελλάδα — ad hoc**, manual only. No cron.

Don't drift from these without surfacing the change in a NEW Update
file (Update N+1). Each cadence change has revenue + trust
implications and the boardroom signed off on what's encoded above.

## Auto-mode safety rails (Phase 4)

- Bridge auto-cron defers (no menu sent) when a previous Bridge issue
  is still being drained by the daily flush queue. This prevents
  Issue #N+1 nudges going out while Issue #N is still reaching late
  recipients via the 95/day Resend free-tier cap.
- Flush cron sets `last_send_at:<stream>` when it finalises a draft
  so the auto-cron cadence gate sees multi-day drained sends as real
  sends, not "never sent".
- Toggles: `AUTO_MODE_ENABLED`, `AUTO_BRIDGE_ENABLED`,
  `AUTO_WAKE_ENABLED`, `AUTO_COMPASS_ENABLED` — all default true.
  Env-only — no Telegram flip — by design.
- Yacht highlight: optimistic mark in `featured_yachts:bridge` Set on
  menu tap, NOT on final send. A yacht has its turn in rotation once
  surfaced even if George aborts the draft.
- Wake/Compass queue entries: also optimistic mark as `used` on
  draft creation. If the draft is aborted the entry is "lost" — re-add
  via CRM Queues tab.

## Resend webhook setup runbook (Phase 5)

The endpoint at `/api/webhooks/resend` is built and verifies Svix
signatures, but it only does anything when Resend is actually
configured to POST to it. One-time setup steps:

1. Generate a strong random string for `RESEND_WEBHOOK_SECRET` (any
   ≥32 chars). Set it in Vercel env vars on `george-yachts` (apply
   to Production, Preview, Development).
2. Resend dashboard → Webhooks → Add endpoint:
     URL:    https://georgeyachts.com/api/webhooks/resend
     Secret: paste the same string from step 1
     Events: subscribe to all of:
       email.delivered    (drives engagement.last_send + sends_total)
       email.opened       (engagement.last_open + opens_total)
       email.clicked      (engagement.last_click + clicks_total)
       email.bounced      (auto-suppression on hard bounce)
       email.complained   (auto-suppression on spam mark)
       email.delivery_delayed   (alerts only on hard variant)
3. Test the endpoint with Resend's "Send test event" button. Any
   payload that verifies should return `{ ok: true, result: …}`.

Without this setup the engagement tracker falls back to `markEvent`
calls inside `lib/newsletter/resend.js` — every successful 2xx Resend
response records a "send" event. Opens + clicks won't track until
the webhook is wired. Re-engagement candidate detection still works
on the send-only baseline (it just thinks everyone is a candidate
after 90+ days, which is conservative).

## Phase 6 — Analytics + alerts (post-send observability)

Per-issue counters: `issue_stats:<stream>:<num>` (JSON aggregate) +
`issue_opens:<stream>:<num>` + `issue_clicks:<stream>:<num>` (Sets
for unique-recipient counts). Updated by:
  - `lib/newsletter/resend.js` sendNewsletterEmail → bumps `sent`
    on every successful 2xx (works without webhook).
  - `app/api/webhooks/resend` → bumps `delivered` / `opened` /
    `clicked` / `bounced_hard|soft` / `complained` per Resend events
    (needs webhook wired — see runbook above).

The Resend tags `[{name: "stream"}, {name: "issue"}]` are set on every
outgoing email and echoed back in webhook events. That's how counters
route to the right issue.

**Quota alerts.** `lib/newsletter/quota-alerts.js` fires Telegram on
the FIRST send each month that crosses 80% / 90% / 95% of
MONTHLY_HARD_CAP. Once-per-month flags
`quota_alert:<YYYY-MM>:<pct>` make this idempotent.

**Bounce-rate guardian.** Folded into the 1h post-send ping
(`/api/cron/newsletter-issue-pings`). If the bounce rate of an issue
is > 3% one hour after send, the ping turns into a 🚨 alert. The
issue-pings cron runs hourly at :05, walks the `recent_sends` Set,
fires a 1h ping (0.5–6h after sent_at) and a 24h ping (23–28h after
sent_at). Per-draft idempotency via `issue_pings:<draftId>` flags.

**Admin endpoint.** `GET /api/admin/newsletter-issue-stats?stream=
bridge[&issue=N|&limit=10]` — single-issue lookup or recent-N list.
Returns counters, unique opens/clicks, computed open_rate /
click_rate / bounce_rate / complaint_rate. Read-only.

**Daily digest enhancement.** The Resend usage line now carries a
traffic-light icon (`✅` < 80%, `📊` 80–89%, `⚠️` 90–94%, `🚨` ≥ 95%)
mirroring the alert thresholds.

## Repo layout for newsletter

```
lib/newsletter/
  router.js         §6 audience matrix (pure function)
  validator.js      §13 hard-rules content gate (pure function)
  email-template.js 580px responsive HTML + plain-text builder
  telegram.js       URL-button approval cards + sendPhoto helper
  resend.js         REST client wrapper + suppression-list aware
  issue-1.js        founder note body + hero URL + word count

app/api/newsletter/
  route.js          public signup endpoint (legacy + 4-stream)
  unsubscribe/      RFC 8058 one-click unsubscribe
  preview/          URL-button target — renders draft HTML
  approve/          URL-button target — runs the send loop
  cancel/           URL-button target — marks draft aborted

app/api/admin/
  newsletter-status                  read-only diagnostic
  newsletter-migrate                 one-shot KV migrator (legacy → 4 streams)
  newsletter-add-subscribers         bulk add (POST or GET)
  newsletter-remove-subscriber       remove + optional suppress
  newsletter-prepare-issue-1         build draft + Telegram approval card

app/api/cron/
  cleanup-expired-drafts            daily 23:00 UTC
  newsletter-health                 daily 08:00 UTC

app/api/webhooks/
  resend                            bounce + complaint handler (Svix sig)

app/newsletter/                     public 4-stream signup landing
app/admin/newsletter-add/           orphan public admin (deprecated; use CRM)
```

## Don't

- Don't drop or rename `subscribers:*` KV keys without coordinating
  — `/api/cron/weekly-newsletter` (the legacy cron) still reads
  `newsletter:subscribers` until cut-over.
- Don't change `RESEND_FROM_ADDRESS` away from the `send.` subdomain
  without also updating the apex SPF record (Vercel-managed DNS).
- Don't post to The Compass any content type that the §6 matrix
  marks `never` — broker peers receiving offer/announcement copy
  is a commission-protection violation.
