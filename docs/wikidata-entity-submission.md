# Wikidata Entity Submission Guide

**Phase 7 Round 28 (2026-05-12). Technical brief Priority 2C.**

Wikidata entities for George Yachts and George P. Biniaris. One-time
submission. High impact on Google Knowledge Graph + AI engine entity
recognition. Zero ongoing maintenance after creation.

This document is the source-of-truth for the two entities. Submit
via wikidata.org (free, requires a Wikipedia account).

---

## Why Wikidata matters

- Google's Knowledge Graph treats Wikidata as a primary source for
  entity disambiguation. Having a Q-number gives George Yachts a
  stable identity Google can resolve cross-language.
- AI engines (ChatGPT, Perplexity, Claude, Gemini) traverse
  Wikidata for entity attribution. A Wikidata Q-number means
  citations carry the correct organisation/person attribution.
- `sameAs` linkbacks from Wikidata to georgeyachts.com strengthen
  domain authority - Wikidata is one of the highest-DR domains on
  the open web.

---

## Entity 1: George Yachts Brokerage House LLC

**Suggested label:** George Yachts Brokerage House
**Aliases:** George Yachts, George Yachts Brokerage House LLC
**Description (English):**
Luxury crewed yacht charter brokerage based in Athens, Greece,
specialising in the Greek islands. Founded 2025.

### Properties

| Property | Value | Source |
|----------|-------|--------|
| instance of (P31) | business (Q4830453) | structural |
| legal form (P1454) | limited liability company (Q2912172) | Wyoming LLC registration |
| country (P17) | United States (Q30) | LLC jurisdiction (Wyoming) |
| headquarters location (P159) | Athens, Greece | operational HQ |
| founded (P571) | 2025-11 | foundingDate |
| official website (P856) | https://georgeyachts.com | primary |
| industry (P452) | yacht charter | from organizationSchema.knowsAbout |
| founder (P112) | George P. Biniaris (link to Person entity below) | structural |
| logo image (P154) | https://georgeyachts.com/images/yacht-icon-only.svg | structural |
| official Instagram (P2003) | georgeyachts | from sameAs |
| Twitter username (P2002) | (not active - skip) | n/a |

### Reference URLs (for "stated in" qualifiers)

- https://georgeyachts.com/about-us
- https://georgeyachts.com/about/george-p-biniaris
- https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/

### sameAs to add back (after creation)

Once George Yachts gets a Q-number, update lib/organizationSchema.js
sameAs array with the Wikidata URL:

```
"sameAs": [
  "https://www.wikidata.org/wiki/Q[NUMBER]",
  "https://iyba.org/...",
  "https://www.instagram.com/georgeyachts",
  "https://www.linkedin.com/in/george-p-biniaris/",
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/"
]
```

---

## Entity 2: George P. Biniaris

**Suggested label:** George P. Biniaris
**Aliases:** George Biniaris, George Petros Biniaris
**Description (English):**
Greek yacht charter broker. Managing Broker of George Yachts
Brokerage House LLC. Member of the International Yacht Brokers
Association (IYBA). Featured in Forbes (May 2026).

### Properties

| Property | Value | Source |
|----------|-------|--------|
| instance of (P31) | human (Q5) | structural |
| sex or gender (P21) | male (Q6581097) | bio |
| occupation (P106) | yacht broker | knowsAbout primary topic |
| occupation (P106) | businessperson (Q43845) | role |
| employer (P108) | George Yachts Brokerage House LLC | (link to Org entity above) |
| country of citizenship (P27) | Greece (Q41) | nationality |
| residence (P551) | Athens, Greece | workLocation |
| official website (P856) | https://georgeyachts.com/about/george-p-biniaris | canonical author page |
| LinkedIn personal profile (P6634) | george-p-biniaris | from sameAs |
| Instagram username (P2003) | george_p.biniaris | from sameAs |
| member of (P463) | International Yacht Brokers Association | from memberOf |
| award received (P166) | Featured in Forbes (May 2026) | from teamSchema |
| described by source (P1343) | Forbes article URL | press reference |

### Reference URLs

- https://georgeyachts.com/about/george-p-biniaris (canonical Person page)
- https://georgeyachts.com/team/george-biniaris (team listing)
- https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/
- https://iyba.org (IYBA membership)
- https://www.linkedin.com/in/george-p-biniaris/

---

## Submission steps (manual, ~30 minutes per entity)

1. Create a Wikipedia/Wikidata account at wikidata.org (free; uses
   single sign-on across Wikimedia projects).

2. For the Organisation entity:
   - Search Wikidata first to confirm no duplicate exists.
   - Click "Create a new item".
   - Enter label, description (English; consider Greek too).
   - Add aliases.
   - Add statements one by one using the property table above.
   - For each statement, attach a reference URL (use "reference URL"
     qualifier with the URLs listed).
   - Save and note the Q-number assigned.

3. For the Person entity:
   - Same flow.
   - In "employer (P108)" statement, link the Organisation entity by
     its newly-created Q-number.
   - Save and note the Q-number.

4. Back in the Organisation entity: edit "founder (P112)" statement
   to link the Person entity's Q-number.

5. Update lib/organizationSchema.js sameAs array with the new
   Wikidata URL. Commit + deploy.

6. Update lib/teamSchema.js (george-biniaris record) sameAs array
   with the Person entity's Wikidata URL. Commit + deploy.

---

## After submission

- Wikidata entities are usually indexed by Google Knowledge Graph
  within 7-30 days of creation.
- AI engine traversal happens on their next crawl cycle (typical
  2-6 weeks for Perplexity / ChatGPT / Claude).
- No ongoing maintenance unless George's role changes or new
  significant press appears.

---

## What NOT to do

- Do NOT create a Wikidata entity for George Yachts as a "company
  with notability concerns" - LLC + Forbes feature is sufficient
  notability, but write the description factually (no marketing
  language).
- Do NOT cross-link to non-public personal data (family Mason
  affiliation, family history). Wikidata is public.
- Do NOT add the same `sameAs` link twice. Each `sameAs` should
  point to a different platform.

---

*Brief prepared: May 2026 | Version 1.0*
