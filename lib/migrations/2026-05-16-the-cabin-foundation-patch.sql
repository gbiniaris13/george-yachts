-- =============================================================
-- THE CABIN — foundation patch.
--
-- The foundation migration was tightened after first deploy:
--   * cabin_audit_log.cabin_id  : cascade  → set null
--     (audit must survive cabin hard-delete; Mitnick mandate)
--   * cabin_time_capsules.cabin_id : cascade → set null
--     (sealed paragraphs reach the author even if cabin gone)
--   * cabin_data_consents.cabin_id : cascade → set null
--     (consent history outlives the cabin for GDPR trail)
--   * three new supporting FK indices
--
-- `create table if not exists` skips the column rewrite on a DB
-- that already has the previous foundation applied, so this patch
-- file forces the constraint swap explicitly. Safe to run more
-- than once; uses `drop constraint if exists`.
-- =============================================================

alter table cabin_audit_log
  drop constraint if exists cabin_audit_log_cabin_id_fkey;
alter table cabin_audit_log
  add  constraint cabin_audit_log_cabin_id_fkey
  foreign key (cabin_id) references cabins(id) on delete set null;

alter table cabin_time_capsules
  drop constraint if exists cabin_time_capsules_cabin_id_fkey;
-- Also relax the NOT NULL on cabin_id so set-null can take effect.
alter table cabin_time_capsules
  alter column cabin_id drop not null;
alter table cabin_time_capsules
  add  constraint cabin_time_capsules_cabin_id_fkey
  foreign key (cabin_id) references cabins(id) on delete set null;

alter table cabin_data_consents
  drop constraint if exists cabin_data_consents_cabin_id_fkey;
alter table cabin_data_consents
  add  constraint cabin_data_consents_cabin_id_fkey
  foreign key (cabin_id) references cabins(id) on delete set null;

create index if not exists idx_cabin_members_assists
  on cabin_members(assists_member_id)
  where assists_member_id is not null;

create index if not exists idx_filotimo_last_voyage
  on filotimo_circle_members(last_voyage_cabin_id)
  where last_voyage_cabin_id is not null;

create index if not exists idx_consents_cabin
  on cabin_data_consents(cabin_id)
  where cabin_id is not null;
