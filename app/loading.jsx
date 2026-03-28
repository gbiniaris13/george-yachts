export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Gold pulsing dot */}
        <div
          style={{
            width: "8px",
            height: "8px",
            background: "#DAA520",
            margin: "0 auto 20px",
            animation: "loadPulse 1.5s ease-in-out infinite",
          }}
        />
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.25)",
          }}
        >
          Loading
        </p>
        <style>{`
          @keyframes loadPulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
        `}</style>
      </div>
    </div>
  );
}
