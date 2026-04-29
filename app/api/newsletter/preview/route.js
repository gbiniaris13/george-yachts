// /api/newsletter/preview?id=<draft_id>&token=<HMAC>
//
// URL inline-button target. George taps "👀 Preview HTML" in Telegram,
// his browser opens this URL, and we render the actual email HTML
// (using the per-recipient unsubscribe URL of george@georgeyachts.com
// so the unsubscribe link is real but harmless to test).

import { NextResponse } from "next/server";
import { kvGet } from "@/lib/kv";
import { verifyApprovalToken } from "@/lib/newsletter/telegram";
import { buildNewsletterEmail } from "@/lib/newsletter/email-template";
import { unsubscribeUrlFor } from "@/lib/newsletter/resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("id");
  const token = searchParams.get("token");
  if (!draftId || !token || !verifyApprovalToken("preview", draftId, token)) {
    return new NextResponse("Invalid or expired preview link.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const raw = await kvGet(`draft:${draftId}`);
  if (!raw) {
    return new NextResponse("Draft not found (expired or aborted).", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const draft = typeof raw === "string" ? JSON.parse(raw) : raw;

  // Use george@ as the preview recipient — generates a real but
  // self-authenticated unsubscribe URL so the preview is true-fidelity.
  const built = buildNewsletterEmail({
    stream: draft.stream,
    subject: draft.subject,
    preheader: draft.preheader,
    body_text: draft.body_text,
    hero_image_url: draft.hero_image_url,
    unsubscribe_url: unsubscribeUrlFor("george@georgeyachts.com", {
      list: draft.stream,
    }),
  });

  return new NextResponse(built.html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
