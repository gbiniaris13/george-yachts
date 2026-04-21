/**
 * Auto-link keywords in Portable Text blocks to internal pages.
 *
 * Rules:
 * - Only the FIRST occurrence of each term per article is linked
 * - Only links in normal paragraphs (not headings, blockquotes)
 * - Skips text that is already inside a link (has marks)
 * - Case-sensitive matching
 */

const AUTO_LINK_MAP = {
  // Destination keywords now all route to the inquiry flow — the
  // dedicated /destinations/* pages were retired 2026-04-21, so
  // blog mentions of Cyclades / Mykonos / Hydra etc should take the
  // reader to a live conversion path instead of a dead link.
  "Cyclades": "/inquiry",
  "Ionian": "/inquiry",
  "Saronic Gulf": "/inquiry",
  "Sporades": "/inquiry",
  "Mykonos": "/inquiry",
  "Santorini": "/inquiry",
  "Paros": "/inquiry",
  "Hydra": "/inquiry",
  "Spetses": "/inquiry",
  "Corfu": "/inquiry",
  "Lefkada": "/inquiry",
  "Skiathos": "/inquiry",
  "Skopelos": "/inquiry",

  // Concepts → explainer pages
  "APA": "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown",
  "MYBA contract": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "MYBA Charter Agreement": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",
  "preference sheet": "/blog/yacht-charter-booking-process-greece-what-happens-after-you-book",

  // Tools — /cost-calculator and /yacht-finder both redirect to
  // /inquiry (see next.config.mjs), so map direct to save the hop.
  "cost calculator": "/inquiry",
  "itinerary builder": "/itinerary-builder",
  "yacht finder": "/inquiry",

  // Services
  "crewed charter": "/charter-yacht-greece",
  "private fleet": "/private-fleet",
  "explorer fleet": "/explorer-fleet",
};

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

      for (const [term, path] of Object.entries(AUTO_LINK_MAP)) {
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
