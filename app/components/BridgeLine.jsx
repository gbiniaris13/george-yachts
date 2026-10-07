// 2026-10-07 (George, from the recovery plan): one buying sentence with a link
// to the matching hub, directly under the quick answer on the informational
// pages the engines already cite (twelve-guest rule, tipping, LOA, MYBA,
// captain). The fact is cited; this line is the door from the fact to the
// week. Server component, no state, one line of text and one link.
import Link from "next/link";

export default function BridgeLine({ text, href, label }) {
  if (!href || !label) return null;
  return (
    <p
      className="gy-bridge"
      style={{
        fontFamily: "var(--gy-font-editorial)",
        fontSize: "clamp(16px, 1.9vw, 18px)",
        fontWeight: 300,
        lineHeight: 1.55,
        color: "rgba(248, 245, 240, 0.9)",
        margin: "0 auto 36px",
        maxWidth: 820,
        padding: "0 32px",
      }}
    >
      {text ? text + " " : null}
      <Link href={href} style={{ color: "#DAA110", textDecoration: "none", borderBottom: "1px solid rgba(218,161,16,0.5)" }}>
        {label}
      </Link>
      .
    </p>
  );
}
