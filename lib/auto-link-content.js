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

  // ── Phase 7 (2026-05-11) programmatic landing pages ──────────
  // Yacht-type roots
  "motor yacht charter Greece": "/motor-yacht-charter-greece",
  "sailing yacht charter Greece": "/sailing-yacht-charter-greece",
  "catamaran charter Greece": "/catamaran-charter-greece",
  "gulet charter Greece": "/gulet-charter-greece",
  "superyacht charter Greece": "/superyacht-charter-greece",
  // Use-case roots
  "honeymoon yacht charter Greece": "/honeymoon-yacht-charter-greece",
  "family yacht charter Greece": "/family-yacht-charter-greece",
  "corporate yacht charter Greece": "/corporate-yacht-charter-greece",
  "wedding yacht charter Greece": "/wedding-yacht-charter-greece",
  // High-intent long-tail
  "all-inclusive yacht charter Greece": "/all-inclusive-yacht-charter-greece",
  "luxury yacht charter Greece with private chef": "/luxury-yacht-charter-greece-with-private-chef",
  // Comparisons
  "Greece vs Croatia yacht charter": "/greece-vs-croatia-yacht-charter",
  "Greece vs French Riviera": "/greece-vs-french-riviera-yacht-charter",
  "Greece vs Turkey yacht charter": "/greece-vs-turkey-yacht-charter",
  // Linkable assets + reports
  "MYBA contract explained": "/myba-contract-yacht-charter-explained",
  "Greek charter pricing index": "/greek-yacht-charter-pricing-index-2026",
  "Greek anchorages database": "/greek-anchorages-database",
  "2026 Greek charter market report": "/2026-greek-charter-market-report",
  "sailing distance calculator": "/sailing-distance-calculator",
  // Top articles
  "TEPAI tax": "/tepai-tax-greece-yacht-charter-2026",
  "best time to charter": "/best-time-charter-yacht-greece-month-by-month-2026",

  // ── Phase 7 Round 11 anchor-text variety expansion ───────────
  // Multiple anchors per URL so different blog posts get different
  // anchor distribution to the same destination. Engine dedupes
  // by URL, not by term — each post picks whichever phrase appears
  // first in its copy.

  // Yacht-type variations
  "motor yachts": "/motor-yacht-charter-greece",
  "Greek motor yacht charter": "/motor-yacht-charter-greece",
  "crewed motor yacht": "/motor-yacht-charter-greece",
  "sailing yachts": "/sailing-yacht-charter-greece",
  "Greek sailing charter": "/sailing-yacht-charter-greece",
  "crewed catamaran": "/catamaran-charter-greece",
  "Greek catamaran charter": "/catamaran-charter-greece",
  "Greek gulet charter": "/gulet-charter-greece",
  "Greek superyacht charter": "/superyacht-charter-greece",
  "superyacht": "/superyacht-charter-greece",

  // Honeymoon variations
  "honeymoon charter": "/honeymoon-yacht-charter-greece",
  "Greek honeymoon yacht": "/honeymoon-yacht-charter-greece",
  "Santorini honeymoon yacht": "/honeymoon-yacht-charter-santorini",
  "Mykonos honeymoon charter": "/honeymoon-yacht-charter-mykonos",
  "Hydra honeymoon": "/honeymoon-yacht-charter-hydra",
  "Paros honeymoon": "/honeymoon-yacht-charter-paros",

  // Family variations
  "family charter": "/family-yacht-charter-greece",
  "Greek family yacht": "/family-yacht-charter-greece",
  "Lefkada family charter": "/family-yacht-charter-lefkada",
  "Corfu family charter": "/family-yacht-charter-corfu",
  "Hydra family yacht charter": "/family-yacht-charter-hydra",

  // Comparison variations
  "Croatia vs Greece charter": "/greece-vs-croatia-yacht-charter",
  "French Riviera vs Greece": "/greece-vs-french-riviera-yacht-charter",
  "Mykonos or Santorini": "/mykonos-vs-santorini-yacht-charter-2026",
  "Santorini vs Mykonos": "/mykonos-vs-santorini-yacht-charter-2026",

  // Tools variations
  "charter cost estimator": "/charter-cost-estimator",
  "Greek charter pricing tool": "/charter-cost-estimator",
  "charter calendar": "/charter-calendar-heat-map",
  "best months to charter": "/charter-calendar-heat-map",
  "Greek sailing distances": "/sailing-distance-calculator",
  "passage time calculator": "/sailing-distance-calculator",

  // Article variations
  "Greek charter VAT": "/greek-yacht-charter-vat-explained-2026",
  "Greek VAT yacht charter": "/greek-yacht-charter-vat-explained-2026",
  "Meltemi wind": "/meltemi-wind-guide-greek-yacht-charter",
  "Meltemi explained": "/meltemi-wind-guide-greek-yacht-charter",
  "crew gratuity": "/greek-yacht-charter-crew-gratuity-guide-2026",
  "how much to tip yacht crew": "/greek-yacht-charter-crew-gratuity-guide-2026",
  "Greek crew gratuity": "/greek-yacht-charter-crew-gratuity-guide-2026",

  // Combo variations (high-value combos)
  "motor yacht charter Mykonos": "/motor-yacht-charter-mykonos",
  "Mykonos motor yacht": "/motor-yacht-charter-mykonos",
  "catamaran charter Lefkada": "/catamaran-charter-lefkada",
  "Lefkada catamaran": "/catamaran-charter-lefkada",
  "Corfu motor yacht charter": "/motor-yacht-charter-corfu",
  "Athens superyacht": "/superyacht-charter-athens",
  "Flisvos superyacht charter": "/superyacht-charter-athens",
  "Alimos motor yacht charter": "/motor-yacht-charter-athens",
  "Rhodes motor yacht": "/motor-yacht-charter-rhodes",
  "Dodecanese motor yacht charter": "/motor-yacht-charter-rhodes",
  "Kefalonia sailing": "/sailing-yacht-charter-kefalonia",
  "Naxos catamaran": "/catamaran-charter-naxos",

  "private yacht charter Greece 2026": "/private-yacht-charter-greece-2026",
  "all-inclusive Greek charter": "/all-inclusive-yacht-charter-greece",
  "private chef yacht": "/luxury-yacht-charter-greece-with-private-chef",

  // ── Phase 7 Round 14 (2026-05-12) — new island + article anchors
  "Ios": "/yacht-charter-ios",
  "Antiparos": "/yacht-charter-antiparos",
  "Tinos": "/yacht-charter-tinos",
  "Andros": "/yacht-charter-andros",
  "Kos": "/yacht-charter-kos",
  "Skopelos": "/yacht-charter-skopelos",
  "Patmos": "/yacht-charter-patmos",
  "UHNW yacht charter trends 2026": "/uhnw-yacht-charter-trends-greek-market-2026",
  "Greek charter market trends 2026": "/uhnw-yacht-charter-trends-greek-market-2026",
  "large-group yacht charter Greece": "/greek-yacht-charter-large-groups-10-plus-guests-2026",
  "12-passenger rule Greek charter": "/greek-yacht-charter-large-groups-10-plus-guests-2026",
  "Greek yacht charter pricing guide 2026": "/greek-yacht-charter-2026-complete-pricing-guide",
  "complete Greek charter pricing": "/greek-yacht-charter-2026-complete-pricing-guide",

  // ── Phase 7 Round 15 (2026-05-12) — Glossary definition anchors.
  // 30-term yacht-charter glossary at /glossary. Uses DISTINCT phrases
  // that don't collide with the earlier blog/listing-page anchors
  // ("motor yacht", "sailing yacht", "MYBA contract" etc. are kept
  // pointing at the more-trafficked existing destinations). Glossary
  // anchors below catch the alternate phrasings + acronyms where the
  // definition page is the more useful target.
  "Advance Provisioning Allowance": "/glossary/apa",
  "APA explained": "/glossary/apa",
  "APA in yacht charter": "/glossary/apa",
  "crew gratuity": "/glossary/gratuity",
  "yacht tip etiquette": "/glossary/gratuity",
  "yacht delivery fee": "/glossary/delivery-fee",
  "repositioning fee": "/glossary/delivery-fee",
  "Greek charter VAT": "/glossary/greek-vat",
  "Greek 13% VAT": "/glossary/greek-vat",
  "MYBA Agreement": "/glossary/myba-contract",
  "base charter fee": "/glossary/charter-fee",
  "crewed yacht charter": "/glossary/crewed-charter",
  "bareboat yacht charter": "/glossary/bareboat-charter",
  "day yacht charter": "/glossary/day-charter",
  "cabin yacht charter": "/glossary/cabin-charter",
  "superyacht definition": "/glossary/superyacht",
  "what is a superyacht": "/glossary/superyacht",
  "megayacht definition": "/glossary/megayacht",
  "trawler yacht": "/glossary/trawler-yacht",
  "long-range cruiser": "/glossary/trawler-yacht",
  "12-passenger rule explained": "/glossary/twelve-passenger-rule",
  "SOLAS 12 rule": "/glossary/twelve-passenger-rule",
  "12-pax rule": "/glossary/twelve-passenger-rule",
  "yacht embarkation": "/glossary/embarkation",
  "boarding day": "/glossary/embarkation",
  "yacht provisioning": "/glossary/provisioning",
  "pre-charter provisioning": "/glossary/provisioning",
  "yacht tender": "/glossary/tender",
  "limousine tender": "/glossary/tender",
  "yacht water toys": "/glossary/water-toys",
  "e-foil": "/glossary/water-toys",
  "Seabob": "/glossary/water-toys",
  "yacht captain": "/glossary/captain",
  "chief stewardess": "/glossary/stewardess",
  "yacht stewardess": "/glossary/stewardess",
  "yacht chef": "/glossary/yacht-chef",
  "onboard chef": "/glossary/yacht-chef",
  "Length Overall": "/glossary/loa",
  "LOA explained": "/glossary/loa",
  "yacht beam": "/glossary/beam",
  "yacht draft": "/glossary/draft",
  "yacht draught": "/glossary/draft",
  "flybridge": "/glossary/flybridge",
  "yacht flybridge": "/glossary/flybridge",
  // Phase 7 R36 (2026-05-12) - internal-link audit additions per
  // technical brief's required anchor list. Plain forms that were
  // missing from the original mapping.
  "Greek VAT": "/glossary/greek-vat",
  "advance provisioning allowance": "/glossary/apa",
  "charter fee": "/glossary/charter-fee",
  "stabilizers": "/glossary/stabilizers",

  "yacht stabilizers": "/glossary/stabilizers",
  "Seakeeper stabilizer": "/glossary/stabilizers",
  "zero-speed stabilizer": "/glossary/stabilizers",
  "gyroscopic stabilizer": "/glossary/stabilizers",
  "yacht charter glossary": "/glossary",
  "yacht charter terms": "/glossary",

  // ── Phase 7 Round 17 (2026-05-12) — canonical author surface.
  "George P. Biniaris": "/about/george-p-biniaris",
  "George Biniaris": "/about/george-p-biniaris",
  "George Yachts Managing Broker": "/about/george-p-biniaris",

  // ── Phase 7 Round 19 (2026-05-12) — quarterly market reports.
  "Q1 2026 Greek charter retrospective": "/q1-2026-greek-yacht-charter-market-retrospective",
  "Q1 2026 charter market": "/q1-2026-greek-yacht-charter-market-retrospective",
  "mid-year 2026 charter market check": "/mid-year-2026-greek-yacht-charter-market-check",
  "May 2026 Greek charter snapshot": "/mid-year-2026-greek-yacht-charter-market-check",
  "2026 Greek charter peak season forecast": "/2026-peak-season-forecast-greek-yacht-charter",
  "Greek charter peak forecast 2026": "/2026-peak-season-forecast-greek-yacht-charter",
  "Greek charter market reports": "/market-reports",
  "Greek yacht charter research": "/market-reports",

  // ── Phase 7 Round 21 (2026-05-12) — island anchorage spokes.
  "Mykonos yacht anchorages": "/yacht-charter-mykonos-anchorages",
  "anchorages in Mykonos": "/yacht-charter-mykonos-anchorages",
  "Santorini yacht anchorages": "/yacht-charter-santorini-anchorages",
  "Santorini caldera mooring": "/yacht-charter-santorini-anchorages",
  "Paros yacht anchorages": "/yacht-charter-paros-anchorages",
  "Antiparos channel": "/yacht-charter-paros-anchorages",
  "Corfu yacht anchorages": "/yacht-charter-corfu-anchorages",
  "Kassiopi anchorage": "/yacht-charter-corfu-anchorages",
  "Agni Bay tavernas": "/yacht-charter-corfu-anchorages",
  "Hydra yacht anchorages": "/yacht-charter-hydra-anchorages",
  "Hydra harbour mooring": "/yacht-charter-hydra-anchorages",

  // ── Phase 7 Round 26 (2026-05-12) - VAT/APA calculator.
  "Greek yacht charter cost calculator": "/tools/charter-cost-calculator",
  "charter cost calculator": "/tools/charter-cost-calculator",
  "APA calculator": "/tools/charter-cost-calculator",
  "VAT calculator yacht charter": "/tools/charter-cost-calculator",
  "Greek charter cost estimator": "/tools/charter-cost-calculator",

  // ── Phase 7 Round 16 (2026-05-12) — destination comparison anchors.
  "Greece vs Croatia yacht charter": "/greek-yacht-charter-vs-croatia",
  "Croatia vs Greece chartering": "/greek-yacht-charter-vs-croatia",
  "Greece or Croatia": "/greek-yacht-charter-vs-croatia",
  "Greece vs French Riviera": "/greek-yacht-charter-vs-french-riviera",
  "French Riviera vs Greece": "/greek-yacht-charter-vs-french-riviera",
  "Côte d'Azur vs Greece": "/greek-yacht-charter-vs-french-riviera",
  "Greece vs Italy yacht charter": "/greek-yacht-charter-vs-italy",
  "Amalfi vs Greece": "/greek-yacht-charter-vs-italy",
  "Sardinia vs Greece": "/greek-yacht-charter-vs-italy",
  "Greece vs Turkey charter": "/greek-yacht-charter-vs-turkey",
  "Turkish Riviera vs Greece": "/greek-yacht-charter-vs-turkey",
  "Turquoise Coast vs Cyclades": "/greek-yacht-charter-vs-turkey",
  "Greece vs Caribbean charter": "/greek-yacht-charter-vs-caribbean",
  "BVI vs Greece yacht charter": "/greek-yacht-charter-vs-caribbean",
  "St. Barths vs Greece": "/greek-yacht-charter-vs-caribbean",
  "Mediterranean vs Caribbean charter": "/greek-yacht-charter-vs-caribbean",
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

  // Phase 7 Round 11 (2026-05-11) — dedupe by URL, not term. Two
  // benefits over the old per-term dedup:
  //   1. Anchor-text variety: when the map has 3 anchors for the
  //      same URL ("Mykonos", "Mykonos yacht charter", "Mykonos
  //      motor yacht"), each article picks whichever anchor matches
  //      first in its copy — different articles get different
  //      anchor distribution to the same target URL. This is the
  //      No. 1 SEO best-practice that the per-term dedup blocked.
  //   2. No double-links to the same destination — still capped at
  //      one link per URL per article (no link-stuffing risk).
  const alreadyLinkedUrls = new Set();

  return blocks.map((block) => {
    if (block._type !== "block" || block.style !== "normal") return block;

    const newChildren = [];
    const existingMarkDefs = [...(block.markDefs || [])];

    for (const child of block.children || []) {
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
        // Dedup by URL: skip if this destination URL already linked.
        if (alreadyLinkedUrls.has(path)) continue;

        for (let i = 0; i < segments.length; i++) {
          const seg = segments[i];
          if (seg.marks && seg.marks.length > 0) continue;

          const idx = seg.text.indexOf(term);
          if (idx === -1) continue;

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
          alreadyLinkedUrls.add(path);
          modified = true;
          break;
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
