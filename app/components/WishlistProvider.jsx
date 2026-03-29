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
      if (exists) return prev.filter((y) => y.slug !== yacht.slug);
      return [...prev, {
        slug: yacht.slug,
        name: yacht.name || yacht.title,
        price: yacht.price || yacht.weeklyRatePrice,
        guests: yacht.guests || yacht.sleeps,
        builder: yacht.builder,
        addedAt: new Date().toISOString(),
      }];
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
