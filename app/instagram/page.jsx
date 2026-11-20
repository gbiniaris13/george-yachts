// /instagram: where the link in the Instagram bio lands.
//
// 2026-11-19 (George, after the Instagram research). The bio link used to
// drop a visitor on the home page, and the address the CRM had been
// logging for it (/ig) was a 404. A person who taps the link in a bio has
// already seen the yachts; what they need is the shortest honest way to
// say "this week, this many of us" to the person behind the account. So
// this page is one short form, the two direct lines, and five places to
// read more. Nothing else.
//
// Not indexed (noindex, follow) and not in the sitemap: it answers no
// search query that /inquiry and the guides do not already answer, and
// the house rule is one door per query. It exists for people arriving
// from Instagram, whose visits carry utm_source=instagram.

import Link from "next/link";
import { pageMeta } from "@/lib/pageMeta";
import { WHATSAPP_URL } from "@/lib/requiredContact";
import Footer from "@/app/components/Footer";
import InstagramEnquiry from "./InstagramEnquiry";
import { latestFromInstagram } from "@/lib/instagramLatest";

// The list of what Instagram showed last is refreshed every ten minutes.
export const revalidate = 600;

export const metadata = pageMeta({
  title: "From Instagram - George Yachts",
  description:
    "Tell George P. Biniaris the week and the group. He answers every enquiry himself, within 24 hours, with real crewed yachts in Greece and what each costs for the week.",
  path: "/instagram",
  noIndex: true,
});

const GOLD = "#DAA110";

const READ_MORE = [
  { href: "/cost-calculator", title: "What a week costs", line: "Charter fee, APA, VAT and gratuity, worked out for your yacht." },
  { href: "/how-it-works", title: "How it works", line: "Five steps, from the first message to the passerelle." },
  { href: "/charter-yacht-greece", title: "The yachts", line: "Every crewed yacht I place, with her weekly rate." },
  { href: "/7-day-cyclades-yacht-charter-itinerary-2026", title: "A week in the Cyclades", line: "Day by day, from Athens." },
  { href: "/7-day-ionian-yacht-charter-itinerary-2026", title: "A week in the Ionian", line: "Day by day, calm water." },
];

const eyebrow = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  color: GOLD,
};

export default async function InstagramPage() {
  // 2026-11-20: a story cannot carry a tappable link, so the profile link
  // lands here and the yacht or guide it was about is the first thing shown.
  const seen = await latestFromInstagram(4);
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "var(--gy-font-ui)" }}>
      {/* The root layout already provides <main>. Hyphenation is switched off on the paragraphs below: "with-in 24 hours" on a phone reads badly. */}
      <div className="px-6 pt-36 pb-20 md:pt-44">
        <div className="mx-auto" style={{ maxWidth: 560 }}>
          {seen.length > 0 && (
            <div style={{ margin: "0 0 40px", paddingBottom: 30, borderBottom: "1px solid rgba(218, 161, 16,0.18)" }}>
              <p style={{ ...eyebrow, margin: "0 0 14px" }}>Seen on our Instagram</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {seen.map((item) => (
                  <li key={item.href + item.title}>
                    <Link
                      href={item.href}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: 10, border: "1px solid rgba(218, 161, 16,0.25)", textDecoration: "none" }}
                    >
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${item.imageUrl}?w=264&h=198&fit=crop&auto=format&q=75`}
                          alt={`${item.title}, crewed yacht for charter in Greece`}
                          width={132}
                          height={99}
                          loading="eager"
                          style={{ width: 132, height: 99, objectFit: "cover", flexShrink: 0 }}
                        />
                      ) : (
                        <span aria-hidden="true" style={{ width: 132, height: 99, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(218, 161, 16,0.08)", color: GOLD, fontSize: 10, letterSpacing: "0.3em" }}>
                          GUIDE
                        </span>
                      )}
                      <span style={{ display: "block", minWidth: 0 }}>
                        <span style={{ display: "block", fontFamily: "var(--gy-font-editorial)", fontSize: 22, fontWeight: 300, lineHeight: 1.15, color: "#F8F5F0" }}>{item.title}</span>
                        {item.line ? <span style={{ display: "block", marginTop: 5, fontSize: 13, color: "rgba(248,245,240,0.6)" }}>{item.line}</span> : null}
                        <span style={{ display: "block", marginTop: 8, fontSize: 10, fontWeight: 600, letterSpacing: "0.26em", textTransform: "uppercase", color: GOLD }}>
                          {item.kind === "yacht" ? "View this yacht" : "Read the guide"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p style={{ ...eyebrow, margin: "0 0 20px" }}>From Instagram</p>
          <h1
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: "clamp(38px, 9vw, 60px)",
              fontWeight: 300,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: "#F8F5F0",
              margin: "0 0 22px",
            }}
          >
            Tell me the week. I will tell you the yacht.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: "rgba(248,245,240,0.72)", margin: "0 0 36px", hyphens: "manual", WebkitHyphens: "manual" }}>
            I am George P. Biniaris, the broker behind the account. I answer every enquiry myself, within 24 hours, with yachts that are genuinely available for your dates and what each costs for the week, whole yacht with her crew.
          </p>

          <InstagramEnquiry />

          <div style={{ margin: "44px 0 0", paddingTop: 30, borderTop: "1px solid rgba(218, 161, 16,0.18)" }}>
            <p style={{ ...eyebrow, margin: "0 0 16px" }}>Or write to me directly</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a
                href={WHATSAPP_URL}
                style={{ display: "block", padding: "15px 18px", border: "1px solid rgba(218, 161, 16,0.35)", color: "#F8F5F0", textDecoration: "none", fontSize: 15 }}
              >
                WhatsApp, +1 786 798 8798
              </a>
              <a
                href="https://ig.me/m/georgeyachts"
                style={{ display: "block", padding: "15px 18px", border: "1px solid rgba(218, 161, 16,0.35)", color: "#F8F5F0", textDecoration: "none", fontSize: 15 }}
              >
                A message on Instagram, @georgeyachts
              </a>
            </div>
          </div>

          <div style={{ margin: "44px 0 0", paddingTop: 30, borderTop: "1px solid rgba(218, 161, 16,0.18)" }}>
            <p style={{ ...eyebrow, margin: "0 0 6px" }}>Read first, if you prefer</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {READ_MORE.map((r) => (
                <li key={r.href} style={{ borderBottom: "1px solid rgba(248,245,240,0.08)" }}>
                  <Link href={r.href} style={{ display: "block", padding: "18px 0", textDecoration: "none" }}>
                    <span style={{ display: "block", fontFamily: "var(--gy-font-editorial)", fontSize: 24, fontWeight: 300, color: "#F8F5F0", lineHeight: 1.2 }}>{r.title}</span>
                    <span style={{ display: "block", marginTop: 6, fontSize: 14, lineHeight: 1.6, color: "rgba(248,245,240,0.6)" }}>{r.line}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <p style={{ margin: "40px 0 0", fontSize: 13, lineHeight: 1.8, color: "rgba(248,245,240,0.5)", hyphens: "manual", WebkitHyphens: "manual" }}>
            George Yachts Brokerage House LLC, a US company run from Athens. IYBA Charter Active Member. Every charter on a MYBA-standard contract. One price per yacht per week, never per person. Weeks, fully crewed, in Greek waters.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
