// O.2 (Roberto brief, May 2026) — GDPR data deletion request page.
// Public-facing form at /privacy/delete. POSTs to /api/privacy-deletion
// which fires Telegram + email so George can action the request manually
// within the GDPR 30-day window. Self-service automatic deletion isn't
// safe (booked-charter records have legal hold reasons), so this is a
// human-in-the-loop request flow rather than a one-click wipe.

import DeletionForm from "./DeletionForm";
import Footer from "@/app/components/Footer";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Request Data Deletion",
  description:
    "Request deletion of your personal data held by George Yachts Brokerage House. We action requests within 30 days per GDPR.",
  alternates: { canonical: "https://georgeyachts.com/privacy/delete" },
  robots: { index: true, follow: true },
};

const GOLD = "#C9A84C";

export default function DeletionPage() {
  const breadcrumbs = [
    { name: "Home", url: "https://georgeyachts.com/" },
    { name: "Privacy Policy", url: "https://georgeyachts.com/privacy-policy" },
    { name: "Request Data Deletion", url: "https://georgeyachts.com/privacy/delete" },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <article style={{ background: "#0D1B2A", minHeight: "100vh", paddingBottom: 60 }}>
        <header
          style={{
            padding: "120px 24px 48px",
            borderBottom: "1px solid rgba(201,168,76,0.15)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 9,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 18px",
            }}
          >
            GDPR · Article 17
          </p>
          <h1
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 300,
              color: "#F8F5F0",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            Request data deletion
          </h1>
          <p
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(248, 245, 240,0.78)",
              margin: "0 auto",
              maxWidth: 640,
            }}
          >
            You can ask us to delete the personal data we hold about you - this is your right under the
            EU General Data Protection Regulation (Article 17, &ldquo;the right to be forgotten&rdquo;) and
            equivalent UK / Greek transposition. We action verified requests within 30 days. Some records
            (signed charter agreements, financial transactions) carry a legal-hold obligation we&rsquo;ll
            explain in our reply.
          </p>
        </header>

        <section style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 540, margin: "0 auto" }}>
            <DeletionForm />
            <p
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 12,
                lineHeight: 1.7,
                color: "rgba(248, 245, 240,0.55)",
                margin: "32px 0 0",
                textAlign: "center",
              }}
            >
              Prefer email? Write to{" "}
              <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>
                george@georgeyachts.com
              </a>{" "}
              from the email address whose data you&rsquo;re requesting we delete.
            </p>
          </div>
        </section>
      </article>
      <Footer />
    </>
  );
}
