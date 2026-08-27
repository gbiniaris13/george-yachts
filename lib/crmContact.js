// Shared CRM contact upsert for the contact form endpoints.
// Mirrors the write path /api/track uses for popup leads, so form
// submissions finally land in the CRM as contacts, not just as
// notifications. (Gap found 23/8: /api/contact wrote zero contacts.)

const CRM_SUPABASE_URL = process.env.CRM_SUPABASE_URL;
const CRM_SUPABASE_KEY = process.env.CRM_SUPABASE_SERVICE_KEY;

function crmHeaders(json = false) {
  const h = {
    apikey: CRM_SUPABASE_KEY,
    Authorization: `Bearer ${CRM_SUPABASE_KEY}`,
  };
  if (json) {
    h["Content-Type"] = "application/json";
    h["Prefer"] = "return=representation";
  }
  return h;
}

async function findContactByEmail(email) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY || !email) return null;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/contacts?email=eq.${encodeURIComponent(email)}&limit=1`,
      { headers: crmHeaders() }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0] || null;
  } catch {
    return null;
  }
}

async function getHotStageId() {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(
      `${CRM_SUPABASE_URL}/rest/v1/pipeline_stages?name=eq.Hot&limit=1`,
      { headers: crmHeaders() }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows?.[0]?.id || null;
  } catch {
    return null;
  }
}

async function insertRow(table, data) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  try {
    const res = await fetch(`${CRM_SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: crmHeaders(true),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      // A rejected write must never be silent again. The source-constraint
      // failure that lost two real briefs in August returned a perfectly
      // clear 400 that nobody ever read, because this branch used to say
      // `return null` and nothing else.
      const detail = await res.text().catch(() => "");
      console.error(`[crmContact] ${table} insert rejected ${res.status}: ${detail.slice(0, 300)}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`[crmContact] ${table} insert threw: ${e?.message}`);
    return null;
  }
}

// The contacts table carries a CHECK constraint, contacts_source_check,
// that admits a fixed vocabulary: outreach_bot, referral, partner,
// website_lead, website_inquiry. Between 23 and 27 August this function
// posted website_form and website_form_partial, invented here and unknown
// to the database, so every single insert came back 400 and the catch
// below swallowed it. Two real briefs arrived in that window, Jacob Stein
// and Alberto Carrillo, and neither became a contact.
//
// The lesson is not to widen the constraint from application code. The
// vocabulary belongs to the database; the caller's distinction between a
// finished brief and a rescued one belongs on the activity, which is free
// text and already carries it.
const SOURCE_BY_KIND = {
  website_form: "website_inquiry",
  website_form_partial: "website_lead",
};

/**
 * Create or update a CRM contact from a form payload and log the
 * full brief as an activity. Never throws; safe to fire-and-forget.
 *
 * @param {object} p
 * @param {string} p.name
 * @param {string} [p.email]
 * @param {string} [p.phone]
 * @param {string} [p.country]
 * @param {string} p.source  "website_form" (finished) | "website_form_partial" (rescued)
 * @param {string} p.description  activity description (full brief text)
 * @param {object} [p.metadata]  extra fields stored on the activity
 */
export async function upsertFormContact({ name, email, phone, country, source, description, metadata }) {
  if (!CRM_SUPABASE_URL || !CRM_SUPABASE_KEY) return null;
  const dbSource = SOURCE_BY_KIND[source] || "website_inquiry";
  try {
    const nameParts = (name || "").trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const existing = await findContactByEmail(email);
    const hotStageId = await getHotStageId();

    let contactId = existing?.id || null;

    if (existing) {
      await fetch(`${CRM_SUPABASE_URL}/rest/v1/contacts?id=eq.${existing.id}`, {
        method: "PATCH",
        headers: crmHeaders(true),
        body: JSON.stringify({
          first_name: existing.first_name || firstName,
          last_name: existing.last_name || lastName,
          phone: phone || existing.phone,
          country: existing.country || country || null,
          pipeline_stage_id: hotStageId || existing.pipeline_stage_id,
          last_activity_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    } else {
      const created = await insertRow("contacts", {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        country: country || null,
        source: dbSource,
        pipeline_stage_id: hotStageId,
      });
      contactId = created?.[0]?.id || null;
    }

    if (contactId) {
      const rescued = source === "website_form_partial";
      await insertRow("activities", {
        contact_id: contactId,
        type: rescued ? "lead_captured" : "form_submission",
        // The activity is where the finished/rescued distinction lives now
        // that the source column speaks the database's own vocabulary.
        description: rescued ? `[rescued brief] ${description}` : description,
        metadata: { ...(metadata || {}), form_kind: source },
      });
    }

    return contactId;
  } catch {
    return null;
  }
}
