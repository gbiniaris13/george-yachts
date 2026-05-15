-- Visitor advanced-fingerprint columns (2026-05-15)
-- Added per George's directive: "WebGL + audio fingerprint +
-- copy-text + mouse entropy + DC/bot filter". All columns are
-- nullable so missing signals (older browsers / privacy modes)
-- don't break inserts.
--
-- Apply order: this runs AFTER 2026-05-14-visitor-intelligence.sql.

ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS webgl_vendor        text,
  ADD COLUMN IF NOT EXISTS webgl_renderer      text,
  ADD COLUMN IF NOT EXISTS webgl_sig           text,
  ADD COLUMN IF NOT EXISTS canvas_sig          text,
  ADD COLUMN IF NOT EXISTS audio_sig           text,
  ADD COLUMN IF NOT EXISTS plugin_count        integer,
  ADD COLUMN IF NOT EXISTS mime_count          integer,
  ADD COLUMN IF NOT EXISTS pdf_viewer          boolean,
  ADD COLUMN IF NOT EXISTS webdriver           boolean,
  ADD COLUMN IF NOT EXISTS color_depth         integer,
  ADD COLUMN IF NOT EXISTS tz_offset_min       integer,
  -- Mouse-entropy summary — populated at session_end. Helps the
  -- dashboard show "real human" vs "scripted scroll" verdicts.
  ADD COLUMN IF NOT EXISTS mouse_samples       integer,
  ADD COLUMN IF NOT EXISTS mouse_angle_var     double precision,
  ADD COLUMN IF NOT EXISTS mouse_speed_var     double precision,
  ADD COLUMN IF NOT EXISTS mouse_idle_gaps     integer,
  -- Copy-event texts (most recent 5, capped at 500 chars each).
  -- jsonb array of { page, text, ts } objects. The track route
  -- appends to this column; nightly cleanup truncates to the last
  -- 5 entries to avoid unbounded growth.
  ADD COLUMN IF NOT EXISTS copy_texts          jsonb;

-- Helpful index for dashboard "spot the bots" queries.
CREATE INDEX IF NOT EXISTS sessions_webdriver_idx
  ON public.sessions (webdriver)
  WHERE webdriver = true;

CREATE INDEX IF NOT EXISTS sessions_audio_sig_idx
  ON public.sessions (audio_sig)
  WHERE audio_sig IS NOT NULL;
