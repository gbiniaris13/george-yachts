import { Geist, Marcellus, Cormorant_Garamond, Montserrat, Bodoni_Moda, Italiana, Cinzel } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";
import GlobalEffects from "./components/GlobalEffects";
import CustomCursor from "./components/CustomCursor";
import WhatsAppButton from "./components/WhatsAppButton";
import ContactDrawer from "./components/ContactDrawer";
import VisitorGreeting from "./components/VisitorGreeting";
import AmbientPlayer from "./components/AmbientPlayer";
// Phase 27d (Forbes-launch eve, 2026-05-05) — BrokerStatus pill
// (the green "Dockside — replies within the hour" indicator) removed
// from the layout per Boss explicit instruction: "το πράσινο που
// λέει τώρα dockside διέγραψέ το τελείως, βγάλ' το". The component
// file is preserved on disk in case the presence concept comes back
// in a different form, but it no longer mounts.
// import BrokerStatus from "./components/BrokerStatus";
import ForbesReferrerWelcome from "./components/ForbesReferrerWelcome";
import StickyFleetCTA from "./components/StickyFleetCTA";
import AskGeorgeWidget from "./components/AskGeorgeWidget";
import GoldCurtain from "./components/GoldCurtain";
import RouteTransition from "./components/RouteTransition";
import MouseParallax from "./components/MouseParallax";
import ExitIntentModal from "./components/ExitIntentModal";
import AmbientScroll from "./components/AmbientScroll";
// Cleanup log (for anyone wondering where these went):
//   • TranslateWidget — relocated inside NavDrawerSystem's icon strip
//   • WelcomeLanguagePopup, SmartWelcome, WeatherAware, VoiceSearch —
//     removed as interactive clutter (user picks language themselves)
//   • CookieConsent (custom) — superseded by the Cookiebot banner
//     loaded via the <Script id="Cookiebot"> tag below; two banners
//     was the primary "siege" feel on first visit
//   • Leadsy AI tracker — overlapped with Microsoft Clarity
import LiveTicker from "./components/LiveTicker";
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
import FavoritesEmailPrompt from "./components/FavoritesEmailPrompt";
import { cookies } from "next/headers";
// Swiper CSS moved to individual Swiper components to avoid loading on non-Swiper pages

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// Removed: Geist_Mono (zero uses anywhere in the tree) and Barlow
// (used in a single legacy `.the` rule in globals.css — replaced with
// system sans). Saves ~33 KB of font payload on every first paint.
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

// Phase 17c (luxury rebuild, 2026-05-05) — old-money billionaire-tier
// typography research. Boss directive: "Trajan Pro / Cinzel — what
// Aman, Belmond, Bulgari, Four Seasons, Le Bristol Paris, the Carlyle
// NYC use. Old money. Roman temple inscription dignity." Cinzel is
// the free Trajan derivative on Google Fonts — same proportions, same
// mood. Weight 500 (medium), UPPERCASE only — never bold, never
// kindergarten. This is the wordmark / hero font for the entire site.
//
// Bodoni Moda + Italiana stay loaded for editorial accents (pull
// quotes, magazine-style display) but the masthead is now Cinzel.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});
const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});
const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
  display: "swap",
});

// Site-wide defaults every page inherits. Individual pages override via
// their own `export const metadata` or `generateMetadata`. Audited
// 2026-04-24: without these defaults, any page missing its own metadata
// was shipping blank OG / Twitter / robots / icons to crawlers.
export const metadata = {
  metadataBase: new URL("https://georgeyachts.com"),
  title: {
    default: "George Yachts | Featured in Forbes · Luxury Yacht Charter Greece",
    template: "%s | George Yachts",
  },
  description:
    "Featured in Forbes (May 2026). George Yachts Brokerage House — boutique luxury yacht charter in Greek waters. 66 curated yachts. Private Fleet (full crew) + Explorer Fleet (skippered). IYBA Charter Active Member. Cyclades, Ionian, Saronic, Sporades. Personal broker service from Athens.",
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
  // μας"). Both icon.svg + apple-icon.svg are vector now (crisp at
  // every size). Next auto-discovers /favicon.ico if present.
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: "George Yachts Brokerage House",
    locale: "en_US",
    url: "https://georgeyachts.com",
    title: "George Yachts | Featured in Forbes · Luxury Yacht Charter Greece",
    description:
      "Featured in Forbes (May 2026). 66 curated yachts in Greek waters. Private Fleet (full crew) + Explorer Fleet (skippered). IYBA Charter Active Member. Personal broker service from Athens.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "George Yachts — Featured in Forbes · Luxury Yacht Charter Greece",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@georgeyachts",
    creator: "@georgeyachts",
    title: "George Yachts | Featured in Forbes · Greek Waters",
    description:
      "Featured in Forbes (May 2026). 66 yachts. Private Fleet (full crew) + Explorer Fleet (skippered). IYBA Member.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "https://georgeyachts.com",
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
  themeColor: "#000000",
  colorScheme: "dark light",
};

export default async function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Tier 1.1 — When the Forbes bar is present, push the body 36px
  // (32px on mobile) so the fixed bar doesn't crop the hero. Once
  // dismissed (cookie set), padding returns to 0 and the page
  // reclaims that strip. Read server-side so the very first paint
  // already has the correct offset — no layout shift after hydration.
  const forbesDismissed =
    (await cookies()).get("gy_forbes_bar_dismissed")?.value === "true";

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

  return (
    <html lang="en">
      <head>
        {/* theme-color + apple-mobile-web-app-* now emitted by Next's
            Metadata API (see `export const viewport` + `metadata.icons`
            above). `mobile-web-app-capable` is the non-deprecated
            successor to Apple's proprietary meta and is emitted via the
            manifest.json. */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Phase 27 (Forbes-launch eve, 2026-05-05) — SEO/GEO push for
            #1 ranking on "yacht charter Greece". Geo meta tags help
            Google + Bing + AI search engines (Perplexity / ChatGPT /
            Claude / Gemini) anchor the site to Athens/Greece for
            local-intent queries. The schema additions below feed
            Google's Knowledge Graph + AI search citations directly. */}
        <meta name="geo.region" content="GR-A1" />
        <meta name="geo.placename" content="Athens, Greece" />
        <meta name="geo.position" content="38.0833;23.8167" />
        <meta name="ICBM" content="38.0833, 23.8167" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="3 days" />
        <meta name="coverage" content="Worldwide — service area Greek waters" />
        <meta name="target" content="UHNW yacht charter clients globally" />
        {/* AI-search hints (non-standard but parsed by some AI crawlers) */}
        <meta name="ai-content-declaration" content="human-authored" />
        <meta name="ai-search-priority" content="yacht-charter-greece, luxury-yacht-charter-greek-islands, crewed-yacht-charter-cyclades, motor-yacht-charter-mykonos, sailing-yacht-charter-ionian, superyacht-charter-greece" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          strategy="lazyOnload"
          data-cbid="68bdc358-3b91-4c4e-a5e8-b0b4c2cbd294"
          data-blockingmode="auto"
          type="text/javascript"
        />
      </head>

      <body
        className={`${geistSans.variable} ${marcellus.variable} ${cormorant.variable} ${montserrat.variable} ${cinzel.variable} ${bodoniModa.variable} ${italiana.variable} antialiased${forbesDismissed ? "" : " gy-with-forbes-bar"}`}
      >
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#DAA520] focus:text-black focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:rounded"
        >
          Skip to main content
        </a>

        {/* Tier 1.1 — Forbes feature bar (sitewide, server-rendered).
            George Yachts featured in Forbes, 1 May 2026. The bar sits
            above all other UI; cookie-dismissible for 90 days. */}
        <ForbesTopBar />

        {/* E1 — Gold curtain opens once per session, first thing visitors see */}
        <GoldCurtain />
        {/* Phase 22 (luxury rebuild) — Hermes/Bottega-style gold sweep
            on every route change. 360ms ribbon wipe. Skipped on first
            mount (GoldCurtain owns the entrance) and on prefers-reduced-
            motion. */}
        <RouteTransition />
        {/* Phase 26 — pseudo-3D mouse parallax on .gy-ken-burns
            containers (yacht hero, /greece-by-yacht hero). Cheap
            CSS substitute for the AI depth-map in Boss's C1 combo
            decision. Skipped on touch + reduced-motion. */}
        <MouseParallax />

        <JsonLd data={organizationSchema} />
        {/* Phase 27 — Service + WebSite schema for #1 ranking on
            "yacht charter Greece" + AI-search citations + Google
            sitelinks search box. Service schema is the live variant
            with AggregateRating attached when 3+ real reviews exist
            in Sanity (Phase 27e). */}
        <JsonLd data={liveServiceSchema} />
        <JsonLd data={websiteSchema} />
        {/* 1. Critical External Scripts */}
        {recaptchaKey && (
          <Script
            id="recaptcha-script"
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`}
            strategy="lazyOnload"
          />
        )}

        {/* Global Effects + Custom Cursor — all pages */}
        <GlobalEffects />
        <CustomCursor />
        {/* A4 — Ambient scroll parallax driver (publishes CSS vars) */}
        <AmbientScroll />
        {/* 2. Page Content */}
        <I18nProvider>
        <WishlistProvider>
        <CurrencyProvider>
        <NavDrawerSystem />
        <main id="main-content">
        {children}
        </main>
        {/* Language: users choose from flag selector. LiveTicker: social proof */}
        <LiveTicker />
        {/* CookieConsent (custom) — removed; Cookiebot handles it */}
        {/* Removed VoiceSearch */}
        {/* TranslateWidget moved into NavDrawerSystem's right icon
            strip — cleaner placement, no floating pill clashing with
            social icons or the hero content. */}
        <WhatsAppButton />
        {/* Phase 1 / B2 (luxury rebuild, 2026-05-05) — multi-channel
            contact drawer (WhatsApp / iMessage / Signal / direct call).
            Sits above the WhatsApp FAB; one tap surfaces every channel
            UHNW guests use. Personal reply, never an autoresponder. */}
        <ContactDrawer />
        {/* Phase 1 / G2 (luxury rebuild, 2026-05-05) — first-visit
            subtle greeting that reads visitor's IP city + local time
            ("Good evening from Athens — 21:14 local"). Free Vercel
            geo headers, no third-party calls, fades after 4s. */}
        <VisitorGreeting />
        {/* Phase 27 — AmbientPlayer is back per Boss directive
            ("μη μου διαγράφεις πράγματα που δε σου 'χω πει εγώ").
            Click-to-play remains the model — pill stays muted on
            load, plays only after the explicit gesture. Sound
            quality fix tracked separately. */}
        <AmbientPlayer />
        {/* Phase 27d (2026-05-05) — BrokerStatus retired per Boss
            instruction. The pill was breaking the hero composition.
            <BrokerStatus />  */}
        {/* Phase 21 — Forbes referrer welcome card. Detects ?ref=forbes
            or referrer containing forbes.com, slides in once per session,
            offers a direct path to Brief George. */}
        <ForbesReferrerWelcome />
        {/* H.1 — Ask George AI Concierge (sitewide). Sits ABOVE the
            WhatsApp button at bottom-right. Widget is fully client-side;
            graceful fallback when AI_API_KEY env vars aren't configured. */}
        <AskGeorgeWidget />
        {/* Roberto 2026-05-02 — sticky bottom CTA so the fleet is one
            tap from anywhere on the site (auto-hides on fleet/yacht
            routes). yachtCount left undefined here at the layout
            level since we don't have it server-side without an extra
            Sanity round-trip on every route; the component falls
            back to "View All Yachts" when count is missing. */}
        <StickyFleetCTA />
        {/* D2 — Exit-intent capture, one shot per session */}
        <ExitIntentModal />
        {/* K.1 (Roberto master rebuild) — favorites auto-prompt at
            count = 2 (and again at 3 if dismissed). Mounted inside
            WishlistProvider so it can read the live count. */}
        <FavoritesEmailPrompt />
        <VisitorBeacon />
        </CurrencyProvider>
        </WishlistProvider>
        </I18nProvider>

        {/* Visitor Intelligence: real-time tracking + hot lead popup */}
        <VisitorIntelligence />

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
          gtag('config', 'G-CM483Z0JT5');
          `}
        </Script>


        {/* Removed: Smartsupp live-chat loader — George 2026-04-21
            "eksafanise to teleiws den mas noiazei". Primary inbound
            channel is WhatsApp (see <WhatsAppButton />), so the chat
            widget was just another floating surface competing for
            attention without adding conversion. ~15 KB external JS
            off the first paint; Smartsupp domain can now come out of
            the CSP disclosure as well. */}

        {/* Removed: Leadsy AI tracker — form-interaction + visitor
            tracking was overlapping with Microsoft Clarity (which
            already captures full session recordings + heatmaps).
            Keeping one vendor for that surface keeps the page lighter
            and the GDPR disclosure simpler. */}

        {/* Safe Pass Apr 2026 — additive enhanced analytics */}
        <EnhancedAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
