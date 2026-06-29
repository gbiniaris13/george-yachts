import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// 🛑 ADD TEMPORARY LOGGING HERE 🛑
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
// console.log("SANITY_PROJECT_ID:", projectId);
// console.log("SANITY_DATASET:", dataset);
// 🛑 END TEMPORARY LOGGING 🛑

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-11-09";
const useCdn = process.env.NODE_ENV === "production";

// 2026-06-23 — Build-time resilience.
// A single transient Sanity CDN connect-timeout while prerendering ONE
// statically-generated page (e.g. UND_ERR_CONNECT_TIMEOUT against
// apicdn.sanity.io) was enough to abort the ENTIRE production deploy
// (470 pages). @sanity/client retries internally, but those retries are
// bounded and get exhausted by a sustained ~30-40s blip — at which point
// the thrown `TypeError: fetch failed` crashes the prerender.
//
// `withRetry` adds a second, longer ride-out window on top of the client's
// own retries: it catches transient throws and retries them with
// exponential backoff. On the happy path (first attempt succeeds) this is
// a no-op — same arguments, same return value, no added latency. It is
// applied to every Sanity client in the codebase (this shared client plus
// the non-CDN `freshClient` instances in the blog routes).
const MAX_ATTEMPTS = 4; // 1 initial try + 3 retries
const BASE_DELAY_MS = 500;

// Only retry blips, not deterministic failures. HTTP responses carry a
// numeric status — a 4xx (e.g. a malformed GROQ query → 400) will never
// succeed on retry, so we fail fast on those; 5xx / 429 / 408 are transient.
// Anything without an HTTP status is a transport-level failure (connect
// timeout, DNS, socket reset, undici "fetch failed") — always worth a retry.
function isRetryable(err) {
  const status = err?.statusCode ?? err?.response?.statusCode;
  if (typeof status === "number") {
    return status >= 500 || status === 429 || status === 408;
  }
  return true;
}

function backoffMs(attempt) {
  // 500ms, 1000ms, 2000ms (+ up to 250ms jitter to avoid thundering herd)
  return BASE_DELAY_MS * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function withRetry(client) {
  const originalFetch = client.fetch.bind(client);
  client.fetch = async (...args) => {
    let lastErr;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await originalFetch(...args);
      } catch (err) {
        lastErr = err;
        if (attempt === MAX_ATTEMPTS || !isRetryable(err)) break;
        const ms = backoffMs(attempt);
        const code =
          err?.cause?.code || err?.code || err?.statusCode || "unknown";
        console.warn(
          `[sanity] fetch failed (attempt ${attempt}/${MAX_ATTEMPTS}, ${code}); retrying in ${ms}ms`
        );
        await sleep(ms);
      }
    }
    throw lastErr;
  };
  return client;
}

// Sanity Client Initialization
export const sanityClient = withRetry(
  createClient({
    projectId, // Must be a string (not undefined)
    dataset, // Must be a string (not undefined)
    apiVersion,
    useCdn,
  })
);

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}
