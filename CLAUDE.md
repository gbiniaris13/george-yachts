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
