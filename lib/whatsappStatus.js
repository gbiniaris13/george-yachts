// WhatsApp routing - single source of truth. 2026-07-03.
//
// The company US WhatsApp (+1 786 798 8798) was placed under review by
// WhatsApp and is locked while the appeal runs. George's Greek WhatsApp
// Business (+30 697 038 0999) is confirmed WORKING, so every WhatsApp
// CTA on the site is LIVE and points at WHATSAPP_NUMBER below.
//
// WHEN THE US LINE IS RESTORED:
//   1. set WHATSAPP_NUMBER = "17867988798"
//   2. set WHATSAPP_US_LOCKED = false
// and push. The daily health check verifies both states automatically.
export const WHATSAPP_NUMBER = "306970380999";
export const WHATSAPP_US_LOCKED = true;

// True only if NO WhatsApp line is available at all (CTAs then route to
// /inquiry so no customer writes into a void). Not the case right now.
export const WHATSAPP_DOWN = false;
