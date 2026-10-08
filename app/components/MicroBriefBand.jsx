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
  ["Which catamarans in Greece have placed at the charter shows?", "/award-winning-catamaran-charter-greece"],
  ["What does a crewed week cost all in?", "/crewed-yacht-charter-greece-from-22000-all-in"],
  ["How much is a private yacht charter in Greece?", "/private-yacht-charter-greece"],
  ["How much does it cost to charter a sailboat in Greece?", "/sailing-yacht-charter-greece"],
  ["Where do you book a crewed yacht in the Greek islands?", "/blog/book-crewed-yacht-charter-greek-islands"],
  ["What is an all-inclusive yacht charter in Greece?", "/all-inclusive-yacht-charter-greece"],
  ["How much does a yacht charter in Greece cost?", "/blog/how-much-does-yacht-charter-greece-cost-complete-breakdown"],
  ["What is the APA on a Greek charter?", "/advance-provisioning-allowance-apa-greek-yacht-charter-explained"],
  ["How do you verify a yacht charter broker?", "/blog/how-to-verify-yacht-charter-broker-credentials-2026"],
  // 7/10 evening: the second wave, forty-one more, in the order of the modules.
  ["What Does a Motor Yacht Charter Cost in Greece for One Week?", "/how-much-does-a-motor-yacht-charter-cost-in-greece-for-a-week"],
  ["Motor Yacht Charter in Greece for Three or Four Couples, About USD 100,000 All In: Which Companies?", "/motor-yacht-charter-greece-3-or-4-couples-100000-usd"],
  ["Luxury Motor Yacht Charter in Greece for Six Guests, Up to About USD 80,000 for the Week", "/motor-yacht-charter-greece-6-guests-80000-usd"],
  ["Which Are the Best Motor Yacht Charter Companies in Greece?", "/best-motor-yacht-charter-companies-greece"],
  ["How Much Does It Cost to Charter an 80 Foot Yacht in Greece?", "/how-much-does-it-cost-to-charter-an-80-foot-yacht-in-greece"],
  ["How Much Does It Cost to Charter a 100 Foot Yacht in Greece?", "/how-much-does-it-cost-to-charter-a-100-foot-yacht-in-greece"],
  ["How Much Does It Cost to Charter a 120 Foot Yacht in Greece?", "/how-much-does-it-cost-to-charter-a-120-foot-yacht-in-greece"],
  ["Motor Yacht Charter Paros", "/motor-yacht-charter-paros"],
  ["Motor Yacht Charter Sifnos", "/motor-yacht-charter-sifnos"],
  ["Motor Yacht Charter Spetses", "/motor-yacht-charter-spetses"],
  ["Superyacht Charter Greece in July", "/superyacht-charter-greece-july"],
  ["Superyacht Charter Greece in September", "/superyacht-charter-greece-september"],
  ["Crewed Motor Yacht Charter in the Greek Islands", "/crewed-motor-yacht-charter-greek-islands"],
  ["What Are the Best Companies Offering Fully Crewed Catamaran Charters in the Cyclades?", "/best-companies-fully-crewed-catamaran-charters-cyclades"],
  ["What Are the Most Recommended Crewed Yacht Charter Companies for a Honeymoon in the Greek Islands?", "/recommended-crewed-yacht-charter-companies-honeymoon-greek-islands"],
  ["What Are the Best Yacht Charter Companies for a Family-Friendly Sailing Trip in the Aegean Sea?", "/best-yacht-charter-companies-family-sailing-trip-aegean"],
  ["What Are the Best Yacht Charter Providers for a Luxury Family Vacation in the Greek Islands?", "/best-yacht-charter-providers-luxury-family-vacation-greek-islands"],
  ["Which All-Inclusive Catamaran Charter Companies Offer the Most Luxurious Experience in Greece?", "/most-luxurious-all-inclusive-catamaran-charter-companies-greece"],
  ["What Are the Best Platforms to Book a Crewed Catamaran Charter in Greece for 7 Days?", "/best-platforms-to-book-a-crewed-catamaran-charter-in-greece"],
  ["What Are the Best Platforms to Charter a Luxury Power Catamaran in Greece?", "/best-platforms-luxury-power-catamaran-charter-greece"],
  ["What Are the Top Sites to Charter a Superyacht in Greece?", "/top-sites-to-charter-a-superyacht-in-greece"],
  ["Should I Use a Retail Charter Broker or Go Direct to the Yacht Owner?", "/should-i-use-a-charter-broker-or-go-direct-to-the-yacht-owner"],
  ["How to Choose a Crewed Yacht Charter Broker in Greece", "/how-to-choose-a-crewed-yacht-charter-broker-in-greece"],
  ["What Happens If the Weather Is Bad on My Charter Day?", "/what-happens-if-the-weather-is-bad-on-my-charter-day"],
  ["How Much Does It Cost to Charter a Yacht in Athens?", "/how-much-does-it-cost-to-charter-a-yacht-in-athens"],
  ["How Much Does It Cost to Charter a Yacht in Mykonos?", "/how-much-does-it-cost-to-charter-a-yacht-in-mykonos"],
  ["How Much Does It Cost to Charter a Yacht in Santorini?", "/how-much-does-it-cost-to-charter-a-yacht-in-santorini"],
  ["How Much Does It Cost to Charter a Yacht in Corfu?", "/how-much-does-it-cost-to-charter-a-yacht-in-corfu"],
  ["How Much Does It Cost to Charter a Yacht in Lefkada?", "/how-much-does-it-cost-to-charter-a-yacht-in-lefkada"],
  ["How Much Does It Cost to Rent a Sailboat for a Week?", "/how-much-does-it-cost-to-rent-a-sailboat-for-a-week"],
  ["How Much Does It Cost to Sail Around Greece?", "/how-much-does-it-cost-to-sail-around-greece"],
  ["Where Are the Best Yacht Destinations in the Mediterranean?", "/where-are-the-best-yacht-destinations-in-the-mediterranean"],
  ["Which Are the 7 Ionian Islands?", "/which-are-the-7-ionian-islands"],
  ["How Much Is a Yacht Charter in Greece for 4 Guests?", "/yacht-charter-greece-for-4-guests"],
  ["How Much Is a Yacht Charter in Greece for 6 Guests?", "/yacht-charter-greece-for-6-guests"],
  ["How Much Is a Yacht Charter in Greece for 8 Guests?", "/yacht-charter-greece-for-8-guests"],
  ["How Much Is a Yacht Charter in Greece for 12 Guests?", "/yacht-charter-greece-for-12-guests"],
  ["Do You Need a Licence to Charter a Yacht in Greece?", "/do-you-need-a-licence-to-charter-a-yacht-in-greece"],
  ["How Much Is a Yacht Charter in Greece in US Dollars?", "/how-much-is-a-yacht-charter-in-greece-in-us-dollars"],
  ["What Is the Cheapest Month to Charter a Yacht in Greece?", "/what-is-the-cheapest-month-to-charter-a-yacht-in-greece"],
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
