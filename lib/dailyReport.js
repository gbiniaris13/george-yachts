// lib/dailyReport.js: the daily visitor report George reads by email.
//
// 2026-11-06. The old daily summary was a Telegram message built from four
// KV counters (visitors, countries, pages, sources). It had two problems.
// It arrived in the same chat as every single visitor ping, so it drowned.
// And its "visitors" number counted every browser that ran the page script,
// which on this site is mostly machines: in the week before this was written
// 854 sessions were recorded and about 550 of them were crawlers (Meta,
// Microsoft, Amazon, Google) or headless browsers.
//
// This module reads the per-visit rows the tracker already writes
// (app/api/track/route.js, table `sessions`) and answers what George
// actually wants to know each morning: how many PEOPLE came, how many were
// American, who looked seriously and at which yachts, where they came from,
// and whether anyone wrote.
//
// Everything here is a pure function (no I/O) so the whole report can be
// built and rendered from a saved snapshot. The route does the fetching.

const ATHENS = "Europe/Athens";
const DAY_MS = 24 * 60 * 60 * 1000;
// How far back the sessions must reach for one day to be judged: long
// enough to recognise a browser that returns all week and never acts.
const LOOKBACK_MS = 10 * DAY_MS;

// Columns the report needs. Asking for these only keeps the payload small.
export const SESSION_COLUMNS = [
  "session_id", "visitor_id", "started_at", "country", "city", "region",
  "timezone", "device_type", "os", "browser", "referrer", "referrer_url",
  "utm_source", "pages_visited", "yachts_viewed", "time_on_site",
  "active_seconds", "is_return_visitor", "ip_company", "ip_is_hosting",
  "ip_is_tor", "webdriver", "webgl_renderer", "mouse_samples", "hot_score",
  "is_hot_lead", "cta_clicks", "last_cta", "scroll_deep", "copy_events",
  "copy_texts", "compare_used", "cost_calc_used", "yacht_finder_used",
  "pricing_calendar_used",
].join(",");

// ── Person or machine ────────────────────────────────────────────
// Networks that run crawlers and scanners, not living rooms. "Google LLC"
// is spelled out so Google Fiber (a real home ISP) is not caught.
const MACHINE_NETWORK =
  /facebook|meta platforms|microsoft|amazon|google llc|alibaba|tencent|hetzner|\bovh\b|digitalocean|linode|oracle|sprious|logicweb|hostroyale|oculus networks|constant company|cosmonova|\bm247\b|leaseweb|contabo|datacamp|huawei cloud|bytedance|scaleway|vultr|choopa|quadranet|latitude\.sh|unified layer|incapsula|imperva|baidu|yandex|apple inc/i;

// Apple's iCloud Private Relay sends real Safari users out through these
// three networks, so a Safari visit from them is a person, not a server.
const RELAY_NETWORK = /akamai|cloudflare|fastly/i;

// A headless browser draws with a software renderer.
const SOFTWARE_RENDERER = /swiftshader|llvmpipe/i;

const pagesOf = (s) => (Array.isArray(s.pages_visited) ? s.pages_visited : []);
const yachtsOf = (s) => (Array.isArray(s.yachts_viewed) ? s.yachts_viewed : []);

// Did the browser do anything only a person does? Landing on a yacht page
// does not count: a crawler does that too.
export function hasActivity(s) {
  return (
    (s.active_seconds || 0) >= 5 ||
    (s.time_on_site || 0) >= 5 ||
    pagesOf(s).length > 1 ||
    (s.mouse_samples || 0) > 0 ||
    s.scroll_deep === true ||
    (s.cta_clicks || 0) > 0 ||
    (s.copy_events || 0) > 0
  );
}

// Returns the reason a session is a machine, or null when it is not.
export function machineReason(s) {
  const network = String(s.ip_company || "");
  // Every visit that reaches the live site carries a country (Vercel adds
  // it). A row without one was written by a local test build, not by a
  // visitor: in 15,390 recorded visits the only ones were our own tests.
  if (!s.country || s.country === "??") return "automation";
  if (s.webdriver === true) return "automation";
  if (SOFTWARE_RENDERER.test(String(s.webgl_renderer || ""))) return "automation";
  if (s.ip_is_tor === true) return "automation";
  // A hand moved a mouse. That is a person, whatever network they sit
  // behind (a company VPN, a cloud desktop, a privacy service).
  if ((s.mouse_samples || 0) >= 5) return null;
  if (MACHINE_NETWORK.test(network)) return "network";
  const relaySafari = RELAY_NETWORK.test(network) && /safari/i.test(String(s.browser || ""));
  // The tracker's datacenter list also carries one home provider.
  const homeProvider = /deutsche telekom/i.test(network);
  if ((s.ip_is_hosting === true || RELAY_NETWORK.test(network)) && !relaySafari && !homeProvider) return "network";
  if ((!s.browser || s.browser === "Unknown") && (!s.os || s.os === "Unknown")) return "automation";
  // No trace of a person, from a place or a system real charter clients
  // do not browse from: a desktop Linux box, or mainland China.
  if (!hasActivity(s) && (s.os === "Linux" || s.country === "CN")) return "automation";
  return null;
}

// Short name for the "who are the machines" line.
function machineName(s) {
  const n = String(s.ip_company || "");
  if (/facebook|meta platforms/i.test(n)) return "Meta";
  if (/microsoft/i.test(n)) return "Microsoft";
  if (/amazon/i.test(n)) return "Amazon";
  if (/google/i.test(n)) return "Google";
  if (/apple inc/i.test(n)) return "Apple";
  if (/alibaba/i.test(n)) return "Alibaba";
  if (/tencent/i.test(n)) return "Tencent";
  if (/cloudflare/i.test(n)) return "Cloudflare";
  if (/akamai/i.test(n)) return "Akamai";
  return "άλλες";
}

// ── Where a visit came from ──────────────────────────────────────
// The AI assistants a visit can be traced to, by the tag they put on the
// link (utm_source) or by the address the visitor came from. Checked
// against the real visits on 6/11/2026: ChatGPT 1,279, Perplexity 24,
// Copilot 28, Gemini 13, Claude 3, Kimi 1. Two were being miscounted
// until then: visits from gemini.google.com read as "Google" (the
// tracker's label matches "google." first) and visits from
// copilot.microsoft.com read as an ordinary website.
//
// This is a floor, not the whole truth: an assistant that opens the link
// in its own app without a tag leaves no trace and lands in "direct".
const AI_BY_NAME = [
  [/chatgpt|openai/, "ChatGPT"],
  [/perplexity/, "Perplexity"],
  [/claude/, "Claude"],
  [/gemini|bard\.google/, "Gemini"],
  [/copilot/, "Copilot"],
  [/grok|(^|\.)x\.ai$/, "Grok"],
  [/deepseek/, "DeepSeek"],
  [/(^|\.)meta\.ai$/, "Meta AI"],
  [/mistral/, "Mistral"],
  [/(^|\.)kimi\./, "Kimi"],
  [/(^|\.)you\.com$/, "You.com"],
  [/phind/, "Phind"],
  [/(^|\.)poe\.com$/, "Poe"],
  [/duck\.ai/, "Duck.ai"],
];
const AI_SOURCES = new Set(AI_BY_NAME.map(([, name]) => name));
const aiNameOf = (text) => (AI_BY_NAME.find(([re]) => re.test(text)) || [])[1] || null;

function hostOf(url) {
  try {
    return new URL(String(url)).hostname.toLowerCase();
  } catch {
    return "";
  }
}

// George's own visits, when he opens the site from the Command Center.
// They are neither visitors nor machines, so they are left out of both.
const OWN_REFERRER = /(^|\.)command\.georgeyachts\.com$|^gy-command[a-z0-9-]*\.vercel\.app$/;
export function isOwnVisit(s) {
  return OWN_REFERRER.test(hostOf(s.referrer_url)) || OWN_REFERRER.test(String(s.referrer || "").toLowerCase());
}

export function sourceOf(s) {
  const utm = String(s.utm_source || "").toLowerCase();
  if (utm) return aiNameOf(utm) || utm.slice(0, 40);
  const host = hostOf(s.referrer_url);
  const aiHost = host && aiNameOf(host);
  if (aiHost) return aiHost;
  const r = String(s.referrer || "");
  if (!r || /^direct/i.test(r) || /georgeyachts\.com/i.test(r) || r === "Unknown") return "Απευθείας";
  if (r === "Google Search") return "Google";
  return r.replace(/^www\./, "").slice(0, 40);
}

// ── Small formatters (Greek) ─────────────────────────────────────
const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pl = (n, one, many) => `${n} ${n === 1 ? one : many}`;

let regionNames = null;
export function countryName(code) {
  const c = String(code || "").toUpperCase();
  if (c === "US") return "ΗΠΑ";
  if (!c || c === "??" || c.length !== 2) return "Άγνωστη χώρα";
  try {
    regionNames = regionNames || new Intl.DisplayNames(["el"], { type: "region" });
    return regionNames.of(c) || c;
  } catch {
    return c;
  }
}

export function duration(sec) {
  const s = Math.max(0, Math.min(Number(sec) || 0, 90 * 60));
  if (s < 60) return `${Math.round(s)} δευτ.`;
  const m = Math.round(s / 60);
  if (m < 60) return pl(m, "λεπτό", "λεπτά");
  return "πάνω από 1 ώρα";
}

function clock(iso, timeZone) {
  try {
    return new Date(iso).toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
  } catch {
    return null;
  }
}

const dayShort = (ms) =>
  new Date(ms).toLocaleDateString("el-GR", { weekday: "short", day: "numeric", month: "numeric", timeZone: ATHENS });
const dayLong = (ms) =>
  new Date(ms).toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long", timeZone: ATHENS });

// Yacht names are stored lower-case ("riana ii", "pi 2").
function yachtTitle(name) {
  return String(name || "")
    .split(/\s+/)
    .map((w) => (/^(ii|iii|iv|vi|vii|viii|ix|sy|my)$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function deviceLabel(s) {
  const t = String(s.device_type || "");
  const kind = /iphone|ipad|android/i.test(t) ? (/android/i.test(t) ? "Android" : "iPhone ή iPad") : /mac/i.test(t) ? "Mac" : /windows/i.test(t) ? "Windows" : t || "Υπολογιστής";
  return s.browser && s.browser !== "Unknown" ? `${kind}, ${s.browser}` : kind;
}
const isMobile = (s) => /iphone|ipad|android/i.test(String(s.device_type || ""));

function placeLabel(s) {
  const parts = [];
  if (s.city) parts.push(s.city);
  if (s.country === "US" && s.region) parts.push(s.region);
  parts.push(countryName(s.country));
  return parts.join(", ");
}

// ── One visitor = every session of the same browser in the window ─
function mergeVisitor(sessions) {
  const sorted = [...sessions].sort((a, b) => new Date(a.started_at) - new Date(b.started_at));
  const first = sorted[0];
  const pages = [];
  const yachts = [];
  const copied = [];
  let time = 0;
  let score = 0;
  for (const s of sorted) {
    for (const p of pagesOf(s)) if (!pages.includes(p)) pages.push(p);
    for (const y of yachtsOf(s)) if (!yachts.includes(y)) yachts.push(y);
    for (const c of Array.isArray(s.copy_texts) ? s.copy_texts : []) if (c && !copied.includes(c)) copied.push(String(c));
    time += Math.min(s.time_on_site || 0, 90 * 60);
    score = Math.max(score, Number(s.hot_score) || 0);
  }
  const any = (f) => sorted.some(f);
  const tools = [];
  if (any((s) => s.yacht_finder_used)) tools.push("Yacht Finder");
  if (any((s) => s.cost_calc_used)) tools.push("υπολογιστή κόστους");
  if (any((s) => s.compare_used)) tools.push("σύγκριση σκαφών");
  if (any((s) => s.pricing_calendar_used)) tools.push("ημερολόγιο τιμών");
  return {
    id: first.visitor_id || first.session_id,
    first,
    visits: sorted.length,
    startedAt: first.started_at,
    country: first.country,
    place: placeLabel(first),
    source: sourceOf(first),
    device: deviceLabel(first),
    mobile: isMobile(first),
    network: first.ip_company || "",
    returning: any((s) => s.is_return_visitor === true),
    pages,
    yachts,
    copied,
    tools,
    cta: sorted.map((s) => s.last_cta).filter(Boolean).pop() || null,
    ctaClicks: sorted.reduce((n, s) => n + (s.cta_clicks || 0), 0),
    time,
    score,
    hot: any((s) => s.is_hot_lead === true),
    engaged: any(hasActivity),
  };
}

// Counts for one 24-hour window.
function summarize(sessions, automatedIds) {
  const machines = [];
  const byVisitor = new Map();
  for (const s of sessions) {
    if (isOwnVisit(s)) continue;
    const id = s.visitor_id || s.session_id;
    if (machineReason(s) || automatedIds.has(id)) {
      machines.push(s);
      continue;
    }
    if (!byVisitor.has(id)) byVisitor.set(id, []);
    byVisitor.get(id).push(s);
  }
  const people = [...byVisitor.values()].map(mergeVisitor);
  return { people, machines };
}

const tally = (items, keyFn) => {
  const m = new Map();
  for (const it of items) {
    const keys = [].concat(keyFn(it)).filter((k) => k !== null && k !== undefined && k !== "");
    for (const k of new Set(keys)) m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
};

// Requests come from the CRM `notifications` rows the form routes write.
// Tests and George's own submissions are left out.
function cleanRequests(rows) {
  const seen = new Set();
  const out = [];
  for (const r of rows || []) {
    const text = `${r.title || ""} ${r.description || ""}`;
    if (/\(TEST\)|\be2e\b|test\+|george@georgeyachts\.com|biniaris/i.test(text)) continue;
    const at = new Date(r.created_at).getTime();
    if (!Number.isFinite(at)) continue;
    const label = String(r.title || "Request")
      .replace(/^[^A-Za-zΑ-Ωα-ω0-9]+/, "")
      .replace(/^New\s+/i, "")
      .trim();
    // The same person can reach two routes with one click (a brief and
    // its copy): one request per name per quarter of an hour.
    const who = (label.split(/\sfrom\s/i)[1] || label).toLowerCase();
    const key = `${who}|${Math.floor(at / (15 * 60 * 1000))}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ at, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return out.sort((a, b) => a.at - b.at);
}

// A browser that keeps coming back and never does anything is a monitor
// or a tab on auto-refresh, not a visitor (one of these made 29 visits
// in 8 days). Judged on every session handed in, not on one day.
function automatedVisitorIds(sessions) {
  const perVisitor = new Map();
  for (const s of sessions) {
    const id = s.visitor_id || s.session_id;
    const v = perVisitor.get(id) || { n: 0, active: false };
    v.n += 1;
    if (hasActivity(s)) v.active = true;
    perVisitor.set(id, v);
  }
  return new Set([...perVisitor.entries()].filter(([, v]) => v.n >= 4 && !v.active).map(([id]) => id));
}

// ── Build ────────────────────────────────────────────────────────
// sessions: rows from the last 9-10 days. requests: notification rows of
// type form_submission for the same span. endMs: end of the 24h window.
export function buildDailyReport({ sessions = [], requests = [], endMs, requestsFromHelm = false }) {
  const startMs = endMs - DAY_MS;
  const inWindow = (iso, from, to) => {
    const t = new Date(iso).getTime();
    return t >= from && t < to;
  };

  const automatedIds = automatedVisitorIds(sessions);

  const allRequests = cleanRequests(requests);

  const windowStats = (from, to) => {
    const { people, machines } = summarize(sessions.filter((s) => inWindow(s.started_at, from, to)), automatedIds);
    return {
      from,
      to,
      people,
      machines,
      requests: allRequests.filter((r) => r.at >= from && r.at < to),
      counts: {
        people: people.length,
        us: people.filter((p) => p.country === "US").length,
        engaged: people.filter((p) => p.engaged).length,
        yachtViewers: people.filter((p) => p.yachts.length > 0).length,
        machines: machines.length,
      },
    };
  };

  const today = windowStats(startMs, endMs);
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const w = i === 0 ? today : windowStats(startMs - i * DAY_MS, endMs - i * DAY_MS);
    week.push({ label: dayShort(w.from), ...w.counts, requests: w.requests.length, isToday: i === 0 });
  }
  const prior = week.slice(0, 6);
  const avg = (k) => (prior.length ? prior.reduce((n, d) => n + d[k], 0) / prior.length : 0);

  const people = today.people;
  const engaged = people.filter((p) => p.engaged);
  const top = [...engaged]
    .sort((a, b) => b.score - a.score || b.time - a.time)
    .slice(0, 8);

  return {
    startMs,
    endMs,
    // True when the request list came from The Helm; false when the CRM
    // could not be reached and only the forms' own notes were counted.
    requestsFromHelm,
    counts: { ...today.counts, requests: today.requests.length, hot: people.filter((p) => p.hot).length },
    avg: { people: avg("people"), us: avg("us"), engaged: avg("engaged") },
    people,
    top,
    requests: today.requests,
    sources: tally(people, (p) => p.source).map(([name, n]) => ({
      name,
      n,
      engaged: engaged.filter((p) => p.source === name).length,
      ai: AI_SOURCES.has(name),
    })),
    aiVisitors: people.filter((p) => AI_SOURCES.has(p.source)).length,
    countries: tally(people, (p) => p.country).map(([code, n]) => ({
      name: countryName(code),
      n,
      engaged: engaged.filter((p) => p.country === code).length,
    })),
    usPlaces: tally(people.filter((p) => p.country === "US"), (p) => [p.first.city, p.first.region].filter(Boolean).join(", ")),
    yachts: tally(people, (p) => p.yachts).map(([name, n]) => [yachtTitle(name), n]),
    landing: tally(people, (p) => p.pages[0]),
    googleLanding: tally(people.filter((p) => p.source === "Google"), (p) => p.pages[0]),
    read: tally(engaged, (p) => p.pages),
    mobile: people.filter((p) => p.mobile).length,
    returning: people.filter((p) => p.returning).length,
    longStay: engaged.filter((p) => p.time >= 180).length,
    machines: tally(today.machines, machineName),
    week,
  };
}

// ── The Logbook (GY Command) ─────────────────────────────────────
// 2026-11-06. George asked for a page in the Command Center that shows
// each day at a glance and keeps the history, month by month. The page
// lives in the other app; the counting lives here, in the same functions
// the morning email uses, so the two can never disagree about a day.
//
// A logbook day is the email's day: 24 hours from 05:00 UTC (07:00 in
// Athens in winter, midnight in New York), named by the date it starts.
export const LOGBOOK_LOOKBACK_DAYS = 10;

export function logbookWindow(date) {
  const startMs = Date.parse(`${date}T05:00:00Z`);
  return { startMs, endMs: startMs + DAY_MS };
}

const addDays = (date, n) => new Date(Date.parse(`${date}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10);

// The compact record of one day that the Command Center stores.
function daySnapshot(r, date) {
  const c = r.counts;
  const from = (name) => r.sources.find((s) => s.name === name)?.n || 0;
  return {
    date,
    counts: {
      people: c.people,
      us: c.us,
      engaged: c.engaged,
      yachtViewers: c.yachtViewers,
      hot: c.hot,
      requests: c.requests,
      machines: c.machines,
      mobile: r.mobile,
      returning: r.returning,
      longStay: r.longStay,
      ai: r.aiVisitors,
      google: from("Google"),
      direct: from("Απευθείας"),
    },
    sources: r.sources.slice(0, 10).map(({ name, n, ai }) => ({ name, n, ai })),
    countries: r.countries.slice(0, 10).map(({ name, n }) => [name, n]),
    usPlaces: r.usPlaces.slice(0, 10),
    yachts: r.yachts.slice(0, 10),
    landing: r.landing.slice(0, 8),
    read: r.read.slice(0, 8),
    googleLanding: r.googleLanding.slice(0, 6),
    machinesBy: r.machines,
    requests: r.requests,
    top: r.top.map((p) => ({
      place: p.place,
      at: p.startedAt,
      tz: p.first.timezone || null,
      source: p.source,
      device: p.device,
      returning: p.returning,
      hot: p.hot,
      time: p.time,
      visits: p.visits,
      pageCount: p.pages.length,
      pages: p.pages.slice(0, 8),
      yachts: p.yachts.map(yachtTitle),
      tools: p.tools,
      cta: p.ctaClicks ? p.cta || "ναι" : null,
      network: p.network,
    })),
  };
}

// sessions: rows sorted by started_at, reaching back LOOKBACK days before
// `from`. Returns one snapshot per finished day in [from, to], plus how
// many different people (and different Americans) came in the whole span,
// which a sum of days cannot tell: the same person on two days is one.
export function buildLogbookDays({ sessions = [], requests = [], from, to, nowMs = Date.now() }) {
  const times = sessions.map((s) => new Date(s.started_at).getTime());
  const days = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const { endMs } = logbookWindow(date);
    if (endMs > nowMs) break;
    const lookStart = endMs - LOOKBACK_MS;
    const slice = sessions.filter((_, i) => times[i] >= lookStart && times[i] < endMs);
    days.push(daySnapshot(buildDailyReport({ sessions: slice, requests, endMs }), date));
  }

  // Over the whole span: different people, different Americans, different
  // people an AI assistant sent, and how many visits opened each yacht.
  let unique = { people: 0, us: 0, ai: 0, google: 0 };
  let yachts = [];
  let aiBy = [];
  if (days.length) {
    const spanStart = logbookWindow(days[0].date).startMs;
    const spanEnd = logbookWindow(days[days.length - 1].date).endMs;
    const known = sessions.filter((_, i) => times[i] < spanEnd);
    const automated = automatedVisitorIds(known);
    const people = new Set();
    const us = new Set();
    const ai = new Set();
    const google = new Set();
    const byAssistant = new Map();
    const opened = new Map();
    known.forEach((s) => {
      const t = new Date(s.started_at).getTime();
      if (t < spanStart) return;
      const id = s.visitor_id || s.session_id;
      if (isOwnVisit(s) || machineReason(s) || automated.has(id)) return;
      people.add(id);
      if (s.country === "US") us.add(id);
      const source = sourceOf(s);
      if (source === "Google") google.add(id);
      if (AI_SOURCES.has(source)) {
        ai.add(id);
        if (!byAssistant.has(source)) byAssistant.set(source, new Set());
        byAssistant.get(source).add(id);
      }
      // One count per visit that opened the yacht's page, however many
      // times the page was reloaded inside that visit.
      for (const y of new Set(yachtsOf(s).map(yachtTitle))) if (y) opened.set(y, (opened.get(y) || 0) + 1);
    });
    unique = { people: people.size, us: us.size, ai: ai.size, google: google.size };
    // Different people each assistant sent. A person two assistants sent
    // counts once under each, so the parts can add up to more than `ai`.
    aiBy = [...byAssistant.entries()].map(([name, ids]) => [name, ids.size]).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    yachts = [...opened.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }
  return { days, unique, yachts, aiBy };
}

// ── Subject, one-paragraph summary, Telegram fallback ────────────
function windowLabel(r) {
  return dayShort(r.startMs);
}

export function reportSubject(r) {
  const c = r.counts;
  const bits = [pl(c.people, "άνθρωπος", "άνθρωποι"), `${c.us} από ΗΠΑ`];
  bits.push(c.requests ? pl(c.requests, "αίτημα", "αιτήματα") : "κανένα αίτημα");
  return `Site, ${windowLabel(r)}: ${bits.join(", ")}`;
}

function versus(now, avg) {
  if (avg < 1) return "";
  const diff = (now - avg) / avg;
  const a = Math.round(avg);
  if (diff > 0.2) return `, πάνω από τον μέσο όρο των προηγούμενων έξι ημερών (${a})`;
  if (diff < -0.2) return `, κάτω από τον μέσο όρο των προηγούμενων έξι ημερών (${a})`;
  return `, κοντά στον μέσο όρο των προηγούμενων έξι ημερών (${a})`;
}

export function reportSummary(r) {
  const c = r.counts;
  if (c.people === 0) return ["Το τελευταίο εικοσιτετράωρο δεν καταγράφηκε κανένας άνθρωπος στο site."];
  const out = [];
  const share = Math.round((c.us / c.people) * 100);
  out.push(
    `Στο site ${c.people === 1 ? "μπήκε" : "μπήκαν"} ${pl(c.people, "άνθρωπος", "άνθρωποι")}${versus(c.people, r.avg.people)}. ` +
      `${c.us === 1 ? "Ένας ήταν" : `${c.us} ήταν`} από τις ΗΠΑ (${share}%).`,
  );
  out.push(
    `${c.engaged === 1 ? "Ένας έμεινε και διάβασε" : `${c.engaged} έμειναν και διάβασαν`}, ` +
      `${c.yachtViewers === 1 ? "ένας άνοιξε" : `${c.yachtViewers} άνοιξαν`} σελίδα σκάφους` +
      (r.aiVisitors ? ` και ${r.aiVisitors === 1 ? "ένας ήρθε" : `${r.aiVisitors} ήρθαν`} από AI βοηθό (ChatGPT και παρόμοια).` : "."),
  );
  out.push(
    c.requests
      ? `${c.requests === 1 ? "Ήρθε ένα αίτημα" : `Ήρθαν ${c.requests} αιτήματα`} από τις φόρμες.`
      : "Δεν ήρθε αίτημα από τις φόρμες.",
  );
  return out;
}

export function reportFallbackText(r) {
  const c = r.counts;
  return [
    `Η ημερήσια αναφορά δεν στάλθηκε με email. Τα βασικά, ${windowLabel(r)}:`,
    `Άνθρωποι: ${c.people} (ΗΠΑ ${c.us})`,
    `Έμειναν και διάβασαν: ${c.engaged}`,
    `Άνοιξαν σκάφος: ${c.yachtViewers}`,
    `Αιτήματα: ${c.requests}`,
    `Μηχανές που φιλτραρίστηκαν: ${c.machines}`,
  ].join("\n");
}

// ── HTML ─────────────────────────────────────────────────────────
// Mailbox-safe: tables and inline styles only, house navy, ivory and gold.
const NAVY = "#0D1B2A";
const IVORY = "#F8F5F0";
const GOLD = "#B58A0A";
const RULE = "rgba(13,27,42,0.12)";
const SOFT = "#5B6570";
const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

const section = (title, body, note) => `
  <tr><td style="padding:30px 32px 0;">
    <p style="margin:0 0 4px;font-family:${SANS};font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${GOLD};font-weight:600;">${esc(title)}</p>
    ${note ? `<p style="margin:0 0 10px;font-family:${SANS};font-size:12px;line-height:1.5;color:${SOFT};">${note}</p>` : ""}
    <div style="border-top:1px solid ${RULE};padding-top:12px;">${body}</div>
  </td></tr>`;

function barRows(rows, { max = 8, total } = {}) {
  const shown = rows.slice(0, max);
  const top = Math.max(1, ...shown.map((r) => r.n));
  const body = shown
    .map((r) => {
      const width = Math.max(3, Math.round((r.n / top) * 100));
      const pct = total ? ` <span style="color:${SOFT};">(${Math.round((r.n / total) * 100)}%)</span>` : "";
      return `<tr>
        <td style="padding:5px 10px 5px 0;font-family:${SANS};font-size:14px;color:${NAVY};width:42%;vertical-align:middle;">${esc(r.name)}${r.tag ? ` <span style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${GOLD};">${esc(r.tag)}</span>` : ""}</td>
        <td style="padding:5px 0;vertical-align:middle;">
          <div style="background:rgba(13,27,42,0.06);height:6px;"><div style="background:${GOLD};height:6px;width:${width}%;font-size:0;line-height:0;">&nbsp;</div></div>
        </td>
        <td style="padding:5px 0 5px 12px;font-family:${SANS};font-size:14px;color:${NAVY};white-space:nowrap;text-align:right;width:92px;vertical-align:middle;">${r.n}${pct}</td>
      </tr>`;
    })
    .join("");
  const rest = rows.length - shown.length;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${body}</table>${
    rest > 0 ? `<p style="margin:6px 0 0;font-family:${SANS};font-size:12px;color:${SOFT};">και ${rest} ακόμα</p>` : ""
  }`;
}

function plainList(rows, max = 6) {
  if (!rows.length) return `<p style="margin:0;font-family:${SANS};font-size:13px;color:${SOFT};">Τίποτα σήμερα.</p>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows
    .slice(0, max)
    .map(
      ([name, n]) => `<tr>
        <td style="padding:4px 10px 4px 0;font-family:${SANS};font-size:13px;line-height:1.45;color:${NAVY};word-break:break-word;">${esc(name)}</td>
        <td style="padding:4px 0;font-family:${SANS};font-size:13px;color:${NAVY};text-align:right;white-space:nowrap;vertical-align:top;width:40px;">${n}</td>
      </tr>`,
    )
    .join("")}</table>${
    rows.length > max ? `<p style="margin:6px 0 0;font-family:${SANS};font-size:12px;color:${SOFT};">και ${rows.length - max} ακόμα</p>` : ""
  }`;
}

function tile(value, label, sub) {
  return `<td style="width:33.33%;padding:14px 8px 12px;text-align:center;vertical-align:top;border:1px solid ${RULE};background:#FFFFFF;">
    <p style="margin:0;font-family:${SERIF};font-size:30px;line-height:1;color:${NAVY};">${esc(value)}</p>
    <p style="margin:8px 0 0;font-family:${SANS};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${SOFT};line-height:1.4;">${esc(label)}</p>
    ${sub ? `<p style="margin:4px 0 0;font-family:${SANS};font-size:11px;color:${SOFT};">${esc(sub)}</p>` : ""}
  </td>`;
}

function visitorCard(p) {
  const athens = clock(p.startedAt, ATHENS);
  const local = p.first.timezone && p.first.timezone !== ATHENS ? clock(p.startedAt, p.first.timezone) : null;
  const when = `Ήρθε στις ${athens} ώρα Αθήνας${local ? ` (${local} δική του ώρα)` : ""}`;
  const lines = [];
  lines.push(`${when}, από <span style="color:${NAVY};">${esc(p.source)}</span>. ${esc(p.device)}. ${p.returning ? "Έχει ξαναέρθει." : "Πρώτη επίσκεψη."}`);
  lines.push(`Έμεινε ${duration(p.time)} και είδε ${pl(p.pages.length, "σελίδα", "σελίδες")}${p.visits > 1 ? `, σε ${p.visits} επισκέψεις` : ""}.`);
  if (p.yachts.length) lines.push(`Σκάφη: <span style="color:${NAVY};">${esc(p.yachts.map(yachtTitle).join(", "))}</span>`);
  if (p.tools.length) lines.push(`Χρησιμοποίησε: ${esc(p.tools.join(", "))}`);
  if (p.ctaClicks) lines.push(`Πάτησε κουμπί επικοινωνίας${p.cta ? `: ${esc(p.cta)}` : ""}`);
  if (p.copied.length) lines.push(`Αντέγραψε: «${esc(p.copied.slice(0, 2).join("», «").slice(0, 160))}»`);
  const path = p.pages.slice(0, 7).map(esc).join(" &rarr; ") + (p.pages.length > 7 ? ` &rarr; και ${p.pages.length - 7} ακόμα` : "");
  lines.push(`Διαδρομή: <span style="font-size:12px;">${path}</span>`);
  if (p.network) lines.push(`<span style="font-size:11px;">Δίκτυο: ${esc(p.network)}</span>`);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 10px;">
    <tr><td style="padding:14px 16px;background:#FFFFFF;border:1px solid ${RULE};border-left:3px solid ${p.hot ? GOLD : RULE};">
      <p style="margin:0 0 6px;font-family:${SERIF};font-size:17px;line-height:1.3;color:${NAVY};">${esc(p.place)}${
        p.hot ? ` <span style="font-family:${SANS};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${GOLD};">&nbsp;ζεστός</span>` : ""
      }</p>
      ${lines.map((l) => `<p style="margin:0 0 3px;font-family:${SANS};font-size:13px;line-height:1.55;color:${SOFT};word-break:break-word;">${l}</p>`).join("")}
    </td></tr>
  </table>`;
}

function weekTable(week, hour) {
  const th = (t, align = "right") =>
    `<th style="padding:6px 6px;font-family:${SANS};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${SOFT};font-weight:600;text-align:${align};border-bottom:1px solid ${RULE};">${t}</th>`;
  const td = (t, bold, align = "right") =>
    `<td style="padding:7px 6px;font-family:${SANS};font-size:13px;color:${NAVY};text-align:${align};border-bottom:1px solid rgba(13,27,42,0.06);${bold ? "font-weight:600;" : ""}">${t}</td>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    <tr>${th(`Από ${esc(hour)}`, "left")}${th("Άνθρωποι")}${th("ΗΠΑ")}${th("Διάβασαν")}${th("Σκάφη")}${th("Αιτήματα")}${th("Μηχανές")}</tr>
    ${week
      .map(
        (d) =>
          `<tr${d.isToday ? ` style="background:rgba(181,138,10,0.08);"` : ""}>${td(esc(d.label), d.isToday, "left")}${td(d.people, d.isToday)}${td(d.us, d.isToday)}${td(d.engaged, d.isToday)}${td(d.yachtViewers, d.isToday)}${td(d.requests, d.isToday)}${td(`<span style="color:${SOFT};">${d.machines}</span>`, false)}</tr>`,
      )
      .join("")}
  </table>`;
}

export function renderReportHtml(r) {
  const c = r.counts;
  const summary = reportSummary(r);
  const startHour = clock(r.startMs, ATHENS);
  const endHour = clock(r.endMs, ATHENS);
  const windowText = `${dayLong(r.startMs)}, ${startHour} έως ${dayLong(r.endMs)}, ${endHour} (ώρα Αθήνας)`;

  const tiles = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
    <tr>${tile(c.people, "Άνθρωποι")}${tile(c.us, "Από ΗΠΑ", c.people ? `${Math.round((c.us / c.people) * 100)}%` : "")}${tile(c.engaged, "Έμειναν και διάβασαν")}</tr>
    <tr>${tile(c.yachtViewers, "Άνοιξαν σκάφος")}${tile(c.hot, "Ζεστοί")}${tile(c.requests, "Αιτήματα")}</tr>
  </table>`;

  const requestsBody = r.requests.length
    ? r.requests
        .map(
          (q) =>
            `<p style="margin:0 0 6px;font-family:${SANS};font-size:14px;line-height:1.5;color:${NAVY};"><span style="color:${SOFT};">${clock(q.at, ATHENS)}</span>&nbsp; ${esc(q.label)}</p>`,
        )
        .join("")
    : `<p style="margin:0;font-family:${SANS};font-size:13px;color:${SOFT};">Κανένα αίτημα αυτό το εικοσιτετράωρο.</p>`;

  const topBody = r.top.length
    ? r.top.map(visitorCard).join("")
    : `<p style="margin:0;font-family:${SANS};font-size:13px;color:${SOFT};">Κανείς δεν έμεινε αρκετά ώστε να αφήσει ίχνος.</p>`;

  const machinesLine = c.machines
    ? `${pl(c.machines, "επίσκεψη", "επισκέψεις")} από μηχανές έμειναν εκτός: ${r.machines.map(([n, k]) => `${esc(n)} ${k}`).join(", ")}. Είναι προγράμματα που διαβάζουν το site για μηχανές αναζήτησης, AI και κοινωνικά δίκτυα, όχι πελάτες.`
    : "Δεν καταγράφηκαν επισκέψεις από μηχανές.";

  const half = (title, body) =>
    `<td style="width:50%;vertical-align:top;padding:0 10px 0 0;"><p style="margin:0 0 6px;font-family:${SANS};font-size:12px;color:${SOFT};">${esc(title)}</p>${body}</td>`;

  return `<!doctype html><html lang="el"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(reportSubject(r))}</title></head>
<body style="margin:0;padding:0;background:${IVORY};">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${IVORY};border-collapse:collapse;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;background:${IVORY};border-collapse:collapse;">
  <tr><td style="background:${NAVY};padding:26px 32px;">
    <p style="margin:0;font-family:${SANS};font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#DAA110;font-weight:600;">George Yachts</p>
    <p style="margin:10px 0 0;font-family:${SERIF};font-size:26px;line-height:1.2;color:${IVORY};">Η μέρα στο site</p>
    <p style="margin:8px 0 0;font-family:${SANS};font-size:12px;line-height:1.5;color:rgba(248,245,240,0.72);">${esc(windowText)}</p>
  </td></tr>
  <tr><td style="padding:26px 32px 0;">
    ${summary.map((s) => `<p style="margin:0 0 8px;font-family:${SERIF};font-size:17px;line-height:1.55;color:${NAVY};">${esc(s)}</p>`).join("")}
  </td></tr>
  <tr><td style="padding:18px 32px 0;">${tiles}</td></tr>
  ${section("Αιτήματα", requestsBody)}
  ${section("Ποιοι κοίταξαν σοβαρά", topBody, "Οι επισκέπτες με τη μεγαλύτερη δραστηριότητα, από τον πιο ζεστό προς τα κάτω.")}
  ${section("Από πού ήρθαν", barRows(r.sources.map((s) => ({ name: s.name, n: s.n, tag: s.ai ? "AI" : "" })), { total: c.people }), "«Απευθείας» σημαίνει ότι έγραψαν τη διεύθυνση, είχαν σελιδοδείκτη, ή πάτησαν link σε email, WhatsApp ή εφαρμογή.")}
  ${section("Χώρες", barRows(r.countries, { total: c.people }))}
  ${r.usPlaces.length ? section("Πόλεις στις ΗΠΑ", plainList(r.usPlaces, 10)) : ""}
  ${section("Σκάφη που άνοιξαν", plainList(r.yachts, 10), "Πόσοι άνθρωποι άνοιξαν τη σελίδα κάθε σκάφους.")}
  ${section(
    "Σελίδες",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;"><tr>
      ${half("Από εδώ μπήκαν", plainList(r.landing, 6))}
      ${half("Αυτές διάβασαν όσοι έμειναν", plainList(r.read, 6))}
    </tr></table>
    ${r.googleLanding.length ? `<p style="margin:14px 0 6px;font-family:${SANS};font-size:12px;color:${SOFT};">Σε αυτές τις σελίδες έφερε κόσμο η Google</p>${plainList(r.googleLanding, 5)}` : ""}`,
  )}
  ${section(
    "Με μια ματιά",
    `<p style="margin:0 0 4px;font-family:${SANS};font-size:14px;line-height:1.6;color:${NAVY};">${c.people ? `${Math.round((r.mobile / c.people) * 100)}% από κινητό ή tablet, ${100 - Math.round((r.mobile / c.people) * 100)}% από υπολογιστή.` : ""}</p>
     <p style="margin:0 0 4px;font-family:${SANS};font-size:14px;line-height:1.6;color:${NAVY};">${r.returning === 1 ? "Ένας είχε ξαναέρθει" : `${r.returning} είχαν ξαναέρθει`} στο παρελθόν. ${r.longStay === 1 ? "Ένας έμεινε" : `${r.longStay} έμειναν`} πάνω από 3 λεπτά.</p>`,
  )}
  ${section("Οι τελευταίες 7 ημέρες", weekTable(r.week, startHour), `Κάθε γραμμή είναι ένα εικοσιτετράωρο που αρχίζει στις ${esc(startHour)} της ημέρας που γράφει.`)}
  <tr><td style="padding:26px 32px 30px;">
    <div style="border-top:1px solid ${RULE};padding-top:14px;">
      <p style="margin:0 0 8px;font-family:${SANS};font-size:12px;line-height:1.6;color:${SOFT};">${machinesLine}</p>
      <p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.6;color:${SOFT};">Πώς μετράμε: «άνθρωπος» είναι κάθε διαφορετική συσκευή που δεν μοιάζει με πρόγραμμα. «Έμεινε και διάβασε» σημαίνει ότι κουνήθηκε το ποντίκι, άνοιξε δεύτερη σελίδα ή πέρασαν τουλάχιστον 5 δευτερόλεπτα. Ο διαχωρισμός ανθρώπου και μηχανής είναι εκτίμηση, όχι βεβαιότητα. Οι δικές σου επισκέψεις μετράνε κι αυτές. ${
        r.requestsFromHelm
          ? "Τα αιτήματα είναι όσα έχει το Helm, όπως κι αν ήρθαν."
          : "Σήμερα το Helm δεν απάντησε: τα αιτήματα εδώ είναι μόνο όσα κατέγραψαν οι φόρμες του site, και μπορεί να λείπουν κάποια."
      }</p>
    </div>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}
