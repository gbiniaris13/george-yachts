// Pricing Guide PDF generator - Phase 7 Round 25 (2026-05-12).
// Technical brief Priority 1D.
//
// Uses @react-pdf/renderer to produce a downloadable, branded PDF
// of the 2026 Greek Charter Pricing Guide. Served from the
// /api/pricing-guide-pdf route after the visitor submits the email
// capture form.
//
// Brand: Deep Navy #0D1B2A, Antique Gold #C9A84C, Ivory White
// #F8F5F0. Free-to-use Inter font (loaded from @fontsource if
// available; falls back to Helvetica).

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";

const NAVY = "#0D1B2A";
const GOLD = "#C9A84C";
const CREAM = "#F8F5F0";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: CREAM,
    padding: 48,
    fontFamily: "Helvetica",
  },
  coverPage: {
    backgroundColor: NAVY,
    padding: 60,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  coverEyebrow: {
    fontSize: 8,
    letterSpacing: 4,
    color: GOLD,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 36,
    color: CREAM,
    lineHeight: 1.1,
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: CREAM,
    opacity: 0.7,
    fontStyle: "italic",
    marginBottom: 60,
  },
  coverByline: {
    fontSize: 10,
    color: CREAM,
    opacity: 0.65,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 40,
    paddingTop: 12,
    borderTop: `1px solid ${GOLD}`,
  },
  coverFooter: {
    fontSize: 9,
    color: CREAM,
    opacity: 0.5,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Content pages
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 24,
    paddingBottom: 8,
    borderBottom: `1px solid ${GOLD}`,
  },
  pageHeaderLogo: {
    fontSize: 8,
    color: GOLD,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  pageHeaderNum: {
    fontSize: 8,
    color: NAVY,
    opacity: 0.5,
    letterSpacing: 2,
  },
  sectionEyebrow: {
    fontSize: 7,
    color: GOLD,
    letterSpacing: 3,
    textTransform: "uppercase",
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    color: NAVY,
    marginBottom: 12,
    lineHeight: 1.2,
  },
  paragraph: {
    fontSize: 10,
    color: NAVY,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  table: {
    flexDirection: "column",
    border: `1px solid ${GOLD}`,
    marginTop: 12,
    marginBottom: 18,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: NAVY,
    padding: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    color: GOLD,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1px solid rgba(13,27,42,0.08)",
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: NAVY,
    lineHeight: 1.4,
  },
  tableCellBold: {
    flex: 1,
    fontSize: 9,
    color: NAVY,
    fontWeight: "bold",
    lineHeight: 1.4,
  },
  costBucket: {
    flexDirection: "row",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "rgba(201,168,76,0.08)",
    borderLeft: `2px solid ${GOLD}`,
  },
  costBucketNum: {
    width: 24,
    fontSize: 14,
    color: GOLD,
    fontWeight: "bold",
  },
  costBucketBody: {
    flex: 1,
  },
  costBucketLabel: {
    fontSize: 10,
    color: NAVY,
    fontWeight: "bold",
    marginBottom: 3,
  },
  costBucketDetail: {
    fontSize: 9,
    color: NAVY,
    opacity: 0.8,
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTop: `1px solid rgba(13,27,42,0.12)`,
  },
  footerText: {
    fontSize: 8,
    color: NAVY,
    opacity: 0.55,
    letterSpacing: 1,
  },
  link: {
    color: GOLD,
    fontWeight: "bold",
    textDecoration: "none",
  },
  ctaBlock: {
    marginTop: 20,
    padding: 16,
    backgroundColor: NAVY,
    flexDirection: "column",
  },
  ctaTitle: {
    fontSize: 14,
    color: CREAM,
    marginBottom: 6,
  },
  ctaBody: {
    fontSize: 9,
    color: CREAM,
    opacity: 0.75,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  ctaButton: {
    fontSize: 9,
    color: NAVY,
    backgroundColor: GOLD,
    padding: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "bold",
    alignSelf: "flex-start",
    textDecoration: "none",
  },
});

const YACHT_TYPES_TABLE = {
  headers: ["Yacht type", "Length", "Weekly base (€)", "Notes"],
  rows: [
    ["Motor yacht (entry)", "24-30m", "60,000 - 110,000", "Mid-tier comfort, 4 cabins"],
    ["Motor yacht (mid)", "30-40m", "110,000 - 220,000", "Full crew, stabilisers"],
    ["Motor yacht (upper)", "40-50m", "220,000 - 380,000", "Premium amenities"],
    ["Superyacht", "50-70m", "380,000 - 800,000", "Megayacht class"],
    ["Megayacht", "70m+", "800,000 - 1,800,000+", "Gigayacht territory"],
    ["Sailing yacht", "30-50m", "55,000 - 250,000", "30-40% cheaper vs motor"],
    ["Catamaran", "20-30m", "35,000 - 95,000", "Shallow draft, family"],
    ["Gulet (luxury)", "30-45m", "40,000 - 140,000", "Traditional, slow pace"],
  ],
};

const SEASON_MULTIPLIERS_TABLE = {
  headers: ["Period", "Multiplier vs peak", "Notes"],
  rows: [
    ["July-August (peak)", "100%", "Full Meltemi season Cyclades"],
    ["Early September", "85-90%", "Best value-quality balance"],
    ["June", "80-85%", "Pre-peak, calmer winds"],
    ["Late September", "70-80%", "Saronic + Ionian still warm"],
    ["October Saronic", "60-65%", "Hidden value window"],
    ["May", "65-75%", "Strong shoulder, fewer crowds"],
    ["April", "50-60%", "Off-season, weather variable"],
  ],
};

const COMPARISON_TABLE = {
  headers: ["Destination", "VAT", "Mid-tier weekly", "Verdict"],
  rows: [
    ["Greece", "12%", "€120k-180k", "Best value-to-quality"],
    ["Croatia", "13%", "€95k-150k", "Cheaper, less variety"],
    ["French Riviera", "10-22%", "€200k-300k", "+40% premium for Monaco access"],
    ["Italy (Amalfi)", "6.6-22%", "€150k-220k", "Iconic but VAT complex"],
    ["Turkey", "18%", "€60k-100k", "Cheapest but EU-flag complexity"],
  ],
};

function CoverPage() {
  return (
    <Page size="A4" style={styles.coverPage}>
      <View>
        <Text style={styles.coverEyebrow}>George Yachts Brokerage House</Text>
        <Text style={styles.coverTitle}>
          The 2026 Greek Yacht Charter Pricing Guide
        </Text>
        <Text style={styles.coverSubtitle}>
          What a Greek charter actually costs. Honest numbers, no marketing fluff.
        </Text>
      </View>
      <View>
        <Text style={styles.coverByline}>George P. Biniaris, Managing Broker</Text>
        <Text
          style={{
            fontSize: 9,
            color: CREAM,
            opacity: 0.6,
            marginTop: 4,
            letterSpacing: 1,
          }}
        >
          IYBA Member · MYBA-Standard · Featured in Forbes, May 2026
        </Text>
        <View style={{ marginTop: 60 }}>
          <Text style={styles.coverFooter}>georgeyachts.com</Text>
          <Text style={[styles.coverFooter, { marginTop: 4 }]}>
            Athens · London · Miami
          </Text>
        </View>
      </View>
    </Page>
  );
}

function ContentPage({ pageNum, totalPages, children }) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderLogo}>George Yachts · 2026 Pricing</Text>
        <Text style={styles.pageHeaderNum}>
          Page {pageNum} of {totalPages}
        </Text>
      </View>
      <View>{children}</View>
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>georgeyachts.com</Text>
        <Text style={styles.footerText}>
          george@georgeyachts.com · +30 6970380999
        </Text>
      </View>
    </Page>
  );
}

function DataTable({ headers, rows }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {headers.map((h, i) => (
          <Text key={i} style={styles.tableHeaderCell}>
            {h}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View
          key={ri}
          style={[
            styles.tableRow,
            ri === rows.length - 1 ? { borderBottom: 0 } : {},
          ]}
        >
          {row.map((cell, ci) => (
            <Text key={ci} style={ci === 0 ? styles.tableCellBold : styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function PricingGuidePdfDocument({ firstName = "" }) {
  const greeting = firstName
    ? `Personalised brief for ${firstName}`
    : "2026 charter pricing brief";

  return (
    <Document
      title="George Yachts 2026 Greek Charter Pricing Guide"
      author="George P. Biniaris"
      subject="2026 Greek yacht charter pricing reference"
      keywords="yacht charter, Greece, pricing, 2026, MYBA, APA"
      creator="George Yachts Brokerage House LLC"
    >
      <CoverPage />

      {/* PAGE 1 - INTRO + COST BUCKETS */}
      <ContentPage pageNum={2} totalPages={5}>
        <Text style={styles.sectionEyebrow}>{greeting}</Text>
        <Text style={styles.sectionTitle}>
          The 4 cost buckets of a Greek charter
        </Text>
        <Text style={styles.paragraph}>
          Every Greek yacht charter quote breaks into four distinct costs.
          Understanding them is the difference between a clean number and an
          unwelcome surprise on the morning of embarkation.
        </Text>

        <View style={styles.costBucket}>
          <Text style={styles.costBucketNum}>1</Text>
          <View style={styles.costBucketBody}>
            <Text style={styles.costBucketLabel}>Base Charter Fee</Text>
            <Text style={styles.costBucketDetail}>
              The weekly hire of the yacht and its full crew. This is the
              headline number every operator quotes. Includes crew salaries,
              insurance, normal maintenance, linens, and standard onboard
              amenities. Excludes everything below.
            </Text>
          </View>
        </View>

        <View style={styles.costBucket}>
          <Text style={styles.costBucketNum}>2</Text>
          <View style={styles.costBucketBody}>
            <Text style={styles.costBucketLabel}>
              APA (Advance Provisioning Allowance) - 25 to 35%
            </Text>
            <Text style={styles.costBucketDetail}>
              Working float held by the captain. Covers fuel, food, drink,
              port fees, and laundry during the charter. Receipted and any
              unspent balance is refunded at disembarkation. Motor yachts run
              30%, sailing yachts 25%, performance motor yachts 35%.
            </Text>
          </View>
        </View>

        <View style={styles.costBucket}>
          <Text style={styles.costBucketNum}>3</Text>
          <View style={styles.costBucketBody}>
            <Text style={styles.costBucketLabel}>Greek VAT - 12%</Text>
            <Text style={styles.costBucketDetail}>
              Reduced VAT rate on the base charter fee. Half of standard
              Greek VAT (24%). Among the most favourable Mediterranean
              regimes (compare French 10-22% effective, Italian 6.6-22%
              structured, Croatian 13%, Turkish 18%).
            </Text>
          </View>
        </View>

        <View style={styles.costBucket}>
          <Text style={styles.costBucketNum}>4</Text>
          <View style={styles.costBucketBody}>
            <Text style={styles.costBucketLabel}>
              Crew Gratuity - 5 to 20%
            </Text>
            <Text style={styles.costBucketDetail}>
              Cash tip paid to the crew at disembarkation. Greek-market 2026
              median is 10 to 12% of the base charter fee. Customary, not
              contractual. Distributed by the captain among the crew.
            </Text>
          </View>
        </View>
      </ContentPage>

      {/* PAGE 2 - YACHT TYPE PRICING */}
      <ContentPage pageNum={3} totalPages={5}>
        <Text style={styles.sectionEyebrow}>Pricing by yacht type</Text>
        <Text style={styles.sectionTitle}>
          Weekly base charter fee, peak July-August 2026
        </Text>
        <Text style={styles.paragraph}>
          Real Greek market 2026 numbers. Base fee only - excludes APA, VAT,
          delivery, and gratuity (add roughly 45-55% on top for the full
          loaded cost).
        </Text>
        <DataTable
          headers={YACHT_TYPES_TABLE.headers}
          rows={YACHT_TYPES_TABLE.rows}
        />

        <Text style={styles.sectionEyebrow}>Worked example</Text>
        <Text style={styles.sectionTitle}>
          35m motor yacht, 7 nights, peak July
        </Text>
        <Text style={styles.paragraph}>
          Base charter fee: <Text style={{ fontWeight: "bold" }}>€150,000</Text>{"  "}
          | APA 30%: €45,000 | Greek VAT 12%: €18,000 | Delivery (Athens
          base): €0 | Crew gratuity 12%: €18,000
        </Text>
        <Text style={[styles.paragraph, { fontWeight: "bold", color: NAVY }]}>
          Fully loaded total: €231,000 for the week (+54% over the headline).
        </Text>
      </ContentPage>

      {/* PAGE 3 - SEASONS + INTERNATIONAL COMPARISON */}
      <ContentPage pageNum={4} totalPages={5}>
        <Text style={styles.sectionEyebrow}>Season multipliers</Text>
        <Text style={styles.sectionTitle}>
          When to charter for value-quality balance
        </Text>
        <Text style={styles.paragraph}>
          Shoulder-season Greek charters land 15-40% below peak rates. Late
          September Cyclades and October Saronic Gulf are the hidden value
          windows - warm water, no Meltemi, restaurants still open.
        </Text>
        <DataTable
          headers={SEASON_MULTIPLIERS_TABLE.headers}
          rows={SEASON_MULTIPLIERS_TABLE.rows}
        />

        <Text style={styles.sectionEyebrow}>International comparison</Text>
        <Text style={styles.sectionTitle}>
          How Greek pricing stacks against Mediterranean alternatives
        </Text>
        <DataTable
          headers={COMPARISON_TABLE.headers}
          rows={COMPARISON_TABLE.rows}
        />
      </ContentPage>

      {/* PAGE 4 - PRACTICAL NOTES + CTA */}
      <ContentPage pageNum={5} totalPages={5}>
        <Text style={styles.sectionEyebrow}>Practical notes</Text>
        <Text style={styles.sectionTitle}>
          What this guide does not tell you
        </Text>
        <Text style={styles.paragraph}>
          Every charter is bespoke. The numbers above are mid-market typical
          values. Your specific charter price depends on the exact yacht,
          captain, exact dates, embarkation port, and current availability.
          For a real quote, ask George directly.
        </Text>
        <Text style={styles.paragraph}>
          The 12-passenger rule (SOLAS) caps every commercial charter at 12
          overnight guests regardless of yacht size. Groups of 13+ require
          either a multi-yacht flotilla or day-guest additions for specific
          events. Plan early; peak yacht availability for July-August thins
          rapidly after Q1.
        </Text>
        <Text style={styles.paragraph}>
          The Meltemi - the Aegean northerly summer wind - blows 20-30 knots
          in the Cyclades during late July and August. A competent captain
          routes around it (southerly anchorages on wind days). For
          Meltemi-averse charterers, the Saronic Gulf and Ionian Sea remain
          wind-protected throughout summer.
        </Text>

        <View style={styles.ctaBlock}>
          <Text style={styles.ctaTitle}>Ready to plan your 2026 charter?</Text>
          <Text style={styles.ctaBody}>
            George P. Biniaris handles every charter inquiry personally. No
            intermediaries, no junior staff handoff. MYBA-standard contracts.
            Reply within 24 hours.
          </Text>
          <Link src="https://georgeyachts.com/inquiry" style={styles.ctaButton}>
            Write to George at georgeyachts.com/inquiry
          </Link>
        </View>

        <Text style={[styles.paragraph, { marginTop: 20, fontSize: 9, opacity: 0.7 }]}>
          Or speak directly: <Text style={{ color: GOLD }}>+30 6970380999</Text>{"  "}
          (Athens) ·{" "}
          <Text style={{ color: GOLD }}>+44 2037692707</Text> (London) ·{" "}
          <Text style={{ color: GOLD }}>+1 7867988798</Text> (Miami)
        </Text>
        <Text style={[styles.paragraph, { fontSize: 9, opacity: 0.7 }]}>
          Email: <Text style={{ color: GOLD }}>george@georgeyachts.com</Text>
        </Text>

        <Text
          style={[
            styles.paragraph,
            { fontSize: 8, opacity: 0.55, marginTop: 30 },
          ]}
        >
          (c) 2026 George Yachts Brokerage House LLC. All figures reflect
          mid-market typical values as of May 2026. Always confirm specifics
          with your broker before committing to a charter.
        </Text>
      </ContentPage>
    </Document>
  );
}
