// Q.1 (Roberto brief, May 2026) — Smart Proposal Generator API.
//
// POST { name, email, dates, notes, yachtSlugs:[1..5] }
//   → renders a magazine-style PDF via @react-pdf/renderer
//   → emails the PDF to the user (with George BCC)
//   → fires a Telegram alert to George with the shortlist
//   → returns { ok, downloadUrl? } so the client can also offer a
//     direct download (data URL fallback if email send is blocked)
//
// PDF generation lives in `lib/pdf/proposal-template.jsx`. Yacht
// data is pulled fresh from Sanity on every request — proposals
// always reflect live pricing + insider tips.

import { sanityClient } from "@/lib/sanity";
import { sendTelegram } from "@/lib/telegram";
import { bumpKpi } from "@/lib/kpis";
import { kvIncr, kvExpire } from "@/lib/kv";

// 2026-05-12 — abuse protection. Without a rate limit, each
// proposal-generate call costs: 1 Sanity fetch + PDF render + 1
// Resend email send (depletes free-tier 100/day) + 1 Telegram
// notification + Gemini AI tokens (in template-llm path). Anyone
// could flood the endpoint to drain Boss's budget and burn the
// Resend daily quota so real proposals can't go out.
const RATE_LIMIT_PER_HOUR = 5;

async function checkProposalRateLimit(ip) {
  if (!process.env.KV_REST_API_URL) return true; // dev only
  const key = `proposal-generate:rate:${ip}:${new Date().toISOString().slice(0, 13)}`;
  try {
    const count = await kvIncr(key);
    if (count === 1) await kvExpire(key, 3700);
    return (count || 0) <= RATE_LIMIT_PER_HOUR;
  } catch {
    return true; // allow on KV error (defensive)
  }
}

const RESEND_API = "https://api.resend.com";
const RESEND_FROM =
  process.env.RESEND_FROM_ADDRESS ||
  "George Yachts <newsletter@georgeyachts.com>";
const RESEND_REPLY_TO = process.env.RESEND_REPLY_TO || "george@georgeyachts.com";

export const runtime = "nodejs";
export const maxDuration = 60;

async function fetchYachts(slugs) {
  if (!Array.isArray(slugs) || slugs.length === 0) return [];
  const query = `*[_type == "yacht" && slug.current in $slugs]{
    name, "slug": slug.current, subtitle, builder,
    length, sleeps, cabins, crew,
    cruisingRegion, fleetTier, priceModel,
    weeklyRatePrice, georgeInsiderTip,
    "image": images[0].asset->url
  }`;
  const data = await sanityClient.fetch(query, { slugs });
  // Reorder to match the user's requested order
  const map = new Map((data || []).map((y) => [y.slug, y]));
  return slugs.map((s) => map.get(s)).filter(Boolean);
}

async function renderPdfBuffer({ name, dates, notes, yachts }) {
  // Dynamic import keeps the pdf bundle out of any non-PDF route.
  const { renderToBuffer } = await import("@react-pdf/renderer");
  const ProposalDocument = (await import("@/lib/pdf/proposal-template.jsx"))
    .default;
  const buf = await renderToBuffer(
    ProposalDocument({ name, dates, notes, yachts })
  );
  return buf;
}

function fmtFile(name) {
  const safe = (name || "client")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  const stamp = new Date().toISOString().slice(0, 10);
  return `george-yachts-proposal-${safe}-${stamp}.pdf`;
}

export async function POST(req) {
  // 2026-05-12 — rate limit before doing any expensive work.
  // 5 proposals per IP per hour is generous for legit use (typical
  // visitor builds 1-2 shortlists) and stops abuse from draining
  // Resend free-tier + Gemini budget.
  const ip = (req.headers.get("x-forwarded-for") || "0.0.0.0").split(",")[0].trim();
  const allowed = await checkProposalRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { ok: false, error: "Too many proposals from this address. Try again in an hour, or write to George at /inquiry." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body?.name || "").toString().slice(0, 100).trim();
  const email = (body?.email || "").toString().slice(0, 200).trim();
  const dates = (body?.dates || "").toString().slice(0, 100).trim();
  const notes = (body?.notes || "").toString().slice(0, 1500).trim();
  const slugs = Array.isArray(body?.yachtSlugs)
    ? body.yachtSlugs.map((s) => String(s).slice(0, 80)).slice(0, 5)
    : [];

  if (!name || !email || !email.includes("@")) {
    return Response.json(
      { ok: false, error: "Missing or invalid name/email" },
      { status: 400 }
    );
  }
  if (slugs.length < 1) {
    return Response.json(
      { ok: false, error: "Pick at least one yacht" },
      { status: 400 }
    );
  }

  const yachts = await fetchYachts(slugs);
  if (yachts.length === 0) {
    return Response.json(
      { ok: false, error: "Could not load any of the requested yachts" },
      { status: 400 }
    );
  }

  let pdfBuffer;
  try {
    pdfBuffer = await renderPdfBuffer({ name, dates, notes, yachts });
  } catch (err) {
    console.error("[proposal-generate] PDF render failed", err);
    return Response.json(
      { ok: false, error: "PDF render failed. Please try again, or write to George at /inquiry." },
      { status: 500 }
    );
  }

  const filename = fmtFile(name);
  const sizeKb = Math.round((pdfBuffer.length || 0) / 1024);

  // Telegram to George — first, so even if the email send fails, George knows.
  try {
    const yachtList = yachts.map((y, i) => `  ${i + 1}. ${y.name} (/yachts/${y.slug})`).join("\n");
    const tg = `📄 *Smart Proposal generated*\n\n👤 ${name}\n📧 ${email}\n${dates ? `🗓 ${dates}\n` : ""}\n*Yachts (${yachts.length}):*\n${yachtList}\n${notes ? `\n*Notes:*\n${notes}\n` : ""}\n_PDF size: ${sizeKb} kB · sent to user (BCC george@)_`;
    await sendTelegram(tg);
  } catch {}

  // Email PDF to user with BCC to George — direct Resend call so we
  // can attach the PDF (the newsletter wrapper doesn't support
  // attachments). Falls back gracefully when RESEND_API_KEY is absent.
  let emailOk = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const html = `
<div style="font-family:'Lato','Montserrat',sans-serif;font-size:14px;line-height:1.7;color:#0D1B2A">
<p>Dear ${name.split(" ")[0] || "friend"},</p>
<p>Attached is your personalized George Yachts proposal — ${yachts.length} yacht${yachts.length === 1 ? "" : "s"} drawn from the live fleet, with George's insider note on each.</p>
<p style="background:#F8F5F0;padding:14px 16px;border-left:3px solid #C9A84C;font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;margin:18px 0">
${yachts.map((y) => y.name).join(" · ")}
</p>
<p>The numbers in the proposal are honest ranges. The exact figure for your dates lands in a written quote with availability — usually within the day.</p>
<p>If anything's urgent, the fastest channel is WhatsApp: <a href="https://wa.me/17867988798">+1 786 798 8798</a>. To book a 30-minute call: <a href="https://calendly.com/george-georgeyachts/30min">calendly.com/george-georgeyachts/30min</a>.</p>
<p style="margin-top:24px">— George<br/>
<span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#9CA3AF">George P. Biniaris · Managing Broker</span></p>
</div>`.trim();

      const res = await fetch(`${RESEND_API}/emails`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [email],
          bcc: ["george@georgeyachts.com"],
          reply_to: RESEND_REPLY_TO,
          subject: `Your George Yachts proposal — ${yachts.map((y) => y.name).join(", ").slice(0, 80)}`,
          html,
          attachments: [
            {
              filename,
              content: pdfBuffer.toString("base64"),
            },
          ],
          tags: [
            { name: "kind", value: "smart_proposal" },
            { name: "yachts", value: String(yachts.length) },
          ],
        }),
      });
      emailOk = res.ok;
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("[proposal-generate] resend non-2xx", res.status, errText);
      }
    } catch (err) {
      console.error("[proposal-generate] email failed", err);
    }
  }

  // N.3 — bump KPI counter (best-effort)
  bumpKpi("proposal_generated").catch(() => {});

  // Always return the PDF inline as a base64 data URL so the client
  // can offer immediate download even if the email is delayed.
  const dataUrl = `data:application/pdf;base64,${pdfBuffer.toString("base64")}`;
  return Response.json({
    ok: true,
    emailSent: emailOk,
    yachtCount: yachts.length,
    filename,
    dataUrl,
  });
}
