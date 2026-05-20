// app/(cabin)/not-found.jsx
// =============================================================
// 2026-05-20 — Friend-test pass 6 (Tyler, David):
//   "/cabin/brief/group → 404. The 404 page dumps me onto the
//    *marketing site* with the Forbes ribbon, 'BRIEF GEORGE →'
//    CTA. /cabin/album and /cabin/mood do the same."
//
// Next.js' (route-group)/not-found.jsx is the fallback for any
// unmatched route INSIDE the group. By putting one here scoped
// to /cabin/*, we avoid the marketing-site 404 with its sales
// CTAs that would shock a paying customer.
//
// Common URL guesses (e.g. /cabin/album → /cabin/voyage-album)
// are caught by dedicated redirect route folders alongside this.
// =============================================================

import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function CabinNotFound() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 24px",
        textAlign: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#1f2937",
          fontWeight: 600,
        }}
      >
        Not found in your Cabin
      </div>
      <h1
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontWeight: 300,
          fontSize: 30,
          margin: 0,
          color: "var(--gy-navy)",
          maxWidth: 540,
          lineHeight: 1.2,
        }}
      >
        That page seems to have <em style={{ color: "var(--gy-gold)", fontStyle: "italic" }}>weighed anchor.</em>
      </h1>
      <p
        style={{
          fontFamily: "var(--gy-font-editorial)",
          fontSize: 15.5,
          lineHeight: 1.7,
          color: "rgba(13, 27, 42, 0.7)",
          maxWidth: 540,
          margin: 0,
        }}
      >
        It might have moved, or the link may have been mis-typed.
        Everything in your Cabin is still where you left it — start
        from the home below, or write to George and he&apos;ll send
        you the right link directly.
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
        <Link
          href="/cabin"
          style={{
            background: "var(--gy-navy)",
            color: "var(--gy-ivory)",
            padding: "13px 26px",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 11,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            textDecoration: "none",
            border: "1px solid var(--gy-gold)",
            display: "inline-block",
          }}
        >
          ← Back to your Cabin
        </Link>
        <a
          href="mailto:george@georgeyachts.com"
          style={{
            color: "var(--gy-gold)",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 10.5,
            letterSpacing: 2,
            textTransform: "uppercase",
            textDecoration: "none",
            alignSelf: "center",
          }}
        >
          Or write to George
        </a>
      </div>
    </main>
  );
}
