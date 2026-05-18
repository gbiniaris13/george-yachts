-- =============================================================
-- THE CABIN — voyage photo album (Phase 4).
--
-- Distinct from cabin_mood_board (pre-charter "vibe pinning")
-- — the voyage album is post-charter, contributed by anyone with
-- a cabin_members row (charterer + invited guests). The photos
-- live in the same cabin-photos bucket, under <cabin_id>/voyage/.
-- =============================================================

create table if not exists cabin_voyage_photos (
  id uuid primary key default gen_random_uuid(),
  cabin_id uuid not null references cabins(id) on delete cascade,
  uploaded_by_email text not null,
  storage_path text not null,
  caption text,
  taken_at timestamptz,
  created_at timestamptz not null default now(),
  redacted_at timestamptz                     -- soft-delete by uploader
);

create index if not exists idx_voyage_photos_cabin
  on cabin_voyage_photos(cabin_id, created_at desc)
  where redacted_at is null;

alter table cabin_voyage_photos enable row level security;
