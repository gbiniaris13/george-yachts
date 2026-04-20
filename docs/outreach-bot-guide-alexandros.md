OUTREACH BOT — ΠΛΗΡΕΣ GUIDE ΣΤΗΣΙΜΑΤΟΣ
========================================

Αλέξανδρε, αυτο ειναι το πληρες guide για να στησεις το δικο σου αυτοματο outreach system. Στελνει cold emails, κανει follow-ups μονο του, και σε ενημερωνει στο Telegram σε real-time. Κοστος: 0 ευρω.


ΣΥΝΟΨΗ ΤΟΥ ΣΥΣΤΗΜΑΤΟΣ
-----------------------

Το συστημα εχει 4 κομματια:

1. OMKAR GOOGLE MAPS EXTRACTOR — Βρισκει leads (επιχειρησεις + emails)
2. CLAUDE (AI) — Καθαριζει τα leads (βγαζει σκουπιδια, κραταει μονο personal emails)
3. GOOGLE SHEETS — Η "βαση δεδομενων" / CRM
4. GOOGLE APPS SCRIPT — Το bot που στελνει emails + Telegram ειδοποιησεις

Η ροη ειναι:
Omkar → Claude καθαριζει → Google Sheet → Bot στελνει → Telegram σε ενημερωνει


======================================================================
ΒΗΜΑ 1: OMKAR GOOGLE MAPS EXTRACTOR (Ευρεση Leads)
======================================================================

ΤΙ ΕΙΝΑΙ:
Desktop εφαρμογη (Windows/Mac) που ψαχνει στο Google Maps και βγαζει
businesses με emails, τηλεφωνα, LinkedIn, κλπ.

ΕΓΚΑΤΑΣΤΑΣΗ:
1. Πηγαινε: https://omkar.cloud
2. Κατεβασε το "Google Maps Extractor" (desktop app)
3. Κανε εγγραφη — υπαρχει Starter Plan (2000 credits/μηνα, αρκει)
4. Εγκατεστησε και κανε login

ΠΩΣ ΤΟ ΧΡΗΣΙΜΟΠΟΙΕΙΣ:
1. Ανοιξε το Omkar, πατα "New Task"
2. Βαλε search query, π.χ.:
   - "luxury travel agency in Dubai"
   - "VIP concierge in London"
   - "yacht charter broker in Monaco"
   - "family office in DIFC Dubai"
   - "bespoke travel advisor in Mayfair London"
3. Βαλε Enable Emails = ON (ΣΗΜΑΝΤΙΚΟ!)
4. Πατα Start

ΣΗΜΑΝΤΙΚΟ ΓΙΑ TA CREDITS:
- Καθε business που enriches (βρισκει emails) καιει ~1 credit
- Εχεις 2000/μηνα στο Starter
- ΜΗΝ βαλεις τεραστια tasks (π.χ. "travel agency worldwide") — θα φας ολα τα credits
- Κανε μικρα, στοχευμενα searches: συγκεκριμενη περιοχη + συγκεκριμενο keyword
- Αν τελειωσουν τα credits, ανανεωνονται στις 1 του μηνα

ΕΞΑΓΩΓΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ:
- Οταν τελειωσει το task, πατα "Download CSV" στα Results (ΟΧΙ στο Tasks page)
- Θα παρεις ενα μεγαλο CSV με ολες τις στηλες (name, emails, phones, address, κλπ)

ΠΟΙΑ SEARCH QUERIES ΔΟΥΛΕΥΟΥΝ ΚΑΛΥΤΕΡΑ:
  - "luxury travel agency" + περιοχη (Dubai, London, NYC, Monaco)
  - "VIP concierge" + περιοχη
  - "family office" + high-end περιοχη (DIFC, Jumeirah, Mayfair)
  - "yacht charter" + ναυτικη πολη (Monaco, Antibes, Fort Lauderdale)
  - "bespoke travel advisor" + χωρα
  - "Virtuoso travel advisor" (premium δικτυο travel agents)
  - "DMC Greece" (incoming tour operators)


======================================================================
ΒΗΜΑ 2: CLAUDE — ΚΑΘΑΡΙΣΜΑ LEADS
======================================================================

ΤΙ ΚΑΝΕΙ:
Τα CSV απο το Omkar εχουν ΠΟΛΥ σκουπιδι:
- Generic emails (info@, contact@, booking@, support@)
- Emails χωρις πραγματικα ονοματα ατομων
- Duplicates
- Ασχετες εταιρειες (ξενοδοχεια, εμπορικα κεντρα κλπ)

Το Claude AI τα καθαριζει και κραταει ΜΟΝΟ:
- Personal emails (π.χ. john.smith@company.com)
- Με πραγματικο first + last name
- Max 2 ατομα ανα εταιρεια
- Χωρις duplicates με ηδη σταλμενα

ΠΩΣ:
1. Ανοιξε Claude Code (ή Claude.ai)
2. Δωσε του το CSV αρχειο
3. Πες του: "Καθαρισε αυτο το CSV. Κρατα μονο personal emails (first.last@company.com pattern). Βγαλε τα generic (info@, contact@, booking@ κλπ). Max 2 leads/εταιρεια. Φτιαξε CSV με στηλες: first_name, last_name, email, company, country, linkedin_url"
4. Θα σου δωσει καθαρο CSV

ΕΝΑΛΛΑΚΤΙΚΑ (χωρις Claude):
Μπορεις να το κανεις χειροκινητα:
- Ανοιξε το Omkar CSV στο Excel/Sheets
- Κοιτα τη στηλη "emails"
- Κρατα μονο αυτα που μοιαζουν με ονομα.επωνυμο@εταιρεια.com
- Διεγραψε ολα τα info@, contact@, booking@, κλπ


======================================================================
ΒΗΜΑ 3: GOOGLE SHEET (CRM)
======================================================================

ΔΗΜΙΟΥΡΓΙΑ:
1. Πηγαινε στο Google Sheets (sheets.google.com)
2. Δημιουργησε νεο spreadsheet
3. Στο πρωτο φυλλο (Sheet1), μετονομασε το σε: Prospects
4. Βαλε αυτα τα headers στη γραμμη 1:

   A1: first_name
   B1: last_name
   C1: email
   D1: company
   E1: country
   F1: linkedin_url
   G1: status
   H1: email1_date
   I1: followup1_date
   J1: followup2_date
   K1: notes

5. Σημειωσε το Sheet ID (ειναι στο URL μετα το /d/ και πριν το /edit)
   Π.χ.: https://docs.google.com/spreadsheets/d/ΑΥΤΟ_ΕΙΝΑΙ_ΤΟ_ID/edit

ΠΡΟΣΘΗΚΗ LEADS:
- Βαλε τα καθαρισμενα leads στις στηλες A-F (γραμμες 2+)
- Αφησε τις G-K κενες — τις γεμιζει αυτοματα το bot
- Η στηλη STATUS δουλευει ετσι:
    (κενο)     = νεο lead, θα σταλει Email 1
    email1     = σταλθηκε Email 1, περιμενει Follow-up 1
    followup1  = σταλθηκε FU1, περιμενει Follow-up 2
    completed  = ολοκληρωθηκε η αλληλουχια (3 emails)
    replied    = απαντησε (σταματαει αυτοματα)
    error      = καποιο προβλημα


======================================================================
ΒΗΜΑ 4: TELEGRAM BOT (Ειδοποιησεις)
======================================================================

ΔΗΜΙΟΥΡΓΙΑ BOT:
1. Ανοιξε Telegram, ψαξε @BotFather
2. Στειλε: /newbot
3. Δωσε ονομα (π.χ. "Outreach Bot")
4. Δωσε username (π.χ. "alexandros_outreach_bot")
5. Θα σου δωσει ενα TOKEN — ΣΗΜΕΙΩΣΕ ΤΟ (π.χ. 1234567890:AAxxxxxxxxxxxxxxxxxxxxxxx)

ΕΥΡΕΣΗ CHAT ID:
1. Στειλε ενα μηνυμα στο bot σου (οτιδηποτε, π.χ. "hi")
2. Ανοιξε στον browser: https://api.telegram.org/botΤΟ_TOKEN_ΣΟΥ/getUpdates
3. Ψαξε "chat":{"id": — αυτος ο αριθμος ειναι το CHAT_ID σου

ΤΙ ΘΑ ΛΑΜΒΑΝΕΙΣ:
- Καθε φορα που στελνεται email: ειδοποιηση με ονομα, εταιρεια, χωρα, LinkedIn
- Ξεχωριστο μηνυμα (silent) με κειμενο copy-paste για LinkedIn
- Follow-up notifications (FU1, FU2)
- Ειδοποιηση οταν τελειωνουν τα leads
- Daily limit alerts


======================================================================
ΒΗΜΑ 5: GOOGLE APPS SCRIPT (Το Bot)
======================================================================

ΔΗΜΙΟΥΡΓΙΑ:
1. Πηγαινε: https://script.google.com
2. Πατα "New Project"
3. Σβησε τον default κωδικα
4. Κανε COPY-PASTE ολοκληρο τον κωδικα (θα στον δωσω παρακατω)

ΡΥΘΜΙΣΗ CONFIG:
Στην αρχη του κωδικα αλλαξε αυτα:

  TELEGRAM_BOT_TOKEN: 'ΤΟ_ΔΙΚΟ_ΣΟΥ_TOKEN',
  TELEGRAM_CHAT_ID: 'ΤΟ_ΔΙΚΟ_ΣΟΥ_CHAT_ID',
  SENDER_EMAIL: 'to_email_sou@domain.com',
  SENDER_NAME: 'Το Ονομα Σου',
  DECK_URL: 'link_pros_to_partnership_deck_sou',

ΣΥΝΔΕΣΗ ΜΕ ΤΟ SHEET:
1. Στο Apps Script, πατα τα αριστερα "Services" (+)
2. Προσθεσε "Google Sheets API"
3. Ανοιξε το Google Sheet σου
4. Πατα Extensions > Apps Script — θα ανοιξει ο editor ΣΥΝΔΕΔΕΜΕΝΟΣ με το sheet
   (ΑΥΤΟΣ ΕΙΝΑΙ Ο ΚΑΛΥΤΕΡΟΣ ΤΡΟΠΟΣ — το script βλεπει αυτοματα το sheet)

TRIGGER (ΑΥΤΟΜΑΤΗ ΕΚΤΕΛΕΣΗ):
1. Στο Apps Script, πατα αριστερα το ρολοι (Triggers)
2. Πατα "+ Add Trigger"
3. Ρυθμισε:
   - Function: sendOutreach
   - Event source: Time-driven
   - Type: Hour timer
   - Every: 1 hour
4. Πατα Save
5. Θα ζητησει permissions — αποδεξου ολα (εχει προσβαση στο email + sheets)

ΤΟ BOT ΚΑΝΕΙ ΤΑ ΕΞΗΣ ΑΥΤΟΜΑΤΑ:
- Καθε ωρα τσεκαρει αν ειναι εργασιμες ωρες ΣΤΗ ΧΩΡΑ ΤΟΥ ΠΑΡΑΛΗΠΤΗ
- Στελνει max 7 emails/ωρα, max 50/μερα
- ΔΕΝ στελνει Σαββατο, Κυριακη, Δευτερα
- Παρασκευη μονο 9-12 (να δουν τo email πριν το weekend)
- Τριτη-Πεμπτη 9-17 (τοπικη ωρα παραληπτη)
- Μετα 4 μερες: Follow-up 1 (αυτοματα)
- Μετα 10 μερες απο FU1: Follow-up 2 / Final (αυτοματα)
- Ελεγχει αν εχει απαντησει πριν στειλει follow-up
- Σε ενημερωνει στο Telegram για ΚΑΘΕ email


======================================================================
ΒΗΜΑ 6: ΡΥΘΜΙΣΗ EMAIL TEMPLATES
======================================================================

Ο κωδικας εχει 3 email templates που πρεπει να αλλαξεις:

1. EMAIL 1 (πρωτη επαφη):
   - Ποιος εισαι, τι προσφερεις, γιατι τους γραφεις
   - Τελειωνει με ερωτηση (π.χ. "Θελετε να σας στειλω...")

2. FOLLOW-UP 1 (4 μερες μετα):
   - Συντομο, δεν επαναλαμβανει ολα
   - Προσθετει αξια (π.χ. link σε deck/pdf)
   - Urgency (π.χ. "η ζητηση αυξανεται")

3. FOLLOW-UP 2 / FINAL (10 μερες μετα FU1):
   - Τελευταιο μηνυμα, ευγενικο κλεισιμο
   - "Σε βαζω στη λιστα μας, οποτε χρειαστεις..."
   - Αφηνει ανοιχτη πορτα

ΣΗΜΑΝΤΙΚΟ: Τα emails στελνονται σε HTML format.
Αλλαξε τα στις functions: getEmail1(), getFollowUp1(), getFollowUp2()
Αλλαξε και το subject στη function: getSubjectLine()


======================================================================
ΒΗΜΑ 7: LINKEDIN COPY-PASTE (Bonus)
======================================================================

Το bot σου στελνει στο Telegram ΔΥΟ μηνυματα για καθε lead:

1. NOTIFICATION (κανονικο):
   Με ονομα, εταιρεια, χωρα, email, LinkedIn URL

2. COPY-PASTE TEXT (silent/αθορυβο):
   Ετοιμο κειμενο για να κανεις paste στο LinkedIn message
   Απλα πατα copy απο το Telegram → paste στο LinkedIn

Αυτο σημαινει: οταν στελνεται email, εσυ παιρνεις ειδοποιηση,
ανοιγεις το LinkedIn, και στελνεις κ εκει message μεσα σε 5 δευτερα.
Ετσι τους πιανεις απο 2 καναλια ταυτοχρονα.


======================================================================
ΟΛΟΚΛΗΡΗ Η ΡΟΗ (ΚΑΘΗΜΕΡΙΝΑ)
======================================================================

1. ΑΡΧΙΚΟ ΣΤΗΣΙΜΟ (μια φορα):
   Omkar → Claude καθαριζει → Paste στο Google Sheet

2. ΤΟ BOT ΔΟΥΛΕΥΕΙ ΜΟΝΟ ΤΟΥ:
   - Τριτη-Πεμπτη: ~50 emails/μερα (7/ωρα x ~7 ωρες)
   - Παρασκευη: ~20 emails (μονο πρωι)
   - Σαβ-Δευ: τιποτα
   - Follow-ups: αυτοματα στις 4 και 14 μερες

3. ΕΣΥ ΑΠΛΑ:
   - Βλεπεις Telegram ειδοποιησεις
   - Κανεις copy-paste στο LinkedIn (optional)
   - Απανταω σε replies
   - Καθε ~10 μερες: τροφοδοτεις με νεα leads (Omkar → Claude → Sheet)

4. ALERTS:
   - Οταν μεινουν < 100 leads → σου λεει "Feed me!"
   - Οταν τελειωσουν ολα → σου λεει "No more leads!"


======================================================================
ΚΟΣΤΟΣ
======================================================================

- Google Apps Script: ΔΩΡΕΑΝ
- Google Sheets: ΔΩΡΕΑΝ
- Gmail αποστολη: ΔΩΡΕΑΝ (μεχρι 500/μερα, εμεις στελνουμε 50)
- Telegram Bot: ΔΩΡΕΑΝ
- Omkar Starter: ~$15-20/μηνα (2000 credits)
- Claude: εχεις ηδη subscription

ΣΥΝΟΛΟ: ~$15-20/μηνα για πληρες αυτοματο outreach system
Αντικαθιστα εργαλεια που κοστιζουν $200-500+/μηνα (Apollo, Instantly, κλπ)


======================================================================
TIPS & GOTCHAS
======================================================================

1. ΖΕΣΤΑΜΑ EMAIL:
   Μην ξεκινησεις με 50/μερα αμεσως. Αρχισε 5-10/μερα
   και ανεβαινε σταδιακα σε 2 εβδομαδες.

2. DOMAIN EMAIL:
   Χρησιμοποιησε email απο δικο σου domain (π.χ. alex@yourbrand.com)
   ΟΧΙ gmail.com — θα πας στα spam.

3. SPF/DKIM/DMARC:
   Βεβαιωσου οτι το domain σου εχει σωστα DNS records.
   Ρωτα τον Claude: "βοηθα με να στησω SPF, DKIM, DMARC για το domain μου"

4. OMKAR CREDITS:
   Τα credits φευγουν στο enrichment (ευρεση email).
   Αν μια αναζητηση βγαζει 500 businesses, θα φαει 500 credits.
   Καντο σε μικρα batches (50-100 businesses).

5. ΠΟΙΟΤΗΤΑ > ΠΟΣΟΤΗΤΑ:
   Καλυτερα 50 σωστα leads με προσωπικα emails παρα 500 generic info@.
   Τα generic ΠΟΤΕ δεν απανταν.

6. FOLLOW-UP TIMING:
   Μπορεις να αλλαξεις τα delays στο CONFIG:
   FOLLOWUP_1_DAYS: 4  (ποσες μερες μετα το Email 1)
   FOLLOWUP_2_DAYS: 10 (ποσες μερες μετα το FU1)

7. DUPLICATE PROTECTION:
   Πριν βαλεις νεα leads, ΠΑΝΤΑ ελεγχε αν υπαρχουν ηδη στο sheet.
   Ο Claude το κανει αυτοματα αν του δωσεις και τα παλια.

8. TEST ΠΡΩΤΑ:
   Πριν ενεργοποιησεις τo trigger, στειλε δοκιμαστικα στον εαυτο σου.
   Βαλε ΕΝΑ row με το δικο σου email, τρεξε χειροκινητα: sendOutreach(true)


======================================================================
ΕΡΩΤΗΣΕΙΣ?
======================================================================

Οτιδηποτε δεν καταλαβαινεις, ρωτα τον Claude:
"Βοηθα με να στησω [X βημα] του outreach bot"

Η ρωτα εμενα! Καλη αρχη.
