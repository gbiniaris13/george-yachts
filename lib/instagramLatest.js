// lib/instagramLatest.js
//
// What the house's Instagram showed most recently, for the top of
// /instagram.
//
// 2026-11-20 (George). A story published by the system cannot carry a
// tappable link: Meta's publishing API refuses link stickers. So the one
// link a viewer can tap is the link in the profile, and George's ask was
// that it should lead to the yacht the story was about. This reads what
// went out (the CRM's ig_posts table and its story log), newest first, and
// resolves each yacht against this site's own Sanity, so the page can show
// "Seen on Instagram" with a link to each yacht's page or guide.
//
// Server only: it uses the CRM service key (GYC_SUPABASE_*, the same pair
// app/api/track uses for sessions). Everything is best effort. If the CRM
// or Sanity does not answer in time the list is empty and the page shows
// its form as before; it must never fail the page.

import { sanityClient } from "./sanity";

const CRM_URL = process.env.GYC_SUPABASE_URL;
const CRM_KEY = process.env.GYC_SUPABASE_SERVICE_ROLE_KEY;
const REVALIDATE_SECONDS = 600;

// The written guides the CRM publishes (gy-command src/lib/guide-decks.ts)
// and the page on this site that says the same at length.
const GUIDE_PAGES = {
  "cost-week": { title: "What a crewed week in Greece really costs", href: "/cost-calculator" },
  apa: { title: "The APA, explained once", href: "/advance-provisioning-allowance-apa-greek-yacht-charter-explained" },
  "five-steps": { title: "How booking a crewed charter works", href: "/how-it-works" },
  "when-to-book": { title: "When to book a Greek charter week", href: "/how-it-works" },
  regions: { title: "Cyclades, Saronic or Ionian?", href: "/cyclades-vs-ionian-yacht-charter" },
  months: { title: "The best month for a yacht week in Greece", href: "/best-time-charter-yacht-greece-month-by-month-2026" },
  contract: { title: "What a MYBA contract protects you from", href: "/how-it-works" },
  "broker-checks": { title: "Four checks before you trust a charter broker", href: "/about-us" },
  "weeks-not-days": { title: "Why weeks, not days", href: "/how-it-works" },
  "who-answers": { title: "Who answers when you message George Yachts", href: "/about-us" },
  "no-owned-yachts": { title: "A broker who does not own the yachts", href: "/about-us" },
};

async function crm(path) {
  if (!CRM_URL || !CRM_KEY) return [];
  try {
    const res = await fetch(`${CRM_URL}/rest/v1/${path}`, {
      headers: { apikey: CRM_KEY, Authorization: `Bearer ${CRM_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** "…utm_campaign=boat_lady-natasa&…" -> "lady-natasa" */
function slugFromUtm(utmUrl) {
  const m = String(utmUrl || "").match(/utm_campaign=boat_([a-z0-9-]+)/i);
  return m ? m[1].toLowerCase() : null;
}

/**
 * What went out, newest first, as references not yet resolved:
 *   { kind: "yacht", at, slug?, id?, name? }  |  { kind: "guide", at, deck }
 * Pure: the tests feed it rows.
 */
export function collectRefs({ posts = [], storyLog = [], now = new Date() }) {
  const refs = [];
  for (const p of posts) {
    const m = p?.metadata || {};
    const at = p?.published_at;
    if (!at) continue;
    if (m.kind === "fleet" || m.kind === "reel_walkthrough") {
      refs.push({ kind: "yacht", at, slug: slugFromUtm(m.utm_url), id: m.sanity_yacht_id || null, name: m.yacht_name || null });
    } else if (m.kind === "guide") {
      if (m.deck_kind === "shortlist" && Array.isArray(m.yachts)) {
        for (const name of m.yachts) refs.push({ kind: "yacht", at, name });
      } else if (GUIDE_PAGES[m.deck]) {
        refs.push({ kind: "guide", at, deck: m.deck });
      }
    }
  }
  // Stories last a day; the yacht a story showed stays worth listing for three.
  const storyCutoff = now.getTime() - 3 * 86_400_000;
  for (const s of storyLog) {
    if (!s?.yacht_slug || !s?.at) continue;
    if (new Date(s.at).getTime() < storyCutoff) continue;
    refs.push({ kind: "yacht", at: s.at, slug: String(s.yacht_slug).toLowerCase() });
  }
  return refs.sort((a, b) => String(b.at).localeCompare(String(a.at)));
}

/** Refs + the yachts Sanity knows -> the list the page shows, without repeats. Pure. */
export function buildItems(refs, yachts, max = 4) {
  const bySlug = new Map(yachts.map((y) => [String(y.slug).toLowerCase(), y]));
  const byId = new Map(yachts.map((y) => [y._id, y]));
  const byName = new Map(yachts.map((y) => [String(y.name).toLowerCase(), y]));
  const out = [];
  const seen = new Set();
  for (const r of refs) {
    if (out.length >= max) break;
    if (r.kind === "guide") {
      const g = GUIDE_PAGES[r.deck];
      if (!g || seen.has(`g:${g.href}:${g.title}`)) continue;
      seen.add(`g:${g.href}:${g.title}`);
      out.push({ kind: "guide", title: g.title, href: g.href });
      continue;
    }
    const y = (r.slug && bySlug.get(r.slug)) || (r.id && byId.get(r.id)) || (r.name && byName.get(String(r.name).toLowerCase()));
    if (!y || !y.slug || seen.has(`y:${y.slug}`)) continue;
    seen.add(`y:${y.slug}`);
    out.push({
      kind: "yacht",
      // "S/CAT Sahana" is how the fleet is filed; a guest calls her Sahana.
      title: String(y.name).replace(/^\s*(S\/CAT|P\/CAT|M\/CAT|M\/Y|S\/Y|M\/S|S\/V|M\/V)\s+/i, "").trim(),
      href: `/yachts/${y.slug}`,
      imageUrl: y.imageUrl || null,
      line: [y.length ? String(y.length).replace(/\s+/g, " ").trim() : null, y.sleeps ? `${String(y.sleeps).match(/\d+/)?.[0] ?? y.sleeps} guests` : null]
        .filter(Boolean)
        .join(" · "),
    });
  }
  return out;
}

export async function latestFromInstagram(max = 4) {
  try {
    const since = new Date(Date.now() - 21 * 86_400_000).toISOString();
    const [posts, settings] = await Promise.all([
      crm(`ig_posts?select=published_at,metadata&status=eq.published&published_at=gte.${since}&order=published_at.desc&limit=14`),
      crm("settings?select=value&key=eq.story_cta_log_v1"),
    ]);
    let storyLog = [];
    try {
      const parsed = JSON.parse(settings?.[0]?.value ?? "[]");
      if (Array.isArray(parsed)) storyLog = parsed.slice(-12);
    } catch {}
    const refs = collectRefs({ posts, storyLog });
    const yachtRefs = refs.filter((r) => r.kind === "yacht");
    if (refs.length === 0) return [];
    let yachts = [];
    if (yachtRefs.length) {
      yachts = await sanityClient.fetch(
        `*[_type == "yacht" && defined(slug.current) && (slug.current in $slugs || _id in $ids || name in $names)]{
          _id, name, "slug": slug.current, length, sleeps, "imageUrl": images[0].asset->url
        }`,
        {
          slugs: yachtRefs.map((r) => r.slug).filter(Boolean),
          ids: yachtRefs.map((r) => r.id).filter(Boolean),
          names: yachtRefs.map((r) => r.name).filter(Boolean),
        },
      );
    }
    return buildItems(refs, Array.isArray(yachts) ? yachts : [], max);
  } catch {
    return [];
  }
}
