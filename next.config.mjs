import { RETIRED_YACHT_SLUGS, RETIRED_YACHT_DESTINATION } from "./lib/retiredYachts.js";
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
              // 2026-08-19 (design pass, job 6) — fifteen host entries removed
              // because nothing on the site talks to them any more.
              //
              // Cookiebot was dropped on 2026-06-25 for a free self-hosted
              // banner. HubSpot left when the CRM moved in-house. Google
              // Translate and wttr.in have no reference left in app/ or lib/
              // at all. Their permissions outlived them, which is the quiet
              // kind of risk: a policy that still trusts a script host you no
              // longer watch is a policy that would not stop that host being
              // used against you.
              //
              // Checked three ways before cutting, not one: no live reference
              // in the source, no <Script> that loads them, and a real page
              // load on production whose only outbound hosts were
              // georgeyachts.com, the two fontshare hosts, www.google.com for
              // reCAPTCHA, googletagmanager with region1.google-analytics.com
              // for GA4, and www.gstatic.com.
              //
              // DELIBERATELY KEPT: calendly, my.matterport.com and youtube.
              // They also show zero requests on the fleet page, and that means
              // nothing: they are used on other pages, 27 references for
              // Calendly alone. Zero traffic on one page is not evidence of
              // death.
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
              // 2026-08-11 — Microsoft Clarity added, and it is the second time
              // this exact bug has cost us. The note above records Cookiebot
              // being "silently blocked by CSP"; Clarity was blocked the same
              // way from the day it went in and nobody could see it, because
              // the failure looks like success. The inline loader runs happily
              // under 'unsafe-inline', creates window.clarity as a queue shim
              // so every check for "is Clarity there" returns yes, and then
              // the browser blocks the real script it tries to insert. The
              // dashboard stays empty, the tag "loads", and you diagnose
              // consent for a day.
              //
              // Two hosts are required and they are different: www.clarity.ms
              // serves the small per-project tag, scripts.clarity.ms serves
              // the library the tag then loads. Allowing only the first is
              // exactly the state we were in.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
              "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
              // 2026-05-17 — The Cabin (mood-board + voyage-album)
              // serves signed images from Supabase Storage. Without
              // *.supabase.co here, every photo loads with a CSP
              // violation in the console and the <img> shows broken.
              // Also allowing https: for arbitrary mood-board pastes
              // (Pinterest, etc.) which are charterer-pasted URLs.
              "img-src 'self' data: blob: https: https://cdn.sanity.io https://images.pexels.com https://images.unsplash.com https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://www.google.com",
              // *.clarity.ms on connect-src: the library uploads to
              // u.clarity.ms and pings c.clarity.ms. Allowing the scripts to
              // load but not to send would be a subtler version of the same
              // failure, so both directives move together.
              // 2026-08-14 — GA4 was being blocked for European visitors and we
              // have been reading its numbers as if they were complete.
              //
              // GA4 does not always post to www.google-analytics.com. Traffic
              // from the EEA is routed to regional endpoints, region1 through
              // region14, and this policy named only the www host. Every
              // page_view and scroll event from a European browser hit
              // "Refused to connect" in the console and never reached Google.
              // Greece is in Europe. Our home market was the one not counted.
              //
              // Found by opening a live yacht page and reading the console,
              // which is the third time in two days that a CSP has silently
              // killed a third-party script here: Cookiebot in May, Clarity
              // yesterday, GA4 today. The rule this site keeps relearning is
              // that adding a tag is only half of adding a tag.
              //
              // *.google-analytics.com covers the regional collectors,
              // *.analytics.google.com covers the newer collection host.
              // 2026-08-19 (design pass, job 5) — the FOURTH time this exact bug has
              // been found in this policy, and the notes above record the other
              // three: Cookiebot in May, Clarity on 11/8, GA4 on 14/8. Same shape
              // every time. A third party is allowed to LOAD but not to TALK, so
              // it appears to work and quietly does half its job.
              //
              // reCAPTCHA Enterprise posts its risk signals to
              // www.google.com/recaptcha/enterprise/clr. That host has been in
              // script-src since the beginning and has never been in connect-src,
              // so every one of those posts has been refused. Tokens still came
              // back, which is why nobody noticed: the forms worked, and the
              // score behind them was starved of the very telemetry it grades.
              // Found on 19/8 by opening the console while a form was actually
              // being used, which is the only way any of these four surfaced.
              "connect-src 'self' https://www.google.com https://cdn.sanity.io https://*.sanity.io https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.clarity.ms",
              // 2026-05-12 — added my.matterport.com pre-emptively.
              // The yacht detail page (YachtPageContent.jsx Matterport
              // section) renders an <iframe src={yacht.matterportEmbedUrl}>
              // when the Sanity matterportEmbedUrl field is set, but no
              // yacht has populated it yet. When George adds the first
              // 3D tour, the iframe would otherwise be silently
              // CSP-blocked.
              "frame-src 'self' https://www.google.com https://calendly.com https://www.youtube.com https://my.matterport.com",
              "media-src 'self' https://cdn.sanity.io blob:",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      // 2026-08-19 (design pass, job 1) — the single biggest cause of this
      // site's weight, and it was never a file-size problem.
      //
      // Vercel serves everything under /public with
      //   cache-control: public, max-age=0, must-revalidate
      // while /_next/static gets max-age=31536000, immutable. That split is
      // Vercel's default and it stays invisible until you measure a repeat
      // visit: the JavaScript and CSS come from cache, and the 3,1 MB of
      // ambient-lounge.mp3, the 704 KB yacht-icon-only.svg that sits in the
      // footer and the nav drawer of every single page, and every hero video
      // are fetched again from scratch. Measured 18/8: on a returning mobile
      // visit the only thing that re-downloaded was the audio.
      //
      // Compressing the mp3 was the obvious fix and the wrong one. George
      // wants the track exactly as it is, and the file was never the
      // problem; asking for it twice was.
      //
      // TWO TIERS, and the split is deliberate.
      //
      // /audio and /videos get a year with `immutable`. These are the heavy
      // files, 125 MB between them, and nothing in either directory is ever
      // swapped for a different cut under the same filename. `immutable`
      // means a browser that holds the file will not even send a conditional
      // request, which is exactly right for a track and six hero loops.
      //
      // /images does NOT get `immutable`, and gets thirty days instead of a
      // year, because of five specific files: george.jpg, elleanna.jpg,
      // manos.jpg, chris.jpg and valeria.jpg. Those are the team's own
      // portraits and they DO get replaced in place. Under a year of
      // `immutable` a visitor who had seen the old portrait would keep
      // seeing it until 2027 with no way for us to reach them. Thirty days
      // removes the repeat-visit download just as completely, and any
      // replacement heals itself for everyone inside a month.
      //
      // The rule that still applies to /audio and /videos: REPLACING A FILE
      // THERE MEANS GIVING IT A NEW NAME.
      //
      // Everything else under /public keeps Vercel's default, and that is
      // also deliberate. robots.txt, BingSiteAuth.xml, the Yandex and
      // Pinterest verification pages, the three TikTok tokens and push-sw.js
      // all sit at the root. A service worker and a set of ownership proofs
      // are the last things on this site that should be pinned in a cache.
      //
      // /fonts does not exist today; the five families are served from
      // fonts.gstatic.com and cdn.fontshare.com. The rule is here for job 14,
      // where self-hosting them is on the table. Until then it matches
      // nothing, and that is the honest description of it.
      ...["/audio", "/videos", "/fonts"].map((dir) => ({
        source: `${dir}/:path*`,
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      })),
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      // The tab icons. These are not in /public: Next.js serves them from
      // app/favicon.ico, app/icon.svg and app/apple-icon.png through its
      // metadata-route convention, and that convention ships them with
      // max-age=0, must-revalidate. Every single navigation therefore spends
      // a conditional round trip on three files that had not changed since
      // May, and favicon.ico is 16 KB of that.
      //
      // A day rather than a year on purpose. A favicon is the one asset here
      // that is genuinely rebranded from time to time, and a wrong tab icon
      // pinned for a year in a charterer's browser is a worse outcome than
      // three cheap requests tomorrow morning.
      {
        source: "/:file(favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
      // 2026-05-18 — Admin routes get X-Robots-Tag pinned at the
      // CDN layer too (middleware sets it on its own responses, but
      // not every code path through Next.js runs middleware on the
      // response object — e.g. static prerendered admin chrome).
      // robots.txt already disallows /admin for every user-agent;
      // X-Robots-Tag is the in-band fallback for any crawler that
      // ignores or hasn't re-fetched robots.txt.
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
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

      // Markdown mirrors. Bots that want a clean plain-text
      // representation of any page hit /path/index.md (or the root
      // /index.md). We catch both with two rules and route to the
      // internal /api/markdown handler, which looks up the path in
      // lib/markdown-serializers and returns text/markdown.
      //
      // Order matters: /:path*/index.md catches everything except
      // the bare /index.md, which gets its own rule.
      //
      // 2026-05-18 — Initial implementation passed the captured path
      // as `?path=/:path*` but Next.js's rewrite engine quietly drops
      // captured params when the placeholder appears inside a query
      // value with a leading literal (the `?path=/` prefix confused
      // the substitution). Every /:path*/index.md request hit the
      // handler with no `path` query and fell back to "/", so every
      // mirror returned the homepage. Fix: pass the captured segments
      // through the URL pathname (no query string) and add a
      // catch-all dynamic route at /api/markdown/[[...path]] that
      // reads them from params.
      {
        source: "/index.md",
        destination: "/api/markdown",
      },
      {
        source: "/:path*/index.md",
        destination: "/api/markdown/:path*",
      },
    ];
  },
  async redirects() {
    return [
      // 2026-08-30, George: the TheThoms collaboration interview is
      // deleted outright (his call, and the standing no-thethoms rule).
      // The URL held rankings; it lands on the Journal, not a 404.
      { source: "/blog/pre-collaboration-interview-thethoms", destination: "/blog", permanent: true },
      // 2026-09-04 (plan item 11, George's sign-off): two calculators were
      // answering the same question. /charter-cost-estimator had zero
      // impressions in ninety days and taxed everything at a flat 13% with a
      // flat 33% APA; the tool at /tools/charter-cost-calculator has the
      // impressions and now runs on the Index rate cards. One door.
      { source: "/charter-cost-estimator", destination: "/tools/charter-cost-calculator", permanent: true },
      // 2026-08-21 (section 6) — seven yachts withdrawn on George's
      // instruction, every one of them carrying "Skipper available" or its
      // equivalent in her crew field. Their detail URLs 301 to the fleet
      // rather than 404: whatever links and search equity those pages had
      // are worth more redirected than thrown away, and a visitor arriving
      // from an old bookmark should land on boats they can actually charter.
      //
      // Generated from lib/retiredYachts.js, which is the same list the
      // Sanity client reads, so this file cannot drift out of step with what
      // the site actually serves.
      ...RETIRED_YACHT_SLUGS.map((slug) => ({
        source: `/yachts/${slug}`,
        destination: RETIRED_YACHT_DESTINATION,
        permanent: true,
      })),
      ...RETIRED_YACHT_SLUGS.map((slug) => ({
        source: `/yachts/${slug}/dossier`,
        destination: RETIRED_YACHT_DESTINATION,
        permanent: true,
      })),
      // 2026-06-29 — the four "Kos" Explorer-Fleet yachts were retired
      // (unpublished from Sanity). 301 their detail URLs to the Explorer
      // Fleet listing so external links / search equity never 404.
      {
        source: "/yachts/kos-38",
        destination: "/explorer-fleet",
        permanent: true,
      },
      {
        source: "/yachts/kos-52",
        destination: "/explorer-fleet",
        permanent: true,
      },
      {
        source: "/yachts/kos-52m",
        destination: "/explorer-fleet",
        permanent: true,
      },
      {
        source: "/yachts/kos-58",
        destination: "/explorer-fleet",
        permanent: true,
      },
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
      // region pages exist.
      //
      // 2026-08-06 (job 6) — retargeted. This pointed at
      // /yacht-charter-skiathos, which Search Console shows holds 2
      // impressions. The page Google actually ranks for every Sporades query
      // is /yacht-charter-sporades-skiathos, with 1.007. The redirect was
      // feeding the region's only inbound signal to the wrong URL, and the
      // one it starved is the one sitting at position 23.8 with three clicks.
      {
        source: "/destinations/sporades",
        destination: "/yacht-charter-sporades-skiathos",
        permanent: true,
      },
      // 2026-08-06 (job 6) — /destinations/dodecanese was a hard 404 while
      // /yacht-charter-dodecanese-rhodes carries 872 impressions for exactly
      // that region. Anyone who guesses the URL pattern from the three region
      // pages that do exist hits a dead end. Same treatment as Sporades.
      {
        source: "/destinations/dodecanese",
        destination: "/yacht-charter-dodecanese-rhodes",
        permanent: true,
      },
      // 2026-05-04 link audit fix — broken outgoing links inside
      // blog/airport-hell-2026 pointed at posts that existed as drafts
      // in Sanity but were never published. Send the ghost URLs to
      // /blog so visitors land somewhere coherent, and so the audit
      // stops flagging the parent post as broken. Marked
      // `permanent: false` (307) so we can publish the real posts at
      // these slugs later without a stuck redirect.
      //
      // 2026-06-04 — oil-spike-smart-money-yacht-charter-greece and
      // dubai-exodus-yacht-charter-greece-2026 have now been published
      // in Sanity at these exact slugs, so their 307s were shadowing
      // live articles (every request bounced to /blog). Both entries
      // removed here AND from sitemap.js RETIRED_SLUGS — they now
      // resolve 200 and re-enter the sitemap. last-cabin-standing
      // stays retired: it is an expired "March 2026 final chance"
      // urgency post.
      {
        source: "/blog/last-cabin-standing-book-crewed-yacht-greece-summer-2026",
        destination: "/blog",
        permanent: false,
      },
      // 2026-07-02 Ahrefs audit — the insurance guide's body linked a
      // TEPAI blog slug that never existed. The REAL TEPAI article is
      // live as a programmatic page (lib/articleSeo.js) at
      // /tepai-tax-greece-yacht-charter-2026, so the ghost URL 301s
      // there permanently. (The Sanity body link was also retargeted
      // to the real page directly, 2026-07-02.)
      {
        source: "/blog/tepai-tax-greece-2026-yacht-charter-complete-breakdown",
        destination: "/tepai-tax-greece-yacht-charter-2026",
        permanent: true,
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
      // 2026-07-03 — /power-catamaran-charter-greece redirect REMOVED
      // (was 301 to /best-motor-yachts-greece-speed, a topically wrong
      // target from the 2026-05-14 404 fix). The real power-catamaran
      // page now ships (lib/yachtTypeSeo.js "power-catamaran") because
      // the fleet genuinely runs 9+ power cats. Same precedent as the
      // 2026-06-04 dubai-exodus un-redirect.
      // 2026-06-25 — legal-page consolidation (per legal research).
      // The site had duplicate legal pages: /privacy + /privacy-policy,
      // /terms + /terms-of-service, plus a thin /your-privacy-security.
      // The footer + sitemap already point at /privacy-policy and
      // /terms-of-service as canonical, so 301 the duplicates into them.
      // This removes the duplicate-content/legal-clarity risk. (The
      // NEW consolidated legal COPY is held for attorney sign-off + the
      // real EIN before it replaces the canonical pages' text.)
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
      {
        source: "/your-privacy-security",
        destination: "/privacy-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
