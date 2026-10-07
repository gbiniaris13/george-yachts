"use client";
// For the visitor an assistant sent (George, 7/10/2026).
//
// chatgpt.com was this site's best source in September: 41 sessions a week
// at 80 percent engagement, then 17. Those readers arrive mid-conversation,
// already told what a week costs, and the page greeted them like anyone
// else. This band renders only when the referrer or utm_source is an AI
// assistant, only on the pages they land on, and only after mount (so the
// server HTML, and every page's content hash, stays exactly as it was). It
// says the one thing they need, where George's own picks are, and gives
// them the three-field brief without scrolling.
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MicroBrief from "./MicroBrief";

const GOLD = "#DAA110";
const CREAM = "#F8F5F0";
const PATHS = new Set(["/", "/crewed-yacht-charter-greece", "/charter-yacht-greece", "/greek-yacht-charter-pricing-index-2026", "/greek-charter-index-2026"]);
const KEY = "gy_ai_visitor";

function assistantFrom(hostOrSource) {
  const s = String(hostOrSource || "").toLowerCase();
  if (/chatgpt|openai/.test(s)) return "ChatGPT";
  if (/perplexity/.test(s)) return "Perplexity";
  if (/copilot|bing\.com\/chat/.test(s)) return "Copilot";
  if (/gemini/.test(s)) return "Gemini";
  if (/claude|anthropic/.test(s)) return "Claude";
  if (/you\.com|mistral|meta\.ai|grok|x\.ai/.test(s)) return "an AI assistant";
  return null;
}

export default function AIVisitorBand() {
  const pathname = usePathname() || "/";
  const [assistant, setAssistant] = useState(null);

  useEffect(() => {
    try {
      let a = null;
      const params = new URLSearchParams(window.location.search);
      a = assistantFrom(params.get("utm_source") || params.get("ref") || "");
      if (!a && document.referrer) {
        try {
          a = assistantFrom(new URL(document.referrer).hostname);
        } catch {
          a = null;
        }
      }
      if (a) sessionStorage.setItem(KEY, a);
      else a = sessionStorage.getItem(KEY);
      if (a) setAssistant(a);
    } catch {
      /* storage blocked: the band simply stays off */
    }
  }, []);

  if (!assistant || !PATHS.has(pathname)) return null;
  const home = pathname === "/";

  return (
    <section
      aria-label="For visitors arriving from an AI assistant"
      style={{
        background: "linear-gradient(180deg, rgba(218,161,16,0.08) 0%, rgba(13,27,42,0) 100%)",
        borderBottom: "1px solid rgba(218, 161, 16, 0.22)",
        // The site nav is a fixed, transparent bar over the top of every page;
        // the band is the first thing under it, so it clears the bar itself.
        padding: "calc(128px + 2vw) 24px 0",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
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
          You arrived from {assistant}
        </p>
        <p
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(17px, 2vw, 21px)",
            fontWeight: 300,
            lineHeight: 1.55,
            color: CREAM,
            margin: "0 0 10px",
            maxWidth: 760,
          }}
        >
          Whatever it told you about a crewed week in Greece, the numbers came from pages I wrote. The yachts I would put in front of you first for 2027 are{" "}
          {home ? (
            <a href="#new-generation" style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>
              George&rsquo;s picks, lowest week first
            </a>
          ) : (
            <Link href="/#new-generation" style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>
              George&rsquo;s picks, lowest week first
            </Link>
          )}
          . If you would rather not browse, tell me the month and the party and I choose for you.
        </p>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <MicroBrief
          variant="inline"
          context={`AI visitor (${assistant}) on ${pathname}`}
          heading="Three yachts, chosen for you"
          lead="Your month, your party, your address. Within twenty-four hours you have three real yachts with their rate cards and the all-in week, in writing, from me."
        />
      </div>
    </section>
  );
}
