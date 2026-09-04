// Greek Charter Index as a CSV download (plan item 8, 2026-09-04).
//
// The Index is the one asset nobody else in Greek chartering publishes,
// and data is what AI crawlers, journalists and researchers cite. The
// same report the page renders (a published Sanity dataReport overrides
// the JS default) is served here as a flat file: one row per yacht type
// and size band, weekly net base fee per yacht, before VAT and APA.

import { sanityClient } from "@/lib/sanity";
import { CHARTER_INDEX_2026 } from "@/lib/charterIndex2026";

// NOTE: .gitignore ignores *.csv, which also swallows this directory
// (app/.../data.csv/). The route was added with `git add -f` on
// 2026-09-04 after the first push silently left it out and the URL
// 404ed. The exception below in .gitignore keeps it tracked from now on.
export const revalidate = 3600;

const GROQ = `*[_type == "dataReport" && slug.current == "greek-charter-index-2026"][0]{
  title, edition, dataModified, publishedAt, summaryTable
}`;

function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  let report = null;
  try {
    report = await sanityClient.fetch(GROQ);
  } catch {
    report = null;
  }
  const r = report && report.summaryTable ? report : CHARTER_INDEX_2026;
  const table = r.summaryTable || {};
  const columns = Array.isArray(table.columns) ? table.columns : [];
  const rows = Array.isArray(table.rows) ? table.rows : [];

  const lines = [
    `# ${r.title || "George Yachts Greek Charter Index"}`,
    `# Edition ${r.edition || ""}; data modified ${r.dataModified || r.publishedAt || ""}`,
    `# Weekly net base charter fee, EUR, per yacht, excluding VAT and APA. Source: George Yachts Brokerage House, https://georgeyachts.com/greek-charter-index-2026`,
    columns.map(csvCell).join(","),
    ...rows.map((row) => (row.cells || []).map(csvCell).join(",")),
  ];

  return new Response(lines.join("\n") + "\n", {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="greek-charter-index.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
