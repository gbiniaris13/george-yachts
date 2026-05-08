// J.2 — Partner portal sign-in page.
import LoginForm from "./LoginForm";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Partner Portal | George Yachts",
  description:
    "Approved travel-trade partners — sign in to access white-label assets, commission updates, and priority allocation.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://georgeyachts.com/partner-portal" },
};

const GOLD = "#C9A84C";

export default function PartnerPortalPage() {
  return (
    <>
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
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 9,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: GOLD,
              fontWeight: 600,
              margin: "0 0 18px",
            }}
          >
            Partner Portal · George Yachts
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(34px, 5vw, 52px)",
              fontWeight: 300,
              color: "#fff",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            Sign in
          </h1>
          <p
            style={{
              fontFamily: "'Lato', 'Montserrat', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            For approved travel-trade partners. Enter the email George registered for your agency &mdash; we&rsquo;ll send a magic-link to your inbox.
          </p>
        </header>

        <section style={{ padding: "56px 24px" }}>
          <div style={{ maxWidth: 460, margin: "0 auto" }}>
            <LoginForm />
            <p
              style={{
                fontFamily: "'Lato', 'Montserrat', sans-serif",
                fontSize: 12,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                margin: "32px 0 0",
                textAlign: "center",
              }}
            >
              Not a partner yet? Apply via{" "}
              <a href="/partners" style={{ color: GOLD }}>
                /partners
              </a>
              {" "}or write to{" "}
              <a href="mailto:george@georgeyachts.com" style={{ color: GOLD }}>
                george@georgeyachts.com
              </a>
              .
            </p>
          </div>
        </section>
      </article>
      <Footer />
    </>
  );
}
