# Sanity Studio — schema changes required by the May 2026 master rebuild

**Audience:** the developer / admin who maintains the Sanity Studio
project (the schema files live in the Studio repo, not in this Next.js
project). This file is the contract between the public site and the
Studio so the two stay in sync.

The front-end code in this repo is already written to **gracefully
degrade** when these fields are missing — the site keeps working,
but the new features the Roberto May 2026 brief unlocks will not be
visible until the schema lands.

Add each field as **optional**, then backfill from Studio at George's
pace. Re-deploy Studio after editing each schema file.

---

## 1. `yacht` document — new fields

### 1.1 `priceModel` (string, enum) — Section 0.7

```ts
defineField({
  name: 'priceModel',
  title: 'Price model',
  type: 'string',
  description:
    'How the weekly rate is presented to visitors. Private Fleet ' +
    'yachts almost always sell per-yacht-per-week. Explorer Fleet ' +
    '(small skippered cats) typically sell per-person-per-week.',
  options: {
    list: [
      { title: 'Per yacht / per week', value: 'per_yacht_week' },
      { title: 'Per person / per week', value: 'per_person_week' },
    ],
    layout: 'radio',
  },
}),
```

**Front-end fallback:** if `priceModel` is empty, the site infers
from `fleetTier`:
- `fleetTier === 'explorer'` → per-person
- everything else → per-yacht

Set this explicitly on every yacht so we never rely on inference.

---

### 1.2 `yearRefit` (number) — Section C.6

```ts
defineField({
  name: 'yearRefit',
  title: 'Year of last refit',
  type: 'number',
  description:
    'UHNW filter: an older yacht with a recent refit beats a new ' +
    'yacht with no refit. Drives the "Year of refit" filter on the ' +
    'fleet listing.',
  validation: (Rule) => Rule.min(1980).max(2030),
}),
```

---

### 1.3 `waterToys` (array of strings) — Section C.6

```ts
defineField({
  name: 'waterToys',
  title: 'Water toys onboard',
  type: 'array',
  of: [{ type: 'string' }],
  options: {
    list: [
      { title: 'Jet Ski', value: 'jet_ski' },
      { title: 'SeaBob', value: 'seabob' },
      { title: 'e-Foil', value: 'efoil' },
      { title: 'Wakeboard', value: 'wakeboard' },
      { title: 'Paddleboard', value: 'paddleboard' },
      { title: 'Inflatable Slide', value: 'inflatable_slide' },
      { title: 'Diving Equipment', value: 'diving_equipment' },
      { title: 'Tender (jet drive)', value: 'tender_jet' },
      { title: 'Snorkeling Gear', value: 'snorkeling' },
    ],
  },
}),
```

---

### 1.4 `masterCabinDeck` (string, enum) — Section C.6

```ts
defineField({
  name: 'masterCabinDeck',
  title: 'Master cabin deck',
  type: 'string',
  description: 'Important for UHNW couple charters — main-deck masters command a premium.',
  options: {
    list: [
      { title: 'Main Deck', value: 'main' },
      { title: 'Lower Deck', value: 'lower' },
      { title: 'Upper Deck', value: 'upper' },
    ],
    layout: 'radio',
  },
}),
```

---

### 1.5 `maxCruisingSpeed` (number, knots) — Section C.6

```ts
defineField({
  name: 'maxCruisingSpeed',
  title: 'Max cruising speed (knots)',
  type: 'number',
  validation: (Rule) => Rule.min(0).max(50),
}),
```

---

### 1.6 `featuredThisWeek` (boolean) — Section B.3

```ts
defineField({
  name: 'featuredThisWeek',
  title: 'Feature in "This Week\'s Selection" carousel',
  type: 'boolean',
  description:
    'Surfaces this yacht in the homepage carousel. Brief recommends ' +
    'max 6 yachts active at any time.',
  initialValue: false,
}),
```

---

### 1.7 `matchReasoningTemplate` (text) — Section B.2 Smart Match Quiz

```ts
defineField({
  name: 'matchReasoningTemplate',
  title: 'Match reasoning (Smart Match Quiz)',
  type: 'text',
  rows: 3,
  description:
    'Two-line "Why this yacht for you" reasoning shown when this ' +
    'yacht appears in a quiz match result. Written in second person, ' +
    'concrete: "Lagoon 46 cat, ideal for families of 8 in the calm ' +
    'Saronic Gulf — short legs, sandy bays, family-friendly captain."',
}),
```

---

### 1.8 `deckPlans` (array of objects) — Section D.5

```ts
defineField({
  name: 'deckPlans',
  title: 'Deck plans (interactive)',
  type: 'array',
  of: [{
    type: 'object',
    name: 'deckPlan',
    fields: [
      { name: 'deck', type: 'string', title: 'Deck name (e.g. Main, Flybridge)' },
      { name: 'image', type: 'image', title: 'Plan illustration' },
      {
        name: 'hotspots',
        type: 'array',
        title: 'Clickable cabin hotspots',
        of: [{
          type: 'object',
          fields: [
            { name: 'x', type: 'number', title: 'X (% of width)' },
            { name: 'y', type: 'number', title: 'Y (% of height)' },
            { name: 'cabinName', type: 'string' },
            { name: 'photo', type: 'image' },
          ],
        }],
      },
    ],
  }],
}),
```

Front-end will gracefully render nothing when this field is empty.
Boss prioritizes which top yachts get the treatment.

---

### 1.9 `matterportEmbedUrl` (string, url) — Section D.6

```ts
defineField({
  name: 'matterportEmbedUrl',
  title: 'Matterport 3D tour embed URL',
  type: 'url',
  description:
    'Paste the iframe-embed URL from Matterport (https://my.matterport.com/show/?m=...). ' +
    'When set, the yacht detail page renders an embedded 3D walkthrough.',
}),
```

---

### 1.10 `sampleItinerary` (object) — Section D.7

```ts
defineField({
  name: 'sampleItinerary',
  title: 'Sample 7-day itinerary',
  type: 'object',
  fields: [
    {
      name: 'days',
      title: 'Daily legs',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'day', type: 'number', title: 'Day number' },
          { name: 'distance', type: 'string', title: 'Distance (e.g. "20 NM")' },
          { name: 'from', type: 'string' },
          { name: 'to', type: 'string' },
          { name: 'narrative', type: 'text', rows: 2 },
        ],
      }],
    },
    { name: 'totalDistance', type: 'string', title: 'Total nautical miles' },
  ],
}),
```

---

### 1.11 `crew` (array of objects) — Section D.8

```ts
defineField({
  name: 'crew',
  title: 'Crew',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      {
        name: 'role',
        type: 'string',
        options: {
          list: [
            'Captain', 'Chief Mate', 'Chef', 'Stewardess',
            'Deckhand', 'Engineer', 'Hostess'
          ],
        },
      },
      { name: 'photoOptional', type: 'image', title: 'Photo (optional)' },
      { name: 'oneLineBio', type: 'string', title: 'One-line bio (optional)' },
    ],
  }],
}),
```

---

## 2. `post` (blog) document — new fields

### 2.1 `relatedYachts` (array of references) — Section F.1

```ts
defineField({
  name: 'relatedYachts',
  title: 'Yachts to consider for this read',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'yacht' }] }],
  validation: (Rule) => Rule.max(3),
  description:
    'Up to 3 yachts shown at the end of the article. Algorithm ' +
    'fallback: when empty, front-end auto-picks 3 yachts based on ' +
    'shared tags (e.g. cyclades + family).',
}),
```

---

### 2.2 New portable-text block type — `yachtCallout` (Section F.3)

Add to the Studio schemas folder as a new object type, then register
inside the post `body` field's `of: []` array alongside `block` and
`image`.

```ts
export const yachtCallout = {
  name: 'yachtCallout',
  title: 'Yacht callout (inline)',
  type: 'object',
  fields: [
    {
      name: 'yacht',
      type: 'reference',
      to: [{ type: 'yacht' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'leadIn',
      type: 'string',
      title: 'Lead-in line (optional)',
      description: 'e.g. "Like this story? Consider:"',
    },
  ],
  preview: {
    select: { name: 'yacht.name' },
    prepare({ name }) { return { title: `Yacht: ${name}` }; },
  },
};
```

---

### 2.3 New portable-text block type — `forbesCitationBlock` (Forbes Tier 3.2)

Reusable Sanity component for inserting the Forbes citation in any
future blog post that discusses topics relevant to the May 2026
feature (UHNW wealth movement, Greek-waters charter demand, MYBA
standards, geopolitical shifts in luxury travel).

Add to the Studio schemas folder as a new object type, then register
inside the blog `post.body` field's `of: []` array.

```ts
export const forbesCitationBlock = {
  name: 'forbesCitationBlock',
  title: 'Forbes citation (inline block)',
  type: 'object',
  description:
    'Drops the May 2026 Forbes citation into a blog post. ' +
    'Editor only picks the quote excerpt — the wordmark, byline, ' +
    'date, and link are hard-coded into the front-end so they stay ' +
    'consistent across every use.',
  fields: [
    {
      name: 'quote',
      title: 'Quote excerpt from George in the Forbes piece',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.required().min(20).max(280).warning(
          'Keep under 280 characters — longer pulls read poorly mid-article.'
        ),
    },
    {
      name: 'leadIn',
      title: 'Lead-in (optional)',
      type: 'string',
      description:
        'Optional one-liner to introduce the citation, e.g. "On the geopolitical shift:"',
    },
  ],
  preview: {
    select: { quote: 'quote' },
    prepare({ quote }) {
      return {
        title: 'Forbes citation',
        subtitle: quote ? `"${quote.slice(0, 60)}…"` : '— add quote —',
      };
    },
  },
};
```

**Front-end render (already wired in `RichTextComponents` registry —
when you add this block type to a post, it renders automatically):**

```jsx
// In app/components/RichTextComponents.jsx, add to types:
forbesCitationBlock: ({ value }) => (
  <aside
    style={{
      margin: '40px 0',
      padding: '28px 32px',
      background: 'rgba(13,27,42,0.5)',
      borderTop: '1px solid rgba(201,168,76,0.4)',
      borderBottom: '1px solid rgba(201,168,76,0.4)',
    }}
  >
    <p style={{
      fontFamily: "'Times New Roman', Times, serif",
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: '-0.02em',
      color: '#F8F5F0',
      margin: '0 0 14px',
      lineHeight: 1,
    }}>
      Forbes
    </p>
    {value.leadIn && (
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#C9A84C',
        fontWeight: 600,
        margin: '0 0 12px',
      }}>
        {value.leadIn}
      </p>
    )}
    <blockquote style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontStyle: 'italic',
      fontSize: 22,
      lineHeight: 1.5,
      color: '#fff',
      margin: '0 0 16px',
      padding: 0,
      fontWeight: 300,
      borderLeft: '3px solid #C9A84C',
      paddingLeft: 18,
    }}>
      &ldquo;{value.quote}&rdquo;
    </blockquote>
    <p style={{
      fontFamily: "'Lato', 'Montserrat', sans-serif",
      fontSize: 13,
      color: 'rgba(248,245,240,0.7)',
      margin: 0,
    }}>
      — George Biniaris in{' '}
      <a
        href="https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#C9A84C', textDecoration: 'underline' }}
      >
        Forbes
      </a>{' '}
      &middot; 1 May 2026 &middot;{' '}
      <a
        href="https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#C9A84C', textDecoration: 'underline' }}
      >
        Read the full piece →
      </a>
    </p>
  </aside>
),
```

**Auto-retire policy:** When a second high-tier press feature lands,
review whether this block should rotate (one Forbes block per article
maximum). Don't stack multiple Forbes citations in the same article —
looks promotional.

---

## 3. New `island` document — Section G.1

```ts
export const island = {
  name: 'island',
  title: 'Island / Destination Page',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: (R) => R.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    {
      name: 'region',
      type: 'string',
      options: {
        list: ['Cyclades', 'Ionian', 'Saronic', 'Sporades', 'Dodecanese'],
      },
    },
    { name: 'heroImage', type: 'image' },
    { name: 'intro', type: 'text', title: '200-word intro (UHNW-tailored)' },
    { name: 'whyVisit', type: 'array', of: [{ type: 'block' }] },
    {
      name: 'yachts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'yacht' }] }],
      validation: (R) => R.min(3).max(8),
    },
    {
      name: 'itineraries',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'itinerary' }] }],
    },
    { name: 'seasons', type: 'array', of: [{ type: 'block' }] },
    { name: 'insiderTips', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'faq',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'q', type: 'string' },
          { name: 'a', type: 'text' },
        ],
      }],
    },
  ],
};
```

Initial 5 islands George prioritized: Mykonos, Santorini, Paros,
Corfu, Hydra.

---

## 4. Identity rules — runtime validation (optional but recommended)

To keep the site from accidentally shipping forbidden phrases,
wire a Sanity validation rule on the `bio` / `aboutText` / similar
free-text fields:

```ts
const FORBIDDEN_PHRASES = [
  /\bfounder\b/i,
  /\bfounded\b/i,
  /\bowner\b/i,
  /\bCEO\b/,
  /years? of experience/i,
  /\bMYBA member\b/i,
];

validation: (Rule) => Rule.custom((value) => {
  if (!value) return true;
  for (const re of FORBIDDEN_PHRASES) {
    if (re.test(value)) {
      return `Forbidden phrase: ${re}. See identity rules in the master brief.`;
    }
  }
  return true;
});
```

This stops a future content edit from re-introducing "Founder" or
"X years of experience" silently.

---

## 5. Roll-out checklist for the Studio admin

1. Add fields 1.1 + 1.2 first (priceModel + yearRefit). These have
   the most front-end leverage with the lowest content effort.
2. Backfill `priceModel` on every yacht — sweep through Sanity Vision
   with this query:
   ```
   *[_type == "yacht" && !defined(priceModel)] {
     name, fleetTier
   }
   ```
   Then patch with the right value per fleet tier.
3. Add 1.3 + 1.4 + 1.5 (toys / cabin / speed) so the new filters
   work — leave empty for yachts where data is missing.
4. Add 1.6 (`featuredThisWeek`) — toggle ON for 6 hand-picked yachts.
5. Add 2.1 (`relatedYachts`) on the 19 published blog posts so the
   "Yachts to consider" block renders. Keep to 3 yachts max per
   article.
6. Defer 1.8 / 1.9 / 1.10 / 1.11 (deck plans, matterport, itinerary,
   crew) — add the fields now so the front-end picks them up the
   moment content lands; populate per yacht as time / budget allows.
7. Add the `island` document type when ready to launch destination
   pages (Section G.1).

---

**Last update:** May 2026, by Roberto for the master rebuild.
**Source of truth:** `/Users/.../Downloads/ROBERTO_BRIEF_georgeyachts_MASTER_REBUILD.md`
