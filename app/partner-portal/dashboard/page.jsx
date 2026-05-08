// J.2 — Partner-portal dashboard. Server-side gated by the
// gy_partner_session cookie + KV-backed session lookup. Visitors
// without a valid session bounce to /partner-portal.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/app/components/Footer";
import LogoutButton from "./LogoutButton";
import { readSession, SESSION_COOKIE } from "@/lib/partner-portal";

export const metadata = {
  title: "Partner Dashboard | George Yachts",
  robots: { index: false, follow: false },
};

const GOLD = "#C9A84C";

export default async function DashboardPage() {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  const session = await readSession(token);
  if (!session) {
    redirect("/partner-portal");
  }

  const partnerName = session.partnerName || session.email.split("@")[0];

  return (
    <>
      <article style={{ background: "#0D1B2A", minHeight: "100vh", paddingBottom: 80 }}>
        <header
          style={{
            padding: "100px 24px 36px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: GOLD, fontWeight: 600, margin: "0 0 12px" }}>
                Partner Portal
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(34px, 5vw, 48px)", fontWeight: 300, color: "#fff", margin: "0 0 6px", lineHeight: 1.1 }}>
                Welcome back, <em style={{ color: GOLD, fontStyle: "italic" }}>{partnerName}</em>
              </h1>
              <p style={{ fontFamily: "'Lato', 'Montserrat', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0 }}>
                Signed in as {session.email}
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <section style={{ padding: "48px 24px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {/* Lead pipeline (placeholder) */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>Your client pipeline</p>
              <h3 style={cardTitle}>Lead → Proposal → Booked</h3>
              <p style={cardBody}>
                Contact-by-contact pipeline view ships in the next portal release. For now, write to{" "}
                <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>
                  george@georgeyachts.com
                </a>{" "}
                for an updated status on any lead you&rsquo;ve sent us. He responds within the day.
              </p>
            </div>

            {/* Commissions (placeholder) */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>Commission ledger</p>
              <h3 style={cardTitle}>Paid + pending</h3>
              <p style={cardBody}>
                George reviews + reconciles partner commissions on the 1st of each month. Payment within 7-10 days of the signed MYBA contract. Detailed breakdown delivered by email each cycle.
              </p>
            </div>

            {/* White-label assets */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>White-label assets</p>
              <h3 style={cardTitle}>PDF templates & brand kits</h3>
              <p style={cardBody}>
                Use our Smart Proposal Generator to render a magazine-grade PDF with up to 5 yachts, branded entirely under your agency&rsquo;s identity. Reach out to George if you want the white-label cover swap activated for your account.
              </p>
              <Link href="/proposal-generator" style={ctaLink}>
                Open Smart Proposal Generator →
              </Link>
            </div>

            {/* Priority allocation */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>Priority allocation</p>
              <h3 style={cardTitle}>New fleet additions first</h3>
              <p style={cardBody}>
                Approved partners see new yachts before they hit the public site. Latest additions are shared via the partner Telegram channel. If you haven&rsquo;t been added yet, message George directly with your handle.
              </p>
            </div>

            {/* Direct line */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>Direct line</p>
              <h3 style={cardTitle}>Skip the queue</h3>
              <p style={cardBody}>
                Partners get a dedicated WhatsApp + Telegram channel to George. Same-day quote turnarounds, real-time availability checks, no copy-paste forms.
              </p>
              <a
                href="https://wa.me/17867988798"
                target="_blank"
                rel="noopener noreferrer"
                style={ctaLink}
              >
                WhatsApp George →
              </a>
            </div>

            {/* Resources */}
            <div style={cardStyle}>
              <p style={cardEyebrow}>Resources</p>
              <h3 style={cardTitle}>For your client conversations</h3>
              <p style={cardBody}>
                <Link href="/charter-yacht-greece" style={{ color: GOLD, textDecoration: "underline" }}>Live fleet</Link> · <Link href="/cost-calculator" style={{ color: GOLD, textDecoration: "underline" }}>Cost calculator</Link> · <Link href="/yacht-finder" style={{ color: GOLD, textDecoration: "underline" }}>Smart Match Quiz</Link>
              </p>
            </div>
          </div>

          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontSize: 12,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              textAlign: "center",
              margin: "40px auto 0",
              maxWidth: 720,
              fontStyle: "italic",
            }}
          >
            This is the V1 partner portal. Per-lead pipeline view, commission ledger UI, and downloadable brand
            kits are on the next-quarter roadmap. If there&rsquo;s a specific tool that would change your week,
            tell George — partner feedback shapes the priority list.
          </p>
        </section>
      </article>
      <Footer />
    </>
  );
}

const cardStyle = {
  background: "rgba(201,168,76,0.025)",
  border: "1px solid rgba(201,168,76,0.2)",
  padding: "22px 24px 24px",
};

const cardEyebrow = {
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  margin: "0 0 6px",
};

const cardTitle = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 22,
  fontWeight: 400,
  color: "#fff",
  margin: "0 0 12px",
  lineHeight: 1.2,
};

const cardBody = {
  fontFamily: "'Lato', 'Montserrat', sans-serif",
  fontSize: 13.5,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.75)",
  margin: 0,
};

const ctaLink = {
  display: "inline-block",
  marginTop: 14,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 10,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: GOLD,
  fontWeight: 600,
  textDecoration: "none",
  borderBottom: `1px solid ${GOLD}`,
  paddingBottom: 2,
};
