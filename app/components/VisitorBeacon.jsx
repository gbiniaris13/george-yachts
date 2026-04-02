'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Fires once per session — pings /api/visitor-ping with page + referrer
// The API route reads x-vercel-ip-country (free) and sends Telegram notification
export default function VisitorBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    // Only ping once per session
    if (sessionStorage.getItem('gy_pinged')) return;
    sessionStorage.setItem('gy_pinged', '1');

    // Small delay so it doesn't compete with critical resources
    const timer = setTimeout(() => {
      const referrer = document.referrer
        ? new URL(document.referrer).hostname
        : 'Direct';

      fetch('/api/visitor-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, referrer }),
        keepalive: true,
      }).catch(() => {}); // Silent fail — never block UX
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
