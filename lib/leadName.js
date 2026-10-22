// 2026-10-22 (George): a lead with no name never reaches the Helm, the
// acknowledgment or George's phone as "Micro brief" or "Concierge card
// lead". The micro brief and the concierge card ask only for an email, so
// the name is read from the email the way a person would read it:
// enzo.burito@gmail.com is Enzo Burito. A handle that does not split into
// words (jsmith77) is kept as the handle for the card, and the
// acknowledgment then greets the guest without a name.

const PLACEHOLDER =
  /\b(micro|brief|concierge|card|lead|express|inquiry|enquiry|form|visitor|guest|test|unknown|website|anonymous)\b/i;

/** True for labels our own forms use when the guest gave no name. */
export function isPlaceholderName(name) {
  const n = String(name || "").trim();
  return !n || PLACEHOLDER.test(n);
}

/**
 * The name a person would read in the email's local part.
 * Returns { name, parts } or null when nothing sensible can be read.
 * "enzo.burito" -> "Enzo Burito" (2 parts); "jsmith77" -> "jsmith77" (1 part);
 * "info" / "x" / "noreply" -> null.
 */
export function nameFromEmail(email) {
  const local = String(email || "").trim().toLowerCase().split("@")[0] || "";
  if (!local) return null;
  const generic = /^(info|contact|hello|mail|admin|office|sales|noreply|no-reply|team|support|enquiries|inquiries|booking|reservations)$/;
  const tokens = local
    .split(/[._\-+]+/)
    .map((t) => t.replace(/\d+$/g, ""))
    .filter((t) => /^[a-z]{2,}$/.test(t));
  if (tokens.length >= 2 && !generic.test(tokens[0])) {
    const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
    return { name: tokens.slice(0, 3).map(cap).join(" "), parts: Math.min(tokens.length, 3) };
  }
  if (generic.test(local) || local.length < 3) return null;
  return { name: local, parts: 1 };
}

/** The name to put on the card and the greeting the acknowledgment may use. */
export function resolveLeadName(name, email) {
  if (!isPlaceholderName(name)) return { name: String(name).trim(), greetAs: String(name).trim() };
  const derived = nameFromEmail(email);
  if (!derived) return { name: "", greetAs: "" };
  return { name: derived.name, greetAs: derived.parts >= 2 ? derived.name : "" };
}
