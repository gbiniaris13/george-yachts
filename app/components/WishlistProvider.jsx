'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext({ items: [], toggle: () => {}, has: () => false, count: 0, clear: () => {} });

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gy_wishlist');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('gy_wishlist', JSON.stringify(items));
    } catch {}
  }, [items]);

  const toggle = useCallback((yacht) => {
    setItems((prev) => {
      const exists = prev.find((y) => y.slug === yacht.slug);
      if (exists) {
        // N.1 — favorites_removed event
        try {
          window.gtag?.('event', 'favorites_removed', {
            yacht_slug: yacht.slug,
            count_after: prev.length - 1,
          });
        } catch {}
        return prev.filter((y) => y.slug !== yacht.slug);
      }
      const next = [...prev, {
        slug: yacht.slug,
        name: yacht.name || yacht.title,
        price: yacht.price || yacht.weeklyRatePrice,
        guests: yacht.guests || yacht.sleeps,
        builder: yacht.builder,
        addedAt: new Date().toISOString(),
      }];
      // N.1 (Roberto master rebuild brief) — favorites_added so the
      // K.1 auto-prompt funnel is measurable end-to-end.
      try {
        window.gtag?.('event', 'favorites_added', {
          yacht_slug: yacht.slug,
          yacht_name: yacht.name || yacht.title,
          count_after: next.length,
        });
      } catch {}
      return next;
    });
  }, []);

  const has = useCallback((slug) => items.some((y) => y.slug === slug), [items]);
  const clear = useCallback(() => setItems([]), []);

  return (
    <WishlistContext.Provider value={{ items, toggle, has, count: items.length, clear }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
