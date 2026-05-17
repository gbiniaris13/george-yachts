-- =============================================================
-- THE CABIN — welcome video field on cabins.
--
-- A YouTube/Vimeo unlisted URL OR a Cloudflare Stream HLS URL.
-- Rendered as an oEmbed-style iframe on /cabin/before-you-sail.
-- =============================================================

alter table cabins
  add column if not exists welcome_video_url text,
  add column if not exists welcome_video_title text;
