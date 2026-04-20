# Omkar Lead Search — Instructions for Domingo

## Goal
Find **quality B2B leads** for George Yachts — luxury travel professionals who can refer yacht charter clients to us. NOT random contacts. Every lead must be a real person at a real company that books luxury travel.

---

## What George Yachts Does
- Boutique yacht charter brokerage in Greece
- Works **B2B only** — we partner with travel agencies, luxury advisors, DMCs, concierge firms
- They send us their clients, we handle the yacht, they earn commission
- Fleet: 4 tiers from EUR 5K to EUR 100K+/week

---

## Omkar Search Strategy

### ROUND 1 — UK & Northern Europe (highest value, English-speaking)

| Search Query | Locations | Notes |
|---|---|---|
| "luxury travel agency" | London, Manchester, Edinburgh, Dublin | Core target |
| "bespoke travel advisor" | London, Surrey, Cotswolds | High-net-worth clientele |
| "luxury tour operator" | London, Birmingham | Look for Greece/Mediterranean focus |
| "yacht charter agency" | London, Southampton, Monaco | Direct competitors = partners |
| "concierge travel service" | London, Edinburgh | VIP clients |
| "travel designer" | UK wide | Newer term for luxury advisors |
| "villa rental agency Greece" | UK wide | They already sell Greece, easy upsell to yachts |

### ROUND 2 — Western Europe

| Search Query | Locations | Notes |
|---|---|---|
| "agence de voyage luxe" | Paris, Lyon, Nice, Cannes | French luxury market |
| "Luxusreiseburo" | Munich, Hamburg, Frankfurt, Berlin | German market (big spenders) |
| "agenzia viaggi lusso" | Milan, Rome | Italian market |
| "luxury travel agency" | Amsterdam, Zurich, Geneva, Vienna | Benelux + Swiss |
| "yacht charter" | Monaco, Antibes, Palma de Mallorca | Mediterranean yacht hubs |
| "DMC Greece" | All European capitals | Already send clients to Greece! |

### ROUND 3 — USA (huge market)

| Search Query | Locations | Notes |
|---|---|---|
| "luxury travel advisor" | New York, Miami, Los Angeles, Chicago | Major wealth centers |
| "yacht charter broker" | Fort Lauderdale, Newport, Annapolis | Yacht industry hubs |
| "honeymoon travel planner" | New York, LA, San Francisco | Greece = top honeymoon destination |
| "luxury cruise planner" | Florida, California | Adjacent market |
| "corporate retreat planner" | New York, Chicago, Dallas, San Francisco | Corporate yacht charters |
| "Virtuoso travel advisor" | USA wide | Virtuoso = top luxury travel network |

### ROUND 4 — Middle East & Gulf

| Search Query | Locations | Notes |
|---|---|---|
| "luxury travel agency" | Dubai, Abu Dhabi, Doha | Gulf wealth → Greece charters |
| "VIP concierge" | Dubai, Riyadh, Jeddah | Ultra high-net-worth |
| "MICE travel agency" | Dubai, Qatar | Corporate events on yachts |
| "travel agency" + "luxury" | Kuwait City, Bahrain, Muscat | Smaller but wealthy markets |

### ROUND 5 — Australia & Other

| Search Query | Locations | Notes |
|---|---|---|
| "luxury travel advisor" | Sydney, Melbourne | Aussies love Greece |
| "bespoke holiday planner" | Sydney, Auckland | Long-haul luxury |
| "luxury travel agency" | Toronto, Vancouver | Canadian market |
| "luxury travel" | Johannesburg, Cape Town | South African wealth |

---

## QUALITY FILTERS — CRITICAL

### MUST HAVE (skip lead if missing):
- **Real person's name** (first + last) — NO "info@" or "hello@" generic emails
- **Business email** — must be name@company.com, NOT gmail/yahoo/hotmail
- **Company name** — must be a real, identifiable business
- **Country** — always fill this column (needed for timezone sending)

### RED FLAGS — SKIP these:
- Generic contact emails (info@, contact@, hello@, sales@, enquiries@)
- Companies with no website or dead websites
- Companies that look like scams or very low quality
- Travel agencies focused only on budget/backpacker travel
- Companies in unrelated industries
- Duplicate entries (same person or same company)

### GREEN FLAGS — PRIORITIZE these:
- Personal email (john.smith@company.com)
- Company website mentions "luxury", "bespoke", "premium", "VIP", "yacht", "Greece"
- LinkedIn profile available (add the URL!)
- Company has Google reviews > 4 stars
- Company is member of Virtuoso, Ensemble, Travel Leaders, ASTA
- Role titles: Owner, Director, Manager, Senior Advisor, Founder

---

## CSV Output Format

The CSV file MUST have these exact column headers (first row):

```
first_name,last_name,email,company,country,linkedin_url
```

### Example rows:
```
first_name,last_name,email,company,country,linkedin_url
John,Smith,john.smith@luxurytravel.co.uk,Luxury Travel Ltd,UK,https://linkedin.com/in/johnsmith
Marie,Dupont,m.dupont@voyagesluxe.fr,Voyages de Luxe,France,
Ahmed,Al-Hassan,ahmed@viptravel.ae,VIP Travel Dubai,UAE,https://linkedin.com/in/ahmedh
Sarah,Johnson,sarah@elitegetaways.com,Elite Getaways,USA,
```

### Rules:
- UTF-8 encoding
- Comma separated
- No quotes unless the value contains a comma
- One person per row (if a company has 2 contacts, make 2 rows)
- Country = full country name in English (e.g., "UK", "France", "USA", "UAE")

---

## Where to Save the CSV

Save the CSV file to:
```
/Users/georgep.biniarisgeorgeyachtsbrokeragehousellc/Desktop/george-yachts/leads/
```

Filename format: `omkar-leads-YYYY-MM-DD.csv`
Example: `omkar-leads-2026-04-03.csv`

---

## Workflow After Export

1. Domingo exports CSV from Omkar
2. Open Google Sheet: **"George Yachts Outreach"** → tab **"Prospects"**
   - Sheet URL: https://docs.google.com/spreadsheets/d/1v6Y7mBhijrN87-m6uB612m4zShuQv0WIsEonBYjcXuY/edit
3. Go to the first empty row
4. Paste the data (make sure columns align with the headers)
5. Leave "status" column empty — the automation picks them up
6. Leave "email1_date", "followup1_date", "followup2_date", "notes" empty

---

## Volume Plan

| Week | Target Leads | Daily Send Limit | Focus Markets |
|------|-------------|-----------------|---------------|
| Week 1 | 50-80 leads | 15/day | UK + Northern Europe |
| Week 2 | 80-100 leads | 25/day | + USA + Western Europe |
| Week 3 | 100+ leads | 40/day | + Middle East + Australia |
| Week 4+ | 100+/week | 50/day | Rotating all markets |

---

## Important Notes

- **Quality > Quantity** — 50 good leads beat 500 garbage ones
- **Never send to the same person twice** — check the sheet before adding
- **If Omkar doesn't give personal emails** for a company, Domingo should Google the company + LinkedIn to find the right person
- **If a company looks great but Omkar only has generic email** — skip it in the CSV, but note it separately so we can find the right person manually later
