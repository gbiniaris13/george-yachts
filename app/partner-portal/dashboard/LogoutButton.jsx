"use client";
export default function LogoutButton() {
  async function logout() {
    await fetch("/api/partner-portal/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/partner-portal";
  }
  return (
    <button
      type="button"
      onClick={logout}
      style={{
        fontFamily: "var(--gy-font-ui)",
        fontSize: 10,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        fontWeight: 600,
        padding: "10px 16px",
        background: "transparent",
        color: "rgba(248, 245, 240,0.7)",
        border: "1px solid rgba(248, 245, 240,0.25)",
        cursor: "pointer",
      }}
    >
      Sign out
    </button>
  );
}
