-- =============================================================
-- THE CABIN — private chat (Phase 3).
--
-- One thread per cabin. Two participants per thread:
--   • The principal charterer (sender_role = 'charterer')
--   • George / admin (sender_role = 'admin')
-- Guests do not have access to the chat in Phase 3 (David Boies'
-- privacy point: the charterer must be able to share things with
-- George that no guest sees).
--
-- Append-only. Soft-delete via redacted=true so the audit trail
-- of a complaint conversation stays intact even if either side
-- "redacts" a message.
-- =============================================================

do $$ begin
  create type cabin_chat_role as enum ('charterer', 'admin');
exception when duplicate_object then null; end $$;

create table if not exists cabin_chat_messages (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  sender_email text not null,
  sender_role cabin_chat_role not null,
  body text not null,
  redacted boolean not null default false,
  created_at timestamptz not null default now(),
  read_at_charterer timestamptz,
  read_at_admin timestamptz
);

create index if not exists idx_chat_cabin_time
  on cabin_chat_messages(cabin_id, created_at desc);

-- RLS — deny-all by default; service role accesses everything.
alter table cabin_chat_messages enable row level security;
