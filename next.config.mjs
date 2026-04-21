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
          { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://translate.google.com https://translate.googleapis.com https://js.hs-scripts.com https://js.hsforms.net https://js.hs-analytics.net https://js.hs-banner.com https://js.hscollectedforms.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://images.pexels.com https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://translate.google.com https://www.google.com https://translate.googleapis.com",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://*.hubapi.com https://api.hubspot.com https://forms.hubspot.com https://translate.googleapis.com https://translate.google.com https://wttr.in",
              "frame-src 'self' https://www.google.com https://calendly.com https://www.youtube.com https://translate.google.com",
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
  async redirects() {
    return [
      {
        source: "/yachts-charter",
        destination: "/charter-yacht-greece",
        permanent: true,
      },
      {
        source: "/aviation-charter",
        destination: "/private-jet-charter",
        permanent: true,
      },
      // Proposal F (George 2026-04-21): collapse three overlapping
      // lead-capture tools into the single /inquiry flow so visitors
      // stop having to pick between quiz / calculator / form. The
      // old routes permanent-redirect so SEO juice transfers cleanly.
      {
        source: "/yacht-finder",
        destination: "/inquiry",
        permanent: true,
      },
      {
        source: "/yacht-finder/:path*",
        destination: "/inquiry",
        permanent: true,
      },
      {
        source: "/cost-calculator",
        destination: "/inquiry",
        permanent: true,
      },
      {
        source: "/cost-calculator/:path*",
        destination: "/inquiry",
        permanent: true,
      },
      // Destinations section retired 2026-04-21. Legacy bookmarks
      // land on the inquiry flow so nothing 404s, and the SEO weight
      // transfers to the new primary conversion page. The home
      // page's GreekWatersMap still surfaces each region visually.
      {
        source: "/destinations",
        destination: "/inquiry",
        permanent: true,
      },
      {
        source: "/destinations/:path*",
        destination: "/inquiry",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
