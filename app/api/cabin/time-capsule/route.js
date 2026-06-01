// GET  — current capsule for active cabin + this user
// POST — seal a new capsule { message }; reveal_at = now + 6 months

import { NextResponse } from "next/server";
import { readSessionFromCookies, pickActiveCabinId, resolveMembership } from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { notifyGeorge } from "@/lib/cabin/notify";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });

  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_time_capsules")
      .select("*")
      .eq("cabin_id", cabinId)
      .ilike("author_email", session.email)
      .maybeSingle()
  );
  return NextResponse.json({ ok: true, capsule: row });
}

export async function POST(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) return NextResponse.json({ ok: false }, { status: 403 });
  const member = resolveMembership(session, cabinId);
  if (!member) return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message || message.length < 4) {
    return NextResponse.json({ ok: false, error: "message-too-short" }, { status: 400 });
  }

  const reveal = new Date();
  reveal.setMonth(reveal.getMonth() + 6);

  const db = getCabinDb();
  const row = await dbQuery(
    db.from("cabin_time_capsules")
      .upsert(
        {
          cabin_id: cabinId,
          author_email: session.email,
          message: message.slice(0, 4000),
          sealed_at: new Date().toISOString(),
          reveal_at: reveal.toISOString(),
        },
        { onConflict: "cabin_id,author_email" }
      )
      .select()
      .single()
  );

  await writeAudit({
    cabinId,
    actorEmail: session.email,
    actorRole: member.role,
    action: AUDIT_ACTIONS.TIME_CAPSULE_SEALED,
    metadata: { reveal_at: reveal.toISOString() },
  });

  // Notify George the moment a paragraph is sealed. We do NOT
  // include the message body — that's between the charterer and
  // their future self until the 6-month reveal job sends it back
  // to them. George sees only that a capsule exists.
  const cabin = await dbQuery(
    db.from("cabins")
      .select("vessel_name, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );
  // 2026-06-01 — Brief 06 cabin-closeout (S3). Was `void notifyGeorge`
  // (fire-and-forget) → dropped on Vercel serverless freeze. AWAIT it,
  // guarded so a notify failure can never fail the seal (the capsule
  // is already persisted above).
  try {
    await notifyGeorge({
      icon: "💌",
      title: "Time Capsule sealed",
      lines: [
        `From: ${cabin?.principal_charterer_name ?? session.email}`,
        `Re: ${cabin?.vessel_name ?? "—"}`,
        `Reveal date: ${reveal.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`,
      ],
      link: `/dashboard/cabins/${cabinId}`,
    });
  } catch (notifyErr) {
    console.error("[cabin/time-capsule] notifyGeorge threw:", notifyErr);
  }

  return NextResponse.json({ ok: true, capsule: row });
}
