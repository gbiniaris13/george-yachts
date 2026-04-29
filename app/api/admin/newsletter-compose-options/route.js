// Composer dropdown options — yacht list + blog list.
//
// Read-only helper used by the CRM Composer UI to populate
// dropdowns. Auth-gated like every other admin endpoint.

import { NextResponse } from "next/server";
import { listYachtsForComposer } from "@/lib/newsletter/sanity-yachts";
import { sanityClient } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(request) {
  const header =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const url = new URL(request.url);
  const provided = header || url.searchParams.get("key") || "";
  const accepted = [
    process.env.NEWSLETTER_PROXY_SECRET,
    process.env.NEWSLETTER_UNSUB_SECRET,
    process.env.CRON_SECRET,
  ].filter(Boolean);
  return accepted.some((s) => s && provided === s);
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const yachts = await listYachtsForComposer();
  let posts = [];
  try {
    posts = await sanityClient.fetch(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...30]{
        "slug": slug.current,
        title,
        publishedAt
      }`,
    );
  } catch (err) {
    posts = [];
  }
  return NextResponse.json({
    ok: true,
    yachts: yachts.yachts ?? [],
    posts: posts ?? [],
  });
}
