/* George Yachts — Web Push service worker.
 *
 * DELIBERATELY PUSH-ONLY. It registers handlers for exactly two
 * events: `push` (show the notification) and `notificationclick`
 * (open the linked page). It does NOT register a `fetch` handler and
 * does NOT cache anything — so it can never intercept, delay, or
 * break a page load. Worst case if it ever errors: notifications
 * silently don't show; the site itself is untouched.
 *
 * Served from /push-sw.js (public/). Registered by
 * app/components/PushOptIn.jsx only after the visitor opts in.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "George Yachts", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "George Yachts";
  const options = {
    body: data.body || "",
    icon: "/apple-icon.png",
    badge: "/icon.svg",
    tag: data.tag || "gy-push",
    data: { url: data.url || "https://georgeyachts.com" },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification?.data?.url || "https://georgeyachts.com";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if (w.url === target && "focus" in w) return w.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
