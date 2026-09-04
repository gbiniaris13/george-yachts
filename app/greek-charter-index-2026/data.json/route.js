// Greek Charter Index as JSON (plan item 8, 2026-09-04). Same report the
// page renders, machine-readable: bands parsed into numbers so an AI
// assistant, a journalist's spreadsheet or another site's widget can use
// the figures without scraping our HTML.

import { sanityClient } from "@/lib/sanity";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";

export const revalidate = 3600;

const GROQ = `*[_type == "dataReport" && slug.current == "greek-charter-index-2026"][0]{
  title, edition, dataModified, publishedAt, intro, summaryTable, statCallouts, methodology
}`;

function parseBand(rateCell) {
  const m = String(rateCell ?? "").replace(/,/g, "").match(/(\d+)\s*-\s*(\d+)/);
  return m ? { low_eur: Number(m[1]), high_eur: Number(m[2]) } : { low_eur: null, high_eur: null };
}

export async function GET() {
  let report = null;
  try {
    report = await sanityClient.fetch(GROQ);
  } catch {
    report = null;
  }
  const r = report && report.summaryTable ? report : CHARTER_INDEX_2026;
  const rows = Array.isArray(r.summaryTable?.rows) ? r.summaryTable.rows : [];

  const bands = rows.map((row) => {
    const [typeSize, guests, rate, yachts] = row.cells || [];
    const [type, size] = String(typeSize ?? "").split(",").map((s) => s.trim());
    return {
      yacht_type: type || null,
      size_band: size || null,
      guests: guests || null,
      weekly_net_base: { ...parseBand(rate), currency: "EUR", per: "yacht per week, excluding VAT and APA" },
      yachts_in_band: Number(yachts) || null,
    };
  });

  const body = {
    title: r.title || "George Yachts Greek Charter Index",
    edition: r.edition || null,
    data_modified: r.dataModified || r.publishedAt || null,
    source: "George Yachts Brokerage House",
    source_url: "https://georgeyachts.com/greek-charter-index-2026",
    license: "Free to cite with attribution to George Yachts and a link to the source page.",
    unit: "EUR per yacht per week, net base charter fee, excluding VAT and APA",
    notes: {
      vat: "Weekly crewed charters are invoiced at 5.2, 6.5, 7.8 or 12% VAT by the yacht's certification; 13% is the statutory ceiling; charters under 48 hours and bareboat pay 24%.",
      apa: "20 to 30% of the base fee for sailing yachts and catamarans, 30 to 40% for motor yachts.",
      gratuity: "Customary 10 to 15% of the base fee, calculated on the base alone.",
    },
    intro: r.intro || null,
    bands,
    stat_callouts: Array.isArray(r.statCallouts) ? r.statCallouts : [],
    methodology: r.methodology || null,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
