/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enforces CORS Headers to allow POST requests on the API route
  async headers() {
    return [
      {
        // Apply these headers to all /api/contact requests (including OPTIONS)
        source: "/api/contact",
        headers: [
          // Allow all methods required by the browser preflight check
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          // Allow necessary headers for JSON payloads
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, X-Requested-With, Accept",
          },
          // Allow all origins (universal CORS fix)
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          // Crucial for forcing cache revalidation of the OPTIONS preflight
          {
            key: "Cache-Control",
            value: "no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
