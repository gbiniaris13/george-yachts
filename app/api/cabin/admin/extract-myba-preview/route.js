// app/api/cabin/admin/extract-myba-preview/route.js
// =============================================================
// Admin endpoint — accepts a MYBA Charter Agreement PDF and
// returns the structured extraction JSON WITHOUT persisting
// anything. Used by /dashboard/cabins/new (extract-first creation
// flow): George drops the contract, this endpoint returns the
// parsed JSON, the CRM pre-fills the new-cabin form, George
// reviews + adds an email, then POSTs to /api/cabins to actually
// create the row.
//
// Why this is a separate endpoint from extract-brochure:
//   • extract-brochure requires a cabin_id (it persists into an
//     existing record). At the new-cabin flow we don't have a
//     cabin_id yet — chicken-and-egg.
//   • Keeping the two endpoints separate means we can never
//     accidentally write to the DB during a "preview" flow.
//
// Auth: x-cabin-admin-secret header (same as extract-brochure).
// Model: Gemini 2.5 Flash, free tier at George's volume.
// =============================================================

import { NextResponse } from "next/server";
import { geminiGenerateContent } from "@/lib/gemini-client";
import { CostCapExceeded, AiFeaturesDisabled } from "@/lib/cost-cap";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  const given = req.headers.get("x-cabin-admin-secret") || "";
  return given === expected;
}

// 2026-05-21 — Same VERBATIM_MANDATE as extract-brochure/route.js.
// Deliberately duplicated rather than imported — Roberto's brief
// is "DO NOT BREAK ANYTHING THAT ALREADY WORKS", and a refactor
// of the live extract-brochure prompts at the same time as
// shipping a brand-new endpoint multiplies the failure modes.
// If/when both endpoints need the same prompt long-term, lift
// to lib/cabin/extraction-prompts.js in a later, single-purpose
// commit.
const VERBATIM_MANDATE = `VERBATIM MANDATE — read this before anything else:
1. Reproduce text EXACTLY as the source PDF shows it. No rewording,
   no paraphrasing, no normalisation of casing or punctuation, no
   smart-quoting, no spacing "improvements".
2. Do NOT infer. If the PDF says "over 6 years" → output the string
   "over 6 years", not the number 6. If a field is not present,
   output null. Never fill in plausible defaults.
3. Do NOT summarise. If a list is short, take it verbatim. If a
   list is long, take ALL of it verbatim. Never cherry-pick.
4. Do NOT strip. Honorifics (Mr / Ms / Mrs / Dr), middle names,
   accreditations after a name, parenthetical asides, dates,
   degrees, brand names — all preserved as written.
5. Units: when a measurement carries a unit ("51 ft", "27 m",
   "8.1 m beam"), keep the unit AS WRITTEN in the same string. Do
   NOT convert. Do NOT split. Do NOT drop.
6. Example values in the JSON schema below are ILLUSTRATIVE ONLY.
   They show the data type, not the literal value to output.
   Extract whatever the actual PDF contains.
7. Output ONLY the JSON. No markdown fences, no commentary, no
   preamble.`;

const CONTRACT_PROMPT = `${VERBATIM_MANDATE}

You are extracting structured data from a signed MYBA Charter
Agreement (the standard contract used across the worldwide yacht-
charter industry, published by MYBA). Page One contains the
"Charter Particulars" block — that's where most fields live.
Subsequent pages are the standard clauses; skip them unless an
addendum modifies the headline particulars.

Output strict JSON with this exact shape — and obey the safe /
internal split (safe = data the charterer may see; internal =
operator-only fields the client must never see). Every example
value is illustrative — extract whatever the actual contract says.

{
  "safe": {
    "vessel_name": "<verbatim, e.g. 'EFFIE STAR'>",
    "vessel_make_model": "<verbatim Type field, e.g. 'Lagoon 51'>",
    "vessel_type": "<verbatim if separately stated (Sailing Catamaran, Motor Yacht); null otherwise>",
    "vessel_length": "<verbatim Length string WITH unit: '51 ft', '15.6 m', or whatever the contract writes — do NOT split into ft and m fields, do NOT convert>",
    "homeport": "<verbatim Port of Registry, e.g. 'Piraeus'>",
    "flag": "<verbatim Flag field, e.g. 'Greek'>",
    "max_guests_sleeping": "<integer if explicit (parsed from 'Maximum number of guests sleeping (10)')>",
    "max_guests_cruising": "<integer if explicit>",
    "crew_summary": "<verbatim, e.g. 'Captain +1', 'Captain and 2 crew'>",
    "charter_period_from": "<ISO YYYY-MM-DD parsed from the From row's date>",
    "charter_period_to": "<ISO YYYY-MM-DD parsed from the To row's date>",
    "port_embarkation": "<verbatim Place of Delivery>",
    "port_disembarkation": "<verbatim Place of Re-Delivery>",
    "cruising_area": "<verbatim Cruising area string, even if it reads as legalese ('Greek & International Waters')>",
    "principal_charterer_name": "<verbatim Charterer row, INCLUDING any honorific (Ms / Mrs / Mr / Dr) the contract carries — e.g. 'Ms. Tricia Stevens', NOT 'Tricia Stevens'>",
    "principal_charterer_address": "<verbatim address from the CHARTERER ADDRESS row, one string>"
  },
  "internal": {
    "contract_number": "<verbatim, e.g. '001019092602063480-02'>",
    "contract_date": "<ISO YYYY-MM-DD parsed from 'This Date'>",
    "contract_place": "<verbatim 'and Place' field>",
    "owner_name": "<verbatim OWNER row>",
    "owner_address": "<verbatim OWNER ADDRESS row>",
    "stakeholder_name": "<verbatim STAKEHOLDER row if present>",
    "stakeholder_address": "<verbatim>",
    "stakeholder_myba_id": "<verbatim MYBA ID under STAKEHOLDER if present>",
    "broker_name_on_contract": "<verbatim BROKER row>",
    "broker_address_on_contract": "<verbatim BROKER ADDRESS row>",
    "charter_fee_eur": "<numeric value, no symbol/thousands. €20,856 → 20856>",
    "vat_provision_eur": "<numeric>",
    "apa_eur": "<numeric>",
    "security_deposit_eur": "<numeric or null>",
    "delivery_redelivery_fees_eur": "<numeric or null>",
    "payment_schedule": [
      {
        "instalment": "first",
        "amount_eur": "<numeric>",
        "due_date": "<ISO YYYY-MM-DD>",
        "label": "<verbatim short phrase the contract uses, e.g. '50% of charter fee'>"
      }
    ],
    "bank_account": {
      "bank_name": "<verbatim>",
      "branch_address": "<verbatim>",
      "swift_bic": "<verbatim>",
      "iban": "<verbatim>",
      "beneficiary": "<verbatim>"
    },
    "special_conditions_summary": "<verbatim clauses ONLY if Page Two materially alters standard MYBA terms; null otherwise>"
  }
}

Rules:
• Dates → ISO 8601 (YYYY-MM-DD). MYBA dates appear as "27 June 2026" — convert format only. Hours ("12:00") are discarded.
• Currency amounts → numeric value (drop "€", drop thousand separators). "€20,856" → 20856. "€2,502.72" → 2502.72. "n/a" or blank → null.
• Honorifics on charterer name → KEEP. The contract is the legal document; "Ms. Tricia Stevens" is how the agreement identifies her, and that's what we preserve.
• Names, addresses, banking details → verbatim, no normalisation.
• Unknown / missing fields → null (NEVER empty strings or zero).`;

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
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "no-file" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "must-be-pdf" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "pdf-too-large-10mb-max" }, { status: 413 });
  }

  // PDF → base64
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
      systemInstruction: { parts: [{ text: CONTRACT_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "application/pdf", data: base64 } },
            { text: "Extract the MYBA contract data as strict JSON per the schema. Output JSON only — no markdown fences, no commentary." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const text = (result?.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p?.text ?? "")
      .join("\n")
      .trim();

    // Strip optional ```json fences just in case Gemini ignored
    // the responseMimeType hint and added markdown.
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
    console.error("[extract-myba-preview]", err);
    return NextResponse.json(
      {
        ok: false,
        error: "extraction-failed",
        message: String(err?.message || err).slice(0, 200),
      },
      { status: 502 },
    );
  }

  // 2026-05-21 — Defensive: if Gemini returned something other than
  // the expected { safe, internal } shape, surface that to the
  // caller so the CRM can display a helpful error rather than
  // silently pre-filling an empty form.
  if (
    !extracted ||
    typeof extracted !== "object" ||
    !extracted.safe ||
    typeof extracted.safe !== "object"
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "unexpected-extraction-shape",
        raw: extracted,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    extracted,
  });
}
