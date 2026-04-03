'use client';

// VisitorIntelligence — Wrapper that connects VisitorTracker + LeadCapturePopup
// Drop this one component into layout.jsx and everything works

import { useState, useCallback } from 'react';
import VisitorTracker from './VisitorTracker';
import LeadCapturePopup from './LeadCapturePopup';

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
    </>
  );
}
