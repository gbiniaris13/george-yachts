// OutsideGroundsNote (2026-09-05, George: "Αθήνα, Κυκλάδες, Σαρωνικός,
// Ιόνιο, όχι Ρόδο, weekly").
//
// The site carries guides for the Dodecanese, the Sporades and Crete, and
// they earn impressions, so their URLs stay. But the Helm shows a US lead
// with a six-figure budget asking for Rhodes and losing, because this house
// does not arrange weeks there. A page that invites a charter the house
// will not run is a lie by omission. This note sits under the quick answer
// on every page whose path names a ground outside the four we work, says
// so plainly, and points the reader to the grounds we know.
import Link from "next/link";

const GOLD = "#DAA110";

const OUTSIDE = [
  /rhodes/i,
  /dodecanese/i,
  /skiathos/i,
  /sporades/i,
  /skopelos/i,
  /alonnisos/i,
  /symi/i,
  /patmos/i,
  /kalymnos/i,
  /leros/i,
  /tilos/i,
  /nisyros/i,
  /karpathos/i,
  /astypalaia/i,
  /crete/i,
  /chania/i,
  /heraklion/i,
  /(^|-)kos(-|$)/i,
];

export function isOutsideGrounds(path) {
  const p = String(path || "");
  return OUTSIDE.some((re) => re.test(p));
}

export default function OutsideGroundsNote({ path }) {
  if (!isOutsideGrounds(path)) return null;
  return (
    <aside
      className="gy-outside-grounds"
      aria-label="Operating grounds"
      style={{
        maxWidth: 820,
        margin: "0 auto 36px",
        padding: "22px 28px",
        borderLeft: `3px solid ${GOLD}`,
        background: "rgba(218, 161, 16, 0.05)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 9,
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          color: GOLD,
          fontWeight: 700,
          margin: "0 0 10px",
        }}
      >
        Operating grounds
      </p>
      <p
        style={{
          fontFamily: "var(--gy-font-ui)",
          fontSize: 15,
          lineHeight: 1.7,
          color: "rgba(248,245,240,0.82)",
          margin: 0,
        }}
      >
        George Yachts arranges crewed weeks from Athens, across the Cyclades and the Saronic, and from Lefkada or Corfu across the Ionian. These waters are outside the grounds this house works, and we do not arrange weeks here; the page stays as a sailing guide. For a crewed week where we know every yacht and every crew, start with the{" "}
        <Link href="/crewed-yacht-charter-greece" style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>
          crewed charter grounds
        </Link>
        {" "}or{" "}
        <Link href="/#contact" style={{ color: GOLD, textDecoration: "none", borderBottom: `1px solid ${GOLD}` }}>
          brief George
        </Link>
        .
      </p>
    </aside>
  );
}
