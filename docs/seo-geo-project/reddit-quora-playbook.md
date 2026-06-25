# Reddit / Quora / TripAdvisor Playbook (Φ3.3)

Γιατί: τα AI engines (ChatGPT, Perplexity, Google AI Overviews) παραθέτουν Reddit/Quora/TripAdvisor περισσότερο από κάθε άλλη πηγή για «ποιον να εμπιστευτώ» ερωτήσεις. Μία καλή απάντηση ζει χρόνια και τροφοδοτεί AI answers.

## Κανόνες (απαράβατοι — τα subreddits ΒΑΝΑΡΟΥΝ promo)

1. Οι λογαριασμοί και τα posts είναι ΤΟΥ GEORGE (αυθεντικότητα = το όλο νόημα). Εγώ ετοιμάζω drafts, εκείνος δημοσιεύει.
2. Αναλογία 10:1 — δέκα απαντήσεις καθαρής αξίας χωρίς link για κάθε μία που αναφέρει το site.
3. Ποτέ «book with us». Πάντα: απάντηση + πραγματικά νούμερα + «I broker charters in Greece for a living» ως disclosure όπου χρειάζεται.
4. Στο r/yachting και r/sailing το self-promo απαγορεύεται ρητά — εκεί ΜΟΝΟ αξία, το προφίλ (με το site στο bio) κάνει τη δουλειά.

## Πού (με σειρά αξίας)

| Πλατφόρμα | Στόχοι | Τι παίζει |
|---|---|---|
| Reddit | r/travel, r/GreeceTravel, r/Sailing, r/yachting, r/fatFIRE (charter questions!) | Ερωτήσεις «yacht charter Greece worth it?», «cost?», «Mykonos vs X» |
| Quora | «How much does a yacht charter in Greece cost?» κ.ά. | Οι απαντήσεις ρανκάρουν ΚΑΙ στην ίδια την Google |
| TripAdvisor forums | Greece forum, Greek Islands forum | «Destination Expert» status μακροπρόθεσμα |

## 5 έτοιμα draft σκελετοί (προσαρμόζονται ανά thread)

1. **Cost question:** Real numbers από το Index (26m peak: €46.8K base / €76.1K all-in· October -45%) + four-bucket εξήγηση (base/APA/VAT/gratuity) + «full data: search Greek Charter Index». Disclosure: «I'm a charter broker in Athens».
2. **12+ guests:** Η international SOLAS βάση του κανόνα + Greek-flag exception + τι κάνουν realistically τα groups των 14.
3. **Mykonos vs alternatives:** Saronic (wind-protected, 4-night formats) και Dodecanese (λιγότερη κίνηση, -10-15%) με συγκεκριμένα παραδείγματα.
4. **First-time charter:** Τι περιλαμβάνεται, τι όχι (τα 6 hidden costs από τον οδηγό), πότε να κλείσεις (lead times).
5. **Meltemi/seasickness:** Stabilisers 101 (fins vs zero-speed gyros), ποιες περιοχές είναι wind-protected, routing tricks.

## Cadence + ΔΙΟΡΘΩΣΗ (2026-06-25)

**ΣΗΜΑΝΤΙΚΟ — το Reddit ΔΕΝ σκανάρεται αυτόματα:** το μπλοκάρει το Chrome
extension (safety), το JSON API απορρίπτει το curl, και το Reddit απαγορεύει
τον crawler της Anthropic. Η παλιά υπόσχεση «σκανάρω εβδομαδιαία το Reddit»
ΔΕΝ ισχύει. Ο πραγματικός, ασφαλής loop:

1. Ο George βλέπει thread (κανονική περιήγηση) Ή κάνει paste το thread στον Claude.
2. Επαναλαμβανόμενη ερώτηση → paste έτοιμη πλήρη απάντηση από το
   **reddit-ready-answers.md** (30''), ελαφρώς προσαρμοσμένη.
3. Νέα ερώτηση → ο Claude γράφει tailored απάντηση, ο George ποστάρει.

Ρυθμός: 2-3 απαντήσεις/εβδομάδα. Το ποστάρισμα είναι ΠΑΝΤΑ ανθρώπινο — ο μόνος
ασφαλής + αποδοτικός τρόπος (τα bots τρώνε ban).
