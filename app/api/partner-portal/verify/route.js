// J.2 — Magic-link consumer. GET /api/partner-portal/verify?otp=...
// → exchanges the OTP for a session cookie, redirects to the dashboard.

import { consumeMagicLink, createSession, SESSION_COOKIE } from "@/lib/partner-portal";

export const runtime = "nodejs";

export async function GET(req) {
  const url = new URL(req.url);
  const otp = url.searchParams.get("otp") || "";
  const email = await consumeMagicLink(otp);
  if (!email) {
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Link expired</title>
       <body style="font-family:sans-serif;background:#0D1B2A;color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center">
         <div style="text-align:center;max-width:420px;padding:24px">
           <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:36px;margin:0 0 12px">Link expired</h1>
           <p style="color:rgba(255,255,255,0.7);margin:0 0 22px">Magic links are good for 15 minutes. Request a new one from the portal.</p>
           <a href="/partner-portal" style="font-family:'Montserrat',sans-serif;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;font-weight:700;color:#0a1a2f;background:#C9A84C;padding:12px 22px;text-decoration:none">Back to portal →</a>
         </div>
       </body>`,
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const token = await createSession(email);
  const headers = new Headers();
  headers.set("Location", "/partner-portal/dashboard");
  headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${7 * 24 * 3600}`
  );
  return new Response(null, { status: 302, headers });
}
