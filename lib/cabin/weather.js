// lib/cabin/weather.js
// =============================================================
// Open-Meteo client — free, no API key, no signup, no rate limits
// for normal use. https://open-meteo.com/en/docs
//
// We fetch a 7-day daily forecast (max/min temp, weathercode,
// precipitation, wind) for any lat/lon. The "Before You Sail"
// page uses this for embarkation-port forecast.
// =============================================================

const ENDPOINT = "https://api.open-meteo.com/v1/forecast";

// A small Greek port → lat/lon lookup, locally hard-coded so we
// don't make a geocoding round trip. Add ports here as needed.
export const GREEK_PORTS = {
  "piraeus":   { lat: 37.945,  lon: 23.6478, label: "Piraeus" },
  "athens":    { lat: 37.9838, lon: 23.7275, label: "Athens" },
  "mykonos":   { lat: 37.4467, lon: 25.3289, label: "Mykonos" },
  "santorini": { lat: 36.3932, lon: 25.4615, label: "Santorini" },
  "paros":     { lat: 37.0856, lon: 25.1500, label: "Paros" },
  "naxos":     { lat: 37.1036, lon: 25.3768, label: "Naxos" },
  "milos":     { lat: 36.6900, lon: 24.4400, label: "Milos" },
  "hydra":     { lat: 37.3500, lon: 23.4667, label: "Hydra" },
  "aegina":    { lat: 37.7461, lon: 23.4286, label: "Aegina" },
  "spetses":   { lat: 37.2667, lon: 23.1500, label: "Spetses" },
  "corfu":     { lat: 39.6243, lon: 19.9217, label: "Corfu" },
  "paxos":     { lat: 39.1992, lon: 20.1839, label: "Paxos" },
  "lefkada":   { lat: 38.8333, lon: 20.7000, label: "Lefkada" },
  "ithaca":    { lat: 38.4119, lon: 20.6717, label: "Ithaca" },
  "zakynthos": { lat: 37.7833, lon: 20.9000, label: "Zakynthos" },
  "kefalonia": { lat: 38.1750, lon: 20.5667, label: "Kefalonia" },
};

export function lookupPort(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().trim();
  return GREEK_PORTS[key] || null;
}

// WMO weather code → short label + simple glyph.
// https://open-meteo.com/en/docs#weathervariables
const CODES = {
  0:  { label: "Clear",            glyph: "◯" },
  1:  { label: "Mainly clear",     glyph: "◯" },
  2:  { label: "Partly cloudy",    glyph: "◐" },
  3:  { label: "Overcast",         glyph: "●" },
  45: { label: "Fog",              glyph: "≈" },
  48: { label: "Fog",              glyph: "≈" },
  51: { label: "Light drizzle",    glyph: "ʼ" },
  53: { label: "Drizzle",          glyph: "ʼ" },
  55: { label: "Heavy drizzle",    glyph: "ʼ" },
  61: { label: "Light rain",       glyph: "ʼ" },
  63: { label: "Rain",             glyph: "ʼ" },
  65: { label: "Heavy rain",       glyph: "ʼ" },
  80: { label: "Showers",          glyph: "ʼ" },
  81: { label: "Showers",          glyph: "ʼ" },
  82: { label: "Heavy showers",    glyph: "ʼ" },
  95: { label: "Thunderstorm",     glyph: "↯" },
};

export function decodeWeatherCode(code) {
  return CODES[code] || { label: "-", glyph: "·" };
}

export async function fetchDailyForecast({ lat, lon, days = 7 }) {
  if (typeof lat !== "number" || typeof lon !== "number") {
    throw new Error("[weather] lat + lon required");
  }
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
    timezone: "auto",
    forecast_days: String(Math.min(Math.max(days, 1), 16)),
  });

  const r = await fetch(`${ENDPOINT}?${params}`, {
    next: { revalidate: 3600 },     // cache 1h — enough for a daily view
  });
  if (!r.ok) throw new Error(`[weather] ${r.status}`);
  const json = await r.json();

  const d = json.daily || {};
  return (d.time || []).map((t, i) => ({
    date: t,
    code: d.weathercode?.[i] ?? null,
    tmin: d.temperature_2m_min?.[i] ?? null,
    tmax: d.temperature_2m_max?.[i] ?? null,
    precip_mm: d.precipitation_sum?.[i] ?? null,
    wind_kmh: d.windspeed_10m_max?.[i] ?? null,
  }));
}

// =============================================================
// 2026-05-20 — Friend-test pass 4 (George):
//   "Ο καιρός δείχνει 20-26 May ενώ το charter είναι 24-31 May.
//    Επίσης δείχνει μόνο Αθήνα — να δείχνει Αθήνα, Ιόνιο,
//    Σαρονικό, Κυκλάδες για τις ημερομηνίες του ναύλου."
//
// REGION_ANCHORS holds one representative port per Greek cruising
// region. We fetch in parallel, slice to the charter date window,
// and render side-by-side.
//
// Open-Meteo allows up to 16 days forecast. Most charters book
// 2–3 weeks ahead, so this window covers the typical case. For
// charters > 16 days out we degrade gracefully (caller renders
// "outlook available closer to embarkation").
// =============================================================
export const REGION_ANCHORS = [
  { key: "athens",   label: "Athens",   sub: "Saronic gateway",   lat: 37.9838, lon: 23.7275 },
  { key: "saronic",  label: "Saronic",  sub: "Hydra",             lat: 37.3500, lon: 23.4667 },
  { key: "cyclades", label: "Cyclades", sub: "Paros",             lat: 37.0856, lon: 25.1500 },
  { key: "ionian",   label: "Ionian",   sub: "Lefkada",           lat: 38.8333, lon: 20.7000 },
];

// Given a charter window (ISO dates), fetch forecasts for each
// region and slice to the window. Returns an array of
// { key, label, sub, days: [{ date, code, tmin, tmax, ... }] }.
// `days` array is the days WITHIN the charter window — empty if
// the charter is fully out of forecast range.
// 2026-05-20 — Friend-test pass 4 (David):
//   "Charter dates 17–24 May but weather only 20–24. First three
//    days of my trip are missing."
//
// Root cause: when the charter has started but isn't over, Open-
// Meteo's daily forecast endpoint returns dates from "today"
// onward only — past charter days are not in the response.
// We were silently dropping them. Now: when the charter's start
// is in the past but end is in the future (mid-week), we still
// render the days from today through end. Past days are labeled
// "today" anchored — the user wants to plan around what's left,
// not regret what's gone.
//
// Plus: when ALL charter dates are past (post-voyage browse), we
// return an empty array and the UI shows a calm "your voyage has
// completed" instead of a broken-looking empty section.
export async function fetchCharterWindowForecast({ fromIso, toIso, cruisingArea }) {
  if (!fromIso || !toIso) return [];
  const fromDate = new Date(fromIso + "T00:00:00Z");
  const toDate   = new Date(toIso   + "T00:00:00Z");
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return [];

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // If the entire window is in the past, surface as completed.
  if (toDate < today) {
    return REGION_ANCHORS.map((r) => ({ ...r, days: [], completed: true }));
  }

  // 2026-05-20 — Friend-test pass 4 round 5 (Helen, David):
  //   "Charter is 17 May – 24 May but the weather shows 20 May
  //    onward. Where are 17, 18, 19?"
  // Open-Meteo's forecast endpoint only returns "today" forward.
  // For charters already in progress (start in past, end in
  // future), we fetch the past portion from the Archive API
  // and the future portion from the Forecast API, then merge.
  const daysAhead = Math.ceil((toDate - today) / (24 * 3600 * 1000)) + 1;
  if (daysAhead > 16) {
    return REGION_ANCHORS.map((r) => ({ ...r, days: [], out_of_range: true }));
  }
  const fetchDays = Math.min(16, Math.max(7, daysAhead));
  const needsPastDays = fromDate < today;
  // Past-window cutoff for the archive request — fromDate to
  // yesterday. If charter started today, we don't query archive.
  const yesterday = new Date(today);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const pastFromIso = fromIso;
  const pastToIso = yesterday.toISOString().slice(0, 10);

  // 2026-05-20 — Pass 4 (David):
  //   "Cruising area = Saronic but the weather shows four regions
  //    including Cyclades and Ionian. Filter to my actual area."
  // We map common stored values to a subset of anchors. If the
  // value is empty / unknown / "mixed", show all four (the
  // captain-decides case).
  const filtered = filterAnchorsByCruisingArea(cruisingArea);

  const results = await Promise.all(
    filtered.map(async (region) => {
      try {
        const [forecast, archive] = await Promise.all([
          fetchDailyForecast({ lat: region.lat, lon: region.lon, days: fetchDays }),
          needsPastDays
            ? fetchArchive({
                lat: region.lat,
                lon: region.lon,
                fromIso: pastFromIso,
                toIso: pastToIso,
              }).catch((err) => {
                console.error(`[weather] ${region.key} archive failed:`, err);
                return [];
              })
            : Promise.resolve([]),
        ]);

        // Merge archive (past) + forecast (today+future); dedupe by
        // date string. Archive days carry .historical=true so the
        // UI can mark them as "already at sea".
        const byDate = new Map();
        for (const d of archive) byDate.set(d.date, { ...d, historical: true });
        for (const d of forecast) byDate.set(d.date, d); // forecast wins ties
        const merged = Array.from(byDate.values())
          .filter((d) => {
            const date = new Date(d.date + "T00:00:00Z");
            return date >= fromDate && date <= toDate;
          })
          .sort((a, b) => a.date.localeCompare(b.date));

        return { ...region, days: merged };
      } catch (err) {
        console.error(`[weather] ${region.key} fetch failed:`, err);
        return { ...region, days: [], error: true };
      }
    })
  );

  return results;
}

// Open-Meteo Archive API — returns historical daily values
// (weathercode, tmin/tmax, precip, wind) for any past date range.
// https://open-meteo.com/en/docs/historical-weather-api
const ARCHIVE_ENDPOINT = "https://archive-api.open-meteo.com/v1/archive";

async function fetchArchive({ lat, lon, fromIso, toIso }) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: fromIso,
    end_date: toIso,
    daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max",
    timezone: "auto",
  });
  const r = await fetch(`${ARCHIVE_ENDPOINT}?${params}`, {
    next: { revalidate: 24 * 3600 },   // historical data — cache a day
  });
  if (!r.ok) throw new Error(`[weather:archive] ${r.status}`);
  const json = await r.json();
  const d = json.daily || {};
  return (d.time || []).map((t, i) => ({
    date: t,
    code: d.weathercode?.[i] ?? null,
    tmin: d.temperature_2m_min?.[i] ?? null,
    tmax: d.temperature_2m_max?.[i] ?? null,
    precip_mm: d.precipitation_sum?.[i] ?? null,
    wind_kmh: d.windspeed_10m_max?.[i] ?? null,
  }));
}

// Map cabin.cruising_area to a subset of REGION_ANCHORS. Unknown /
// empty / "mixed" / "captain decides" returns all four.
function filterAnchorsByCruisingArea(cruisingArea) {
  if (!cruisingArea) return REGION_ANCHORS;
  const k = String(cruisingArea).toLowerCase().trim();
  if (k.includes("cyclades")) return REGION_ANCHORS.filter((r) => r.key === "athens" || r.key === "cyclades");
  if (k.includes("ionian"))   return REGION_ANCHORS.filter((r) => r.key === "ionian");
  if (k.includes("saronic"))  return REGION_ANCHORS.filter((r) => r.key === "athens" || r.key === "saronic");
  if (k.includes("dodecanese")) return REGION_ANCHORS.filter((r) => r.key === "cyclades"); // closest anchor
  // mixed / unknown / captain-decides → show all four.
  return REGION_ANCHORS;
}
