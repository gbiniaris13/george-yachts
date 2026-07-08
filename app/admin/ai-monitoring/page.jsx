// AI Citation Monitoring admin dashboard - Phase 7 Round 29.
// Technical brief Priority 3A.
//
// /admin/ai-monitoring - simple table of the latest check per
// monitored query, grouped by engine. Gated behind ?token=
// (or Authorization header) so it stays out of search engine
// indexes despite being on a public domain.

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  MONITORED_QUERIES,
  getMonitoringScoreboard,
} from "@/lib/aiMonitoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "AI Citation Monitoring - George Yachts Admin",
  robots: { index: false, follow: false },
};

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

async function gate(req) {
  // Try header auth first; fall back to ?token= query param.
  const h = await headers();
  const auth = h.get("authorization") || "";
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;
  if (!secret) {
    return { ok: false, reason: "Admin secret not configured." };
  }
  if (auth === `Bearer ${secret}`) return { ok: true };
  return { ok: false, reason: "Use ?token=<CRON_SECRET> or Authorization header." };
}

function StatusPill({ value, label }) {
  const ok = value === true;
  const skipped = value === "skipped";
  const error = value === "error";
  const bg = ok ? GOLD : skipped ? "rgba(248,245,240,0.15)" : error ? "rgba(192, 57, 43, 0.4)" : "rgba(248,245,240,0.06)";
  const color = ok ? NAVY : CREAM;
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "var(--gy-font-ui)",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 700,
        padding: "5px 10px",
        background: bg,
        color,
        border: ok ? `1px solid ${GOLD}` : `1px solid rgba(248,245,240,0.18)`,
      }}
    >
      {label}
    </span>
  );
}

export default async function AdminAiMonitoringPage({ searchParams }) {
  const params = await searchParams;
  const tokenParam = params?.token;
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

  // Gate check: require ?token= to match the cron secret.
  if (!secret) {
    return (
      <main style={{ background: NAVY, color: CREAM, minHeight: "100vh", padding: 64 }}>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)" }}>AI Monitoring</h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", color: "rgba(248,245,240,0.78)" }}>
          The CRON_SECRET environment variable is not configured. Set it on Vercel
          to gate this dashboard.
        </p>
      </main>
    );
  }
  if (tokenParam !== secret) {
    return (
      <main style={{ background: NAVY, color: CREAM, minHeight: "100vh", padding: 64 }}>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)" }}>Unauthorised</h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", color: "rgba(248,245,240,0.78)" }}>
          Append <code>?token=YOUR_CRON_SECRET</code> to the URL.
        </p>
      </main>
    );
  }

  const scoreboard = await getMonitoringScoreboard();
  const totalQueries = scoreboard.length;
  const queriesWithMention = scoreboard.filter((s) => s.anyMention === true).length;
  const queriesNeverChecked = scoreboard.filter((s) => s.notChecked).length;

  return (
    <main
      style={{
        background: NAVY,
        color: CREAM,
        minHeight: "100vh",
        padding: "64px 32px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 9,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 700,
            margin: "0 0 14px",
          }}
        >
          Admin · AI Citation Monitoring
        </p>
        <h1
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300,
            margin: "0 0 22px",
            lineHeight: 1.1,
          }}
        >
          AI engine mention tracker
        </h1>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 14,
            lineHeight: 1.65,
            color: "rgba(248,245,240,0.78)",
            margin: "0 0 32px",
            maxWidth: 720,
          }}
        >
          Daily check across DuckDuckGo + Perplexity + Claude for{" "}
          {MONITORED_QUERIES.length} target queries. Cron runs at 07:00 UTC
          and rotates 4 queries/day. Engines without API keys configured are
          listed as &quot;skipped&quot;.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div style={{ padding: "20px 24px", border: `1px solid ${GOLD}`, background: "rgba(201,168,76,0.06)" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, margin: 0 }}>Queries</p>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 32, margin: "6px 0 0" }}>{totalQueries}</p>
          </div>
          <div style={{ padding: "20px 24px", border: "1px solid rgba(248,245,240,0.15)", background: "rgba(248,245,240,0.03)" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, margin: 0 }}>With mention</p>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 32, margin: "6px 0 0", color: GOLD }}>{queriesWithMention}</p>
          </div>
          <div style={{ padding: "20px 24px", border: "1px solid rgba(248,245,240,0.15)", background: "rgba(248,245,240,0.03)" }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, margin: 0 }}>Not yet checked</p>
            <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: 32, margin: "6px 0 0", color: "rgba(248,245,240,0.78)" }}>{queriesNeverChecked}</p>
          </div>
        </div>

        <div style={{ marginBottom: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <form
            method="POST"
            action={`/api/cron/ai-citation-check?token=${secret}`}
          >
            <button
              type="submit"
              style={{
                fontFamily: "var(--gy-font-ui)",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "12px 20px",
                background: GOLD,
                color: NAVY,
                border: "none",
                cursor: "pointer",
              }}
            >
              Run check now (today&apos;s 4 queries)
            </button>
          </form>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid rgba(248,245,240,0.1)",
            background: "rgba(248,245,240,0.02)",
            fontFamily: "var(--gy-font-ui)",
            fontSize: 13,
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(201,168,76,0.1)",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px 14px", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>Query</th>
              <th style={{ padding: "12px 14px", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>DuckDuckGo</th>
              <th style={{ padding: "12px 14px", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>Perplexity</th>
              <th style={{ padding: "12px 14px", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>Claude</th>
              <th style={{ padding: "12px 14px", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>Last check</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((row) => {
              const byEngine = (engine) =>
                (row.checks || []).find((c) => c.engine === engine);
              const render = (engine) => {
                const c = byEngine(engine);
                if (!c) return <StatusPill value={null} label="-" />;
                if (c.skipped) return <StatusPill value="skipped" label="No key" />;
                if (c.error) return <StatusPill value="error" label="Error" />;
                return c.mentioned ? (
                  <StatusPill value={true} label={c.position ? `#${c.position}` : "Yes"} />
                ) : (
                  <StatusPill value={false} label="No" />
                );
              };
              return (
                <tr
                  key={row.query}
                  style={{ borderTop: "1px solid rgba(248,245,240,0.06)" }}
                >
                  <td style={{ padding: "14px", maxWidth: 360, color: CREAM, fontWeight: 500 }}>
                    {row.query}
                    {row.notChecked && (
                      <span style={{ marginLeft: 8, fontSize: 10, color: "rgba(248,245,240,0.5)" }}>
                        (pending first check)
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px" }}>{render("duckduckgo")}</td>
                  <td style={{ padding: "14px" }}>{render("perplexity")}</td>
                  <td style={{ padding: "14px" }}>{render("claude")}</td>
                  <td style={{ padding: "14px", color: "rgba(248,245,240,0.66)", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
                    {row.timestamp ? new Date(row.timestamp).toLocaleString() : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 12,
            color: "rgba(248,245,240,0.6)",
            margin: "24px 0 0",
            lineHeight: 1.65,
          }}
        >
          <strong>Engine setup:</strong> DuckDuckGo works out of the box (free,
          no API key). Perplexity requires <code>PERPLEXITY_API_KEY</code>{" "}
          (free tier 5 requests/min available at perplexity.ai). Claude
          requires <code>ANTHROPIC_API_KEY</code>. Both are optional - the
          DuckDuckGo baseline runs without either.
        </p>
      </div>
    </main>
  );
}
