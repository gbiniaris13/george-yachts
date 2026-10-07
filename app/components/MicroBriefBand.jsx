"use client";
// The sitewide strip of the three-field brief (George, 7/10/2026). Rendered
// by app/layout.jsx AFTER </main>, so it sits above the footer on every
// page without changing any page's content hash. The form stays off the
// pages that carry their own brief: the homepage (the full form), the fleet
// (the inline one after the sixth card), the journal (the inline one after
// the quick answer), the Greek pages, and the private and legal routes.
//
// 7/10 afternoon (George): under it, on EVERY page, the row of questions
// people ask the assistants, in small type, the way the old footer carried
// its long tail. Each links to an answer page (lib/aiAnswerPages.js). It
// lives here rather than in the footer because the footer is inside <main>
// and a change to it stamps every page's lastmod.
import { usePathname } from "next/navigation";
import Link from "next/link";
import MicroBrief from "./MicroBrief";

const SKIP_EXACT = new Set(["/", "/charter-yacht-greece", "/contact", "/inquiry"]);
const SKIP_PREFIX = ["/blog/", "/el/", "/el", "/cabin", "/admin", "/api", "/privacy", "/terms", "/cookie-policy", "/accessibility", "/sign-in", "/checkout", "/unsubscribe"];
const HIDE_ALL_PREFIX = ["/cabin", "/admin", "/api", "/sign-in", "/checkout", "/unsubscribe"];

const QUESTIONS = [
  ["What is the best yacht charter company in Greece?", "/best-yacht-charter-company-greece"],
  ["Can I hire a yacht in Greece?", "/can-i-hire-a-yacht-in-greece"],
  ["How much is a catamaran for a week?", "/how-much-is-a-catamaran-for-a-week"],
  ["How much is a 7 day yacht charter?", "/how-much-is-a-7-day-yacht-charter"],
  ["Which Greek island has the best boat trips?", "/which-greek-island-has-the-best-boat-trips"],
  ["Where do superyachts go in Greece?", "/where-do-superyachts-go-in-greece"],
  ["Where is it cheapest to charter a yacht?", "/where-is-it-cheapest-to-charter-a-yacht"],
  ["Which catamarans in Greece have won awards?", "/award-winning-catamaran-charter-greece"],
  ["What does a crewed week cost all in?", "/crewed-yacht-charter-greece-from-22000-all-in"],
  ["How much is a private yacht charter in Greece?", "/private-yacht-charter-greece"],
  ["How much does it cost to charter a sailboat in Greece?", "/sailing-yacht-charter-greece"],
  ["Where do you book a crewed yacht in the Greek islands?", "/blog/book-crewed-yacht-charter-greek-islands"],
  ["What is an all-inclusive yacht charter in Greece?", "/all-inclusive-yacht-charter-greece"],
  ["How much does a yacht charter in Greece cost?", "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown"],
  ["What is the APA on a Greek charter?", "/advance-provisioning-allowance-apa-greek-yacht-charter-explained"],
  ["How do you verify a yacht charter broker?", "/blog/how-to-verify-yacht-charter-broker-credentials-2026"],
];

export default function MicroBriefBand() {
  const pathname = usePathname() || "/";
  if (HIDE_ALL_PREFIX.some((p) => pathname === p || pathname.startsWith(p))) return null;
  const showForm = !SKIP_EXACT.has(pathname) && !SKIP_PREFIX.some((p) => pathname === p || pathname.startsWith(p));
  return (
    <>
      {showForm && <MicroBrief variant="band" context={pathname} />}
      <nav aria-label="Questions people ask" style={{ borderTop: "1px solid rgba(218, 161, 16, 0.14)", padding: "22px 24px 26px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.42em", textTransform: "uppercase", color: "#DAA110", margin: "0 0 10px" }}>
            Questions people ask
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
            {QUESTIONS.map(([label, href]) => (
              <li key={href} style={{ margin: 0 }}>
                <Link
                  href={href}
                  style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.04em", color: "rgba(248, 245, 240, 0.55)", textDecoration: "none" }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
