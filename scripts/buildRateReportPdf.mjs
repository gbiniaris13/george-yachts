#!/usr/bin/env node
/**
 * The Greek Charter Rate Report as a PDF, built from lib/charterIndex2026.js.
 *
 * Plan item 2 (4 September 2026): a quarterly report a journalist can open,
 * quote and link, alongside the CSV and JSON the Index page already serves.
 * Nothing in here is typed by hand: the table, the callouts and the
 * methodology are the same objects the page renders, so the PDF cannot say
 * one thing and the page another. Run it after every Index refresh:
 *
 *   node scripts/buildRateReportPdf.mjs
 *
 * Output: public/greek-charter-index-2026/report.pdf, linked from the Index
 * page and declared as a DataDownload in its Dataset schema. Fonts are the
 * renderer's built-in Helvetica, as in lib/pricingGuidePdf.jsx, so the file
 * carries no font payload and builds offline.
 */
import React from "react";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;
const { CHARTER_INDEX_2026: I } = await import(pathToFileURL(join(ROOT, "lib/charterIndex2026.js")).href);
const { Document, Page, Text, View, StyleSheet, Link, renderToBuffer } = await import("@react-pdf/renderer");

const NAVY = "#0D1B2A", GOLD = "#DAA110", CREAM = "#F8F5F0", INK = "#1C2A3A";
const h = React.createElement;
const s = StyleSheet.create({
  cover: { backgroundColor: NAVY, padding: 60, flexDirection: "column", justifyContent: "space-between", fontFamily: "Helvetica" },
  page: { backgroundColor: CREAM, padding: 46, fontFamily: "Helvetica", fontSize: 10, color: INK, lineHeight: 1.45 },
  eyebrow: { fontSize: 8, letterSpacing: 3, color: GOLD, textTransform: "uppercase", marginBottom: 10 },
  h1: { fontSize: 30, color: CREAM, lineHeight: 1.15, marginBottom: 10 },
  sub: { fontSize: 12, color: CREAM, opacity: 0.75, marginBottom: 6 },
  h2: { fontSize: 15, color: NAVY, marginBottom: 8, marginTop: 14 },
  p: { fontSize: 10, marginBottom: 8, color: INK },
  small: { fontSize: 8.5, color: "#5A6675", lineHeight: 1.4 },
  row: { flexDirection: "row", borderBottom: "0.5px solid #C9CFD6", paddingVertical: 5 },
  head: { flexDirection: "row", borderBottom: `1px solid ${GOLD}`, paddingVertical: 6 },
  c1: { width: "40%", fontSize: 9.5 }, c2: { width: "14%", fontSize: 9.5 }, c3: { width: "30%", fontSize: 9.5 }, c4: { width: "16%", fontSize: 9.5, textAlign: "right" },
  th: { fontSize: 8, letterSpacing: 1.5, color: NAVY, textTransform: "uppercase" },
  callout: { width: "48%", marginBottom: 14, paddingRight: 12 },
  calloutValue: { fontSize: 18, color: NAVY, lineHeight: 1.2, marginBottom: 4 },
  footer: { position: "absolute", bottom: 24, left: 46, right: 46, fontSize: 8, color: "#5A6675", flexDirection: "row", justifyContent: "space-between" },
});

const date = new Date(I.dataModified + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const footer = (n) => h(View, { style: s.footer, fixed: true },
  h(Text, { style: { width: "88%" } }, `George Yachts Greek Charter Index ${I.edition} · data as of ${date} · CC BY 4.0, cite with a link to the Index page`),
  h(Text, { style: { width: "12%", textAlign: "right" } }, String(n)));

const Cover = h(Page, { size: "A4", style: s.cover },
  h(View, null,
    h(Text, { style: s.eyebrow }, "George Yachts Brokerage House · original market data"),
    h(Text, { style: s.h1 }, "Greek Charter Rate Report"),
    h(Text, { style: s.sub }, `${I.title}`),
    h(Text, { style: s.sub }, `Edition ${I.edition} · rate cards as of ${date}`)),
  h(View, null,
    h(Text, { style: { ...s.sub, fontSize: 10, marginBottom: 14 } }, I.intro),
    h(View, { style: { borderTop: `1px solid ${GOLD}`, paddingTop: 10 } },
      h(Text, { style: { fontSize: 9, color: CREAM, opacity: 0.7, letterSpacing: 1 } }, "GEORGE P. BINIARIS · FOUNDER AND MANAGING BROKER · GEORGEYACHTS.COM"),
      h(Text, { style: { fontSize: 9, color: CREAM, opacity: 0.7, marginTop: 3 } }, "Weekly, fully crewed yacht charter in Greek waters · Athens and Miami"))));

const table = I.summaryTable;
const cols = [s.c1, s.c2, s.c3, s.c4];
const Table = h(Page, { size: "A4", style: s.page },
  h(Text, { style: s.eyebrow }, "The table"),
  h(Text, { style: s.h2 }, "Weekly net base charter fee by yacht type and size"),
  h(Text, { style: s.p }, table.caption),
  h(View, { style: s.head }, ...table.columns.map((c, i) => h(Text, { key: "h" + i, style: [cols[i], s.th] }, c))),
  ...table.rows.map((r, i) => h(View, { key: "r" + i, style: s.row }, ...r.cells.map((c, j) => h(Text, { key: j, style: cols[j] }, j === 2 ? `EUR ${c}` : c)))),
  h(Text, { style: [s.small, { marginTop: 10 }] }, "All figures per yacht per week, net base, before Greek VAT (invoiced at the yacht's certified rate of 5.2, 6.5, 7.8 or 12 per cent; 13 per cent is the statutory ceiling) and before APA (20 to 30 per cent of base on sailing yachts and catamarans, 30 to 40 per cent on motor yachts). A crew gratuity of 10 to 15 per cent of the base is customary and at the guest's discretion."),
  footer(2));

const prose = I.sections.filter((x) => !x.table);
const lead = I.sections.find((x) => x.heading.startsWith("Booking lead time"));
const Numbers = h(Page, { size: "A4", style: s.page },
  h(Text, { style: s.eyebrow }, "In numbers"),
  h(View, { style: { flexDirection: "row", flexWrap: "wrap", marginTop: 6, marginBottom: 6 } },
    ...I.statCallouts.map((c, i) => h(View, { key: "c" + i, style: s.callout }, h(Text, { style: s.calloutValue }, c.value), h(Text, { style: s.small }, c.label)))),
  ...prose.slice(0, 2).map((x, i) => h(View, { key: "s" + i }, h(Text, { style: s.h2 }, x.heading), h(Text, { style: s.p }, x.body))),
  footer(3));

const Budget = h(Page, { size: "A4", style: s.page },
  h(Text, { style: s.eyebrow }, "Reading the table"),
  ...prose.slice(2, 4).map((x, i) => h(View, { key: "b" + i }, h(Text, { style: s.h2 }, x.heading), h(Text, { style: s.p }, x.body))),
  h(Text, { style: s.h2 }, "Booking lead time by season"),
  ...(lead?.table?.rows || []).map((r, i) => h(View, { key: "l" + i, style: s.row }, h(Text, { style: { width: "45%", fontSize: 9.5 } }, r.cells[0]), h(Text, { style: { width: "55%", fontSize: 9.5 } }, r.cells[1]))),
  footer(4));

const Method = h(Page, { size: "A4", style: s.page },
  h(Text, { style: s.eyebrow }, "Methodology and use"),
  h(Text, { style: s.h2 }, "How the figures are produced"),
  h(Text, { style: s.p }, I.methodology),
  h(Text, { style: s.h2 }, "The data as files"),
  h(Text, { style: s.p }, "The same table is published as CSV and JSON for reuse, under a Creative Commons Attribution 4.0 licence: cite it with a link to the Index page."),
  h(Text, { style: s.p }, h(Link, { src: "https://georgeyachts.com/greek-charter-index-2026", style: { color: NAVY } }, "georgeyachts.com/greek-charter-index-2026"), "  ·  ",
    h(Link, { src: "https://georgeyachts.com/greek-charter-index-2026/data.csv", style: { color: NAVY } }, "data.csv"), "  ·  ",
    h(Link, { src: "https://georgeyachts.com/greek-charter-index-2026/data.json", style: { color: NAVY } }, "data.json")),
  h(Text, { style: s.h2 }, "About George Yachts"),
  h(Text, { style: s.p }, "George Yachts Brokerage House LLC is a boutique charter brokerage working exclusively in Greek waters: weekly, fully crewed charters on motor yachts, power catamarans and sailing catamarans in the Cyclades, the Saronic and the Ionian, boarding at Athens, Lefkada or Corfu. The house is an IYBA Charter Active member and contracts on MYBA-standard terms, one price per yacht per week. Founder and Managing Broker George P. Biniaris is a licensed sailing skipper."),
  h(Text, { style: s.p }, "Press and data enquiries: george@georgeyachts.com · Athens +30 697 038 0999 · Miami +1 786 798 8798"),
  footer(5));

const doc = h(Document, { title: `Greek Charter Rate Report ${I.edition}`, author: "George Yachts Brokerage House LLC", subject: "Weekly net base charter rates, Greece, by yacht type and size" }, Cover, Table, Numbers, Budget, Method);
const buf = await renderToBuffer(doc);
const out = join(ROOT, "public/greek-charter-index-2026");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "report.pdf"), buf);
console.log(`Rate report: ${(buf.length / 1024).toFixed(0)} KB, ${table.rows.length} bands, data as of ${date} → public/greek-charter-index-2026/report.pdf`);
