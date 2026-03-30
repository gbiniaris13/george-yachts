'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

const GOLD = '#DAA520';

const ISLANDS = [
  {
    id: 'mykonos',
    name: 'Mykonos',
    region: 'Cyclades',
    tagline: 'Where the world comes to play',
    emoji: '🎉',
    bestFor: 'Nightlife, beach clubs, cosmopolitan dining, celebrity spotting',
    bestMonths: 'June – September',
    anchorage: 'Ornos Bay (sheltered), Psarou (for show), Super Paradise (party)',
    restaurants: [
      { name: 'Nammos', type: 'Beach club dining', note: 'The original Mykonos beach restaurant. Book lunch early.' },
      { name: "Kiki's Taverna", type: 'Traditional Greek', note: 'No reservations, no phone. Arrive at 12:30 or wait. Worth every minute.' },
      { name: 'Scorpios', type: 'Bohemian-luxury', note: 'Sunset rituals, live music, organic Mediterranean. The anti-club club.' },
      { name: 'Remezzo', type: 'Fine dining', note: 'Harbour views, refined Greek cuisine. Old-school Mykonos glamour.' },
    ],
    hiddenGems: ['Fokos Beach — empty, wild, no sunbeds. The Mykonos locals keep for themselves.', 'Ano Mera village — monasteries and real tavernas, 10 minutes from the chaos.', 'Delos island — UNESCO site, birthplace of Apollo. Take the tender at dawn before the ferries arrive.'],
    yachtTip: 'Anchor at Ornos overnight for calm waters. Psarou is beautiful but exposed to the Meltemi. In July–August, secure your stern-to spot by 2pm or you won\'t get one.',
    yachts: ['la-pellegrina-1', 'genny', 'above-beyond'],
  },
  {
    id: 'santorini',
    name: 'Santorini',
    region: 'Cyclades',
    tagline: 'The caldera that stops time',
    emoji: '🌅',
    bestFor: 'Sunsets, wine tasting, romance, volcanic landscape, photography',
    bestMonths: 'May – October',
    anchorage: 'Inside the caldera (spectacular but deep — need good anchor), Vlychada (south, quieter)',
    restaurants: [
      { name: 'Selene', type: 'Fine dining', note: 'Santorini\'s most acclaimed restaurant. Local ingredients, volcanic terroir.' },
      { name: 'Ammoudi Fish Tavernas', type: 'Seafood', note: 'At the base of Oia\'s cliff. Walk down 300 steps. Fresh fish, sunset, perfection.' },
      { name: 'Metaxy Mas', type: 'Cretan-Greek', note: 'In Exo Gonia village. Locals\' favourite. Extraordinary value for the quality.' },
    ],
    hiddenGems: ['Red Beach at dawn — before the tour boats arrive, it\'s another world.', 'Santo Wines — wine tasting overlooking the caldera. Better than any rooftop bar.', 'Thirassia island — Santorini\'s forgotten twin. Take the tender for a half-day escape.'],
    yachtTip: 'Anchoring inside the caldera is unforgettable but requires experience — depths of 200m+ mean you need a lot of chain. Your captain will know the spots. Overnight inside the caldera = the most photographed view on the yacht.',
    yachts: ['ad-astra', 'sol-madinina', 'aloia'],
  },
  {
    id: 'hydra',
    name: 'Hydra',
    region: 'Saronic',
    tagline: 'The island that banned cars',
    emoji: '🎨',
    bestFor: 'Art, tranquility, walking, donkeys, Leonard Cohen heritage, architecture',
    bestMonths: 'April – October',
    anchorage: 'Harbour (stern-to, lively), Mandraki Bay (quiet, swimming), Vlychos (beach, calm)',
    restaurants: [
      { name: 'Omilos', type: 'Harbour fine dining', note: 'On the rocks at the harbour entrance. Seafood, cocktails, incredible setting.' },
      { name: 'Sunset', type: 'Harbour taverna', note: 'The name tells you everything. Book the waterfront table at golden hour.' },
      { name: 'Techne', type: 'Creative Greek', note: 'In a converted stone warehouse. The island\'s newest culinary gem.' },
    ],
    hiddenGems: ['Bisti Bay — only reachable by boat or a long hike. Crystal water, pine trees to the waterline, total silence.', 'The DESTE Foundation — Jeff Koons has exhibited here. Art on a car-free island.', 'Leonard Cohen\'s house — you can\'t go in, but standing outside it is a pilgrimage.'],
    yachtTip: 'Hydra harbour is stern-to Mediterranean style. In peak season, arrive by 3pm for a spot. The harbour at night — lit by the chandelier of restaurants and bars — is one of the most beautiful sights in Greek sailing.',
    yachts: ['gigreca', 'nadamas', 'helidoni'],
  },
  {
    id: 'paxos',
    name: 'Paxos',
    region: 'Ionian',
    tagline: 'The secret the Ionian keeps',
    emoji: '🌿',
    bestFor: 'Privacy, olive groves, turquoise water, slow pace, intimate dining',
    bestMonths: 'May – October',
    anchorage: 'Lakka (horseshoe bay, perfect shelter), Gaios (charming port), Mongonissi (south, calm)',
    restaurants: [
      { name: 'Vassilis', type: 'Waterfront taverna', note: 'Lakka harbour. Simple, honest, extraordinary fish. The octopus is legendary.' },
      { name: 'Taka Taka', type: 'Grill house', note: 'In Gaios. Locals queue for the souvlaki. No pretension, all flavour.' },
      { name: 'La Rosa di Paxos', type: 'Italian-Greek', note: 'Candlelit garden. The island\'s most romantic dinner.' },
    ],
    hiddenGems: ['Blue Caves (west coast) — sea caves that glow turquoise from within. Only accessible by tender.', 'Antipaxos — the tiny island to the south. Voutoumi Beach has the clearest water in Greece. Bar none.', 'The olive oil trail — 300,000 olive trees on an island of 2,500 people. The oil is extraordinary.'],
    yachtTip: 'Lakka is one of the most perfect natural harbours in the Mediterranean. You can anchor overnight in total calm and swim off the stern at dawn. Paxos is where charter guests say "I never want to leave."',
    yachts: ['kimata', 'serenissima', 'worlds-end'],
  },
  {
    id: 'milos',
    name: 'Milos',
    region: 'Cyclades',
    tagline: 'The island that paints with geology',
    emoji: '🌊',
    bestFor: 'Unique beaches, volcanic landscape, photography, off-beaten-path exploration',
    bestMonths: 'May – October',
    anchorage: 'Adamas (main port, sheltered), Kleftiko (legendary, day anchor only), Firopotamos (north, picturesque)',
    restaurants: [
      { name: 'O! Hamos!', type: 'Traditional taverna', note: 'In Adamas. Rustic, packed, delicious. The cheese saganaki catches fire at the table.' },
      { name: 'Medusa', type: 'Seafood', note: 'In Mandrakia fishing village. 6 tables. The freshest catch on the island.' },
      { name: 'Sirocco', type: 'Beach dining', note: 'Paleochori Beach. Food cooked using volcanic geothermal heat from the sand.' },
    ],
    hiddenGems: ['Sarakiniko — white volcanic moonscape that looks like you\'re on another planet. Swim at dawn.', 'Kleftiko — pirate caves only accessible by boat. Your yacht IS the ticket. Anchor and snorkel.', 'The catacombs — 2nd century AD Christian burial site. One of only 3 in the world.'],
    yachtTip: 'Kleftiko is the #1 must-see by yacht in the entire Cyclades. You cannot reach it by land. Anchor, swim into the caves, snorkel over crystal water. This alone justifies chartering a yacht in Greece.',
    yachts: ['odyssey', 'azul', 'explorion'],
  },
  {
    id: 'kefalonia',
    name: 'Kefalonia',
    region: 'Ionian',
    tagline: 'Where mountains meet wine-dark seas',
    emoji: '⛰️',
    bestFor: 'Wine, fine dining, dramatic scenery, Fiskardo elegance, Captain Corelli heritage',
    bestMonths: 'May – October',
    anchorage: 'Fiskardo (Venetian harbour, stern-to), Agia Efimia (quieter), Sami (ferry port, practical)',
    restaurants: [
      { name: 'Tassia', type: 'Legendary cooking', note: 'Captain Tassia\'s restaurant in Fiskardo. She\'s been cooking here for 40 years. Lobster pasta is the island\'s most famous dish.' },
      { name: 'Vasso\'s', type: 'Harbour seafood', note: 'Fiskardo waterfront. Fresh fish by the kilo. Watch the boats while you eat.' },
      { name: 'Ladokolla', type: 'Mountain taverna', note: 'In the hills above Argostoli. Meat-focused. The view alone is worth the drive.' },
    ],
    hiddenGems: ['Myrtos Beach — consistently rated one of the world\'s most beautiful. The turquoise is almost violent.', 'Melissani Cave — underground lake inside a collapsed cave. The light at noon is supernatural.', 'Robola wine trail — Kefalonia\'s indigenous grape. Visit the cooperative winery in the mountains.'],
    yachtTip: 'Fiskardo is the jewel of the Ionian for yacht guests. It\'s the only Kefalonian village that survived the 1953 earthquake, so the Venetian architecture is intact. Stern-to in the harbour, dinner at Tassia\'s — this is peak Ionian cruising.',
    yachts: ['crazy-horse', 'huayra', 'just-marie-2'],
  },
  {
    id: 'koufonisia',
    name: 'Koufonisia',
    region: 'Cyclades',
    tagline: 'The Caribbean of Greece',
    emoji: '🏝️',
    bestFor: 'Beaches, simplicity, barefoot luxury, stargazing, car-free life',
    bestMonths: 'June – September',
    anchorage: 'Main harbour (small, get there early), Pori Bay (north, open but stunning)',
    restaurants: [
      { name: 'Captain Nikolas', type: 'Harbourside', note: 'The island\'s oldest taverna. Fresh fish, cold beer, feet in the sand. Simple perfection.' },
      { name: 'Scholio', type: 'Greek', note: 'In the village. Home-cooked quality. The fava is exceptional.' },
    ],
    hiddenGems: ['Italida Beach — walk past Pori Beach and keep going. You\'ll find natural rock pools and absolute solitude.', 'Kato Koufonisi — the uninhabited sister island. Take the tender. One beach bar, zero development, pristine.', 'Night sky — zero light pollution. The Milky Way is visible with the naked eye. Sleep on deck.'],
    yachtTip: 'Koufonisia is tiny — the main island is 3.5km long. The magic is in anchoring off the beaches and spending the day in the water. No marina, no bow-to — you anchor and tender in. This is the Greek charter experience at its purest.',
    yachts: ['helidoni', 'alegria', 'my-star'],
  },
  {
    id: 'corfu',
    name: 'Corfu',
    region: 'Ionian',
    tagline: 'Where Venice meets the Ionian',
    emoji: '🏰',
    bestFor: 'UNESCO heritage, Venetian architecture, lush green landscapes, culture',
    bestMonths: 'May – October',
    anchorage: 'Gouvia Marina (main base), Paleokastritsa (dramatic cliffs), Kassiopi (northeast, charming)',
    restaurants: [
      { name: 'Etrusco', type: 'Fine dining', note: 'Michelin-quality in the hills. Chef Ettore Botrini — one of Greece\'s best. Book weeks ahead.' },
      { name: 'The Venetian Well', type: 'Mediterranean', note: 'In a hidden square in Corfu Town. Candlelit, romantic, unforgettable setting.' },
      { name: 'Taverna Agni', type: 'Seaside Greek', note: 'On the northeast coast. Arrive by tender. Fresh fish, feet in the pebbles.' },
    ],
    hiddenGems: ['Old Fortress at sunrise — before the tourists, the Venetian fortifications feel like your private castle.', 'Vidos Island — take the tender from the harbour. Quiet beaches, zero development, 10 minutes from town.', 'The Liston — Corfu\'s answer to the Rue de Rivoli. Evening coffee here feels like Paris in the Mediterranean.'],
    yachtTip: 'Corfu is the gateway to the entire Ionian. Start here, head south to Paxos and Antipaxos, then continue to Lefkada and Kefalonia. Gouvia Marina is well-equipped for provisioning. The northeast coast has the best swimming anchorages.',
    yachts: ['kimata', 'serenissima', 'alexandra-ii'],
  },
  {
    id: 'spetses',
    name: 'Spetses',
    region: 'Saronic',
    tagline: 'The French Riviera of Greece',
    emoji: '🐴',
    bestFor: 'Elegance, pine forests, horse-drawn carriages, Dapia harbour, old-money charm',
    bestMonths: 'May – October',
    anchorage: 'Old Harbour (atmospheric), Dapia (main port, stern-to), Zogeria Bay (north, sheltered swim spot)',
    restaurants: [
      { name: 'On The Verandah', type: 'Fine dining', note: 'At Poseidonion Grand Hotel. The island\'s most elegant dining. Harbour views, impeccable service.' },
      { name: 'Liotrivi', type: 'Traditional Greek', note: 'In a converted olive press. Stone walls, candlelight, slow-cooked meats. The definition of atmospheric.' },
      { name: 'Orloff', type: 'Mediterranean', note: 'In the Old Harbour. Refined but relaxed. The prawn saganaki and local wines are exceptional.' },
    ],
    hiddenGems: ['The coastal path — walk or jog the 25km loop around the entire island. Pine forests, hidden beaches, chapels, no cars.', 'Bekiri Cave — a sea cave accessible by tender. The water inside glows turquoise. Bring a waterproof torch.', 'Anargyrios College — the boarding school where John Fowles taught and was inspired to write The Magus.'],
    yachtTip: 'Spetses feels like a Greek island imagined by someone who grew up on the Côte d\'Azur. Horse-drawn carriages instead of cars, elegant mansions, pine-scented air. The Old Harbour is the most romantic anchorage in the Saronic — arrive before sunset, dine at the waterfront, and sleep to the sound of rigging.',
    yachts: ['gigreca', 'nadamas', 'helidoni'],
  },
  {
    id: 'aegina',
    name: 'Aegina',
    region: 'Saronic',
    tagline: 'The pistachio island',
    emoji: '🥜',
    bestFor: 'Temple of Aphaia, pistachios, quick Athens escape, authentic harbour life',
    bestMonths: 'Year-round (closest to Athens)',
    anchorage: 'Aegina Town harbour (lively, stern-to), Perdika (south, fish tavernas), Moni Island (uninhabited, swim)',
    restaurants: [
      { name: 'Kappos Etsi', type: 'Modern Greek', note: 'In a neoclassical building. Creative cocktails, elevated meze. Aegina\'s coolest table.' },
      { name: 'O Skotadis', type: 'Fish taverna', note: 'In Perdika village. Fresh catch from the boats moored right outside. Order the fried calamari.' },
      { name: 'Geladakis', type: 'Pistachio shop', note: 'Not a restaurant but essential. Fresh pistachio ice cream, pistachio butter, pistachio everything. The island\'s edible identity.' },
    ],
    hiddenGems: ['Temple of Aphaia — one of the three best-preserved Doric temples in Greece. The view across to Athens is extraordinary.', 'Moni Island — uninhabited island off Perdika. Take the tender. Peacocks, deer, crystal water, zero humans.', 'The fish market at dawn — watch the fishermen unload the catch. Buy sea urchins if you dare. Eaten raw with lemon.'],
    yachtTip: 'Aegina is just 17 nautical miles from Athens — the perfect first stop on a Saronic itinerary. Perdika on the south coast is quieter and has the best fish tavernas. From there, tender to Moni Island for an afternoon of total isolation. This island proves you don\'t need to sail far to escape.',
    yachts: ['helidoni', 'alegria', 'odyssey'],
  },
  {
    id: 'tinos',
    name: 'Tinos',
    region: 'Cyclades',
    tagline: 'The island the artists chose',
    emoji: '🎭',
    bestFor: 'Marble art villages, gastronomy, pilgrimage, dovecotes, artisan culture',
    bestMonths: 'May – October',
    anchorage: 'Tinos Town (main port), Kolymbithra (north, twin beaches, wilder), Panormos Bay (artists\' village)',
    restaurants: [
      { name: 'Marathia', type: 'Farm-to-table', note: 'Own organic farm in Falatados. The menu changes with the season. Possibly the most authentic meal in the Cyclades.' },
      { name: 'Thalassaki', type: 'Seafood', note: 'Tinos harbour. Simple, honest, the freshest fish you\'ll eat. Ask for the catch of the day — always.' },
      { name: 'To Koutouki tis Elenis', type: 'Traditional', note: 'In the mountain village of Triandaros. Home cooking by Eleni. No menu. You eat what she decided that morning.' },
    ],
    hiddenGems: ['Volax village — a surreal landscape of giant granite boulders surrounding a tiny basket-weaving village. Feels extraterrestrial.', 'The 1,000 dovecotes — Venetian-era stone structures scattered across the landscape. Each one architecturally unique. Instagram gold.', 'Panormos Bay — the artists\' village. Marble sculptors work in open workshops. Watch them carve, buy directly, drink raki with them.'],
    yachtTip: 'Tinos is Mykonos\'s quieter, more cultured neighbour — just 30 minutes by tender. The marble villages (Pyrgos, Panormos) are unlike anything else in the Cyclades. This is where Greek artists come for inspiration. Anchor at Panormos Bay for an evening of artisan culture that Mykonos can\'t match.',
    yachts: ['worlds-end', 'kimata', 'pixie'],
  },
  {
    id: 'folegandros',
    name: 'Folegandros',
    region: 'Cyclades',
    tagline: 'The edge of the Cyclades',
    emoji: '🌙',
    bestFor: 'Dramatic cliffs, authentic Hora, romance, escapism, untouched beauty',
    bestMonths: 'June – September',
    anchorage: 'Karavostasis (main port, limited), Agali Beach (anchor and swim), Livadaki (south, secluded)',
    restaurants: [
      { name: 'Pounta', type: 'Sunset dining', note: 'On the Hora cliff edge. The sunset from here — with a glass of Assyrtiko — is among the best in Greece.' },
      { name: 'Mimis', type: 'Traditional', note: 'In the Hora square. Unpretentious, home-cooked, exactly what you want after a day on the water.' },
      { name: 'Eva\'s Garden', type: 'Romantic', note: 'Candlelit garden. Mediterranean cuisine with Cycladic ingredients. The most romantic dinner on the island.' },
    ],
    hiddenGems: ['Hora at night — the whitewashed cliff-top village glows gold after dark. No neon, no loud bars. Just stone, light, and silence.', 'Church of Panagia — perched on the highest point of the island. The zigzag path up is Instagrammable. The view from the top is spiritual.', 'Katergo Beach — accessible only by boat (your tender). Dramatic cliffs, turquoise water, rarely more than 20 people.'],
    yachtTip: 'Folegandros is what Santorini was 30 years ago — the cliffs, the whitewashed Hora, the drama — but without the cruise ships and the queues. Anchor at Karavostasis, tender to Katergo Beach in the morning, hike up to Hora for sunset dinner. This is the Cyclades for people who\'ve already done Mykonos and want something real.',
    yachts: ['azul', 'sahana', 'odyssey'],
  },
  {
    id: 'paros',
    name: 'Paros',
    region: 'Cyclades',
    tagline: 'The Cyclades in perfect balance',
    emoji: '⛪',
    bestFor: 'Naoussa harbour, marble streets, windsurfing, balance of beauty and authenticity',
    bestMonths: 'May – October',
    anchorage: 'Naoussa (charming harbour, stern-to), Parikia (main port), Santa Maria (north, sheltered beach)',
    restaurants: [
      { name: 'Mario', type: 'Seafood', note: 'On the Naoussa harbour. The lobster spaghetti is the island\'s signature dish. Reserve at sunset.' },
      { name: 'Siparos', type: 'Farm-to-table', note: 'Own farm on the island. Mediterranean with Asian touches. The tasting menu is extraordinary.' },
      { name: 'Levantis', type: 'Fine dining', note: 'In Parikia Old Town. Asian-Greek fusion. One of the most creative menus in the Cyclades.' },
    ],
    hiddenGems: ['Kolymbithres — naturally sculpted granite rock formations creating tiny coves. Like swimming in a Henry Moore sculpture.', 'Antiparos cave — stalactites 45 million years old. Lord Byron carved his name in 1810.', 'Lefkes village — hilltop marble village connected by a Byzantine marble path. The walk takes 40 minutes and rewards you with silence.'],
    yachtTip: 'Paros is the geographic centre of the Cyclades, making it the perfect hub for island-hopping. Naoussa harbour is stern-to and fills up fast in high season — arrive by 2pm. From Paros, everything is within day-sail distance: Naxos, Antiparos, Mykonos, Sifnos.',
    yachts: ['worlds-end', 'kimata', 'pixie'],
  },
  {
    id: 'naxos',
    name: 'Naxos',
    region: 'Cyclades',
    tagline: 'The most generous island in Greece',
    emoji: '🌾',
    bestFor: 'Local cuisine, long sandy beaches, Portara, farming villages, family-friendly',
    bestMonths: 'May – October',
    anchorage: 'Naxos Town (near Portara), Koufonisia (day trip), Moutsouna (east coast, empty)',
    restaurants: [
      { name: 'Axiotissa', type: 'Beach taverna', note: 'Agia Anna area. Feet in the sand, fresh fish, cold Naxos wine. The Cycladic dream, unfiltered.' },
      { name: 'To Elliniko', type: 'Traditional', note: 'In Naxos Town. Naxos cheese, potatoes, meats — everything local. The cheese pie is legendary.' },
      { name: 'Meze2', type: 'Modern Greek', note: 'Creative small plates, Naxos ingredients. The young chef is doing remarkable things.' },
    ],
    hiddenGems: ['Portara at dawn — the massive marble gate of the unfinished Temple of Apollo. Climb it at sunrise before anyone else.', 'Halki village — the old capital. Kitron liqueur distillery, Venetian towers, abandoned mansions coming back to life.', 'Plaka Beach — 4km of uninterrupted sand. Walk south far enough and you\'ll have it to yourself.'],
    yachtTip: 'Naxos has the best local food of any Cycladic island — cheese, potatoes, meats, all produced on the island. The west coast beaches (Agios Prokopios, Agia Anna, Plaka) are family-perfect with shallow, warm water. Don\'t skip the Portara — anchor nearby and tender to the Temple of Apollo at sunset.',
    yachts: ['azul', 'sahana', 'summer-star'],
  },
  {
    id: 'zakynthos',
    name: 'Zakynthos',
    region: 'Ionian',
    tagline: 'Where the shipwreck became an icon',
    emoji: '🐢',
    bestFor: 'Navagio Beach, sea turtles, Blue Caves, dramatic cliffs, Instagram moments',
    bestMonths: 'May – October',
    anchorage: 'Laganas Bay (turtle territory — approach carefully), Navagio (anchor and swim), Porto Vromi',
    restaurants: [
      { name: 'Lofos', type: 'Hilltop dining', note: 'Panoramic views over the island. Grilled meats, local wine, sunset that doesn\'t quit.' },
      { name: 'Prosilio', type: 'Creative Greek', note: 'Farm-to-fork philosophy. The octopus and fava are extraordinary.' },
      { name: 'Porto Limnionas', type: 'Cliff taverna', note: 'Built into the rocks on the west coast. Swim in the cove, climb back up, eat fish. Repeat.' },
    ],
    hiddenGems: ['Navagio Beach from the water — the shipwreck beach is only reachable by boat. Your yacht gives you the VIP entrance.', 'Blue Caves at dawn — take the tender into the caves when the light hits the water. The blue is supernatural.', 'Marathonisi (Turtle Island) — the turtle nesting beach. Swim alongside loggerheads. Respectfully, at a distance.'],
    yachtTip: 'Navagio Bay is one of the most photographed places on Earth — and the only way to reach the beach is by water. Anchor outside the cove, tender in. Go early morning or late afternoon to avoid the tour boats. The Blue Caves to the north are equally stunning by tender.',
    yachts: ['libra', 'summer-star', 'helidoni'],
  },
  {
    id: 'skopelos',
    name: 'Skopelos',
    region: 'Sporades',
    tagline: 'The Mamma Mia island',
    emoji: '🎬',
    bestFor: 'Mamma Mia filming locations, stone villages, bougainvillea, cheese pies, nature',
    bestMonths: 'June – September',
    anchorage: 'Skopelos Town (harbour, lively), Panormos Bay (west coast, pine-sheltered), Agnondas (south, quiet)',
    restaurants: [
      { name: 'Perivoli', type: 'Garden dining', note: 'In a walled garden in Skopelos Town. Home-made pasta, local cheese, island wine. Magical setting.' },
      { name: 'Pavlos', type: 'Harbour taverna', note: 'Right on the waterfront. Fresh fish, slow pace. The grilled octopus is textbook.' },
      { name: 'Finikas', type: 'Traditional', note: 'In Stafylos. Stone terrace under pine trees. The cheese pies — maybe the best in all of Greece.' },
    ],
    hiddenGems: ['Agios Ioannis chapel — THE Mamma Mia wedding scene. 110 steps up the cliff. The view from the top is worth every step.', 'Velanio Beach — the island\'s most secluded beach. Past Stafylos Beach, through the rocks. Naturist-friendly, crystal water.', 'The plum orchards — Skopelos produces 95% of Greece\'s plums. Visit in August when the damson harvest begins.'],
    yachtTip: 'Skopelos is greener than the Cyclades — pine forests reach the waterline. Panormos Bay on the west coast is the perfect overnight anchorage: calm, sheltered by pine trees, with a handful of tavernas and nothing else. For the Mamma Mia chapel, tender to Glysteri and hike up.',
    yachts: ['worlds-end', 'libra', 'summer-star'],
  },
  {
    id: 'sifnos',
    name: 'Sifnos',
    region: 'Cyclades',
    tagline: 'Greece\'s culinary island',
    emoji: '🍳',
    bestFor: 'Gastronomy, pottery, hiking trails, authentic Cycladic life, slow travel',
    bestMonths: 'May – October',
    anchorage: 'Kamares (main port, sheltered), Vathi (south, beautiful bay with tavernas), Platis Gialos (beach)',
    restaurants: [
      { name: 'Omega3', type: 'Seafood', note: 'In Platis Gialos. Chef Yiannis sources everything from local fishermen. The sea urchin risotto is unforgettable.' },
      { name: 'Tsikali', type: 'Traditional Sifnian', note: 'In Artemonas. The mastelo (lamb slow-cooked in red wine in a clay pot) is Sifnos\' signature dish.' },
      { name: 'Cantina', type: 'Wine bar', note: 'Apollonia main square. Local wines, meze, people-watching. The island\'s living room after dark.' },
    ],
    hiddenGems: ['Kastro — the ancient capital perched on a cliff. Venetian walls, narrow alleys, views to Paros. Barely any tourists reach it.', 'Nikolaos Tselementes — the father of Greek gastronomy was from Sifnos. The island\'s culinary DNA runs deep.', 'The pottery trail — Sifnos has been making ceramics for 5,000 years. Visit the workshops in Vathi and Kamares.'],
    yachtTip: 'Vathi on the south coast is one of the Cyclades\' best-kept secrets for yacht guests. A perfect horseshoe bay with a handful of tavernas, pottery workshops, and absolute calm. Anchor for the night, eat at the waterfront, walk the old monastery path at sunset.',
    yachts: ['odyssey', 'azul', 'sahana'],
  },
  {
    id: 'lefkada',
    name: 'Lefkada',
    region: 'Ionian',
    tagline: 'White cliffs, turquoise dreams',
    emoji: '🏖️',
    bestFor: 'Porto Katsiki, dramatic beaches, windsurfing, gentle Ionian waters',
    bestMonths: 'May – October',
    anchorage: 'Nydri (main yacht harbour), Sivota Bay (sheltered, calm), Meganisi (day trip)',
    restaurants: [
      { name: 'Basilico', type: 'Italian-Greek', note: 'In Nydri. Harbour-view tables. The pasta with local lobster is extraordinary.' },
      { name: 'Tropicana', type: 'Beach taverna', note: 'In Meganisi (by tender). Fresh fish, warm hospitality, absolute isolation.' },
      { name: 'T\' Agnantio', type: 'Hilltop', note: 'Mountain village views. Traditional Lefkadian cuisine. The slow-roasted lamb melts.' },
    ],
    hiddenGems: ['Porto Katsiki — one of the top 3 beaches in Greece. Dramatic white cliffs plunging into turquoise. Accessible by yacht = no crowds.', 'Meganisi — the "secret island" with 3 villages, zero tourist buses. The clearest water in the Ionian.', 'Dimosari Waterfalls — a refreshing hike inland. Swimming under a waterfall after a morning at sea.'],
    yachtTip: 'Lefkada\'s east coast (Nydri, Sivota) is sheltered and calm — perfect for families. The west coast (Porto Katsiki, Egremni) has the dramatic beaches but is exposed. Your captain will know when conditions are right to anchor on the west side. Sivota Bay is one of the most protected anchorages in Greece — sleep there, swim at dawn.',
    yachts: ['kimata', 'serenissima', 'alexandra-ii'],
  },
  {
    id: 'alonissos',
    name: 'Alonissos',
    region: 'Sporades',
    tagline: 'Europe\'s largest marine sanctuary',
    emoji: '🐬',
    bestFor: 'National Marine Park, monk seals, diving, pristine nature, eco-tourism',
    bestMonths: 'June – September',
    anchorage: 'Patitiri (main port), Steni Vala (fishing village, calm), Kokkinokastro (red beach, day anchor)',
    restaurants: [
      { name: 'Archipelagos', type: 'Waterfront', note: 'Patitiri harbour. Creative Greek cuisine using island ingredients. The shrimp saganaki is renowned.' },
      { name: 'To Kamaki', type: 'Fish taverna', note: 'Steni Vala — a fishing village with 50 residents. Eat what the fishermen caught that morning.' },
      { name: 'Hayati', type: 'Garden dining', note: 'In Old Alonissos village (Hora). Panoramic views, organic vegetables, island wine.' },
    ],
    hiddenGems: ['Monk seals — Alonissos is home to the endangered Mediterranean monk seal. Spot them from a respectful distance in the Marine Park.', 'Kyra Panagia — uninhabited island in the Marine Park. Ancient monastery, wild goats, the most pristine water you\'ll ever swim in.', 'Peristera underwater museum — a 5th century BC shipwreck you can snorkel over. The world\'s first accessible underwater archaeological site.'],
    yachtTip: 'Alonissos is the gateway to the National Marine Park of the Northern Sporades — the largest marine protected area in Europe. Your yacht is the best way to explore it. Anchor at Kyra Panagia for an experience that feels like discovering a new world. Diving and snorkelling here is on another level — visibility up to 30 metres.',
    yachts: ['worlds-end', 'libra', 'summer-star'],
  },
  {
    id: 'athens-riviera',
    name: 'Athens Riviera',
    region: 'Mainland',
    tagline: 'Where the city meets the sea',
    emoji: '🏙️',
    bestFor: 'Pre/post-charter, Ellinikon project, beach clubs, Cape Sounion, fine dining',
    bestMonths: 'Year-round',
    anchorage: 'Flisvos Marina (superyacht-ready), Alimos Marina (charter base), Vouliagmeni (exclusive)',
    restaurants: [
      { name: 'Varoulko Seaside', type: 'Michelin-starred', note: 'Chef Lefteris Lazarou — Greece\'s first Michelin star for seafood. At Flisvos Marina. The pre-charter dinner.' },
      { name: 'Island Club', type: 'Beach club', note: 'On the Vouliagmeni coast. Sunset cocktails, DJs, Mediterranean cuisine. Athens meets Mykonos.' },
      { name: 'Ithaki', type: 'Seafood fine dining', note: 'Vouliagmeni peninsula. The lobster with pasta is legendary. Book the terrace at sunset.' },
    ],
    hiddenGems: ['Cape Sounion — the Temple of Poseidon at sunset. Anchor below the temple, tender to the rocks, watch the sun drop into the Aegean. The most dramatic pre-charter moment.', 'Lake Vouliagmeni — a thermal lake fed by underground springs. 24°C year-round. Spa-like swimming 20 minutes from Athens.', 'The Ellinikon Project — Europe\'s largest urban regeneration. A new superyacht marina with 400+ berths, beach access, and luxury retail is under construction. Expected 2028-29. The Athens Riviera is about to change everything.'],
    yachtTip: 'Most charters embark from Alimos or Lavrion marina. Spend a night at the Athens Riviera before boarding — dinner at Varoulko, a swim at Vouliagmeni Lake, and a drive down the coast to Cape Sounion. It\'s the perfect way to decompress before your week at sea. And by 2029, the new Ellinikon Marina will make Athens a genuine superyacht destination.',
    yachts: ['la-pellegrina-1', 'genny', 'above-beyond'],
  },
];

export default function DestinationsClient() {
  const { t } = useI18n();
  const [activeIsland, setActiveIsland] = useState(ISLANDS[0]);

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      {/* Hero */}
      <div style={{ padding: '160px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '0.4em', color: `${GOLD}99`, textTransform: 'uppercase', marginBottom: 16 }}>
          {t('destinations.label', 'Insider Knowledge')}
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 16px' }}>
          {t('destinations.title', 'Greek Island Guides')}
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          {t('destinations.subtitle', "Restaurants, hidden beaches, anchorages, and secrets that only come from years on the water. Not from a guidebook — from George.")}
        </p>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px 120px' }}>
        {/* Island tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
          {ISLANDS.map(island => (
            <button
              key={island.id}
              onClick={() => setActiveIsland(island)}
              style={{
                padding: '12px 20px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                letterSpacing: '0.1em',
                border: `1px solid ${activeIsland.id === island.id ? GOLD : '#333'}`,
                background: activeIsland.id === island.id ? `${GOLD}15` : 'transparent',
                color: activeIsland.id === island.id ? GOLD : 'rgba(255,255,255,0.4)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {island.emoji} {island.name}
            </button>
          ))}
        </div>

        {/* Island content */}
        <div key={activeIsland.id}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>{activeIsland.emoji}</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', fontWeight: 300, margin: '0 0 8px' }}>
              <span className="notranslate">{activeIsland.name}</span>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: GOLD, fontStyle: 'italic', margin: '0 0 16px' }}>
              {activeIsland.tagline}
            </p>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                📍 {activeIsland.region}
              </span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
                📅 {activeIsland.bestMonths}
              </span>
            </div>
          </div>

          {/* Best for */}
          <div style={{ textAlign: 'center', marginBottom: 48, padding: '20px 0', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{t('destinations.bestFor', 'Best For')}</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{activeIsland.bestFor}</p>
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="dest-grid">
            {/* Restaurants */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', fontWeight: 400, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                🍽️ {t('destinations.whereToEat', 'Where to Eat')}
              </h3>
              {activeIsland.restaurants.map((r, i) => (
                <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < activeIsland.restaurants.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#fff', marginBottom: 4 }}><span className="notranslate">{r.name}</span></div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, color: GOLD, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{r.type}</div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: 0 }}>{r.note}</p>
                </div>
              ))}
            </div>

            {/* Hidden gems */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #1a1a1a', borderRadius: 12, padding: 28 }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#fff', fontWeight: 400, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                💎 {t('destinations.hiddenGems', 'Hidden Gems')}
              </h3>
              {activeIsland.hiddenGems.map((gem, i) => (
                <div key={i} style={{ marginBottom: 16, paddingLeft: 20, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, top: 2, color: GOLD, fontSize: 10 }}>✦</span>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: 0 }}>{gem}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anchorage */}
          <div style={{ marginTop: 24, background: 'rgba(218,165,32,0.03)', border: `1px solid ${GOLD}15`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: '#fff', fontWeight: 400, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚓ {t('destinations.bestAnchorages', 'Best Anchorages')}
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, margin: 0 }}>
              {activeIsland.anchorage}
            </p>
          </div>

          {/* George's yacht tip */}
          <div style={{ marginTop: 24, borderLeft: `3px solid ${GOLD}`, paddingLeft: 24, paddingTop: 8, paddingBottom: 8 }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>{t('destinations.yachtTip', "George's Yacht Tip")}</p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, margin: '0 0 8px', fontStyle: 'italic' }}>
              "{activeIsland.yachtTip}"
            </p>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, color: `${GOLD}60`, margin: 0 }}>
              — George P. Biniaris, Managing Broker
            </p>
          </div>

          {/* Recommended yachts */}
          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
              {t('destinations.recommendedYachts', 'Recommended Yachts for')} <span className="notranslate">{activeIsland.name}</span>
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {activeIsland.yachts.map(slug => (
                <Link
                  key={slug}
                  href={`/yachts/${slug}`}
                  style={{
                    padding: '10px 20px',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    border: `1px solid ${GOLD}30`,
                    color: GOLD,
                    borderRadius: 20,
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nav link */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .dest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
