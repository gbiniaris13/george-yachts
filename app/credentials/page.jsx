// Phase 4 / D1 (Boss luxury rebuild brief, 2026-05-05) —
// /credentials — the dedicated trust surface.
//
// One editorial page that consolidates the four credentials a UHNW
// guest checks before placing a deposit:
//
//   1. Forbes feature — independent journalism, May 2026
//   2. IYBA Charter Active Member — broker accreditation
//   3. MYBA-standard charter contracts — contract framework (we are
//      NOT a MYBA member; we use their standard form, which is the
//      legally-compliant phrasing per the Roberto legal directive §2)
//   4. Wyoming-registered LLC, Athens operations — US legal entity
//      with on-the-water Greek presence
//
// All text is server-rendered so AI crawlers + Googlebot read the
// credential evidence in the initial HTML. All Forbes / MYBA / IYBA
// usage follows the Roberto legal directive of 4 May 2026 to the
// letter.
//
// Mandatory disclaimer per directive §1 sits at the page footer in
// Lato Light 9px gray — exact wording, never paraphrased.

import Link from "next/link";
import Image from "next/image";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Credentials | Forbes · IYBA · MYBA · Wyoming-Athens | George Yachts",
  description:
    "George Yachts is featured in Forbes (May 2026), is an IYBA Charter Active Member, uses MYBA-standard charter contracts, and operates as a Wyoming-registered LLC with Athens-based brokerage operations.",
  alternates: { canonical: "https://georgeyachts.com/credentials" },
  openGraph: {
    title: "Credentials | George Yachts",
    description:
      "Independent journalism, professional broker membership, MYBA-standard contracts, US/Greek dual residency — the four trust surfaces that matter.",
    url: "https://georgeyachts.com/credentials",
    type: "article",
  },
};

const FORBES_URL =
  "https://www.forbes.com/sites/jacquesledbetter/2026/05/01/how-the-wealthy-are-hedging-for-instability/";

export default function CredentialsPage() {
  return (
    <>
      <main
        style={{
          background: "#050505",
          color: "#F8F5F0",
          paddingTop: "clamp(64px, 8vw, 120px)",
        }}
      >
        {/* HERO */}
        <section
          style={{
            padding:
              "clamp(48px, 6vw, 96px) clamp(24px, 6vw, 96px) clamp(72px, 9vw, 140px)",
            maxWidth: 1280,
            marginInline: "auto",
          }}
        >
          <p className="gy-eyebrow" style={{ color: "#C9A84C" }}>
            Credentials
          </p>
          <h1
            className="gy-display-xl"
            style={{
              maxWidth: "16ch",
              margin: "10px 0 32px",
              letterSpacing: "-0.035em",
            }}
          >
            What stands behind every charter we write.
          </h1>
          <p
            className="gy-lede"
            style={{ color: "rgba(248,245,240,0.78)", maxWidth: "62ch" }}
          >
            UHNW guests verify before they deposit. So do their family offices,
            their lawyers, and their advisers. Here is the documentary trail —
            independent journalism, professional broker membership, contract
            framework, and the legal entity that signs your agreement.
          </p>
        </section>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        {/* FORBES */}
        <section
          aria-label="Forbes feature credential"
          data-gy-reveal="up"
          style={{
            padding: "clamp(56px, 8vw, 120px) clamp(24px, 6vw, 96px)",
            maxWidth: 1280,
            marginInline: "auto",
          }}
        >
          <div className="gy-grid-editorial" style={{ padding: 0 }}>
            <div className="gy-col-text-wide" style={{ gridColumn: undefined }}>
              <p className="gy-eyebrow-sm" style={{ color: "#C9A84C" }}>
                01 · Independent journalism
              </p>
              <h2
                className="gy-display-md"
                style={{
                  margin: "10px 0 24px",
                  maxWidth: "20ch",
                }}
              >
                Featured in{" "}
                <span
                  aria-label="Forbes"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Forbes
                </span>
                , May 2026.
              </h2>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(248,245,240,0.82)",
                  fontWeight: 300,
                  maxWidth: "60ch",
                }}
              >
                George P. Biniaris is quoted in Jacques Ledbetter's Forbes
                feature on how UHNW families are hedging against instability —
                the geopolitical pressures shifting yacht charter demand from
                volatile regions toward Greek waters. Editorial mention,
                independent journalism, no paid placement.
              </p>

              {/* Pull quote */}
              <blockquote
                cite={FORBES_URL}
                style={{
                  margin: "32px 0 0",
                  padding: "24px 0 0",
                  borderTop: "1px solid rgba(201,168,76,0.4)",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 2.6vw, 32px)",
                  fontWeight: 300,
                  lineHeight: 1.4,
                  color: "#F8F5F0",
                  maxWidth: "44ch",
                }}
              >
                &ldquo;That&rsquo;s the geopolitical shift playing out in real
                time on my desk.&rdquo;
                <footer
                  style={{
                    fontFamily: "'Lato', 'Montserrat', sans-serif",
                    fontStyle: "normal",
                    fontSize: 13,
                    fontWeight: 300,
                    color: "rgba(248,245,240,0.6)",
                    marginTop: 18,
                    letterSpacing: "0.04em",
                  }}
                >
                  — George P. Biniaris, in{" "}
                  <span
                    style={{
                      fontFamily: "'Times New Roman', Times, serif",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      color: "#F8F5F0",
                    }}
                  >
                    Forbes
                  </span>
                  , 1 May 2026
                </footer>
              </blockquote>

              <Link
                href={FORBES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="gy-link-editorial"
                style={{ marginTop: 32, display: "inline-block" }}
                data-cursor="Read"
              >
                Read the full feature on{" "}
                <span
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "inherit",
                  }}
                >
                  Forbes
                </span>{" "}
                →
              </Link>
            </div>
          </div>
        </section>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        {/* IYBA */}
        <section
          aria-label="IYBA Charter Active Member credential"
          data-gy-reveal="up"
          style={{
            padding: "clamp(56px, 8vw, 120px) clamp(24px, 6vw, 96px)",
            maxWidth: 1280,
            marginInline: "auto",
          }}
        >
          <div className="gy-grid-editorial" style={{ padding: 0 }}>
            <div className="gy-col-text" style={{ gridColumn: undefined }}>
              <p className="gy-eyebrow-sm" style={{ color: "#C9A84C" }}>
                02 · Broker accreditation
              </p>
              <h2
                className="gy-display-md"
                style={{ margin: "10px 0 24px", maxWidth: "20ch" }}
              >
                IYBA Charter Active&nbsp;Member.
              </h2>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(248,245,240,0.82)",
                  fontWeight: 300,
                  maxWidth: "60ch",
                }}
              >
                The International Yacht Brokers Association is the global
                professional body for charter and sales brokers. Charter Active
                Members are vetted on professional conduct, bonding, and
                experience. Membership is a continuous standard, not a one-time
                certificate.
              </p>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(248,245,240,0.6)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  margin: "20px 0 0",
                  maxWidth: "56ch",
                }}
              >
                Why it matters: when a deposit is being wired, you want a
                broker the industry's professional body will publicly stand
                behind.
              </p>
              <a
                href="https://iyba.org"
                target="_blank"
                rel="noopener noreferrer"
                className="gy-link-editorial"
                style={{ marginTop: 32, display: "inline-block" }}
                data-cursor="Verify"
              >
                Verify on iyba.org →
              </a>
            </div>
            <div
              className="gy-col-image-narrow"
              style={{
                gridColumn: undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(32px, 5vw, 56px)",
                background:
                  "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, rgba(13,27,42,0.6) 100%)",
                border: "1px solid rgba(201,168,76,0.18)",
              }}
            >
              <a
                href="https://iyba.org"
                target="_blank"
                rel="noopener noreferrer"
                title="International Yacht Brokers Association"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 18,
                  textDecoration: "none",
                }}
              >
                <Image
                  src="/images/iyba-official-white.png"
                  alt="IYBA — International Yacht Brokers Association"
                  width={240}
                  height={56}
                  style={{ height: "auto", width: 240 }}
                />
                <span
                  className="gy-eyebrow-sm"
                  style={{
                    color: "rgba(248,245,240,0.6)",
                    letterSpacing: "0.32em",
                  }}
                >
                  Charter Active Member
                </span>
              </a>
            </div>
          </div>
        </section>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        {/* MYBA — text only per legal directive */}
        <section
          aria-label="MYBA-standard charter contracts"
          data-gy-reveal="up"
          style={{
            padding: "clamp(56px, 8vw, 120px) clamp(24px, 6vw, 96px)",
            maxWidth: 1280,
            marginInline: "auto",
          }}
        >
          <div className="gy-grid-editorial" style={{ padding: 0 }}>
            <div className="gy-col-text-wide" style={{ gridColumn: undefined }}>
              <p className="gy-eyebrow-sm" style={{ color: "#C9A84C" }}>
                03 · Contract framework
              </p>
              <h2
                className="gy-display-md"
                style={{ margin: "10px 0 24px", maxWidth: "22ch" }}
              >
                Charter contracts based on the MYBA&nbsp;standard.
              </h2>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "rgba(248,245,240,0.82)",
                  fontWeight: 300,
                  maxWidth: "60ch",
                }}
              >
                Every charter we write uses the MYBA Charter Agreement — the
                Mediterranean industry's standard contract framework.
                Definitions, deposit handling, advance provisioning allowance
                (APA), force-majeure language, and dispute resolution all
                inherit from the MYBA template that's been refined over four
                decades of professional charter practice.
              </p>
              <p
                style={{
                  fontFamily: "'Lato', 'Montserrat', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: "rgba(248,245,240,0.6)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  margin: "20px 0 0",
                  maxWidth: "56ch",
                }}
              >
                Why it matters: when something unexpected happens at sea, you
                want a contract that's already been tested by every senior
                Mediterranean broker, captain, and lawyer who came before us.
              </p>
            </div>
          </div>
        </section>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        {/* US / GREEK DUAL RESIDENCY */}
        <section
          aria-label="US legal entity, Greek operations"
          data-gy-reveal="up"
          style={{
            padding: "clamp(56px, 8vw, 120px) clamp(24px, 6vw, 96px)",
            maxWidth: 1280,
            marginInline: "auto",
          }}
        >
          <div className="gy-grid-editorial" style={{ padding: 0 }}>
            <div className="gy-col-full" style={{ gridColumn: undefined }}>
              <p className="gy-eyebrow-sm" style={{ color: "#C9A84C" }}>
                04 · Dual residency
              </p>
              <h2
                className="gy-display-lg"
                style={{
                  margin: "10px 0 32px",
                  maxWidth: "22ch",
                  letterSpacing: "-0.025em",
                }}
              >
                Registered in Wyoming. Berthed in&nbsp;Athens.
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "clamp(32px, 5vw, 64px)",
                  marginTop: 24,
                }}
              >
                <div>
                  <p
                    className="gy-eyebrow-sm"
                    style={{ color: "rgba(248,245,240,0.55)", marginBottom: 14 }}
                  >
                    The legal entity
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "#F8F5F0",
                      margin: "0 0 12px",
                      lineHeight: 1.2,
                    }}
                  >
                    George Yachts Brokerage House LLC
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato', 'Montserrat', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "rgba(248,245,240,0.72)",
                      fontWeight: 300,
                    }}
                  >
                    Wyoming, United States — registered LLC. Charter agreements
                    are written and signed under U.S. company law, giving
                    non-Greek guests the legal recourse they expect from a
                    U.S. counterparty.
                  </p>
                  <address
                    style={{
                      fontStyle: "normal",
                      fontFamily: "'Lato', 'Montserrat', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: "rgba(248,245,240,0.85)",
                      letterSpacing: "0.02em",
                      marginTop: 18,
                      paddingTop: 16,
                      borderTop: "1px solid rgba(201,168,76,0.25)",
                      maxWidth: "32ch",
                    }}
                  >
                    George Yachts Brokerage House LLC<br />
                    30 N Gould St, STE R<br />
                    Sheridan, WY 82801<br />
                    United States
                  </address>
                </div>

                <div>
                  <p
                    className="gy-eyebrow-sm"
                    style={{ color: "rgba(248,245,240,0.55)", marginBottom: 14 }}
                  >
                    The brokerage operation
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: 26,
                      fontWeight: 400,
                      color: "#F8F5F0",
                      margin: "0 0 12px",
                      lineHeight: 1.2,
                    }}
                  >
                    Athens, Greece
                  </p>
                  <p
                    style={{
                      fontFamily: "'Lato', 'Montserrat', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "rgba(248,245,240,0.72)",
                      fontWeight: 300,
                    }}
                  >
                    Boots on the ground in the Greek charter network. The
                    brokers who write your contract are the same people who
                    walk the docks at Flisvos and Vouliagmeni weekly through
                    the season. Local fluency, not a referral chain.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <span aria-hidden="true" className="gy-divider-star">
          <span />
        </span>

        {/* CTA */}
        <section
          style={{
            padding:
              "clamp(72px, 10vw, 140px) clamp(24px, 6vw, 96px) clamp(96px, 12vw, 160px)",
            textAlign: "center",
            background: "linear-gradient(180deg, #050505 0%, #000000 100%)",
            borderTop: "1px solid rgba(248,245,240,0.06)",
          }}
        >
          <p className="gy-eyebrow" style={{ color: "#C9A84C" }}>
            Verified. Now brief us.
          </p>
          <h2
            className="gy-display-md"
            style={{ margin: "16px auto 0", maxWidth: "22ch" }}
          >
            The credentials are documentary. The relationship is&nbsp;personal.
          </h2>
          <p
            className="gy-lede"
            style={{
              margin: "24px auto 36px",
              maxWidth: "52ch",
              color: "rgba(248,245,240,0.7)",
            }}
          >
            Six quick questions, one personal reply from George within
            twenty-four hours.
          </p>
          <Link
            href="/inquiry"
            className="gy-shimmer-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "20px 40px",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#0a0a0a",
              textDecoration: "none",
              background: "linear-gradient(135deg, #E6C77A 0%, #C9A84C 100%)",
              border: "1px solid #C9A84C",
              boxShadow: "0 12px 32px rgba(201,168,76,0.22)",
            }}
          >
            Brief George →
          </Link>
        </section>

        {/* Mandatory legal disclaimer per Roberto legal directive §1
            (4 May 2026). Lato Light 9px, gray, italic, exact text. */}
        <section
          aria-label="Editorial citation disclaimer"
          style={{
            padding: "0 24px 36px",
            textAlign: "center",
            background: "#050505",
          }}
        >
          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: 9,
              color: "#888",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 880,
              marginInline: "auto",
              fontStyle: "italic",
            }}
          >
            Forbes, MYBA, and IYBA references on this page are made under
            nominative fair use principles for factual identification of
            editorial coverage, contract standards, and membership status.
            Editorial mentions do not constitute endorsement.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
