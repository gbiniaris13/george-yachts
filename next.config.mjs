/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      // George asked for destination pages with photos per island.
      // Pexels + Unsplash cover the Aegean/Ionian stock we need until
      // per-island images land in Sanity. Listed here so next/image can
      // optimise them.
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 2026-05-12 — microphone tightened from (self) to () because no
          // code calls navigator.mediaDevices.getUserMedia; the (self)
          // grant was opening attack surface without a corresponding
          // feature. Camera + geolocation already disabled.
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 2026-05-12 — Cookiebot CSP allowances added. The
              // layout.jsx Cookiebot <Script src="https://consent.
              // cookiebot.com/uc.js"> was being silently blocked by
              // CSP, so EU visitors never saw the consent banner —
              // an active GDPR compliance gap. Cookiebot's docs list
              // both consent.cookiebot.com (main script) and
              // consentcdn.cookiebot.com (consent state CDN) as
              // required across script/img/connect/frame directives.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://translate.google.com https://translate.googleapis.com https://js.hs-scripts.com https://js.hsforms.net https://js.hs-analytics.net https://js.hs-banner.com https://js.hscollectedforms.net https://consent.cookiebot.com https://consentcdn.cookiebot.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com https://api.fontshare.com https://consent.cookiebot.com https://consentcdn.cookiebot.com",
              "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com https://consent.cookiebot.com https://consentcdn.cookiebot.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.pexels.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://translate.google.com https://www.google.com https://translate.googleapis.com https://imgsct.cookiebot.com https://consent.cookiebot.com",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://*.hubapi.com https://api.hubspot.com https://forms.hubspot.com https://translate.googleapis.com https://translate.google.com https://wttr.in https://consent.cookiebot.com https://consentcdn.cookiebot.com",
              // 2026-05-12 — added my.matterport.com pre-emptively.
              // The yacht detail page (YachtPageContent.jsx Matterport
              // section) renders an <iframe src={yacht.matterportEmbedUrl}>
              // when the Sanity matterportEmbedUrl field is set, but no
              // yacht has populated it yet. When George adds the first
              // 3D tour, the iframe would otherwise be silently
              // CSP-blocked.
              "frame-src 'self' https://www.google.com https://calendly.com https://www.youtube.com https://translate.google.com https://my.matterport.com https://consent.cookiebot.com https://consentcdn.cookiebot.com",
              "media-src 'self' https://cdn.sanity.io blob:",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  // 2026-05-11 - Phase 7 SEO routing fix. Next.js 15 doesn't
  // support prefix-[dynamic] folder names like yacht-charter-[island]
  // (the entire folder name has to be a single dynamic segment).
  // The route lived at app/yacht-charter-[island]/ and worked under
  // older Next.js versions but broke silently in 15 (route built as
  // static with no generateStaticParams output, every island URL
  // returned 404). Solution: move the page to the standard pattern
  // app/island/[slug]/ and rewrite the public URL transparently.
  // Users keep seeing /yacht-charter-mykonos; internally Next.js
  // routes to /island/mykonos.
  async rewrites() {
    // Restrict the island-rewrite to only known island slugs so the
    // pattern doesn't accidentally catch other yacht-charter-* URLs
    // like /yacht-charter-mykonos-7-day (duration pages, Phase 7
    // Round 5) which need to go to their own static routes.
    //
    // Keep this list in sync with /lib/islands.js -> ISLANDS slugs.
    // 2026-05-12 — added ios, antiparos, tinos, andros, kos, skopelos,
    // patmos (Round 14 expansion toward the 50-destination strategy
    // target). Keep in sync with /lib/islands.js ISLANDS slugs.
    const ISLAND_SLUGS_PATTERN =
      "mykonos|santorini|paros|corfu|hydra|milos|folegandros|lefkada|spetses|kefalonia|naxos|rhodes|skiathos|zakynthos|ithaca|paxos|symi|crete-chania|sifnos|ios|antiparos|tinos|andros|kos|skopelos|patmos";
    return [
      {
        source: `/yacht-charter-:slug(${ISLAND_SLUGS_PATTERN})`,
        destination: "/island/:slug",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/yachts-charter",
        destination: "/charter-yacht-greece",
        permanent: true,
      },
      // 2026-05-07 SEO fix — Ahrefs found 8 incoming external links
      // hitting /yacht-charter and /charter-yacht (without -greece
      // suffix) that 404'd. Both are obvious typos of our canonical
      // /charter-yacht-greece — catch them here so external link
      // equity transfers instead of bouncing.
      {
        source: "/yacht-charter",
        destination: "/charter-yacht-greece",
        permanent: true,
      },
      {
        source: "/charter-yacht",
        destination: "/charter-yacht-greece",
        permanent: true,
      },
      // A.3 (Roberto brief): /yachts (without slug) used to 404. People
      // type it directly + external links may use it. Redirect to the
      // canonical fleet listing. Note: /yachts/[slug] still routes to
      // the yacht detail page (different segment, has its own folder).
      {
        source: "/yachts",
        destination: "/charter-yacht-greece",
        permanent: true,
      },
      // Some legacy links / blog posts may point at
      // /charter-yacht-greece/[slug] but that route does not exist —
      // canonical yacht detail is /yachts/[slug]. Send anyone landing
      // there to the right URL so we never 404 on a real yacht.
      {
        source: "/charter-yacht-greece/:slug([a-z0-9-]+)",
        destination: "/yachts/:slug",
        permanent: true,
      },
      {
        source: "/aviation-charter",
        destination: "/private-jet-charter",
        permanent: true,
      },
      // Proposal F (George 2026-04-21): collapse three overlapping
      // lead-capture tools into the single /inquiry flow.
      //
      // E.3 + B.2 (Roberto master rebuild brief, May 2026):
      // /cost-calculator and /yacht-finder are NO LONGER redirected.
      // /cost-calculator now serves the real interactive calculator,
      // and /yacht-finder serves the new Smart Match Quiz (5 quick
      // questions). Both are real conversion-driving pages now —
      // not blockages that funneled cold traffic into a 12-question
      // form.
      // Destinations section was retired 2026-04-21 then revived
      // 2026-05-08 (Chapter 07) for the new "Three Greek Worlds"
      // editorial pages at /destinations/{cyclades,ionian,saronic}.
      // The legacy inquiry redirect that lived here would have
      // hijacked every new region URL — removed. The bare
      // /destinations index now redirects to the homepage section
      // anchor instead, so old bookmarks land on the new section.
      {
        source: "/destinations",
        destination: "/#destinations",
        permanent: false,
      },
      // 2026-05-08 — Boss screenshotted /yacht-charter/cyclades and
      // flagged it as off-brand vs the rebuilt /destinations/[region]
      // editorial pages. Both URL families targeted the same regions
      // (Cyclades, Ionian, Saronic) but with different copy + chrome
      // — a duplicate-content + brand-consistency problem. Redirect
      // permanently so SEO equity flows to the canonical destination
      // page and there is one source of truth for region content.
      {
        source: "/yacht-charter/cyclades",
        destination: "/destinations/cyclades",
        permanent: true,
      },
      {
        source: "/yacht-charter/ionian",
        destination: "/destinations/ionian",
        permanent: true,
      },
      {
        source: "/yacht-charter/saronic",
        destination: "/destinations/saronic",
        permanent: true,
      },
      // 2026-05-11 — blog post "greek-yacht-charter-vs-mediterranean-2026"
      // links to /destinations/sporades but only cyclades/ionian/saronic
      // region pages exist. Redirect to /yacht-charter-skiathos (the
      // main Sporades charter island, has its own full island page).
      // Boss may build a proper /destinations/sporades hub later — at
      // that point this redirect gets removed.
      {
        source: "/destinations/sporades",
        destination: "/yacht-charter-skiathos",
        permanent: true,
      },
      // 2026-05-04 link audit fix — 3 broken outgoing links inside
      // blog/airport-hell-2026 pointed at posts that exist as drafts
      // in Sanity but were never published. Send the ghost URLs to
      // /blog so visitors land somewhere coherent, and so the audit
      // stops flagging the parent post as broken. Marked
      // `permanent: false` (307) so we can publish the real posts at
      // these slugs later without a stuck redirect.
      {
        source: "/blog/last-cabin-standing-book-crewed-yacht-greece-summer-2026",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/blog/oil-spike-smart-money-yacht-charter-greece",
        destination: "/blog",
        permanent: false,
      },
      {
        source: "/blog/dubai-exodus-yacht-charter-greece-2026",
        destination: "/blog",
        permanent: false,
      },
      // 2026-05-14 Ahrefs audit — 2 hard 404s flagged. Both had
      // legitimate inbound interest (one external blog citation, one
      // internal glossary link that I'm also removing below) so we
      // catch them with permanent redirects to the nearest sensible
      // surface rather than leaving them as 404 dead ends.
      {
        source: "/blog/what-actually-happens-crewed-yacht-charter-greece",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/power-catamaran-charter-greece",
        destination: "/best-motor-yachts-greece-speed",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
