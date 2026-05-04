"use client";

// Tiny client child of ForbesTopBar — owns the dismiss cookie write
// + page refresh. Kept separate so the parent stays a Server
// Component (text content is in the SSR HTML for SEO/AI crawlers).

export default function ForbesBarDismiss({ cookieName }) {
  const onDismiss = () => {
    // 90 days = 7,776,000 seconds (matches brief 1.1 spec).
    const maxAge = 7776000;
    document.cookie = `${cookieName}=true; max-age=${maxAge}; path=/; SameSite=Lax`;
    // Refresh the layout so the bar disappears immediately. Using
    // location.reload() rather than React state because the parent
    // is a Server Component and can't re-render from the client.
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss Forbes feature bar"
      style={{
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        width: 28,
        height: 28,
        background: "transparent",
        border: "none",
        color: "rgba(248,245,240,0.55)",
        fontSize: 16,
        cursor: "pointer",
        lineHeight: 1,
        padding: 0,
        zIndex: 2,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#C9A84C";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(248,245,240,0.55)";
      }}
    >
      ×
    </button>
  );
}
