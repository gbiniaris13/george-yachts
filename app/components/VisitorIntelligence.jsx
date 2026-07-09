"use client";

// VisitorIntelligence — mounts the tracker and, since 2026-07-09, the
// HotLeadConcierge card.
//
// History: the old LeadCapturePopup ("Unlock Exclusive Pricing") and
// HotLeadIGPopup were removed in 2026-05 because a modal at the most
// sensitive point of a UHNW decision kills the mood. The server-side
// Telegram alert kept firing regardless (and for a while it falsely
// claimed "popup shown" - fixed in the track route the same day this
// card shipped).
//
// The concierge card is the measured middle: non-blocking, dismissible,
// once per session, personalised to the yacht being read, with two
// honest paths (WhatsApp George / leave an email). No fake urgency.
import { useState } from "react";
import VisitorTracker from "./VisitorTracker";
import HotLeadConcierge from "./HotLeadConcierge";

export default function VisitorIntelligence() {
  const [hotSignal, setHotSignal] = useState(null);
  return (
    <>
      <VisitorTracker onHotLead={(payload) => setHotSignal(payload || {})} />
      <HotLeadConcierge signal={hotSignal} />
    </>
  );
}
