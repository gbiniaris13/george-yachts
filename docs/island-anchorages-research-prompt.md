# Island anchorage research prompt (for George to run with the chat "Research" button)

How to use: open a new chat, paste the prompt below, swap `{ISLAND}` for one
island at a time (or list several), press the **Research** button, and bring the
result back here. I will only publish what is sourced; anything unverifiable we
drop. We never guess nautical specifics.

We already have deep anchorage pages for: Mykonos, Santorini, Paros, Corfu, Hydra.
Targets still missing (from our /yacht-charter-{island} set): Naxos, Milos,
Folegandros, Ios, Sifnos, Antiparos, Lefkada, Kefalonia, Ithaca, Paxos,
Zakynthos, Spetses, Poros, Aegina, Skiathos, Skopelos, Rhodes, Symi, Kos,
Patmos, Crete (adjust to whichever we actually want).

---

## THE PROMPT (paste this, replace {ISLAND})

You are researching factual, verifiable information for a luxury crewed-yacht
charter brokerage. Strict rule: every claim must be backed by a real, citable
source on the public internet. If you cannot verify a specific detail, OMIT it
rather than estimate. Do not invent depths, holding, distances, or prices.

Research {ISLAND}, Greece, for a yacht charter audience and return, with a source
URL for each point:

1. Main anchorages / bays a crewed yacht would use around {ISLAND}: for each, the
   name, the approximate depth band if a cruising guide states it, the bottom
   type and holding if documented (sand, weed, rock), and which wind direction it
   is sheltered from. Use established cruising guides / charter / sailing sources.
   If depth/holding for a bay is not documented, give the bay name + shelter only.
2. Best time of year to visit and the prevailing summer wind situation (e.g.
   Meltemi exposure in the Cyclades), from a citable source.
3. What there is to see or do ashore (villages, sites, beaches, history), factual,
   with sources.
4. Why this island suits a yacht charter (or what to be aware of), grounded in the
   above, no marketing fabrication.
5. 2-3 nearby islands/anchorages it pairs well with on an itinerary.

Format: bullet points grouped under the 5 headings, each bullet ending with its
source URL. At the end, add a "NOT VERIFIED - do not publish" list of anything
you could not confirm. Prefer cruising guides, Greek tourism/municipal sources,
and established charter/sailing references over generic blogs.

---

## What I do with the result

I drop it back here. I map the verified points into our islandAnchoragesSeo.js
schema (same depth as the existing 5), keep the source list, publish only the
verified bullets, and skip the "NOT VERIFIED" list entirely. Each new island then
gets the full SeoLanding treatment (FAQPage + Breadcrumb + Speakable + sitemap).
