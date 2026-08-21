// Single source of truth for the fleet-size number used across marketing copy,
// meta descriptions, JSON-LD schema and the AI concierge script.
//
// The genuinely live surfaces - the homepage stat counter, the fleet cards,
// the charter ItemList `offerCount`, and llms.txt - already read the real
// published-yacht count from Sanity at build time and update on their own.
// This constant backs the prose that can't easily run a query (client
// components, static metadata, lib serializers) and is the fallback those
// dynamic surfaces use when Sanity is unreachable.
//
// Keep it equal to the published yacht count. It is a pure constant with no
// server imports, so it is safe to import from client components too.
//
// History: 63 -> 59 on 2026-06-29 after the 4 Kavas "Kos" yachts were
// unpublished from the Explorer Fleet.
//
// 59 -> 72 on 2026-08-19, and this correction is a day late. The seven
// award-winning yachts went in on 18/8 and six files carrying the number in
// hand-typed prose were updated with them. This constant was not, and it is
// the one that eighteen files import: the fleet page title and description,
// the homepage, llms.txt, the About counter, the service schema, the AI
// concierge. So for a day the site answered "59" to every visitor and every
// crawler while Sanity held 72, which is the opposite of the point of having
// a single source of truth. Verified against Sanity on the day of the change:
// count(*[_type == "yacht" && defined(slug.current)]) = 72.
export const FLEET_COUNT = 72;
