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
  return CODES[code] || { label: "—", glyph: "·" };
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
