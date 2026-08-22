"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/I18nProvider";
import FleetQuickFinder from "@/app/components/FleetQuickFinder";

export default function ExplorerFleetClient({ yachts, lowestWeekly = 11500, highestWeekly = 27500 }) {
  const { t } = useI18n();

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B2A" }}>
      {/* Back Button */}
      <div style={{ position: "fixed", top: 100, left: 24, zIndex: 9999 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.15em", color: "rgba(248, 245, 240,0.5)", padding: "12px 20px", background: "rgba(13, 27, 42, 0.6)", backdropFilter: "blur(8px)", borderRadius: 4, border: "1px solid rgba(218, 161, 16,0.2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK
        </Link>
      </div>
      {/* Hero */}
      <section style={{ position: "relative", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image src="/images/explorer-fleet-hero.jpg" alt="Sailing Fleet - group yacht charter Greece" fill style={{ objectFit: "cover", objectPosition: "center 30%", filter: "grayscale(100%) contrast(1.2) brightness(0.4)" }} sizes="100vw" priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13, 27, 42,0.8) 0%, transparent 40%, rgba(13, 27, 42,0.4) 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.5em", color: "#DAA110", textTransform: "uppercase", marginBottom: 24 }}>
            George Yachts Brokerage House
          </p>
          <h1 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(56px, 10vw, 130px)", fontWeight: 300, color: "#F8F5F0", margin: "0 0 18px 0", letterSpacing: "-0.035em", lineHeight: 0.95, textShadow: "0 6px 32px rgba(13, 27, 42,0.55)" }}>
            Sailing Fleet
          </h1>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, #DAA110, transparent)", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "clamp(0.8rem, 1.5vw, 1rem)", fontWeight: 300, color: "rgba(248, 245, 240,0.5)", letterSpacing: "0.15em", marginBottom: 40 }}>
            More islands. More adventure. The smart way to see Greece.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=17867988798&text=Hello%20George%2C%20I%27m%20exploring%20the%20Explorer%20Fleet%20for%20a%20Greek%20charter.%20Can%20we%20plan%20an%20adventure%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--gy-font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0D1B2A", background: "linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)", padding: "16px 48px", textDecoration: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.52.802.537-.056 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
            Plan Your Adventure on WhatsApp
          </a>
        </div>
      </section>

      {/* 2026-07-08 (George's UI wave #3), three answers instead of
          scrolling every card. Deep-links to the filtered fleet grid. */}
      <div style={{ background: "#0D1B2A", padding: "56px 0 8px" }}>
        <FleetQuickFinder heading="Find your Explorer yacht in three answers" />
      </div>

      {/* Price Anchor */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "48px 40px", border: "1px solid rgba(218, 161, 16,0.15)", borderRadius: 4 }}>
          {/* 2026-08-21 (section 5). This read "From €420 to €1,800 per
              person / Per week · skipper included or available · expenses
              extra". Both halves had to go. The figure was the week divided
              by the berths, which is not a price anybody can pay, and
              "skipper included or available" is the exact arrangement George
              has taken off the site: this house writes crewed weeks. */}
          <p style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#DAA110", margin: "0 0 16px 0" }}>
            From €{lowestWeekly.toLocaleString('en-US')} to €{highestWeekly.toLocaleString('en-US')} / week
          </p>
          <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 13, color: "rgba(248, 245, 240,0.4)", lineHeight: 1.8, margin: 0, letterSpacing: "0.05em" }}>
            Per yacht, per week · crew aboard · APA &amp; expenses extra
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
          {/* The middle card used to be titled "Skippered or Crewed" and
              offered "Captain only, or add a hostess". That is the offer
              George has removed. What replaces it is the reason a smaller
              yacht is the right call, which is the argument the card was
              standing in the way of.

              The emoji went with it. A palm tree, a sailing boat and two
              grey figures at 32px is what a template does, and it is the
              first thing that tells a reader nobody looked at this page. A
              thin gold numeral is what the awards band uses and it costs
              nothing to read. */}
          {[
            { n: "01", title: "More Islands, Less Hassle", desc: "No ferries. No packing and unpacking. The yacht moves while you sleep." },
            { n: "02", title: "Small Enough to Get In", desc: "Bays the large yachts cannot enter, and a table ashore in villages they sail past." },
            { n: "03", title: "Built for a Group", desc: "Six to twelve, travelling together, with the crew aboard to run the week." },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: 40, border: "1px solid rgba(248, 245, 240,0.06)", borderRadius: 4 }}>
              <div style={{ fontFamily: "var(--gy-font-display)", fontWeight: 250, fontSize: 26, lineHeight: 1, color: "rgba(218, 161, 16,0.55)", marginBottom: 18, fontVariantNumeric: "lining-nums" }}>{item.n}</div>
              <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "1.3rem", color: "#F8F5F0", marginBottom: 12 }}>{item.title}</h3>
              <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248, 245, 240,0.4)", lineHeight: 1.8 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perfect For */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A", textAlign: "center", borderTop: "1px solid rgba(218, 161, 16,0.06)" }}>
        <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "2rem", color: "#F8F5F0", marginBottom: 40 }}>Perfect For</h2>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: 800, margin: "0 auto" }}>
          {["Friend reunions", "Milestone birthdays", "Bachelor & bachelorette trips", "Multi-generational family holidays", "Small corporate retreats"].map((item, i) => (
            <span key={i} style={{ fontFamily: "var(--gy-font-ui)", fontSize: 12, color: "rgba(248, 245, 240,0.5)", padding: "12px 24px", border: "1px solid rgba(218, 161, 16,0.15)", borderRadius: 24, letterSpacing: "0.1em" }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Yacht Grid */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, letterSpacing: "0.4em", color: "#DAA110", textTransform: "uppercase", marginBottom: 16 }}>
              {yachts.length} Vessels
            </p>
            <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#F8F5F0" }}>
              The Sailing Fleet
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
            {yachts.map((yacht) => {
              const rawPrice = String(yacht.weeklyRatePrice || '');
              const rawLower = rawPrice.toLowerCase();

              // Extract base charter rate (first number in price string)
              const priceMatch = rawPrice.match(/[\d,]+/);
              const basePrice = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 0;

              // 2026-08-21 (section 5). What stood here read the rate string
              // for the words "skipper" and "plus skipper" and printed
              // "Skipper incl." on the card. That is the arrangement George
              // has taken off the site, and the note is the same for every
              // yacht in this house anyway.
              const priceNote = 'crew aboard · APA & expenses extra';

              return (
                <Link key={yacht._id} href={`/yachts/${yacht.slug}`} style={{ textDecoration: "none", display: "block", border: "1px solid rgba(248, 245, 240,0.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden" }}>
                    {yacht.imageUrl && (
                      <Image src={yacht.imageUrl} alt={`${yacht.name} - yacht charter Greece`} fill style={{ objectFit: "cover" }} sizes="400px" />
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13, 27, 42,0.8) 0%, transparent 60%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "1.4rem", color: "#F8F5F0", margin: 0 }}>{yacht.name}</h3>
                      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, color: "rgba(248, 245, 240,0.5)", letterSpacing: "0.1em", marginTop: 4 }}>
                        {yacht.builder} · {yacht.length} · {yacht.sleeps} guests
                      </p>
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", background: "rgba(13, 27, 42,0.95)" }}>
                    {basePrice > 0 ? (
                      <>
                        {/* 2026-08-22 — UI face for figures, sitewide rule. */}
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "1.05rem", fontWeight: 500, color: "#DAA110", margin: "0 0 2px 0", letterSpacing: "0.05em", textShadow: "0 1px 0 rgba(122,92,4,0.3)" }}>
                          From €{basePrice.toLocaleString('en-US')} / week
                        </p>
                        <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10, color: "rgba(248, 245, 240,0.25)", margin: 0, letterSpacing: "0.08em" }}>
                          per week · {priceNote}
                        </p>
                      </>
                    ) : (
                      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: "1rem", fontWeight: 500, color: "#DAA110", margin: 0, letterSpacing: "0.05em", textShadow: "0 1px 0 rgba(122,92,4,0.3)" }}>
                        Price on request
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/charter-yacht-greece" style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.2em", color: "rgba(248, 245, 240,0.4)", textDecoration: "none" }}>
              View All Charter Yachts →
            </Link>
          </div>
        </div>
      </section>

      {/* George Section */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A", borderTop: "1px solid rgba(218, 161, 16,0.08)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ position: "relative", width: 180, height: 180, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            <Image src="/images/george-syros-quay.jpg" alt="George P. Biniaris" fill style={{ objectFit: "cover" }} sizes="180px" />
          </div>
          <div style={{ textAlign: "center", flex: 1, minWidth: 250 }}>
            <h3 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "1.5rem", color: "#F8F5F0", marginBottom: 8 }}>Your Broker: George</h3>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, color: "#DAA110", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>
              Managing Broker · <a href="https://iyba.org" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 3 }}>IYBA Member</a>
            </p>
            <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 14, color: "rgba(248, 245, 240,0.4)", lineHeight: 1.8, fontStyle: "italic" }}>
              "Same care. Same service. Whatever your budget."
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "clamp(40px, 5vw, 56px) 24px", background: "#0D1B2A", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--gy-font-editorial)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "#F8F5F0", marginBottom: 24 }}>
          Plan Your Adventure
        </h2>
        <a
          href="https://api.whatsapp.com/send/?phone=17867988798&text=Hello%20George%2C%20I%27d%20like%20to%20plan%20a%20Greek%20Explorer%20charter.%20What%27s%20available%20and%20what%20do%20you%20recommend%3F"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: "var(--gy-font-ui)", fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0D1B2A", background: "linear-gradient(90deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)", padding: "18px 56px", textDecoration: "none" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487 2.981 1.287 2.981.858 3.52.802.537-.056 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>
          Message George on WhatsApp
        </a>
      </section>
    </div>
  );
}
