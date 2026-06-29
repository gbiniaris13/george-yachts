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
export const FLEET_COUNT = 59;
