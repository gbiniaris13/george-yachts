// /api/newsletter/cancel?id=<draft_id>&token=<HMAC>
//
// George taps "❌ Abort" → draft is marked cancelled, KV record kept
// for audit (but ignored by approval handler). Idempotent.

import { NextResponse } from "next/server";
import { kvGet, kvSet, kvSrem } from "@/lib/kv";
import {
  verifyApprovalToken,
  sendTelegramText,
  editTelegramText,
} from "@/lib/newsletter/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="font-family:system-ui,-apple-system,sans-serif;max-width:480px;margin:80px auto;padding:0 24px;color:#0D1B2A;background:#F8F5F0"><h1 style="font-family:Georgia,serif;font-weight:300;font-size:28px">${title}</h1><p style="line-height:1.6">${body}</p></body></html>`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("id");
  const token = searchParams.get("token");
  if (!draftId || !token || !verifyApprovalToken("cancel", draftId, token)) {
    return new NextResponse(
      page("Invalid link", "This cancel link is invalid or has expired."),
      { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const raw = await kvGet(`draft:${draftId}`);
  if (!raw) {
    return new NextResponse(
      page("Already gone", "This draft no longer exists. Nothing to cancel."),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }
  const draft = typeof raw === "string" ? JSON.parse(raw) : raw;

  if (draft.status === "sent" || draft.status === "sending") {
    return new NextResponse(
      page("Cannot cancel — already sent",
        `This issue is already <strong>${draft.status}</strong> and cannot be aborted.`),
      { status: 409, headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  draft.status = "aborted";
  draft.aborted_at = new Date().toISOString();
  await kvSet(`draft:${draftId}`, JSON.stringify(draft));
  await kvSrem("draft:active", draftId).catch(() => {});

  // Update the original Telegram card to reflect the abort + send confirmation.
  if (draft.telegram_message_id) {
    await editTelegramText(
      draft.telegram_message_id,
      `❌ <b>Aborted</b> — ${draft.stream} Issue #${draft.issue_number ?? "?"}\n${draft.subject}`,
    ).catch(() => {});
  }
  await sendTelegramText(
    `❌ <b>Issue aborted</b>\n${draft.stream} #${draft.issue_number ?? "?"}: ${draft.subject}\nNo emails went out.`,
  ).catch(() => {});

  return new NextResponse(
    page(
      "Aborted",
      "The draft has been marked aborted. Nothing went out. You can re-prepare a new issue any time.",
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
