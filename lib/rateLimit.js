/**
 * Lightweight IP-based rate limiter for public form endpoints.
 *
 * Uses an in-memory Map. Fine for Vercel serverless because each cold
 * invocation resets; this is defence-in-depth, not a security primitive.
 * Honeypot + reCAPTCHA are the primary spam defences.
 *
 * SAFE: applies only to forms (contact, newsletter, partner-request).
 * NEVER apply to /api/webhooks/* — Meta retries with exponential backoff.
 */

const buckets = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 5; // 5 requests per minute per IP

/**
 * @param {Request} request - Next.js Request object
 * @param {object} opts
 * @param {number} [opts.max=5]
 * @param {number} [opts.windowMs=60000]
 * @returns {{ ok: boolean, retryAfter?: number }}
 */
export function checkRateLimit(request, opts = {}) {
  const max = opts.max || MAX_PER_WINDOW;
  const windowMs = opts.windowMs || WINDOW_MS;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const bucket = buckets.get(ip) || { count: 0, resetAt: now + windowMs };

  // Reset expired window
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count++;
  buckets.set(ip, bucket);

  // Cleanup old buckets periodically (best-effort)
  if (buckets.size > 1000) {
    for (const [k, v] of buckets.entries()) {
      if (now > v.resetAt) buckets.delete(k);
    }
  }

  if (bucket.count > max) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { ok: true };
}
