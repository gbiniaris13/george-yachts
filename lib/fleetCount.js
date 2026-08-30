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
// unpublished from the Catamaran Fleet.
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
//
// 72 -> 65 on 2026-08-21 (section 6): seven yachts withdrawn, each of them a
// bareboat hull with a skipper offered on top. They are still in Sanity, so
// count(*[_type == "yacht"]) run raw against the dataset still answers 72;
// what the site sees is 65, because lib/sanity.js excludes the retired set
// from every query. Verified against the running site rather than against
// the dataset, which is the number that matters here.
// 65 -> 59 on 2026-08-30 (the catamaran re-cut, George's call): the six
// S/Y monohulls left fleet BROWSING - every list, count, filter and menu -
// while their pages stay live for the rankings they hold. What a visitor
// or a crawler can browse is 59: 42 catamarans + 17 motor yachts. The
// monohull pages remain reachable and in the sitemap, but they are no
// longer counted as "the fleet" anywhere the number is printed.
// 59 -> 70 on 2026-08-30, hours later: eleven crewed motor yachts joined
// the Motor Yacht Fleet (George's expansion, published to Sanity the same
// evening). Verified against the live dataset at publish time.
export const FLEET_COUNT = 70;

// ── Η ΣΥΝΘΕΣΗ, και γιατί χρειάστηκε (2026-08-22) ──────────────────────────
//
// Το FLEET_COUNT από πάνω ενημερωνόταν σωστά. Η ΑΝΑΛΥΣΗ του όμως ζούσε
// χειρόγραφη σε τρία αρχεία, και όταν αποσύρθηκαν τα επτά σκάφη στις 21/8
// κανένα από τα τρία δεν ακολούθησε. Το αποτέλεσμα ήταν ότι το
// structured data, δηλαδή ακριβώς η πηγή που εμπιστεύεται μια μηχανή
// αναζήτησης και ένα AI, έλεγε στους crawlers:
//
//   "72 yachts placed personally: 17 motor yachts, 16 power catamarans,
//    33 sailing catamarans, 6 sailing monohulls"
//
// ενώ το llms.txt, που διαβάζουν οι ίδιες μηχανές, έλεγε 42 καταμαράν.
// Δύο διαφορετικές απαντήσεις στο ίδιο ερώτημα, από το ίδιο domain.
// Και ο τίτλος της σελίδας των καταμαράν έλεγε "37 Crewed Cats".
//
// Μετρημένο απευθείας από τον ζωντανό στόλο (/api/fleet) στις 22/8/2026,
// με το πρόθεμα ονόματος που είναι ο μόνος αξιόπιστος διαχωριστής:
//   S/CAT 27, P/CAT 15, M/Y 16, S/Y 6, Cruise Ship 1  =  65
// Το πεδίο type του Sanity ομαδοποιεί το πλοίο ELYSIUM στα Motor, οπότε
// τα 17 motor παρακάτω περιλαμβάνουν και εκείνο.
//
// Άθροισμα ελεγμένο: 17 + 15 + 27 + 6 = 65. Ο φύλακας
// scripts/checkFleetCount.mjs το επιβεβαιώνει σε κάθε build.
export const FLEET_COMPOSITION = {
  motor: 28,
  powerCat: 15,
  sailingCat: 27,
  // 2026-08-30: monohulls hidden from browsing; kept here at zero so the
  // breakdown sentence and schema stop mentioning them. Their pages live on.
  monohull: 0,
};

// 42. Ο αριθμός που ζητά η αγορά περισσότερο από κάθε άλλον στο site.
export const CATAMARAN_COUNT =
  FLEET_COMPOSITION.powerCat + FLEET_COMPOSITION.sailingCat;

// Η φράση, γραμμένη μία φορά. Όποιος τη θέλει, την εισάγει.
export const FLEET_BREAKDOWN_SENTENCE =
  `${FLEET_COUNT} yachts placed personally: ${CATAMARAN_COUNT} catamarans ` +
  `(${FLEET_COMPOSITION.sailingCat} sailing, ${FLEET_COMPOSITION.powerCat} power) and ` +
  `${FLEET_COMPOSITION.motor} motor yachts`;
