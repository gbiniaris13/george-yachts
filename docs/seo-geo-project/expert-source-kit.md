# Expert-Source Kit — George ως πηγή δημοσιογράφων (Φ2.2)

Στόχος: authority backlinks + brand mentions από μεγάλα μέσα, ΔΩΡΕΑΝ, με τον George ως τον expert για Greek yacht charter. Ένα δημοσιευμένο quote σε Forbes-tier μέσο αξίζει όσο 100 directories.

## 1. Πού γράφεσαι (όλα δωρεάν — 15' συνολικά, χρειάζονται ΤΟ ΔΙΚΟ ΣΟΥ χέρι γιατί είναι δημιουργία λογαριασμών)

| Πλατφόρμα | URL | Free tier | Σημείωση |
|---|---|---|---|
| HARO (αναβίωσε από Featured.com) | helpareporter.com | Δωρεάν daily newsletter | Γράψου με george@georgeyachts.com |
| Source of Sources (SOS) | sourceofsources.com | 100% δωρεάν | Από τον ιδρυτή του αρχικού HARO (Peter Shankman), χαμηλός θόρυβος |
| Qwoted | qwoted.com | 2 pitches/μήνα δωρεάν | Το υψηλότερο conversion· τα 2 pitches φτάνουν αν διαλέγουμε σωστά |
| Featured.com | featured.com | Free tier | Curated roundups για Fortune/Fast Company/Yahoo |
| #JournoRequest | X (Twitter) αναζήτηση | Δωρεάν | Γρήγορο follow + ειδοποιήσεις στο hashtag |

**Σε όλα:** όνομα «George P. Biniaris», τίτλος «Founder and Managing Broker, George Yachts», website georgeyachts.com, expertise «Greek yacht charter, Mediterranean luxury travel, UHNW travel».

## 2. Το bio σου (copy-paste στα profiles)

**Short (≤200 chars):**
> George P. Biniaris is the Founder and Managing Broker of George Yachts, a boutique IYBA-member yacht charter brokerage specialising exclusively in Greek waters. Featured in Forbes, 2026.

**Long:**
> George P. Biniaris is the Founder and Managing Broker of George Yachts Brokerage House, a boutique luxury yacht charter brokerage operating exclusively in Greek waters: the Cyclades, the Ionian, the Saronic Gulf and the Dodecanese. An IYBA Charter Active member working on the MYBA standard, George personally curates a fleet of 63 crewed yachts and oversees the full charter cycle for ultra-high-net-worth clients. He publishes the Greek Charter Index, an annual data report on Greek charter pricing and demand. Featured in Forbes, May 2026.

## 3. Pitch templates (στη φωνή του George — σύντομα, δεδομένα πρώτα)

**Template A — ερώτηση κόστους/τιμών:**
> Hi [Name], George Biniaris here, Managing Broker at George Yachts (IYBA member, featured in Forbes this May). On your question: [1-sentence direct answer with a real number]. For context, our Greek Charter Index 2026 tracks weekly rates by yacht type and region: [one striking stat]. Happy to expand or share the full dataset: georgeyachts.com/greek-charter-index-2026. Best, George

**Template B — ερώτηση εμπειρίας/τάσεων:**
> Hi [Name], I broker crewed charters exclusively in Greek waters and see [X] first-hand every season. The short answer: [direct answer]. One detail most coverage misses: [insider fact — e.g. the Greek-flag exception to the 12-passenger rule / the 0.55x October multiplier]. Quote me as George P. Biniaris, Founder and Managing Broker, George Yachts (georgeyachts.com). Best, George

**Template C — destination piece:**
> Hi [Name], for a Greece piece: the under-covered angle is [Saronic short formats / Dodecanese as the quiet alternative / Sifnos as the food island]. [2 sentences of specific, quotable detail]. I can provide rates, itineraries or photography. George P. Biniaris, George Yachts, featured in Forbes 2026.

## 4. Ροή λειτουργίας (η υποδομή ΥΠΑΡΧΕΙ ήδη στον κώδικα)

1. Τα digests (HARO/SOS/Qwoted) έρχονται στο inbox σου.
2. Κάνε paste το raw σώμα στο **/admin/haro-process** → το `lib/haroMonitor.js` φιλτράρει ό,τι είναι yacht-charter-relevant (22 keywords) και βγάζει draft απαντήσεις στη φωνή σου.
3. Διαλέγεις, ρετουσάρεις, στέλνεις. Ποτέ μαζικά — 2-3 ποιοτικά pitches/εβδομάδα αρκούν.

**Κανόνες:** Απαντάς ΜΟΝΟ όπου έχεις πραγματική γνώση. Πάντα ένα νούμερο/γεγονός που δεν έχει ο επόμενος. Ποτέ links εκτός από georgeyachts.com. Deadline δημοσιογράφου = νόμος.
