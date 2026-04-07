"use client";

import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import Image from "next/image";
import "@/styles/service-page.css";

// ─── FAQ Data (all original Q&A preserved) ───
const faqData = [
  {
    category: "General Yacht Charter",
    items: [
      { q: "How does the yacht charter process work?", a: "We follow a clear five-step process: (1) You share your preferred dates, group size, and destination. (2) We propose curated yachts that match your style and budget. (3) We secure the chosen yacht with a MYBA charter agreement. (4) You complete payment (charter fee + VAT + APA). (5) Our team and the captain handle all logistics until disembarkation." },
      { q: "What is included in the charter fee?", a: "The charter fee covers the yacht itself, her crew, crew salaries, and yacht insurance, plus standard amenities, towels, linens, and regular use of the yacht\u2019s equipment as per her brochure." },
      { q: "What is not included in the charter fee?", a: "Not included are VAT, fuel, food and beverages, marina and port fees outside home port, delivery/redelivery fees (if applicable), communication costs, special requests, land transfers, and crew gratuity." },
      { q: "What is APA (Advance Provisioning Allowance)?", a: "APA is usually 30\u201340% of the charter fee and is paid in advance to cover operational expenses during the trip: fuel, food, beverages, marina fees, local taxes, taxis, and any extra services. The captain controls this budget, provides receipts, and any unused APA is refunded at the end of the charter." },
      { q: "What is VAT on yacht charters?", a: "VAT (Value Added Tax) is applied on top of the charter fee according to the local law of the country where the charter starts. In Greece it is typically 6.5% or 12% depending on the itinerary; in other Mediterranean countries it is usually between 15\u201322%. Your exact VAT rate is always confirmed before you sign the contract." },
      { q: "Are yacht charters all-inclusive?", a: "In the Mediterranean, no. Most charters operate under MYBA terms, where expenses are transparent and separated into charter fee, VAT, APA, and gratuity. In some parts of the Caribbean, smaller yachts may offer all-inclusive terms, but this is different from the standard Mediterranean model." },
      { q: "Are yacht charter prices negotiable?", a: "They can be, depending on demand, season, yacht popularity, and the length of your charter. Prime weeks in high season are usually fixed, while shoulder-season dates, longer charters, or last-minute bookings can sometimes allow for better terms or added value." },
      { q: "How far in advance should I book a yacht charter in Greece?", a: "For July and August, we recommend booking 6\u201310 months in advance to secure the best yachts and dates. For May\u2013June and September\u2013October, 2\u20134 months in advance is usually sufficient, depending on flexibility." },
      { q: "Can I smoke on the yacht?", a: "Smoking is generally allowed only in designated exterior areas. Interior smoking is not permitted on most yachts due to safety, ventilation, and upholstery protection." },
      { q: "Can I bring pets on a charter yacht?", a: "Some yachts accept small, well-behaved pets with prior owner approval and possibly an extra cleaning fee, while others have a strict no-pet policy. We will always confirm the pet policy for each yacht before booking." },
    ],
  },
  {
    category: "Onboard Experience",
    items: [
      { q: "Do guests have to remove shoes on a yacht?", a: "Yes. To protect the teak decks and keep interiors pristine, guests typically go barefoot or use soft, deck-friendly slippers provided by the crew. Outdoor shoes and heels are not allowed on board." },
      { q: "Why do you ask for shoe size on the preference form?", a: "We ask for shoe sizes to pre-prepare correctly sized equipment such as fins, snorkelling gear, water skis, wakeboards, and other water toys. This allows the crew to have everything adjusted and ready before you arrive." },
      { q: "How many crew members will be on board?", a: "The number of crew depends on the yacht\u2019s size and category. As a guideline: 20\u201324m yachts usually have 3\u20134 crew; 30\u201335m yachts have around 5\u20137 crew; 40\u201350m yachts have 8\u201310 crew; 50m+ yachts may carry 10\u201312 or more crew members." },
      { q: "Is Wi-Fi available on board?", a: "Yes, most charter yachts offer Wi-Fi, often via 4G/5G or satellite systems. Speed and coverage vary by cruising area and local network conditions." },
      { q: "Can we request special menus or dietary options?", a: "Absolutely. Before your charter, we send you a detailed preference sheet. Your chef will design a fully customized menu around your tastes, dietary needs, allergies, and special requests." },
      { q: "Are water toys included in the charter?", a: "Each yacht comes with her own selection of water toys, which may include jet skis, seabobs, paddleboards, kayaks, wakeboards, inflatables, and snorkelling gear. Some additional toys can be rented on request. We will always provide a toys list for each yacht." },
      { q: "Is tipping the crew mandatory?", a: "Tipping is not mandatory but is customary when you are happy with the service. In the Mediterranean, a guideline is 10\u201315% of the base charter fee, at your discretion, to be handed to the captain for fair distribution among the crew." },
      { q: "Can we host a party or event on the yacht?", a: "Small celebrations and events are usually welcome with prior notice. Larger events, extra guests, or professional setups must be agreed in advance with the owner and captain and may require additional approvals, fees, or security arrangements." },
    ],
  },
  {
    category: "Itineraries & Travel",
    items: [
      { q: "Where can we embark and disembark in Greece?", a: "Common embarkation points include Athens, Mykonos, Santorini, Paros, Corfu, Zakynthos, and Kefalonia, as well as other islands and marinas depending on yacht location and season. We propose the most practical embarkation based on your route, flights, and yacht position." },
      { q: "Can the itinerary change during the charter?", a: "Yes, within reason. The captain may adjust the itinerary based on weather, safety, and port availability. You can discuss daily plans with the captain to combine your preferences with his local knowledge." },
      { q: "Can you help with transfers, hotels, and villas?", a: "Yes. George Yachts can arrange VIP airport transfers, private drivers, helicopter or private jet connections, as well as hotel and luxury villa bookings before or after your charter." },
      { q: "How many hours per day does a yacht usually cruise?", a: "On a typical charter, yachts cruise around 2\u20134 hours per day to balance island-hopping with time at anchor for swimming and relaxation. Longer cruising hours are possible but will increase fuel consumption and APA usage." },
      { q: "Can we visit multiple islands in one day?", a: "Yes, if the distances and weather conditions allow it. In areas like the Saronic Gulf or Cyclades, several islands can be combined in one itinerary. Your captain will advise what is realistic and comfortable." },
    ],
  },
  {
    category: "Payments & Contracts",
    items: [
      { q: "What kind of contract do we sign?", a: "We use the MYBA Charter Agreement or an equivalent recognized contract, which is the international standard for professional yacht charters and protects both the owner and the charterer." },
      { q: "How do payments work for a yacht charter?", a: "Typically, 50% of the charter fee is due upon signing the contract, and the remaining 50% plus VAT and APA is due 30 days before embarkation. For last-minute bookings, the full amount is usually due at confirmation." },
      { q: "Do you accept credit cards?", a: "Bank transfers are the standard and preferred method for charter payments. In some cases, management companies may accept credit cards for part of the amount or onboard expenses. We will confirm payment options for each yacht." },
      { q: "What happens if I need to cancel my charter?", a: "Cancellation terms are defined in the MYBA contract. Generally, the closer to the embarkation date you cancel, the higher the cancellation fee. We will always support you in exploring options such as rebooking or replacing the charter week, where possible." },
    ],
  },
  {
    category: "Safety & Regulations",
    items: [
      { q: "Are charter yachts insured?", a: "Yes. All professional charter yachts carry hull and machinery insurance as well as third-party liability insurance, in line with flag and classification requirements." },
      { q: "Is the crew professionally certified?", a: "Yes. Crew members hold professional maritime certificates and are trained in safety procedures, fire-fighting, first aid, and emergency response according to international regulations." },
      { q: "Are life jackets and safety equipment provided?", a: "Every yacht is equipped with life jackets, life rafts, and safety equipment as required by law. During the safety briefing at embarkation, the crew will show you where everything is and what to do in case of emergency." },
      { q: "What happens in case of bad weather?", a: "Safety always comes first. The captain may modify the itinerary, delay departures, or choose more protected anchorages or ports. Alternative plans will be discussed with you to keep the experience comfortable and enjoyable." },
    ],
  },
  {
    category: "Special Requests",
    items: [
      { q: "Can we bring our own food or drinks on board?", a: "Yes, you may bring special items with prior notice. The chef and crew will store and serve them appropriately. However, most guests prefer to let the yacht provision everything according to their preference sheet." },
      { q: "Are children welcome on board?", a: "Absolutely. Many yachts are very family-friendly and can provide custom kids\u2019 menus, safety nets, and suitable water toys. Parents remain responsible for supervising children at all times." },
      { q: "Can we bring our own security personnel?", a: "In many cases, yes, but this must be discussed in advance. Accommodation, credentials, insurance, and any additional approvals will need to be confirmed with the owner and captain." },
      { q: "Can you arrange photographers, drones, or special event setups?", a: "Yes. We can arrange professional photo and video services, drone operators where permitted, beach setups, birthday decorations, proposals, anniversaries, musicians, and DJs, tailored to your celebration." },
      { q: "Can you arrange private jet or helicopter transfers?", a: "Yes. Through our trusted partners, we can coordinate private jets and helicopters to connect your flights with your yacht and villa schedule in Greece and across the Mediterranean." },
    ],
  },
  {
    category: "Yacht Types & Availability",
    items: [
      { q: "What type of yacht should I choose?", a: "It depends on your group and style. Motor yachts offer speed and comfort, catamarans offer space and stability, sailing yachts offer a classic and romantic feel, and mega yachts offer the highest level of luxury and service. We help you choose the right type based on your preferences." },
      { q: "How many guests can sleep on a charter yacht?", a: "Most charter yachts accommodate 8\u201312 guests in 4\u20136 cabins. Larger yachts with special licences can host 12\u201336 guests. We will suggest yachts that match your group size and cabin needs." },
      { q: "Can I choose a specific cabin for each guest?", a: "Yes. Once the cabin layout is shared, you can allocate cabins according to your group\u2019s needs. The crew can also assist with practical suggestions based on couples, children, or accessibility." },
      { q: "Are there yachts available for day charters only?", a: "Yes. In hubs like Athens, Mykonos, Santorini, and Corfu, there are many yachts available for single-day or multi-day charters without overnight stays." },
      { q: "Do yachts have stabilizers?", a: "Many modern yachts are equipped with stabilizers that reduce motion both underway and at anchor, significantly improving comfort. We can prioritise stabilized yachts if you are concerned about motion." },
      { q: "Do I need a licence to use jet skis?", a: "In Greece, a valid personal watercraft licence is required to operate jet skis. Seabobs and many other toys do not require a licence, but must always be used under crew supervision." },
    ],
  },
  {
    category: "Luxury Services via George Yachts",
    items: [
      { q: "Do you offer villa or hotel bookings in addition to yacht charters?", a: "Yes. We can arrange luxury villas, boutique hotels, and private estates that complement your yacht itinerary, either before or after your charter, or as part of a combined land-and-sea experience." },
      { q: "Can you organise VIP transfers during our trip?", a: "Yes. We provide chauffeured sedans, SUVs, and sprinters for airport transfers, dinner reservations, shopping trips, and inter-island travel where possible." },
      { q: "Do you offer real estate or investment advisory in Greece?", a: "We can connect you with vetted local partners for property purchase, investment opportunities, and long-term stays, always in a discreet and curated way." },
      { q: "Can you arrange land tours and restaurant reservations?", a: "Of course. From archaeological sites and wine tastings to beach clubs and fine dining, we handle reservations and custom itineraries so you can simply enjoy the experience." },
    ],
  },
];

/* ─── Parallax ─── */
function useParallax() {
  useEffect(() => {
    const heroImg = document.querySelector(".svc-hero__bg");
    if (!heroImg) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
}

/* ─── Reveal ─── */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── FAQ Item ─── */
function FAQItem({ item, isOpen, onClick, id }) {
  const answerId = `faq-answer-${id}`;
  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button
        className="faq-item__button"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <span className="faq-item__question">{item.q}</span>
        <svg className="faq-item__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className="faq-item__answer" id={answerId} role="region" aria-labelledby={`faq-q-${id}`}>
        <p className="faq-item__answer-text">{item.a}</p>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function FAQClient() {
  const [openKey, setOpenKey] = useState("0-0");
  useParallax();

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>

      {/* Hero */}
      <section className="svc-hero">
        <Image src="/images/faq.jpg" alt="Yacht charter FAQ Greece - frequently asked questions George Yachts" fill priority className="svc-hero__bg" sizes="100vw" />
        <div className="svc-hero__gradient" />
        <div className="svc-hero__content">
          <p className="svc-hero__eyebrow">Clear Answers, No Surprises</p>
          <h1 className="svc-hero__title">Frequently Asked</h1>
          <div className="svc-hero__line" />
          <p className="svc-hero__subtitle">Everything you need to know about chartering a yacht in Greece with George Yachts.</p>
        </div>
      </section>

      {/* Intro */}
      <section className="svc-intro">
        <Reveal className="svc-intro__inner">
          <p className="svc-intro__eyebrow">Yacht Charter Essentials</p>
          <h2 className="svc-intro__title">What Should You Know Before Chartering a Yacht in Greece?</h2>
          <div className="svc-intro__line" />
          <p className="svc-intro__text">From booking process and costs to onboard life and itineraries &mdash; find clear, honest answers to the most common questions about luxury yacht charter.</p>
        </Reveal>
      </section>

      {/* FAQ Categories */}
      <section className="faq-section">
        <div className="faq-section__inner">
          {faqData.map((cat, catIndex) => (
            <Reveal key={catIndex} className="faq-category" delay={catIndex * 0.05}>
              <h3 className="faq-category__title">{cat.category}</h3>
              {cat.items.map((item, itemIndex) => {
                const key = `${catIndex}-${itemIndex}`;
                return (
                  <FAQItem
                    key={key}
                    id={key}
                    item={item}
                    isOpen={openKey === key}
                    onClick={() => setOpenKey(openKey === key ? null : key)}
                  />
                );
              })}
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="svc-cta">
        <Reveal>
          <p className="svc-cta__eyebrow">Still Have Questions?</p>
          <h2 className="svc-cta__title">Let&apos;s Talk</h2>
          <p className="svc-cta__text">Can&apos;t find what you&apos;re looking for? Get in touch and we&apos;ll answer personally.</p>
          <a href="https://calendly.com/george-georgeyachts/30min" target="_blank" rel="noopener noreferrer" className="svc-cta__button">Book a Free Consultation</a>
        </Reveal>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
