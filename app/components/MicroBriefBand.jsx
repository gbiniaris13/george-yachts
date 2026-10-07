"use client";
// The sitewide strip of the three-field brief (George, 7/10/2026). Rendered
// by app/layout.jsx AFTER </main>, so it sits above the footer on every
// page without changing any page's content hash. It stays off the pages
// that carry their own brief: the homepage (the full form), the fleet (the
// inline one after the sixth card), the journal (the inline one after the
// quick answer), the Greek pages, and the private and legal routes.
import { usePathname } from "next/navigation";
import MicroBrief from "./MicroBrief";

const SKIP_EXACT = new Set(["/", "/charter-yacht-greece", "/contact", "/inquiry"]);
const SKIP_PREFIX = ["/blog/", "/el/", "/el", "/cabin", "/admin", "/api", "/privacy", "/terms", "/cookie-policy", "/accessibility", "/sign-in", "/checkout", "/unsubscribe"];

export default function MicroBriefBand() {
  const pathname = usePathname() || "/";
  if (SKIP_EXACT.has(pathname)) return null;
  if (SKIP_PREFIX.some((p) => pathname === p || pathname.startsWith(p))) return null;
  return <MicroBrief variant="band" context={pathname} />;
}
