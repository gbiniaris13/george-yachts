// app/api/cabin/admin/extract-passport/route.js
// =============================================================
// Admin endpoint — accepts a passport scan/image PDF + a cabin_id
// and writes the principal charterer's identity row in
// cabin_guests_manifest. Also patches cabins.principal_charterer_name
// with the signature-form name from the passport (so the cabin's
// display reads "Patricia R. Stevens" rather than the MYBA's
// "Ms. Tricia Stevens"), and auto-enrols / refreshes the principal
// in filotimo_circle_members with date_of_birth so the birthday
// cron has something to fire on.
//
// Privacy boundary, per George's brief:
//   • cabin (client view) shows ONLY the signature display name —
//     "Patricia R. Stevens"
//   • back office (this manifest table, the preference sheet PDF,
//     the crew list for port authorities) keeps the FULL passport
//     bundle: full legal name, DOB, passport number, expiry,
//     nationality. These never reach a /cabin/* page.
//
// Auth: x-cabin-admin-secret header.
// Model: Gemini 2.5 Flash, free tier.
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { geminiGenerateContent } from "@/lib/gemini-client";
import { CostCapExceeded, AiFeaturesDisabled } from "@/lib/cost-cap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// 2026-05-21 — Vercel's serverless body cap (~4.5 MB) is the real
// gate; our own check is a defensive backstop. Compressed passports
// land well under 4 MB by design.
const MAX_BYTES = 8 * 1024 * 1024;

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  const given = req.headers.get("x-cabin-admin-secret") || "";
  return given === expected;
}

// Same VERBATIM_MANDATE block as the other extraction endpoints.
const VERBATIM_MANDATE = `VERBATIM MANDATE — read this before anything else:
1. Reproduce text EXACTLY as the source PDF shows it. No rewording,
   no paraphrasing, no normalisation of casing or punctuation, no
   smart-quoting, no spacing "improvements".
2. Do NOT infer. If a field is not present, output null. Never fill
   in plausible defaults.
3. Do NOT summarise.
4. Do NOT strip middle names, honorifics, or accreditations.
5. Example values in the JSON schema below are ILLUSTRATIVE ONLY.
   Extract whatever the actual passport contains.
6. Output ONLY the JSON. No markdown fences, no commentary, no
   preamble.`;

const PASSPORT_PROMPT = `${VERBATIM_MANDATE}

You are extracting bio-page data from a passport. Most fields can
be read from the visual bio panel (the right side of the page).
Cross-reference against the Machine Readable Zone (MRZ — the two
lines of "<<<" characters at the bottom of the page) when a visual
field is unclear; MRZ wins for canonical names.

Output strict JSON with this exact shape:

{
  "issuing_country": "<verbatim 'Country' field, e.g. 'United States of America'>",
  "passport_type": "<verbatim type code, usually 'P'>",
  "passport_number": "<verbatim Passport No.>",
  "surname": "<verbatim Surname / Family Name field. From MRZ if visual is unclear.>",
  "given_names": "<verbatim Given Names field — may contain a middle name>",
  "full_name": "<surname + ', ' + given_names in the case the passport prints them in. E.g. 'STEVENS, PATRICIA RHODES'. Verbatim from the MRZ when unclear.>",
  "signature_display_name": "<the SIGNATURE form, i.e. how the holder signs on the 'Signature of bearer' line, e.g. 'Patricia R. Stevens'. If illegible, fall back to '<First-given-name> <surname>' in Title Case (e.g. 'Patricia Stevens'). Never all caps.>",
  "nationality": "<verbatim Nationality field>",
  "date_of_birth": "<ISO YYYY-MM-DD parsed from the Date of Birth field>",
  "sex": "<verbatim — 'M' / 'F' / 'X' as printed>",
  "place_of_birth": "<verbatim Place of Birth field>",
  "date_of_issue": "<ISO YYYY-MM-DD>",
  "date_of_expiration": "<ISO YYYY-MM-DD>",
  "issuing_authority": "<verbatim Authority field, e.g. 'United States Department of State'>",
  "mrz_line_1": "<verbatim first MRZ line, with '<' characters intact>",
  "mrz_line_2": "<verbatim second MRZ line, with '<' characters intact>"
}

Rules:
• Dates are formatted in many ways on passports ('02 Oct 1968', '02OCT1968', '02/10/1968', etc.). Output ISO 8601 (YYYY-MM-DD) regardless of source format. If a date is partially unreadable, output null for that field — never guess.
• MRZ is the source of truth when visual and MRZ disagree.
• "signature_display_name" is the ONE field that needs minimal grooming: render in Title Case based on the holder's actual signature; this is the only string the customer-facing /cabin will display.
• Honorifics are NOT shown on passports. Do not invent one.
• Unknown / unreadable fields → null. Never empty strings, never placeholder text like "UNKNOWN".`;

export async function POST(req) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-multipart" }, { status: 400 });
  }

  const file = form.get("file");
  const cabinId = String(form.get("cabin_id") || "").trim();
  // Optional: which manifest row to populate. Defaults to
  // guest_order=1 (the principal). Future: accept guest_order=N
  // when George uploads a non-principal guest's passport.
  const guestOrder = Number(form.get("guest_order") || 1) || 1;

  if (!cabinId) {
    return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });
  }
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "no-file" }, { status: 400 });
  }
  if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "must-be-pdf-or-image" },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "file-too-large-10mb-max" },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const CHUNK = 32 * 1024;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  const base64 = Buffer.from(binary, "binary").toString("base64");

  let extracted;
  try {
    const result = await geminiGenerateContent({
      model: "gemini-2.5-flash",
      estimatedCostCents: 0,
      systemInstruction: { parts: [{ text: PASSPORT_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: file.type, data: base64 } },
            { text: "Extract the passport bio-page data as strict JSON per the schema. Output JSON only — no markdown fences, no commentary." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const text = (result?.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p?.text ?? "")
      .join("\n")
      .trim();

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    extracted = JSON.parse(cleaned);
  } catch (err) {
    if (err instanceof CostCapExceeded || err instanceof AiFeaturesDisabled) {
      return NextResponse.json(
        { ok: false, error: "ai-cap-or-disabled", message: err.message },
        { status: 503 },
      );
    }
    console.error("[extract-passport]", err);
    return NextResponse.json(
      {
        ok: false,
        error: "extraction-failed",
        message: String(err?.message || err).slice(0, 200),
      },
      { status: 502 },
    );
  }

  if (!extracted || typeof extracted !== "object") {
    return NextResponse.json(
      { ok: false, error: "unexpected-extraction-shape" },
      { status: 502 },
    );
  }

  // ---------------------------------------------------------------
  // Persist.
  // ---------------------------------------------------------------
  const db = getCabinDb();

  // Read the existing cabin row (we need the principal email for
  // the Filotimo Circle upsert + for honouring the existing
  // schema's constraint that the manifest belongs to this cabin).
  const cabin = await dbQuery(
    db.from("cabins")
      .select("id, principal_charterer_email, principal_charterer_name, contract_internal")
      .eq("id", cabinId)
      .maybeSingle()
  );
  if (!cabin) {
    return NextResponse.json(
      { ok: false, error: "cabin-not-found" },
      { status: 404 },
    );
  }

  // 1) Upsert the manifest row.
  // We treat (cabin_id, guest_order) as the lookup key. If a row
  // exists at this slot, update it; otherwise insert a new one.
  // Only the columns the schema actually has are persisted —
  // place_of_birth / sex / issuing_authority / MRZ go into the
  // response so the back-office UI can show them, but they are NOT
  // written to the DB yet (schema doesn't carry them; would require
  // a migration we're deferring).
  const dob = typeof extracted.date_of_birth === "string"
    ? extracted.date_of_birth
    : null;
  const expiry = typeof extracted.date_of_expiration === "string"
    ? extracted.date_of_expiration
    : null;
  const passportNumber = typeof extracted.passport_number === "string"
    ? extracted.passport_number
    : null;
  const nationality = typeof extracted.nationality === "string"
    ? extracted.nationality
    : null;
  const fullName = typeof extracted.full_name === "string"
    ? extracted.full_name
    : (typeof extracted.surname === "string" &&
       typeof extracted.given_names === "string"
        ? `${extracted.surname}, ${extracted.given_names}`
        : null);

  // is_minor: only set when DOB is present AND the charter start
  // falls before the 18th birthday. For now compute against TODAY
  // (good enough — a 17-year-old today is still a minor on a
  // charter happening next month). Refine if needed.
  let isMinor = null;
  if (dob) {
    const dobMs = Date.parse(dob);
    if (!Number.isNaN(dobMs)) {
      const years = (Date.now() - dobMs) / (365.25 * 24 * 3600 * 1000);
      isMinor = years < 18;
    }
  }

  const existing = await dbQuery(
    db.from("cabin_guests_manifest")
      .select("id")
      .eq("cabin_id", cabinId)
      .eq("guest_order", guestOrder)
      .maybeSingle()
  );

  const manifestPatch = {
    cabin_id: cabinId,
    guest_order: guestOrder,
    full_name: fullName,
    date_of_birth: dob,
    nationality,
    passport_number: passportNumber,
    passport_expiry: expiry,
    is_minor: isMinor,
    // Don't touch email / mobile / cabin_pairing / shoe_size /
    // allergies — those are guest-self-entered (or operator-typed)
    // and not in the passport.
  };

  let manifestRowId;
  if (existing?.id) {
    await dbQuery(
      db.from("cabin_guests_manifest")
        .update(manifestPatch)
        .eq("id", existing.id)
    );
    manifestRowId = existing.id;
  } else {
    const inserted = await dbQuery(
      db.from("cabin_guests_manifest")
        .insert(manifestPatch)
        .select("id")
        .single()
    );
    manifestRowId = inserted?.id;
  }

  // 2) Patch cabins.principal_charterer_name with the signature
  //    display name (only when this is the principal — guest_order=1).
  //    Preserve the MYBA-style name (with honorific) under
  //    contract_internal so back-office surfaces can still cite it.
  let displayNameApplied = null;
  if (guestOrder === 1 &&
      typeof extracted.signature_display_name === "string" &&
      extracted.signature_display_name.trim().length > 0) {
    const sig = extracted.signature_display_name.trim();
    const prevName = cabin.principal_charterer_name;
    const prevInternal = cabin.contract_internal && typeof cabin.contract_internal === "object"
      ? cabin.contract_internal
      : {};
    const nextInternal = {
      ...prevInternal,
      // Keep the MYBA wording (e.g. "Ms. Tricia Stevens") archived
      // here for marina paperwork and legal continuity. Only set on
      // first passport extraction; never overwritten thereafter.
      principal_charterer_name_on_contract:
        prevInternal.principal_charterer_name_on_contract || prevName || null,
    };
    await dbQuery(
      db.from("cabins")
        .update({
          principal_charterer_name: sig,
          contract_internal: nextInternal,
        })
        .eq("id", cabinId)
    );

    // 2026-05-21 — Patch cabin_members.display_name too.
    //
    // cabins.principal_charterer_name is read by the back-office
    // (preference sheet, crew list, "Charter at a Glance" block on
    // the customer home page). But the in-cabin header chip and the
    // "Welcome, <firstName>." greeting both read from
    // cabin_members.display_name — which was set at cabin creation
    // from the MYBA-derived name ("Ms. Tricia Stevens"). Without
    // this patch the cabin showed "Welcome, Ms.." (first space-
    // tokenised word of the MYBA string) even after the passport
    // had landed and the cabin's own name field flipped to
    // "Patricia R. Stevens". One row → no churn risk.
    await dbQuery(
      db.from("cabin_members")
        .update({ display_name: sig })
        .eq("cabin_id", cabinId)
        .eq("role", "principal_charterer")
    );
    displayNameApplied = sig;
  }

  // 3) Filotimo Circle: enrol / refresh the principal with DOB so
  //    the birthday cron has something to fire on. Only attempt
  //    when this is the principal AND we have both an email and a
  //    DOB.
  let filotimoApplied = null;
  if (guestOrder === 1 &&
      typeof cabin.principal_charterer_email === "string" &&
      cabin.principal_charterer_email.trim().length > 0 &&
      dob) {
    const email = cabin.principal_charterer_email.trim().toLowerCase();
    const existingCircle = await dbQuery(
      db.from("filotimo_circle_members")
        .select("id, date_of_birth")
        .ilike("email", email)
        .is("deleted_at", null)
        .maybeSingle()
    );
    if (existingCircle?.id) {
      // Only update DOB if it wasn't set or differs (don't churn).
      if (existingCircle.date_of_birth !== dob) {
        await dbQuery(
          db.from("filotimo_circle_members")
            .update({ date_of_birth: dob })
            .eq("id", existingCircle.id)
        );
        filotimoApplied = "updated";
      } else {
        filotimoApplied = "unchanged";
      }
    } else {
      await dbQuery(
        db.from("filotimo_circle_members")
          .insert({
            email,
            date_of_birth: dob,
            joined_at: new Date().toISOString(),
            voyages_count: 0,
            tier: "friend",
          })
      );
      filotimoApplied = "inserted";
    }
  }

  return NextResponse.json({
    ok: true,
    cabin_id: cabinId,
    manifest_row_id: manifestRowId,
    guest_order: guestOrder,
    display_name_applied: displayNameApplied,
    filotimo_applied: filotimoApplied,
    // Echo back the full extraction so the CRM UI can render the
    // back-office detail panel (place_of_birth, sex, issuing
    // authority, MRZ) even though those don't have DB columns yet.
    extracted,
  });
}
