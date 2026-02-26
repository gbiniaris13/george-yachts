/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
        permanent: true, // 301 redirect for SEO
      },
      {
        source: "/aviation-charter",
        destination: "/private-jet-charter",
        permanent: true, // 301 redirect for SEO
      },
    ];
  },
};

export default nextConfig;
