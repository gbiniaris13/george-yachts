// The official prices of the house, in one place (George, 7 October 2026).
//
// After the research of 7/10 found the site quoting four different catamaran
// floors and two meanings of "all in", George set the figures and the
// definition. Every page that states a floor, a ceiling or an all-in week
// says this, and nothing else:
//
//   crewed catamaran from EUR 17,000 a week base, about EUR 22,000 all in;
//   crewed motor yacht from EUR 17,500 base (about EUR 24,000 all in) to
//   EUR 235,000 base above 50 metres;
//   ALL IN = base fee + APA + Greek VAT at the yacht's certified rate.
//   The crew gratuity (10 to 15 percent of the base) is never inside "all
//   in": it is stated separately and is at the charterer's discretion.
//
// Multipliers that follow from the definition (APA 20 to 30 percent on a
// catamaran, 30 to 40 on a motor yacht; VAT 5.2 to 12 percent):
//   catamaran  about 1.25 to 1.4 times the base, before the gratuity
//   motor      about 1.35 to 1.5 times the base, before the gratuity
// Worked examples on the pages use the yacht's own APA and VAT and say
// "before the gratuity". The base figures come from the Greek Charter Index
// (lib/charterIndex2026.js); when the Index moves, this file moves with it.

export const CAT_FROM = 17000;
export const CAT_ALL_IN_ABOUT = 22000;
export const MOTOR_FROM = 17500;
export const MOTOR_ALL_IN_ABOUT = 24000;
export const BASE_CEILING = 235000;

export const ALL_IN_DEFINITION =
  "All in means the base fee plus the APA for fuel, food, drink and berths and Greek VAT at the yacht's certified rate; the crew gratuity of 10 to 15 percent of the base is separate and at your discretion.";

export const CAT_FLOOR_SENTENCE =
  "A fully crewed catamaran charter in Greece costs from EUR 17,000 a week for a 15 metre catamaran and her crew, about EUR 22,000 all in with APA and VAT.";
export const MOTOR_FLOOR_SENTENCE =
  "A fully crewed motor yacht charter in Greece costs from EUR 17,500 a week for a 20 metre yacht and her crew, about EUR 24,000 all in with APA and VAT, and rises to EUR 235,000 base for the yachts above 50 metres.";
