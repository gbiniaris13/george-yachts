export default function manifest() {
  return {
    name: "George Yachts Brokerage House",
    short_name: "George Yachts",
    description: "Boutique luxury yacht charter in Greek waters. 50+ curated yachts, IYBA member broker.",
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
