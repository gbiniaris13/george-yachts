// =====================================================
// GEORGE YACHTS — OUTREACH AUTOMATION v3
// Google Apps Script — 100% free, runs on Google servers
// Replaces Apollo.io / Instantly for email sequences
// =====================================================

// ===== CONFIGURATION =====
const CONFIG = {
  // Telegram notifications
  TELEGRAM_BOT_TOKEN: '8773911706:AAFixtS_3kQLWB4G3FL9vMt4v5AKh9sNtqo',
  TELEGRAM_CHAT_ID: '8478263770',

  // Email settings
  SENDER_EMAIL: 'george@georgeyachts.com',
  SENDER_NAME: 'George Biniaris',

  // Follow-up timing (in days)
  FOLLOWUP_1_DAYS: 4,
  FOLLOWUP_2_DAYS: 10,

  // Daily sending limit (safe for warmed-up account)
  DAILY_LIMIT: 50,

  // Max emails per trigger run (hourly) — spreads sends across the day
  PER_RUN_LIMIT: 7,

  // Default business hours (used if country not found)
  SEND_HOUR_START: 9,
  SEND_HOUR_END: 17,

  // Sheet name
  SHEET_NAME: 'Prospects',

  // Partnership deck URL
  DECK_URL: 'https://bit.ly/GeorgeYachts-Partners',
};


// =====================================================
// COUNTRY → TIMEZONE MAPPING
// Sends during each prospect's local business hours
// =====================================================

function getTimezoneForCountry_(country) {
  if (!country) return 'Europe/Athens';
  var c = String(country).toLowerCase().trim();

  var map = {
    // Europe
    'greece': 'Europe/Athens', 'ελλάδα': 'Europe/Athens', 'gr': 'Europe/Athens',
    'uk': 'Europe/London', 'united kingdom': 'Europe/London', 'england': 'Europe/London', 'scotland': 'Europe/London', 'wales': 'Europe/London',
    'france': 'Europe/Paris', 'fr': 'Europe/Paris',
    'germany': 'Europe/Berlin', 'de': 'Europe/Berlin', 'deutschland': 'Europe/Berlin',
    'italy': 'Europe/Rome', 'it': 'Europe/Rome', 'italia': 'Europe/Rome',
    'spain': 'Europe/Madrid', 'es': 'Europe/Madrid', 'españa': 'Europe/Madrid',
    'portugal': 'Europe/Lisbon', 'pt': 'Europe/Lisbon',
    'netherlands': 'Europe/Amsterdam', 'nl': 'Europe/Amsterdam', 'holland': 'Europe/Amsterdam',
    'belgium': 'Europe/Brussels', 'be': 'Europe/Brussels',
    'switzerland': 'Europe/Zurich', 'ch': 'Europe/Zurich',
    'austria': 'Europe/Vienna', 'at': 'Europe/Vienna',
    'sweden': 'Europe/Stockholm', 'se': 'Europe/Stockholm',
    'norway': 'Europe/Oslo', 'no': 'Europe/Oslo',
    'denmark': 'Europe/Copenhagen', 'dk': 'Europe/Copenhagen',
    'finland': 'Europe/Helsinki', 'fi': 'Europe/Helsinki',
    'poland': 'Europe/Warsaw', 'pl': 'Europe/Warsaw',
    'czech republic': 'Europe/Prague', 'czechia': 'Europe/Prague',
    'ireland': 'Europe/Dublin', 'ie': 'Europe/Dublin',
    'croatia': 'Europe/Zagreb', 'hr': 'Europe/Zagreb',
    'romania': 'Europe/Bucharest', 'ro': 'Europe/Bucharest',
    'bulgaria': 'Europe/Sofia', 'bg': 'Europe/Sofia',
    'hungary': 'Europe/Budapest', 'hu': 'Europe/Budapest',
    'turkey': 'Europe/Istanbul', 'tr': 'Europe/Istanbul', 'türkiye': 'Europe/Istanbul',
    'russia': 'Europe/Moscow', 'ru': 'Europe/Moscow',
    'cyprus': 'Asia/Nicosia',
    'monaco': 'Europe/Monaco',
    'malta': 'Europe/Malta',
    'montenegro': 'Europe/Podgorica',
    'albania': 'Europe/Tirane',
    'luxembourg': 'Europe/Luxembourg',

    // Middle East
    'uae': 'Asia/Dubai', 'united arab emirates': 'Asia/Dubai', 'dubai': 'Asia/Dubai', 'abu dhabi': 'Asia/Dubai',
    'saudi arabia': 'Asia/Riyadh', 'ksa': 'Asia/Riyadh',
    'qatar': 'Asia/Qatar', 'doha': 'Asia/Qatar',
    'bahrain': 'Asia/Bahrain',
    'kuwait': 'Asia/Kuwait',
    'oman': 'Asia/Muscat',
    'israel': 'Asia/Jerusalem', 'il': 'Asia/Jerusalem',
    'jordan': 'Asia/Amman',
    'lebanon': 'Asia/Beirut',
    'egypt': 'Africa/Cairo', 'eg': 'Africa/Cairo',

    // Americas
    'usa': 'America/New_York', 'united states': 'America/New_York', 'us': 'America/New_York',
    'usa east': 'America/New_York', 'usa west': 'America/Los_Angeles',
    'new york': 'America/New_York', 'california': 'America/Los_Angeles', 'florida': 'America/New_York',
    'texas': 'America/Chicago', 'chicago': 'America/Chicago',
    'los angeles': 'America/Los_Angeles', 'miami': 'America/New_York',
    'canada': 'America/Toronto', 'ca': 'America/Toronto',
    'mexico': 'America/Mexico_City', 'mx': 'America/Mexico_City',
    'brazil': 'America/Sao_Paulo', 'br': 'America/Sao_Paulo',
    'argentina': 'America/Argentina/Buenos_Aires', 'ar': 'America/Argentina/Buenos_Aires',
    'colombia': 'America/Bogota', 'co': 'America/Bogota',
    'chile': 'America/Santiago',
    'peru': 'America/Lima',

    // Asia Pacific
    'china': 'Asia/Shanghai', 'cn': 'Asia/Shanghai',
    'japan': 'Asia/Tokyo', 'jp': 'Asia/Tokyo',
    'south korea': 'Asia/Seoul', 'korea': 'Asia/Seoul', 'kr': 'Asia/Seoul',
    'india': 'Asia/Kolkata', 'in': 'Asia/Kolkata',
    'singapore': 'Asia/Singapore', 'sg': 'Asia/Singapore',
    'hong kong': 'Asia/Hong_Kong', 'hk': 'Asia/Hong_Kong',
    'thailand': 'Asia/Bangkok', 'th': 'Asia/Bangkok',
    'malaysia': 'Asia/Kuala_Lumpur', 'my': 'Asia/Kuala_Lumpur',
    'indonesia': 'Asia/Jakarta', 'id': 'Asia/Jakarta',
    'philippines': 'Asia/Manila', 'ph': 'Asia/Manila',
    'vietnam': 'Asia/Ho_Chi_Minh',
    'taiwan': 'Asia/Taipei',
    'australia': 'Australia/Sydney', 'au': 'Australia/Sydney',
    'new zealand': 'Pacific/Auckland', 'nz': 'Pacific/Auckland',

    // Africa
    'south africa': 'Africa/Johannesburg', 'za': 'Africa/Johannesburg',
    'morocco': 'Africa/Casablanca', 'ma': 'Africa/Casablanca',
    'nigeria': 'Africa/Lagos',
    'kenya': 'Africa/Nairobi',
    'tanzania': 'Africa/Dar_es_Salaam',
  };

  if (map[c]) return map[c];

  // Fuzzy match: check if country contains any key
  var keys = Object.keys(map);
  for (var k = 0; k < keys.length; k++) {
    if (c.indexOf(keys[k]) !== -1 || keys[k].indexOf(c) !== -1) {
      return map[keys[k]];
    }
  }

  return 'Europe/Athens'; // Default fallback
}

// Country → Flag emoji for Telegram
function countryFlag_(country) {
  if (!country) return '\ud83c\udf0d';
  var c = String(country).toLowerCase().trim();
  var flags = {
    'greece': '\ud83c\uddec\ud83c\uddf7', 'gr': '\ud83c\uddec\ud83c\uddf7',
    'uk': '\ud83c\uddec\ud83c\udde7', 'united kingdom': '\ud83c\uddec\ud83c\udde7', 'england': '\ud83c\uddec\ud83c\udde7',
    'usa': '\ud83c\uddfa\ud83c\uddf8', 'united states': '\ud83c\uddfa\ud83c\uddf8', 'us': '\ud83c\uddfa\ud83c\uddf8',
    'france': '\ud83c\uddeb\ud83c\uddf7', 'fr': '\ud83c\uddeb\ud83c\uddf7',
    'germany': '\ud83c\udde9\ud83c\uddea', 'de': '\ud83c\udde9\ud83c\uddea',
    'italy': '\ud83c\uddee\ud83c\uddf9', 'it': '\ud83c\uddee\ud83c\uddf9',
    'spain': '\ud83c\uddea\ud83c\uddf8', 'es': '\ud83c\uddea\ud83c\uddf8',
    'netherlands': '\ud83c\uddf3\ud83c\uddf1', 'nl': '\ud83c\uddf3\ud83c\uddf1',
    'switzerland': '\ud83c\udde8\ud83c\udded', 'ch': '\ud83c\udde8\ud83c\udded',
    'austria': '\ud83c\udde6\ud83c\uddf9', 'at': '\ud83c\udde6\ud83c\uddf9',
    'belgium': '\ud83c\udde7\ud83c\uddea', 'be': '\ud83c\udde7\ud83c\uddea',
    'sweden': '\ud83c\uddf8\ud83c\uddea', 'se': '\ud83c\uddf8\ud83c\uddea',
    'norway': '\ud83c\uddf3\ud83c\uddf4', 'no': '\ud83c\uddf3\ud83c\uddf4',
    'denmark': '\ud83c\udde9\ud83c\uddf0', 'dk': '\ud83c\udde9\ud83c\uddf0',
    'portugal': '\ud83c\uddf5\ud83c\uddf9', 'pt': '\ud83c\uddf5\ud83c\uddf9',
    'ireland': '\ud83c\uddee\ud83c\uddea', 'ie': '\ud83c\uddee\ud83c\uddea',
    'uae': '\ud83c\udde6\ud83c\uddea', 'united arab emirates': '\ud83c\udde6\ud83c\uddea', 'dubai': '\ud83c\udde6\ud83c\uddea',
    'saudi arabia': '\ud83c\uddf8\ud83c\udde6', 'qatar': '\ud83c\uddf6\ud83c\udde6',
    'australia': '\ud83c\udde6\ud83c\uddfa', 'au': '\ud83c\udde6\ud83c\uddfa',
    'canada': '\ud83c\udde8\ud83c\udde6', 'ca': '\ud83c\udde8\ud83c\udde6',
    'japan': '\ud83c\uddef\ud83c\uddf5', 'china': '\ud83c\udde8\ud83c\uddf3',
    'india': '\ud83c\uddee\ud83c\uddf3', 'brazil': '\ud83c\udde7\ud83c\uddf7',
    'south africa': '\ud83c\uddff\ud83c\udde6', 'turkey': '\ud83c\uddf9\ud83c\uddf7',
    'croatia': '\ud83c\udded\ud83c\uddf7', 'cyprus': '\ud83c\udde8\ud83c\uddfe',
    'monaco': '\ud83c\uddf2\ud83c\udde8', 'malta': '\ud83c\uddf2\ud83c\uddf9',
    'poland': '\ud83c\uddf5\ud83c\uddf1', 'mexico': '\ud83c\uddf2\ud83c\uddfd',
    'singapore': '\ud83c\uddf8\ud83c\uddec', 'new zealand': '\ud83c\uddf3\ud83c\uddff',
    'israel': '\ud83c\uddee\ud83c\uddf1', 'russia': '\ud83c\uddf7\ud83c\uddfa',
    'finland': '\ud83c\uddeb\ud83c\uddee', 'hungary': '\ud83c\udded\ud83c\uddfa',
    'romania': '\ud83c\uddf7\ud83c\uddf4', 'bulgaria': '\ud83c\udde7\ud83c\uddec',
    'czech republic': '\ud83c\udde8\ud83c\uddff', 'czechia': '\ud83c\udde8\ud83c\uddff',
  };
  if (flags[c]) return flags[c];
  var keys = Object.keys(flags);
  for (var k = 0; k < keys.length; k++) {
    if (c.indexOf(keys[k]) !== -1 || keys[k].indexOf(c) !== -1) return flags[keys[k]];
  }
  return '\ud83c\udf0d';
}

function isBusinessHours_(country) {
  var tz = getTimezoneForCountry_(country);
  var now = new Date();
  var hour = parseInt(Utilities.formatDate(now, tz, 'H'));
  var dayOfWeek = parseInt(Utilities.formatDate(now, tz, 'u')); // 1=Mon, 7=Sun

  // NO sending on Saturday (6), Sunday (7), or Monday (1)
  if (dayOfWeek === 6 || dayOfWeek === 7 || dayOfWeek === 1) return false;

  // Friday (5): only 9:00-12:00 — so they see it before weekend
  if (dayOfWeek === 5) return hour >= 9 && hour < 12;

  // Tuesday-Thursday (2-4): normal 9:00-17:00
  return hour >= CONFIG.SEND_HOUR_START && hour < CONFIG.SEND_HOUR_END;
}


// =====================================================
// EMAIL TEMPLATES — Improved & Universal
// =====================================================

function getSubjectLine(prospect) {
  return 'Yacht charters in Greece \u2014 partnership inquiry';
}

function getEmail1(prospect) {
  var name = prospect.firstName || 'there';
  var companyLine = prospect.company
    ? '<p>I came across ' + prospect.company + ' and wanted to reach out directly.</p>'
    : '<p>I came across your work in luxury travel and wanted to reach out directly.</p>';

  return '<p>Hi ' + name + ',</p>' +
    companyLine +
    '<p>I run George Yachts, a boutique charter brokerage based in Athens. We work strictly B2B \u2014 partnering with travel professionals to deliver premium yacht experiences across Greece.</p>' +
    '<p><strong>What we offer partners:</strong></p>' +
    '<ul style="line-height: 1.8;">' +
    '  <li>White-label proposals in under 4 hours</li>' +
    '  <li>Full commission paid within 7 days of contract</li>' +
    '  <li>Real-time fleet access \u2014 we\'re physically on the docks in Athens</li>' +
    '  <li>4 fleet tiers from \u20ac5K to \u20ac100K+/week</li>' +
    '</ul>' +
    '<p>Would it be worth sending you our one-page Partnership Deck?</p>';
}

function getFollowUp1(prospect) {
  var name = prospect.firstName || 'there';
  return '<p>Hi ' + name + ',</p>' +
    '<p>Quick follow-up \u2014 I know how busy this time of year gets.</p>' +
    '<p>Greece is seeing record charter demand for 2026, with many clients pivoting away from traditional Gulf destinations. Peak-summer availability is thinning fast.</p>' +
    '<p>Here\'s our Partnership Deck for a quick look:<br>' +
    '<a href="' + CONFIG.DECK_URL + '">' + CONFIG.DECK_URL + '</a></p>' +
    '<p>Happy to answer any questions \u2014 even if it\'s just about the Greek market in general.</p>';
}

function getFollowUp2(prospect) {
  var name = prospect.firstName || 'there';
  var companyRef = prospect.company ? prospect.company : 'your agency';
  return '<p>Hi ' + name + ',</p>' +
    '<p>Last note from me \u2014 I don\'t want to crowd your inbox.</p>' +
    '<p>I\'m placing ' + companyRef + ' on our partner on-call list. Whenever a client asks about Greece \u2014 a last-minute request, a bespoke itinerary, or anything where you need a reliable contact on the ground \u2014 we\'re one message away.</p>' +
    '<p>Single point of contact. Dedicated line. No runaround.</p>' +
    '<p>Wishing you a strong season ahead.</p>';
}


// =====================================================
// MAIN: SEND OUTREACH — runs every hour
// Per-prospect timezone: sends only when it's business
// hours in THEIR country
// =====================================================

function sendOutreach(skipHoursCheck) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) { Logger.log('Sheet not found: ' + CONFIG.SHEET_NAME); return; }

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return; // Only headers, no data

  var headers = data[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var col = function(name) { return headers.indexOf(name); };

  var today = new Date();
  var sentToday = getSentToday_();
  var sentThisRun = 0;
  var skippedTimezone = 0;

  for (var i = 1; i < data.length; i++) {
    // Per-run limit: max 7 emails per hourly trigger (spreads across day)
    if (sentThisRun >= CONFIG.PER_RUN_LIMIT) {
      Logger.log('Per-run limit reached (' + CONFIG.PER_RUN_LIMIT + '). Next batch in 1 hour.');
      break;
    }

    if (sentToday >= CONFIG.DAILY_LIMIT) {
      sendTelegram_('\u26a0\ufe0f Daily limit reached (' + CONFIG.DAILY_LIMIT + '). Remaining prospects continue tomorrow.');
      break;
    }

    var row = data[i];
    var status = String(row[col('status')] || '').toLowerCase().trim();
    var firstName = row[col('first_name')] || '';
    var email = row[col('email')] || '';
    var company = row[col('company')] || '';
    var country = row[col('country')] || '';
    var linkedinUrl = row[col('linkedin_url')] || '';

    if (!email) continue; // Skip empty rows

    // Check business hours in prospect's timezone (unless manual override)
    if (!skipHoursCheck && !isBusinessHours_(country)) {
      skippedTimezone++;
      continue;
    }

    var prospect = { firstName: firstName, email: email, company: company, linkedinUrl: linkedinUrl };

    try {
      // --- NEW PROSPECTS: Send Email 1 ---
      if (status === 'new' || status === '') {
        // Quick reply check before sending
        if (hasReplied_(email)) {
          sheet.getRange(i + 1, col('status') + 1).setValue('replied');
          continue;
        }

        sendEmail_(prospect.email, getSubjectLine(prospect), getEmail1(prospect));

        sheet.getRange(i + 1, col('status') + 1).setValue('email1');
        sheet.getRange(i + 1, col('email1_date') + 1).setValue(today);
        sentToday++;
        sentThisRun++;

        // Telegram notification with flag + LinkedIn + copy-paste
        var flag = countryFlag_(country);
        var emailMsg = flag + ' \ud83d\udce7 *Email 1 sent*\n\n' +
          '\ud83d\udc64 ' + firstName + ' ' + (row[col('last_name')] || '') + '\n' +
          '\ud83c\udfe2 ' + company + '\n' +
          flag + ' ' + country + '\n' +
          '\ud83d\udce8 ' + email;

        if (linkedinUrl) {
          emailMsg += '\n\n\ud83d\udd17 *LinkedIn:* ' + linkedinUrl;
          emailMsg += '\n\n\u2702\ufe0f *Copy-paste for LinkedIn:*';
          emailMsg += '\n\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015';
          emailMsg += '\nHi ' + firstName + ', I just reached out via email from george@georgeyachts.com about yacht charter partnerships in Greece. In case it landed in spam, the subject is "Yacht charters in Greece". Would love to connect!';
          emailMsg += '\n\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015';
        }

        sendTelegram_(emailMsg);

        Utilities.sleep(randomDelay_()); // Human-like delay

      // --- FOLLOW-UP 1: 4 days after Email 1 ---
      } else if (status === 'email1') {
        var email1Date = new Date(row[col('email1_date')]);
        var daysSinceE1 = daysBetween_(email1Date, today);

        if (daysSinceE1 >= CONFIG.FOLLOWUP_1_DAYS) {
          if (hasReplied_(email)) {
            sheet.getRange(i + 1, col('status') + 1).setValue('replied');
            sendTelegram_('\ud83c\udf89 *Reply detected* from ' + firstName + ' (' + company + ') \u2014 skipping follow-up 1');
            continue;
          }

          // BEFORE sending follow-up: notify George to approach on LinkedIn
          if (linkedinUrl) {
            var fu1Flag = countryFlag_(country);
            sendTelegram_(
              fu1Flag + ' \ud83d\udd14 *Follow-up 1 about to send* to ' + firstName + ' (' + company + ')\n\n' +
              '\ud83d\udd17 *LinkedIn:* ' + linkedinUrl + '\n\n' +
              '\u2702\ufe0f *Copy-paste for LinkedIn:*\n' +
              '\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\n' +
              'Hi ' + firstName + ', following up on my email from george@georgeyachts.com about yacht charter partnerships in Greece. In case it went to spam, look for subject "Yacht charters in Greece". Are you open to a quick chat?\n' +
              '\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015'
            );
          }

          sendEmail_(prospect.email, 'Re: ' + getSubjectLine(prospect), getFollowUp1(prospect));

          sheet.getRange(i + 1, col('status') + 1).setValue('followup1');
          sheet.getRange(i + 1, col('followup1_date') + 1).setValue(today);
          sentToday++;
          sentThisRun++;

          sendTelegram_('\ud83d\udce7 *Follow-up 1 sent* to ' + firstName + ' (' + company + ')');
          Utilities.sleep(randomDelay_());
        }

      // --- FOLLOW-UP 2: 10 days after Follow-up 1 ---
      } else if (status === 'followup1') {
        var fu1Date = new Date(row[col('followup1_date')]);
        var daysSinceFU1 = daysBetween_(fu1Date, today);

        if (daysSinceFU1 >= CONFIG.FOLLOWUP_2_DAYS) {
          if (hasReplied_(email)) {
            sheet.getRange(i + 1, col('status') + 1).setValue('replied');
            sendTelegram_('\ud83c\udf89 *Reply detected* from ' + firstName + ' (' + company + ') \u2014 skipping follow-up 2');
            continue;
          }

          // BEFORE sending final follow-up: last chance LinkedIn touch
          if (linkedinUrl) {
            var fu2Flag = countryFlag_(country);
            sendTelegram_(
              fu2Flag + ' \ud83d\udd14 *Final follow-up about to send* to ' + firstName + ' (' + company + ')\n\n' +
              '\ud83d\udd17 *LinkedIn:* ' + linkedinUrl + '\n\n' +
              '\u2702\ufe0f *Copy-paste for LinkedIn:*\n' +
              '\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\n' +
              'Hi ' + firstName + ', this is my final outreach about yacht charter partnerships in Greece. We sent emails from george@georgeyachts.com \u2014 please check spam if you missed them. If the timing isn\'t right, no worries. Wishing you a great season!\n' +
              '\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015'
            );
          }

          sendEmail_(prospect.email, 'Re: ' + getSubjectLine(prospect), getFollowUp2(prospect));

          sheet.getRange(i + 1, col('status') + 1).setValue('completed');
          sheet.getRange(i + 1, col('followup2_date') + 1).setValue(today);
          sentToday++;
          sentThisRun++;

          sendTelegram_('\ud83d\udce7 *Final follow-up sent* to ' + firstName + ' (' + company + ') \u2014 sequence complete');
          Utilities.sleep(randomDelay_());
        }
      }

    } catch (e) {
      Logger.log('Error row ' + (i + 1) + ': ' + e.message);
      sheet.getRange(i + 1, col('status') + 1).setValue('error');
      sheet.getRange(i + 1, col('notes') + 1).setValue(e.message.substring(0, 100));
    }
  }

  // Save today's count
  PropertiesService.getScriptProperties().setProperty('sent_' + todayKey_(), String(sentToday));

  if (sentThisRun > 0) {
    Logger.log('Sent ' + sentThisRun + ' emails this run. Total today: ' + sentToday);
  }
  if (skippedTimezone > 0) {
    Logger.log('Skipped ' + skippedTimezone + ' prospects (outside their business hours)');
  }

  // Check if there are any remaining prospects
  var remaining = 0;
  for (var r = 1; r < data.length; r++) {
    var st = String(data[r][col('status')] || '').toLowerCase().trim();
    if (st === 'new' || st === '') remaining++;
  }
  // Alert when leads running low (< 100 remaining)
  if (remaining > 0 && remaining <= 100) {
    var lowLeadKey = 'low_leads_notified_' + todayKey_();
    if (!PropertiesService.getScriptProperties().getProperty(lowLeadKey)) {
      sendTelegram_(
        '\u26a0\ufe0f *Low on leads! Only ' + remaining + ' remaining*\n\n' +
        'Time to search for new leads with Omkar!\n\n' +
        '\ud83d\udd0d *Search queries to try:*\n' +
        '  \u2022 "luxury travel agency" \u2014 London, NYC, Dubai\n' +
        '  \u2022 "bespoke travel advisor" \u2014 UK, Switzerland\n' +
        '  \u2022 "yacht charter agency" \u2014 Monaco, Southampton\n' +
        '  \u2022 "Virtuoso travel advisor" \u2014 USA wide\n' +
        '  \u2022 "DMC Greece" \u2014 European capitals\n' +
        '  \u2022 "luxury tour operator" \u2014 Mediterranean focus\n' +
        '  \u2022 "VIP concierge" \u2014 Dubai, Qatar\n\n' +
        '\ud83d\udcdd *CSV format:*\n' +
        'first\\_name, last\\_name, email, company, country, linkedin\\_url\n\n' +
        '\u2b06\ufe0f Send CSV directly here to import!'
      );
      PropertiesService.getScriptProperties().setProperty(lowLeadKey, 'true');
    }
  }

  if (remaining === 0 && sentThisRun > 0) {
    sendTelegram_(
      '\ud83d\udea8 *No more new leads!*\n\n' +
      'All ' + stats.total + ' prospects have been contacted.\n\n' +
      '\ud83d\udd0d *Urgent: Search for new leads!*\n\n' +
      '*Top priority searches:*\n' +
      '  \u2022 "luxury travel agency" \u2014 London, NYC, Miami, Dubai\n' +
      '  \u2022 "bespoke travel advisor" \u2014 UK, Switzerland\n' +
      '  \u2022 "yacht charter broker" \u2014 Fort Lauderdale, Monaco\n' +
      '  \u2022 "honeymoon planner Greece" \u2014 USA wide\n' +
      '  \u2022 "agence de voyage luxe" \u2014 Paris, Nice\n' +
      '  \u2022 "Luxusreisebuero" \u2014 Munich, Hamburg\n\n' +
      '\u2b06\ufe0f Send CSV to reload the pipeline!'
    );
  } else if (remaining === 0 && sentThisRun === 0) {
    var notifiedKey = 'no_leads_notified_' + todayKey_();
    if (!PropertiesService.getScriptProperties().getProperty(notifiedKey)) {
      sendTelegram_(
        '\ud83d\udcea *Pipeline empty* \u2014 no new leads.\n' +
        'Send me a CSV to reload!'
      );
      PropertiesService.getScriptProperties().setProperty(notifiedKey, 'true');
    }
  }
}


// =====================================================
// CHECK REPLIES — runs every 30 minutes
// =====================================================

function checkReplies() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var col = function(name) { return headers.indexOf(name); };

  var repliesFound = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var status = String(row[col('status')] || '').toLowerCase().trim();
    var email = row[col('email')] || '';
    var firstName = row[col('first_name')] || '';
    var company = row[col('company')] || '';

    // Only check active sequences
    if (['email1', 'followup1', 'followup2', 'completed'].indexOf(status) === -1) continue;
    if (!email) continue;

    var email1Date = row[col('email1_date')];
    if (!email1Date) continue;

    // Search for messages FROM this person after our first email
    var threads = GmailApp.search('from:' + email + ' newer_than:30d', 0, 5);

    for (var t = 0; t < threads.length; t++) {
      var messages = threads[t].getMessages();
      for (var m = 0; m < messages.length; m++) {
        var msg = messages[m];
        var msgFrom = msg.getFrom();
        var msgDate = msg.getDate();

        if (msgFrom.indexOf(email) !== -1 && msgDate > new Date(email1Date)) {
          // Found a reply!
          sheet.getRange(i + 1, col('status') + 1).setValue('replied');
          sheet.getRange(i + 1, col('notes') + 1).setValue('Replied: ' + Utilities.formatDate(msgDate, 'Europe/Athens', 'dd/MM HH:mm'));
          repliesFound++;

          var preview = msg.getPlainBody().substring(0, 300).replace(/\n+/g, ' ');

          sendTelegram_(
            '\ud83c\udf89 *REPLY from ' + firstName + '!* (' + company + ')\n\n' +
            '\ud83d\udce7 ' + email + '\n' +
            '\ud83d\udcac _"' + preview + '..."_\n\n' +
            '\u26a1 Reply now to close the deal!'
          );
          break;
        }
      }
    }
  }

  if (repliesFound > 0) {
    Logger.log('Found ' + repliesFound + ' new replies');
  }
}


// =====================================================
// DAILY SUMMARY — runs at 22:00 Athens time
// =====================================================

function sendDailySummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var col = function(name) { return headers.indexOf(name); };

  var stats = { total: 0, pending: 0, email1: 0, followup1: 0, completed: 0, replied: 0, error: 0 };

  for (var i = 1; i < data.length; i++) {
    var status = String(data[i][col('status')] || '').toLowerCase().trim();
    if (!data[i][col('email')]) continue;
    stats.total++;
    if (status === 'new' || status === '') stats.pending++;
    else if (status === 'email1') stats.email1++;
    else if (status === 'followup1') stats.followup1++;
    else if (status === 'completed' || status === 'followup2') stats.completed++;
    else if (status === 'replied') stats.replied++;
    else if (status === 'error') stats.error++;
  }

  // Count what was sent TODAY by checking dates
  var todayStr = Utilities.formatDate(new Date(), 'Europe/Athens', 'M/d/yyyy');
  var todayEmail1 = [];
  var todayFollowup1 = [];
  var todayFollowup2 = [];
  var todayReplies = [];

  for (var j = 1; j < data.length; j++) {
    var firstName_ = String(data[j][col('first_name')] || '');
    var company_ = String(data[j][col('company')] || '');
    var status_ = String(data[j][col('status')] || '').toLowerCase().trim();
    var e1Date = String(data[j][col('email1_date')] || '');
    var f1Date = String(data[j][col('followup1_date')] || '');
    var f2Date = String(data[j][col('followup2_date')] || '');

    // Check if dates match today (handle different date formats)
    var label = firstName_ + ' (' + company_ + ')';
    if (e1Date && (e1Date === todayStr || e1Date.indexOf(todayStr) > -1) && status_ === 'email1') {
      todayEmail1.push(label);
    }
    if (f1Date && (f1Date === todayStr || f1Date.indexOf(todayStr) > -1)) {
      todayFollowup1.push(label);
    }
    if (f2Date && (f2Date === todayStr || f2Date.indexOf(todayStr) > -1)) {
      todayFollowup2.push(label);
    }
    if (status_ === 'replied') {
      todayReplies.push(label);
    }
  }

  var contacted = stats.total - stats.pending;
  var replyRate = contacted > 0 ? ((stats.replied / contacted) * 100).toFixed(1) : '0.0';

  var sentCount = getSentToday_();
  var text = '\ud83d\udcca *Outreach Daily Report*\n' +
    '\ud83d\udcc5 ' + Utilities.formatDate(new Date(), 'Europe/Athens', 'dd MMM yyyy') + '\n\n' +
    '\ud83d\udce8 *Sent today: ' + sentCount + '/' + CONFIG.DAILY_LIMIT + ' emails*\n';

  // Alert if didn't reach limit and has leads
  if (sentCount < CONFIG.DAILY_LIMIT && stats.pending > 0) {
    text += '\u26a0\ufe0f _Didn\'t reach daily limit \u2014 likely outside business hours_\n';
  } else if (sentCount < CONFIG.DAILY_LIMIT && stats.pending === 0) {
    text += '\ud83d\udea8 _No more leads to send! Feed me a CSV!_\n';
  }
  text += '\n';

  // Today's activity details
  if (todayEmail1.length > 0) {
    text += '\ud83d\udce7 *Email 1 sent (' + todayEmail1.length + '):*\n';
    for (var t1 = 0; t1 < Math.min(todayEmail1.length, 10); t1++) {
      text += '  \u2022 ' + todayEmail1[t1] + '\n';
    }
    if (todayEmail1.length > 10) text += '  _...and ' + (todayEmail1.length - 10) + ' more_\n';
    text += '\n';
  }
  if (todayFollowup1.length > 0) {
    text += '\ud83d\udd04 *Follow-up 1 sent (' + todayFollowup1.length + '):*\n';
    for (var t2 = 0; t2 < Math.min(todayFollowup1.length, 10); t2++) {
      text += '  \u2022 ' + todayFollowup1[t2] + '\n';
    }
    if (todayFollowup1.length > 10) text += '  _...and ' + (todayFollowup1.length - 10) + ' more_\n';
    text += '\n';
  }
  if (todayFollowup2.length > 0) {
    text += '\ud83c\udfc1 *Final follow-up sent (' + todayFollowup2.length + '):*\n';
    for (var t3 = 0; t3 < Math.min(todayFollowup2.length, 10); t3++) {
      text += '  \u2022 ' + todayFollowup2[t3] + '\n';
    }
    if (todayFollowup2.length > 10) text += '  _...and ' + (todayFollowup2.length - 10) + ' more_\n';
    text += '\n';
  }

  // Pipeline overview
  text += '*Pipeline:*\n' +
    '\ud83c\udd95 Pending (not yet contacted): ' + stats.pending + '\n' +
    '1\ufe0f\u20e3 Awaiting follow-up 1: ' + stats.email1 + '\n' +
    '2\ufe0f\u20e3 Awaiting follow-up 2: ' + stats.followup1 + '\n' +
    '\u2705 Sequence complete: ' + stats.completed + '\n' +
    '\ud83c\udf89 *Replied: ' + stats.replied + '*\n' +
    (stats.error > 0 ? '\u274c Errors: ' + stats.error + '\n' : '') +
    '\n\ud83d\udcc8 *Reply rate: ' + replyRate + '%*\n' +
    '\ud83d\udccb Total prospects: ' + stats.total;

  // All-time replies list
  if (todayReplies.length > 0) {
    text += '\n\n\ud83c\udf89 *All replies so far:*\n';
    for (var r = 0; r < todayReplies.length; r++) {
      text += '  \u2022 ' + todayReplies[r] + '\n';
    }
  }

  sendTelegram_(text);
}


// =====================================================
// WEEKLY REPORT — runs Friday 20:00 Athens
// =====================================================

function sendWeeklyReport() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var col = function(name) { return headers.indexOf(name); };

  var now = new Date();
  var weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  var weekEmail1 = 0, weekFU1 = 0, weekFU2 = 0, weekReplied = 0;
  var pending = 0, total = 0;
  var countryCounts = {};
  var repliedList = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[col('email')]) continue;
    total++;

    var status = String(row[col('status')] || '').toLowerCase().trim();
    var country = String(row[col('country')] || 'Unknown');
    if (status === 'new' || status === '') pending++;

    // Count by country
    countryCounts[country] = (countryCounts[country] || 0) + 1;

    // Check dates this week
    var e1 = row[col('email1_date')];
    var f1 = row[col('followup1_date')];
    var f2 = row[col('followup2_date')];

    if (e1 && new Date(e1) >= weekAgo) weekEmail1++;
    if (f1 && new Date(f1) >= weekAgo) weekFU1++;
    if (f2 && new Date(f2) >= weekAgo) weekFU2++;
    if (status === 'replied') {
      repliedList.push(String(row[col('first_name')] || '') + ' (' + String(row[col('company')] || '') + ')');
    }
  }

  var weekTotal = weekEmail1 + weekFU1 + weekFU2;

  // Top countries
  var sortedCountries = Object.keys(countryCounts).sort(function(a, b) {
    return countryCounts[b] - countryCounts[a];
  }).slice(0, 5);

  var countryLines = sortedCountries.map(function(c) {
    return '  ' + countryFlag_(c) + ' ' + c + ': ' + countryCounts[c];
  }).join('\n');

  var text = '\ud83d\udcca *Weekly Outreach Report*\n' +
    '\ud83d\udcc5 Week of ' + Utilities.formatDate(weekAgo, 'Europe/Athens', 'dd MMM') + ' \u2014 ' + Utilities.formatDate(now, 'Europe/Athens', 'dd MMM yyyy') + '\n\n' +
    '\ud83d\udce8 *Emails sent this week: ' + weekTotal + '*\n' +
    '  \ud83d\udce7 Email 1: ' + weekEmail1 + '\n' +
    '  \ud83d\udd04 Follow-up 1: ' + weekFU1 + '\n' +
    '  \ud83c\udfc1 Follow-up 2: ' + weekFU2 + '\n\n' +
    '\ud83c\udf89 *Total replies (all time): ' + repliedList.length + '*\n';

  if (repliedList.length > 0) {
    text += repliedList.map(function(r) { return '  \u2022 ' + r; }).join('\n') + '\n';
  }

  text += '\n\ud83d\udcdd *Pipeline status:*\n' +
    '  \ud83c\udd95 Pending: ' + pending + '\n' +
    '  \ud83d\udccb Total: ' + total + '\n\n' +
    '\ud83c\udf0d *Top countries:*\n' + countryLines + '\n\n';

  // LinkedIn follow-up reminder
  text += '\ud83d\udd17 *LinkedIn Action Required:*\n' +
    '_Check this week\'s LinkedIn messages._\n' +
    '_Who replied? Who didn\'t?_\n' +
    '_Follow up with non-responders!_';

  sendTelegram_(text);
}


// =====================================================
// MONTHLY REPORT — runs 1st of month at 10:00 Athens
// =====================================================

function sendMonthlyReport() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var col = function(name) { return headers.indexOf(name); };

  var now = new Date();
  var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  var lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  var monthName = Utilities.formatDate(lastMonth, 'Europe/Athens', 'MMMM yyyy');

  var stats = { total: 0, pending: 0, email1: 0, followup1: 0, completed: 0, replied: 0, error: 0 };
  var monthEmail1 = 0, monthFU1 = 0, monthFU2 = 0;
  var repliedList = [];
  var countryCounts = {};

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[col('email')]) continue;
    stats.total++;

    var status = String(row[col('status')] || '').toLowerCase().trim();
    var country = String(row[col('country')] || 'Unknown');

    if (status === 'new' || status === '') stats.pending++;
    else if (status === 'email1') stats.email1++;
    else if (status === 'followup1') stats.followup1++;
    else if (status === 'completed' || status === 'followup2') stats.completed++;
    else if (status === 'replied') stats.replied++;
    else if (status === 'error') stats.error++;

    countryCounts[country] = (countryCounts[country] || 0) + 1;

    // Count last month's activity
    var e1 = row[col('email1_date')];
    var f1 = row[col('followup1_date')];
    var f2 = row[col('followup2_date')];

    if (e1) { var d = new Date(e1); if (d >= lastMonth && d <= lastMonthEnd) monthEmail1++; }
    if (f1) { var d2 = new Date(f1); if (d2 >= lastMonth && d2 <= lastMonthEnd) monthFU1++; }
    if (f2) { var d3 = new Date(f2); if (d3 >= lastMonth && d3 <= lastMonthEnd) monthFU2++; }

    if (status === 'replied') {
      repliedList.push(String(row[col('first_name')] || '') + ' \u2014 ' + String(row[col('company')] || '') + ' ' + countryFlag_(country));
    }
  }

  var monthTotal = monthEmail1 + monthFU1 + monthFU2;
  var contacted = stats.total - stats.pending;
  var replyRate = contacted > 0 ? ((stats.replied / contacted) * 100).toFixed(1) : '0.0';

  // Top countries
  var sortedCountries = Object.keys(countryCounts).sort(function(a, b) {
    return countryCounts[b] - countryCounts[a];
  }).slice(0, 8);

  var countryLines = sortedCountries.map(function(c) {
    return '  ' + countryFlag_(c) + ' ' + c + ': ' + countryCounts[c];
  }).join('\n');

  var text = '\ud83d\udcca\ud83d\udcca\ud83d\udcca *MONTHLY REPORT* \ud83d\udcca\ud83d\udcca\ud83d\udcca\n' +
    '\ud83d\udcc6 ' + monthName + '\n\n' +
    '\ud83d\udce8 *Emails sent in ' + monthName + ': ' + monthTotal + '*\n' +
    '  \ud83d\udce7 Email 1: ' + monthEmail1 + '\n' +
    '  \ud83d\udd04 Follow-up 1: ' + monthFU1 + '\n' +
    '  \ud83c\udfc1 Follow-up 2: ' + monthFU2 + '\n\n' +
    '\ud83d\udccb *All-time Pipeline:*\n' +
    '  \ud83c\udd95 Pending: ' + stats.pending + '\n' +
    '  1\ufe0f\u20e3 Awaiting FU1: ' + stats.email1 + '\n' +
    '  2\ufe0f\u20e3 Awaiting FU2: ' + stats.followup1 + '\n' +
    '  \u2705 Sequence done: ' + stats.completed + '\n' +
    '  \ud83c\udf89 *Replied: ' + stats.replied + '*\n' +
    (stats.error > 0 ? '  \u274c Errors: ' + stats.error + '\n' : '') +
    '\n\ud83d\udcc8 *Reply rate: ' + replyRate + '%*\n' +
    '\ud83d\udccb Total prospects: ' + stats.total + '\n\n' +
    '\ud83c\udf0d *Prospects by country:*\n' + countryLines + '\n\n';

  if (repliedList.length > 0) {
    text += '\ud83c\udf89 *All replies:*\n';
    for (var r = 0; r < repliedList.length; r++) {
      text += '  \u2022 ' + repliedList[r] + '\n';
    }
  }

  sendTelegram_(text);
}


// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Send email with Gmail signature
function sendEmail_(to, subject, htmlBody) {
  var signature = getSignature_();
  GmailApp.sendEmail(to, subject, '', {
    htmlBody: htmlBody + signature,
    name: CONFIG.SENDER_NAME,
    from: CONFIG.SENDER_EMAIL,
  });
}

// Get Gmail signature for sender email
function getSignature_() {
  try {
    var aliases = Gmail.Users.Settings.SendAs.list('me');
    for (var a = 0; a < aliases.sendAs.length; a++) {
      var alias = aliases.sendAs[a];
      if (alias.sendAsEmail === CONFIG.SENDER_EMAIL || alias.isDefault) {
        return alias.signature ? '<br>' + alias.signature : '';
      }
    }
  } catch (e) {
    Logger.log('Signature fetch failed (enable Gmail API): ' + e.message);
  }
  return '';
}

// Check if someone has replied
function hasReplied_(email) {
  var threads = GmailApp.search('from:' + email + ' newer_than:30d', 0, 1);
  return threads.length > 0;
}

// Send Telegram notification
function sendTelegram_(text) {
  try {
    UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
          disable_notification: false,
        }),
        muteHttpExceptions: true,
      }
    );
  } catch (e) {
    Logger.log('Telegram error: ' + e.message);
  }
}

// Count emails sent today
function getSentToday_() {
  var val = PropertiesService.getScriptProperties().getProperty('sent_' + todayKey_());
  return val ? parseInt(val) : 0;
}

// Today's date key
function todayKey_() {
  return Utilities.formatDate(new Date(), 'Europe/Athens', 'yyyy-MM-dd');
}

// Days between two dates
function daysBetween_(d1, d2) {
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// Random delay 2-5 minutes between emails (Google anti-spam best practice)
// Looks natural — no human sends emails every 30 seconds
function randomDelay_() {
  return (120 + Math.floor(Math.random() * 180)) * 1000; // 120-300 sec
}


// =====================================================
// SETUP — Run this ONCE to activate triggers
// =====================================================

function setupTriggers() {
  // Remove any existing triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var t = 0; t < triggers.length; t++) {
    ScriptApp.deleteTrigger(triggers[t]);
  }

  // Send outreach every hour
  ScriptApp.newTrigger('sendOutreach')
    .timeBased()
    .everyHours(1)
    .create();

  // Check for replies every 30 minutes
  ScriptApp.newTrigger('checkReplies')
    .timeBased()
    .everyMinutes(30)
    .create();

  // Daily summary at 10 PM Athens
  ScriptApp.newTrigger('sendDailySummary')
    .timeBased()
    .atHour(22)
    .everyDays(1)
    .inTimezone('Europe/Athens')
    .create();

  // Weekly report — Friday at 20:00 Athens
  ScriptApp.newTrigger('sendWeeklyReport')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(20)
    .inTimezone('Europe/Athens')
    .create();

  // Monthly report — 1st of each month at 10:00 Athens
  ScriptApp.newTrigger('sendMonthlyReport')
    .timeBased()
    .onMonthDay(1)
    .atHour(10)
    .inTimezone('Europe/Athens')
    .create();

  Logger.log('All triggers installed!');
  sendTelegram_(
    '\u2705 *Outreach Automation v3 Active!*\n\n' +
    '\ud83d\udce7 Sending: every hour (per-country business hours)\n' +
    '\ud83d\udd0d Reply check: every 30 min\n' +
    '\ud83d\udcca Daily summary: 22:00 Athens\n' +
    '\ud83d\udcc5 Weekly report: Friday 20:00\n' +
    '\ud83d\udcc6 Monthly report: 1st of month 10:00\n' +
    '\ud83d\udee1 Daily limit: ' + CONFIG.DAILY_LIMIT + ' emails'
  );
}


// =====================================================
// MANUAL CONTROLS — Run from script editor
// =====================================================

// Test that Telegram works
function testTelegram() {
  sendTelegram_('\u2705 *Test* \u2014 Outreach automation is connected to Telegram!');
}

// Test signature fetching
function testSignature() {
  var sig = getSignature_();
  Logger.log('Signature found: ' + (sig ? 'YES' : 'NO'));
  Logger.log(sig);
}

// Manually trigger one send cycle — BYPASSES business hours check
function manualSend() {
  sendOutreach(true);
}

// Manually check replies (for testing)
function manualCheckReplies() {
  checkReplies();
}

// Pause automation (removes all triggers)
function pauseAutomation() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var t = 0; t < triggers.length; t++) {
    ScriptApp.deleteTrigger(triggers[t]);
  }
  sendTelegram_('\u23f8 *Outreach automation PAUSED*\n\nRun setupTriggers() to resume.');
  Logger.log('All triggers removed. Automation paused.');
}

// Reset today's send counter
function resetDailyCounter() {
  PropertiesService.getScriptProperties().deleteProperty('sent_' + todayKey_());
  Logger.log('Daily counter reset');
}


// =====================================================
// TELEGRAM POLLING — Receive leads & commands via Telegram
// Upload a CSV file to the bot → auto-import to sheet
// Uses getUpdates polling (works with Google Workspace)
// =====================================================

// Poll Telegram for new messages (run by trigger every 1 min)
function pollTelegram() {
  var props = PropertiesService.getScriptProperties();
  var offset = parseInt(props.getProperty('tg_update_offset') || '0', 10);

  var url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN +
    '/getUpdates?timeout=0&offset=' + offset;
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var data = JSON.parse(response.getContentText());

  if (!data.ok || !data.result || data.result.length === 0) return;

  for (var i = 0; i < data.result.length; i++) {
    var update = data.result[i];
    try {
      processTelegramUpdate_(update);
    } catch (err) {
      Logger.log('pollTelegram error on update ' + update.update_id + ': ' + err.message);
      try { sendTelegram_('\u274c Error processing message: ' + err.message); } catch (e2) {}
    }
    // Always advance offset, even on error
    offset = update.update_id + 1;
  }

  props.setProperty('tg_update_offset', String(offset));
}

// Process a single Telegram update
function processTelegramUpdate_(update) {
  var message = update.message;
  if (!message) return;

  var chatId = String(message.chat.id);
  if (chatId !== CONFIG.TELEGRAM_CHAT_ID) return; // ignore other chats

  // Handle document (CSV file)
  if (message.document) {
    var doc = message.document;
    var fileName = doc.file_name || '';

    // Only accept CSV files
    if (!fileName.toLowerCase().match(/\.csv$/)) {
      sendTelegram_('\u274c Please send a *.csv* file.\nFormat: first\\_name, last\\_name, email, company, country, linkedin\\_url');
      return;
    }

    // Download file from Telegram
    var fileInfo = JSON.parse(UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/getFile?file_id=' + doc.file_id
    ).getContentText());

    if (!fileInfo.ok || !fileInfo.result.file_path) {
      sendTelegram_('\u274c Could not download file. Try again.');
      return;
    }

    var fileUrl = 'https://api.telegram.org/file/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/' + fileInfo.result.file_path;
    var csvContent = UrlFetchApp.fetch(fileUrl).getContentText('UTF-8');

    // Process the CSV
    var result = importLeadsFromCSV_(csvContent);
    sendTelegram_(result);
    return;
  }

  // Handle text commands
  if (message.text) {
    var text = message.text.toLowerCase().trim();
    if (text === '/status') {
      sendDailySummary();
    } else if (text === '/pause') {
      pauseAutomation();
    } else if (text === '/resume') {
      setupTriggers();
    } else if (text === '/help') {
      sendTelegram_(
        '\ud83e\udd16 *George Yachts Outreach Bot*\n\n' +
        '*Commands:*\n' +
        '/status \u2014 Pipeline report\n' +
        '/pause \u2014 Pause automation\n' +
        '/resume \u2014 Resume automation\n' +
        '/help \u2014 This message\n\n' +
        '*Upload CSV to add leads:*\n' +
        'first\\_name, last\\_name, email, company, country, linkedin\\_url'
      );
    } else {
      sendTelegram_('Send a CSV file to add leads, or use /status /pause /resume /help');
    }
    return;
  }
}


// Import leads from CSV content into the sheet
function importLeadsFromCSV_(csvContent) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) return '\u274c Sheet "' + CONFIG.SHEET_NAME + '" not found!';

  // Parse CSV
  var lines = csvContent.split(/\r?\n/).filter(function(line) { return line.trim() !== ''; });
  if (lines.length < 2) return '\u274c CSV file is empty or has only headers.';

  // Parse headers
  var csvHeaders = lines[0].split(',').map(function(h) { return h.trim().toLowerCase().replace(/['"]/g, ''); });

  // Map CSV columns
  var colMap = {};
  var expectedCols = ['first_name', 'last_name', 'email', 'company', 'country', 'linkedin_url'];
  for (var c = 0; c < expectedCols.length; c++) {
    for (var h = 0; h < csvHeaders.length; h++) {
      if (csvHeaders[h].replace(/\s+/g, '_') === expectedCols[c] ||
          csvHeaders[h].replace(/\s+/g, '') === expectedCols[c].replace(/_/g, '')) {
        colMap[expectedCols[c]] = h;
        break;
      }
    }
  }

  if (colMap.email === undefined) return '\u274c CSV must have an "email" column!';

  // Get existing emails from sheet to deduplicate
  var sheetData = sheet.getDataRange().getValues();
  var sheetHeaders = sheetData[0].map(function(h) { return String(h).toLowerCase().replace(/\s+/g, '_'); });
  var emailCol = sheetHeaders.indexOf('email');
  var existingEmails = {};
  for (var i = 1; i < sheetData.length; i++) {
    var em = String(sheetData[i][emailCol] || '').toLowerCase().trim();
    if (em) existingEmails[em] = true;
  }

  // Generic email patterns to skip
  var genericPatterns = /^(info|contact|hello|hi|sales|enquiries|enquiry|support|admin|office|team|help|general|reception|mail|noreply|no-reply)@/i;

  // Process rows
  var added = 0;
  var skippedDupe = 0;
  var skippedGeneric = 0;
  var skippedInvalid = 0;
  var newRows = [];

  for (var r = 1; r < lines.length; r++) {
    // Simple CSV parse (handles basic quoting)
    var row = parseCSVLine_(lines[r]);
    if (!row || row.length === 0) continue;

    var email = (row[colMap.email] || '').trim().toLowerCase();

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      skippedInvalid++;
      continue;
    }

    // Skip generic emails
    if (genericPatterns.test(email)) {
      skippedGeneric++;
      continue;
    }

    // Skip free email providers (gmail, yahoo, hotmail, etc.)
    if (email.match(/@(gmail|yahoo|hotmail|outlook|aol|live|icloud|mail|protonmail|yandex|zoho)\./i)) {
      skippedGeneric++;
      continue;
    }

    // Skip duplicates
    if (existingEmails[email]) {
      skippedDupe++;
      continue;
    }

    // Build sheet row: first_name, last_name, email, company, country, linkedin_url, status, ...
    var firstName = colMap.first_name !== undefined ? (row[colMap.first_name] || '').trim() : '';
    var lastName = colMap.last_name !== undefined ? (row[colMap.last_name] || '').trim() : '';
    var company = colMap.company !== undefined ? (row[colMap.company] || '').trim() : '';
    var country = colMap.country !== undefined ? (row[colMap.country] || '').trim() : '';
    var linkedin = colMap.linkedin_url !== undefined ? (row[colMap.linkedin_url] || '').trim() : '';

    // Must have first name
    if (!firstName) {
      skippedInvalid++;
      continue;
    }

    newRows.push([firstName, lastName, email, company, country, linkedin, 'new', '', '', '', '']);
    existingEmails[email] = true; // Prevent dupes within the same CSV
    added++;
  }

  // Append to sheet
  if (newRows.length > 0) {
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }

  return '\u2705 *CSV Import Complete!*\n\n' +
    '\u2795 Added: *' + added + '* new leads\n' +
    '\ud83d\udd04 Skipped duplicates: ' + skippedDupe + '\n' +
    '\ud83d\udeab Skipped generic/free emails: ' + skippedGeneric + '\n' +
    '\u274c Skipped invalid: ' + skippedInvalid + '\n\n' +
    'Total prospects in sheet: ' + (sheet.getLastRow() - 1);
}


// Parse a single CSV line (handles quoted fields)
function parseCSVLine_(line) {
  var result = [];
  var current = '';
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (inQuotes) {
      if (ch === '"' && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}


// =====================================================
// TELEGRAM POLLING SETUP — Run once to start listening
// =====================================================

function setupTelegramPolling() {
  // Remove webhook (we use polling instead)
  UrlFetchApp.fetch(
    'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/deleteWebhook',
    { muteHttpExceptions: true }
  );

  // Remove any existing pollTelegram triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'pollTelegram') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new trigger: poll every 1 minute
  ScriptApp.newTrigger('pollTelegram')
    .timeBased()
    .everyMinutes(1)
    .create();

  Logger.log('Telegram polling started (every 1 min)');
  sendTelegram_(
    '\u2705 *Telegram Bot Connected!*\n\n' +
    'You can now:\n' +
    '\ud83d\udcc4 Send CSV files to add leads\n' +
    '/status \u2014 Pipeline report\n' +
    '/pause \u2014 Pause automation\n' +
    '/resume \u2014 Resume automation\n' +
    '/help \u2014 Commands list'
  );
}

function stopTelegramPolling() {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'pollTelegram') {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  Logger.log('Removed ' + removed + ' polling trigger(s)');
  sendTelegram_('\u23f8\ufe0f Telegram polling stopped.');
}
