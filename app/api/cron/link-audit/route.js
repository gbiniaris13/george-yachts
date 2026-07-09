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

    // 2026-07-08 FIX — the audit was fetching RELATIVE hrefs ("/glossary/apa")
    // as-is, getting status 0, and reporting perfectly healthy pages as
    // broken (39 false alarms in the 07-06 report). Resolve everything
    // against the site origin first. George's rule: reports never lie.
    const toAbsolute = (href) => {
      if (!href) return null;
      if (href.startsWith("/")) return `https://georgeyachts.com${href}`;
      if (/^https?:\/\//.test(href)) return href;
      return null; // mailto:, tel:, anchors — not audit targets
    };

    const brokenLinks = [];
    const blockedExternal = [];
    const uniqueTargets = new Set();

    for (const entry of linksInContent) {
      for (const raw of (entry.targets || []).flat().filter(Boolean)) {
        const abs = toAbsolute(raw);
        if (abs) uniqueTargets.add(abs);
      }
    }

    // 3. Check each unique target (HEAD request, 5s timeout)
    for (const target of uniqueTargets) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const opts = {
          signal: controller.signal,
          redirect: "follow",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; GeorgeYachtsLinkAudit/2.0)" },
        };
        let res = await fetch(target, { method: "HEAD", ...opts });
        // Many sites reject HEAD (405) or bot-block it — retry once with GET.
        if (res.status >= 400) res = await fetch(target, { method: "GET", ...opts });
        clearTimeout(timeout);

        const isExternal = !target.startsWith("https://georgeyachts.com");
        if (isExternal && (res.status === 403 || res.status === 429)) {
          blockedExternal.push({ target, status: res.status });
          continue;
        }
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

    // 4. Posts with no incoming links FROM OTHER POST BODIES.
    // 2026-07-08 FIX: (a) relative internal hrefs now count (they were
    // ignored, so nearly everything looked orphaned); (b) yachts are
    // excluded - they are linked by the fleet grids and money pages,
    // which this Sanity-body audit cannot see. This is an internal-link
    // OPPORTUNITY list, not an emergency.
    const incomingLinks = new Map();
    for (const entry of linksInContent) {
      for (const raw of (entry.targets || []).flat().filter(Boolean)) {
        const abs = toAbsolute(raw);
        if (abs && abs.startsWith("https://georgeyachts.com")) {
          incomingLinks.set(abs, (incomingLinks.get(abs) || 0) + 1);
        }
      }
    }
    const orphans = allUrls.filter(
      (url) => url.startsWith("https://georgeyachts.com/blog/") && !incomingLinks.has(url)
    );

    // 5. Send Telegram alert if issues found
    if (brokenLinks.length > 0 || orphans.length > 0) {
      const header = brokenLinks.length > 0 ? "🔴" : "🔗";
      const message =
        `${header} *Link Audit — George Yachts*\n\n` +
        `Broken links: ${brokenLinks.length}\n` +
        (blockedExternal.length > 0 ? `External sites blocking our checker (verify by hand): ${blockedExternal.length}\n` : "") +
        `Posts that other posts never link to (internal-link opportunities): ${orphans.length}\n\n` +
        (brokenLinks.length > 0
          ? `*Broken:*\n${brokenLinks.slice(0, 10).map((b) => `• ${b.target} (${b.status}) on ${b.source}`).join("\n")}\n\n`
          : "") +
        (blockedExternal.length > 0
          ? `*Blocked external (probably fine):*\n${blockedExternal.slice(0, 5).map((b) => `• ${b.target} (${b.status})`).join("\n")}\n\n`
          : "") +
        (orphans.length > 0
          ? `*Link these from related posts when convenient:*\n${orphans.slice(0, 10).map((o) => `• ${o}`).join("\n")}`
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
