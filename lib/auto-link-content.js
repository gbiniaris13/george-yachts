/**
 * Auto-link keywords in Portable Text blocks to internal pages.
 *
 * Phase 2 (2026-05-08, Boss SEO directive) — rebuilt to drive
 * topical-authority clusters. Internal linking is the No. 1 free
 * lever after backlinks for both Google PageRank and AI engine
 * topical-graph mapping. Map below intentionally over-indexes on:
 *
 *   • Region landing pages (3 destinations) — pillar pages
 *   • Per-island programmatic pages (6 live)         — long-tail
 *   • Blog → blog cross-links inside same cluster    — authority
 *   • Concept terms → canonical explainer post       — disambiguation
 *
 * Rules:
 * - Only the FIRST occurrence of each term per article is linked
 * - Only links in normal paragraphs (not headings, blockquotes)
 * - Skips text that is already inside a link (has marks)
 * - Case-sensitive matching
 * - Multi-word phrases checked BEFORE single-word fragments to
 *   avoid "MYBA contract" → "MYBA" + "contract" partial-match
 *   (so we list longest term first per cluster).
 */

const AUTO_LINK_MAP = {
  // ── Region pillar pages (live as of 2026-05-08) ────────────────
  "Cyclades": "/destinations/cyclades",
  "Ionian": "/destinations/ionian",
  "Saronic Gulf": "/destinations/saronic",
  "Saronic": "/destinations/saronic",

  // ── Per-island long-tail pages (live as of 2026-05-08) ─────────
  // 10 island pillar pages. Cyclades: Mykonos / Santorini / Paros
  // / Milos / Folegandros. Ionian: Corfu / Lefkada / Kefalonia.
  // Saronic: Hydra / Spetses.
  "Mykonos": "/yacht-charter-mykonos",
  "Santorini": "/yacht-charter-santorini",
  "Paros": "/yacht-charter-paros",
  "Milos": "/yacht-charter-milos",
  "Folegandros": "/yacht-charter-folegandros",
  "Corfu": "/yacht-charter-corfu",
  "Lefkada": "/yacht-charter-lefkada",
  "Kefalonia": "/yacht-charter-kefalonia",
  "Hydra": "/yacht-charter-hydra",
  "Spetses": "/yacht-charter-spetses",

  // ── Concept terms → canonical explainer post ──────────────────
  // Longest phrases listed first so the regex match doesn't break
  // multi-word terms when a single-word substring is also mapped.
  "MYBA Charter Agreement": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "MYBA contract": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "preference sheet": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "12-passenger rule": "/blog/12-passenger-rule-greek-yacht-charter-groups-of-14",
  "shoulder season": "/blog/greek-yacht-charter-shoulder-season-may-september",
  "Meltemi": "/blog/the-7-day-cyclades-itinerary-what-your-captain-won-t-tell-you-until-you-re-onboard",
  "Advance Provisioning Allowance": "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",
  "APA": "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",

  // ── Cost cluster cross-links ──────────────────────────────────
  "yacht charter cost": "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",
  "weekly charter rate": "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",

  // ── Process cluster ───────────────────────────────────────────
  "charter booking process": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "first-time charter": "/blog/the-first-timer-s-complete-guide-to-crewed-yacht-charter-in-greece",

  // ── Yacht type cluster ────────────────────────────────────────
  "motor yacht": "/blog/motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",
  "catamaran": "/blog/motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",
  "sailing yacht": "/blog/motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",
  "gulet": "/blog/motor-yacht-catamaran-sailing-yacht-gulet-how-to-choose-charter-yacht-greece",

  // ── Service landing pages ─────────────────────────────────────
  "crewed charter": "/charter-yacht-greece",
  "Private Fleet": "/private-fleet",
  "Explorer Fleet": "/explorer-fleet",

  // ── Tools that ARE live ───────────────────────────────────────
  "itinerary builder": "/itinerary-builder",
  "cost calculator": "/cost-calculator",
  "yacht finder": "/yacht-finder",

  // ── Trust signals ─────────────────────────────────────────────
  "IYBA": "/credentials",
  "IYBA member": "/credentials",
  "MYBA": "/credentials",
};

// Phase 2 — sort the map by descending key length so multi-word phrases
// (e.g., "MYBA Charter Agreement", "yacht charter cost") always match
// BEFORE their single-word substrings ("MYBA", "yacht charter"). Without
// this, "MYBA" would consume the first match and "MYBA Charter
// Agreement" would never be linked.
const SORTED_TERMS = Object.entries(AUTO_LINK_MAP).sort(
  ([a], [b]) => b.length - a.length,
);

export function autoLinkPortableText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return blocks;

  const alreadyLinked = new Set();

  return blocks.map((block) => {
    // Only process normal paragraph blocks
    if (block._type !== "block" || block.style !== "normal") return block;

    const newChildren = [];
    const existingMarkDefs = [...(block.markDefs || [])];

    for (const child of block.children || []) {
      // Skip non-span or already-marked text
      if (child._type !== "span" || (child.marks && child.marks.length > 0)) {
        newChildren.push(child);
        continue;
      }

      let text = child.text;
      if (!text) {
        newChildren.push(child);
        continue;
      }

      let segments = [{ text, _type: "span", _key: child._key }];
      let modified = false;

      for (const [term, path] of SORTED_TERMS) {
        if (alreadyLinked.has(term)) continue;

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          // Skip segments that already have marks (linked in a previous iteration)
          if (seg.marks && seg.marks.length > 0) continue;

          const idx = seg.text.indexOf(term);
          if (idx === -1) continue;

          // Found first occurrence — split into before | linked | after
          const before = seg.text.slice(0, idx);
          const after = seg.text.slice(idx + term.length);
          const linkKey = `auto_${term.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")}_${block._key || "b"}`;

          existingMarkDefs.push({
            _type: "link",
            _key: linkKey,
            href: `https://georgeyachts.com${path}`,
          });

          const newSegs = [];
          if (before) newSegs.push({ _type: "span", text: before, _key: `${linkKey}_b` });
          newSegs.push({ _type: "span", text: term, _key: linkKey, marks: [linkKey] });
          if (after) newSegs.push({ _type: "span", text: after, _key: `${linkKey}_a` });

          segments.splice(i, 1, ...newSegs);
          alreadyLinked.add(term);
          modified = true;
          break; // Only first occurrence per term
        }
      }

      if (modified) {
        newChildren.push(...segments);
      } else {
        newChildren.push(child);
      }
    }

    return { ...block, children: newChildren, markDefs: existingMarkDefs };
  });
}
