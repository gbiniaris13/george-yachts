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
