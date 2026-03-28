import { Geist, Geist_Mono, Marcellus, Cormorant_Garamond, Barlow, Montserrat } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";
import JsonLd from "./components/JsonLd";
import { organizationSchema } from "@/lib/organizationSchema";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
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
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  variable: "--font-barlow",
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
        className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} ${cormorant.variable} ${barlow.variable} ${montserrat.variable} antialiased`}
      >
        <JsonLd data={organizationSchema} />
        {/* 1. Critical External Scripts */}
        {recaptchaKey && (
          <Script
            id="recaptcha-script"
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`}
            strategy="beforeInteractive"
          />
        )}

        {/* 2. Page Content */}
        <NavDrawerSystem />
        {children}

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

        {/* Apollo.io Tracker */}
        <Script id="apollo-tracker" strategy="afterInteractive">
          {`
          function initApollo() {
            var n = Math.random().toString(36).substring(7),
                o = document.createElement("script");
            o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
            o.async = true;
            o.defer = true;
            o.onload = function() {
              window.trackingFunctions.onLoad({ appId: "6900ba1d130409000d727aa4" });
            };
            document.head.appendChild(o);
          }
          initApollo();
          `}
        </Script>

        {/* Smartsupp Setup */}
        <Script id="smartsupp-init" strategy="lazyOnload">
          {`
          var _smartsupp = _smartsupp || {};
          _smartsupp.key = '100ac95e1a30b01edc4750b15cfd20a7002dcfae';
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
          `}
        </Script>

        {/* Leadsy AI Tracker */}
        <Script
          id="vtag-ai-js"
          src="https://r2.leadsy.ai/tag.js"
          strategy="afterInteractive"
          data-pid="6aeJg49QjgxMfguK"
          data-version="062024"
        />
      </body>
    </html>
  );
}
