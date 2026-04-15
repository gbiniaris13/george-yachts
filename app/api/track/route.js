// /app/api/track/route.js
// Visitor tracking API — sends real-time Telegram alerts for site visitors
// FREE: uses Vercel geo headers + Telegram Bot API

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// CRM Supabase connection (write leads + sessions to GY Command)
const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

async function writeToCRM(table, data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
    return null;
  } catch { return null; }
}

// PATCH a session row matched by session_id. Used to enrich the row the
// new_visit event inserted (time_on_site, ended_at, pages, yachts, hot-lead flag).
async function updateCRMSession(sessionId, patch) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !sessionId) return null;
  try {
    const url = `${CRM_SUPABASE_URL}/rest/v1/sessions?session_id=eq.${encodeURIComponent(sessionId)}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patch),
    });
    return res.ok ? true : null;
  } catch { return null; }
}

async function findCRMContact(email) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !email) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&limit=1`, {
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data?.[0] || null;
    }
    return null;
  } catch { return null; }
}

async function getHotStageId() {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/pipeline_stages?name=eq.Hot&limit=1`, {
      headers: {
        'apikey': CRM_SUPABASE_KEY,
        'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data?.[0]?.id || null;
    }
    return null;
  } catch { return null; }
}

// Country code → flag emoji
function countryFlag(code) {
  if (!code || code.length !== 2) return '\u{1F30D}'; // globe
  const upper = code.toUpperCase();
  return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
}

// Country code → full name
function countryName(code) {
  const names = {
    GR: 'Greece', US: 'United States', GB: 'United Kingdom', DE: 'Germany',
    FR: 'France', IT: 'Italy', ES: 'Spain', NL: 'Netherlands', CH: 'Switzerland',
    AT: 'Austria', BE: 'Belgium', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
    FI: 'Finland', PT: 'Portugal', IE: 'Ireland', PL: 'Poland', CZ: 'Czech Republic',
    RO: 'Romania', BG: 'Bulgaria', HR: 'Croatia', HU: 'Hungary', TR: 'Turkey',
    RU: 'Russia', CY: 'Cyprus', MT: 'Malta', LU: 'Luxembourg', AE: 'UAE',
    SA: 'Saudi Arabia', QA: 'Qatar', BH: 'Bahrain', KW: 'Kuwait', OM: 'Oman',
    IL: 'Israel', EG: 'Egypt', AU: 'Australia', NZ: 'New Zealand', CA: 'Canada',
    MX: 'Mexico', BR: 'Brazil', AR: 'Argentina', JP: 'Japan', CN: 'China',
    KR: 'South Korea', IN: 'India', SG: 'Singapore', HK: 'Hong Kong', TH: 'Thailand',
    ZA: 'South Africa', NG: 'Nigeria', KE: 'Kenya', MC: 'Monaco', ME: 'Montenegro',
    AL: 'Albania', RS: 'Serbia', BA: 'Bosnia',
  };
  return names[code?.toUpperCase()] || code || 'Unknown';
}

// Parse device type from user agent
function getDevice(ua) {
  if (!ua) return { type: 'Unknown', icon: '\u{1F4BB}' };
  const lower = ua.toLowerCase();
  if (/iphone|ipad/.test(lower)) return { type: 'iPhone/iPad', icon: '\u{1F4F1}' };
  if (/android/.test(lower)) return { type: 'Android', icon: '\u{1F4F1}' };
  if (/macintosh|mac os/.test(lower)) return { type: 'Mac', icon: '\u{1F4BB}' };
  if (/windows/.test(lower)) return { type: 'Windows PC', icon: '\u{1F5A5}\uFE0F' };
  if (/linux/.test(lower)) return { type: 'Linux', icon: '\u{1F4BB}' };
  return { type: 'Desktop', icon: '\u{1F4BB}' };
}

// Send Telegram message
async function sendTelegram(text) {
  if (!BOT_TOKEN || !CHAT_ID) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error('Telegram send error:', e);
  }
}

// Format time on site
function formatDuration(seconds) {
  if (!seconds || seconds < 5) return 'just arrived';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export async function POST(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    const body = await request.json();
    const { event, sessionId, page, yachtsViewed, timeOnSite, referrer, isTest, leadData } = body;

    // Get geo from Vercel headers
    const countryCode = request.headers.get('x-vercel-ip-country') || '';
    const city = request.headers.get('x-vercel-ip-city') || '';
    const region = request.headers.get('x-vercel-ip-country-region') || '';
    const ua = request.headers.get('user-agent') || '';
    const device = getDevice(ua);
    const flag = countryFlag(countryCode);
    const country = countryName(countryCode);
    const testLabel = isTest ? '\u{1F9EA} *TEST* \u{1F9EA}\n\n' : '';

    // --- EVENT: New Visitor ---
    if (event === 'new_visit') {
      const source = referrer
        ? (referrer.includes('google') ? 'Google Search'
          : referrer.includes('instagram') ? 'Instagram'
          : referrer.includes('facebook') ? 'Facebook'
          : referrer.includes('linkedin') ? 'LinkedIn'
          : referrer.includes('tiktok') ? 'TikTok'
          : referrer.includes('youtube') ? 'YouTube'
          : new URL(referrer).hostname)
        : 'Direct';

      const msg = [
        testLabel + flag + flag + flag,
        '',
        `\u{1F464} *New Visitor on georgeyachts.com*`,
        '',
        `${flag} *Country:* ${country}${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} *Device:* ${device.type}`,
        `\u{1F517} *Source:* ${source}`,
        `\u{1F4C4} *Page:* ${page || '/'}`,
        '',
        `\u23F0 ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/Athens', hour: '2-digit', minute: '2-digit' })} Athens`,
      ].join('\n');

      // Write to CRM + Telegram in parallel
      await Promise.allSettled([
        sendTelegram(msg),
        writeToCRM('sessions', {
          session_id: sessionId,
          country: countryCode,
          city: city ? decodeURIComponent(city) : null,
          device_type: device.type,
          referrer: source,
          pages_visited: [page || '/'],
          yachts_viewed: [],
        }),
      ]);
    }

    // --- EVENT: Hot Lead Detected ---
    if (event === 'hot_lead') {
      const yachtList = (yachtsViewed || []).map(y => `  \u2022 ${y}`).join('\n');
      const msg = [
        testLabel + `\u{1F525}\u{1F525}\u{1F525} *HOT LEAD DETECTED!* \u{1F525}\u{1F525}\u{1F525}`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} ${device.type}`,
        `\u23F1 *Time on site:* ${formatDuration(timeOnSite)}`,
        '',
        `\u{1F6A2} *Yachts viewed:*`,
        yachtList,
        '',
        `\u{26A0}\uFE0F _This visitor is very interested!_`,
        `_Popup shown to capture their details._`,
      ].join('\n');

      const hotLeadDesc = `${country}${city ? ` (${decodeURIComponent(city)})` : ''} — ${formatDuration(timeOnSite)}${(yachtsViewed || []).length ? ` — viewed ${(yachtsViewed || []).join(', ')}` : ''}`;
      await Promise.allSettled([
        sendTelegram(msg),
        updateCRMSession(sessionId, {
          is_hot_lead: true,
          time_on_site: Math.round(timeOnSite || 0),
          yachts_viewed: yachtsViewed || [],
        }),
        writeToCRM('notifications', {
          type: 'hot_lead',
          title: `${flag} Hot lead from ${country}`,
          description: hotLeadDesc,
          link: '/dashboard/visitors',
        }),
      ]);
    }

    // --- EVENT: Lead Captured (form submitted from popup) ---
    if (event === 'lead_captured' && leadData) {
      const msg = [
        testLabel + `\u{1F389}\u{1F389}\u{1F389} *NEW LEAD CAPTURED!* \u{1F389}\u{1F389}\u{1F389}`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        '',
        `\u{1F464} *Name:* ${leadData.name || 'N/A'}`,
        `\u{1F4E7} *Email:* ${leadData.email || 'N/A'}`,
        `\u{1F4DE} *Phone:* ${leadData.phone || 'N/A'}`,
        '',
        `\u{1F6A2} *Yachts they viewed:*`,
        ...(yachtsViewed || []).map(y => `  \u2022 ${y}`),
        '',
        `\u23F1 *Time on site:* ${formatDuration(timeOnSite)}`,
        `${device.icon} ${device.type}`,
        '',
        `\u2705 _Auto-added to CRM!_`,
      ].join('\n');

      // CRM: Check if contact exists (merge) or create new
      const nameParts = (leadData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const existingContact = await findCRMContact(leadData.email);
      const hotStageId = await getHotStageId();

      if (existingContact) {
        // MERGE: update existing contact with website data
        const updateUrl = `${CRM_SUPABASE_URL}/rest/v1/contacts?id=eq.${existingContact.id}`;
        await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'apikey': CRM_SUPABASE_KEY,
            'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: leadData.phone || existingContact.phone,
            yachts_viewed: yachtsViewed || [],
            time_on_site: timeOnSite || 0,
            pipeline_stage_id: hotStageId || existingContact.pipeline_stage_id,
            last_activity_at: new Date().toISOString(),
          }),
        }).catch(() => {});

        // Log merge activity
        writeToCRM('activities', {
          contact_id: existingContact.id,
          type: 'lead_captured',
          description: `Website lead merged — viewed ${(yachtsViewed || []).join(', ')}`,
          metadata: { yachts_viewed: yachtsViewed, time_on_site: timeOnSite, source: 'website_popup' },
        }).catch(() => {});
      } else {
        // CREATE new contact
        const newContact = await writeToCRM('contacts', {
          first_name: firstName,
          last_name: lastName,
          email: leadData.email || null,
          phone: leadData.phone || null,
          country: countryCode || null,
          city: city ? decodeURIComponent(city) : null,
          source: 'website_lead',
          pipeline_stage_id: hotStageId,
          yachts_viewed: yachtsViewed || [],
          time_on_site: timeOnSite || 0,
        });

        if (newContact?.[0]?.id) {
          writeToCRM('activities', {
            contact_id: newContact[0].id,
            type: 'lead_captured',
            description: `Captured from website popup — ${country}, viewed ${(yachtsViewed || []).join(', ')}`,
            metadata: { yachts_viewed: yachtsViewed, time_on_site: timeOnSite, device: device.type, referrer },
          }).catch(() => {});
        }
      }

      // Flag the session row so the Visitors dashboard shows the 🎉 state
      // and the correct duration even if session_end never fires (popup-submit
      // visitors often leave without triggering beforeunload).
      await updateCRMSession(sessionId, {
        lead_captured: true,
        is_hot_lead: true,
        time_on_site: Math.round(timeOnSite || 0),
        yachts_viewed: yachtsViewed || [],
      });

      // In-app notification for the dashboard bell
      await writeToCRM('notifications', {
        type: 'lead',
        title: `🎉 New lead captured: ${leadData.name || leadData.email || 'Unknown'}`,
        description: `${country}${city ? ` (${decodeURIComponent(city)})` : ''} — ${leadData.email ?? ''}${(yachtsViewed || []).length ? ` — viewed ${(yachtsViewed || []).join(', ')}` : ''}`,
        link: '/dashboard/contacts',
      });

      await sendTelegram(msg);
    }

    // --- EVENT: Page View Update (aggregated) ---
    if (event === 'page_view') {
      // No Telegram — too noisy — but we DO persist the progress so the
      // Visitors dashboard can show real time_on_site + the full pages list.
      // Supabase has no array-append operator over REST, so we read the
      // current row, merge in memory, and PATCH it back.
      if (sessionId && CRM_SUPABASE_URL && CRM_SUPABASE_KEY) {
        try {
          const getRes = await fetch(
            `${CRM_SUPABASE_URL}/rest/v1/sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=pages_visited,yachts_viewed&limit=1`,
            {
              headers: {
                'apikey': CRM_SUPABASE_KEY,
                'Authorization': `Bearer ${CRM_SUPABASE_KEY}`,
              },
            }
          );
          const rows = getRes.ok ? await getRes.json() : [];
          const row = rows?.[0] || {};
          const existingPages = Array.isArray(row.pages_visited) ? row.pages_visited : [];
          const existingYachts = Array.isArray(row.yachts_viewed) ? row.yachts_viewed : [];
          const nextPages = page && !existingPages.includes(page)
            ? [...existingPages, page]
            : existingPages;
          const incomingYachts = Array.isArray(yachtsViewed) ? yachtsViewed : [];
          const nextYachts = incomingYachts.length
            ? Array.from(new Set([...existingYachts.map(String), ...incomingYachts.map(String)]))
            : existingYachts;

          await updateCRMSession(sessionId, {
            time_on_site: Math.round(timeOnSite || 0),
            pages_visited: nextPages,
            yachts_viewed: nextYachts,
          });
        } catch { /* best-effort */ }
      }
    }

    // --- EVENT: Session Summary (when visitor leaves) ---
    if (event === 'session_end') {
      const yachtList = (yachtsViewed || []).length > 0
        ? (yachtsViewed || []).map(y => `  \u2022 ${y}`).join('\n')
        : '  (none)';

      const msg = [
        testLabel + `\u{1F44B} *Visitor Left*`,
        '',
        `${flag} *${country}*${city ? ` (${decodeURIComponent(city)})` : ''}`,
        `${device.icon} ${device.type}`,
        `\u23F1 *Session:* ${formatDuration(timeOnSite)}`,
        `\u{1F4C4} *Pages:* ${body.pagesVisited || 1}`,
        '',
        `\u{1F6A2} *Yachts viewed:*`,
        yachtList,
      ].join('\n');

      // Persist the final duration + end timestamp + full pages/yachts list
      // so the Visitors dashboard matches what the Telegram bot just reported.
      await updateCRMSession(sessionId, {
        time_on_site: Math.round(timeOnSite || 0),
        ended_at: new Date().toISOString(),
        pages_visited: Array.isArray(body.pagesVisited)
          ? body.pagesVisited
          : undefined,
        yachts_viewed: yachtsViewed || [],
      });

      // Only send Telegram if they spent more than 30 seconds
      if (timeOnSite > 30) {
        await sendTelegram(msg);
      }
    }

    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error('Track API error:', error);
    return Response.json({ error: 'Internal error' }, { status: 500, headers });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    },
  });
}
