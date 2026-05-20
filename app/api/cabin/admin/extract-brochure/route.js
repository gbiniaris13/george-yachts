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

const SYSTEM_PROMPTS = {
  crew: `You are extracting CREW PROFILES from a charter-yacht crew booklet.
Output strict JSON with this exact shape:
{
  "members": [
    {
      "first_name": "Thanos",
      "last_name": "Karagiozis",
      "role": "Captain",
      "secondary_role": null,
      "languages": ["Greek", "English"],
      "years_experience": 6,
      "highlights": ["Sailing Diploma", "Speed Boat Operator License", "First Aid"],
      "bio": "Full multi-paragraph bio in original prose. Keep the voice and tone."
    }
  ]
}

Rules:
• "role" is the primary role (Captain, Chef, Hostess, Cook, Steward, Engineer, Deckhand, Cook/Hostess if combined).
• "secondary_role" is non-null only when the title explicitly shows two roles (e.g. "Cook/Hostess" → role:"Cook", secondary_role:"Hostess").
• "languages" — list each language mentioned; default ["English"] if none stated.
• "years_experience" — integer from prose; null if not stated.
• "highlights" — short list of certifications, diplomas, signature skills (1-5 items).
• "bio" — preserve the full bio paragraphs as one string with \\n\\n between paragraphs.
• Skip the photo. We'll handle photos separately.
• Output ONLY the JSON, no prose before or after.`,

  menu: `You are extracting a SAMPLE MENU from a charter-yacht menu booklet.
Output strict JSON with this exact shape:
{
  "title": "EFFIE STAR SAMPLE MENU",
  "tagline": null,
  "sections": [
    {
      "name": "Breakfast",
      "dishes": ["Butter Croissant", "Greek Yogurt with Nuts & Honey", "..."]
    },
    {
      "name": "Appetizers / Snacks",
      "dishes": ["..."]
    },
    {
      "name": "Main Courses",
      "dishes": ["..."]
    },
    {
      "name": "Desserts",
      "dishes": ["..."]
    }
  ]
}

Rules:
• Preserve section order from the booklet.
• Each dish is a single string — capitalise the first letter of each word (Title Case).
• If the booklet groups dishes by day instead of by meal, render each day as a section.
• "tagline" — only set if the booklet has a one-line standfirst under the title; else null.
• Output ONLY the JSON.`,

  vessel: `You are extracting a VESSEL BROCHURE for a charter yacht.
The placeholders below are EXAMPLES showing the data type — DO NOT
copy the example strings into your output. Extract the real values
from the PDF, or use null when the PDF does not contain that field.

Output strict JSON with this exact shape:
{
  "vessel_name": "<the actual yacht name from the cover or 'THE YACHT' page>",
  "type_line": "<e.g. Sailing Catamaran, Motor Yacht, Sailing Yacht — from the brochure cover>",
  "builder_model": "<e.g. Lagoon 51, Sunseeker 76>",
  "year_built": <integer year or null>,
  "summary": "<paste the actual intro paragraph from the brochure's 'THE YACHT' or main intro page — the real prose, verbatim. NOT the words 'Full intro paragraph from the Yacht page'.>",
  "key_features": ["Brand new built in 2025", "Accommodates up to 10 guests in 5 cabins", "Spacious flybridge with panoramic views"],
  "specifications": {
    "length_m": 15.6,
    "length_ft": 51.2,
    "beam_m": 8.1,
    "beam_ft": 26.7,
    "draft_m": 1.4,
    "draft_ft": 4.7,
    "main_engines": "2x 80hp Yanmar",
    "generator": "13Kw Onan",
    "cruising_speed_knots": 8,
    "fuel_consumption_lt_hr": 25
  },
  "accommodation": {
    "guests": 10,
    "cabins_summary": "4 double cabins with en-suite, 1 French double sharing bathroom",
    "crew_count": 2,
    "crew_summary": "Captain & Cook/Hostess in separate compartments"
  },
  "amenities": ["Wi-Fi on board", "Watermaker", "Generator", "Air conditioning", "Barbeque"],
  "tender": {
    "make_model": "Highfield CL 390 Deluxe",
    "length_m": 3.9,
    "engine": "40HP Honda outboard",
    "notes": "Aluminum hull, console and integrated rear seat"
  },
  "water_toys": ["Tube", "Banana", "Kneeboard", "Water Ski (adults)", "Snorkeling equipment", "Fishing equipment", "Wakeboard", "2x SUP", "2x Sea Scooter"],
  "areas": ["Aft Deck", "Saloon & Dining Area", "Flybridge", "Bow Area", "Cabins", "Tender & Toys"]
}

Rules:
• Numerical fields — parse from the brochure. Use null when missing.
• "length_m" / "length_ft" — match the brochure exactly (often comma as decimal in EU formats; output as float).
• "key_features" — 3-6 short bullet phrases from the "KEY FEATURES" section.
• "summary" — preserve the intro prose verbatim if present.
• "amenities" — extract the "General Amenities" list, one item per array entry.
• "water_toys" — split the "Tender & Toys" list into individual items, dropping the tender itself (which goes in "tender").
• "areas" — list of named areas/sections the brochure walks through (Aft Deck, Saloon, Flybridge, etc.).
• Output ONLY the JSON.`,

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
  contract: `You are extracting structured data from a signed MYBA
Charter Agreement (the standard contract used across the worldwide
yacht-charter industry, published by MYBA). Page One contains the
"Charter Particulars" block — that's where most fields live.
Subsequent pages are the standard clauses; skip them unless an
addendum modifies the headline particulars.

Output strict JSON with this exact shape — and obey the safe/
internal split:

{
  "safe": {
    "vessel_name": "EFFIE STAR",
    "vessel_make_model": "Lagoon 51",
    "vessel_type": "Sailing Catamaran",
    "vessel_length_ft": 51,
    "vessel_length_m": null,
    "homeport": "Piraeus",
    "flag": "Greek",
    "max_guests_sleeping": 10,
    "max_guests_cruising": 10,
    "crew_summary": "Captain +1",
    "charter_period_from": "2026-06-27",
    "charter_period_to": "2026-07-04",
    "port_embarkation": "Athens, Greece",
    "port_disembarkation": "Athens, Greece",
    "cruising_area": "Greek & International Waters",
    "principal_charterer_name": "Tricia Stevens",
    "principal_charterer_address": "4523 Club Circle NE Atlanta, GA 30319 USA"
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
• Dates: output ISO 8601 (YYYY-MM-DD). MYBA dates appear as
  "27 June 2026" — convert.
• "charter_period_from / _to": parse the From and To times on Page
  One. The DATE portion only (we discard the 12:00 hour).
• "vessel_make_model": MYBA "Type" field. Often a builder + model
  (Lagoon 51, Sunseeker 76, etc.). Preserve case.
• "vessel_length_ft" / "_m": MYBA "Length" field. If only one unit
  is present, set the other to null — DO NOT convert.
• "principal_charterer_name": from the CHARTERER row. Strip
  honorifics (Mr / Ms / Mrs / Dr) — just first + last name.
  Preserve the original honorific if present nowhere else.
• "principal_charterer_address": full address line from the
  CHARTERER ADDRESS row, single string.
• "cruising_area": verbatim from the "Cruising area" line.
• "max_guests_sleeping / _cruising": parse the "Maximum number of
  guests sleeping (X) and cruising (Y) on board" line — two
  separate integers.
• "crew_summary": short phrase verbatim, e.g. "Captain +1".
• "charter_fee_eur", "vat_provision_eur", "apa_eur",
  "security_deposit_eur", "delivery_redelivery_fees_eur": numeric
  values (EUR). Drop currency symbols. If the field says "n/a" or
  blank, output null.
• "payment_schedule": parse the FIRST INSTALMENT and SECOND
  INSTALMENT (and any additional) into ordered entries. Each
  entry has amount, due_date (ISO), and a short "label" (e.g.
  "50% of charter fee", "Rest 50% + VAT 12% + APA").
• "bank_account": from the "To the following Broker's Client
  Account" block. SWIFT/BIC, IBAN, beneficiary — all preserved.
• "special_conditions_summary": only set if Page Two's Special
  Conditions block carries clauses that materially affect the
  charter (e.g. APA percentage variances). Otherwise null.
• Unknown / missing fields → null (not empty strings).
• Output ONLY the JSON. No markdown fences, no commentary.`,
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

    // Vessel length: pick the unit the contract carries. Stored
    // as free-text "<n> ft" or "<n> m" on the cabin row.
    if (safe.vessel_length_ft != null) {
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
