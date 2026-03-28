"use client";

export default function Error({ error, reset }) {
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
          Something Went Wrong
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "48px",
            fontWeight: 200,
            color: "#fff",
            margin: "0 0 24px",
          }}
        >
          We Apologise
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
          An unexpected error occurred. Our team has been notified.
          Please try again or return to the homepage.
        </p>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              padding: "14px 36px",
              background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
              color: "#000",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
          <a
            href="/"
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
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
