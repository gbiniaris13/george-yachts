'use client';

// VisitorTracker — Real-time visitor tracking with Telegram alerts
// Tracks: pages, yachts viewed, time on site, device, source
// Triggers hot lead detection popup
//
// 2026-05-14 visitor-intelligence rollout — see the consultancy
// report in the conversation. This component now collects:
//   • Attribution (UTM, gclid, fbclid, msclkid, li_fat_id, ttclid…)
//   • Full referrer URL (verbatim, not just hostname)
//   • Browser locale (preferred + language[])
//   • Device tier signals (DPR, cores, memory, screen, viewport,
//     connection effective-type, touch points, preferences)
//   • Scroll-depth per page (25/50/75/90% marks)
//   • CTA clicks (Brief George, WhatsApp, Calendly, phone, email,
//     compare, cost-calc, yacht-finder, pricing-calendar)
//   • Tab-focus active vs hidden seconds
//   • Copy + print events (strong intent signals)
//
// The server side (/api/track) then enriches with:
//   • Vercel Edge geo (lat/lng/region/postal/timezone)
//   • IP → company / ASN / VPN flag (via IPinfo or ipapi fallback)
//   • Email → company enrichment on lead capture (Apollo / Hunter)
//   • Composite hot-lead score with explainable breakdown
//
// Every layer is graceful: if any signal is unavailable the rest
// continue to work. If any API key is missing, the corresponding
// enrichment silently no-ops.

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, collectClientSignals } from '@/lib/visitor-signals';

const SESSION_KEY = 'gy-tracker-session';
const YACHT_HISTORY_KEY = 'gy-view-history';
const HOT_LEAD_SHOWN_KEY = 'gy-hot-lead-shown';
const VISITOR_ID_KEY = 'gy-visitor-id'; // persistent across sessions for return-visitor detection

function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id =
        (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

// Hot lead client-side thresholds (server has the FINAL say via
// the weighted score — these are just early-fire triggers).
const HOT_LEAD_UNIQUE_YACHTS = 3;     // 3+ different yachts
const HOT_LEAD_SAME_YACHT = 3;         // same yacht 3x
const HOT_LEAD_TIME_SECONDS = 300;     // 5+ minutes on site

function getSession() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveSession(session) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

function getYachtHistory() {
  try {
    return JSON.parse(localStorage.getItem(YACHT_HISTORY_KEY) || '[]');
  } catch { return []; }
}

// Track a beacon to /api/track.
//
// 2026-05-14 cost-control — coalesce duplicate fires within
// COALESCE_MS so the rapid-fire combo at session-start
// (new_visit immediately followed by page_view from the pathname
// effect) doesn't double-bill us. session_end + hot_lead always
// fire — they're rare and important.
const COALESCE_MS = 5000;
let lastBeaconAt = 0;
let lastBeaconKey = '';
async function sendBeacon(data) {
  try {
    // Deduplicate noisy events. session_end / hot_lead / new_visit
    // are allowed through; only page_view + scroll_depth heartbeats coalesce.
    if (data?.event === 'page_view') {
      const key = `${data.event}:${data.sessionId}:${data.page}`;
      const now = Date.now();
      if (key === lastBeaconKey && now - lastBeaconAt < COALESCE_MS) {
        return; // skip — duplicate within coalesce window
      }
      lastBeaconAt = now;
      lastBeaconKey = key;
    }

    // Use navigator.sendBeacon for reliability on page unload
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      });
    }
  } catch (e) {
    console.error('Tracker beacon error:', e);
  }
}

// Match a path to a "high-intent surface" — these light up the
// scoring formula as boolean flags in the session row.
function classifyPath(pathname) {
  if (!pathname) return null;
  if (pathname.startsWith('/compare')) return 'compare';
  if (pathname.startsWith('/cost-calculator')) return 'cost_calc';
  if (pathname.startsWith('/tools/charter-cost-calculator')) return 'cost_calc';
  if (pathname.startsWith('/yacht-finder')) return 'yacht_finder';
  if (pathname.startsWith('/pricing-calendar')) return 'pricing_calendar';
  if (pathname.startsWith('/sailing-distance-calculator')) return 'distance_calc';
  if (pathname.startsWith('/itinerary-builder')) return 'itinerary_builder';
  if (pathname.startsWith('/inquiry')) return 'inquiry';
  if (pathname.startsWith('/yachts/')) return 'yacht_detail';
  if (pathname.startsWith('/blog/')) return 'blog_post';
  return null;
}

// Match a clicked element to a CTA kind. Returns null for non-CTA clicks.
function classifyCTA(el) {
  if (!el || el.nodeType !== 1) return null;
  const a = el.closest && el.closest('a, button');
  if (!a) return null;
  const href = a.getAttribute('href') || '';
  const txt = (a.textContent || '').trim().toLowerCase();
  const dataCta = a.getAttribute('data-cta');
  if (dataCta) return dataCta;
  if (href.startsWith('https://wa.me/') || href.includes('whatsapp.com/')) return 'whatsapp';
  if (href.startsWith('tel:')) return 'phone_call';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('calendly.com')) return 'calendly';
  if (href === '/inquiry' || href.startsWith('/inquiry?') || href.endsWith('#inquiry')) {
    return 'brief_george';
  }
  if (txt === 'brief george' || txt === 'start your charter') return 'brief_george';
  if (href.startsWith('/compare')) return 'compare_click';
  return null;
}

export default function VisitorTracker({ onHotLead }) {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const sessionRef = useRef(null);
  const hotLeadTriggeredRef = useRef(false);
  // Per-page scroll depth bookkeeping. Reset on pathname change.
  const scrollDepthRef = useRef({ path: null, max: 0, reported: new Set() });
  // Tab focus active/hidden seconds.
  const focusRef = useRef({
    active: 0, hidden: 0, lastTickAt: Date.now(), visible: true,
  });

  // Initialize session on mount
  useEffect(() => {
    let session = getSession();
    const isNew = !session;

    if (isNew) {
      // Capture attribution + client signals ONCE per session — same
      // payload travels with every subsequent beacon so the server
      // can correlate them with the right session row.
      const attribution = captureAttribution() || {};
      const clientSignals = collectClientSignals() || {};

      session = {
        id: Math.random().toString(36).substring(2, 10),
        startTime: Date.now(),
        pages: [],
        yachtsViewed: [],
        yachtViewCounts: {},  // { slug: count }
        referrer: document.referrer || '',
        attribution,
        clientSignals,
        // Session-level tallies for the hot-score formula.
        ctaClicks: 0,
        copyEvents: 0,
        printEvents: 0,
        scrollDeep: false,
        comparePageVisited: false,
        costCalcUsed: false,
        yachtFinderUsed: false,
        pricingCalendarUsed: false,
      };
      saveSession(session);

      // Send new visit notification — include the persistent visitor id
      // so the server can flag return visitors across sessions.
      sendBeacon({
        event: 'new_visit',
        sessionId: session.id,
        visitorId: getOrCreateVisitorId(),
        page: pathname,
        referrer: document.referrer || '',
        attribution,
        client: clientSignals,
        isTest: false,
      });
    }

    sessionRef.current = session;
    startTimeRef.current = session.startTime;
    hotLeadTriggeredRef.current = !!sessionStorage.getItem(HOT_LEAD_SHOWN_KEY);
  }, []);

  // Track page changes
  useEffect(() => {
    if (!sessionRef.current) return;

    const session = { ...sessionRef.current };

    // Add page to session
    if (!session.pages.includes(pathname)) {
      session.pages.push(pathname);
    }

    // High-intent surface classification — boolean flags fed into
    // hot-score on the server side.
    const intent = classifyPath(pathname);
    if (intent === 'compare') session.comparePageVisited = true;
    if (intent === 'cost_calc') session.costCalcUsed = true;
    if (intent === 'yacht_finder') session.yachtFinderUsed = true;
    if (intent === 'pricing_calendar') session.pricingCalendarUsed = true;

    // Check if this is a yacht page
    const yachtMatch = pathname.match(/^\/yachts\/(.+)/);
    if (yachtMatch) {
      const slug = yachtMatch[1];
      // Get yacht name from existing localStorage history
      const history = getYachtHistory();
      const yachtInfo = history.find(h => h.slug === slug);
      const yachtName = yachtInfo?.name || slug.replace(/-/g, ' ');

      // Track unique yachts
      if (!session.yachtsViewed.includes(yachtName)) {
        session.yachtsViewed.push(yachtName);
      }

      // Track view count per yacht
      session.yachtViewCounts[slug] = (session.yachtViewCounts[slug] || 0) + 1;
    }

    saveSession(session);
    sessionRef.current = session;

    // Reset per-page scroll depth bookkeeping on path change.
    scrollDepthRef.current = { path: pathname, max: 0, reported: new Set() };

    // Persist progress to the CRM session row so the Visitors dashboard
    // reflects the real time_on_site + pages list even if the visitor
    // leaves without firing beforeunload (common on mobile).
    const timeOnSite = Math.round((Date.now() - session.startTime) / 1000);
    sendBeacon({
      event: 'page_view',
      sessionId: session.id,
      page: pathname,
      yachtsViewed: session.yachtsViewed,
      yachtSlugs: Object.keys(session.yachtViewCounts || {}),
      timeOnSite,
      activeSeconds: Math.round(focusRef.current.active),
      hiddenSeconds: Math.round(focusRef.current.hidden),
      attribution: session.attribution,
      client: session.clientSignals,
      intentFlags: {
        compare: !!session.comparePageVisited,
        cost_calc: !!session.costCalcUsed,
        yacht_finder: !!session.yachtFinderUsed,
        pricing_calendar: !!session.pricingCalendarUsed,
      },
      tallies: {
        cta_clicks: session.ctaClicks || 0,
        copy_events: session.copyEvents || 0,
        print_events: session.printEvents || 0,
        scroll_deep: !!session.scrollDeep,
      },
      isTest: false,
    });

    // Check hot lead conditions
    checkHotLead(session);
  }, [pathname]);

  // Check hot lead thresholds (client-side gate — server still
  // computes the authoritative weighted score and may upgrade a
  // visitor based on signals the client never sees).
  const checkHotLead = useCallback((session) => {
    if (hotLeadTriggeredRef.current) return;
    if (sessionStorage.getItem(HOT_LEAD_SHOWN_KEY)) return;

    const uniqueYachts = session.yachtsViewed.length;
    const maxViewsOnSame = Math.max(0, ...Object.values(session.yachtViewCounts || {}));
    const timeOnSite = (Date.now() - session.startTime) / 1000;

    const isHot = (
      uniqueYachts >= HOT_LEAD_UNIQUE_YACHTS ||
      maxViewsOnSame >= HOT_LEAD_SAME_YACHT ||
      timeOnSite >= HOT_LEAD_TIME_SECONDS
    );

    if (isHot) {
      hotLeadTriggeredRef.current = true;
      sessionStorage.setItem(HOT_LEAD_SHOWN_KEY, 'true');

      // Notify Telegram
      sendBeacon({
        event: 'hot_lead',
        sessionId: session.id,
        yachtsViewed: session.yachtsViewed,
        yachtSlugs: Object.keys(session.yachtViewCounts || {}),
        timeOnSite: Math.round(timeOnSite),
        activeSeconds: Math.round(focusRef.current.active),
        hiddenSeconds: Math.round(focusRef.current.hidden),
        attribution: session.attribution,
        client: session.clientSignals,
        intentFlags: {
          compare: !!session.comparePageVisited,
          cost_calc: !!session.costCalcUsed,
          yacht_finder: !!session.yachtFinderUsed,
          pricing_calendar: !!session.pricingCalendarUsed,
        },
        tallies: {
          cta_clicks: session.ctaClicks || 0,
          copy_events: session.copyEvents || 0,
          print_events: session.printEvents || 0,
          scroll_deep: !!session.scrollDeep,
        },
        isTest: false,
      });

      // Trigger popup via callback
      if (onHotLead) {
        onHotLead({
          yachtsViewed: session.yachtsViewed,
          timeOnSite: Math.round(timeOnSite),
          pagesVisited: session.pages.length,
        });
      }
    }
  }, [onHotLead]);

  // Periodic hot lead check (for time-based trigger) + heartbeat ping.
  //
  // 2026-05-14 cost-control — pushed cadence 30s → 120s and gated on
  // user activity. Original 30s was burning ~$5/mo at modest concurrent
  // traffic and the data freshness benefit was negligible (session
  // time_on_site is also updated on every page navigation via the
  // pathname effect and on unload via beforeunload). The 2-min cadence
  // still lets us catch the 5-minute hot-lead time threshold in 2-3
  // beacons. We also skip the heartbeat entirely when the visitor has
  // been idle for >5 minutes (no input/scroll/mouse activity) so
  // background/forgotten tabs stop billing us.
  useEffect(() => {
    const HEARTBEAT_MS = 120_000;
    const IDLE_THRESHOLD_MS = 5 * 60_000;

    let lastActivityAt = Date.now();
    const bumpActivity = () => { lastActivityAt = Date.now(); };
    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'visibilitychange'];
    events.forEach((e) => window.addEventListener(e, bumpActivity, { passive: true }));

    const interval = setInterval(() => {
      const session = sessionRef.current;
      if (!session) return;

      // Skip when the tab is hidden or the user has been idle —
      // a forgotten background tab shouldn't keep pinging.
      if (typeof document !== 'undefined' && document.hidden) return;
      if (Date.now() - lastActivityAt > IDLE_THRESHOLD_MS) return;

      const timeOnSite = Math.round((Date.now() - session.startTime) / 1000);

      sendBeacon({
        event: 'page_view',
        sessionId: session.id,
        page: pathname,
        yachtsViewed: session.yachtsViewed,
        yachtSlugs: Object.keys(session.yachtViewCounts || {}),
        timeOnSite,
        activeSeconds: Math.round(focusRef.current.active),
        hiddenSeconds: Math.round(focusRef.current.hidden),
        attribution: session.attribution,
        client: session.clientSignals,
        intentFlags: {
          compare: !!session.comparePageVisited,
          cost_calc: !!session.costCalcUsed,
          yacht_finder: !!session.yachtFinderUsed,
          pricing_calendar: !!session.pricingCalendarUsed,
        },
        tallies: {
          cta_clicks: session.ctaClicks || 0,
          copy_events: session.copyEvents || 0,
          print_events: session.printEvents || 0,
          scroll_deep: !!session.scrollDeep,
        },
        isTest: false,
      });

      if (!hotLeadTriggeredRef.current) {
        checkHotLead(session);
      }
    }, HEARTBEAT_MS);

    return () => {
      clearInterval(interval);
      events.forEach((e) => window.removeEventListener(e, bumpActivity));
    };
  }, [checkHotLead, pathname]);

  // -------------------------------------------------------------
  // Scroll-depth observer — reports 25/50/75/90% milestones once
  // per page. Coalesced via the 5s page_view dedup so it doesn't
  // billion-fire on a long scroll.
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = null;
        const doc = document.documentElement;
        const total = Math.max(
          1,
          (doc?.scrollHeight || 1) - (window.innerHeight || 0),
        );
        const y = window.scrollY || doc?.scrollTop || 0;
        const pct = Math.min(100, Math.max(0, (y / total) * 100));
        const sd = scrollDepthRef.current;
        if (pct > sd.max) sd.max = pct;
        const milestones = [25, 50, 75, 90];
        for (const m of milestones) {
          if (sd.max >= m && !sd.reported.has(m)) {
            sd.reported.add(m);
            const session = sessionRef.current;
            if (!session) continue;
            if (m >= 90) {
              session.scrollDeep = true;
              sessionRef.current = session;
              saveSession(session);
            }
            sendBeacon({
              event: 'scroll_depth',
              sessionId: session.id,
              page: pathname,
              depth: m,
              isTest: false,
            });
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // -------------------------------------------------------------
  // CTA click listener — single delegated handler covers every
  // anchor / button on the page so individual components don't
  // each need their own onClick boilerplate.
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e) => {
      const session = sessionRef.current;
      if (!session) return;
      const cta = classifyCTA(e.target);
      if (!cta) return;
      session.ctaClicks = (session.ctaClicks || 0) + 1;
      sessionRef.current = session;
      saveSession(session);
      sendBeacon({
        event: 'cta_click',
        sessionId: session.id,
        page: pathname,
        cta,
        isTest: false,
      });
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [pathname]);

  // -------------------------------------------------------------
  // Tab focus accounting — separate active vs hidden seconds so
  // the dashboard distinguishes "8 minutes in front of the screen"
  // from "8 minutes with the tab parked behind 14 others".
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof document === 'undefined') return;
    focusRef.current.lastTickAt = Date.now();
    focusRef.current.visible = !document.hidden;
    const tick = () => {
      const now = Date.now();
      const elapsed = (now - focusRef.current.lastTickAt) / 1000;
      if (focusRef.current.visible) {
        focusRef.current.active += elapsed;
      } else {
        focusRef.current.hidden += elapsed;
      }
      focusRef.current.lastTickAt = now;
    };
    const onVisibility = () => {
      tick();
      focusRef.current.visible = !document.hidden;
    };
    const interval = setInterval(tick, 5000);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // -------------------------------------------------------------
  // Copy + print events — strong intent signals (someone copying
  // yacht specs / phone / email is preparing to act; someone
  // printing a page is generating a proposal artifact).
  // -------------------------------------------------------------
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onCopy = () => {
      const session = sessionRef.current;
      if (!session) return;
      session.copyEvents = (session.copyEvents || 0) + 1;
      sessionRef.current = session;
      saveSession(session);
      sendBeacon({
        event: 'copy_event',
        sessionId: session.id,
        page: pathname,
        isTest: false,
      });
    };
    const onPrint = () => {
      const session = sessionRef.current;
      if (!session) return;
      session.printEvents = (session.printEvents || 0) + 1;
      sessionRef.current = session;
      saveSession(session);
      sendBeacon({
        event: 'print_event',
        sessionId: session.id,
        page: pathname,
        isTest: false,
      });
    };
    document.addEventListener('copy', onCopy);
    window.addEventListener('beforeprint', onPrint);
    return () => {
      document.removeEventListener('copy', onCopy);
      window.removeEventListener('beforeprint', onPrint);
    };
  }, [pathname]);

  // Send session end on page unload
  useEffect(() => {
    const handleUnload = () => {
      const session = sessionRef.current;
      if (!session) return;
      const timeOnSite = Math.round((Date.now() - session.startTime) / 1000);

      sendBeacon({
        event: 'session_end',
        sessionId: session.id,
        yachtsViewed: session.yachtsViewed,
        yachtSlugs: Object.keys(session.yachtViewCounts || {}),
        timeOnSite,
        activeSeconds: Math.round(focusRef.current.active),
        hiddenSeconds: Math.round(focusRef.current.hidden),
        pagesVisited: session.pages.length,
        attribution: session.attribution,
        client: session.clientSignals,
        intentFlags: {
          compare: !!session.comparePageVisited,
          cost_calc: !!session.costCalcUsed,
          yacht_finder: !!session.yachtFinderUsed,
          pricing_calendar: !!session.pricingCalendarUsed,
        },
        tallies: {
          cta_clicks: session.ctaClicks || 0,
          copy_events: session.copyEvents || 0,
          print_events: session.printEvents || 0,
          scroll_deep: !!session.scrollDeep,
        },
        isTest: false,
      });
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // This component renders nothing — it's purely logic
  return null;
}

// Export utility for manually tracking yacht views from yacht page components
export function trackYachtPageView(name, slug) {
  try {
    // Update the gy-view-history in localStorage
    const history = JSON.parse(localStorage.getItem(YACHT_HISTORY_KEY) || '[]');
    const filtered = history.filter(h => h.slug !== slug);
    filtered.unshift({ name, slug, time: Date.now() });
    localStorage.setItem(YACHT_HISTORY_KEY, JSON.stringify(filtered.slice(0, 20)));

    // Update visit count
    const visits = parseInt(localStorage.getItem('gy-visit-count') || '0') + 1;
    localStorage.setItem('gy-visit-count', String(visits));
  } catch {}
}
