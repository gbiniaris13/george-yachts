// Weekly newsletter HTML template for The George Yachts Journal.
//
// Accepts a data bag (featured yacht, 3 available yachts, issue number,
// week-of-year for copy) and returns a self-contained inlined-CSS HTML
// string that renders cleanly in Gmail, Outlook, Apple Mail, and the
// default iOS/Android clients.
//
// No external CSS, no <style> blocks — every rule is inline.
// Images are hot-linked from Sanity CDN.

const BRAND_GOLD = "#C9A84C";
const BRAND_BLACK = "#0a0a0a";
const BRAND_CREAM = "#F8F5F0";
const BRAND_INK = "#0D1B2A";

function escape(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yachtCard(yacht, baseUrl = "https://georgeyachts.com") {
  if (!yacht) return "";
  const img = yacht.imageUrl || "";
  const href = `${baseUrl}/yachts/${yacht.slug || ""}`;
  return `
    <tr><td style="padding: 14px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          ${
            img
              ? `<td width="140" style="vertical-align: top; padding-right: 18px;">
              <a href="${href}" style="text-decoration: none;">
                <img src="${img}" alt="${escape(yacht.name)}" width="140" height="94" style="display: block; width: 140px; height: 94px; object-fit: cover; border: 0;" />
              </a>
            </td>`
              : ""
          }
          <td style="vertical-align: top;">
            <p style="margin: 0 0 4px; font-family: 'Montserrat', Arial, sans-serif; font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: ${BRAND_GOLD}; font-weight: 600;">
              ${escape(yacht.builder || "Charter")}
            </p>
            <h3 style="margin: 0 0 6px; font-family: Georgia, 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: ${BRAND_INK}; letter-spacing: 0.01em;">
              <a href="${href}" style="color: ${BRAND_INK}; text-decoration: none;">${escape(yacht.name)}</a>
            </h3>
            <p style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 14px; line-height: 1.55; color: #4a5563; font-weight: 300;">
              ${escape(yacht.tagline || `${yacht.length || ""} · ${yacht.guests ? yacht.guests + " guests" : ""}`.replace(/^·\s*|\s*·\s*$/g, ""))}
            </p>
            ${
              yacht.weeklyRatePrice
                ? `<p style="margin: 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 11px; letter-spacing: 0.12em; color: ${BRAND_GOLD}; font-weight: 500;">
              FROM ${escape(yacht.weeklyRatePrice)} / WEEK
            </p>`
                : ""
            }
          </td>
        </tr>
      </table>
    </td></tr>
  `;
}

export function renderWeeklyEmail({
  issueNumber = 1,
  weekLabel = "",
  featuredYacht = null,
  availableYachts = [],
  baseUrl = "https://georgeyachts.com",
  unsubscribeUrl = "",
} = {}) {
  const featured = featuredYacht || {};
  const featuredImg = featured.imageUrl || "";
  const featuredHref = `${baseUrl}/yachts/${featured.slug || ""}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The George Yachts Journal — Issue ${issueNumber}</title>
</head>
<body style="margin: 0; padding: 0; background: ${BRAND_CREAM}; font-family: Georgia, serif;">
  <!-- Preheader (hidden in body, shown in inbox preview) -->
  <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: transparent;">
    This week: ${escape(featured.name || "a signature yacht")} &middot; Greek waters, curated quietly.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: ${BRAND_CREAM};">
    <tr><td align="center" style="padding: 24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background: #fff; border: 1px solid rgba(218,165,32,0.15);">

        <!-- Masthead -->
        <tr><td style="background: ${BRAND_BLACK}; padding: 40px 30px; text-align: center; border-bottom: 1px solid ${BRAND_GOLD};">
          <p style="margin: 0 0 10px; font-family: 'Montserrat', Arial, sans-serif; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: ${BRAND_GOLD}; font-weight: 600;">
            Issue ${issueNumber}${weekLabel ? " &middot; " + escape(weekLabel) : ""}
          </p>
          <h1 style="margin: 0; font-family: Georgia, 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: #fff; letter-spacing: 0.1em;">
            THE GEORGE YACHTS JOURNAL
          </h1>
          <p style="margin: 14px auto 0; font-family: Georgia, serif; font-size: 14px; font-style: italic; color: rgba(255,255,255,0.6); max-width: 420px; line-height: 1.55;">
            One curated yacht, one Greek itinerary, the stories behind each sailing.
          </p>
        </td></tr>

        <!-- Featured yacht hero -->
        <tr><td style="padding: 0;">
          ${
            featuredImg
              ? `<a href="${featuredHref}" style="text-decoration: none;">
            <img src="${featuredImg}" alt="${escape(featured.name || "Featured yacht")}" width="600" style="display: block; width: 100%; height: auto; border: 0;" />
          </a>`
              : ""
          }
        </td></tr>

        <tr><td style="padding: 36px 34px 10px;">
          <p style="margin: 0 0 8px; font-family: 'Montserrat', Arial, sans-serif; font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase; color: ${BRAND_GOLD}; font-weight: 600;">
            This week's signature
          </p>
          <h2 style="margin: 0 0 10px; font-family: Georgia, serif; font-size: 30px; font-weight: 300; color: ${BRAND_INK}; letter-spacing: 0.01em; line-height: 1.15;">
            ${escape(featured.name || "The week's curated yacht")}
          </h2>
          <p style="margin: 0 0 18px; font-family: Georgia, serif; font-size: 16px; line-height: 1.65; color: #3a4553; font-weight: 300;">
            ${escape(
              featured.tagline ||
                "A yacht worth the detour — chosen for its discretion, its crew, and the way it moves through Greek waters."
            )}
          </p>
          <p style="margin: 0 0 8px; font-family: Georgia, serif; font-size: 14px; line-height: 1.7; color: #555e6b; font-weight: 300;">
            ${
              featured.length
                ? `<strong style="color: ${BRAND_INK};">Length:</strong> ${escape(featured.length)} &nbsp;&middot;&nbsp; `
                : ""
            }
            ${
              featured.guests
                ? `<strong style="color: ${BRAND_INK};">Guests:</strong> ${escape(String(featured.guests))} &nbsp;&middot;&nbsp; `
                : ""
            }
            ${
              featured.builder
                ? `<strong style="color: ${BRAND_INK};">Builder:</strong> ${escape(featured.builder)}`
                : ""
            }
          </p>
          ${
            featured.weeklyRatePrice
              ? `<p style="margin: 18px 0 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 12px; letter-spacing: 0.18em; color: ${BRAND_GOLD}; font-weight: 600;">
            FROM ${escape(featured.weeklyRatePrice)} / WEEK
          </p>`
              : ""
          }
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;">
            <tr><td style="background: ${BRAND_GOLD};">
              <a href="${featuredHref}" style="display: inline-block; padding: 14px 28px; font-family: 'Montserrat', Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: ${BRAND_BLACK}; text-decoration: none;">
                View this yacht &rarr;
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding: 30px 34px 0;">
          <div style="height: 1px; background: linear-gradient(to right, ${BRAND_GOLD}, rgba(201,168,76,0.1));"></div>
        </td></tr>

        <!-- Currently available -->
        <tr><td style="padding: 26px 34px 10px;">
          <p style="margin: 0 0 8px; font-family: 'Montserrat', Arial, sans-serif; font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase; color: ${BRAND_GOLD}; font-weight: 600;">
            Also available this week
          </p>
          <p style="margin: 0 0 10px; font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #5a6472; font-weight: 300; line-height: 1.55;">
            Three more yachts currently accepting inquiries. Discretion guaranteed; one email, one reply, one answer.
          </p>
        </td></tr>

        <tr><td style="padding: 0 34px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${availableYachts.map((y) => yachtCard(y, baseUrl)).join("")}
          </table>
        </td></tr>

        <!-- Closing -->
        <tr><td style="padding: 30px 34px 40px;">
          <div style="height: 1px; background: linear-gradient(to right, ${BRAND_GOLD}, rgba(201,168,76,0.1)); margin-bottom: 24px;"></div>
          <p style="margin: 0 0 10px; font-family: Georgia, serif; font-size: 15px; line-height: 1.7; color: #3a4553; font-weight: 300;">
            If one of these is worth a conversation, simply reply to this email. I answer every message personally.
          </p>
          <p style="margin: 18px 0 0; font-family: Georgia, serif; font-size: 15px; color: ${BRAND_INK}; line-height: 1.5;">
            Fair winds,<br />
            <strong style="font-weight: 400;">George P. Biniaris</strong><br />
            <span style="font-size: 12px; color: #6B7B8D;">Managing Broker &middot; George Yachts</span>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background: ${BRAND_BLACK}; padding: 24px 30px; text-align: center;">
          <p style="margin: 0 0 6px; font-family: 'Montserrat', Arial, sans-serif; font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: ${BRAND_GOLD}; font-weight: 600;">
            &Phi;&Iota;&Lambda;&Omicron;&Tau;&Iota;&Mu;&Omicron;
          </p>
          <p style="margin: 0; font-family: 'Montserrat', Arial, sans-serif; font-size: 9px; letter-spacing: 0.15em; color: rgba(255,255,255,0.3);">
            <a href="${baseUrl}" style="color: rgba(255,255,255,0.45); text-decoration: none;">georgeyachts.com</a>
            &nbsp;&middot;&nbsp;
            ${
              unsubscribeUrl
                ? `<a href="${unsubscribeUrl}" style="color: rgba(255,255,255,0.45); text-decoration: underline;">Unsubscribe</a>`
                : `Unsubscribe by replying "unsubscribe"`
            }
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
