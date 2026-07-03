// WhatsApp routing - single source of truth. Updated 2026-07-03 (evening).
//
// George confirmed the WhatsApp Business account on the company US number
// (+1 786 798 8798) is working normally again after the review. Every
// WhatsApp CTA on the site points at WHATSAPP_NUMBER below.
//
// If the account is ever locked again:
//   1. set WHATSAPP_DOWN = true  (CTAs route to /inquiry - no customer
//      ever writes into a void)
//   2. push. The daily health check verifies the state automatically.
export const WHATSAPP_NUMBER = "17867988798";
export const WHATSAPP_US_LOCKED = false;
export const WHATSAPP_DOWN = false;
