import { Geist, Geist_Mono, Marcellus } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
});

export default function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${marcellus.variable} antialiased`}
      >
        {/* Apollo.io Website Tracker */}
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
        {recaptchaKey && (
          <Script
            id="recaptcha-script"
            src={`https://www.google.com/recaptcha/enterprise.js?render=${recaptchaKey}`}
            strategy="beforeInteractive"
          />
        )}
        <Script id="tawk-api-setup" strategy="beforeInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          `}
        </Script>
        <Script
          id="tawk-to-script"
          src="https://embed.tawk.to/68f8bfda482c1e1953b81bb5/1j85qqrm6"
          strategy="lazyOnload"
          charSet="UTF-8"
          crossOrigin="*"
        />
        <NavDrawerSystem /> {children}
        <GoogleAnalytics gaId="G-CM483Z0JT5" />
      </body>
    </html>
  );
}
