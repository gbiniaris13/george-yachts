// /newsletter — public 4-stream signup landing page.
//
// Brief §5 + §17 + §15. Four named streams, each with a one-line
// audience cue + voice cue. Visitor picks one or more, leaves email,
// hits Subscribe.
//
// Design ties into the existing site: ivory paper background, deep
// navy ink, antique gold accent, Cormorant Garamond serif headings,
// Montserrat sans uppercase eyebrows. Same palette as the email
// template so the signup → first email feels like the same surface.

import NewsletterSignupClient from "./NewsletterSignupClient";

export const metadata = {
  title: "Subscribe — The George Yachts Journals",
  description:
    "Four short letters from the Greek waters. Pick the one that fits — or more than one. Insider, never noisy. Always reply-to-george.",
  alternates: { canonical: "https://georgeyachts.com/newsletter" },
  robots: { index: true, follow: true },
};

const STREAMS = [
  {
    key: "bridge",
    name: "The Bridge",
    audience: "For the charter client",
    cadence: "Bi-weekly · Thursdays",
    description:
      "A short read every other Thursday. One thing worth knowing — a market signal, a story from a charter, a quiet piece of insider intel. No pitches. No calendars of yachts. The kind of thing a working broker would tell a friend.",
    voice: "Insider letter, never sales.",
    recommended: true,
  },
  {
    key: "wake",
    name: "The Wake",
    audience: "For travel advisors and concierges",
    cadence: "Monthly · 15th",
    description:
      "Commission-friendly intel for the people who place clients with us. Booking signals, white-label talking points, what's filling and what's not. Forward-friendly with attribution. Reply with a brief and you'll get a proposal in 24 hours.",
    voice: "Peer-to-peer with the trade.",
    recommended: false,
  },
  {
    key: "compass",
    name: "The Compass",
    audience: "For broker peers and industry insiders",
    cadence: "Bi-monthly · 1st",
    description:
      "Short market reads from one Greek brokerage to another. No promotional content, ever. Geopolitical reads, regulatory shifts, what we're seeing across the Aegean and Ionian. Reply if you have something worth comparing notes on.",
    voice: "Peer signals only.",
    recommended: false,
  },
  {
    key: "greece",
    name: "Από την Ελλάδα",
    audience: "For the Greek-speaking circle",
    cadence: "Ad hoc",
    description:
      "Στα ελληνικά, χωρίς πρόγραμμα. Ιστορίες από τη θάλασσα, σκέψεις της σεζόν, μικρά νέα από την εταιρεία. Όταν αξίζει, και μόνο τότε.",
    voice: "Casual, real, written by George.",
    recommended: false,
  },
];

export default function NewsletterPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F5F0",
        color: "#0D1B2A",
        padding: "0",
      }}
    >
      <header
        style={{
          textAlign: "center",
          padding: "80px 24px 40px 24px",
          background:
            "linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,1) 100%), #F8F5F0",
          borderBottom: "1px solid rgba(13,27,42,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
            fontSize: 10,
            letterSpacing: "0.45em",
            color: "#C9A84C",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          George Yachts
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: 300,
            fontSize: "clamp(36px, 6vw, 64px)",
            margin: "16px 0 8px 0",
            letterSpacing: "0.02em",
          }}
        >
          The Journals
        </h1>
        <div
          aria-hidden="true"
          style={{
            width: 60,
            height: 1,
            background: "#C9A84C",
            margin: "16px auto 24px auto",
          }}
        />
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 620,
            margin: "0 auto",
            color: "rgba(13,27,42,0.78)",
            fontStyle: "italic",
          }}
        >
          Four short letters from the Greek waters. Pick the one that fits —
          or more than one. Insider, never noisy. Always reply-to-george.
        </p>
      </header>

      <NewsletterSignupClient streams={STREAMS} />

      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px 64px 24px",
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          color: "rgba(13,27,42,0.45)",
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: "0 0 6px 0" }}>
          You can unsubscribe with one click from any letter we send. We never
          share your address. Reply directly any time —{" "}
          <a
            href="mailto:george@georgeyachts.com"
            style={{ color: "#0D1B2A", textDecoration: "underline" }}
          >
            george@georgeyachts.com
          </a>
          .
        </p>
        <p style={{ margin: 0 }}>
          <a
            href="/privacy-policy"
            style={{ color: "rgba(13,27,42,0.55)", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>{" "}
          ·{" "}
          <a
            href="https://georgeyachts.com"
            style={{ color: "rgba(13,27,42,0.55)", textDecoration: "underline" }}
          >
            georgeyachts.com
          </a>
        </p>
      </footer>
    </main>
  );
}
