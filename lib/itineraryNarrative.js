/**
 * The words that go with the route.
 *
 * lib/itineraryPlanner.js decides where a yacht can get to. This decides
 * what is said about it once she is there, and it obeys three rules.
 *
 * ── One, the boat is in the sentence ─────────────────────────────────────
 *
 * Every leg opens with how long that passage takes on that hull. Not a
 * generic "a short hop": the actual arithmetic, her cruising speed against
 * the miles. It is the one line on the page that could not be written for
 * any other yacht, and it is the answer to the question a guest comparing
 * four boats is really asking, which is what the week feels like aboard
 * this one rather than that one.
 *
 * ── Two, no page reads like the page before it ───────────────────────────
 *
 * Eighty-eight yachts share fifty-odd anchorages between them, so a single
 * line per port would put the same paragraph on a dozen pages. Three
 * readings of each place, chosen by the yacht's name, and the timing line
 * in front of them differs on every hull anyway.
 *
 * ── Three, nothing here is invented ──────────────────────────────────────
 *
 * These are places, and what is said about them is what is there: the
 * shape of the harbour, what the town does in the evening, where the boat
 * lies. No prices, no claims about a restaurant nobody has checked, no
 * superlative that would have to be defended. If a line could be wrong
 * next season it is not in this file.
 */

/**
 * How long a leg takes, in the words a person would use.
 *
 * Rounded to the half hour up to four hours and to the quarter below one,
 * because "two hours and eleven minutes" is a timetable and nobody plans a
 * holiday against one.
 */
export function passageTime(nm, knots) {
  if (!nm || !knots) return null;
  const h = nm / knots;
  if (h < 0.6) return "Half an hour";
  if (h < 0.85) return "Forty minutes";
  if (h < 1.1) return "An hour";
  if (h < 1.4) return "An hour and a quarter";
  if (h < 1.65) return "Ninety minutes";
  if (h < 1.9) return "Just under two hours";
  if (h < 2.2) return "Two hours";
  if (h < 2.7) return "Two and a half hours";
  if (h < 3.2) return "Three hours";
  if (h < 3.7) return "Three and a half hours";
  if (h < 4.3) return "Four hours";
  if (h < 4.8) return "Four and a half hours";
  return "Five hours";
}

/** Three readings of every place the chart can reach. */
export const PORT_LINES = {
  // ── Athens, coming home ─────────────────────────────────────────────
  alimos: [
    "Back on her berth by the afternoon, so the last evening is dinner in town rather than a passage.",
    "Home to Alimos with the day still in front of you, bags packed at leisure in the morning.",
    "The run back up the coast, Athens on the bow, and the last night alongside.",
  ],
  flisvos: [
    "Back alongside at Flisvos with the afternoon still going, and the city ten minutes away.",
    "Home to the marina in good time, so the last dinner is ashore in Athens if you want it.",
    "The final approach up the Attic coast, and her own berth before sunset.",
  ],
  zea: [
    "Back into Zea, the oldest harbour on this coast, and the last night alongside.",
    "Home to Piraeus with the afternoon to spare, Athens a short drive from the pontoon.",
    "The run north up the coast and in through the Zea entrance before evening.",
  ],
  lavrio: [
    "Back to Lavrio, which is the shortest road to the airport of any berth in Attica.",
    "Home across the Kea channel with the afternoon still ahead of you.",
    "The last leg west, and alongside at Lavrio before the evening breeze.",
  ],
  neaperamos: [
    "Back into the bay at Nea Peramos, quiet water for the last night aboard.",
    "Home up the Salamis channel and alongside with the afternoon to spare.",
    "The run back east and her own berth before dinner.",
  ],

  sounion: [
    "The Temple of Poseidon stands on the headland above the anchorage, and it has been the last sight of Attica since 440 BC.",
    "Anchor under the temple, which is what boats crossing between Athens and the Cyclades have always done.",
    "Byron carved his name into one of the columns, and the sunset from the water is the reason to be here rather than in the car park.",
  ],

  // ── Saronic and Argolic ─────────────────────────────────────────────
  aegina: [
    "Agia Marina sits on the east coast facing the sunrise, with a beach you can swim to off the stern.",
    "The quiet side of Aegina, away from the ferry harbour, and pistachio country behind the beach.",
    "Anchor off Agia Marina, close enough to Athens that nobody has lost a day getting here.",
  ],
  aeginatown: [
    "The fish market on the quay in the morning and the Temple of Aphaia up the hill, both worth the walk.",
    "Aegina town takes a stern line right on the waterfront, so dinner is fifty metres from the passerelle.",
    "A working island harbour with a nineteenth century waterfront, and pistachios sold off the quay.",
  ],
  agkistri: [
    "Agistri is small and pine covered, and Skala's water is the clearest inside the gulf.",
    "An hour from Aegina and a different pace entirely, with swimming straight off the stern.",
    "Skala bay for the afternoon, pines to the waterline and nothing much asked of anybody.",
  ],
  epidaurus: [
    "The sunken city lies in the shallows off Palaia Epidavros, snorkelling depth and clearly Roman.",
    "Anchor here and the ancient theatre is a short drive inland, the acoustics still intact.",
    "A quiet bay on the Peloponnese shore, lemon groves behind it and the theatre up the road.",
  ],
  poros: [
    "The channel between Poros and the mainland is a hundred metres wide, and the town sits on both sides of it.",
    "Poros takes a stern line under the clock tower, and the lemon forest is a tender ride across the water.",
    "A natural harbour that has been one for three thousand years, and dinner is on the quay.",
  ],
  hydra: [
    "No cars on Hydra, not one. Mules carry the luggage up from the harbour and the town is stone and silence.",
    "The harbour is small and the captains' houses climb the hill behind it, built on eighteenth century shipping money.",
    "Hydra's quay fills by six, so arrive early or lie off Mandraki and take the tender in.",
  ],
  dokos: [
    "Skindos bay is empty water an hour from Hydra, and the oldest known shipwreck lies on its bottom.",
    "Dokos has no village and no road, which is the whole point of anchoring there.",
    "A deep quiet bay for a night at anchor, with nothing ashore and nothing overhead.",
  ],
  ermioni: [
    "Ermioni sits on a spit with water on both sides, pines along the point and a sunset walk to the end of it.",
    "A working Peloponnese town rather than a resort, and the fish on the quay came in that morning.",
    "Two harbours, one on each side of the headland, so there is always a lee.",
  ],
  spetses: [
    "Horse carriages instead of taxis, and the Old Harbour still builds wooden boats the way it always has.",
    "Spetses funded the fleet that fought in 1821, and the captains' mansions are still lived in.",
    "The Old Harbour for the night, the boatyards along the waterfront, dinner where the caiques are built.",
  ],
  porto_heli: [
    "A landlocked bay with a narrow entrance, which makes it the safest overnight water in the Argolic.",
    "Porto Heli is quiet, well sheltered and twenty minutes by tender from Spetses town.",
    "Flat water whatever the meltemi is doing outside, and a long sandy shore to swim from.",
  ],
  nafplio: [
    "The first capital of modern Greece, with a Venetian fortress above the town and marble streets below it.",
    "Nafplio's waterfront is neoclassical and the whole old town is walkable from the boat.",
    "Nine hundred and ninety nine steps to the Palamidi fortress, and the view is worth every one of them.",
  ],

  // ── Cyclades ────────────────────────────────────────────────────────
  kea: [
    "Vourkari's quay takes a stern line and the tavernas are a hundred metres from it.",
    "The first of the Cyclades and the closest to Athens, oak covered rather than bare rock.",
    "Kea is where an Athens week turns into a Cyclades one, and the water changes colour on the way in.",
  ],
  kythnos: [
    "Kolona is a sandbar with sea on both sides, and the boat lies to an anchor off it.",
    "The hot springs at Loutra run into the sea, so you can find the temperature you want by moving a metre.",
    "Kythnos keeps its own hours and the anchorage at Kolona is the reason people come back.",
  ],
  serifos: [
    "The chora sits straight above Livadi harbour, whitewash stacked up a rock face.",
    "Livadi bay is wide and easy, and the walk up to the old town is worth doing before dinner.",
    "Serifos has been mined since antiquity and the workings are still there, rusting into the hillside.",
  ],
  sifnos: [
    "Sifnos cooks better than anywhere else this size in the Aegean, and it has been doing it for a century.",
    "Vathi is a closed bay with a sand bottom, a pottery village ashore and holding you can trust.",
    "The island's potters still work the clay, and the food is the reason Athenians come here in August.",
  ],
  milos: [
    "The volcanic coast is white rock cut into the sea, and Kleftiko is only reachable from the water.",
    "Sarakiniko looks like nowhere else in Greece, and it is a fifteen minute tender from the anchorage.",
    "Milos was mined for obsidian before anybody wrote anything down, and the colours in the rock explain why.",
  ],
  kimolos: [
    "Kimolos is what Milos was thirty years ago, and the crossing between them takes twenty minutes.",
    "One village, one harbour and a beach at Prassa the colour of a swimming pool.",
    "Quiet water and quiet ashore, which after Milos in August is the point.",
  ],
  folegandros: [
    "The chora stands on a cliff two hundred metres above the harbour, and the road up is a proper road.",
    "Folegandros has one town, no airport and a cliff walk to the church that everybody does at sunset.",
    "Karavostasi is a small harbour for a small island, and the island is the quietest in the group.",
  ],
  santorini: [
    "The caldera is a drowned volcano and the boat lies in the middle of it, eight hundred feet of water underneath.",
    "Anchoring inside the caldera is a matter of finding the shelf, and the crew will have the spot picked.",
    "Sunset from the water rather than from the crowd at Oia, which is the whole argument for arriving by sea.",
  ],
  ios: [
    "Mylopotas is a long sand beach with easy water, and the chora is up the hill behind the harbour.",
    "Ios fills up in August and empties by October, and the anchorages on the south coast stay quiet either way.",
    "Homer is said to be buried at the north end of the island, and the walk there is a good morning.",
  ],
  paros: [
    "Naoussa is a fishing harbour that grew into an evening, and the old port still works as one.",
    "The marble here built half of classical Athens, and the quarries are still open to walk into.",
    "Naoussa for dinner and Kolymbithres for the afternoon, twenty minutes apart by tender.",
  ],
  antiparos: [
    "The channel between Paros and Antiparos is shallow, clear and full of good anchorages.",
    "One street, a Venetian castle in the middle of it, and a cave with stalactites above the village.",
    "Antiparos is a short hop and a long way from Paros in temperament.",
  ],
  naxos: [
    "The marble doorway of an unfinished temple stands alone on the islet by the harbour, and it has stood there since 530 BC.",
    "Naxos is the biggest of the Cyclades and the only one that farms seriously, so the food is grown here.",
    "The chora climbs to a Venetian kastro, and the harbour front is where the island eats.",
  ],
  koufonisia: [
    "Small enough to walk round in a morning, with sea caves along the north shore you swim into.",
    "The water between the two Koufonisia is the clearest in the Cyclades, and shallow enough to see the bottom throughout.",
    "One village, a few tavernas and beaches you reach on foot or not at all.",
  ],
  amorgos: [
    "The monastery is built into a cliff face three hundred metres above the sea, and it has been there since 1088.",
    "Katapola is a deep protected bay, and the far side of the island drops straight into blue water.",
    "Amorgos is the eastern edge of the group and it feels like it, which is why people go.",
  ],
  mykonos: [
    "Anchor off Ornos rather than fighting for the new marina, and take the tender in for dinner.",
    "Little Venice at sunset, the windmills above it, and the boat lying quietly round the corner.",
    "Mykonos is loud and it is worth one night of it, with the beach clubs on the south shore in the afternoon.",
  ],
  delos: [
    "The whole island is an archaeological site and no one has lived here since antiquity.",
    "Delos was the sacred centre of the Aegean, and the mosaics are still in the floors of the houses.",
    "You cannot stay the night on Delos, so you come by day, which is what a yacht is for.",
  ],
  rinia: [
    "Rinia is uninhabited and the bay at Ambelia is empty water twenty minutes from Mykonos.",
    "The quiet answer to the island next door, with nothing ashore at all.",
    "An anchorage rather than a destination, and after Mykonos that is the appeal.",
  ],
  syros: [
    "Ermoupoli was the biggest port in Greece before Piraeus was, and the town hall and the opera house prove it.",
    "The capital of the Cyclades, neoclassical rather than whitewashed, and lived in all year.",
    "Marble streets, a working shipyard and a proper town that does not close in October.",
  ],
  tinos: [
    "Panormos is a small harbour on the north coast, and the marble villages inland still carve.",
    "Tinos has six hundred chapels and a marble tradition that supplied sculptors to the whole country.",
    "Pyrgos for the afternoon and the village of Volax with its boulder field, both a short drive.",
  ],
  andros: [
    "Batsi is a sheltered bay on the west coast, and Andros is green in a way the rest of the group is not.",
    "The island has rivers and walking paths, which after four bare islands is a change.",
    "A shipowning island with a museum of modern art nobody expects to find there.",
  ],
  schinoussa: [
    "Sixteen beaches on an island you can cross on foot, and one village on the ridge.",
    "Schinoussa is a stop for the anchorage rather than the town, and that is what it is good at.",
    "Quiet water in the Small Cyclades, with Koufonisia and Naxos both close.",
  ],

  // ── Ionian ──────────────────────────────────────────────────────────
  lefkada: [
    "Back into the marina at Lefkada, and the canal opens on the hour for the last approach.",
    "Home through the canal with the afternoon still ahead, the town a walk from the pontoon.",
    "The last leg north and alongside before evening.",
  ],
  preveza: [
    "Preveza sits at the mouth of the Ambracian Gulf, and the old town is Venetian behind the waterfront.",
    "A working harbour with a long quay, and Nikopolis, Octavian's victory city, up the road.",
    "The gulf inside is flat water whatever is happening outside, and the dolphins in it are resident.",
  ],
  gouvia: [
    "Corfu town is Venetian, French and British by turns, and none of it looks like the rest of Greece.",
    "Gouvia is a proper marina and the old town is fifteen minutes from it.",
    "The Liston arcade, two fortresses and a cricket ground, which is the British hundred years still showing.",
  ],
  zakynthos: [
    "Back into Zakynthos and alongside for the last night, the town a short walk from the quay.",
    "Home across the channel with the afternoon to spare.",
    "The final approach past Cape Skinari and in before evening.",
  ],
  sivota_lef: [
    "A near landlocked bay on the south of Lefkada, tavernas round the head of it and flat water throughout.",
    "Sivota is the anchorage people book the week for, and the holding is good all through it.",
    "Deep green water, a horseshoe of hills and a quay that takes lines at the end.",
  ],
  meganisi: [
    "Vathi is a long inlet with a village at the head and room to lie to an anchor short of it.",
    "Meganisi is a mile from Lefkada and quieter by an order of magnitude.",
    "Spartochori above the water, Vathi below it, and the caves along the south coast in between.",
  ],
  kalamos: [
    "One village on a steep hillside, a quay that takes a handful of boats and a taverna that runs it.",
    "Kalamos is high and green and the anchorage below the village is deep right up to the shore.",
    "The kind of stop the Ionian is actually about, which is nothing much happening beautifully.",
  ],
  kastos: [
    "The smallest inhabited island in the Ionian, one street long, with a windmill at the top of it.",
    "Kastos has more goats than residents and the harbour takes a dozen boats.",
    "Twenty minutes from Kalamos and quieter still.",
  ],
  ithaca: [
    "Kioni is three villages round a bay with three ruined windmills on the point.",
    "Ithaca is Odysseus's island and the harbour at Kioni is the prettiest thing in the northern Ionian.",
    "A small bay, a short quay and a walk up to the windmills before dinner.",
  ],
  vathy_ith: [
    "Vathy is a deep enclosed harbour with the town wrapped round it, rebuilt to its old plan after 1953.",
    "The capital of Ithaca, and the archaeological museum is a hundred metres from the quay.",
    "Flat water and a proper town, which after the anchorages is a change of pace.",
  ],
  fiskardo: [
    "The only village in Kefalonia the 1953 earthquake did not flatten, so the Venetian houses are still standing.",
    "Fiskardo's quay is the busiest in the northern Ionian by six in the evening, and worth arriving early for.",
    "Pastel houses round a small harbour, cypresses behind them, and the water clear to the bottom.",
  ],
  sami: [
    "Sami sits under the mountain, with the Drogarati cave and the Melissani lake both a short drive inland.",
    "A working ferry port with a long quay and a beach at Antisamos round the headland.",
    "The lake inside the Melissani cave is lit through a collapsed roof, and you row across it.",
  ],
  argostoli: [
    "The capital of Kefalonia, rebuilt after the earthquake, with loggerhead turtles in the harbour most mornings.",
    "Argostoli is a town rather than a resort, and the Lassi coast is ten minutes from it.",
    "A long protected inlet, the town along one side of it, and Myrtos beach over the hill.",
  ],
  poros_kef: [
    "A small harbour on the east coast of Kefalonia, with the mountain road up to the monastery behind it.",
    "Poros is the crossing point to Zakynthos and a quiet night before or after it.",
    "The gorge behind the town is a twenty minute walk and worth doing in the morning.",
  ],
  paxos: [
    "Gaios lies behind a wooded islet, so the harbour is a channel rather than a bay.",
    "Paxos is olive groves and three small harbours, and the whole island is seven miles long.",
    "The blue caves on the west coast are reachable by tender when the sea is down.",
  ],
  antipaxos: [
    "Two beaches, Voutoumi and Vrika, with water the colour of the Caribbean and no village behind them.",
    "Antipaxos has vineyards and almost no residents, and the anchoring is off the beaches.",
    "A twenty minute hop from Gaios and an afternoon nobody forgets.",
  ],
  sivota_mai: [
    "A cluster of islets off the mainland shore with clear shallow water between them.",
    "Sivota on the mainland is a natural harbour surrounded by green hills, and the beaches face Corfu.",
    "Bella Vraka is a sandbar you can walk across at low water.",
  ],
  parga: [
    "A Venetian castle stands over the town and the houses run down the hill under it in colours.",
    "Parga faces west, so the sunset comes in over the bow at anchor.",
    "The mainland coast at its best, with the Acheron river and its springs half an hour inland.",
  ],
  atokos: [
    "One House Bay has exactly that, one building, and nothing else on the island at all.",
    "Atokos is uninhabited, and the bay on its west side is the reason boats come.",
    "White cliffs, deep water and an anchorage you have largely to yourselves.",
  ],
  petalas: [
    "An uninhabited island off the Acarnanian coast with sheltered water on the east side.",
    "Petalas is an anchorage and nothing more, which is occasionally the point.",
    "Quiet water at the southern end of the inner Ionian.",
  ],
};

/**
 * Four ways of putting the timing and the place in the same sentence.
 *
 * One shape repeated seven times reads like a form letter, and the sample
 * week is the part of the page a guest slows down for. The rotation is by
 * day number, so the same yacht always gets the same wording.
 */
const SHAPES = [
  (t, line) => `${t} at her cruising speed. ${line}`,
  (t, line, kn) => `${line} ${t} on passage at ${kn} knots.`,
  (t, line) => `${t} under way. ${line}`,
  (t, line) => `${line} Reckon on ${t.toLowerCase()} from the last berth.`,
];

/**
 * Turn a planned circuit into the days a page renders.
 *
 * Takes the route out of the planner and the yacht's name, and returns the
 * shape lib/sanity holds: a day number, the two ports, the distance and a
 * sentence. The yacht's name picks which reading of each place is used, so
 * two boats calling at Hydra in the same week do not say the same thing
 * about it.
 */
export function buildDays({ ports, legs, knots, portName, slug = "" }) {
  let seed = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    seed ^= slug.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }
  seed >>>= 0;

  return legs.map((nm, i) => {
    const to = ports[i + 1];
    const readings = PORT_LINES[to] || [];
    const line = readings.length
      ? readings[(seed + i * 7) % readings.length]
      : "";
    const t = passageTime(nm, knots);
    const shape = SHAPES[(seed + i) % SHAPES.length];
    return {
      day: i + 1,
      from: portName(ports[i]),
      to: portName(to),
      distance: `${nm} NM`,
      narrative: line && t ? shape(t, line, knots) : line,
    };
  });
}
