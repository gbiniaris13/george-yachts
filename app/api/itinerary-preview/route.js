// Phase 5 / H1 (Boss luxury rebuild brief, 2026-05-05) —
// AI itinerary PREVIEW endpoint (read-only "what your week looks like").
//
// CRITICAL distinction from /api/ask-george and from /api/inquiry:
//   • This endpoint NEVER writes proposals, never names a yacht as
//     "the right pick", never quotes a price.
//   • It paints a 3-stop sample week of the kind a broker might draft,
//     to show prospective guests the texture of what we curate.
//   • The actual proposal always comes from a human broker via
//     /inquiry. Boss directive 2026-05-05: AI is for tools only,
//     never replaces the broker.
//
// The prompt is intentionally narrow: 3 stops × 60 words each, plus a
// one-sentence opener. No prices, no yacht names, no claims.
//
// Streams Server-Sent Events back to the client so the visitor sees
// the preview "write itself" — that's the wow moment.

import { kvIncr, kvExpire } from "@/lib/kv";

export const runtime = "edge";

const RATE_LIMIT_PER_HOUR = 12; // generous — visitors may try a few combos

const SYSTEM_PROMPT = `You are a yacht-charter broker drafting a SAMPLE preview of a Greek-waters week for a prospective guest. This is NOT a proposal — it's a textural taster the visitor can read in 20 seconds.

OUTPUT RULES (strict):
- ALWAYS open with a 1-sentence vibe statement (no "Hello", no "Welcome").
- Then exactly 3 sample days, formatted as:
    Day 1 — [island name]: [50-70 word narrative paragraph]
    Day 2 — [island name]: [50-70 word narrative paragraph]
    Day 3 — [island name]: [50-70 word narrative paragraph]
- Pick islands appropriate to the visitor's region preference.
- Each day's narrative should describe morning anchorage, afternoon swim/excursion, and evening — sensory, specific, in present tense.
- Close with ONE italicised line beginning "*A real broker writes the rest" — no other content after.

NEVER:
- Recommend specific yachts.
- Mention prices or budgets.
- Use the word "perfect" or any superlative.
- Claim "we'll do X" or commit to anything.
- Promise availability.
- Make it longer than 250 words total.
- Use markdown headings (##, etc) — only the "Day N — Name:" pattern shown above.

The visitor's brief follows. Write the 250-word preview only, nothing else.`;

async function checkRateLimit(ip) {
  if (!ip) return true;
  try {
    const key = `gy:itin-preview:rl:${ip}`;
    const count = await kvIncr(key);
    if (count === 1) await kvExpire(key, 3600);
    return count <= RATE_LIMIT_PER_HOUR;
  } catch {
    return true;
  }
}

function fallbackPreview() {
  // Free fallback when AI keys aren't configured — we still want the
  // page to do something useful. Static editorial copy.
  const text = `An unhurried week through the Cyclades, anchor up at sunrise, dinner ashore by sunset.\n\nDay 1 — Mykonos: Wake at anchor outside Ornos. Tender to Spilia for a long lunch overlooking the channel. Afternoon swim at Houlakia where the rocks meet the sea. Evening drinks aboard at golden hour, then a private table at Scorpios for the only dinner that ends with a view of your yacht.\n\nDay 2 — Folegandros: Sixty nautical miles south, into water clearer than most pools. Spilia bay drops 200m straight off the bow. Swim ashore for a walk through Chora's whitewashed lanes; lunch at Pounta; afternoon back aboard. Sunset over the cliffs from the foredeck.\n\nDay 3 — Milos: Sarakiniko at 07:00 before the day-trip boats arrive. Tender into Kleftiko for caves only accessible from the water. Lunch on board, anchor in Provatas for the afternoon swim, evening into Adamantas for dinner at one of the small village tavernas the locals walk to.\n\n*A real broker writes the rest.*`;
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Slow streaming for the same wow-effect as the live model.
      const chars = text.split("");
      for (let i = 0; i < chars.length; i++) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chars[i] })}\n\n`));
        if (i % 24 === 0) await new Promise((r) => setTimeout(r, 18));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "";

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 });
  }

  // Rate limit
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit reached. Brief George directly via /inquiry." }),
      { status: 429 }
    );
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;

  // Sanitise inputs — guests can only nudge the prompt, never break it.
  const when = String(body?.when || "summer").slice(0, 32);
  const who = String(body?.who || "two adults").slice(0, 64);
  const where = String(body?.where || "Cyclades").slice(0, 32);
  const vibe = String(body?.vibe || "quiet, scenic, unhurried").slice(0, 80);

  if (!apiKey || !baseUrl || !model) {
    return fallbackPreview();
  }

  const userBrief = `When: ${when}\nWho: ${who}\nWhere: ${where}\nVibe: ${vibe}`;

  let upstream;
  try {
    upstream = await fetch(`${baseUrl.replace(/\/+$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.85,
        max_tokens: 480,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userBrief },
        ],
      }),
    });
  } catch {
    return fallbackPreview();
  }

  if (!upstream.ok || !upstream.body) {
    return fallbackPreview();
  }

  // Re-stream upstream SSE deltas in our simpler shape so the client
  // can ignore OpenAI/Gemini specifics.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const passthrough = new ReadableStream({
    async start(controller) {
      const reader = upstream.body.getReader();
      let buf = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const payload = t.slice(5).trim();
            if (payload === "[DONE]") {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
              continue;
            }
            try {
              const parsed = JSON.parse(payload);
              const delta =
                parsed?.choices?.[0]?.delta?.content ??
                parsed?.choices?.[0]?.message?.content ??
                "";
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
              }
            } catch {
              /* ignore malformed chunks */
            }
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      } catch {
        /* on stream error, just close */
      } finally {
        controller.close();
      }
    },
  });

  return new Response(passthrough, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
