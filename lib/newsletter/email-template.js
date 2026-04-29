// Brief §11 — email template foundation.
//
// Pure builder: pass content + metadata, get back a full HTML email
// AND a parallel plain-text version. No external API calls. No state.
//
// Tested rendering targets per Brief §11.5:
//   Gmail (web/iOS/Android), Apple Mail (iOS/macOS), Outlook
//   (web/iOS/Android/desktop), Yahoo, dark mode in all of those.
//
// Width 580px centered desktop / fluid mobile, table-based layout
// (Outlook still requires it in 2026), inline CSS only (Gmail
// strips <style>), no web fonts (fallback to Georgia / system),
// CSS-text masthead so the brand stays visible when images are
// blocked.

const STREAM_LABELS = {
  bridge: "THE BRIDGE",
  wake: "THE WAKE",
  compass: "THE COMPASS",
  greece: "ΑΠΟ ΤΗΝ ΕΛΛΑΔΑ",
};

const COLORS = {
  paper: "#F8F5F0", // Ivory White
  ink: "#0D1B2A", // Deep Navy
  gold: "#C9A84C", // Antique Gold
  rule: "#E5DFD3", // hairline rule on the paper
  muted: "#5A6776",
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildMasthead(stream) {
  const label = STREAM_LABELS[stream] ?? "THE BRIDGE";
  return `
    <tr>
      <td style="padding:36px 32px 8px 32px;text-align:center;">
        <div style="font-family:'Cormorant Garamond',Georgia,'Times New Roman',serif;font-weight:300;letter-spacing:0.18em;font-size:30px;line-height:1;color:${COLORS.ink};">
          ${escapeHtml(label)}
        </div>
        <div style="height:1px;background:${COLORS.gold};width:60px;margin:14px auto 12px auto;line-height:1px;font-size:0;">&nbsp;</div>
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.34em;color:${COLORS.gold};text-transform:uppercase;">
          George&nbsp;Yachts
        </div>
      </td>
    </tr>`;
}

function buildHero(heroImageUrl) {
  if (!heroImageUrl) return "";
  return `
    <tr>
      <td style="padding:24px 0 0 0;">
        <img src="${escapeHtml(heroImageUrl)}" width="580" height="360" alt="" style="display:block;width:100%;max-width:580px;height:auto;border:0;outline:none;text-decoration:none;" />
      </td>
    </tr>`;
}

function buildFooter(unsubscribeUrl, privacyUrl) {
  const unsub = unsubscribeUrl
    ? `<a href="${escapeHtml(unsubscribeUrl)}" style="color:${COLORS.muted};text-decoration:underline;">Unsubscribe with one click</a>`
    : `Unsubscribe with one click`;
  const privacy = privacyUrl
    ? `<a href="${escapeHtml(privacyUrl)}" style="color:${COLORS.muted};text-decoration:underline;">Privacy Policy</a>`
    : `Privacy Policy`;
  return `
    <tr>
      <td style="padding:32px 32px 8px 32px;">
        <div style="height:1px;background:${COLORS.rule};line-height:1px;font-size:0;">&nbsp;</div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 32px 36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:${COLORS.muted};text-align:center;">
        <div style="margin-bottom:8px;color:${COLORS.ink};font-weight:600;letter-spacing:0.04em;">George Yachts Brokerage House LLC</div>
        <div>30 N Gould St, STE R, Sheridan, WY 82801, USA</div>
        <div style="margin-bottom:14px;">Operating from Athens, Greece</div>
        <div style="margin-bottom:14px;">
          You're receiving this because you subscribed at georgeyachts.com<br/>
          or have corresponded with us about charters.
        </div>
        <div style="margin-bottom:14px;">
          Reply directly — <a href="mailto:george@georgeyachts.com" style="color:${COLORS.muted};text-decoration:underline;">george@georgeyachts.com</a><br/>
          Web — <a href="https://georgeyachts.com" style="color:${COLORS.muted};text-decoration:underline;">georgeyachts.com</a>
        </div>
        <div>${unsub} &nbsp;·&nbsp; ${privacy}</div>
      </td>
    </tr>`;
}

/**
 * Convert a minimal markdown-ish body to HTML paragraphs. Newsletters
 * are written in long-form prose, not full markdown — so this only
 * needs to handle: paragraph breaks, single newlines, **bold**,
 * *italic*, [link](url), and bullet lists ("- " / "* " prefix).
 */
function bodyToHtml(bodyText) {
  if (!bodyText) return "";
  const blocks = String(bodyText).trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const isList = /^\s*[-*]\s+/.test(block);
      if (isList) {
        const items = block
          .split(/\n/)
          .map((l) => l.replace(/^\s*[-*]\s+/, ""))
          .map((l) => `<li style="margin:4px 0;">${inlineHtml(l)}</li>`)
          .join("");
        return `<ul style="margin:14px 0 14px 22px;padding:0;">${items}</ul>`;
      }
      return `<p style="margin:0 0 18px 0;">${inlineHtml(block).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function inlineHtml(s) {
  return escapeHtml(s)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" style="color:${COLORS.ink};text-decoration:underline;">$1</a>`,
    );
}

/**
 * Plain-text mirror — same words, no HTML. Brief §17.5: "no formatting".
 * Strips markdown formatting and bullet markers cleanly.
 */
function bodyToPlainText(bodyText) {
  if (!bodyText) return "";
  return String(bodyText)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .trim();
}

/**
 * Build the full email package.
 *
 * @param {object} args
 * @param {string} args.stream            "bridge" | "wake" | "compass" | "greece"
 * @param {string} args.subject           email subject (already final)
 * @param {string} args.preheader         hidden preview text (~80 chars)
 * @param {string} args.body_text         markdown-ish body — see bodyToHtml
 * @param {string} [args.hero_image_url]  optional Sanity CDN URL
 * @param {string} args.unsubscribe_url   per-recipient one-click URL
 * @param {string} [args.privacy_url]     defaults to /privacy
 * @returns {{ html: string, text: string, subject: string }}
 */
export function buildNewsletterEmail(args) {
  const stream = args.stream ?? "bridge";
  const subject = args.subject ?? "From the Greek waters";
  const preheader = args.preheader ?? "";
  const bodyText = args.body_text ?? "";
  const heroImageUrl = args.hero_image_url ?? null;
  const unsubscribeUrl = args.unsubscribe_url ?? null;
  const privacyUrl = args.privacy_url ?? "https://georgeyachts.com/privacy-policy";

  const bodyHtmlBlock = bodyToHtml(bodyText);

  // Hidden preheader trick — invisible but renders in inbox preview.
  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:${COLORS.paper};line-height:1px;mso-line-height-rule:exactly;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader)}${"&#8202;&zwnj;&nbsp;".repeat(40)}</div>`
    : "";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="light dark"/><meta name="supported-color-schemes" content="light dark"/><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${COLORS.paper};color:${COLORS.ink};font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;">
${preheaderHtml}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${COLORS.paper};">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" width="580" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:580px;background:${COLORS.paper};">
        ${buildMasthead(stream)}
        ${buildHero(heroImageUrl)}
        <tr>
          <td style="padding:28px 32px 8px 32px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${COLORS.ink};">
            ${bodyHtmlBlock}
          </td>
        </tr>
        ${buildFooter(unsubscribeUrl, privacyUrl)}
      </table>
    </td>
  </tr>
</table>
</body></html>`;

  // Plain-text counterpart: subject + body + footer block.
  const text = [
    `${STREAM_LABELS[stream] ?? "THE BRIDGE"} — George Yachts`,
    `${"-".repeat(40)}`,
    "",
    bodyToPlainText(bodyText),
    "",
    `${"-".repeat(40)}`,
    "George Yachts Brokerage House LLC",
    "30 N Gould St, STE R, Sheridan, WY 82801, USA",
    "Operating from Athens, Greece",
    "",
    "Reply directly: george@georgeyachts.com",
    "Web: https://georgeyachts.com",
    "",
    unsubscribeUrl ? `Unsubscribe: ${unsubscribeUrl}` : "",
    privacyUrl ? `Privacy: ${privacyUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text, subject };
}

export const __TEST__ = { bodyToHtml, bodyToPlainText, escapeHtml };
