# George Yachts — Outreach Automation Setup

## Step 1: Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create new spreadsheet
2. Name it: **George Yachts Outreach**
3. Name the first tab: **Prospects**
4. Create these exact column headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| first_name | last_name | email | company | country | linkedin_url | status | email1_date | followup1_date | followup2_date | notes |

5. Leave `status` empty for new prospects (or type `new`)
6. `linkedin_url` is optional but recommended

## Step 2: Install the Script

1. In the Google Sheet, go to **Extensions → Apps Script**
2. Delete everything in the editor
3. Copy-paste the entire contents of `outreach-automation.gs`
4. Click **Save** (Ctrl+S)

## Step 3: Enable Gmail API (for signature)

1. In Apps Script editor, click **Services** (+ icon on left sidebar)
2. Find **Gmail API** and click **Add**
3. This enables automatic signature on all outgoing emails

## Step 4: Test

1. In the script editor, select `testTelegram` from the dropdown
2. Click **Run** ▶
3. First time: Google will ask for permissions — click **Allow**
4. Check Telegram — you should see a test message

## Step 5: Activate

1. Add 1-2 test prospects (use your own email)
2. Select `manualSend` and click **Run** ▶
3. Check that you received the test email with your signature
4. If everything looks good, run `setupTriggers` to activate automation

## How It Works

```
Hour 1:  Script reads sheet → finds "new" prospects → sends Email 1
         → Telegram: "Email sent to John (ABC Travel)" + LinkedIn link
         → Wait 30-90 sec between emails (looks human)

Day 4:   Script finds prospects with status "email1" sent 4+ days ago
         → Checks if they replied (if yes, marks as "replied")
         → If no reply → sends Follow-up 1

Day 14:  Script finds prospects with status "followup1" sent 10+ days ago
         → Same reply check
         → If no reply → sends Final Follow-up → marks "completed"
```

## Controls

| Function | What it does |
|----------|-------------|
| `setupTriggers` | Starts automation (run once) |
| `pauseAutomation` | Stops everything |
| `manualSend` | Manually trigger one send cycle |
| `manualCheckReplies` | Manually check for replies |
| `resetDailyCounter` | Reset today's send limit |
| `testTelegram` | Test Telegram connection |
| `testSignature` | Test signature fetching |

## Telegram Notifications You'll Receive

- 📧 Every email sent (with LinkedIn link if available)
- 🎉 Every reply (with preview of their response)
- ⚠️ Daily limit reached
- 📊 Daily summary at 21:00 Athens time
- ✅ Automation started/paused

## Warm-up Schedule

Start conservative to protect deliverability:

| Week | Daily Limit | Change CONFIG.DAILY_LIMIT to |
|------|-------------|------|
| Week 1 | 15/day | 15 |
| Week 2 | 25/day | 25 |
| Week 3 | 40/day | 40 |
| Week 4+ | 50/day | 50 |

## Adding Prospects

Just paste rows into the Google Sheet:
- Fill: first_name, email, company (minimum)
- Leave status empty or "new"
- Add linkedin_url when available
- Script picks them up automatically on next run

## Important Notes

- Emails send only 9AM-5PM Athens time (configurable)
- 30-90 second random delay between emails (anti-spam)
- Reply detection runs every 30 minutes
- Follow-ups go as "Re:" in same email thread
- Your Gmail signature is included automatically
- Use Instantly for warm-up (keep it running)
