"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/I18nProvider";

function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function YourBroker() {
  const { t } = useI18n();
  const [ref, visible] = useReveal(0.15);

  return (
    <section
      ref={ref}
      style={{
        padding: "120px 24px",
        background: "#000",
        borderTop: "1px solid rgba(218,165,32,0.08)",
        borderBottom: "1px solid rgba(218,165,32,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "60px",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
        className="your-broker-grid"
      >
        {/* Photo */}
        <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", minHeight: "300px" }}>
          <Image
            src="/images/george.jpg"
            alt="George P. Biniaris — Managing Broker, George Yachts"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 250px, 280px"
            priority
          />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }} />
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.4em",
            color: "#DAA520",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            {t('broker.label')}
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}>
            {t('broker.name')}
          </h2>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginBottom: "32px",
          }}>
            {t('broker.title')}
          </p>

          <div style={{
            width: "40px", height: "1px", marginBottom: "32px",
            background: "linear-gradient(90deg, #DAA520, transparent)",
          }} />

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "15px",
            lineHeight: 2,
            color: "rgba(255,255,255,0.55)",
            marginBottom: "16px",
          }}>
            {t('broker.text1')}
          </p>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "15px",
            lineHeight: 2,
            color: "rgba(255,255,255,0.55)",
            marginBottom: "40px",
          }}>
            {t('broker.text2')}
          </p>

          <a
            href="https://calendly.com/george-georgeyachts/30min"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (typeof window !== "undefined" && typeof window.gtag === "function") {
                try {
                  window.gtag("event", "calendly_click", { click_location: "your_broker_section" });
                } catch {}
              }
            }}
            style={{
              display: "inline-block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#000",
              background: "linear-gradient(90deg, #E6C77A, #C9A24D, #A67C2E)",
              padding: "16px 40px",
              textDecoration: "none",
              transition: "all 0.4s ease",
            }}
          >
            {t('broker.cta')}
          </a>

          <a
            href="/about-us"
            style={{
              display: "inline-block",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              marginLeft: "24px",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.color = "#DAA520"}
            onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.4)"}
          >
            {t('broker.learnMore')}
          </a>
        </div>
      </div>

      {/* Process — merged from the standalone HowItWorks section
          (2026-04-21, Proposal B). Three editorial steps sit under
          the bio so the "Meet George + how he works" story reads on
          ONE scroll instead of two stacked sections. Copy kept
          generic so i18n/string edits stay in one place. */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "80px auto 0",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 10,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#DAA520",
              opacity: 0.85,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            How we work together
          </p>
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 1,
              margin: "0 auto",
              background: "linear-gradient(90deg, transparent, #DAA520, transparent)",
              opacity: 0.7,
            }}
          />
        </div>

        <div
          className="your-broker-process"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
          }}
        >
          {[
            {
              num: "01",
              title: "You share the dream",
              desc: "A quick call — dates, group, islands you love, islands you'd skip.",
            },
            {
              num: "02",
              title: "I curate the fleet",
              desc: "A short, honest shortlist from our 66 yachts, with real availability and my notes.",
            },
            {
              num: "03",
              title: "We sail",
              desc: "MYBA contract, full crew brief, and a broker on call through every day at sea.",
            },
          ].map((step) => (
            <div key={step.num} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 40,
                  fontWeight: 300,
                  color: "#DAA520",
                  opacity: 0.45,
                  margin: "0 0 8px",
                  lineHeight: 1,
                }}
              >
                {step.num}
              </p>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "#fff",
                  margin: "0 0 8px",
                  letterSpacing: "0.01em",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.48)",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  maxWidth: 260,
                  margin: "0 auto",
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .your-broker-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center;
          }
          .your-broker-grid > div:first-child {
            max-width: 250px;
            margin: 0 auto;
          }
          .your-broker-process {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  );
}
