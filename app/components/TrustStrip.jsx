// TrustStrip — 2026-07-08 (George's UI wave #2).
//
// One quiet line of proof directly under the hero: the real Google
// rating (5.0, live reviews at /reviews), the Forbes 2026 feature
// (/press) and IYBA membership (/credentials). The visitor gets the
// three trust signals in the first three seconds, before any scroll.
// Every claim here is real and linked to its evidence page - nothing
// decorative, nothing invented.
import Link from "next/link";

const GOLD = "#C9A84C";

const itemStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--gy-font-ui)",
  fontSize: 10,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(248,245,240,0.82)",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const dotStyle = {
  color: "rgba(201,168,76,0.45)",
  fontSize: 10,
};

export default function TrustStrip() {
  return (
    <section
      aria-label="Credentials"
      style={{
        background: "#0D1B2A",
        borderTop: "1px solid rgba(201,168,76,0.14)",
        borderBottom: "1px solid rgba(201,168,76,0.14)",
        padding: "14px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          columnGap: 22,
          rowGap: 8,
        }}
      >
        <Link href="/reviews" style={itemStyle} data-cursor="Reviews">
          <span aria-hidden="true" style={{ color: GOLD, letterSpacing: 2, fontSize: 12 }}>
            ★★★★★
          </span>
          <span>5.0 on Google</span>
        </Link>
        <span aria-hidden="true" style={dotStyle}>·</span>
        <Link href="/press" style={itemStyle} data-cursor="Press">
          <span>Featured in Forbes 2026</span>
        </Link>
        <span aria-hidden="true" style={dotStyle}>·</span>
        <Link href="/credentials" style={itemStyle} data-cursor="Credentials">
          <span>IYBA Member · MYBA Contracts</span>
        </Link>
      </div>
    </section>
  );
}
