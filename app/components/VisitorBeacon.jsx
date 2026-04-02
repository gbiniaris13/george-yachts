'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Fires once per session — pings /api/visitor-ping with page + referrer
// Also tracks yacht page views for hot lead detection (3+ yachts = alert)
export default function VisitorBeacon() {
  const pathname = usePathname();
  const pinged = useRef(false);

  // --- Hot Lead Tracking: fires on every yacht page view ---
  useEffect(() => {
    if (!pathname.startsWith('/yachts/')) return;

    const slug = pathname.replace('/yachts/', '').replace(/\/$/, '');
    if (!slug) return;

    const viewed = JSON.parse(sessionStorage.getItem('gy_yachts_viewed') || '[]');
    if (viewed.includes(slug)) return;

    viewed.push(slug);
    sessionStorage.setItem('gy_yachts_viewed', JSON.stringify(viewed));

    // Hot lead alert when 3+ unique yachts viewed (fire once)
    if (viewed.length >= 3 && !sessionStorage.getItem('gy_hot_lead_sent')) {
      sessionStorage.setItem('gy_hot_lead_sent', '1');
      fetch('/api/hot-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yachts: viewed }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  // --- Visitor Ping: fires once per session ---
  useEffect(() => {
    if (pinged.current || sessionStorage.getItem('gy_pinged')) return;
    pinged.current = true;
    sessionStorage.setItem('gy_pinged', '1');

    const timer = setTimeout(() => {
      const referrer = document.referrer
        ? (() => { try { return new URL(document.referrer).hostname; } catch { return 'Direct'; } })()
        : 'Direct';

      fetch('/api/visitor-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, referrer }),
        keepalive: true,
      }).catch(() => {});
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
