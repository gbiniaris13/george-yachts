// Proposed charter weeks, taken verbatim from The Helm.
//
// 2026-08-06. George asked for the itineraries he actually sends clients to be
// put on the site, "και να το κάνεις πολύ όμορφο". These are exactly that: the
// week-by-week routes written into real proposals in The Helm (gy-command,
// helm_requests.proposal_json.custom_weeks) over the past month, copied word
// for word. Nothing here is invented and nothing is embellished.
//
// Ten routes existed in the pipeline; five of them were the same week written
// for different clients, so the five below are the genuinely distinct ones:
// three Cycladic, two Saronic, each with a reason to exist that the others
// do not cover.
//
// PRIVACY: client names, dates, budgets and yacht selections stay in The Helm.
// What appears here is the route and George's own note for each leg, plus the
// shape of the party in general terms, because that is what makes a route
// legible to the next reader. No individual is identifiable.
//
// HONESTY: these are weeks PROPOSED, not weeks sailed. The page says so.
// The month is the month the week was written for; the year is deliberately
// left off so a real route does not read as expired next season.

export const PROPOSED_ITINERARIES = [
  {
    id: "saronic-family",
    title: "A Family Week in the Saronic",
    region: "Saronic",
    slugRegion: "saronic",
    month: "June",
    partyLine: "A family of eight, four adults and four children aged seven to fourteen",
    why: "The Saronic is the gentlest water in Greece and the shortest legs, which is exactly what a week with children needs.",
    stops: ["Athens", "Aegina", "Poros", "Hydra", "Spetses", "Dokos", "Agkistri"],
    days: [
      { day: 1, leg: "Athens → Aegina", note: "Board at noon and slip into the Saronic. A first swim off Moni islet, then Aegina's pistachio harbour by dusk." },
      { day: 2, leg: "Aegina → Poros", note: "Through the lemon groves to Poros. Calm bays for the children, ice cream on the waterfront at sunset." },
      { day: 3, leg: "Poros → Hydra", note: "On to car-free Hydra. Donkeys instead of traffic, and clear water off the rocks for the braver ones." },
      { day: 4, leg: "Hydra → Spetses", note: "Down to Spetses. Horse carriages, the little Bekiris sea cave, and soft sand at Agia Paraskevi." },
      { day: 5, leg: "Spetses → Dokos → Poros", note: "A quiet day at Dokos, snorkelling above an old wreck, seabobs for the kids, then back toward Poros." },
      { day: 6, leg: "Poros → Agkistri", note: "Turquoise shallows at Aponisos on Agkistri, the gentlest water of the week, made for small swimmers." },
      { day: 7, leg: "Agkistri → Athens", note: "A slow last swim and breakfast on deck, then an easy sail home to Athens by noon." },
    ],
  },
  {
    id: "cyclades-mykonos-paros",
    title: "Cyclades Mykonos & Paros",
    region: "Cyclades",
    slugRegion: "cyclades",
    month: "October",
    partyLine: "A group of ten",
    why: "The classic Cycladic loop with a full day held back for Mykonos, so the island gets a day rather than an afternoon.",
    stops: ["Athens", "Kea", "Syros", "Mykonos", "Paros", "Antiparos"],
    days: [
      { day: 1, leg: "Athens → Kea", note: "Late embarkation, a first swim off Kea as Athens falls away, then an easy dinner ashore to settle in." },
      { day: 2, leg: "Kea → Syros", note: "Across to Ermoupoli, the elegant Cycladic capital. Marble lanes, a grand harbour, your first dinner out." },
      { day: 3, leg: "Syros → Mykonos", note: "Into Mykonos by afternoon. Little Venice at sunset, then the first night out wherever the mood leads." },
      { day: 4, leg: "Mykonos → Mykonos", note: "A full day on Mykonos. Beach club by day, town by night, the evening the group will keep talking about." },
      { day: 5, leg: "Mykonos → Paros", note: "South to Naoussa, a fishing port turned quietly glamorous. Dinner among the boats in the old harbour." },
      { day: 6, leg: "Paros → Antiparos", note: "A slow day at Antiparos. Private coves, the Blue Lagoon swim, long lunch at anchor, the pace finally yours." },
      { day: 7, leg: "Antiparos → Athens", note: "An unhurried cruise home, one last swim in open water, coffee on deck as the Attic coast returns." },
    ],
  },
  {
    id: "cyclades-santorini-milos",
    title: "Mykonos, Paros & Santorini",
    region: "Cyclades",
    slugRegion: "cyclades",
    month: "October",
    partyLine: "A group of ten",
    why: "The southern loop. It is the only one of these weeks that reaches the Santorini caldera and comes home past Milos.",
    stops: ["Athens", "Syros", "Mykonos", "Paros", "Ios", "Santorini", "Milos"],
    days: [
      { day: 1, leg: "Athens → Syros", note: "A purposeful first run to Ermoupoli, arriving for dinner in the marble capital. The week starts early." },
      { day: 2, leg: "Syros → Mykonos", note: "A short hop to Mykonos. Little Venice at sunset and the first night out before the route turns south." },
      { day: 3, leg: "Mykonos → Paros", note: "Down to Paros with a swim stop on the way. Naoussa's old port by night, calmer glamour after Mykonos." },
      { day: 4, leg: "Paros → Ios", note: "Swim stops through the little islands, then Ios. Golden beaches by day, an easy, lively evening ashore." },
      { day: 5, leg: "Ios → Santorini", note: "Into the caldera. Anchor beneath the cliffs, the Oia sunset from the water, tender ashore for dinner." },
      { day: 6, leg: "Santorini → Milos", note: "West to Milos. The Kleftiko sea caves, lunar Sarakiniko, hidden coves you reach only by tender." },
      { day: 7, leg: "Milos → Athens", note: "The long, lazy leg home. A final swim in deep blue, then the mainland rising slowly off the bow." },
    ],
  },
  {
    id: "cyclades-quietly",
    title: "The Cyclades, Quietly",
    region: "Cyclades",
    slugRegion: "cyclades",
    month: "May",
    partyLine: "Six to eight guests",
    why: "The same islands in the shoulder month, anchored on the quiet sides. Written for guests who wanted the Cyclades without the season.",
    stops: ["Athens", "Kea", "Syros", "Mykonos", "Paros", "Antiparos", "Kythnos"],
    days: [
      { day: 1, leg: "Athens → Kea", note: "Board at midday and slip straight out of the city. Swim at Kolona, then dinner at anchor." },
      { day: 2, leg: "Kea → Syros", note: "Ermoupoli at dusk. Marble streets and neoclassical facades, a working town rather than a resort." },
      { day: 3, leg: "Syros → Mykonos", note: "Anchor on the quiet southern shore. The famous town is there if you want it, on your own terms." },
      { day: 4, leg: "Mykonos → Paros", note: "Naoussa harbour, small fishing tavernas around the old port, an easy evening ashore." },
      { day: 5, leg: "Paros → Antiparos", note: "Swim off Despotiko, an uninhabited islet with ancient ruins on the beach and nobody else there." },
      { day: 6, leg: "Antiparos → Kythnos", note: "The longest leg of the week, lunch under way. The sandbar at Kolona is usually yours alone." },
      { day: 7, leg: "Kythnos → Athens", note: "An unhurried morning and a last swim on the way in. Ashore after breakfast the following day." },
    ],
  },
  {
    id: "saronic-unhurried",
    title: "The Saronic, Unhurried",
    region: "Saronic",
    slugRegion: "saronic",
    month: "May",
    partyLine: "Six to eight guests",
    why: "The slowest week I write. Two nights of the seven have nothing scheduled at all beyond a swim and lunch on deck.",
    stops: ["Athens", "Aegina", "Poros", "Hydra", "Spetses", "Dokos"],
    days: [
      { day: 1, leg: "Athens → Aegina", note: "Board at midday and cross the gulf, swimming off Agistri before you reach the anchorage." },
      { day: 2, leg: "Aegina → Poros", note: "Pine forest running down to the water and a narrow channel to slip through. Quiet at anchor." },
      { day: 3, leg: "Poros → Hydra", note: "No cars on the island. Stone lanes, donkeys, and a harbour that has not changed in a century." },
      { day: 4, leg: "Hydra → Spetses", note: "Almond trees and old sea captains' houses. Dinner in the old harbour, a short walk from the boat." },
      { day: 5, leg: "Spetses → Dokos", note: "An empty bay, clear water, nobody ashore at all. The quietest night of your week." },
      { day: 6, leg: "Dokos → Poros", note: "A slow morning, a long swim, lunch cooked on deck. Nothing on the schedule but the water." },
      { day: 7, leg: "Poros → Athens", note: "A last swim below the temple at Cape Sounio. Ashore the following morning after breakfast." },
    ],
  },
];
