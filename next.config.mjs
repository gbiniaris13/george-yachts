/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com https://js.hs-scripts.com https://js.hsforms.net https://js.hs-analytics.net https://js.hs-banner.com https://js.hscollectedforms.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://www.google-analytics.com https://www.googletagmanager.com https://*.hubspot.com https://*.hubapi.com https://api.hubspot.com https://forms.hubspot.com",
              "frame-src 'self' https://www.google.com https://calendly.com https://www.youtube.com",
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
    ];
  },
};

export default nextConfig;
