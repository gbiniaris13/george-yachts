// lib/requiredContact.js
//
// 2026-11-02, George: on every form that sends him a request, the full name,
// the email and the phone are required; the visitor is told so before typing,
// and the form does not let the step be skipped. One rule, one file, so the
// twelve forms on the site cannot drift apart.
//
// Easy, but required:
//   - name: two characters or more (no "first and last" rule; a single name
//     still reaches George, a rejected one does not);
//   - email: the usual shape, something@domain.tld;
//   - phone: any way a person writes it (spaces, dashes, brackets, a leading
//     +), as long as it carries 7 to 18 digits. A US number with its +1 is 11.
//
// The servers do NOT reject a brief that arrives without a phone. A visitor on
// a page cached before this change must still reach George; the house rule is
// that forms never lose leads. The stop is in the browser, where the visitor
// can fix it in a second.

export const REQUIRED_NOTE =
  "Name, email and phone are required, so I can reply to you personally.";

export const REQUIRED_MESSAGES = {
  name: "Please enter your full name.",
  email: "Please enter a valid email address.",
  phone: "Please enter your phone or WhatsApp number, with the country code.",
};

// 2026-11-05 (form sweep): shown when a send did not reach George, in place
// of the thank-you several forms used to show regardless. The visitor keeps
// what they typed and gets the two direct lines.
export const WHATSAPP_URL = "https://wa.me/17867988798";
export const SEND_FAILED_MESSAGE =
  "Your message did not reach me. Please try once more, or write to me directly: WhatsApp +1 786 798 8798 or george@georgeyachts.com.";

// For <input pattern>: the whole value must hold 7 to 18 digits, anything
// else around them is allowed. Kept to syntax every browser compiles the same.
export const PHONE_PATTERN = "(?:\\D*\\d){7,18}\\D*";

export function phoneDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isValidName(value) {
  return String(value || "").trim().length >= 2;
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());
}

export function isValidPhone(value) {
  const n = phoneDigits(value).length;
  return n >= 7 && n <= 18;
}

// The first missing or malformed field, in the order the forms show them,
// as { field, message }; null when all three are fine.
export function firstContactError({ name, email, phone } = {}) {
  if (!isValidName(name)) return { field: "name", message: REQUIRED_MESSAGES.name };
  if (!isValidEmail(email)) return { field: "email", message: REQUIRED_MESSAGES.email };
  if (!isValidPhone(phone)) return { field: "phone", message: REQUIRED_MESSAGES.phone };
  return null;
}

// Attributes for a phone input that relies on the browser's own validation
// (the main brief walks its fields with checkValidity()). The custom message
// replaces the browser's "match the requested format", and is cleared on
// every keystroke so a corrected number is accepted at once.
export function phoneValidityHandlers() {
  return {
    onInvalid: (e) => e.currentTarget.setCustomValidity(REQUIRED_MESSAGES.phone),
    onInput: (e) => e.currentTarget.setCustomValidity(""),
  };
}

// Telegram (legacy Markdown) breaks on _ * ` [ ] inside a value and then
// drops the whole alert; the email still goes, but George's phone would not
// buzz. Values typed by visitors are passed through this before they enter a
// Telegram message.
export function telegramSafe(value, max = 120) {
  return String(value || "").replace(/[_*`[\]]/g, " ").slice(0, max).trim();
}

export function htmlSafe(value, max = 200) {
  return String(value || "")
    .slice(0, max)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
