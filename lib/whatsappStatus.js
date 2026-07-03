// TEMPORARY failover flag — 2026-07-03.
//
// The company WhatsApp (+1 786 798 8798) was placed under review by
// WhatsApp and is locked while the appeal runs. While DOWN, the main
// WhatsApp CTAs route guests to /inquiry instead of a line that
// cannot answer, so no customer writes into the void.
//
// WHEN THE ACCOUNT IS RESTORED: flip to false and push. One line.
export const WHATSAPP_DOWN = true;
