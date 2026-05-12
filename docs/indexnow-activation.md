# IndexNow Activation Guide

**Phase 7 Round 36 (2026-05-12). Technical brief: IndexNow.**

IndexNow is the free instant-reindex standard supported by Bing,
Yandex, Seznam, Naver, and used as a signal by Google. One POST
notifies all of them at once. Cuts indexing latency from days to
minutes.

## Status

- Endpoint `/api/indexnow` is fully wired.
- Public key file at `/public/00828e97c23b40259c163410fd1b83b1.txt`.
- Full-sitemap submission at `/api/indexnow/full-sitemap`.

## What George needs to do (one-time)

1. Confirm `INDEXNOW_AUTH_TOKEN` environment variable is set on
   Vercel (Production + Preview + Development). Generate any strong
   random string (≥32 chars) and set the same value in both:
   - Vercel project Environment Variables
   - Sanity webhook custom header (step 3)

2. Wire the Sanity webhook:
   - Sanity Studio → API → Webhooks → Create webhook
   - URL: `https://georgeyachts.com/api/indexnow`
   - Method: POST
   - Filter: `_type in ["post","yacht"]`
   - Custom header: `x-indexnow-token: <INDEXNOW_AUTH_TOKEN value>`
   - Trigger: "Create, Update, Delete"

3. After any large content drop, run the full-sitemap submission:
   ```
   curl -X POST https://georgeyachts.com/api/indexnow/full-sitemap \
     -H "x-indexnow-token: <INDEXNOW_AUTH_TOKEN value>"
   ```
   This pings IndexNow for every URL in the live sitemap (380+
   URLs as of May 2026).

## What happens after

- Every Sanity post or yacht publish/update fires the webhook.
- The webhook POSTs to /api/indexnow.
- IndexNow notifies Bing/Yandex/Seznam/Naver instantly.
- Google receives a signal (no formal IndexNow support but they
  pick up the propagated freshness signal indirectly).
- Typical indexing latency: 24 hours → minutes.

## After Phase 7 content drop (May 2026)

The May 2026 content drop added 60+ new URLs (bottom-funnel pages,
best-yachts pages, anchorages, glossary, comparisons, market
reports). After deploy, fire the full-sitemap submission once to
push them all to IndexNow in one call.

---

*Brief prepared: May 2026 | Version 1.0*
