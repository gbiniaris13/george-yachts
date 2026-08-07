/**
 * The two pages a person reads when they are deciding whether to trust the
 * house, /about-us and /how-it-works, carried roughly 4,000 words each and
 * zero structured questions. An AI engine asked "which broker should I use in
 * Greece" could not lift a single sentence from either of them.
 *
 * Written 2026-08-07. One source of truth, so the visible copy and the
 * FAQPage schema can never drift apart: both the page and the JSON-LD read
 * from these arrays.
 *
 * Every factual claim below is checkable against the founder's bio at
 * /about/george-p-biniaris. Note deliberately: "licensed skipper", never
 * "captain". The house sells verification, so its own claims have to survive
 * the same test. See the guard in scripts/checkCredentialClaims.mjs.
 */

export const ABOUT_FAQ = [
  {
    q: "Who is George P. Biniaris?",
    a: "The founder and Managing Broker of George Yachts Brokerage House LLC. He comes from a Cycladic family from Syros and grew up crossing the Aegean. He holds a skipper's licence from the Olympiacos SFP Sailing Academy and a powerboat licence, has run charter seasons out of Corfu and operations across the Ionian, the Cyclades and the Saronic. Before broking he spent a decade in luxury hospitality, in Group Operations for the Interni Group in Mykonos across a five-star hotel and a beach club, and as founder of two venues in Kifisia. He served as a commissioned Reserve Infantry Officer and later as a Company Commander in the National Guard. He answers his own enquiries.",
  },
  {
    q: "Which broker should I use for a yacht charter in Greece?",
    a: "Use the one who passes your checks rather than the one who advertises hardest, and apply the same test to us. Ours: George Yachts Brokerage House LLC is a Wyoming company operating out of Athens, so the entity on your contract sits in a US register you can search from your desk while the operation runs where the yachts and crews actually are. IYBA Charter Active Member, listed publicly in their directory. Every charter written on a MYBA-standard contract, with base fee, APA, the yacht's certified Greek VAT rate and the crew gratuity range set out before you sign. Forbes coverage in May 2026. We are boutique and we were founded in 2026, so if scale or decades are your filter, say so early and we will tell you honestly whether we fit.",
  },
  {
    q: "What makes a boutique brokerage different from a large agency?",
    a: "Two things, and only two. First, the same named person handles you from the first message to disembarkation, so nothing is re-explained to a coordinator who has never spoken to you. Second, we own no yachts and hold no central agency mandates, which means there is no hull we are under pressure to fill and the boat proposed is the one that fits your dates, your group and your budget. The trade is real and worth stating: a large agency has more people and a longer history. We have neither. What we have is one broker who has been aboard.",
  },
  {
    q: "What does white glove service actually mean here?",
    a: "It means the standard was set somewhere it could be measured. A decade running a five-star hotel and a beach club in Mykonos is where you learn what a chef can genuinely deliver from a galley at anchor, how many covers a service crew can hold before the week starts slipping, and what a guest notices without ever mentioning it. Practically it shows up as crew matched to your group rather than to the yacht's brochure, preferences taken once and passed to the crew before you board, and a broker reachable through the week rather than only before the deposit.",
  },
  {
    q: "Where is George Yachts based?",
    a: "The legal entity is George Yachts Brokerage House LLC, a Wyoming company. The working base is Athens, at Charilaou Trikoupi 190A in Kifisia, because that is where the Greek charter fleet, the central agents and the crews are. Charters run in Greek waters only: the Cyclades, the Ionian, the Saronic, the Dodecanese and the Sporades.",
  },
  {
    q: "Does George Yachts own the yachts it charters?",
    a: "No, and that is the point. We hold no ownership and no central agency mandate on any yacht we place, so we have nothing to gain from steering you to one hull over another. We work across the Greek fleet, currently 59 yachts placed personally: 17 motor yachts, 12 power catamarans, 25 sailing catamarans and 5 sailing monohulls, and if the right boat for your week is not among them we will tell you and go and find it.",
  },
];

export const HOW_IT_WORKS_FAQ = [
  {
    q: "How does booking a crewed yacht charter in Greece work?",
    a: "Five steps. You tell us the week, the group and roughly the budget, in one conversation rather than a form. We come back with a shortlist of yachts genuinely available for those dates, with the base fee, the APA, the yacht's certified VAT rate and the crew gratuity range written out, not a brochure. You choose, and we hold the week while the paperwork is drawn. You sign a MYBA-standard contract and pay to the terms in it. Then we brief the crew on your group, your preferences and anything that matters, before you arrive at the passerelle.",
  },
  {
    q: "How far in advance should I book a Greek charter week?",
    a: "For peak July and August, six to twelve months out, because the yachts that book earliest are the ones everyone wants. June and September hold availability much closer in, often at a softer rate for the same yacht and better weather for a family. If you are inside eight weeks of a peak date, the conversation is worth having anyway: weeks release, and we would rather tell you honestly what is left than let you believe the market is empty.",
  },
  {
    q: "What do I actually pay, and when?",
    a: "Three separate things, and any broker who blurs them is doing you no favours. The base fee is the yacht and her crew for the week. The APA, typically 25 to 30 percent of the base, is your own running float for fuel, provisioning and berthing, held by the captain and accounted for line by line, with the balance returned to you. Greek VAT is charged at the yacht's certified rate, in practice between 5.2 and 12 percent on certified commercial yachts rather than one flat number, with 24 percent applying to short, static or bareboat arrangements. The crew gratuity is customary at 10 to 15 percent, calculated on the base fee alone and never on the total, and it is entirely at your discretion. Payment timing is set out in the MYBA contract before you sign anything.",
  },
  {
    q: "Do I speak to the same person throughout?",
    a: "Yes. George handles the enquiry, the shortlist, the negotiation, the contract and the crew brief himself, and he is reachable through the charter week, not only up to the deposit. This is the practical difference between a boutique house and an agency where an enquiry passes through a sales desk, a coordinator and an operations team, each of whom has to be told the same things again.",
  },
  {
    q: "What contract will I sign and why does it matter?",
    a: "A MYBA-standard charter agreement, the form used across the professional Mediterranean fleet. It matters because it fixes the things that turn into arguments: the yacht, the dates, the base fee, how the APA is held and accounted for, the cancellation terms and what happens if the yacht cannot perform. If a broker proposes their own paperwork instead, ask why. Money should move only against a signed MYBA contract with the company's bank details given to you in writing.",
  },
  {
    q: "Can you charter for a single day?",
    a: "No. We write weeks only, Saturday to Saturday, fully crewed. It is a deliberate limit rather than a gap: the week is what lets a crew learn your group, what lets an itinerary be built backwards from the forecast instead of a map, and what the yachts and crews we work with are set up to deliver properly. If you want a day out of Athens or Mykonos, say so and we will point you somewhere honest rather than sell you the wrong thing.",
  },
];
