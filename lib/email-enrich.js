// Email → company enrichment for the `lead_captured` event.
//
// Triggers ONLY after the visitor explicitly submitted a form with
// their email, so the privacy posture is clean (post-consent
// enrichment, covered under your existing legitimate-interest
// declaration for marketing analytics).
//
// Provider waterfall: Apollo (best free quota: 600/mo) → Hunter
// (25/mo) → null. Both are graceful no-ops if the matching env var
// is missing, so the feature ships dark until you sign up.
//
// Returns:
//   { company, company_domain, company_size, company_industry,
//     company_linkedin, job_title, person_linkedin, source }
// or null on every failure path.

function domainFromEmail(email) {
  if (!email || typeof email !== 'string') return null;
  const at = email.indexOf('@');
  if (at < 1) return null;
  const d = email.slice(at + 1).toLowerCase().trim();
  return d || null;
}

// Free-mail providers — never enrich, return null so we don't burn
// quota on a Gmail address.
const FREEMAIL = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com',
  'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'mac.com',
  'aol.com', 'protonmail.com', 'proton.me', 'pm.me', 'mail.com', 'gmx.com',
  'gmx.de', 'web.de', 't-online.de', 'yandex.ru', 'yandex.com', 'mail.ru',
  'qq.com', '163.com', '126.com', 'naver.com', 'daum.net',
]);

async function enrichWithApollo(email, domain) {
  const key = process.env.APOLLO_API_KEY;
  if (!key) return null;
  try {
    // Apollo "people enrichment" — single email lookup, free 600/mo.
    const res = await fetch('https://api.apollo.io/v1/people/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': key,
      },
      body: JSON.stringify({
        email,
        reveal_personal_emails: false,
        reveal_phone_number: false,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const p = j?.person;
    if (!p) return null;
    const org = p.organization || {};
    return {
      company: org.name || null,
      company_domain: org.primary_domain || domain || null,
      company_size:
        typeof org.estimated_num_employees === 'number'
          ? `${org.estimated_num_employees}`
          : org.size || null,
      company_industry: org.industry || null,
      company_linkedin: org.linkedin_url || null,
      job_title: p.title || null,
      person_linkedin: p.linkedin_url || null,
      seniority: p.seniority || null,
      source: 'apollo',
    };
  } catch {
    return null;
  }
}

async function enrichWithHunter(email, domain) {
  const key = process.env.HUNTER_API_KEY;
  if (!key || !domain) return null;
  try {
    // Hunter domain-search — gives org metadata without doxxing a
    // specific person. Free 25/mo.
    const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&limit=1&api_key=${key}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const data = j?.data;
    if (!data) return null;
    return {
      company: data.organization || null,
      company_domain: data.domain || domain,
      company_size: null, // Hunter doesn't give size in the free response
      company_industry: data.industry || null,
      company_linkedin: data.linkedin || null,
      job_title: null,
      person_linkedin: null,
      seniority: null,
      source: 'hunter',
    };
  } catch {
    return null;
  }
}

export async function enrichEmail(email) {
  const domain = domainFromEmail(email);
  if (!domain) return null;
  if (FREEMAIL.has(domain)) {
    return {
      company: null,
      company_domain: domain,
      company_size: null,
      company_industry: null,
      company_linkedin: null,
      job_title: null,
      person_linkedin: null,
      seniority: null,
      source: 'freemail',
      is_freemail: true,
    };
  }

  // Provider waterfall — try Apollo first (better data + quota),
  // fall back to Hunter, then null.
  const a = await enrichWithApollo(email, domain);
  if (a && a.company) return a;
  const h = await enrichWithHunter(email, domain);
  if (h) return h;

  // No provider succeeded — but we still know the domain.
  return {
    company: null,
    company_domain: domain,
    company_size: null,
    company_industry: null,
    company_linkedin: null,
    job_title: null,
    person_linkedin: null,
    seniority: null,
    source: 'domain_only',
  };
}
