// app/api/cabin/profile/route.js
// =============================================================
// GET  — current profile (filotimo_circle_members + cabin_members)
// PUT  — { display_name, date_of_birth, hometown, anniversary_date }
//
// Used by /cabin/welcome (first-login onboarding) and the
// Transparency Dashboard for self-editing. Every field is
// optional — we never block the user on capturing PII.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
  resolveMembership,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { writeAudit, AUDIT_ACTIONS } from "@/lib/cabin/audit";
import { notifyGeorge } from "@/lib/cabin/notify";

export const runtime = "nodejs";

function clean(s, max = 160) {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t.length > 0 ? t.slice(0, max) : null;
}

// ISO date YYYY-MM-DD only
function cleanDate(s) {
  if (typeof s !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s.trim()) ? s.trim() : null;
}

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });

  const db = getCabinDb();
  const [member, circle] = await Promise.all([
    dbQuery(
      db.from("cabin_members")
        .select("display_name, mobile")
        .ilike("email", session.email)
        .is("deleted_at", null)
        .limit(1)
        .maybeSingle()
    ),
    dbQuery(
      db.from("filotimo_circle_members")
        .select("display_name, date_of_birth, anniversary_date, hometown")
        .ilike("email", session.email)
        .is("deleted_at", null)
        .maybeSingle()
    ),
  ]);

  const profile = {
    email: session.email,
    display_name: member?.display_name ?? circle?.display_name ?? null,
    mobile: member?.mobile ?? null,
    date_of_birth: circle?.date_of_birth ?? null,
    anniversary_date: circle?.anniversary_date ?? null,
    hometown: circle?.hometown ?? null,
  };

  const complete = Boolean(
    profile.display_name && profile.date_of_birth && profile.hometown
  );

  return NextResponse.json({ ok: true, profile, complete });
}

export async function PUT(req) {
  const session = await readSessionFromCookies();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const cabinId = pickActiveCabinId(session);
  const member = cabinId ? resolveMembership(session, cabinId) : null;

  const body = await req.json().catch(() => null);
  const patch = {
    display_name: clean(body?.display_name, 120),
    mobile: clean(body?.mobile, 40),
    date_of_birth: cleanDate(body?.date_of_birth),
    anniversary_date: cleanDate(body?.anniversary_date),
    hometown: clean(body?.hometown, 120),
  };

  const db = getCabinDb();

  // Update cabin_members rows for the user across all their cabins
  // — name + mobile travel with the person across cabins.
  if (patch.display_name || patch.mobile) {
    const u = {};
    if (patch.display_name) u.display_name = patch.display_name;
    if (patch.mobile) u.mobile = patch.mobile;
    await dbQuery(
      db.from("cabin_members")
        .update(u)
        .ilike("email", session.email)
        .is("deleted_at", null)
    );
  }

  // 2026-09-02 — the welcome gate's DOB and mobile now ALSO feed
  // personal_details, which is what the crew list (port-authority
  // paperwork) reads. Before this, the welcome page collected a DOB
  // "for the marina paperwork", stored it only in the Filotimo
  // circle, and /cabin/me then presented an EMPTY crew-list line —
  // every guest typed their birth date twice and wondered why the
  // first one vanished. jsonb merge is read-modify-write per row
  // (a handful of rows per person at most).
  if (patch.date_of_birth || patch.mobile) {
    const rows = await dbQuery(
      db.from("cabin_members")
        .select("id, personal_details")
        .ilike("email", session.email)
        .is("deleted_at", null)
    );
    for (const row of rows ?? []) {
      const pd = { ...(row.personal_details ?? {}) };
      // The explicit crew-list form stays authoritative — only fill
      // gaps, never overwrite something the member already entered.
      if (patch.date_of_birth && !pd.date_of_birth) pd.date_of_birth = patch.date_of_birth;
      if (patch.mobile && !pd.mobile) pd.mobile = patch.mobile;
      await dbQuery(
        db.from("cabin_members").update({ personal_details: pd }).eq("id", row.id)
      );
    }
  }

  // Update filotimo_circle_members (person-scoped, one row per email)
  const circleUpdate = {};
  if (patch.display_name) circleUpdate.display_name = patch.display_name;
  if (patch.date_of_birth) circleUpdate.date_of_birth = patch.date_of_birth;
  if (patch.anniversary_date) circleUpdate.anniversary_date = patch.anniversary_date;
  if (patch.hometown) circleUpdate.hometown = patch.hometown;
  if (Object.keys(circleUpdate).length > 0) {
    // 2026-09-02 — was a bare .update(): a brand-new client (no
    // circle row yet) matched zero rows and their birthday vanished
    // without a trace. Check-then-insert keeps the person-scoped
    // one-row-per-email shape.
    const existingCircle = await dbQuery(
      db.from("filotimo_circle_members")
        .select("email")
        .ilike("email", session.email)
        .maybeSingle()
    );
    if (existingCircle) {
      await dbQuery(
        db.from("filotimo_circle_members")
          .update(circleUpdate)
          .ilike("email", session.email)
      );
    } else {
      await dbQuery(
        db.from("filotimo_circle_members").insert({
          email: session.email.toLowerCase(),
          ...circleUpdate,
        })
      );
    }
  }

  const filledFields = Object.keys(patch).filter((k) => patch[k]);

  await writeAudit({
    cabinId: cabinId ?? null,
    actorEmail: session.email,
    actorRole: member?.role ?? "charterer",
    action: AUDIT_ACTIONS.CONSENT_CHANGED,
    metadata: { kind: "profile_update", fields: filledFields },
  });

  // Notify George when someone (especially a newly-invited guest)
  // fills in personal details — so he can capture birthdays,
  // hometowns and names without asking again.
  //
  // 2026-06-01 — Brief 06 cabin-closeout (S1). This was `void notifyGeorge`
  // (fire-and-forget). On Vercel serverless the function is FROZEN the
  // instant the Response is sent, so this welcome-onboarding ping — the
  // DOB / hometown / mobile / anniversary George relies on for birthday
  // outreach — was silently dropped, with no error and no audit trail
  // (the exact failure mode as the brief-submit delivery bug). Now AWAIT
  // it, guard so a notify failure can NEVER fail the profile save, and
  // write a durable WELCOME_NOTIFICATION audit row with the per-channel
  // result so a silent miss is queryable.
  if (filledFields.length > 0) {
    let notifyResult = null;
    try {
      notifyResult = await notifyGeorge({
        icon: "👤",
        title: "Cabin profile updated",
        lines: [
          `From: ${patch.display_name || session.email}`,
          `Email: ${session.email}`,
          patch.date_of_birth ? `DOB: ${patch.date_of_birth}` : null,
          patch.hometown ? `Hometown: ${patch.hometown}` : null,
          patch.mobile ? `Mobile: ${patch.mobile}` : null,
          patch.anniversary_date ? `Anniversary: ${patch.anniversary_date}` : null,
        ],
        link: cabinId ? `/dashboard/cabins/${cabinId}` : "",
      });
    } catch (notifyErr) {
      console.error("[cabin/profile] notifyGeorge threw:", notifyErr);
      notifyResult = { ok: false, error: String(notifyErr?.message || notifyErr) };
    }
    // Durable observability — never let an audit hiccup fail the save.
    try {
      await writeAudit({
        cabinId: cabinId ?? null,
        actorEmail: session.email,
        actorRole: member?.role ?? "charterer",
        action: AUDIT_ACTIONS.WELCOME_NOTIFICATION,
        metadata: {
          ok: Boolean(notifyResult?.ok),
          channel: notifyResult?.channel ?? null,
          telegram: notifyResult?.telegram ?? null,
          email: notifyResult?.email ?? null,
          error: notifyResult?.error ?? null,
          fields: filledFields,
        },
      });
    } catch (auditErr) {
      console.error("[cabin/profile] welcome-notification audit failed:", auditErr);
    }
  }

  return NextResponse.json({ ok: true });
}
