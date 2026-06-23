// Article → audience classifier (full-auto routing).
//
// George chose AI classification: given a published blog post, decide
// which newsletter audiences it fits — clients (bridge) and/or travel
// advisors (wake). Cached in KV per slug so each post is classified once.
//
// LOW RISK: this only ROUTES an article to an audience. The email body
// is still built deterministically from the real post + a link (see
// body-assembler buildBlogRecap). The AI never writes the copy, so it
// can never invent a fact — it only answers "who is this for?".

import { kvGet, kvSet } from "@/lib/kv";
import { geminiOpenAiChat } from "@/lib/gemini-client";

const CACHE_PREFIX = "article_audience:";
const CACHE_TTL = 60 * 24 * 3600; // 60 days

const SYSTEM = `You classify a Greek luxury yacht-charter brokerage's blog article by which email audience it fits.
Audiences:
- "clients": HNW leisure travellers / charter guests. Fits destinations, itineraries, islands, on-board experience, food, lifestyle, planning a charter.
- "advisors": professional travel advisors / agents who refer clients. Fits market intel, booking trends, commission/terms, how-to-sell, inventory, trade/industry news.
An article may fit BOTH, ONE, or NEITHER.
Reply with ONLY compact JSON: {"clients": true|false, "advisors": true|false, "reason": "<max 8 words>"}`;

/**
 * @param {{slug:string, title?:string, excerpt?:string}} post
 * @returns {Promise<{audiences:string[], reason:string}>} audiences ⊆ ["bridge","wake"]
 */
export async function classifyArticleAudience(post) {
  if (!post || !post.slug) return { audiences: [], reason: "no post" };

  const cacheKey = `${CACHE_PREFIX}${post.slug}`;
  try {
    const cached = await kvGet(cacheKey);
    if (cached) {
      const c = typeof cached === "string" ? JSON.parse(cached) : cached;
      if (Array.isArray(c?.audiences)) return c;
    }
  } catch {
    /* ignore cache miss */
  }

  const userMsg = `Title: ${post.title || ""}\nExcerpt: ${post.excerpt || ""}`.slice(
    0,
    1500,
  );

  try {
    const j = await geminiOpenAiChat({
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: userMsg },
      ],
      response_format: { type: "json_object" },
      estimatedCostCents: 1,
    });
    const text = j?.choices?.[0]?.message?.content ?? "";
    const m = text.match(/\{[\s\S]*\}/);
    const parsed = m ? JSON.parse(m[0]) : {};
    const audiences = [];
    if (parsed.clients === true) audiences.push("bridge");
    if (parsed.advisors === true) audiences.push("wake");
    const result = {
      audiences,
      reason: String(parsed.reason || "").slice(0, 80),
    };
    await kvSet(cacheKey, JSON.stringify(result), CACHE_TTL).catch(() => {});
    return result;
  } catch (err) {
    // On AI failure: route NOWHERE (safe). The selector then falls back
    // to a yacht — showing a yacht is never "wrong". We do NOT cache an
    // error so the next cycle retries the classification.
    return {
      audiences: [],
      reason: `ai_error: ${String(err?.message || err).slice(0, 60)}`,
    };
  }
}
