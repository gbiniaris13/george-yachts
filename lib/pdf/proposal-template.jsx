// Q.1 (Roberto brief, May 2026) — Smart Proposal PDF template.
//
// Renders a magazine-style PDF of up to 5 yachts using
// @react-pdf/renderer. Layout per brief:
//   • Cover page — George Yachts wordmark, client name, date.
//   • One page per yacht — hero photo, specs grid, price block,
//     George's insider tip.
//   • Final page — contact info, Calendly, WhatsApp, George's photo.
//
// Fonts: Cormorant Garamond (display) + Montserrat (body), fetched
// from Google's static CDN at first render. We fall back to
// Times-Roman/Helvetica if the fetch fails — better degraded than
// no PDF at all.

import {
  Document,
  Page,
  View,
  Text,
  Image as PdfImage,
  StyleSheet,
  Font,
  Link as PdfLink,
} from "@react-pdf/renderer";

// ─── Brand palette ───
const NAVY = "#0D1B2A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#C9A84C";
const INK = "#0D1B2A";
const MUTED = "#6b6b6b";
const PAPER = "#F8F5F0";

// ─── Font registration ───
// Wrapped in try so a missing CDN doesn't break the renderer.
let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  try {
    Font.register({
      family: "Cormorant",
      fonts: [
        {
          src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3YmX5slCNuHLi8bLeY9MK7whWMhyjornFLsS6V7w.ttf",
          fontWeight: 400,
        },
        {
          src: "https://fonts.gstatic.com/s/cormorantgaramond/v16/co3WmX5slCNuHLi8bLeYa15efrxWohYUrL0R-pyTdg.ttf",
          fontWeight: 600,
        },
      ],
    });
    Font.register({
      family: "Montserrat",
      fonts: [
        {
          src: "https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyzbi.ttf",
          fontWeight: 400,
        },
        {
          src: "https://fonts.gstatic.com/s/montserrat/v25/JTURjIg1_i6t8kCHKm45_dJE3gnD-w.ttf",
          fontWeight: 600,
        },
        {
          src: "https://fonts.gstatic.com/s/montserrat/v25/JTURjIg1_i6t8kCHKm45_bZF3gnD-w.ttf",
          fontWeight: 700,
        },
      ],
    });
    fontsRegistered = true;
  } catch {
    // leave unregistered → react-pdf falls back to Helvetica/Times
  }
}

// ─── Styles ───
const styles = StyleSheet.create({
  // Cover
  cover: {
    backgroundColor: NAVY,
    color: "#F8F5F0",
    padding: 56,
    flex: 1,
    justifyContent: "space-between",
  },
  coverEyebrow: {
    fontFamily: "Montserrat",
    fontSize: 8,
    letterSpacing: 4,
    textTransform: "uppercase",
    color: GOLD_LIGHT,
    fontWeight: 600,
  },
  coverWordmark: {
    fontFamily: "Cormorant",
    fontSize: 56,
    fontWeight: 400,
    color: "#F8F5F0",
    letterSpacing: 1,
    marginTop: 28,
  },
  coverTagline: {
    fontFamily: "Cormorant",
    fontSize: 18,
    fontStyle: "italic",
    color: GOLD_LIGHT,
    marginTop: 12,
  },
  coverGoldLine: {
    width: 60,
    height: 1,
    backgroundColor: GOLD,
    marginTop: 36,
    marginBottom: 36,
  },
  coverIntro: {
    fontFamily: "Cormorant",
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(248, 245, 240,0.78)",
  },
  coverFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  coverFooterLabel: {
    fontFamily: "Montserrat",
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD_LIGHT,
    fontWeight: 600,
  },
  coverFooterValue: {
    fontFamily: "Cormorant",
    fontSize: 16,
    color: "#F8F5F0",
    marginTop: 4,
  },

  // Yacht page
  yachtPage: {
    backgroundColor: PAPER,
    padding: 0,
    flex: 1,
  },
  yachtHero: {
    width: "100%",
    height: 280,
    objectFit: "cover",
  },
  yachtBody: {
    padding: "32px 56px",
  },
  yachtEyebrow: {
    fontFamily: "Montserrat",
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD,
    fontWeight: 600,
  },
  yachtName: {
    fontFamily: "Cormorant",
    fontSize: 36,
    fontWeight: 400,
    color: NAVY,
    marginTop: 4,
    marginBottom: 4,
  },
  yachtSubtitle: {
    fontFamily: "Cormorant",
    fontSize: 14,
    fontStyle: "italic",
    color: MUTED,
    marginBottom: 24,
  },
  specsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderTop: `1px solid ${GOLD}30`,
    borderBottom: `1px solid ${GOLD}30`,
    paddingTop: 16,
    paddingBottom: 16,
    marginBottom: 18,
  },
  specCol: {
    width: "33%",
    paddingBottom: 8,
  },
  specLabel: {
    fontFamily: "Montserrat",
    fontSize: 7,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: MUTED,
    fontWeight: 600,
  },
  specValue: {
    fontFamily: "Cormorant",
    fontSize: 13,
    color: INK,
    marginTop: 2,
  },
  priceBlock: {
    backgroundColor: NAVY,
    color: "#F8F5F0",
    padding: "16px 18px",
    marginBottom: 16,
  },
  priceUnit: {
    fontFamily: "Montserrat",
    fontSize: 7,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD_LIGHT,
    fontWeight: 600,
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: "Cormorant",
    fontSize: 22,
    color: "#F8F5F0",
  },
  insiderBlock: {
    borderLeft: `3px solid ${GOLD}`,
    paddingLeft: 14,
    marginTop: 8,
  },
  insiderLabel: {
    fontFamily: "Montserrat",
    fontSize: 7,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: GOLD,
    fontWeight: 600,
    marginBottom: 4,
  },
  insiderText: {
    fontFamily: "Cormorant",
    fontSize: 13,
    fontStyle: "italic",
    color: INK,
    lineHeight: 1.6,
  },

  // Final page
  finalPage: {
    backgroundColor: NAVY,
    color: "#F8F5F0",
    padding: 56,
    flex: 1,
    justifyContent: "space-between",
  },
  finalHeading: {
    fontFamily: "Cormorant",
    fontSize: 36,
    color: "#F8F5F0",
    marginBottom: 12,
  },
  finalParagraph: {
    fontFamily: "Cormorant",
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(248, 245, 240,0.78)",
    marginBottom: 24,
  },
  finalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  finalRowLabel: {
    fontFamily: "Montserrat",
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: GOLD_LIGHT,
    fontWeight: 600,
    width: 100,
  },
  finalRowValue: {
    fontFamily: "Cormorant",
    fontSize: 14,
    color: "#F8F5F0",
  },
  pageFooter: {
    fontFamily: "Montserrat",
    fontSize: 7,
    color: "rgba(13, 27, 42,0.4)",
    textAlign: "center",
    paddingTop: 12,
    paddingBottom: 12,
  },
});

// ─── Helpers ───
function formatDate(d) {
  try {
    const dt = d instanceof Date ? d : new Date(d || Date.now());
    return dt.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function priceUnitFor(yacht) {
  const model = yacht?.priceModel || (yacht?.fleetTier === "explorer" ? "per_person_week" : "per_yacht_week");
  return model === "per_person_week" ? "Per person · per week" : "Per yacht · per week";
}

// Forces remote images to https + adds a Sanity transform when applicable
function safeImageUrl(url, w = 1400) {
  if (!url) return null;
  if (typeof url !== "string") return null;
  if (url.includes("cdn.sanity.io")) {
    return `${url}?w=${w}&fit=max&auto=format`;
  }
  return url;
}

// ─── Main document ───
export default function ProposalDocument({ name, dates, notes, yachts }) {
  registerFonts();

  const today = formatDate(new Date());
  const safeName = (name || "").trim() || "Welcome";
  const list = (yachts || []).filter(Boolean).slice(0, 5);

  return (
    <Document author="George P. Biniaris" title={`George Yachts - Proposal for ${safeName}`}>
      {/* COVER */}
      <Page size="A4" style={styles.cover}>
        <View>
          <Text style={styles.coverEyebrow}>George Yachts · Personalized Proposal</Text>
          <Text style={styles.coverWordmark}>George Yachts</Text>
          <Text style={styles.coverTagline}>Brokerage House · Greek Waters</Text>
          <View style={styles.coverGoldLine} />
          <Text style={styles.coverIntro}>
            {safeName.split(" ")[0] || "Friend"}, this is a curated shortlist drawn from the live fleet.
            {"\n\n"}
            Each of the following pages is a yacht we believe fits how you described your week - not a generic
            catalogue dump. The numbers here are indicative ranges; the exact figure follows in a written
            quote with availability for the dates you have in mind.
            {dates ? `\n\nRequested dates: ${dates}` : ""}
          </Text>
        </View>
        <View style={styles.coverFooter}>
          <View>
            <Text style={styles.coverFooterLabel}>Prepared for</Text>
            <Text style={styles.coverFooterValue}>{safeName}</Text>
          </View>
          <View>
            <Text style={styles.coverFooterLabel}>Date</Text>
            <Text style={styles.coverFooterValue}>{today}</Text>
          </View>
          <View>
            <Text style={styles.coverFooterLabel}>Yachts</Text>
            <Text style={styles.coverFooterValue}>{list.length}</Text>
          </View>
        </View>
      </Page>

      {/* YACHT PAGES */}
      {list.map((y, i) => {
        const heroUrl = safeImageUrl(y.image || y.heroUrl, 1400);
        return (
          <Page key={y.slug || i} size="A4" style={styles.yachtPage}>
            {heroUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <PdfImage src={heroUrl} style={styles.yachtHero} />
            )}
            <View style={styles.yachtBody}>
              <Text style={styles.yachtEyebrow}>
                Yacht {i + 1} of {list.length} · {y.fleetTier === "explorer" ? "Explorer Fleet" : "Private Fleet"}
              </Text>
              <Text style={styles.yachtName}>{y.name || "-"}</Text>
              {y.subtitle && <Text style={styles.yachtSubtitle}>{y.subtitle}</Text>}

              <View style={styles.specsRow}>
                {y.builder && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Build</Text>
                    <Text style={styles.specValue}>{y.builder}</Text>
                  </View>
                )}
                {y.length && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Length</Text>
                    <Text style={styles.specValue}>{y.length}</Text>
                  </View>
                )}
                {y.sleeps && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Sleeps</Text>
                    <Text style={styles.specValue}>{y.sleeps}</Text>
                  </View>
                )}
                {y.cabins && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Cabins</Text>
                    <Text style={styles.specValue}>{y.cabins}</Text>
                  </View>
                )}
                {y.crew && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Crew</Text>
                    <Text style={styles.specValue}>{y.crew}</Text>
                  </View>
                )}
                {y.cruisingRegion && (
                  <View style={styles.specCol}>
                    <Text style={styles.specLabel}>Region</Text>
                    <Text style={styles.specValue}>{y.cruisingRegion}</Text>
                  </View>
                )}
              </View>

              {y.weeklyRatePrice && (
                <View style={styles.priceBlock}>
                  <Text style={styles.priceUnit}>{priceUnitFor(y)}</Text>
                  <Text style={styles.priceValue}>{y.weeklyRatePrice}</Text>
                </View>
              )}

              {y.georgeInsiderTip && (
                <View style={styles.insiderBlock}>
                  <Text style={styles.insiderLabel}>George&apos;s insider note</Text>
                  <Text style={styles.insiderText}>{y.georgeInsiderTip}</Text>
                </View>
              )}
            </View>
            <Text style={styles.pageFooter}>
              George Yachts Brokerage House · georgeyachts.com · {y.slug ? `/yachts/${y.slug}` : ""}
            </Text>
          </Page>
        );
      })}

      {/* FINAL PAGE */}
      <Page size="A4" style={styles.finalPage}>
        <View>
          <Text style={styles.coverEyebrow}>Continue the conversation</Text>
          <Text style={styles.finalHeading}>Talk to George.</Text>
          <Text style={styles.finalParagraph}>
            Reply to this email or pick whichever channel works for you. I usually come back the same day -
            often within the hour. The numbers in this proposal are honest ranges; the exact figure for your
            dates and group lands in a written quote.
          </Text>
          {notes ? (
            <Text style={[styles.finalParagraph, { fontStyle: "italic" }]}>
              You wrote: &ldquo;{notes}&rdquo;
            </Text>
          ) : null}
          <View style={styles.finalRow}>
            <Text style={styles.finalRowLabel}>WhatsApp</Text>
            <PdfLink src="https://wa.me/17867988798" style={styles.finalRowValue}>
              +1 786 798 8798
            </PdfLink>
          </View>
          <View style={styles.finalRow}>
            <Text style={styles.finalRowLabel}>Email</Text>
            <PdfLink src="mailto:george@georgeyachts.com" style={styles.finalRowValue}>
              george@georgeyachts.com
            </PdfLink>
          </View>
          <View style={styles.finalRow}>
            <Text style={styles.finalRowLabel}>Book a call</Text>
            <PdfLink src="https://calendly.com/george-georgeyachts/30min" style={styles.finalRowValue}>
              30 minutes with George →
            </PdfLink>
          </View>
        </View>
        <View>
          <View style={styles.coverGoldLine} />
          <Text style={styles.coverIntro}>
            George P. Biniaris - Managing Broker, IYBA Member.
            {"\n"}
            George Yachts Brokerage House · MYBA-standard contracts · Independent broker.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
