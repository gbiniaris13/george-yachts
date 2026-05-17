-- =============================================================
-- THE CABIN · FILOTIMO — foundation schema
-- =============================================================
-- Date: 2026-05-16
-- Author: Roberto (this session)
-- Approved by: George
--
-- Architecture decision (see CLAUDE.md, the Vision doc, and the
-- Phase 1 Technical Brief):
--
--   • Auth lives in Next.js + Resend magic link + Vercel KV
--     sessions (same pattern as lib/partner-portal.js). No
--     Supabase Auth — keeps deps minimal and matches the rest
--     of the site.
--
--   • Data lives in Supabase Postgres. ALL access from Next.js
--     uses the *service role* key. RLS is defense-in-depth: deny
--     everything from anon/public, allow service_role. The
--     authentication boundary is the Next.js server (which
--     validates the gy_cabin_session cookie before touching the
--     DB on a client's behalf).
--
--   • One person → many cabins. Email is the person identifier
--     across the Filotimo Circle.
--
--   • Every table that holds client data has RLS enabled with a
--     deny-all default. Service role bypasses RLS.
-- =============================================================

-- -------------------------------------------------------------
-- Extensions
-- -------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- fuzzy search on names later

-- -------------------------------------------------------------
-- ENUMs (typed columns instead of plain text)
-- -------------------------------------------------------------
do $$ begin
  create type cabin_status as enum (
    'draft',              -- created in admin, not yet sent to client
    'invited',            -- magic link sent
    'active',             -- client has logged in and is filling brief
    'in_voyage',          -- charter is currently happening
    'completed',          -- charter is over, post-charter sequences active
    'archived'            -- closed out, read-only memory
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type cabin_member_role as enum (
    'principal_charterer', -- the contract signer
    'guest',               -- invited guest (Phase 2)
    'designated_assistant' -- proxy who fills on charterer's behalf
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type brief_section_key as enum (
    'arrival',
    'guests',
    'health',
    'itinerary',
    'life_aboard',
    'dining',
    'beverages',
    'little_things',
    'children'             -- conditional, shown only when manifest has minors
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type filotimo_tier as enum (
    'friend',      -- 1 voyage
    'companion',   -- 2 voyages OR 1 converted referral
    'crewmate'     -- 3+ voyages OR 2+ converted referrals
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type memory_anchor_status as enum (
    'scheduled',
    'sent',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

-- =============================================================
-- TABLE: cabins
--
-- One row per charter. Central record.
-- =============================================================
create table if not exists cabins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Status
  status cabin_status not null default 'draft',

  -- Charter identification
  myba_contract_number text,

  -- Vessel (pre-filled from contract; white-labeled in client view)
  vessel_name text not null,
  vessel_make_model text,
  vessel_length text,
  vessel_capacity integer,
  homeport text,

  -- Charter window
  charter_period_from date not null,
  charter_period_to date not null,
  port_embarkation text,
  port_disembarkation text,
  cruising_area text,

  -- Principal charterer (denormalized for fast lookup by email
  -- before joining cabin_members)
  principal_charterer_email text not null,
  principal_charterer_name text not null,
  principal_charterer_mobile text,

  -- Internal-only fields (NEVER returned to client UI)
  central_agent_internal text,    -- e.g. "IYC", "Istion", "Fraser"
  vessel_owner_internal text,
  captain_name_internal text,
  chef_name_internal text,
  hostess_name_internal text,
  charter_fee_eur numeric(10,2),
  apa_eur numeric(10,2),

  -- Crew display (what the CLIENT sees in /cabin/crew — curated
  -- by George in admin; not the real names if he wants white-label)
  crew_display jsonb default '[]'::jsonb,
  -- Shape: [{ first_name, role, bio, photo_path }, …]

  -- Sample menu (curated by George in admin)
  sample_menu jsonb default '{}'::jsonb,

  -- Greek Cuisine Inspiration content
  inspiration_content jsonb default '{}'::jsonb,

  -- Concierge mode flags
  concierge_mode_active boolean default false,
  concierge_mode_activated_at timestamptz,
  concierge_mode_activated_by_email text,

  -- Brief completion tracking
  brief_completion_percent integer not null default 0,
  brief_submitted_at timestamptz,
  brief_locked_at timestamptz,

  -- PDF export tracking (informational)
  last_pdf_export_at timestamptz,

  -- Soft-delete instead of destructive delete (GDPR friendly)
  deleted_at timestamptz,

  check (charter_period_to >= charter_period_from),
  check (brief_completion_percent between 0 and 100)
);

create index if not exists idx_cabins_status            on cabins(status) where deleted_at is null;
create index if not exists idx_cabins_charterer_email   on cabins(principal_charterer_email) where deleted_at is null;
create index if not exists idx_cabins_period            on cabins(charter_period_from, charter_period_to) where deleted_at is null;

-- -------------------------------------------------------------
-- cabins.updated_at trigger
-- -------------------------------------------------------------
create or replace function trg_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_cabins_updated_at on cabins;
create trigger trg_cabins_updated_at
before update on cabins
for each row execute function trg_set_updated_at();

-- =============================================================
-- TABLE: cabin_members
--
-- Every person who can access a given Cabin. The principal
-- charterer is always row #1. Guests (Phase 2) and Designated
-- Assistants (priority ①) are additional rows.
-- =============================================================
create table if not exists cabin_members (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  created_at timestamptz not null default now(),

  role cabin_member_role not null,
  email text not null,
  display_name text,
  mobile text,

  -- For Designated Assistant role: who they assist (must be a
  -- member of the same cabin). NULL for other roles.
  assists_member_id uuid references cabin_members(id) on delete cascade,

  -- Magic link / session
  last_login_at timestamptz,
  invite_sent_at timestamptz,

  -- Email opt-in flags (Transparency Dashboard surfaces these)
  consents jsonb not null default '{
    "essential_charter_emails": true,
    "memory_anchors": true,
    "filotimo_circle": true,
    "marketing_newsletter": false
  }'::jsonb,

  -- Soft-delete
  deleted_at timestamptz,

  unique (cabin_id, email)
);

create index if not exists idx_cabin_members_email      on cabin_members(lower(email)) where deleted_at is null;
create index if not exists idx_cabin_members_cabin      on cabin_members(cabin_id) where deleted_at is null;
create index if not exists idx_cabin_members_assists    on cabin_members(assists_member_id) where assists_member_id is not null;

-- =============================================================
-- TABLE: cabin_brief_sections
--
-- One row per (cabin, section). Flexible JSONB payload validated
-- by zod schemas in lib/cabin/schema.js. Decoupling from a rigid
-- column structure means we can iterate fields without DB
-- migrations every time.
-- =============================================================
create table if not exists cabin_brief_sections (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  section_key brief_section_key not null,

  data jsonb not null default '{}'::jsonb,

  completed boolean not null default false,
  last_edited_at timestamptz not null default now(),
  last_edited_by_email text,
  last_edited_concierge boolean not null default false,

  unique (cabin_id, section_key)
);

create index if not exists idx_brief_sections_cabin on cabin_brief_sections(cabin_id);

-- =============================================================
-- TABLE: cabin_guests_manifest
--
-- Structured guest manifest data (Section 06 of the brief). This
-- is the "Who is sailing with you?" detail — name, DOB, passport,
-- cabin pairing, allergies. NOT the same as cabin_members (which
-- governs portal access).
-- =============================================================
create table if not exists cabin_guests_manifest (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  guest_order integer not null,

  full_name text,
  date_of_birth date,
  nationality text,
  passport_number text,
  passport_expiry date,
  is_minor boolean default false,

  email text,
  mobile text,

  cabin_pairing text,
  shoe_size text,
  allergies_dietary text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cabin_id, guest_order)
);

drop trigger if exists trg_guests_manifest_updated_at on cabin_guests_manifest;
create trigger trg_guests_manifest_updated_at
before update on cabin_guests_manifest
for each row execute function trg_set_updated_at();

-- =============================================================
-- TABLE: cabin_audit_log
--
-- Every admin/concierge action writes here. Kevin Mitnick's
-- mandate. Append-only.
-- =============================================================
create table if not exists cabin_audit_log (
  id uuid primary key default gen_random_uuid(),
  -- Audit log must survive cabin hard-delete (compliance trail).
  -- Use SET NULL so the row remains; action + actor_email persist.
  cabin_id uuid references cabins(id) on delete set null,
  actor_email text,
  actor_role text,
  -- e.g. 'admin' (George via gy-command), 'charterer', 'guest',
  -- 'designated_assistant', 'system'
  action text not null,
  -- 'cabin_created', 'invite_sent', 'magic_link_requested',
  -- 'magic_link_verified', 'concierge_mode_on', 'concierge_field_saved',
  -- 'brief_section_saved', 'brief_submitted', 'pdf_exported',
  -- 'mood_board_uploaded', 'time_capsule_sealed', 'memory_anchor_scheduled',
  -- 'consent_changed', 'data_deleted'
  target_section text,
  target_field text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_cabin   on cabin_audit_log(cabin_id);
create index if not exists idx_audit_log_actor   on cabin_audit_log(actor_email);
create index if not exists idx_audit_log_created on cabin_audit_log(created_at desc);

-- =============================================================
-- TABLE: filotimo_circle_members
--
-- Loyalty club. Person-scoped (not cabin-scoped) — one row per
-- unique email regardless of how many cabins they appear in.
-- Auto-populated on first cabin_members insert via trigger.
-- =============================================================
create table if not exists filotimo_circle_members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text,

  joined_at timestamptz not null default now(),
  tier filotimo_tier not null default 'friend',

  voyages_count integer not null default 0,
  referrals_converted integer not null default 0,

  -- Latest voyage info (for "Welcome back, here's what we remember")
  last_voyage_cabin_id uuid references cabins(id) on delete set null,
  last_voyage_completed_at timestamptz,

  -- Optional birthday / anniversary captured during Charter Brief —
  -- powers Memory Anchors and birthday wishes
  date_of_birth date,
  anniversary_date date,
  hometown text,

  -- Soft-delete for GDPR right-to-be-forgotten
  deleted_at timestamptz
);

create index if not exists idx_filotimo_tier on filotimo_circle_members(tier) where deleted_at is null;
create index if not exists idx_filotimo_last_voyage on filotimo_circle_members(last_voyage_cabin_id) where last_voyage_cabin_id is not null;

-- =============================================================
-- Trigger: auto-enroll into Filotimo Circle when a cabin_member
-- is created.
-- =============================================================
create or replace function trg_filotimo_auto_enroll()
returns trigger language plpgsql as $$
begin
  insert into filotimo_circle_members (email, display_name)
  values (lower(new.email), new.display_name)
  on conflict (email) do nothing;
  return new;
end $$;

drop trigger if exists trg_cabin_member_filotimo_enroll on cabin_members;
create trigger trg_cabin_member_filotimo_enroll
after insert on cabin_members
for each row execute function trg_filotimo_auto_enroll();

-- =============================================================
-- TABLE: cabin_mood_board  (priority ②)
--
-- Pinterest-style photo references uploaded by the charterer
-- pre-charter to communicate the "vibe" they want.
-- =============================================================
create table if not exists cabin_mood_board (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  uploaded_by_email text not null,
  image_path text not null,       -- Supabase Storage path
  caption text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_mood_board_cabin on cabin_mood_board(cabin_id, display_order);

-- =============================================================
-- TABLE: cabin_time_capsules  (priority ③)
--
-- Sealed paragraphs written by each member at the start of their
-- voyage. Revealed (via email) 6 months later by a scheduled job.
-- =============================================================
create table if not exists cabin_time_capsules (
  id uuid primary key default gen_random_uuid(),
  -- SET NULL so a sealed paragraph still belongs to its author for
  -- the 6-month reveal email even if the cabin is hard-deleted.
  cabin_id uuid references cabins(id) on delete set null,
  author_email text not null,
  message text not null,
  sealed_at timestamptz not null default now(),
  reveal_at timestamptz not null,
  revealed_at timestamptz,
  unique (cabin_id, author_email)
);

create index if not exists idx_time_capsule_reveal on cabin_time_capsules(reveal_at)
  where revealed_at is null;

-- =============================================================
-- TABLE: cabin_data_consents  (priority ④ — Transparency Dashboard)
--
-- Granular consent / data-point log. The "Your Data" page reads
-- from here and shows every field, every consent, with edit and
-- delete-forever buttons.
-- =============================================================
create table if not exists cabin_data_consents (
  id uuid primary key default gen_random_uuid(),
  email text not null,                       -- person scope
  data_point text not null,                  -- 'date_of_birth', 'mobile', etc.
  data_value text,                           -- the actual value (encrypted later if needed)
  given_for text,                            -- 'birthday_wishes', 'photo_sharing', etc.
  consent_state text not null default 'granted',  -- 'granted', 'withdrawn', 'pending'
  source text not null default 'charter_brief',
  -- SET NULL so consent history outlives cabin hard-delete (GDPR trail).
  cabin_id uuid references cabins(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, data_point, given_for)
);

create index if not exists idx_consents_email on cabin_data_consents(lower(email)) where consent_state = 'granted';
create index if not exists idx_consents_cabin on cabin_data_consents(cabin_id) where cabin_id is not null;

drop trigger if exists trg_consents_updated_at on cabin_data_consents;
create trigger trg_consents_updated_at
before update on cabin_data_consents
for each row execute function trg_set_updated_at();

-- =============================================================
-- TABLE: cabin_memory_anchors  (priority ⑤)
--
-- Scheduled emotional touchpoint emails. Mix of deterministic
-- (e.g. +1 day photo album) and randomized (e.g. random 3-month
-- "remember the morning at Polyaigos"). A worker cron picks rows
-- whose `scheduled_for <= now()` and status = 'scheduled'.
-- =============================================================
create table if not exists cabin_memory_anchors (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  recipient_email text not null,
  scheduled_for timestamptz not null,
  status memory_anchor_status not null default 'scheduled',

  -- Content tokens to render at send time
  anchor_kind text not null,
  -- 'day1_album', 'day3_thanks', 'day7_feedback', 'day30_reminder',
  -- 'month3_random_photo', 'month6_random_photo', 'month11_reengagement',
  -- 'annual_anniversary', 'birthday', 'name_day', 'anniversary_date'
  content_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists idx_memory_due
  on cabin_memory_anchors(scheduled_for)
  where status = 'scheduled';

-- =============================================================
-- ROW-LEVEL SECURITY
--
-- Default deny for anon. Service role (Next.js API routes) gets
-- full access. The auth boundary is the Next.js server which
-- validates the cabin session cookie BEFORE making any query on
-- a client's behalf.
-- =============================================================
alter table cabins                       enable row level security;
alter table cabin_members                enable row level security;
alter table cabin_brief_sections         enable row level security;
alter table cabin_guests_manifest        enable row level security;
alter table cabin_audit_log              enable row level security;
alter table filotimo_circle_members      enable row level security;
alter table cabin_mood_board             enable row level security;
alter table cabin_time_capsules          enable row level security;
alter table cabin_data_consents          enable row level security;
alter table cabin_memory_anchors         enable row level security;

-- No policies for anon/authenticated → effective deny-all. The
-- service_role bypasses RLS by design.

-- =============================================================
-- VIEW: cabin_listing  (admin convenience, used by gy-command)
-- =============================================================
create or replace view cabin_listing as
select
  c.id,
  c.status,
  c.vessel_name,
  c.charter_period_from,
  c.charter_period_to,
  c.principal_charterer_name,
  c.principal_charterer_email,
  c.brief_completion_percent,
  c.brief_submitted_at,
  c.concierge_mode_active,
  c.created_at,
  c.updated_at,
  (select count(*) from cabin_members m where m.cabin_id = c.id and m.deleted_at is null) as members_count
from cabins c
where c.deleted_at is null;

-- =============================================================
-- END
-- =============================================================
