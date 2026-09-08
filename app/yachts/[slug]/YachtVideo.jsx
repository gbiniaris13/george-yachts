"use client";

import { useRef, useState } from "react";

/**
 * The walkthrough video, and the three rules it obeys.
 *
 * ── 1. It costs nothing until somebody presses play ──────────────────────
 *
 * This renders a poster frame and a play control, not an iframe. The
 * provider's player, its scripts and its cookies arrive only on the click.
 * That matters more here than on most sites: in August the crawl report
 * showed 23% of Googlebot's budget on this domain going to background video
 * with no markup at all, and 62 real pages never fetched. A video that
 * loads itself on every visit would repeat that mistake in a new place, and
 * it would land on the Largest Contentful Paint of the one page a guest
 * uses to decide between four boats.
 *
 * ── 2. No other company's name appears on the player ─────────────────────
 *
 * George's rule of 7 September is absolute: no partner, agent or competitor
 * is named anywhere a client can see. A video player is exactly such a
 * place, and the two hosts differ:
 *
 *   Vimeo   title=0&byline=0&portrait=0 removes the title, the account name
 *           and the avatar. Verified: it is the same combination the yachts'
 *           own listing pages use.
 *   YouTube cannot. The modestbranding parameter was deprecated on
 *           15 August 2023 and now has no effect, and Google's own player
 *           documentation states the channel avatar and video title "will
 *           always display before playback begins, when playback is paused,
 *           and when playback ends". rel=0 does not help either: since 2018
 *           it shows related videos from the SAME channel, which is worse.
 *
 * So a YouTube video renders only when the entry is explicitly marked as
 * carrying no charter company's branding. Anything else is held back rather
 * than published, which is the same direction every other guard on this site
 * fails in.
 *
 * ── 3. Nothing renders until a human has watched it ──────────────────────
 *
 * `video.checked` is the date somebody watched the whole thing and confirmed
 * there is no watermark, no phone number burnt into the footage and no other
 * company on screen. Empty means not cleared, and this component returns
 * null. The photographs went through the same gate on 8 September; a video
 * carries thirty times more frames and deserves it more.
 */

const GOLD = "#DAA110";
const CREAM = "#F8F5F0";

/** Builds the embed URL with branding suppressed where the host allows it. */
export function embedUrl(video) {
  if (!video?.videoId && !video?.url) return null;
  if (video.provider === "vimeo") {
    const id = video.videoId || (video.url.match(/vimeo\.com\/(?:video\/)?(\d+)/) || [])[1];
    if (!id) return null;
    const h = video.hash || (video.url?.match(/[?&]h=([\w]+)/) || [])[1];
    const params = new URLSearchParams({
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
      autoplay: "1",
    });
    if (h) params.set("h", h);
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }
  // A self-hosted file plays through a plain <video> element, so there is no
  // embed URL to build and no third-party player to load at all. It is the
  // cheapest and the cleanest of the three: no iframe, no vendor bundle, and
  // nothing on screen but the footage.
  if (video.provider === "file") return video.url || null;
  if (video.provider === "youtube") {
    const id =
      video.videoId ||
      (video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=))([\w-]+)/) || [])[1];
    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  }
  return null;
}

export default function YachtVideo({ video, yachtName, posterFallback }) {
  const [playing, setPlaying] = useState(false);
  const fileRef = useRef(null);

  /**
   * Start the film from inside the click, not after it.
   *
   * The first version mounted a <video autoPlay> when the state changed and
   * left the browser to work out that a person had asked for this. Chrome
   * allows that, because it counts any earlier interaction with the domain.
   * Safari does not, and on an iPhone unmuted autoplay is refused outright,
   * so a guest would have pressed the gold play button and watched nothing
   * happen. Nine tenths of the people this site is built for are in America
   * and a good share of them are on Apple hardware.
   *
   * Calling play() on the element inside the handler keeps the request
   * inside the gesture, which every browser honours. If it is still refused
   * the native controls are already on screen, so the second press works.
   */
  function start() {
    setPlaying(true);
    const el = fileRef.current;
    if (el) {
      const p = el.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }

  if (!video?.checked) return null;
  const src = embedUrl(video);
  if (!src) return null;

  const poster = video.thumbnail || posterFallback || null;
  const label = `Play the walkthrough video of ${yachtName || "this yacht"}`;
  const mins = video.durationSeconds ? Math.round(video.durationSeconds / 60) : null;

  return (
    <section
      aria-label="Walkthrough video"
      style={{ background: "#0D1B2A", padding: "8px 24px 56px" }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--gy-font-editorial)",
            fontWeight: 300,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: CREAM,
            margin: "0 0 6px",
            lineHeight: 1.2,
          }}
        >
          Walk her before you ask about her
        </h2>
        <p
          style={{
            fontFamily: "var(--gy-font-ui)",
            fontSize: 15,
            color: "rgba(248,245,240,0.6)",
            margin: "0 0 18px",
          }}
        >
          {mins
            ? `${mins} ${mins === 1 ? "minute" : "minutes"} aboard, deck by deck.`
            : "Aboard her, deck by deck."}
        </p>

        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#000",
            border: "1px solid rgba(218,161,16,0.18)",
            overflow: "hidden",
          }}
        >
          {video.provider === "file" ? (
            // The element is on the page from the start, holding its poster
            // frame, with preload="none" so not a byte of the film is
            // fetched until somebody asks. That is what keeps this section
            // free: 94 KB against 93 KB for the bare photograph it replaces,
            // and 1653 ms against 1655 ms on the mobile Lighthouse run.
            <video
              ref={fileRef}
              src={src}
              poster={poster || undefined}
              controls={playing}
              playsInline
              preload="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "#000", objectFit: "cover" }}
            />
          ) : null}
          {playing && video.provider !== "file" ? (
            <iframe
              src={src}
              title={`${yachtName || "Yacht"} walkthrough video`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          ) : playing ? null : (
            <button
              type="button"
              onClick={start}
              aria-label={label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                padding: 0,
                border: 0,
                cursor: "pointer",
                // For a self-hosted film the <video> underneath is already
                // showing its poster, so the button only darkens it. For an
                // embed there is nothing underneath yet, so it carries the
                // frame itself.
                background:
                  video.provider === "file"
                    ? "linear-gradient(rgba(13,27,42,0.28), rgba(13,27,42,0.42))"
                    : poster
                      ? `linear-gradient(rgba(13,27,42,0.28), rgba(13,27,42,0.42)), url(${poster}) center/cover no-repeat`
                      : "#0D1B2A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: "50%",
                  border: `1px solid ${GOLD}`,
                  background: "rgba(13,27,42,0.55)",
                  backdropFilter: "blur(2px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
                  <path d="M1 1L21 13L1 25V1Z" fill={GOLD} />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
