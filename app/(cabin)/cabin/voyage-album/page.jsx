// /cabin/voyage-album — post-charter memories.
"use client";

import { useEffect, useRef, useState } from "react";
import IntroParagraph from "../../../components/cabin/IntroParagraph";
import { SectionTitle } from "../../../components/cabin/brief/FormFields";

async function compress(file, maxEdge = 2200, quality = 0.85) {
  const buf = await file.arrayBuffer();
  const blob = new Blob([buf], { type: file.type });
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    let { width, height } = img;
    if (width > maxEdge || height > maxEdge) {
      const r = Math.min(maxEdge / width, maxEdge / height);
      width = Math.round(width * r);
      height = Math.round(height * r);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);
    return await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("compress-failed"))),
        "image/jpeg",
        quality
      )
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function VoyageAlbumPage() {
  const [items, setItems] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);     // lightbox photo
  const fileRef = useRef(null);

  async function load() {
    try {
      const j = await (await fetch("/api/cabin/voyage-album")).json();
      setItems(j.items ?? []);
    } catch { setItems([]); }
  }
  useEffect(() => { void load(); }, []);

  async function onUpload(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setError(null);

    // Vercel's serverless function request body has a hard ceiling
    // of ~4.5 MB. Anything bigger is killed at the edge with a raw
    // "Request Entity Too Large" plain-text 413 — never reaches our
    // route. That's why "Unexpected token 'R' in JSON" was showing
    // up: r.json() trying to parse the plain-text 413 body.
    //
    // Until we ship the direct-to-Supabase signed-upload path,
    // videos must fit under this ceiling. ~3.8 MB lets us subtract
    // multipart overhead and still squeeze in a short phone clip.
    const VIDEO_LIMIT_BYTES = 3.8 * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const isImage = /^image\//.test(f.type);
      const isVideo = /^video\//.test(f.type);
      if (!isImage && !isVideo) continue;
      setProgress(`Uploading ${i + 1}/${files.length}…`);
      try {
        const form = new FormData();
        if (isImage) {
          // Photos: client-side Canvas compression to JPEG so we
          // stay inside the budget.
          const small = await compress(f);
          form.append("file", small, f.name.replace(/\.\w+$/, "") + ".jpg");
        } else {
          if (f.size > VIDEO_LIMIT_BYTES) throw new Error("too-large");
          form.append("file", f, f.name);
        }
        if (caption.trim() && i === 0) form.append("caption", caption.trim());
        const r = await fetch("/api/cabin/voyage-album", { method: "POST", body: form });
        // Defensive parser — Vercel returns plain-text 413 above
        // the body limit, which would otherwise crash JSON.parse.
        let j = null;
        const ct = r.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          j = await r.json().catch(() => null);
        } else {
          const txt = await r.text().catch(() => "");
          if (r.status === 413 || /entity too large/i.test(txt)) {
            throw new Error("too-large");
          }
          throw new Error(`upload-failed (${r.status})`);
        }
        if (!r.ok) throw new Error(j?.error || "upload-failed");
      } catch (err) {
        const m = err?.message;
        const friendly =
          m === "compress-failed"
            ? "could not read on this browser — try saving as JPG"
            : m === "too-large"
            ? "video is too large — try a clip under ~3 MB (about 5 seconds at phone quality). Longer-video uploads are coming soon."
            : m || "upload failed";
        setError(`Item ${i + 1}: ${friendly}`);
      }
    }
    setCaption("");
    setProgress(null);
    void load();
  }

  async function remove(id) {
    if (!confirm("Remove this photo from the voyage album?")) return;
    setItems((prev) => (prev ?? []).filter((p) => p.id !== id));
    await fetch("/api/cabin/voyage-album", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  return (
    <article>
      <SectionTitle
        kicker="The week, kept"
        title="Voyage"
        italic="album."
      />
      <IntroParagraph>
        After your week at sea, this is where the photographs live — yours,
        forever. Any member of your group can upload. Tap any photo to view
        it large; full-resolution downloads are always available from your
        Cabin. Short clips welcome too (up to ~3 MB each, roughly five
        seconds at phone quality) — long-video uploads coming soon.
      </IntroParagraph>

      <div className="va-add">
        <input
          type="text"
          placeholder="A caption for the first photo or video (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={240}
          className="va-add__caption"
        />
        <label className="va-add__btn">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/quicktime,video/webm"
            multiple
            onChange={onUpload}
            disabled={progress !== null}
            style={{ display: "none" }}
          />
          <span>{progress || "Add photos or videos"}</span>
        </label>
        {error && <p className="va-add__err">{error}</p>}
      </div>

      <div className="va-grid">
        {items === null && [...Array(8)].map((_, i) => (
          <div key={i} className="va-skel" />
        ))}
        {items?.length === 0 && (
          <p className="va-empty">
            <em>The album opens here. Add the first photo or video above.</em>
          </p>
        )}
        {items?.map((p) => {
          const isVid = /\.(mp4|mov|webm)(\?|$)/i.test(p.storage_path || "");
          return (
            <figure key={p.id} className="va-card" onClick={() => setActive(p)}>
              {isVid ? (
                <>
                  {/* poster-less inline video, muted for autoplay-safe preview */}
                  <video src={p.url} muted playsInline preload="metadata" />
                  <span className="va-card__play" aria-hidden>▶</span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.url} alt={p.caption || ""} loading="lazy" />
              )}
              {p.caption && <figcaption>{p.caption}</figcaption>}
              <button
                type="button"
                aria-label="Remove"
                className="va-card__del"
                onClick={(e) => { e.stopPropagation(); remove(p.id); }}
              >
                ×
              </button>
            </figure>
          );
        })}
      </div>

      {active && (
        <div className="va-lightbox" onClick={() => setActive(null)} role="dialog">
          {/\.(mp4|mov|webm)(\?|$)/i.test(active.storage_path || "") ? (
            <video src={active.url} controls autoPlay playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={active.url} alt={active.caption || ""} />
          )}
          {active.caption && <p>{active.caption}</p>}
          <button onClick={() => setActive(null)} aria-label="Close">×</button>
        </div>
      )}

      <style>{`
        .va-add {
          background: #fff; border: 1px solid rgba(13,27,42,0.08);
          padding: 18px; margin-top: 28px; margin-bottom: 28px;
          display: flex; flex-direction: column; gap: 14px;
        }
        .va-add__caption {
          width: 100%; background: transparent; border: 0;
          border-bottom: 1px solid rgba(13,27,42,0.18);
          padding: 8px 0 9px; font-family: var(--gy-font-body);
          font-size: 14px; color: var(--gy-navy); outline: none;
        }
        .va-add__caption:focus { border-bottom-color: var(--gy-gold); }
        .va-add__btn {
          align-self: flex-start;
          background: var(--gy-navy); color: var(--gy-ivory);
          padding: 11px 22px; border: 1px solid var(--gy-gold);
          font-family: var(--gy-font-ui); font-size: 10.5px;
          letter-spacing: 2.5px; text-transform: uppercase;
          cursor: pointer; transition: background 160ms ease;
        }
        .va-add__btn:hover { background: #142233; }
        .va-add__err {
          color: #b14a3a; font-family: var(--gy-font-editorial);
          font-style: italic; font-size: 13px; margin: 0;
        }

        .va-grid {
          display: grid; gap: 8px;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 560px) { .va-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .va-grid { grid-template-columns: repeat(4, 1fr); } }
        .va-empty {
          grid-column: 1 / -1; text-align: center; padding: 32px 0;
          font-family: var(--gy-font-editorial); font-style: italic;
          color: rgba(13,27,42,0.5);
        }
        .va-skel {
          aspect-ratio: 1; background: rgba(13,27,42,0.06);
          animation: pulse 1.4s ease-in-out infinite;
        }
        @keyframes pulse { 50% { opacity: 0.5; } }

        .va-card {
          margin: 0; position: relative; overflow: hidden;
          cursor: pointer; background: #fff;
          border: 1px solid rgba(13,27,42,0.08);
        }
        .va-card img,
        .va-card video {
          display: block; width: 100%; height: 100%;
          aspect-ratio: 1; object-fit: cover;
          transition: transform 240ms ease;
        }
        .va-card:hover img,
        .va-card:hover video { transform: scale(1.02); }
        .va-card__play {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 48px; height: 48px;
          background: rgba(13,27,42,0.6);
          color: var(--gy-ivory);
          border: 1px solid var(--gy-gold);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; padding-left: 4px;
          pointer-events: none;
        }
        .va-card figcaption {
          font-family: var(--gy-font-editorial); font-style: italic;
          font-size: 12.5px; color: rgba(13,27,42,0.7);
          padding: 6px 10px 8px; border-top: 1px solid rgba(13,27,42,0.06);
        }
        .va-card__del {
          position: absolute; top: 6px; right: 6px;
          background: rgba(13,27,42,0.7); color: var(--gy-ivory);
          width: 26px; height: 26px; border: 0; font-size: 18px;
          line-height: 1; cursor: pointer; opacity: 0;
          transition: opacity 160ms ease;
        }
        .va-card:hover .va-card__del { opacity: 1; }

        .va-lightbox {
          position: fixed; inset: 0; background: rgba(13,27,42,0.94);
          z-index: 100; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 20px; padding-top: calc(20px + env(safe-area-inset-top));
        }
        .va-lightbox img,
        .va-lightbox video {
          max-width: 95vw; max-height: 80vh; object-fit: contain;
        }
        .va-lightbox p {
          color: var(--gy-ivory); font-family: var(--gy-font-editorial);
          font-style: italic; margin-top: 14px; text-align: center;
        }
        .va-lightbox button {
          position: absolute; top: 16px; right: 16px;
          top: calc(16px + env(safe-area-inset-top));
          background: transparent; color: var(--gy-ivory);
          border: 1px solid var(--gy-gold); width: 40px; height: 40px;
          font-size: 22px; cursor: pointer;
        }
      `}</style>
    </article>
  );
}
