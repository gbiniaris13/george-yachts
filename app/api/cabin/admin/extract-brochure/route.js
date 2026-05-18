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

const ALLOWED_KINDS = new Set(["crew", "menu", "vessel"]);
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
};

const COLUMN_BY_KIND = {
  crew: "crew_display",
  menu: "sample_menu",
  vessel: "vessel_brochure",
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
  const col = COLUMN_BY_KIND[kind];
  const db = getCabinDb();
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
