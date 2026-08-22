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
  imgSizes = "(max-width: 767px) 232px, 280px",
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
      {/* 2026-08-22, ταχύτητα: το ενιαίο 972px webp ήταν 118 KB και κάθεται
          στην κορυφή του κινητού, όπου μετράει το LCP. Το ίδιο σήμα σε τρία
          πλάτη: 464 για το κινητό (232 CSS px στα 2x), 700 για το masthead,
          972 για οθόνες υψηλής πυκνότητας. Το κινητό κατεβάζει 36 KB αντί
          για 118. sizes ανά χρήση, γιατί το ίδιο component σερβίρει hero,
          nav, drawer και footer σε τελείως διαφορετικά μεγέθη. */}
      <picture>
        <source
          type="image/webp"
          sizes={imgSizes}
          srcSet="/images/gy-logo-mark-464.webp 464w, /images/gy-logo-mark-700.webp 700w, /images/gy-logo-mark-2x.webp 972w"
        />
        <img
          src="/images/gy-logo-mark-464.png"
          sizes={imgSizes}
          srcSet="/images/gy-logo-mark-464.png 464w, /images/gy-logo-mark-700.png 700w, /images/gy-logo-mark-2x.png 972w"
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
