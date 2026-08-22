// The logo, rebuilt as a lockup (2026-08-22, the detail-shop pass).
//
// The old asset baked mark, wordmark, hairline and "BROKERAGE HOUSE" into
// one 610 x 300 PNG. At display size the subtitle was thirteen raster rows
// tall, which is why it always read as fog no matter how the image was
// sharpened. The fix is structural, not more sharpening:
//
//   - gy-logo-mark-2x.(webp|png): mark + GEORGE YACHTS only, cut from the
//     894 px colour master (gy-logo-real-600.png), scaled x2 lanczos with
//     an unsharp pass and a gentle brightness lift on the chrome so the
//     wordmark holds its own on navy. Same artwork, same golds and silvers.
//   - The hairline and the subtitle are real DOM: a gradient rule and
//     "THE BROKERAGE HOUSE" in the UI face with silver metal clipped into
//     the glyphs (.gy-silvertext). Text is crisp at every device density,
//     which no raster at this physical size can be.
//
// No hooks, so it renders from server and client components alike.
export default function LogoLockup({
  imgHeight, // CSS height for the image (nav usage)
  imgWidth, // CSS width for the image (hero usage)
  gap = 7,
  subtitleSize = 8,
  imgClassName = "",
  imgStyle = {},
  style = {},
}) {
  return (
    <span
      className="gy-logo-lockup"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap,
        ...style,
      }}
    >
      <picture>
        <source srcSet="/images/gy-logo-mark-2x.webp" type="image/webp" />
        <img
          src="/images/gy-logo-mark-2x.png"
          alt="George Yachts, The Brokerage House"
          className={imgClassName}
          style={{
            display: "block",
            ...(imgHeight ? { height: imgHeight, width: "auto" } : {}),
            ...(imgWidth ? { width: imgWidth, height: "auto" } : {}),
            ...imgStyle,
          }}
        />
      </picture>
      <span aria-hidden="true" className="gy-logo-rule" />
      <span className="gy-silvertext gy-logo-sub" style={{ fontSize: subtitleSize }}>
        The Brokerage House
      </span>
    </span>
  );
}
