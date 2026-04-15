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

export default function VisitorIntelligence() {
  const [showPopup, setShowPopup] = useState(false);
  const [hotLeadData, setHotLeadData] = useState(null);

  const handleHotLead = useCallback((data) => {
    // Check if already captured
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('gy-lead-captured')) return;
    }
    setHotLeadData(data);
    setShowPopup(true);
  }, []);

  return (
    <>
      <VisitorTracker onHotLead={handleHotLead} />
      <LeadCapturePopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        hotLeadData={hotLeadData}
      />
      <HotLeadIGPopup />
    </>
  );
}
