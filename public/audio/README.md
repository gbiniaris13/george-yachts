# /public/audio/ — ambient background music

The AmbientPlayer (gold equaliser-bar pill, bottom-left) plays
**`ambient-lounge.mp3`** on the visitor's first interaction (click / key /
tap), fading in at a low background level. Visitors can mute it any time with
the pill; the choice is remembered for the session. If the MP3 ever fails to
load, the player falls back to the Web Audio synth.

## Current track (2026-06-29)

- **File**: `ambient-lounge.mp3`
- **Title**: "Smooth Jazz Lounge - Relaxing Evening"
- **Source**: Pixabay (https://pixabay.com/music/bossa-nova-smooth-jazz-lounge-relaxing-evening-537465/)
- **Licence**: Pixabay Content Licence — free for commercial use, **no
  attribution required**, royalty-free.
- Chosen to match George's brief: calm, classy, holiday mood, the kind of
  lounge/jazz heard at VIP resorts — **no bouzouki / clarino, not beat-driven.**

## How to swap the track

1. Pick a royalty-free instrumental (Pixabay / Mixkit / CC0). Calm, classy,
   no lyrics, no Greek folk instruments, not beat-heavy.
2. Save it here as **`ambient-lounge.mp3`** (exact name — the player loads
   `/audio/ambient-lounge.mp3`), or change `AMBIENT_MP3` in
   `app/components/AmbientPlayer.jsx`.
3. Keep it a clean loop, ideally 2–4 min, MP3, reasonable bitrate.
4. Commit + push; Vercel serves it on the next deploy.
