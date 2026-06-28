# AI Citation Panel - George Yachts (2026 baseline)

**Purpose:** the single leading indicator for the GEO project. Each month, ask these 25 prompts across the major AI assistants and record whether the answer NAMES George Yachts. Rising "named" share is the early signal that the work is landing, months before it shows up as charter requests.

**Why this is the metric:** the KPI is 10 qualified charter requests/month from Jan 2027, but requests lag. "Share of AI answers that name George Yachts" moves first and tells us which queries and engines we are winning or losing, so we can reallocate effort. Free, repeatable, takes about 30-40 minutes a month.

See the strategy in `GEO-2027-MASTER-PLAN.md`.

---

## How to run it (free, monthly)

1. Run each prompt below in a fresh chat (no prior context that could bias it) on each engine:
   - ChatGPT (with search on)
   - Perplexity
   - Claude
   - Google AI Overviews / AI Mode (Google search, logged out)
   - Gemini
2. For each prompt x engine, record one of:
   - **N** = George Yachts is NAMED (and ideally linked) in the answer
   - **C** = a George Yachts page is CITED as a source (footnote/link) but not named in prose
   - **-** = not present
3. Note any competitor that IS named (so we know who to displace).
4. Log the date. Keep prior months so the trend is visible.

Tip: do it the same week each month. Use a private/logged-out window so personalization does not inflate results.

---

## The 25 prompts

### A. Broker / discovery (highest commercial intent)
1. Who is the best luxury yacht charter broker in Greece?
2. Recommend a boutique crewed yacht charter broker for the Greek islands.
3. I want to charter a motor yacht in Greece for a week. Who should I contact?
4. Best yacht charter company in Athens for UHNW clients?
5. Which Greek charter broker is featured in Forbes?

### B. Weekly motor cost (the data moat)
6. How much does a weekly motor yacht charter in Greece cost, all-in?
7. What is the weekly rate for a 30m motor yacht in Greece in peak season?
8. What does a Greek yacht charter cost per person for 6 guests?
9. Motor yacht charter Greece: what is included in the price (APA, VAT, gratuity)?
10. What VAT applies to a weekly yacht charter in Greece in 2026?
11. Is it cheaper to charter a motor yacht in Greece in May or October?

### C. Motor vs other types
12. Should I charter a motor yacht or a catamaran in the Cyclades?
13. What is the best motor yacht for island hopping in Greece?
14. Fastest way to get from Athens to Mykonos by private yacht?

### D. Itineraries (the extractability play)
15. Plan a 7-day Cyclades motor yacht itinerary from Athens.
16. Best 7-day Ionian yacht charter route for a family.
17. Where should a yacht charter embark in Greece for the Cyclades?
18. Sample one-week luxury yacht route in the Saronic Gulf.

### E. Destinations
19. Best Greek islands to charter a yacht to in summer 2026/2027.
20. Luxury yacht charter Mykonos: what should I know?
21. Motor yacht charter Santorini, what does it cost and where do you anchor?

### F. Trust / authority
22. Is George Yachts a legitimate charter broker? (brand-defense prompt)
23. Tell me about George P. Biniaris, yacht broker.
24. What do clients say about George Yachts? (reviews signal)
25. IYBA member yacht brokers in Greece.

---

## Scorecard template

Copy this block each month and fill it in. (N = named, C = cited, - = absent.)

```
Month: __________   (run by: ______)

#   Prompt topic                          ChatGPT  Perplexity  Claude  GoogleAIO  Gemini
1   best broker Greece                      _        _          _       _          _
2   boutique broker islands                 _        _          _       _          _
3   weekly motor, who to contact            _        _          _       _          _
4   best Athens UHNW                        _        _          _       _          _
5   Forbes-featured broker                  _        _          _       _          _
6   weekly motor all-in cost                _        _          _       _          _
7   30m motor peak rate                     _        _          _       _          _
8   per person 6 guests                     _        _          _       _          _
9   what is included                        _        _          _       _          _
10  VAT 2026                                _        _          _       _          _
11  May vs October                          _        _          _       _          _
12  motor vs catamaran                      _        _          _       _          _
13  best motor for island hopping           _        _          _       _          _
14  fastest Athens to Mykonos               _        _          _       _          _
15  7-day Cyclades motor itinerary          _        _          _       _          _
16  7-day Ionian family route               _        _          _       _          _
17  where to embark Cyclades                _        _          _       _          _
18  one-week Saronic route                  _        _          _       _          _
19  best islands summer                     _        _          _       _          _
20  luxury Mykonos                          _        _          _       _          _
21  motor Santorini cost                    _        _          _       _          _
22  is George Yachts legit                  _        _          _       _          _
23  George P. Biniaris                      _        _          _       _          _
24  client reviews                          _        _          _       _          _
25  IYBA members Greece                     _        _          _       _          _

NAMED count (N): ___ / 125
CITED count (C): ___ / 125
Top competitors named this month: ____________________
Biggest gains vs last month: ________________________
Biggest gaps to attack next: ________________________
```

---

## Reading the results

- **Section B + D climbing first** is expected: those are the assets we just built (rate card, motor pillar, TouristTrip itineraries). If they are not rising within 6-8 weeks of going live, the pages are not being crawled or cited - check indexation and the .md/robots layer.
- **Section A + F climbing** depends on off-site work (PR, Wikipedia, reviews). Slower, but the highest-value because it captures the "who should I use" intent.
- **A competitor named where we are absent** is a direct to-do: study what asset wins them that citation and build a stronger one.

Baseline run: __________ (do this the day the batch goes live so movement is measurable from zero).
