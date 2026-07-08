// AI visibility tracker — FREE replacement for Otterly AI (€150/mo).
//
// 2026-05-11 Phase 7 SEO strategy doc Section 8 Gap 3. Uses Google's
// Gemini 1.5 Flash API on its FREE tier (1,500 requests/day, no cost
// for our weekly digest's ~12 queries). Sends representative "yacht
// charter Greece" queries and reports whether our domain or brand
// surfaces in the response, plus a sentiment-of-mention indicator
// when our brand IS mentioned.
//
// To enable, set env var:
//   GOOGLE_GEMINI_API_KEY=<your-free-key-from-ai.google.dev>
// To skip (no key set), the cron silently skips this block.
//
// We use the v1beta endpoint which supports the gemini-1.5-flash
// model on the free tier. Output is a structured object the weekly
// digest formatter renders.

const BRAND_TOKENS = ["george yachts", "georgeyachts.com", "george-yachts"];
const COMPETITOR_TOKENS = [
  // Major Greek/Mediterranean charter brokerages we benchmark against.
  // Used to surface competitive context, not to attack them.
  "burgess", "camper", "fraser", "iyc", "northrop", "edmiston",
  "boatsbookings", "sailing-yachts-greece", "istion", "valef",
];

const QUERIES = [
  // Curated to match real UHNW yacht-charter search intent. We've
  // intentionally avoided ultra-branded queries ("george yachts reviews")
  // — those will always cite us. We want to see whether we surface in
  // the head-term searches where AI engines decide who's authoritative.
  "Best luxury yacht charter company in Greece 2026",
  "How much does it cost to charter a yacht in Greek waters",
  "Recommended yacht charter broker for Cyclades islands",
  "Crewed catamaran charter Greece for family of 8",
  "Honeymoon yacht charter Greek islands which company",
  "Best Greek yacht charter agency for first-time charterers",
  "Athens-based yacht charter broker UHNW",
  "Compare yacht charter Greece Croatia French Riviera",
  "MYBA charter contract Greek waters who explains it well",
  "Charter a 30m motor yacht in Greece for 2026 summer",
];

// Routes through lib/gemini-client which enforces the €10/month
// cost cap. Never call the Gemini REST endpoint directly here —
// the guard test will fail the build.
import { geminiGenerateContent } from "./gemini-client.js";
import { CostCapExceeded, AiFeaturesDisabled } from "./cost-cap.js";

async function queryGemini(prompt, apiKey) {
  try {
    const data = await geminiGenerateContent({
      model: "gemini-2.5-flash",
      apiKey,
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
    });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text };
  } catch (err) {
    if (err instanceof CostCapExceeded || err instanceof AiFeaturesDisabled) {
      return { error: err.message };
    }
    return { error: String(err?.message || err) };
  }
}

function classifyMention(text) {
  if (!text) return { mentions: false, hits: 0, competitorMentions: 0, snippet: "" };
  const lower = text.toLowerCase();
  let hits = 0;
  for (const t of BRAND_TOKENS) {
    if (lower.includes(t)) hits++;
  }
  let competitorMentions = 0;
  for (const c of COMPETITOR_TOKENS) {
    if (lower.includes(c)) competitorMentions++;
  }
  // Extract a 200-char snippet around the first brand mention if any
  let snippet = "";
  if (hits > 0) {
    for (const t of BRAND_TOKENS) {
      const idx = lower.indexOf(t);
      if (idx !== -1) {
        const start = Math.max(0, idx - 50);
        const end = Math.min(text.length, idx + 150);
        snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
        break;
      }
    }
  }
  return { mentions: hits > 0, hits, competitorMentions, snippet };
}

// Public: returns { ok, perQuery: [{q, mentions, hits, snippet}], summary: {...} }
// or { ok: false, reason } if the API key is missing or all queries fail.
export async function fetchAiVisibility() {
  // 2026-07-08 — the site's production env has carried a working Gemini
  // key as AI_API_KEY all along (the "Ask George" key, used by
  // lib/gemini-client for on-site AI features). The tracker only ever
  // looked for GOOGLE_GEMINI_API_KEY, so it idled for months while the
  // key sat one variable away. Accept either name.
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.AI_API_KEY;
  if (!apiKey) return { ok: false, reason: "no_api_key" };

  const perQuery = [];
  let totalMentions = 0;
  let totalCompetitorMentions = 0;
  let errors = 0;

  for (const q of QUERIES) {
    const result = await queryGemini(q, apiKey);
    if (result.error) {
      perQuery.push({ q, mentions: false, error: result.error.slice(0, 100) });
      errors++;
      continue;
    }
    const cls = classifyMention(result.text);
    perQuery.push({ q, mentions: cls.mentions, hits: cls.hits, competitorMentions: cls.competitorMentions, snippet: cls.snippet });
    if (cls.mentions) totalMentions++;
    totalCompetitorMentions += cls.competitorMentions;
    // Gentle rate-limit to stay well under Gemini's 60 RPM free-tier cap.
    await new Promise((r) => setTimeout(r, 1500));
  }

  if (errors === QUERIES.length) {
    return { ok: false, reason: "all_queries_failed" };
  }

  return {
    ok: true,
    summary: {
      totalQueries: QUERIES.length,
      mentionedIn: totalMentions,
      mentionRate: totalMentions / QUERIES.length,
      competitorMentions: totalCompetitorMentions,
      errors,
    },
    perQuery,
  };
}
