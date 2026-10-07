"use client";
// The three-field brief (George, 7/10/2026): the month, the party, an address.
//
// The full form on the homepage has fourteen fields; in the four weeks to
// 13 September sixty-five visitors started it and thirty finished. This is
// the short door next to it, not a replacement: three answers George can
// write a proposal from, and nothing else. It posts to the same /api/contact
// route as the full form (email, Telegram, WhatsApp, the Helm), flagged
// `micro` so the subject line says what it is.
//
// Two variants. "inline" sits inside a page's content (after a journal
// post's quick answer, after the sixth card of the fleet). "band" is the
// sitewide strip rendered by MicroBriefBand OUTSIDE <main>, so it never
// touches the per-page content hash that stamps lastmod.
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { collectVisitorContext } from "@/lib/visitorContext";

const GOLD = "#DAA110";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

const MONTHS = [
  "May 2027",
  "June 2027",
  "July 2027",
  "August 2027",
  "September 2027",
  "October 2027",
  "2027, dates still open",
  "2028",
];
const GUESTS = ["2 guests", "4 guests", "6 guests", "8 guests", "10 guests", "12 guests", "More than 12"];

const fieldStyle = {
  fontFamily: "var(--gy-font-ui)",
  fontSize: 13,
  letterSpacing: "0.04em",
  color: CREAM,
  background: "rgba(248, 245, 240, 0.04)",
  border: "1px solid rgba(218, 161, 16, 0.35)",
  borderRadius: 0,
  padding: "14px 16px",
  minHeight: 48,
  flex: "1 1 180px",
  outline: "none",
  WebkitAppearance: "none",
  appearance: "none",
};

export default function MicroBrief({ variant = "inline", context = "", heading, lead }) {
  const pathname = usePathname();
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [email, setEmail] = useState("");
  const [month, setMonth] = useState("");
  const [guests, setGuests] = useState("");
  const websiteRef = useRef(null);

  const title = heading || "Three yachts for your dates";
  const intro =
    lead ||
    "The month, the party and an address. A written note with three real yachts, their rate cards and the all-in week reaches you within twenty-four hours. Nothing is booked and nothing is owed.";

  async function submit(e) {
    e.preventDefault();
    if (websiteRef.current && websiteRef.current.value) return; // honeypot
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    if (!ok) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const where = context || pathname || "";
    const payload = {
      micro: true,
      name: "",
      email,
      guests: guests || "Not specified",
      timing: month || "Not specified",
      message: `Micro brief from ${where}. Month: ${month || "not given"}. Guests: ${guests || "not given"}. Asked for three yachts with their numbers.`,
      page: pathname || "",
      visitor_context: collectVisitorContext(),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      try {
        if (typeof window.gtag === "function") {
          window.gtag("event", "micro_brief_submit", { page_path: pathname || "", variant });
          window.gtag("event", "inquiry_submit", { page_path: pathname || "", form: "micro" });
        }
      } catch {
        /* analytics only */
      }
    } catch {
      setStatus("error");
    }
  }

  const band = variant === "band";

  return (
    <section
      aria-label="Three yachts for your dates"
      className="gy-micro-brief"
      style={{
        background: band ? "linear-gradient(180deg, rgba(218,161,16,0.05) 0%, rgba(13,27,42,0) 100%)" : "rgba(218, 161, 16, 0.045)",
        borderTop: band ? "1px solid rgba(218, 161, 16, 0.22)" : "none",
        borderLeft: band ? "none" : `2px solid ${GOLD}`,
        padding: band ? "clamp(40px, 6vw, 72px) 24px" : "28px 28px 30px",
        margin: band ? 0 : "0 0 56px",
      }}
    >
      <div style={{ maxWidth: band ? 980 : 820, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            margin: "0 0 12px",
          }}
        >
          {band ? "Before you leave" : "The short way"}
        </p>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: band ? "clamp(26px, 3.2vw, 38px)" : "clamp(21px, 2.4vw, 26px)",
            fontWeight: 300,
            color: CREAM,
            margin: "0 0 12px",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(15px, 1.7vw, 17px)",
            fontWeight: 300,
            lineHeight: 1.6,
            color: "rgba(248, 245, 240, 0.72)",
            margin: "0 0 22px",
            maxWidth: 640,
          }}
        >
          {intro}
        </p>

        {status === "done" ? (
          <p
            role="status"
            style={{
              fontFamily: "var(--gy-font-editorial)",
              fontSize: 17,
              fontWeight: 300,
              color: CREAM,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Noted. Three yachts with their numbers reach you within twenty-four hours, from george@georgeyachts.com. If nothing arrives, look in the folder your mail keeps for strangers.
          </p>
        ) : (
          <form onSubmit={submit} noValidate style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "stretch" }}>
            {/* Honeypot: hidden from people, filled by bots. */}
            <input
              ref={websiteRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-10000px", width: 1, height: 1, opacity: 0 }}
            />
            <label style={{ display: "contents" }}>
              <span className="sr-only">Month</span>
              <select name="timing" value={month} onChange={(e) => setMonth(e.target.value)} style={{ ...fieldStyle, color: month ? CREAM : "rgba(248,245,240,0.5)" }}>
                <option value="">Which month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m} style={{ color: NAVY }}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "contents" }}>
              <span className="sr-only">Guests</span>
              <select name="guests" value={guests} onChange={(e) => setGuests(e.target.value)} style={{ ...fieldStyle, color: guests ? CREAM : "rgba(248,245,240,0.5)" }}>
                <option value="">How many of you</option>
                {GUESTS.map((g) => (
                  <option key={g} value={g} style={{ color: NAVY }}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: "contents" }}>
              <span className="sr-only">Email</span>
              <input
                type="email"
                name="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...fieldStyle, flex: "1 1 220px" }}
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: NAVY,
                background: GOLD,
                border: `1px solid ${GOLD}`,
                padding: "14px 22px",
                minHeight: 48,
                cursor: status === "sending" ? "wait" : "pointer",
                flex: "1 1 200px",
                opacity: status === "sending" ? 0.7 : 1,
              }}
            >
              {status === "sending" ? "Sending" : "Send me three yachts"}
            </button>
            {status === "error" && (
              <p
                role="alert"
                style={{
                  flexBasis: "100%",
                  fontFamily: "var(--gy-font-ui)",
                  fontSize: 12,
                  color: GOLD,
                  margin: "6px 0 0",
                  lineHeight: 1.5,
                }}
              >
                Check the address, or write to george@georgeyachts.com; it reaches me the same way.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
