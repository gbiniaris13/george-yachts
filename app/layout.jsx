import { Geist, Marcellus, Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";
import GlobalEffects from "./components/GlobalEffects";
import CustomCursor from "./components/CustomCursor";
import WhatsAppButton from "./components/WhatsAppButton";
import GoldCurtain from "./components/GoldCurtain";
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
import JsonLd from "./components/JsonLd";
import { organizationSchema } from "@/lib/organizationSchema";
import VisitorIntelligence from "./components/VisitorIntelligence";
import EnhancedAnalytics from "./components/EnhancedAnalytics";
import MicrosoftClarity from "./components/MicrosoftClarity";
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

export const metadata = {
  metadataBase: new URL("https://georgeyachts.com"),
};

export default function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Changed strategy to afterInteractive to fix the synchronous blocking error */}
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
        className={`${geistSans.variable} ${marcellus.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#DAA520] focus:text-black focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:rounded"
        >
          Skip to main content
        </a>

        {/* E1 — Gold curtain opens once per session, first thing visitors see */}
        <GoldCurtain />

        <JsonLd data={organizationSchema} />
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
        {/* D2 — Exit-intent capture, one shot per session */}
        <ExitIntentModal />
        <VisitorBeacon />
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
