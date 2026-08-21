#!/usr/bin/env node
/**
 * The other half of the site.
 *
 * scripts/checkAwardClaims.mjs and its siblings read the repository, which is
 * where most of the copy lives. It is not where all of it lives. Yacht
 * descriptions, insider tips and subtitles are written in Sanity by a human,
 * they render on public pages, and no guard has ever looked at them.
 *
 * On 2026-08-21 the language pass cleaned forty-four possessives and position
 * statements out of the code, and one survived on the homepage anyway:
 * ALEXANDRA II's insider tip named a partner agency by name and called the
 * boats "our Alegria 67 fleet". Both are exactly what George asked to remove,
 * and neither is fixable in this repo.
 *
 * So this reads the fields Sanity serves to the public and reports what needs
 * editing in the Studio. It does not gate the build: nothing here can be
 * fixed by the person running the build, and a check that cannot be satisfied
 * is a check people learn to skip.
 *
 *   node scripts/checkSanityCopy.mjs
 */
const PROJECT = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ecqr94ey";
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const RULES = [
  {
    id: "possessive",
    // "our fleet" tells the reader this house owns the boats. It does not,
    // and an owner or a central agent reading it has a fair complaint.
    re: /\bour\s+(yacht|yachts|fleet|boat|boats|vessel|vessels|catamaran|catamarans)\b/gi,
    fix: 'Use "in this house", "here", or "the fleet".',
  },
  {
    id: "position",
    // Saying we are not a central agency hands a prospect the org chart of
    // the trade and invites them to go looking further up it.
    re: /\bcentral agenc(y|ies)\b|\bwe own no\b|\bown none of\b|\bowning no yacht\b|\bhold no [a-z ]{0,20}mandate/gi,
    fix: 'Keep the argument, drop the disclosure: "there is no boat here we are paid to fill".',
  },
  {
    id: "partner-named",
    // Partner houses are never named in public copy.
    re: /\bFX\s*Yachting\b|\bFYLY\b|\bIstion\b|\bIYC\b|\bKavas\b|\bFraser\b/gi,
    fix: "Remove the agency name. Public copy never names who else is involved.",
  },
  {
    id: "vague-award",
    // The exact wording lib/yachtAwards.js exists to prevent, found alive in
    // Sanity on 2026-08-21: three yacht subtitles read "AWARD-WINNING" with
    // nothing after it. One of them is WORLD'S END, whose award is withheld
    // precisely because it could never be confirmed. The code guard has
    // banned this phrase for a week and could not see these.
    re: /\baward[- ]winning\b|\baward winner\b|\bwon awards\b|\bmultiple awards\b/gi,
    fix:
      "Name the placing, the competition, the organiser and the year, or say " +
      "nothing. Sourced awards belong in lib/yachtAwards.js and render by " +
      "themselves.",
  },
  {
    id: "skipper-or-bareboat as a product",
    // Section 5: this house writes crewed weeks. Two published articles and
    // several yacht records still describe a skipper-only arrangement as a
    // tier you can buy, and no code guard can see them.
    re: /skipper (included|available|optional|mandatory|only)|skippered (charter|yacht|fleet|cat)|skipper[- ]led|middle tier|\bbareboat\b/gi,
    exempt: /24%|short, static|sailing skipper|do not broker|not through us/i,
    fix:
      "Explain the term if it helps a reader; never present it as something " +
      "this house sells. Crewed weeks only.",
  },
  {
    id: "retired yacht named",
    // Section 6 withdrew seven yachts from every public surface. The code
    // surfaces are clean; Sanity still names them in article bodies, and
    // llms-full.txt serves those bodies to every assistant that reads it.
    re: /\b(S\/CAT )?(Alia|Angelika|Helidoni|Madicon|Odyssey|Perseids)\b|\bP\/CAT My Angel\b/g,
    fix:
      "These seven are withdrawn and their URLs now redirect. Naming them in " +
      "an article sends a reader to a 301 and an assistant to a boat that " +
      "cannot be chartered.",
  },
  {
    id: "em-dash",
    re: /[—–]/g,
    fix: "House style: commas, full stops and short hyphens only.",
  },
  {
    id: "per-person",
    re: /\bper\s+person\b|\bp\/p\b|\bper\s+guest\b/gi,
    fix: "Every price on the site is per yacht per week.",
  },
];

const FIELDS = [
  "name", "subtitle", "description", "georgeInsiderTip", "highlights",
  "crew", "itinerary", "seoTitle", "seoDescription", "excerpt", "title",
  // Post bodies too: the two articles that describe a skipper-only tier as
  // a product are long-form, and their titles alone did not show it.
  "body",
];

const query = `*[_type in ["yacht","post"]]{ _id, _type, "slug": slug.current, ${FIELDS.join(", ")} }`;

const url =
  `https://${PROJECT}.api.sanity.io/v2023-05-03/data/query/${DATASET}` +
  `?query=${encodeURIComponent(query)}`;

let docs = [];
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Sanity returned ${res.status}`);
  docs = (await res.json()).result || [];
} catch (err) {
  console.error(`Sanity copy check: could not read the dataset (${err.message}).`);
  process.exit(0); // not the build's problem
}

/** Portable Text and arrays both turn up here; flatten to something readable. */
function textOf(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(textOf).join(" ");
  if (typeof value === "object") {
    if (Array.isArray(value.children)) return value.children.map(textOf).join("");
    if (typeof value.text === "string") return value.text;
    return Object.values(value).map(textOf).join(" ");
  }
  return "";
}

const findings = [];
for (const doc of docs) {
  for (const field of FIELDS) {
    const text = textOf(doc[field]);
    if (!text) continue;
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(text)) !== null) {
        const from = Math.max(0, m.index - 55);
        findings.push({
          where: `${doc._type}/${doc.slug || doc._id} · ${field}`,
          rule: rule.id,
          quote: text.slice(from, m.index + m[0].length + 55).replace(/\s+/g, " ").trim(),
          fix: rule.fix,
        });
      }
    }
  }
}

if (findings.length === 0) {
  console.log(`Sanity copy check: clean across ${docs.length} documents.`);
  process.exit(0);
}

const byRule = findings.reduce((acc, f) => ((acc[f.rule] = acc[f.rule] || []).push(f), acc), {});
console.log(`Sanity copy check: ${findings.length} passage(s) to edit in the Studio, across ${docs.length} documents.\n`);
for (const [rule, list] of Object.entries(byRule)) {
  console.log(`── ${rule} (${list.length}) ── ${list[0].fix}`);
  for (const f of list) console.log(`   ${f.where}\n     …${f.quote}…`);
  console.log("");
}
process.exit(0);
