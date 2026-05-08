// /feed.xml — RSS 2.0 feed for blog articles.
//
// Two reasons this exists:
//   1. Reader apps (Feedly, Inoreader, NetNewsWire) + email newsletter
//      tools (Substack, Mailchimp RSS-to-email) syndicate from RSS.
//   2. AI agents (Perplexity, NewsBreak, Apple News bots) check RSS for
//      freshness signals — having a working feed nudges them to recrawl
//      our blog more often.
//
// Referenced from app/layout.jsx alternates.types["application/rss+xml"].
// Refresh: 1h ISR matches the rest of the blog cadence.

import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";

export const revalidate = 3600;

const BASE = "https://georgeyachts.com";

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...50]{
      title, "slug": slug.current, excerpt, publishedAt, _updatedAt,
      "author": author->name
    }`,
  );

  const items = posts
    .map((p) => {
      const url = `${BASE}/blog/${p.slug}`;
      const date = new Date(p.publishedAt || p._updatedAt || Date.now()).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      <description>${escapeXml(p.excerpt || "")}</description>
      ${p.author ? `<author>george@georgeyachts.com (${escapeXml(p.author)})</author>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>George Yachts — The Journal</title>
    <link>${BASE}/blog</link>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Editorial from George Yachts Brokerage House — luxury yacht charter in Greek waters. Working brokers, honest analysis, real 2026 market intel.</description>
    <language>en-us</language>
    <copyright>© George Yachts Brokerage House LLC</copyright>
    <managingEditor>george@georgeyachts.com (George P. Biniaris)</managingEditor>
    <webMaster>george@georgeyachts.com</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js + Sanity</generator>
    <image>
      <url>${BASE}/images/yacht-icon-only.svg</url>
      <title>George Yachts — The Journal</title>
      <link>${BASE}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
