// 2026-05-08 (Boss directive — full-site Phase 28 sweep): only
// load the four free tier faces. The legacy paid-style fonts
// (Cormorant Garamond / Montserrat / Cinzel / Bodoni Moda /
// Italiana / Marcellus) are NOT loaded anymore — every
// `var(--font-cormorant)` etc. now resolves to the Phase 28 tier
// stack via globals.css :root re-mapping. Stops paid-look font
// downloads and trims the first-paint payload.
import localFont from "next/font/local";
import { GFS_Didot } from "next/font/google";
import { FLEET_COUNT } from "@/lib/fleetCount";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";
import RecaptchaOnDemand from "./components/RecaptchaOnDemand";
import GlobalEffects from "./components/GlobalEffects";
import CustomCursor from "./components/CustomCursor"; // reinstated 2026-06-29 (George)
// CustomCursor removed 2026-05-08 (Boss directive) — the custom
// dual-cursor implementation never quite landed and Boss preferred
// the system default. Component file + CSS state machine kept on
// disk for any future re-enable.
// Phase 27i (2026-05-07) — cinematic layer: smooth scroll, scroll
// progress indicator, Web-Audio-synth SFX. All three are no-render
// utility components mounted globally; each one early-returns on
// reduced-motion / coarse pointer / mute as appropriate.
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import SoundFx from "./components/SoundFx";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
// 2026-08-19 (job 8) — not rendered; see the note at its old position.
// import PushOptIn from "./components/PushOptIn";
import CookieConsent from "./components/CookieConsent";
// 2026-05-18 — PostHog provider (free 1M events/mo). Inert until
// NEXT_PUBLIC_POSTHOG_KEY env var is set in Vercel.
import PostHogProvider from "./components/PostHogProvider";
import SpeculationRules from "./components/SpeculationRules";
// 2026-08-19 (job 7) — ContactDrawer is no longer rendered; see the note at
// its old position below. Commented rather than deleted so it is one line back.
// import ContactDrawer from "./components/ContactDrawer";
// 2026-08-19 (job 8) — not rendered; see the note at its old position.
// import VisitorGreeting from "./components/VisitorGreeting";
import AmbientPlayer from "./components/AmbientPlayer";
// Phase 27d (Forbes-launch eve, 2026-05-05) — BrokerStatus pill
// (the green "Dockside — replies within the hour" indicator) removed
// from the layout per Boss explicit instruction: "το πράσινο που
// λέει τώρα dockside διέγραψέ το τελείως, βγάλ' το". The component
// file is preserved on disk in case the presence concept comes back
// in a different form, but it no longer mounts.
// import BrokerStatus from "./components/BrokerStatus";
// 2026-08-19 (job 8) — not rendered; see the note at its old position.
// import ForbesReferrerWelcome from "./components/ForbesReferrerWelcome";
import StickyFleetCTA from "./components/StickyFleetCTA";
// Phase 7 Round 22 (2026-05-12, technical brief Priority 1A) -
// StickyInquiryBar surfaces on all programmatic pages (islands,
// comparisons, glossary, reports, articles, anchorages) after 40%
// scroll. Two CTAs: WhatsApp + Calendly. Dismissible 24h. Coexists
// with WhatsAppButton via body class coordination.
import StickyInquiryBar from "./components/StickyInquiryBar";
import AskGeorgeWidget from "./components/AskGeorgeWidget";
import GoldCurtain from "./components/GoldCurtain";
import RouteTransition from "./components/RouteTransition";
import MouseParallax from "./components/MouseParallax";
// 2026-08-19 (job 8) — not rendered; see the note at its old position.
// import ExitIntentModal from "./components/ExitIntentModal";
import AmbientScroll from "./components/AmbientScroll";
// Cleanup log (for anyone wondering where these went):
//   • TranslateWidget — relocated inside NavDrawerSystem's icon strip
//   • WelcomeLanguagePopup, SmartWelcome, WeatherAware, VoiceSearch —
//     removed as interactive clutter (user picks language themselves)
//   • CookieConsent (custom) — superseded by the Cookiebot banner
//     loaded via the <Script id="Cookiebot"> tag below; two banners
//     was the primary "siege" feel on first visit
//   • Leadsy AI tracker — overlapped with Microsoft Clarity
// import LiveTicker from "./components/LiveTicker"; // unmounted 2026-08-20, see the note at the render site below
import VisitorBeacon from "./components/VisitorBeacon";
// Removed: VoiceSearch (nobody uses voice on yacht sites)
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { WishlistProvider } from "./components/WishlistProvider";
import CurrencyProvider from "./components/CurrencyProvider";
import JsonLd from "./components/JsonLd";
import { organizationSchema } from "@/lib/organizationSchema";
import { serviceSchema, websiteSchema, getServiceSchemaWithReviews } from "@/lib/serviceSchema";
import VisitorIntelligence from "./components/VisitorIntelligence";
import EnhancedAnalytics from "./components/EnhancedAnalytics";
import MicrosoftClarity from "./components/MicrosoftClarity";
import ForbesTopBar from "./components/ForbesTopBar";
import { cookies } from "next/headers";
// Swiper CSS moved to individual Swiper components to avoid loading on non-Swiper pages

// 2026-08-20 (design pass, job 14) — Geist is gone. It was the Next.js
// starter template's default sans and it never painted a single element on
// this site: it declared --font-geist-sans, and that variable is referenced
// nowhere in the codebase. It still cost 28.6 KB on every page, because
// next/font emits a <link rel="preload"> for it, so the browser fetched it
// before it could discover that nobody wanted it.
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Phase 28 sweep — Marcellus / Cormorant Garamond / Montserrat /
// Cinzel / Bodoni Moda / Italiana imports removed. The legacy
// CSS variables (--font-cormorant / --font-cinzel / --font-montserrat
// / --font-bodoni / --font-italiana / --font-marcellus) are now
// aliased in globals.css :root to the Phase 28 tier stacks
// (Sentient / Fraunces / Switzer). Every inline `var(--font-…)`
// reference across the codebase falls through automatically. No
// extra font payload, no paid-style faces.

// Phase 28 (typography overhaul, 2026-05-08) — Boss-approved 5-tier
// system migration. Mapping (paid → free, all four FREE for
// commercial use, self-hosted via next/font + FontShare CDN @import):
//
//   Tier 1 (Display / Hero)        Canela        →  Fraunces       (Google)
//   Tier 2 (Editorial H2/H3)       Tiempos       →  Sentient       (FontShare)
//   Tier 3 (Body / Reading)        Graphik       →  General Sans   (FontShare)
//   Tier 4–5 (UI / Captions)       NHG           →  Switzer        (FontShare)
//
// Fraunces loads here via next/font/google. The three FontShare
// faces load via @import in globals.css (api.fontshare.com is the
// official free CDN, identical pattern to fonts.googleapis.com,
// CC-BY-style license — Boss verified, no procurement needed).
//
// CSS variables exposed for the tier mapping:
//   --gy-font-display    (Fraunces)
//   --gy-font-editorial  (Sentient)
//   --gy-font-body       (General Sans)
//   --gy-font-ui         (Switzer)
//
// The legacy --font-cinzel / --font-cormorant / --font-montserrat
// vars stay for now — they're referenced in dozens of inline styles
// across components. Migration happens progressively: components
// either get refactored to the new tier vars or fall back to the
// legacy var (which keeps rendering with its current font). No
// component breaks during the rollout.
// 2026-08-20 (design pass, job 14) — two families, and the second pass at it.
//
// The first pass picked Bodoni Moda + EB Garamond, reasoning from what the US
// HNWI already reads. That reasoning still holds, and the table is why:
//
//   Vogue US               FB Didot (display)      + Adobe Garamond (text)
//   Architectural Digest   Adobe Garamond          + Crimson Text
//   Robb Report            Boogy Brut (display)    + Saans
//   Feadship               PP Eiko (display)       + Gotham
//   Aman                   Lyon Display            + Lyon Text
//   Northrop & Johnson     Schnyder (display only) + Barlow (free, Google)
//   Fraser / Burgess / Y.CO / NetJets              geometric sans, no serif
//
// George's correction was the useful half: the site has to LOOK DIFFERENT from
// the others, not merely be correct. Bodoni Moda is the right register and the
// wrong choice, because it is the most common free didone in the world and it
// sits underneath thousands of templates. Every face in that table is expensive
// and rare. Matching the register with a common face buys the reference without
// the distinction.
//
// So: same structure, rarer faces, still free.
//
//   Display   Boska       Barbara Bigosinska, ITF Free Font License
//   Text      Switzer     Jeremie Hornus, ITF Free Font License
//   Greek     GFS Didot   Greek Font Society, OFL
//
// Stardom is the closest free face to the Schnyder / Ogg register the American
// houses pay for: sharp cut serifs, hard vertical stress, and authority in
// capitals, which is what matters here because our h1s are yacht names in caps.
// It ships one weight. That is not a compromise for this job: Northrop &
// Johnson run Schnyder in a single weight, for display only, and so do we.
//
// Switzer stays, and it is not a new dependency. It was already the site's
// workhorse, 668 elements on a yacht page. What changes is that it is now
// served from our own origin instead of the Fontshare CDN, and it is the true
// variable cut, so one 43 KB file answers every weight from 100 to 900 that any
// component asks for. The pairing is Robb Report's and Feadship's: a dramatic
// display serif over a quiet grotesque. The quiet half is what lets the loud
// half read as expensive rather than busy.
//
// Both are served from /fonts, which next.config.mjs already sends with a
// one-year immutable cache (job 1). Provenance and licence are recorded in
// public/fonts/README-FONTS.md.
const boska = localFont({
  src: [{ path: "../public/fonts/Boska-Variable.woff2", weight: "200 900", style: "normal" }],
  variable: "--gy-face-display",
  display: "swap",
  // The synthetic fallback is measured against Times rather than the default
  // Arial: both it and Stardom are high-contrast serifs, so the swap when the
  // real face lands moves the line far less.
  // adjustFontFallback is OFF, and that is load-bearing too.
  //
  // Left on, next/font inserts a synthetic "boska Fallback" family directly
  // after the real one, built from Times with adjusted metrics. Times has
  // Greek. So a Greek heading matched that synthetic face and never reached
  // GFS Didot: measured 936px for the same string that GFS Didot sets at 853.
  // Correct-looking stack, wrong glyphs, and it would have shipped silently.
  //
  // The cost of turning it off is a little layout shift while the face loads.
  // It is a small cost here: Boska is 47 KB, preloaded, and display: swap
  // means the window is a few frames. Switzer keeps its adjusted fallback,
  // because Greek body text landing on a system sans is fine, and Greek
  // headings were the part that mattered.
  adjustFontFallback: false,
  // NO fallback array here either, and that is load-bearing.
  //
  // next/font appends whatever is passed to the family list it publishes in
  // the variable, so fallback: ["Georgia", "serif"] made --gy-face-display
  // expand to `boska, boska Fallback, Georgia, serif`. The tier stacks in
  // globals.css then append the Greek face after it, and serif is a GENERIC
  // family that always matches, so nothing past it is ever consulted. Greek
  // headings would have gone back to Georgia, silently, which is the exact
  // defect this pass set out to fix. Measured on the built page before the
  // fix: font-family: boska, "boska Fallback", Georgia, serif, "GFS Didot".
  //
  // The full chain belongs in one place. globals.css owns it.
});

const switzer = localFont({
  src: [{ path: "../public/fonts/Switzer-Variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--gy-face-text",
  display: "swap",
  // Same reason as the display face above: no fallback array, because
  // sans-serif at the end of it would swallow the Greek face that the tier
  // stacks append after this variable.
});

// The italic is a separate loader for one reason: preload.
//
// Listed as a second src entry on the loader above, next/font preloads it too,
// and that is 33.4 KB fetched during first paint for type that is almost never
// in the first screen. The italic on this site is blockquotes, <em> inside body
// copy, and the Forbes strapline: all of it below the fold, none of it LCP.
//
// Split out with preload off, it is fetched the moment something italic is
// actually rendered and not a moment earlier. First paint drops from 96.8 KB
// of type to 63.4 KB. Same reasoning as the Greek face below, same reasoning
// that removed Geist.
const switzerItalic = localFont({
  src: [{ path: "../public/fonts/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" }],
  variable: "--gy-face-text-italic",
  display: "swap",
  preload: false,
});

// Greek, in its own loader and deliberately NOT preloaded. This is the trap
// Geist fell into, caught before it shipped.
//
// The obvious way to write this is subsets: ["latin", "greek"] on the text
// loader. I did exactly that with the previous pair, built it, and measured
// what came out: next/font emitted a <link rel="preload"> for the Greek cut of
// both roman and italic, 19.4 KB and 19.1 KB, on every page of the site. A
// preload is fetched whether or not a single glyph ever needs it, so 465
// English pages would have paid 38.5 KB to serve 11 Greek ones.
//
// Split out, the browser does the right thing by itself: the face carries a
// unicode-range over U+0370-03FF, it is named after the Latin faces in the
// stacks in globals.css, and with no preload tag it is fetched only when a
// Greek character actually has to be drawn.
//
// GFS Didot rather than a Greek cut of the text face, because George's
// instruction was that Greek may be a completely different typeface so long as
// it matches the house. It does, better than the alternatives: a Greek didone
// by the Greek Font Society, sharing Stardom's high contrast and vertical
// stress. Held against it, EB Garamond's Greek reads rounder and warmer and
// does not sit with Stardom at all.
//
// Greek is not only the 11 /el/ pages: the newsletter page, the
// "Related pages" strip in SeoLanding and the cabin portal all set Greek.
const gfsDidot = GFS_Didot({
  subsets: ["greek"],
  weight: "400",
  style: "normal",
  variable: "--gy-face-greek",
  display: "swap",
  preload: false,
});


// Site-wide defaults every page inherits. Individual pages override via
// their own `export const metadata` or `generateMetadata`. Audited
// 2026-04-24: without these defaults, any page missing its own metadata
// was shipping blank OG / Twitter / robots / icons to crawlers.
export const metadata = {
  metadataBase: new URL("https://georgeyachts.com"),
  title: {
    default: "Luxury Yacht Charter Greece · A House, Not a Platform | George Yachts",
    template: "%s | George Yachts",
  },
  description:
    `Featured in Forbes (May 2026). George Yachts Brokerage House - boutique luxury yacht charter in Greek waters. ${FLEET_COUNT} curated yachts. Private Fleet (full crew) + Explorer Fleet (skippered). IYBA Charter Active Member. Cyclades, Ionian, Saronic. Personal broker service from Athens.`,
  applicationName: "George Yachts",
  authors: [{ name: "George P. Biniaris", url: "https://georgeyachts.com" }],
  generator: "Next.js",
  keywords: [
    "yacht charter greece",
    "luxury yacht charter",
    "crewed yacht charter",
    "cyclades yacht charter",
    "ionian yacht charter",
    "saronic yacht charter",
    "greek islands yacht",
    "MYBA charter",
    "catamaran charter greece",
    "motor yacht charter greece",
    "sailing yacht charter greece",
  ],
  // Phase 27 (Forbes-launch eve, 2026-05-05) — Boss replaced the
  // bookmark logo with a Cinzel-style gold "G" matching the AskGeorge
  // widget identity ("multi-trillion level, αρμόζει στην ταυτότητά
  // μας"). icon.svg stays SVG (browsers handle it well). apple-icon
  // had to go to PNG: iOS Safari does not reliably render SVG
  // home-screen icons, and Next.js's app-router apple-icon convention
  // only accepts jpg|jpeg|png. Was 404'ing in production until
  // 2026-05-11 when we rendered the SVG to 180x180 PNG via Sharp.
  // The .svg file stays on disk for reference / future re-render.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Boss directive 2026-05-08 — webmaster-tool ownership verification.
  // Each meta tag is added by the upstream tool when the property is
  // claimed; we keep them all here so the homepage <head> serves the
  // full set in one render. Yandex is verified via the standalone HTML
  // file at /public/yandex_ca7f0d2ae243a269.html (no meta tag needed
  // for that method).
  verification: {
    other: {
      "msvalidate.01": "9590EE7F9E1A7B891E7DEF1DA4B6C5D6",
      "p:domain_verify": "90c2335ca4946a7b03a5aec55b495930",
    },
  },
  openGraph: {
    type: "website",
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
    url: "https://georgeyachts.com",
    title: "George Yachts | Featured in Forbes · Luxury Yacht Charter Greece",
    description:
      `Featured in Forbes (May 2026). ${FLEET_COUNT} curated yachts in Greek waters. Private Fleet (full crew) + Explorer Fleet (skippered). IYBA Charter Active Member. Personal broker service from Athens.`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "George Yachts - Featured in Forbes · Luxury Yacht Charter Greece",
      },
    ],
  },
  twitter: {
    // 2026-05-12 — title/description/images intentionally omitted at
    // the layout level. When set, Next.js emits literal <meta name=
    // "twitter:*"> tags that override the page-specific openGraph
    // image we generate at /api/og?title=...&eyebrow=... — every
    // non-home page was shipping the homepage Forbes banner on
    // Twitter shares. Twitter's card renderer falls back to og:image
    // / og:title / og:description when twitter:* equivalents are
    // absent, so removing them lets each page's dynamic OG flow
    // through to the Twitter preview naturally.
    card: "summary_large_image",
    site: "@georgeyachts",
    creator: "@georgeyachts",
  },
  robots: {
    index: true,
    follow: true,
    // 2026-06-29 — lifted the max-* directives to the top level (they were
    // googleBot-only). Bing/Copilot, DuckDuckGo, and the other non-Google
    // crawlers read the generic robots meta, so they now also get
    // full-length text snippets and large image previews, not just Googlebot.
    // ChatGPT and Copilot lean on Bing's index, so this widens AI-snippet reach.
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    // 2026-07-02 SEO fix — DROPPED the global canonical that lived
    // here. It cascaded to every page that didn't declare its own
    // alternates.canonical (/private-fleet, /explorer-fleet, all
    // /journal/* clusters), telling Google each of them "I am the
    // homepage" and suppressing their indexing. The homepage sets its
    // own canonical in app/page.jsx; every other indexable page must
    // declare its own. No canonical tag is neutral; a wrong one is
    // actively harmful.
    // 2026-05-07 SEO fix — DROPPED the languages: { ... } block.
    // The `?lang=xx` URLs share their canonical with the bare URL
    // (i18n is client-side, no server-side routing per locale), so
    // declaring them as hreflang alternates was mis-signalling to
    // Google. Ahrefs flagged 37 "Hreflang to non-canonical" + 15
    // "Missing reciprocal hreflang" criticals from this alone.
    // Re-introduce when (if) we move to directory-based locale
    // routing (/el/..., /ru/...).
    types: {
      "application/rss+xml": "https://georgeyachts.com/feed.xml",
    },
  },
  category: "Travel",
};

// Next 15 viewport export — used to be under metadata.viewport, now a
// separate export. Themes the PWA install surface and sets initial
// zoom behavior correctly.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0D1B2A",
  colorScheme: "dark light",
};

export default async function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Tier 1.1 — When the Forbes bar is present, push the body 36px
  // (32px on mobile) so the fixed bar doesn't crop the hero. Once
  // dismissed (cookie set), padding returns to 0 and the page
  // reclaims that strip. Read server-side so the very first paint
  // already has the correct offset — no layout shift after hydration.
  // 2026-05-08 (Chapter 01) — Forbes top bar is now non-dismissible
  // per Boss directive ("πάρα πολύ σημαντικό credential, να μην
  // μπορεί να το κλείσει"). The cookie check is kept inline as a
  // const so the body class below stays a single expression, but
  // it's hardcoded to false — the bar always renders, the
  // gy-with-forbes-bar offset always applies.
  const forbesDismissed = false;

  // Phase 27e (Forbes-launch eve, 2026-05-05) — fetch the Service
  // schema WITH AggregateRating if real reviews exist in Sanity.
  // Returns the same static schema when there are <3 reviews (which
  // is the case today). Wraps in try/catch so a Sanity outage never
  // breaks the layout render.
  let liveServiceSchema = serviceSchema;
  try {
    liveServiceSchema = await getServiceSchemaWithReviews();
  } catch {
    // fall through to static schema
  }

  // Stage 2 (Extra IG) - consolidate the three site-wide entities into ONE
  // @graph so crawlers read a single connected knowledge graph. The @ids
  // already cross-reference each other (Phase A fix); @context moves to the
  // wrapper and is stripped from each node. Imports are NOT mutated (the map
  // returns rest-spread copies).
  const entityGraph = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, liveServiceSchema, websiteSchema].map((s) => {
      const { "@context": _ctx, ...node } = s;
      return node;
    }),
  };

  return (
    <html lang="en">
      <head>
        {/* Phase 28 (typography overhaul, 2026-05-08), FontShare CDN
            for the three free FontShare faces in the 5-tier system:
            Sentient (editorial H2/H3), General Sans (body / reading),
            Switzer (UI / captions). Loaded as a stylesheet <link> in
            <head> rather than @import inside globals.css because
            Next/Turbopack's optimizeCss experiment was silently
            dropping the @import from the production bundle. The
            preconnect hint shaves ~150 ms off the first paint by
            opening the TLS connection early. */}
        {/* 2026-08-20 (design pass, job 14) — the two Fontshare preconnects are
            gone with the stylesheet they were opening a connection for. Both
            faces are self-hosted from /fonts now, so these were two TLS
            handshakes on every page load to a host nothing requests.

            A preconnect is not a CSP entry: dropping it cannot break a load,
            it can only stop a connection nobody uses. The CSP entries for the
            same hosts stay where they are, for the reason in the note further
            down.
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" /> */}
        {/* 2026-05-12, yacht thumbnails (homepage trending carousel,
            fleet grid, yacht detail galleries) all load from
            cdn.sanity.io. Homepage references it 76 times. Preconnect
            opens the TLS connection during HTML parse and shaves
            150-300 ms off the first Sanity image fetch. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        {/* 2026-07-30, the Pexels + Unsplash preconnects are gone. They were
            added 2026-05-18 for destination stock photography, but every one
            of those images has since been uploaded into Sanity and is served
            from cdn.sanity.io: a grep across all 479 built pages finds zero
            images.pexels.com / images.unsplash.com assets. They were costing
            us twice over. Two unused TLS handshakes on every page load, and
            the bare https://images.pexels.com href was being crawled as an
            external 4XX on every page (Ahrefs, 30/07/2026). If stock photos
            from either host ever come back, restore the preconnect with
            them. */}
        {/* 2026-05-14, Ahrefs flagged 459 pages "Page has broken CSS".
            Root cause: the fontshare /v2/css endpoint returns 500 for
            ANY italic variant (400i / 500i / etc), confirmed by
            bisection (sentient@400,500 → 200 OK; +500i → 500 ERROR).
            Italic styles fall back to browser-synthesised oblique
            (font-synthesis: style; default), visually negligible at
            our body / accent sizes, and the alternative was the entire
            stylesheet 500'ing on every page. Revisit if fontshare ever
            ships the italic fix. */}
        {/* 2026-08-20 (design pass, job 14) — the FontShare stylesheet is
            gone with the three faces it served. Sentient, General Sans and
            Switzer are no longer referenced: the two-family system routes
            every tier variable to Bodoni Moda or EB Garamond, both
            self-hosted by next/font.

            What this removes from every page load: one render-blocking
            stylesheet on a third-party host, two TLS handshakes for the
            preconnects above, and up to fourteen declared font files.

            The api/cdn.fontshare.com preconnects and the CSP entries for
            those hosts are left in place on purpose. They cost nothing now
            that nothing requests them, and pulling hosts out of a CSP is how
            this site has broken itself four times already (Cookiebot,
            Clarity, GA4, reCAPTCHA).
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=sentient@400,500&f[]=general-sans@200,300,400,500,600,700&f[]=switzer@200,300,400,500,600,700&display=swap"
        /> */}

        {/* theme-color + apple-mobile-web-app-* now emitted by Next's
            Metadata API (see `export const viewport` + `metadata.icons`
            above). `mobile-web-app-capable` is the non-deprecated
            successor to Apple's proprietary meta and is emitted via the
            manifest.json. */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Phase 27 (Forbes-launch eve, 2026-05-05), SEO/GEO push for
            #1 ranking on "yacht charter Greece". Geo meta tags help
            Google + Bing + AI search engines (Perplexity / ChatGPT /
            Claude / Gemini) anchor the site to Kifisia/Greece for
            local-intent queries. Coordinates must match the Google
            Business Profile pin exactly (38.0876, 23.8084, Charilaou
            Trikoupi 190A, Kifisia) so Google can reconcile NAP across
            site meta, JSON-LD, and Maps. The schema additions below
            feed Google's Knowledge Graph + AI search citations. */}
        <meta name="geo.region" content="GR-A1" />
        <meta name="geo.placename" content="Kifisia, Greece" />
        <meta name="geo.position" content="38.0876;23.8084" />
        <meta name="ICBM" content="38.0876, 23.8084" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="coverage" content="Worldwide - service area Greek waters" />
        <meta name="target" content="UHNW yacht charter clients globally" />
        {/* AI-search hints (non-standard but parsed by some AI crawlers) */}
        <meta name="ai-content-declaration" content="human-authored" />
        <meta name="ai-search-priority" content="yacht-charter-greece, luxury-yacht-charter-greek-islands, crewed-yacht-charter-cyclades, motor-yacht-charter-mykonos, sailing-yacht-charter-ionian, superyacht-charter-greece" />
        {/* 2026-06-25, Cookiebot REMOVED (paid dependency beyond its
            50-page free tier; George: "no subscriptions"). Replaced by a
            free, self-hosted consent system: <CookieConsent /> banner +
            Google Consent Mode v2 defaults (set with the GA4 init below)
            + the consent-gated <MicrosoftClarity />. Zero cost, covers all
            pages, fully owned, brand-matched. */}
      </head>

      <body
        className={`${boska.variable} ${switzer.variable} ${switzerItalic.variable} ${gfsDidot.variable} antialiased${forbesDismissed ? "" : " gy-with-forbes-bar"}`}
      >
        {/* Skip to main content, accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#C9A84C] focus:text-black focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:rounded"
        >
          Skip to main content
        </a>

        {/* Tier 1.1, Forbes feature bar (sitewide, server-rendered).
            George Yachts featured in Forbes, 1 May 2026. The bar sits
            above all other UI; cookie-dismissible for 90 days. */}
        <ForbesTopBar />

        {/* E1, Gold curtain opens once per session, first thing visitors see */}
        <GoldCurtain />
        {/* Phase 22 (luxury rebuild), Hermes/Bottega-style gold sweep
            on every route change. 360ms ribbon wipe. Skipped on first
            mount (GoldCurtain owns the entrance) and on prefers-reduced-
            motion. */}
        <RouteTransition />
        {/* Phase 26, pseudo-3D mouse parallax on .gy-ken-burns
            containers (yacht hero, /greece-by-yacht hero). Cheap
            CSS substitute for the AI depth-map in Boss's C1 combo
            decision. Skipped on touch + reduced-motion. */}
        <MouseParallax />

        {/* Stage 2 (Extra IG) - Organization + Service + WebSite consolidated
            into ONE @graph so AI engines and Google read a single connected
            entity graph (the @ids cross-reference each other). Per-page schemas
            (FAQPage, Article, Product, BreadcrumbList, etc.) intentionally stay
            as their own blocks - they are page-specific. Service is the live
            variant (AggregateRating attaches when 3+ real reviews exist). */}
        <JsonLd data={entityGraph} />
        {/* 1. Critical External Scripts */}
        {/* 2026-08-19 (design pass, job 5) — reCAPTCHA was a <Script
            strategy="lazyOnload"> here, so all 476 pages fetched Google's
            313 KB enterprise.js whether or not the visitor ever met a form.
            It now loads on the first focus into a field, or when a modal
            announces itself. See RecaptchaOnDemand for why the homepage
            could not simply be excluded. */}
        {recaptchaKey && <RecaptchaOnDemand siteKey={recaptchaKey} />}

        {/* Global Effects + Custom Cursor, all pages */}
        <GlobalEffects />
        <CustomCursor />
        {/* Phase 27i (2026-05-07), cinematic layer.
            SmoothScroll: Lenis-driven interpolated scrolling, the
              page glides instead of snapping.
            ScrollProgress: gold thin line at the top, 1st cinematic
              cue on every page.
            SoundFx: Web-Audio-synthesised hover chime + click bell +
              section-reveal tone. Zero audio files. Mute shares the
              AmbientPlayer's session-key, so one toggle covers all
              sound on the site. */}
        <SmoothScroll />
        <ScrollProgress />
        <SoundFx />
        <ScrollToTop />
        {/* A4, Ambient scroll parallax driver (publishes CSS vars) */}
        <AmbientScroll />
        {/* 2026-07-02 (ASK B 2.4), Speculation Rules prerender for the
            two highest-intent destinations. Progressive enhancement;
            PostHogProvider gates analytics on document.prerendering. */}
        <SpeculationRules />
        {/* 2. Page Content */}
        <PostHogProvider>
        <I18nProvider>
        <WishlistProvider>
        <CurrencyProvider>
        <NavDrawerSystem />
        <main id="main-content">
        {children}
        </main>
        {/* 2026-08-20 (design pass) — LiveTicker unmounted, George's call after
            it surfaced during job 13 testing. The component file stays on disk
            untouched, so this is one line to reverse.

            It was not social proof, it was generated: a random city from a list
            of 24 crossed with a random name from a list of 24 yachts, fired at
            90-150s and then every 2-4 minutes for as long as the tab stayed
            open, on every page of the site. 15% of the messages claimed a
            commercial event that had not happened ("just requested a quote
            for", "inquired about", "just sent an inquiry"), naming real yachts
            that belong to real owners and central agents.

            Three reasons beyond it simply not being true:
              1. The claim is checkable. A client reads "Someone from Milan just
                 requested a quote for S/CAT Genny", asks George about that week,
                 and there is no good answer left to give.
              2. Wrong signal for this buyer. The rolling-toast pattern belongs
                 to booking platforms. Fraser, IYC, Burgess and Northrop &
                 Johnson do not run it, and the visitor who charters a 50 m
                 Couach knows where he has seen it before.
              3. It contradicted the page it sat on. The hero reads "A house,
                 not a platform. No call centres, no handovers, no ticket
                 numbers." A manufactured urgency toast is a platform behaviour.

            Nothing depends on it: lib/popup-coordinator.js only names it in a
            comment, and the [data-live-ticker] rule in globals.css now matches
            nothing. */}
        {/* CookieConsent (custom), removed; Cookiebot handles it */}
        {/* Removed VoiceSearch */}
        {/* TranslateWidget moved into NavDrawerSystem's right icon
            strip, cleaner placement, no floating pill clashing with
            social icons or the hero content. */}
        <WhatsAppButton />
        {/* 2026-06-25, Web Push opt-in. Discreet, contextual (high-intent
            pages only), dismissible; bottom-LEFT so it never clashes with
            the WhatsApp FAB bottom-right. Push-only service worker, so it
            cannot affect page loads. Free owned channel for last-minute
            availability. Needs VAPID_PRIVATE_KEY in Vercel to send. */}
        {/* 2026-08-19 (job 8) — no longer rendered. It waited for a scroll
            and a timer on high-intent pages, which is the definition of an
            automatic popup.

            This one has a cost worth naming: it is the only place a visitor
            could subscribe to push, so the site now gains no new subscribers.
            Existing ones are untouched, /api/push/send still works, and the
            VAPID keypair is unchanged, so the channel can be reopened by
            uncommenting this line. */}
        {/* <PushOptIn /> */}
        {/* Phase 1 / B2 (luxury rebuild, 2026-05-05), multi-channel
            contact drawer (WhatsApp / iMessage / Signal / direct call).
            Sat above the WhatsApp FAB; one tap surfaced every channel.

            2026-08-19 (design pass, job 7) — no longer rendered, on George's
            own verdict, and the reasoning holds: the right edge of every page
            carried four floating buttons, and a drawer whose first offer was
            WhatsApp sat directly on top of the WhatsApp button. A second door
            into the same room.

            WhatsApp survives in ten other places and the phone number in four
            including the footer, so neither is lost. iMessage and Signal WERE
            only here and go with it. That is a real consequence and the
            decision was taken knowing it.

            The component file stays on disk, unimported and so not shipped.
            Restoring it is uncommenting two lines. */}
        {/* <ContactDrawer /> */}
        {/* Phase 1 / G2 (luxury rebuild, 2026-05-05), first-visit
            subtle greeting that reads visitor's IP city + local time
            ("Good evening from Athens, 21:14 local"). Free Vercel
            geo headers, no third-party calls, fades after 4s. */}
        {/* 2026-08-19 (job 8) — no longer rendered. Three chained timers
            faded a greeting in and out over the page. Nothing was captured
            and nothing is lost; a visitor who wants to know we are in Athens
            can read it in the footer. */}
        {/* <VisitorGreeting /> */}
        {/* Phase 27, AmbientPlayer is back per Boss directive
            ("μη μου διαγράφεις πράγματα που δε σου 'χω πει εγώ").
            Click-to-play remains the model, pill stays muted on
            load, plays only after the explicit gesture. Sound
            quality fix tracked separately. */}
        <AmbientPlayer />
        {/* Phase 27d (2026-05-05), BrokerStatus retired per Boss
            instruction. The pill was breaking the hero composition.
            <BrokerStatus />  */}
        {/* Phase 21, Forbes referrer welcome card. Detects ?ref=forbes
            or referrer containing forbes.com, slides in once per session,
            offers a direct path to Brief George. */}
        {/* 2026-08-19 (job 8) — no longer rendered. It slid in on a timer,
            which makes it an automatic popup whatever the copy said. Forbes
            visitors still land on the same page with the same CTAs. */}
        {/* <ForbesReferrerWelcome /> */}
        {/* H.1, Ask George AI Concierge (sitewide). Sits ABOVE the
            WhatsApp button at bottom-right. Widget is fully client-side;
            graceful fallback when AI_API_KEY env vars aren't configured. */}
        <AskGeorgeWidget />
        {/* Roberto 2026-05-02, sticky bottom CTA so the fleet is one
            tap from anywhere on the site (auto-hides on fleet/yacht
            routes). yachtCount left undefined here at the layout
            level since we don't have it server-side without an extra
            Sanity round-trip on every route; the component falls
            back to "View All Yachts" when count is missing. */}
        <StickyFleetCTA />
        {/* Phase 7 R22 (2026-05-12, technical brief Priority 1A) -
            StickyInquiryBar for programmatic pages. The component
            self-suppresses on homepage and conversion pages. */}
        <StickyInquiryBar />
        {/* D2, Exit-intent capture, one shot per session.

            2026-08-19 (design pass, job 8) — no longer rendered. George asked
            for every automatic popup to go, and this was the most aggressive
            of them: it watched for the cursor leaving the top of the window
            and threw a newsletter form in front of someone who was already
            leaving.

            It captured real addresses, so this was checked before it went.
            /api/newsletter is reached from four other places: the footer of
            every page, the dedicated /newsletter page, FirstAccessBand, and
            the yacht-page dossier request. The channel is intact; only the
            ambush is gone. */}
        {/* <ExitIntentModal /> */}
        {/* FavoritesEmailPrompt removed 2026-05-08 (Boss directive)
            interrupting a visitor mid-shortlist with a modal is
            the wrong moment. The /favorites page already exposes
            a static "Send to George" form that does the same job
            on the visitor's own schedule. */}
        <VisitorBeacon />
        </CurrencyProvider>
        </WishlistProvider>
        </I18nProvider>
        </PostHogProvider>

        {/* Visitor Intelligence: real-time tracking + hot lead popup */}
        <VisitorIntelligence />

        {/* Free, self-hosted cookie-consent banner (replaces Cookiebot). */}
        <CookieConsent />

        {/* 3. Analytics & Tracking */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CM483Z0JT5"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          // Google Consent Mode v2 - DENY analytics/ads storage by default
          // so GA4 sets no identifying cookies until the visitor opts in via
          // <CookieConsent />. If they already consented (prior visit), grant
          // immediately from the stored decision. The banner calls
          // gtag('consent','update',...) on Accept (see lib/consent.js).
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          try {
            var __c = JSON.parse(localStorage.getItem('gy_cookie_consent') || 'null');
            if (__c && __c.version === 1 && __c.analytics) {
              gtag('consent', 'update', {
                analytics_storage: 'granted',
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          } catch (e) {}
          gtag('config', 'G-CM483Z0JT5');
          `}
        </Script>


        {/* Removed: Smartsupp live-chat loader, George 2026-04-21
            "eksafanise to teleiws den mas noiazei". Primary inbound
            channel is WhatsApp (see <WhatsAppButton />), so the chat
            widget was just another floating surface competing for
            attention without adding conversion. ~15 KB external JS
            off the first paint; Smartsupp domain can now come out of
            the CSP disclosure as well. */}

        {/* Removed: Leadsy AI tracker, form-interaction + visitor
            tracking was overlapping with Microsoft Clarity (which
            already captures full session recordings + heatmaps).
            Keeping one vendor for that surface keeps the page lighter
            and the GDPR disclosure simpler. */}

        {/* Safe Pass Apr 2026, additive enhanced analytics */}
        <EnhancedAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
