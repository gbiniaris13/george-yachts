# /public/videos/ — Hero video assets

Phase 27e (Forbes-launch eve, 2026-05-05) — the BackgroundVideo
component in app/components/VideoSection.jsx auto-prefers a WebM
source over the existing MP4. It lists `<source type="video/webm">`
first; modern browsers download only that, saving ~40% bandwidth
on the hero. Safari + older browsers fall through to the MP4.

## How to upgrade hero video to WebM

For each .mp4 in this directory you want to optimize, transcode to
.webm with ffmpeg:

```bash
ffmpeg -i yacht-cruising-new.mp4 \
  -c:v libvpx-vp9 -crf 32 -b:v 0 \
  -c:a libopus -b:a 96k \
  -vf "scale=1280:-2" \
  -row-mt 1 -threads 8 \
  yacht-cruising-new.webm
```

Place the .webm next to the .mp4 (same base name). Commit + push.
The component code transforms `foo.mp4` -> `foo.webm` automatically
in the source list so no JS deploy is required.

## Recommended encode settings

- **Codec**: VP9 (libvpx-vp9). Wider device support than AV1.
- **Resolution**: 1280×720 max for hero (the hero is a 100dvh fill,
  most laptops + iPhones won't show more than 1280px width).
- **CRF**: 30–35 (32 is a good middle). Lower = larger + sharper.
- **Audio**: strip or 96 kbps Opus. We mute hero anyway.
- **Target size**: under 1.5 MB for the hero loop.

## Why we don't bundle WebMs in the repo today

Same rationale as /public/audio: hero footage is editorial and
boss may swap it out monthly. The repo carries the canonical MP4;
WebM is an optional optimization layer that auto-activates the
moment the file exists.
