// 2026-05-20 — Friend-test pass 4 (George): installed PWA opened
// the marketing site instead of /cabin. Root cause: Chrome on
// Android can resolve the SITE manifest (this file) when the
// install is captured anywhere on the domain — even if the user
// is currently on /cabin/* with the cabin-scoped manifest linked.
//
// The only realistic install UI lives on /cabin (InstallNudge +
// /cabin/install), so we pin BOTH manifests to /cabin. The site
// manifest still exists for theme_color / icon discovery, but
// any installed PWA — wherever it was triggered — lands on the
// Cabin home as the user expects.
//
// Marketing visitors who somehow install the PWA from / will be
// taken straight to /cabin, where they'll see the login screen
// since they have no membership. That's fine — they can close
// the app and visit georgeyachts.com in their browser instead.
export default function manifest() {
  return {
    name: "The Cabin · George Yachts",
    short_name: "The Cabin",
    description:
      "Your private space at George Yachts — Filotimo · Φιλότιμο.",
    start_url: "/cabin",
    scope: "/cabin",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0D1B2A",
    theme_color: "#0D1B2A",
    icons: [
      {
        src: "/cabin/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/cabin/icons/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
