import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { kvGet, kvSet } from "@/lib/kv";
import { upsertFormContact } from "@/lib/crmContact";

export const dynamic = "force-dynamic";

// 2026-08-23 — the rescue net. 123 people started the contact form
// in 12 weeks and only 21 sent it. When a visitor leaves the page
// with a name and a reachable email or phone already typed, the
// browser beacons whatever was filled here, once per session. George
// gets the unfinished brief on Telegram + email and the visitor
// becomes a CRM contact instead of a ghost. Never called on a
// completed submission.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function phoneDigits(v) {
  return (v || "").replace(/\D/g, "");
}

export async function POST(request) {
  const headers = { "Cache-Control": "no-cache, no-store, must-revalidate" };

  // Tighter than the main form: this fires from a beacon, not a click.
  const rl = checkRateLimit(request, { max: 3, windowMs: 60000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: true }, { status: 200, headers });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: true }, { status: 200, headers });
  }

  try {
    // Honeypot: bots that autofill the hidden field get a silent 200
    if (payload.website && payload.website.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    const name = (payload.name || "").trim().slice(0, 200);
    const email = (payload.email || "").trim().slice(0, 200);
    const phone = (payload.phone || "").trim().slice(0, 50);
    const validEmail = EMAIL_RE.test(email);
    const validPhone = phoneDigits(phone).length >= 7;

    // Only worth rescuing if George can actually reach them
    if (!validEmail && !validPhone) {
      return NextResponse.json({ ok: true }, { status: 200, headers });
    }

    // Dedupe for 24h per reachable identity, across tabs and repeat
    // visits, so George never gets the same half-brief twice.
    const identity = (validEmail ? email : phoneDigits(phone)).toLowerCase();
    const dedupeKey = `partial_brief:${identity}`;
    try {
      const seen = await kvGet(dedupeKey);
      if (seen) return NextResponse.json({ ok: true }, { status: 200, headers });
      await kvSet(dedupeKey, "1", 86400);
    } catch {}

    const fields = [
      name ? `Name: ${name}` : null,
      validEmail ? `Email: ${email}` : null,
      phone ? `Phone: ${phone}` : null,
      payload.country ? `Country: ${String(payload.country).slice(0, 100)}` : null,
      payload.yacht_type ? `Type: ${String(payload.yacht_type).slice(0, 100)}` : null,
      payload.guests ? `Guests: ${String(payload.guests).slice(0, 20)}` : null,
      payload.budget ? `Budget: ${String(payload.budget).slice(0, 100)}` : null,
      payload.check_in ? `Dates: ${String(payload.check_in).slice(0, 20)} -> ${String(payload.check_out || "?").slice(0, 20)}` : null,
      payload.timing && payload.timing !== "Exact dates" ? `When: ${String(payload.timing).slice(0, 40)}` : null,
      payload.message ? `Message: ${String(payload.message).slice(0, 2000)}` : null,
    ].filter(Boolean);

    // George's #2 also applies to rescued briefs: what they viewed
    // tells George how to open the conversation. Client-supplied,
    // so type-checked and clipped.
    const ctx = payload.visitor_context;
    if (ctx && typeof ctx === "object") {
      const seen = [
        ...new Set([
          ...(Array.isArray(ctx.yachts_this_visit) ? ctx.yachts_this_visit : []),
          ...(Array.isArray(ctx.yachts_history) ? ctx.yachts_history : []),
        ]),
      ].filter((v) => typeof v === "string").slice(0, 8).map((s) => s.slice(0, 60));
      if (seen.length) fields.push(`Viewed: ${seen.join(", ")}`);
      if (Number.isFinite(ctx.session_minutes) && ctx.session_minutes > 0 && ctx.session_minutes < 600) {
        fields.push(`${ctx.session_minutes} min on site`);
      }
    }

    const brief = fields.join("\n");

    const telegramText = [
      `✍️ *Unfinished brief rescued*`,
      `_Visitor left the contact form without sending. What they had typed:_`,
      ``,
      brief,
      ``,
      `_Reach out personally, they were mid-way to asking for a yacht._`,
    ].join("\n");

    const results = await Promise.allSettled([
      (async () => {
        const { telegramGeorgeFull } = await import("@/lib/notifyGeorge");
        await telegramGeorgeFull(telegramText);
      })(),
      (async () => {
        const { emailGeorge } = await import("@/lib/notifyGeorge");
        await emailGeorge({
          subject: `[Unfinished Brief] ${name || email || phone} started the form and left`,
          html: `
            <h3>Unfinished contact form brief</h3>
            <p>The visitor left the page without submitting. Everything they had typed:</p>
            <p style="white-space: pre-line;">${brief.replace(/</g, "&lt;")}</p>
            <p><em>They were mid-way to asking for a yacht. A personal note from George usually lands well here.</em></p>
          `,
          replyTo: validEmail ? email : undefined,
        });
      })(),
      upsertFormContact({
        name: name || (validEmail ? email.split("@")[0] : "Unknown"),
        email: validEmail ? email : null,
        phone: phone || null,
        country: payload.country ? String(payload.country).slice(0, 100) : null,
        source: "website_form_partial",
        description: `Unfinished contact form brief (rescued on page exit)\n${brief}`,
        metadata: { rescued: true },
      }),
    ]);
    void results;

    return NextResponse.json({ ok: true }, { status: 200, headers });
  } catch {
    // A rescue must never surface an error to the leaving visitor
    return NextResponse.json({ ok: true }, { status: 200, headers });
  }
}
