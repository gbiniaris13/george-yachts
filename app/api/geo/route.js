// Phase 1 / G2 (luxury rebuild, 2026-05-05) —
// Visitor geo passthrough.
//
// Vercel auto-attaches `x-vercel-ip-city`, `x-vercel-ip-country`,
// and `x-vercel-ip-country-region` headers on every request when the
// site runs on the Vercel network. Free, instant, no third-party.
//
// We expose a tiny GET endpoint that reads those headers and returns
// JSON — used by VisitorGreeting on the client to show a contextual
// "Good evening from Athens" pill.
//
// Privacy: only city/country/region (already broadcast by Vercel),
// no IP, no precise lat/lon. Cache: no-store so we never hand out
// someone else's location.

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const headers = request.headers;

  const rawCity = headers.get("x-vercel-ip-city") || "";
  const country = headers.get("x-vercel-ip-country") || "";
  const region = headers.get("x-vercel-ip-country-region") || "";

  // Vercel URL-encodes city names (e.g. "S%C3%A3o+Paulo"). Decode safely.
  let city = "";
  try {
    city = rawCity ? decodeURIComponent(rawCity.replace(/\+/g, " ")) : "";
  } catch {
    city = rawCity;
  }

  return Response.json(
    { city, country, region },
    {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
}
