import Footer from "@/components/Footer";
import ContactFormSection from "@/components/ContactFormSection";
import Link from "next/link";

export const metadata = {
  title: "Accessibility Statement | George Yachts Brokerage House",
  description:
    "George Yachts is committed to ensuring digital accessibility for people with disabilities. Learn about our accessibility standards and ongoing efforts.",
  alternates: {
    canonical: "https://georgeyachts.com/accessibility",
  },
};

export default function AccessibilityPage() {
  const lastUpdated = "April 2026";

  return (
    <div className="min-h-screen bg-[#000] font-sans selection:bg-[#DAA520] selection:text-black">
      {/* Hero */}
      <section className="relative w-full px-8 md:px-20 pt-32 pb-20">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#DAA520]/30 to-transparent mb-16" />
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <span className="block w-8 h-px bg-[#DAA520]" />
            <span
              className="text-[#DAA520] text-[9px] tracking-[0.6em] uppercase font-bold"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Commitment
            </span>
          </div>
          <h1
            className="font-marcellus text-white uppercase leading-[1.08] tracking-tight text-3xl md:text-4xl lg:text-5xl"
          >
            Accessibility Statement
          </h1>
          <p
            className="text-white/40 text-sm mt-6"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 bg-[#000] px-6 pb-20 md:pb-32">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center space-x-6 mb-16">
            <span className="block w-6 h-px bg-[#DAA520]/50" />
            <span
              className="text-[#DAA520]/50 text-[8px] tracking-[0.7em] uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              George Yachts Brokerage House LLC
            </span>
            <span className="block flex-1 h-px bg-white/5" />
          </div>

          <article className="[&_p]:mb-8 [&_p]:leading-[2] [&_p]:text-white/60 [&_p]:text-[1.05rem] [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-white [&_h2]:font-marcellus [&_h2]:mt-16 [&_h2]:mb-6 [&_h2]:uppercase [&_h2]:tracking-wide [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-3 [&_ul]:text-white/60 [&_ul]:text-[1.05rem] [&_ul]:mb-8 [&_ul]:leading-[2]">
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.15rem", lineHeight: 1.85, color: "rgba(255,255,255,0.8)" }}>
              George Yachts Brokerage House LLC is committed to ensuring digital
              accessibility for people with disabilities. We are continually
              improving the user experience for everyone and applying the
              relevant accessibility standards.
            </p>

            <h2>Conformance Status</h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) define requirements
              for designers and developers to improve accessibility for people
              with disabilities. We strive to conform to WCAG 2.1 level AA. We
              are actively working to increase the accessibility and usability of
              our website.
            </p>

            <h2>Measures We Take</h2>
            <ul>
              <li>Semantic HTML structure throughout the site</li>
              <li>Descriptive alt text for all meaningful images</li>
              <li>Keyboard-navigable interface with visible focus indicators</li>
              <li>Skip-to-content link for screen reader users</li>
              <li>Sufficient color contrast ratios (minimum 4.5:1)</li>
              <li>ARIA labels on interactive elements</li>
              <li>Responsive design that works across devices and zoom levels</li>
              <li>Structured headings for logical content hierarchy</li>
              <li>Form labels and error messages for all input fields</li>
            </ul>

            <h2>Known Limitations</h2>
            <p>
              Despite our best efforts, some areas of the site may not yet be
              fully accessible. We are aware of the following limitations and are
              working to resolve them:
            </p>
            <ul>
              <li>
                Some third-party integrations (live chat, analytics widgets) may
                not meet all accessibility standards
              </li>
              <li>
                PDF documents linked from the site may not be fully accessible
              </li>
              <li>
                Some older blog content may have images without descriptive alt
                text
              </li>
            </ul>

            <h2>Feedback</h2>
            <p>
              We welcome your feedback on the accessibility of the George Yachts
              website. If you encounter any accessibility barriers or have
              suggestions for improvement, please contact us:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a
                  href="mailto:george@georgeyachts.com"
                  className="text-[#DAA520] hover:text-white border-b border-[#DAA520]/30 hover:border-white transition-colors duration-300"
                >
                  george@georgeyachts.com
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/17867988798"
                  className="text-[#DAA520] hover:text-white border-b border-[#DAA520]/30 hover:border-white transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +1 (786) 798-8798
                </a>
              </li>
            </ul>
            <p>
              We try to respond to accessibility feedback within 5 business days.
            </p>

            <h2>Compatibility</h2>
            <p>
              This website is designed to be compatible with the following
              assistive technologies:
            </p>
            <ul>
              <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <p>
              This statement was last updated in {lastUpdated}. We review and
              update this statement as part of our ongoing commitment to
              accessibility.
            </p>
          </article>

          {/* Back link */}
          <div className="mt-16 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center text-white/20 hover:text-[#DAA520] transition-colors duration-500 text-[9px] tracking-[0.55em] uppercase font-bold"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </section>

      <ContactFormSection />
      <Footer />
    </div>
  );
}
