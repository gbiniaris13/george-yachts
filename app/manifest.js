export default function manifest() {
  return {
    name: "George Yachts Brokerage House",
    short_name: "George Yachts",
    description: "Featured in Forbes (May 2026). Boutique luxury yacht charter in Greek waters. 66 curated yachts. IYBA Charter Active Member.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
