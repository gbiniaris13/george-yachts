// app/api/cabin/admin/extract-brochure/route.js
// =============================================================
// Admin endpoint — accepts a PDF + a "kind" (crew | menu | vessel)
// and asks Claude Haiku to extract structured JSON for the
// matching cabin field. Persists the result to the cabin record.
//
// Auth: x-cabin-admin-secret header.
// Cap:  Routes through anthropic-client → cost-cap (€10/mo).
// =============================================================

import { NextResponse } from "next/server";
import { getCabinDb, dbQuery } from "@/lib/cabin/supabase";
import { geminiGenerateContent } from "@/lib/gemini-client";
import { CostCapExceeded, AiFeaturesDisabled } from "@/lib/cost-cap";

// Why Gemini instead of Anthropic here:
// • Gemini 2.5 Flash has a 1500 req/day FREE tier — at George's
//   volume (≤30 cabins/month, ≤90 PDFs/month) we never pay.
// • Already wired in Vercel env (AI_API_KEY) so no new setup.
// • Same PDF-as-base64 input pattern, same JSON-out behaviour.
// • Still goes through cost-cap (€10/month) as defence-in-depth.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Allow up to ~30s for the Claude call on big PDFs (Vercel hobby
// caps at 10s for Edge; we explicitly use nodejs which gets 60s).
export const maxDuration = 60;

// 2026-05-20 — Added "contract" kind for MYBA charter agreement
// auto-extraction. See SYSTEM_PROMPTS.contract below for the
// safe/internal split. The internal half is stored in cabins
// .contract_internal JSONB and never exposed to charterer-facing
// surfaces — George's principle: clients are unaware of
// central-agent or owner identity, by design.
const ALLOWED_KINDS = new Set(["crew", "menu", "vessel", "contract"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB per PDF

function authorized(req) {
  const expected = process.env.CABIN_ADMIN_SECRET;
  if (!expected) return false;
  const given = req.headers.get("x-cabin-admin-secret") || "";
  return given === expected;
}

// =============================================================
// Per-kind extraction prompts. Each returns a JSON object the
// client-facing page knows how to render. We tell Claude to be
// strict about the schema; missing fields → null/empty.
// =============================================================

// 2026-05-21 — Roberto's brief (v1) reframes the entire extraction
// philosophy. The previous prompts asked the LLM to:
//   • capitalise menu dishes to Title Case (normalisation)
//   • default crew "languages" to ["English"] if not stated (inference)
//   • parse "over 6 years" as integer 6 (inference)
//   • summarise certifications into a 1-5 item "highlights" list
//   • split vessel length into ft + m fields (potential conversion)
//   • strip honorifics from charterer names
// All of these silently mutate owner-supplied text. The brief is
// explicit: "Auto-fill from PDF […] must output text that matches
// the source document. […] No conversion, no inference, no
// stripping."
//
// Each prompt below now opens with a VERBATIM MANDATE that
// constrains the LLM to faithful reproduction. Examples in the
// JSON schema are marked as illustrative only (the LLM was
// previously memorising example values like "Thanos" / "EFFIE STAR"
// and biasing toward them). Numeric inference fields are dropped
// or converted to verbatim-string equivalents. Unit-bearing
// measurements are captured as single verbatim strings ("51 ft",
// "27 m") instead of two-field splits that risk conversion.
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

const SYSTEM_PROMPTS = {
  crew: `${VERBATIM_MANDATE}

You are extracting CREW PROFILES from a charter-yacht crew booklet.
Output strict JSON with this exact shape:
{
  "members": [
    {
      "first_name": "<the crew member's first name as the booklet writes it>",
      "last_name": "<the surname as the booklet writes it; null if not stated>",
      "role": "<verbatim title before the name, e.g. 'Captain', 'Cook/ Hostess', 'Chief Stewardess'>",
      "secondary_role": "<null unless the booklet's title explicitly carries a slash- or 'and'-joined dual role. If 'Cook/ Hostess', set role:'Cook' and secondary_role:'Hostess'.>",
      "languages": ["<each language explicitly named in this person's bio>"],
      "years_experience_phrase": "<verbatim phrase if the bio says something like 'over 6 years of experience' or '15 years at sea'; null otherwise. Do NOT convert to a number.>",
      "credentials_verbatim": "<the exact prose sentence that lists this person's certifications, diplomas, licences. Preserve as a single string. null if the bio does not contain such a sentence.>",
      "bio": "<full multi-paragraph bio in original prose, verbatim, with \\n\\n between paragraphs. Do NOT modify a single word, including the surname, year of birth, degrees, or any phrase you might find unflattering or off-tone — those decisions are downstream.>"
    }
  ]
}

Rules:
• "first_name" / "last_name" — take from the title line of each crew member's section (e.g. "Captain Thanos Karagiozis" → first:"Thanos", last:"Karagiozis"). If the booklet only gives a first name, last:null.
• "languages" — extract languages ONLY when explicitly stated in the bio (e.g. "Fluent in Greek and English"). Output the verbatim language names. If no languages are explicitly stated, output null (NOT a default of English).
• "years_experience_phrase" — capture the exact wording the bio uses about experience. Do not invent or interpret.
• "credentials_verbatim" — find the sentence (if any) that lists certifications/diplomas. Copy it whole. If multiple sentences mention credentials, concatenate them with a space. If none, null.
• "bio" — the WHOLE bio of this crew member, verbatim, including the title line if it's part of the page's prose flow.
• Skip the photo. Photos are handled separately.`,

  menu: `${VERBATIM_MANDATE}

You are extracting a SAMPLE MENU from a charter-yacht menu booklet.
Output strict JSON with this exact shape:
{
  "title": "<the booklet's title line verbatim, including its actual case (UPPER/Title/lower as printed)>",
  "tagline": "<a single-line standfirst directly under the title, if present; null otherwise>",
  "sections": [
    {
      "name": "<section heading verbatim, including its actual case ('BREAKFAST', 'Appetizers/Snacks', 'main courses' — whatever the source uses)>",
      "dishes": ["<each dish in this section, one per array entry, VERBATIM — same casing, same spelling, same punctuation, same brand names. If the source writes 'Nutella' use 'Nutella'. If it writes 'Tuna Mango Ceviche' use 'Tuna Mango Ceviche'. Never convert to Title Case or sentence case or any other case.>"]
    }
  ]
}

Rules:
• Preserve section order from the booklet — first section first, last section last.
• Preserve dish order within each section.
• Preserve casing for ALL strings (title, tagline, section names, dish names). The booklet's design decision is the truth.
• If the booklet groups dishes by day instead of by meal, render each day as a section.
• "tagline" — only set if the booklet has a one-line standfirst under the title; else null. Never invent one.
• Brand names ("Nutella", "Heinz", "Coca-Cola") — keep them. Do not generic-ize.`,

  vessel: `${VERBATIM_MANDATE}

You are extracting a VESSEL BROCHURE for a charter yacht.

Output strict JSON with this exact shape (every example value is illustrative — extract the actual content of THIS PDF):
{
  "vessel_name": "<yacht name from the cover or intro page, verbatim>",
  "type_line": "<verbatim type descriptor, e.g. 'Sailing Catamaran', 'Motor Yacht'>",
  "builder_model": "<verbatim builder + model phrase, e.g. 'Lagoon 51'>",
  "year_built": "<verbatim string the brochure uses — '2024', 'Built 2024', 'Year built: 2024' — keep what's there; null if absent>",
  "summary": "<paste the intro / 'THE YACHT' paragraph verbatim, every word preserved>",
  "key_features": ["<each bullet of the brochure's KEY FEATURES section, verbatim, one per array entry. If the section is absent, null (not an empty array).>"],
  "specifications": {
    "length": "<verbatim string with whatever unit the brochure uses: '51 ft' or '15.6 m' or '51 ft / 15.6 m'. Do NOT convert or split.>",
    "beam": "<verbatim same as length: keep the unit>",
    "draft": "<verbatim same as length: keep the unit>",
    "main_engines": "<verbatim engine description>",
    "generator": "<verbatim>",
    "cruising_speed": "<verbatim with unit, e.g. '8 knots'>",
    "fuel_consumption": "<verbatim with unit, e.g. '25 lt/hr'>"
  },
  "accommodation": {
    "guests": "<verbatim text or number from the brochure (e.g. 'up to 10 guests', '10', '8 sleeping / 10 cruising')>",
    "cabins_summary": "<verbatim cabin layout sentence>",
    "crew_count": "<verbatim string or integer as written>",
    "crew_summary": "<verbatim crew layout sentence>"
  },
  "amenities": ["<each amenity from the GENERAL AMENITIES list, verbatim, one per array entry; null if absent>"],
  "tender": {
    "make_model": "<verbatim make/model>",
    "length": "<verbatim with unit>",
    "engine": "<verbatim>",
    "notes": "<verbatim>"
  },
  "water_toys": ["<each toy / equipment item from the TENDER & TOYS or WATER TOYS list, verbatim. Exclude the tender itself (which goes in the tender object). null if no such list exists.>"],
  "areas": ["<list of section/area names the brochure walks through, verbatim (e.g. 'Aft Deck', 'Saloon & Dining Area'); null if the brochure isn't structured that way>"]
}

Rules:
• "summary" — preserve every word, every paragraph break, every quirk of punctuation.
• Lists — never invent items. If a list is absent, output null. Never use an empty array as a placeholder.
• When a unit ("ft", "m", "knots", "lt/hr") is present in the brochure, KEEP IT inside the value string.`,

  // 2026-05-20 — Friend-test pass 4 +:
  // MYBA Charter Agreement extraction. The contract carries the
  // single source of truth for vessel + charter logistics —
  // George wants the cabin to read directly from it after signing.
  //
  // CRITICAL: output is split into "safe" (fields safe to surface
  // to the charterer) and "internal" (operator-only fields the
  // client must never see). The persistence layer writes the
  // INTERNAL half to a dedicated JSONB column that no /cabin/*
  // page selects.
  contract: `${VERBATIM_MANDATE}

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
    "contract_number": "001019092602063480-02",
    "contract_date": "2026-02-06",
    "contract_place": "Alimos, Athens",
    "owner_name": "STAR YACHTS MCPY",
    "owner_address": "43-45 Mousson Str., 17562, Athens, Greece",
    "stakeholder_name": "Istion Yachting S.A.",
    "stakeholder_address": "1 Posidonos Avenue & Goumi Street Alimos, Athens 17455 Greece",
    "stakeholder_myba_id": "ISTIGR",
    "broker_name_on_contract": "ELENI IOANNA KARVOUNI",
    "broker_address_on_contract": "Leoforos Iraklejou 189, Nea Ionia",
    "charter_fee_eur": 20856,
    "vat_provision_eur": 2502.72,
    "apa_eur": 5200,
    "security_deposit_eur": null,
    "delivery_redelivery_fees_eur": null,
    "payment_schedule": [
      { "instalment": "first", "amount_eur": 10428, "due_date": "2026-02-13", "label": "50% of charter fee" },
      { "instalment": "second", "amount_eur": 18130.72, "due_date": "2026-05-27", "label": "Rest 50% + VAT 12% + APA" }
    ],
    "bank_account": {
      "bank_name": "EUROBANK",
      "branch_address": "2A Atlantos Str. & Posidonos Ave., Paleo Faliro Athens, GREECE",
      "swift_bic": "ERBKGRAA",
      "iban": "GR8502600350000120200909374",
      "beneficiary": "ISTION YACHTING S.A."
    },
    "special_conditions_summary": null
  }
}

Rules:
• Dates: output ISO 8601 (YYYY-MM-DD). MYBA dates appear as "27
  June 2026" — convert to date string only. The hour ("12:00") is
  discarded because the cabin tracks day granularity.
• Currency amounts: parse numeric value (drop "€" symbol, drop
  thousand separators). If the field says "n/a" or blank → null.
  Do NOT round. "€20,856" → 20856. "€2,502.72" → 2502.72.
• Honorifics on charterer name — KEEP them. The contract is the
  legal document; "Ms. Tricia Stevens" is how the agreement
  identifies her, and that's what we preserve. Stripping is a
  display concern, not an extraction concern.
• Names and addresses: verbatim, no normalisation of case or
  punctuation.
• "vessel_length" is a single verbatim string with whatever unit
  the contract writes. Examples: "51 ft", "27 m", "51 ft / 15.6
  m". The cabin schema can store it as text; no conversion needed.
• "payment_schedule" — parse the FIRST INSTALMENT and SECOND
  INSTALMENT (and any additional) into ordered entries. Each entry
  has amount, due_date (ISO), and a "label" — the label is the
  verbatim short phrase the contract uses (e.g. "50% of charter
  fee", "Rest 50% + VAT 12% + APA").
• "bank_account" — extract the entire block (SWIFT, IBAN,
  beneficiary, branch address) verbatim.
• "special_conditions_summary" — only set when Page Two's Special
  Conditions section materially alters the standard MYBA clauses
  (APA percentage variance, payment schedule deviation,
  cancellation override). Quote the affected clauses verbatim
  rather than summarising. Null when nothing materially changes.
• Unknown / missing fields → null (NEVER empty strings or zero).`,
};

const COLUMN_BY_KIND = {
  crew: "crew_display",
  menu: "sample_menu",
  vessel: "vessel_brochure",
  // contract is special — it writes to multiple columns; see the
  // contract-specific persistence block below the basic kinds.
};

// 2026-05-20 — MYBA contract extraction maps the "safe" half of
// the extraction onto these flat columns. Any field NOT in this
// allowlist is dropped (we never silently widen the contract's
// influence over the cabin record).
//
// Note: `homeport` is intentionally NOT mapped from contract.homeport
// (which is the legal Port of Registry, often unrelated to where
// the charter actually departs). We instead derive it from the
// embarkation port in the persistence block below.
const CONTRACT_SAFE_TO_COLUMN = {
  vessel_name: "vessel_name",
  vessel_make_model: "vessel_make_model",
  charter_period_from: "charter_period_from",
  charter_period_to: "charter_period_to",
  port_embarkation: "port_embarkation",
  port_disembarkation: "port_disembarkation",
  cruising_area: "cruising_area",
  principal_charterer_name: "principal_charterer_name",
};

// Conservative pre-estimate. Gemini 2.5 Flash is much cheaper than
// Claude Haiku ($0.075/MTok input vs $1/MTok) so a 100k-token PDF
// costs about $0.0075 — but the free tier swallows it. We pass 0
// as estimate since real billed cost is typically $0 at our volume.
const ESTIMATED_COST_CENTS_PER_EXTRACTION = 0;

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
  const kind = String(form.get("kind") || "");
  const cabinId = String(form.get("cabin_id") || "");

  if (!cabinId) return NextResponse.json({ ok: false, error: "cabin_id-required" }, { status: 400 });
  if (!ALLOWED_KINDS.has(kind)) {
    return NextResponse.json({ ok: false, error: "kind-must-be-crew-menu-or-vessel" }, { status: 400 });
  }
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
  let base64 = "";
  // Chunk to avoid call-stack blowups on large buffers.
  const CHUNK = 32 * 1024;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    base64 += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  base64 = Buffer.from(base64, "binary").toString("base64");

  // Call Gemini (through the capped wrapper) for free-tier PDF
  // structured-extraction.
  let extracted;
  try {
    const result = await geminiGenerateContent({
      model: "gemini-2.5-flash",
      estimatedCostCents: ESTIMATED_COST_CENTS_PER_EXTRACTION,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPTS[kind] }] },
      contents: [
        {
          role: "user",
          parts: [
            { inline_data: { mime_type: "application/pdf", data: base64 } },
            { text: `Extract the ${kind} data from this PDF as strict JSON per the schema. Output JSON only — no markdown fences, no commentary.` },
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
      return NextResponse.json({ ok: false, error: "ai-cap-or-disabled", message: err.message }, { status: 503 });
    }
    console.error("[extract-brochure]", err);
    return NextResponse.json({ ok: false, error: "extraction-failed", message: String(err?.message || err).slice(0, 200) }, { status: 502 });
  }

  // Save to the matching cabin column.
  const db = getCabinDb();

  // 2026-05-20 — Contract kind takes a different persistence path
  // because it touches multiple flat columns AND the
  // contract_internal JSONB. We assemble a single UPDATE for
  // atomicity, then return a summary of what landed where.
  if (kind === "contract") {
    const safe = (extracted && typeof extracted === "object" && extracted.safe) || {};
    const internal = (extracted && typeof extracted === "object" && extracted.internal) || {};

    // Build the column-level update from the allowlist. Only fields
    // present (non-null, non-empty) overwrite; everything else
    // leaves the existing value alone — George may have typed it
    // by hand before signing the contract.
    const update = {};
    for (const [safeKey, col] of Object.entries(CONTRACT_SAFE_TO_COLUMN)) {
      const v = safe[safeKey];
      if (v === null || v === undefined) continue;
      if (typeof v === "string" && v.trim().length === 0) continue;
      update[col] = typeof v === "string" ? v.trim() : v;
    }

    // 2026-05-21 — Roberto P1: vessel_length is now extracted as a
    // single verbatim string ("51 ft", "27 m", "51 ft / 15.6 m" —
    // whatever the contract writes). The cabin schema's
    // vessel_length column is already text; we just pass through.
    //
    // Legacy compatibility: earlier prompt versions returned a
    // ft/m split. If we encounter that shape (older saved drafts),
    // assemble the same way the previous persistence code did so
    // re-extractions of older contracts don't regress.
    if (typeof safe.vessel_length === "string" && safe.vessel_length.trim().length > 0) {
      update.vessel_length = safe.vessel_length.trim();
    } else if (safe.vessel_length_ft != null) {
      update.vessel_length = `${safe.vessel_length_ft} ft`;
    } else if (safe.vessel_length_m != null) {
      update.vessel_length = `${safe.vessel_length_m} m`;
    }

    // 2026-05-20 — Pass 6 (George): "λέει Πειραιάς, αλλά το port
    // δεν είναι Πειραιάς — παίρνει embarkation/disembarkation από
    // το συμβόλαιο αλλά στο port [homeport] δεν το παίρνει — πρέπει
    // να είναι το ίδιο."
    // The MYBA "Port of Registry" is a legal flag-state property
    // unrelated to where the charter departs (often different
    // entirely). For customer-facing display, what they want to
    // see is where they BOARD. Derive homeport from the embarkation
    // port the contract just gave us.
    if (typeof safe.port_embarkation === "string" && safe.port_embarkation.trim().length > 0) {
      update.homeport = safe.port_embarkation.trim();
    } else if (typeof safe.homeport === "string" && safe.homeport.trim().length > 0) {
      // Fall back to the Port of Registry only if no embarkation
      // was given.
      update.homeport = safe.homeport.trim();
    }
    // Capacity — prefer "sleeping" (the binding number for
    // accommodation); fall back to cruising.
    if (Number.isInteger(safe.max_guests_sleeping)) {
      update.vessel_capacity = safe.max_guests_sleeping;
    } else if (Number.isInteger(safe.max_guests_cruising)) {
      update.vessel_capacity = safe.max_guests_cruising;
    }

    // contract_internal: store the whole internal blob verbatim
    // for operator surfaces (preference sheet, crew list PDF,
    // future financial reconciliation). Never read by client pages.
    update.contract_internal = internal;

    await dbQuery(
      db.from("cabins").update(update).eq("id", cabinId)
    );

    return NextResponse.json({
      ok: true,
      kind,
      summary: {
        applied_columns: Object.keys(update).filter((k) => k !== "contract_internal"),
        internal_fields_captured: Object.keys(internal),
        vessel_name: update.vessel_name ?? null,
        charterer: update.principal_charterer_name ?? null,
        charter_window: update.charter_period_from && update.charter_period_to
          ? `${update.charter_period_from} → ${update.charter_period_to}`
          : null,
      },
    });
  }

  const col = COLUMN_BY_KIND[kind];
  // crew uses a different shape on the cabin column — we keep the
  // members array as { first_name, role, bio, ... } for backwards
  // compat with the simple admin form. New shape adds last_name,
  // secondary_role, languages, years_experience, highlights.
  const persisted = kind === "crew"
    ? (extracted?.members ?? []).map((m) => ({
        first_name: m.first_name ?? "",
        last_name: m.last_name ?? null,
        role: m.role ?? "",
        secondary_role: m.secondary_role ?? null,
        languages: Array.isArray(m.languages) ? m.languages : [],
        years_experience: m.years_experience ?? null,
        highlights: Array.isArray(m.highlights) ? m.highlights : [],
        bio: m.bio ?? "",
      }))
    : extracted;

  await dbQuery(
    db.from("cabins").update({ [col]: persisted }).eq("id", cabinId)
  );

  return NextResponse.json({ ok: true, kind, persisted });
}
