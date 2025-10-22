import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NavDrawerSystem from "./components/NavDrawerSystem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
          strategy="afterInteractive"
          charSet="UTF-8"
          crossOrigin="*"
        />
        <NavDrawerSystem /> {children}
      </body>
    </html>
  );
}
