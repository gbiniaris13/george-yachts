'use client';

// VisitorIntelligence — Wrapper that connects VisitorTracker with both
// popups:
//   1. LeadCapturePopup    — fires on hot-lead thresholds (3 yachts,
//                            same yacht 3x, 5+ min on site)
//   2. HotLeadIGPopup      — fires after 30s on premium pages,
//                            captures IG handle → webhook to GY Command
//                            → personalized ManyChat DM
//
// Drop this one component into layout.jsx and everything works.

import { useState, useCallback } from 'react';
import VisitorTracker from './VisitorTracker';
import LeadCapturePopup from './LeadCapturePopup';
import HotLeadIGPopup from './HotLeadIGPopup';
import {
  canShow,
  markActive,
  markInactive,
  markCaptured,
} from '@/lib/popup-coordinator';

export default function VisitorIntelligence() {
  const [showPopup, setShowPopup] = useState(false);
  const [hotLeadData, setHotLeadData] = useState(null);

  const handleHotLead = useCallback((data) => {
    // Already captured (any prior session, this device) → skip.
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('gy-lead-captured')) return;
    }
    // Coordinator gate — skip if another popup is open or we're
    // inside the cooldown window after one was already shown.
    if (!canShow()) return;
    markActive();
    setHotLeadData(data);
    setShowPopup(true);
  }, []);

  const handleClose = useCallback(() => {
    setShowPopup(false);
    markInactive();
  }, []);

  return (
    <>
      <VisitorTracker onHotLead={handleHotLead} />
      <LeadCapturePopup
        isOpen={showPopup}
        onClose={handleClose}
        onCaptured={markCaptured}
        hotLeadData={hotLeadData}
      />
      <HotLeadIGPopup />
    </>
  );
}
