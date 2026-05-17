# The Cabin · Filotimo — Phase 1–4 (complete)

**Status:** Ready for George to review. Local-only. **No git push yet, no Vercel deploys yet.**

13,288 lines across `georgeyachts.com` + ~3,000 lines in `gy-command`. All free tier, no paid services, no new subscriptions.

---

## What it does (every feature shipped this session)

### Client (`cabin.georgeyachts.com` / `/cabin/*`)

| Page | Purpose |
|---|---|
| `/cabin/login` | Magic-link request, no password |
| `/cabin` | Charter At-a-Glance home + 6 discovery cards |
| `/cabin/brief` | Brief overview (8 sections, progress) |
| `/cabin/brief/{arrival,guests,health,itinerary,life-aboard,dining,beverages,little-things,children}` | 9 autosaving zod-validated form pages |
| `/cabin/chat` | Private chat with George (charterer-only, polling every 5s, optimistic UI) |
| `/cabin/before-you-sail` | Welcome video + Open-Meteo weather + 10 Greek phrases + packing list |
| `/cabin/guests` | Invite/manage cabin members |
| `/cabin/mood-board` | Pinterest-style — upload photos or paste URLs |
| `/cabin/voyage-album` | Post-charter photo album with lightbox |
| `/cabin/time-capsule` | Seal a paragraph; returns 6 months later |
| `/cabin/crew`, `/cabin/menu`, `/cabin/vessel` | Read-only, white-labeled |
| `/cabin/filotimo-circle` | Loyalty tier card + 3-tier breakdown |
| `/cabin/your-data` | Transparency Dashboard with delete/withdraw |

### Admin (`gy-command/dashboard/cabins/*`)

| Page | Purpose |
|---|---|
| `/dashboard/cabins` | List all cabins, status badges, completion % |
| `/dashboard/cabins/new` | Create from MYBA JSON paste |
| `/dashboard/cabins/[id]` | Cabin detail + actions + lifecycle stepper |
| `/dashboard/cabins/[id]/edit` | Concierge brief editor (9 sections, JSON-textarea) |
| `/dashboard/cabins/[id]/content` | Crew / menu / inspiration JSON editor |
| `/dashboard/cabins/[id]/chat` | Admin chat thread |
| `/dashboard/cabins/[id]/audit` | Full audit log with colored badges |
| `/dashboard/cabins/[id]/print` | HTML print → ⌘P → PDF |

### Automated background

- **Memory Anchors** — Vercel cron daily at 06:00 UTC: pulls due rows from `cabin_memory_anchors`, sends emails via Resend, caps 100/run
- **Auto-schedule on completion** — when admin marks cabin `status='completed'`, fires `scheduleAnchorSequence` (8 emails over 12 months)
- **Filotimo Circle auto-enrollment** — DB trigger; person joins on first cabin_members insert
- **Concierge auto-clear** — when client edits any brief section, the concierge banner auto-deactivates
- **Chat notifications** — admin→charterer email (throttled to 1/30min), charterer→admin Telegram

---

## Required env vars

```
# georgeyachts.com (.env.local + Vercel project env)
SUPABASE_URL=https://lquxemsonehfltdzdbhq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...                              # already configured
CABIN_FROM_ADDRESS="George Yachts <cabin@georgeyachts.com>"  # falls back to apex
CABIN_REPLY_TO=george@georgeyachts.com
CABIN_ADMIN_SECRET=...                          # random 32+ chars
CABIN_PUBLIC_URL=https://georgeyachts.com
CRON_SECRET=...                                 # already configured
TELEGRAM_BOT_TOKEN=...                          # optional, for chat nudges
TELEGRAM_CHAT_ID=...                            # optional
GY_COMMAND_URL=https://command.georgeyachts.com

# gy-command (.env.local + Vercel project env)
CABIN_PUBLIC_URL=https://georgeyachts.com
CABIN_ADMIN_SECRET=...                          # MUST match public site
```

KV (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) is already set on georgeyachts.com — used by both newsletter AND cabin sessions.

---

## Apply migrations once (in order)

```bash
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-foundation.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-foundation-patch.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-storage.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-chat.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-voyage-album.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-welcome-video.sql
psql "$SUPABASE_DB_URL" -f lib/migrations/2026-05-16-the-cabin-seed.sql      # LOCAL ONLY
```

The `-foundation-patch.sql` step is idempotent. It exists because
`create table if not exists` does not modify columns on a DB that
already had the original foundation applied; the patch forces the
FK cascade → set-null swap and adds three FK indices. Always run it
once per DB after a foundation run.

---

## Local test (the dev-loop George should run before pushing)

```bash
cd ~/Projects/george-yachts
npm run dev
# Visit http://localhost:3000/cabin/login
# Enter george@georgeyachts.com → click link in inbox
# Walk through every nav item

# In a second shell:
cd ~/Projects/gy-command
npm run dev
# Visit http://localhost:3001/dashboard/cabins (or whatever port)
# Walk through create → edit → concierge → chat → audit
```

---

## Vercel hygiene (before deploy)

1. **Disable preview deployments for non-main branches** in Vercel project settings (saves credits)
2. Push to `feature/the-cabin` branch — no auto-deploy
3. Apply Supabase migrations to production database
4. Set all env vars in Vercel
5. Merge to `main` for the single production deploy
6. Verify cron at `/api/cron/cabin-memory-anchors` is registered in Vercel dashboard
