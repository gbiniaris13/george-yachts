# The Cabin — Friend-test brief

**Last updated:** 2026-05-23 — pre-launch round.
**Purpose:** Short, copy-paste-ready messages George can send his friends
when asking them to try The Cabin before it goes live to real charterers.

---

## The 60-second WhatsApp / iMessage version (warm tone)

> Hi [name] — I'm putting the final coat of polish on a small private
> tool I've built for George Yachts charterers. It's called The Cabin
> and it's where everything happens between booking a yacht and stepping
> on board.
>
> I'd love your eye on it for ten minutes before any real client sees it.
> You'll get an email from me in a moment with a single magic link — no
> password, no app to download.
>
> Three things I'd love to hear from you:
>
> 1. Was anything confusing or did you have to think too hard?
> 2. Did anything look or feel cheap / not luxury-grade?
> 3. Any typos, broken buttons, slow moments, weird wrapping?
>
> Open on your phone too if you can — most real clients will.
> Honest reactions, no editing. Thank you for the gift of your time.
>
> — George

---

## The 30-second email subject + body

**Subject:** A small favour — ten minutes inside The Cabin

> Hi [name],
>
> I've been building a private space for George Yachts charterers called
> The Cabin. It's where they sign the brief, meet the crew, see the
> menu, and find their yacht on the day. I'm one step away from sending
> it to real clients and I'd love your eye first.
>
> Your magic link is below. No password, no app — just tap and you're in.
>
>     [LINK]
>
> Spend ten minutes wandering. The cabin home, the brief, the menu, the
> berth map. Try it on your phone too. Tell me anything that didn't feel
> right — confusing copy, slow buttons, wrong wrapping on a phone, a
> moment you thought "this doesn't look like a luxury brand". Even one
> sentence helps.
>
> Warmly,
> George
> +30 6970 380 999

---

## What you (George) actually want them to do (don't share this part)

The most valuable signals come from people who:

1. **Open on iPhone Safari** (where most real customers will arrive)
2. **Don't get told what to test** — wander naturally
3. **Try to complete the brief** end-to-end as if they were Patricia
4. **Notice when something feels off** even if they can't articulate it

If they're willing to be more involved, ask them to specifically try:

- Open `/cabin` → does the welcome typography make them feel "ah, this
  is for me"?
- Open the **vessel block** → click a photo → does the lightbox carousel
  feel like Apple/Hermès, or like a budget WordPress plugin?
- Open the **berth map** → does the gold pin feel placed-with-care?
  Does the "View on Google Maps" button work?
- Look at **"Around your berth"** → are the distances readable (both
  metric + miles)? Do the Greek POI names show as English?
- Go to **/cabin/brief** → can they make it through Section 01 without
  hitting a confusing field?
- Pull up the **/cabin/menu** → do dish names look like a printed menu
  or like a database export?
- Try **"Send to George"** at the end of the brief → does the
  confirmation modal pop up clean, or jumpy?

---

## What you (George) should specifically NOT ask

- Don't ask them about features they can't see (back-office stuff)
- Don't apologise in advance for anything — they'll find what they find
- Don't lead with "this is multimillion luxury" — let them tell YOU that
- Don't fix bugs they report in the same conversation — write them down,
  fix later, and circle back when polished

---

## Quick reference: what's known-good as of 2026-05-23

✓ **Free forever stack** — no API keys, no billing, no quotas. Leaflet +
OpenStreetMap for berth map. Overpass + OSRM for "around your berth"
data. Resend for emails (already paid for via newsletter infra).
✓ **English-only on the customer side** — Greek POI names auto-transliterated.
✓ **Imperial + metric on every distance** — m+ft / km+mi side by side.
✓ **George (broker) referenced, never captain** in customer copy.
✓ **Mobile-tuned** — 44px tap targets, no backdrop-filter on Android,
Ken Burns off on phones, modals full-screen.
✓ **All 19 cabin routes return 307 or 200** (no 500 crashes).
✓ **Berth map tiles render** (fixed today after a Leaflet-trap bug).
✓ **Send-to-George modal portal-fixed** (was inline, would have jumped
28px in front of friends — caught just in time).
✓ **Welcome email lands in george@georgeyachts.com** when a guest
completes /cabin/welcome.
✓ **Photo lightbox** is a real carousel with always-visible X + arrows.
✓ **Charter-at-a-Glance** redesigned to museum-plate brochure feel.

## When the friend-test round wraps

Common findings to expect (sort by frequency):

1. Copy nits — single-word changes are common, just batch them
2. Mobile-specific spacing complaints — usually one or two tight rows
3. Speed of the welcome flow — too many fields vs. too few
4. The brief feels long — that's by design (it captures preferences
   for a 7-day charter) but you may want to add a "save & continue
   later" cue more prominently
5. Confusion about who can see what (principal vs. guest) — already
   handled but the copy might need a touch

Don't be precious. If they all flag the same thing, ship the fix.
