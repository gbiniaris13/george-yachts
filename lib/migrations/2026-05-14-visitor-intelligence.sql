-- =========================================================================
-- 2026-05-14 — Visitor Intelligence migration
-- =========================================================================
--
-- Single idempotent script. Safe to re-run. Adds the columns the new
-- /api/track route depends on. Run once in the Supabase SQL editor of
-- the gy-command project.
--
-- Companion code:
--   • george-yachts:lib/visitor-signals.js    (client-side collector)
--   • george-yachts:lib/ip-enrich.js          (server-side IP→company)
--   • george-yachts:lib/email-enrich.js       (server-side email→company)
--   • george-yachts:lib/premium-yachts.js     (Sanity-cached premium slugs)
--   • george-yachts:lib/hot-score.js          (composite scoring)
--   • george-yachts:lib/device-tier.js        (UA + DPR + cores → tier)
--   • george-yachts:app/components/VisitorTracker.jsx
--   • george-yachts:app/api/track/route.js
--
-- Notes:
--   • Every column add uses IF NOT EXISTS so running this twice is fine.
--   • Indexes added on hot_score, ip_company, utm_source (filterable cols).
--   • No data is mutated; everything is additive.
-- =========================================================================


-- -------- SESSIONS TABLE --------
ALTER TABLE sessions
  -- Geo (Vercel Edge headers)
  ADD COLUMN IF NOT EXISTS region          text,
  ADD COLUMN IF NOT EXISTS postal          text,
  ADD COLUMN IF NOT EXISTS lat             double precision,
  ADD COLUMN IF NOT EXISTS lng             double precision,
  ADD COLUMN IF NOT EXISTS timezone        text,
  -- Locale
  ADD COLUMN IF NOT EXISTS locale          text,
  ADD COLUMN IF NOT EXISTS languages       jsonb,
  -- Referrer + attribution
  ADD COLUMN IF NOT EXISTS referrer_url    text,
  ADD COLUMN IF NOT EXISTS utm_source      text,
  ADD COLUMN IF NOT EXISTS utm_medium      text,
  ADD COLUMN IF NOT EXISTS utm_campaign    text,
  ADD COLUMN IF NOT EXISTS utm_term        text,
  ADD COLUMN IF NOT EXISTS utm_content     text,
  ADD COLUMN IF NOT EXISTS gclid           text,
  ADD COLUMN IF NOT EXISTS fbclid          text,
  ADD COLUMN IF NOT EXISTS msclkid         text,
  ADD COLUMN IF NOT EXISTS li_fat_id       text,
  ADD COLUMN IF NOT EXISTS ttclid          text,
  -- Device tier signals
  ADD COLUMN IF NOT EXISTS device_tier     text,
  ADD COLUMN IF NOT EXISTS dpr             double precision,
  ADD COLUMN IF NOT EXISTS cores           integer,
  ADD COLUMN IF NOT EXISTS memory_gb       double precision,
  ADD COLUMN IF NOT EXISTS screen_w        integer,
  ADD COLUMN IF NOT EXISTS screen_h        integer,
  ADD COLUMN IF NOT EXISTS viewport_w      integer,
  ADD COLUMN IF NOT EXISTS viewport_h      integer,
  ADD COLUMN IF NOT EXISTS connection_type text,
  ADD COLUMN IF NOT EXISTS save_data       boolean,
  ADD COLUMN IF NOT EXISTS prefers_dark    boolean,
  ADD COLUMN IF NOT EXISTS prefers_reduced_motion boolean,
  ADD COLUMN IF NOT EXISTS touch_points    integer,
  ADD COLUMN IF NOT EXISTS os              text,
  ADD COLUMN IF NOT EXISTS os_version      text,
  ADD COLUMN IF NOT EXISTS browser         text,
  ADD COLUMN IF NOT EXISTS browser_version text,
  -- IP enrichment (IPinfo / ipapi)
  ADD COLUMN IF NOT EXISTS ip_company       text,
  ADD COLUMN IF NOT EXISTS ip_company_domain text,
  ADD COLUMN IF NOT EXISTS ip_asn           text,
  ADD COLUMN IF NOT EXISTS ip_asn_name      text,
  ADD COLUMN IF NOT EXISTS ip_is_vpn        boolean,
  ADD COLUMN IF NOT EXISTS ip_is_hosting    boolean,
  ADD COLUMN IF NOT EXISTS ip_is_tor        boolean,
  ADD COLUMN IF NOT EXISTS ip_enrich_source text,
  -- Scoring + behavioural
  ADD COLUMN IF NOT EXISTS hot_score        double precision,
  ADD COLUMN IF NOT EXISTS premium_yacht_views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cta_clicks       integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_cta         text,
  ADD COLUMN IF NOT EXISTS scroll_deep      boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS copy_events      integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS print_events     integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS active_seconds   integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hidden_seconds   integer DEFAULT 0,
  -- High-intent surface flags
  ADD COLUMN IF NOT EXISTS compare_used         boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cost_calc_used       boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS yacht_finder_used    boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pricing_calendar_used boolean DEFAULT false;


-- -------- CONTACTS TABLE (lead-time enrichment) --------
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS company           text,
  ADD COLUMN IF NOT EXISTS company_domain    text,
  ADD COLUMN IF NOT EXISTS company_size      text,
  ADD COLUMN IF NOT EXISTS company_industry  text,
  ADD COLUMN IF NOT EXISTS company_linkedin  text,
  ADD COLUMN IF NOT EXISTS job_title         text,
  ADD COLUMN IF NOT EXISTS person_linkedin   text,
  ADD COLUMN IF NOT EXISTS seniority         text,
  ADD COLUMN IF NOT EXISTS enrichment_source text;


-- -------- INDEXES (cheap to add, big for filtering) --------
CREATE INDEX IF NOT EXISTS idx_sessions_hot_score      ON sessions(hot_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_sessions_ip_company     ON sessions(ip_company);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_source     ON sessions(utm_source);
CREATE INDEX IF NOT EXISTS idx_sessions_utm_campaign   ON sessions(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_sessions_device_tier    ON sessions(device_tier);
CREATE INDEX IF NOT EXISTS idx_sessions_compare_used   ON sessions(compare_used) WHERE compare_used = true;
CREATE INDEX IF NOT EXISTS idx_sessions_country_region ON sessions(country, region);
CREATE INDEX IF NOT EXISTS idx_contacts_company        ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_company_domain ON contacts(company_domain);


-- -------- HELPFUL VIEW: top visitors today --------
CREATE OR REPLACE VIEW v_visitors_today AS
SELECT
  s.id,
  s.session_id,
  s.visitor_id,
  s.started_at,
  s.ended_at,
  s.time_on_site,
  s.active_seconds,
  s.is_return_visitor,
  s.country, s.region, s.city, s.postal,
  s.device_type, s.device_tier, s.os, s.browser, s.locale,
  s.ip_company, s.ip_asn_name, s.ip_is_vpn,
  s.referrer, s.utm_source, s.utm_campaign, s.gclid IS NOT NULL AS has_gclid,
  s.pages_visited,
  s.yachts_viewed,
  s.premium_yacht_views,
  s.compare_used, s.cost_calc_used, s.yacht_finder_used,
  s.cta_clicks, s.last_cta, s.scroll_deep, s.copy_events, s.print_events,
  s.hot_score,
  s.is_hot_lead,
  s.lead_captured,
  c.first_name, c.last_name, c.company AS lead_company, c.job_title
FROM sessions s
LEFT JOIN contacts c ON c.id = s.contact_id
WHERE s.started_at >= (CURRENT_DATE AT TIME ZONE 'UTC')
ORDER BY s.hot_score DESC NULLS LAST, s.started_at DESC;


-- =========================================================================
-- Done. The Vercel deploy is already live with the code that writes to
-- these columns. Until this migration runs in production, /api/track
-- falls back to the legacy column set (insertWithFallback in the route).
-- =========================================================================
