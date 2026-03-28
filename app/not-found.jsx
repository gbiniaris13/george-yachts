import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#000", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="text-center max-w-lg">
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#DAA520",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          Page Not Found
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(60px, 12vw, 120px)",
            fontWeight: 200,
            color: "#fff",
            lineHeight: 0.9,
            margin: "0 0 24px",
          }}
        >
          404
        </h1>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
            margin: "0 auto 32px",
          }}
        />
        <p
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1.8,
            marginBottom: "40px",
            fontWeight: 300,
          }}
        >
          The page you&apos;re looking for seems to have sailed away.
          Let us help you find your way back.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
              color: "#000",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Return Home
          </Link>
          <Link
            href="/charter-yacht-greece"
            style={{
              display: "inline-block",
              padding: "14px 36px",
              border: "1px solid rgba(218,165,32,0.3)",
              color: "#DAA520",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View Fleet
          </Link>
        </div>
      </div>
    </div>
  );
}
