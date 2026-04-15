'use client';

// VisitorTracker — Real-time visitor tracking with Telegram alerts
// Tracks: pages, yachts viewed, time on site, device, source
// Triggers hot lead detection popup

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'gy-tracker-session';
const YACHT_HISTORY_KEY = 'gy-view-history';
const HOT_LEAD_SHOWN_KEY = 'gy-hot-lead-shown';

// Hot lead thresholds
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

// Track a beacon to /api/track
async function sendBeacon(data) {
  try {
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

export default function VisitorTracker({ onHotLead }) {
  const pathname = usePathname();
  const startTimeRef = useRef(Date.now());
  const sessionRef = useRef(null);
  const hotLeadTriggeredRef = useRef(false);

  // Initialize session on mount
  useEffect(() => {
    let session = getSession();
    const isNew = !session;

    if (isNew) {
      session = {
        id: Math.random().toString(36).substring(2, 10),
        startTime: Date.now(),
        pages: [],
        yachtsViewed: [],
        yachtViewCounts: {},  // { slug: count }
        referrer: document.referrer || '',
      };
      saveSession(session);

      // Send new visit notification
      sendBeacon({
        event: 'new_visit',
        sessionId: session.id,
        page: pathname,
        referrer: document.referrer || '',
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

    // Persist progress to the CRM session row so the Visitors dashboard
    // reflects the real time_on_site + pages list even if the visitor
    // leaves without firing beforeunload (common on mobile).
    const timeOnSite = Math.round((Date.now() - session.startTime) / 1000);
    sendBeacon({
      event: 'page_view',
      sessionId: session.id,
      page: pathname,
      yachtsViewed: session.yachtsViewed,
      timeOnSite,
      isTest: false,
    });

    // Check hot lead conditions
    checkHotLead(session);
  }, [pathname]);

  // Check hot lead thresholds
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
        timeOnSite: Math.round(timeOnSite),
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

  // Periodic hot lead check (for time-based trigger) + heartbeat ping
  // The heartbeat keeps sessions.time_on_site up-to-date even when the
  // visitor stays on one page the whole time (no pathname change to
  // piggyback on) and even if beforeunload never fires.
  useEffect(() => {
    const interval = setInterval(() => {
      const session = sessionRef.current;
      if (!session) return;

      const timeOnSite = Math.round((Date.now() - session.startTime) / 1000);

      sendBeacon({
        event: 'page_view',
        sessionId: session.id,
        page: pathname,
        yachtsViewed: session.yachtsViewed,
        timeOnSite,
        isTest: false,
      });

      if (!hotLeadTriggeredRef.current) {
        checkHotLead(session);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [checkHotLead, pathname]);

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
        timeOnSite,
        pagesVisited: session.pages.length,
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
