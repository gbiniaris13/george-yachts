// 2026-10-26 (George): every link to georgeyachts.com that leaves by email
// carries a source, so a click from the newsletter, the acknowledgment or a
// Cabin email never lands in analytics as "Direct". Tracking endpoints under
// /api/ and links already carrying utm parameters are left alone. Mirrors
// src/lib/utm.ts in the Helm.
const SITE_LINK = /https?:\/\/(?:www\.)?georgeyachts\.com(\/[^\s"'<>)\]]*)?/g;

export function tagSiteLinks(text, utm) {
  if (!text || !utm || !utm.source) return text;
  const medium = utm.medium || "email";
  const campaign = utm.campaign || utm.source;
  const params = `utm_source=${encodeURIComponent(utm.source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;
  return String(text).replace(SITE_LINK, (match, path) => {
    let url = match;
    let trail = "";
    const m = url.match(/[.,;:!?]+$/);
    if (m) { trail = m[0]; url = url.slice(0, -trail.length); }
    const p = (path || "").replace(/[.,;:!?]+$/, "");
    if (p.startsWith("/api/") || /[?&]utm_/.test(url)) return match;
    const [base, hash] = url.split("#");
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}${params}${hash ? `#${hash}` : ""}${trail}`;
  });
}
