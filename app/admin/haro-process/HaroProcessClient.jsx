"use client";

import { useState } from "react";

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export default function HaroProcessClient() {
  const [emailBody, setEmailBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleProcess() {
    if (!emailBody.trim() || emailBody.length < 200) {
      setErrorMsg("Paste a full HARO/Connectively/Qwoted digest body (200+ chars).");
      return;
    }
    setErrorMsg("");
    setStatus("processing");
    try {
      const res = await fetch("/api/admin/haro-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: emailBody }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Server returned ${res.status}`);
      setResults(data);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  return (
    <main
      style={{
        background: NAVY,
        color: CREAM,
        minHeight: "100vh",
        padding: "64px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
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
          Admin · HARO processor
        </p>
        <h1
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 300,
            margin: "0 0 22px",
            lineHeight: 1.1,
          }}
        >
          Paste a HARO digest, get drafted responses
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
          Paste the full body of a HARO / Connectively / Qwoted / SourceBottle
          email digest below. The processor extracts every journalist query,
          filters for yacht-charter-relevant ones, scores by outlet quality,
          and drafts a response in George&apos;s voice for each.
        </p>

        <textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={14}
          placeholder="Paste the full HARO / Connectively digest email body here..."
          style={{
            width: "100%",
            fontFamily: "monospace, var(--gy-font-ui)",
            fontSize: 12,
            lineHeight: 1.55,
            padding: 16,
            background: "rgba(13,27,42,0.5)",
            border: "1px solid rgba(248,245,240,0.2)",
            color: CREAM,
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />

        <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleProcess}
            disabled={status === "processing"}
            style={{
              fontFamily: "var(--gy-font-ui)",
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontWeight: 700,
              padding: "12px 22px",
              background: status === "processing" ? "rgba(201,168,76,0.5)" : GOLD,
              color: NAVY,
              border: "none",
              cursor: status === "processing" ? "default" : "pointer",
            }}
          >
            {status === "processing" ? "Processing…" : "Extract + draft"}
          </button>
          <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248,245,240,0.6)" }}>
            {emailBody.length.toLocaleString()} characters
          </span>
        </div>

        {errorMsg && (
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "#c0392b", marginTop: 12 }}>
            {errorMsg}
          </p>
        )}

        {results && (
          <div style={{ marginTop: 40 }}>
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
              Found {results.relevantQueries} of {results.totalQueries} relevant
            </p>

            {results.queries.length === 0 ? (
              <p style={{ fontFamily: "var(--gy-font-ui)", color: "rgba(248,245,240,0.72)" }}>
                No yacht-charter-relevant queries in this digest.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {results.queries.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      border: `1px solid ${GOLD}`,
                      background: "rgba(201,168,76,0.04)",
                      padding: "24px 26px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                      <p
                        style={{
                          fontFamily: "var(--gy-font-editorial)",
                          fontSize: 18,
                          color: CREAM,
                          margin: 0,
                          lineHeight: 1.3,
                          flex: 1,
                          minWidth: 200,
                        }}
                      >
                        {q.summary}
                      </p>
                      <span
                        style={{
                          fontFamily: "var(--gy-font-ui)",
                          fontSize: 10,
                          letterSpacing: "0.32em",
                          color: GOLD,
                          fontWeight: 700,
                          padding: "5px 10px",
                          border: `1px solid ${GOLD}`,
                          alignSelf: "flex-start",
                        }}
                      >
                        Score: {q.score}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--gy-font-ui)",
                        fontSize: 12,
                        color: "rgba(248,245,240,0.72)",
                        margin: "0 0 14px",
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>Outlet:</strong> {q.outlet || "?"} ·{" "}
                      <strong>Deadline:</strong> {q.deadline || "?"} ·{" "}
                      <strong>Reply to:</strong> {q.email || "(see HARO portal)"} ·{" "}
                      <strong>Matched:</strong> {q.hits?.join(", ") || "-"}
                    </p>
                    {q.draft && (
                      <>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 9,
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                            color: GOLD,
                            fontWeight: 700,
                            margin: "0 0 8px",
                          }}
                        >
                          Subject
                        </p>
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: CREAM, margin: "0 0 14px" }}>
                          {q.draft.subject}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--gy-font-ui)",
                            fontSize: 9,
                            letterSpacing: "0.32em",
                            textTransform: "uppercase",
                            color: GOLD,
                            fontWeight: 700,
                            margin: "0 0 8px",
                          }}
                        >
                          Draft response
                        </p>
                        <pre
                          style={{
                            fontFamily: "monospace",
                            fontSize: 12,
                            lineHeight: 1.55,
                            color: "rgba(248,245,240,0.85)",
                            background: "rgba(13,27,42,0.5)",
                            padding: "14px 16px",
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            border: "1px solid rgba(248,245,240,0.1)",
                            overflowX: "auto",
                          }}
                        >
                          {q.draft.body}
                        </pre>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
