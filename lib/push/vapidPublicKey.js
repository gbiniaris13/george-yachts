// Web Push — VAPID PUBLIC key (safe to ship to the browser).
//
// This is the public half of the VAPID keypair generated 2026-06-25.
// The PRIVATE half lives ONLY in the Vercel env var VAPID_PRIVATE_KEY
// (server-side, never committed) — see lib/push/server.js.
//
// The browser needs this public key to create a PushSubscription, so
// it is imported by the client component app/components/PushOptIn.jsx.
// Exposing a VAPID public key is by design and carries no risk.

export const VAPID_PUBLIC_KEY =
  "BEuP3yRVD1WGtkwS4FLQ9ZkW7XmWS9zV3J_cmiWpJZIFWyMatrD2cztGmikeOibE3zej2aD7ztaFGbk2e4tFr7s";
