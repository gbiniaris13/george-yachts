// Tiny admin UI for bulk subscriber adds.
//
// Visit /admin/newsletter-add, type the admin key once (it stays in
// sessionStorage so it survives reloads but never goes to disk), then
// paste any list of emails (one per line, comma-separated, semicolon-
// separated — the page tokenises generously).
//
// On submit it POSTs to /api/admin/newsletter-add-subscribers and
// shows the per-email outcome. Telegram pings George with a summary.
//
// Robots-noindex'd. Not linked from anywhere.

import AdminAddClient from "./AdminAddClient";

export const metadata = {
  title: "Add subscribers · admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminAddClient />;
}
