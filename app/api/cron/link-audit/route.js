import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch all published URLs from Sanity. "destination" doc type
    // removed 2026-04-21 — the /destinations/* routes no longer exist.
    const allContent = await sanityClient.fetch(`
      *[_type in ["post", "yacht"] && defined(slug.current)]{
        _type,
        "slug": slug.current
      }
    `);

    const allUrls = allContent.map((doc) => {
      const prefix = doc._type === "post" ? "/blog" : "/yachts";
      return `https://georgeyachts.com${prefix}/${doc.slug}`;
    });

    // 2. Fetch all links embedded in Portable Text bodies
    const linksInContent = await sanityClient.fetch(`
      *[_type == "post" && defined(slug.current)] {
        "source": "https://georgeyachts.com/blog/" + slug.current,
        "targets": body[].markDefs[_type == "link"].href
      }
    `);

    const brokenLinks = [];
    const uniqueTargets = new Set();

    for (const entry of linksInContent) {
      for (const target of (entry.targets || []).flat().filter(Boolean)) {
        uniqueTargets.add(target);
      }
    }

    // 3. Check each unique target (HEAD request, 5s timeout)
    for (const target of uniqueTargets) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(target, { method: "HEAD", signal: controller.signal, redirect: "follow" });
        clearTimeout(timeout);

        if (res.status >= 400) {
          const sources = linksInContent
            .filter((e) => (e.targets || []).flat().includes(target))
            .map((e) => e.source);
          for (const source of sources) {
            brokenLinks.push({ source, target, status: res.status });
          }
        }
      } catch (e) {
        const sources = linksInContent
          .filter((e2) => (e2.targets || []).flat().includes(target))
          .map((e2) => e2.source);
        for (const source of sources) {
          brokenLinks.push({ source, target, status: 0 });
        }
      }
    }

    // 4. Detect orphan pages (no incoming internal links)
    const incomingLinks = new Map();
    for (const entry of linksInContent) {
      for (const target of (entry.targets || []).flat().filter(Boolean)) {
        if (target.includes("georgeyachts.com")) {
          incomingLinks.set(target, (incomingLinks.get(target) || 0) + 1);
        }
      }
    }
    const orphans = allUrls.filter((url) => !incomingLinks.has(url));

    // 5. Send Telegram alert if issues found
    if (brokenLinks.length > 0 || orphans.length > 0) {
      const message =
        `🔴 *Link Audit Report — George Yachts*\n\n` +
        `Broken links: ${brokenLinks.length}\n` +
        `Orphan pages: ${orphans.length}\n\n` +
        (brokenLinks.length > 0
          ? `*Broken:*\n${brokenLinks.slice(0, 10).map((b) => `• ${b.target} (${b.status}) on ${b.source}`).join("\n")}\n\n`
          : "") +
        (orphans.length > 0
          ? `*Orphans (no internal links in):*\n${orphans.slice(0, 10).map((o) => `• ${o}`).join("\n")}`
          : "");

      if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        await fetch(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              text: message,
              parse_mode: "Markdown",
            }),
          }
        );
      }
    }

    return NextResponse.json({
      checked: uniqueTargets.size,
      broken: brokenLinks.length,
      orphans: orphans.length,
      details: {
        brokenLinks: brokenLinks.slice(0, 50),
        orphans: orphans.slice(0, 50),
      },
    });
  } catch (err) {
    console.error("[link-audit] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
