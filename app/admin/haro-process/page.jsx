// Admin HARO processor - Phase 7 Round 30 (2026-05-12).
// Technical brief Priority 3B.
//
// /admin/haro-process - paste raw HARO/Connectively/Qwoted digest
// body, get filtered yacht-relevant queries with drafted responses
// in George's voice. Token-gated via CRON_SECRET.

import HaroProcessClient from "./HaroProcessClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "HARO Processor - George Yachts Admin",
  robots: { index: false, follow: false },
};

const GOLD = "#C9A84C";
const NAVY = "#0D1B2A";
const CREAM = "#F8F5F0";

export default async function AdminHaroPage({ searchParams }) {
  const params = await searchParams;
  const tokenParam = params?.token;
  const secret = process.env.CRON_SECRET || process.env.ADMIN_SECRET;

  if (!secret) {
    return (
      <main style={{ background: NAVY, color: CREAM, minHeight: "100vh", padding: 64 }}>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)" }}>HARO Processor</h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", color: "rgba(248,245,240,0.7)" }}>
          CRON_SECRET environment variable required to gate this page.
        </p>
      </main>
    );
  }
  if (tokenParam !== secret) {
    return (
      <main style={{ background: NAVY, color: CREAM, minHeight: "100vh", padding: 64 }}>
        <h1 style={{ fontFamily: "var(--gy-font-editorial)" }}>Unauthorised</h1>
        <p style={{ fontFamily: "var(--gy-font-ui)", color: "rgba(248,245,240,0.7)" }}>
          Append <code>?token=YOUR_CRON_SECRET</code> to the URL.
        </p>
      </main>
    );
  }

  return <HaroProcessClient />;
}
