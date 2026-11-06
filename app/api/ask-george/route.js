// H.1 (Roberto brief, May 2026) — "Ask George" AI Concierge.
//
// Edge-runtime streaming endpoint. Calls Gemini (or any OpenAI-compatible
// chat-completions API via AI_BASE_URL) with a system prompt that
// encodes the identity rules + a snapshot of the live fleet so the
// model can recommend specific yachts without a vector store.
//
// Activation requires three env vars:
//   AI_API_KEY        – auth bearer for the model provider
//   AI_BASE_URL       – OpenAI-compatible base URL (e.g. Google's v1beta/openai shim)
//   AI_MODEL          – e.g. gemini-2.5-flash
// When any are missing the endpoint returns a graceful fallback ("Ask
// George is warming up — write to George directly via /inquiry") so
// the widget stays usable even before the keys are wired.
//
// Rate-limit: 10 messages per IP per hour via Vercel KV. The existing
// kv client is reused; failures are silent (better to allow than block
// on transient KV issues).
//
// Save-for-follow-up: when the request body has { saveForFollowUp:
// true, name, email }, the follow-up and the conversation transcript
// are handed to ./save (Node runtime: Telegram AND email to George)
// and that route's answer is returned as is. No AI call.
//
// 2026-11-05 (form sweep): before, this branch sent one Telegram from
// the edge and always answered ok, so a refused Telegram was a lost
// lead behind a "Saved" screen. And the assistant invited visitors to
// type their name and email INTO THE CHAT, which reached no one: a
// chat message carrying an email or phone number now goes to ./save
// too, with the conversation so far.

import { isSailingFleet } from "@/lib/fleetTiers";
import { sendTelegram } from "@/lib/telegram";
import { telegramSafe } from "@/lib/requiredContact";
import { FLEET_COUNT } from "@/lib/fleetCount";
import { sanityClient } from "@/lib/sanity";
import { kvIncr, kvExpire, kvLpush, kvLtrim } from "@/lib/kv";

export const runtime = "edge";

const RATE_LIMIT_PER_HOUR = 10;

const SYSTEM_PROMPT_BASE = `You are "Ask George", an AI concierge for George Yachts Brokerage House (georgeyachts.com).

You help visitors explore yacht charter options in Greek waters.

WHO IS GEORGE:
- George P. Biniaris is the Managing Broker of George Yachts Brokerage House.
- He is an IYBA Member.
- He works hands-on with charter clients and central agents across Greek waters.

YOUR KNOWLEDGE:
- ${FLEET_COUNT} curated yachts in this house. Every rate is per yacht, per week, fully crewed. There is no per-person rate and no bareboat.
- Greek regions: Cyclades, Ionian, Saronic Gulf.
- Sample itineraries on 10+ yachts.
- MYBA-standard charter contracts, APA, VAT logic.

YOUR BEHAVIOR:
- Recommend yachts when the user describes their needs (group size, region, vibe, budget).
- Be specific, name yachts from the catalog below.
- Explain pricing clearly and identically for both fleets: per yacht, per week, fully crewed, with VAT, APA and gratuity quoted separately. Never quote a per-person figure, never divide a week by the number of guests, and never mention bareboat or a skipper-only arrangement as something we offer.
- Suggest itineraries.
- Answer questions about Greek waters honestly.
- Keep responses concise (2-4 short paragraphs, not essays).

WHAT YOU NEVER DO:
- Never call George the "founder", "owner", or "CEO". He is "Managing Broker".
- Never claim "MYBA Member", we use MYBA-standard contracts but are IYBA members.
- Never mention specific years of experience or charter counts.
- Never confirm a booking. You can collect interest only.
- Never quote exact prices for specific dates, say "George provides exact pricing in your personalized proposal".
- Never reveal the names of central agents or yacht management companies, those are confidential.
- Never make up yachts or itineraries that aren't in the catalog.

AFTER 3-4 EXCHANGES:
Gently offer: "Would you like George to follow up personally? Tap Save just below this chat and leave your name, email and phone, and he will have this conversation in front of him."

If the user shares contact details in the chat, thank them and confirm George will reach out within 24 hours (they reach him with this conversation). Stay friendly, brief, never pushy.
`;

async function getFleetSnapshot() {
  try {
    const yachts = await sanityClient.fetch(
      `*[_type == "yacht" && defined(slug.current)] | order(name asc){
        name, "slug": slug.current, fleetTier, priceModel,
        category, builder, length, sleeps, cabins,
        cruisingRegion, weeklyRatePrice, idealFor
      }`
    );
    return Array.isArray(yachts) ? yachts : [];
  } catch {
    return [];
  }
}

function formatFleetForPrompt(yachts) {
  if (!yachts.length) return "(Fleet snapshot temporarily unavailable.)";
  return yachts
    .slice(0, 80)
    .map((y) => {
      const tier = isSailingFleet(y) ? "Catamaran Fleet" : "Motor Yacht Fleet";
      return `• ${y.name}, ${y.builder || y.category || "yacht"}, ${y.length || ""}, sleeps ${y.sleeps || "?"}, ${y.cruisingRegion || "Greece"}. ${tier}. ${y.weeklyRatePrice || ""}. /yachts/${y.slug}`;
    })
    .join("\n");
}

async function checkRateLimit(ip) {
  if (!process.env.KV_REST_API_URL) return true;
  const key = `ask-george:rate:${ip}:${new Date().toISOString().slice(0, 13)}`; // bucket per hour (UTC)
  try {
    const count = await kvIncr(key);
    if (count === 1) await kvExpire(key, 3700);
    return (count || 0) <= RATE_LIMIT_PER_HOUR;
  } catch {
    return true; // allow on KV error
  }
}

function fallbackReply() {
  const text =
    "Ask George is warming up, give us a moment. In the meantime, the fastest way to reach George is to write to him at /inquiry or via WhatsApp. He replies personally, usually within the day.";
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Ask-George-Mode": "fallback",
    },
  });
}

// Hands a follow-up to ./save (Node runtime). The shared secret lets
// ./save rate-limit by the VISITOR's address rather than this edge
// function's, which every visitor would share. Returns the Response,
// or null when ./save could not be reached at all.
async function deliverFollowUp(req, ip, payload) {
  const secret = process.env.CRON_SECRET || "";
  try {
    return await fetch(new URL("/api/ask-george/save", req.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { "x-gy-internal": secret, "x-gy-visitor-ip": ip } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return null;
  }
}

// An email address, or a phone number written as one (a leading +, or
// a word like phone / WhatsApp before it), in the visitor's latest
// message. Budgets and years ("10 guests, 2027, 50000") do not match.
const EMAIL_IN_TEXT = /[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,}/i;
const PHONE_IN_TEXT = /(?:\+\s?\d[\d\s().-]{5,}\d|(?:phone|whatsapp|mobile|cell|tel|call|text|number|reach me)[^\d(]{0,12}\(?\d[\d\s().-]{5,}\d)/i;

function contactInLatestMessage(messages) {
  const last = [...messages].reverse().find((m) => m?.role === "user");
  const text = String(last?.content || "");
  const email = text.match(EMAIL_IN_TEXT)?.[0] || "";
  const phoneMatch = text.match(PHONE_IN_TEXT)?.[0] || "";
  const phone = phoneMatch.replace(/^[^+\d(]*/, "");
  const digits = phone.replace(/\D/g, "").length;
  return { email, phone: digits >= 7 && digits <= 18 ? phone : "" };
}

async function logConversation(ip, messages, finalReply) {
  if (!process.env.KV_REST_API_URL) return;
  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry = {
      id,
      ip: ip.replace(/\d+$/, "x"),
      ts: new Date().toISOString(),
      messages,
      finalReply,
    };
    await kvLpush("ask-george:log", JSON.stringify(entry));
    await kvLtrim("ask-george:log", 0, 999); // keep last 1000
  } catch {}
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400 });
  }

  // Save-for-follow-up branch — no AI call.
  if (body?.saveForFollowUp) {
    const name = (body.name || "").toString().slice(0, 100).trim();
    const email = (body.email || "").toString().slice(0, 200).trim();
    const phone = (body.phone || "").toString().slice(0, 40).trim();
    const transcript = Array.isArray(body.messages) ? body.messages : [];
    if (!name || !email) {
      return new Response(JSON.stringify({ ok: false, error: "Missing name or email" }), { status: 400 });
    }
    const res = await deliverFollowUp(req, ip, {
      trigger: "form", name, email, phone, messages: transcript, path: body.path || "",
    });
    if (res) {
      return new Response(await res.text(), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }
    // ./save unreachable: one plain Telegram from here, and the truth.
    const summary = transcript
      .map((m) => `${m.role === "user" ? "Visitor" : "Ask George"}: ${telegramSafe(m.content, 4000)}`)
      .join("\n\n")
      .slice(0, 3500);
    const delivered = await sendTelegram(
      `🤖 *Ask George, follow-up requested*\n\n👤 ${telegramSafe(name, 100)}\n📧 ${telegramSafe(email, 200)}\n${phone ? `📞 ${telegramSafe(phone, 40)}\n` : ""}\n${summary}\n\nSource: ${telegramSafe(body.path || "unknown", 200)}`,
    );
    return new Response(JSON.stringify(delivered ? { ok: true } : { ok: false, error: "not_delivered" }), {
      status: delivered ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Contact details typed into the chat reach George, with the
  // conversation so far, even when the model is rate-limited or off.
  // Awaited (an edge fetch left running can be cut when the response
  // ends), before the model answers.
  const typed = contactInLatestMessage(Array.isArray(body?.messages) ? body.messages : []);
  if (typed.email || typed.phone) {
    await deliverFollowUp(req, ip, {
      trigger: "chat",
      email: typed.email,
      phone: typed.phone,
      messages: body.messages,
      path: body.path || req.headers.get("referer") || "",
    });
  }

  // Rate limit
  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit reached. Please write to George at /inquiry instead." }),
      { status: 429 }
    );
  }

  const apiKey = process.env.AI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL;
  const model = process.env.AI_MODEL;

  if (!apiKey || !baseUrl || !model) {
    return fallbackReply();
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  if (messages.length === 0) {
    return new Response(JSON.stringify({ error: "Empty messages" }), { status: 400 });
  }


  const fleet = await getFleetSnapshot();
  const fleetText = formatFleetForPrompt(fleet);
  const systemPrompt = `${SYSTEM_PROMPT_BASE}\n\nLIVE FLEET CATALOG (${fleet.length} yachts):\n${fleetText}\n\nWhen recommending, link the yacht using its slug like /yachts/genny.`;

  // Routes through lib/gemini-client which enforces the €10/month
  // cost cap (master kill-switch + per-provider monthly limit).
  // Never call the upstream model endpoint directly here.
  let upstream;
  try {
    const { geminiOpenAiStream } = await import("@/lib/gemini-client");
    upstream = await geminiOpenAiStream({
      model,
      apiKey,
      baseURL: baseUrl,
      temperature: 0.6,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-10).map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: (m.content || "").toString().slice(0, 2000),
        })),
      ],
    });
  } catch (e) {
    // Cap reached, AI features disabled, or network failure →
    // graceful fallback ("Ask George is warming up...").
    return fallbackReply();
  }

  if (!upstream.ok || !upstream.body) {
    return fallbackReply();
  }

  // Re-stream upstream SSE deltas in our simpler shape
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let assembled = "";
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
                assembled += delta;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
              }
            } catch {}
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      } finally {
        controller.close();
        // Fire-and-forget log
        logConversation(ip, messages, assembled).catch(() => {});
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
