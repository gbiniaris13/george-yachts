'use client';

// VisitorIntelligence — visitor tracker only.
//
// 2026-05-08 (Boss directive — pop-up audit):
//   • LeadCapturePopup ("Unlock Exclusive Pricing") — removed. The
//     "Unlock" copy reads as e-commerce, and a UHNW visitor on the
//     3rd yacht is at the most sensitive point of their decision —
//     that is the worst time to interrupt them.
//   • HotLeadIGPopup (Instagram capture on premium pages) — removed.
//     Asking a yacht-page visitor to follow @georgeyachts mid-read
//     destroys the editorial register the site is built around.
//
// VisitorTracker stays — it still fires the Telegram hot-lead alert
// to Boss + writes the analytics event regardless of any UI popup.
// Mounting it without the onHotLead callback simply skips the
// (now-deleted) popup wiring; the server-side alert path is
// unchanged.

import VisitorTracker from './VisitorTracker';

export default function VisitorIntelligence() {
  return <VisitorTracker />;
}
