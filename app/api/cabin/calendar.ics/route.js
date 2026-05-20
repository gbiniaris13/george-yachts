// app/api/cabin/calendar.ics/route.js
// =============================================================
// 2026-05-20 — Friend-test pass 4 (Tyler):
//   "An 'Add to calendar' .ics download. Trivial to ship."
//
// Generates an RFC-5545 .ics for the active cabin's charter
// window. Apple Calendar / Google Calendar / Outlook all parse
// it. No external service needed.
//
// The event is the full-week charter (DTSTART = embarkation,
// DTEND = disembarkation). Description carries George's WhatsApp
// + email so the user can reach us straight from their phone
// calendar.
// =============================================================

import { NextResponse } from "next/server";
import {
  readSessionFromCookies,
  pickActiveCabinId,
} from "@/lib/cabin/auth";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";

export const runtime = "nodejs";

function fmtDateIcs(iso) {
  // Whole-day events use VALUE=DATE with YYYYMMDD format.
  if (!iso) return "";
  return String(iso).replace(/-/g, "").slice(0, 8);
}

// Escape RFC-5545 special chars in TEXT values (\, ;, ,, newline).
function esc(s) {
  return String(s ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET() {
  const session = await readSessionFromCookies();
  if (!session) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const cabinId = pickActiveCabinId(session);
  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "no-cabin" }, { status: 400 });
  }

  const db = getCabinDb();
  const cabin = await dbQuery(
    db
      .from("cabins")
      .select("vessel_name, charter_period_from, charter_period_to, port_embarkation, port_disembarkation, principal_charterer_name")
      .eq("id", cabinId)
      .maybeSingle()
  );

  if (!cabin?.charter_period_from || !cabin?.charter_period_to) {
    return NextResponse.json({ ok: false, error: "no-dates" }, { status: 400 });
  }

  // DTEND is exclusive in RFC-5545 — bump the disembarkation by 1
  // so the calendar shows the disembarkation day inclusive.
  const dt = new Date(cabin.charter_period_to + "T00:00:00Z");
  dt.setUTCDate(dt.getUTCDate() + 1);
  const endIso = dt.toISOString().slice(0, 10);

  const vessel = esc(cabin.vessel_name || "Charter");
  const summary = `Charter aboard ${vessel}`;
  const description = [
    "Your private charter with George Yachts.",
    "",
    "George P. Biniaris — Managing Broker",
    "WhatsApp: +1 786 798 8798",
    "Email: george@georgeyachts.com",
    "",
    "Your private Cabin: https://georgeyachts.com/cabin",
  ].join("\\n");
  const location = esc([
    cabin.port_embarkation,
    cabin.port_disembarkation && cabin.port_disembarkation !== cabin.port_embarkation
      ? `→ ${cabin.port_disembarkation}`
      : null,
  ]
    .filter(Boolean)
    .join("  "));

  // Stable UID per cabin so re-downloads update the same event
  // instead of creating duplicates.
  const uid = `cabin-${cabinId}@georgeyachts.com`;
  const dtstamp =
    new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//George Yachts//The Cabin//EN",
    "METHOD:PUBLISH",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${fmtDateIcs(cabin.charter_period_from)}`,
    `DTEND;VALUE=DATE:${fmtDateIcs(endIso)}`,
    `SUMMARY:${esc(summary)}`,
    `DESCRIPTION:${description}`,
    location ? `LOCATION:${location}` : null,
    "TRANSP:OPAQUE",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P7D",
    "DESCRIPTION:One week to your charter.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return new NextResponse(lines, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="charter-${cabinId.slice(0, 8)}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
