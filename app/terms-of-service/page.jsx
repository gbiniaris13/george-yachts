import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service | George Yachts",
  description:
    "Review the rules and guidelines governing the use of the George Yachts digital platform and services.",
};

// This is a Helper Component (Capitalized!)
const Section = ({ title, children }) => (
  <div className="mb-16 border-l border-[#DAA520]/30 pl-8">
    <h2 className="text-2xl font-marcellus text-white mb-6 tracking-wide">
      {title}
    </h2>
    <div className="text-white/60 font-sans text-sm leading-8 tracking-wide space-y-4">
      {children}
    </div>
  </div>
);

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-40 pb-20 px-6 md:px-12 border-b border-white/5">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-[#DAA520] text-xs font-bold tracking-[0.4em] uppercase mb-6">
            Legal Information
          </p>
          <h1 className="text-5xl md:text-7xl font-marcellus text-white mb-8 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            Review the rules and guidelines governing the use of the George
            Yachts digital platform and professional brokerage services.
          </p>
        </div>

        {/* Luxury Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-[#DAA520] opacity-[0.03] blur-[100px] pointer-events-none"></div>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="container mx-auto max-w-3xl px-6 py-24">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing and using the website of GEORGE YACHTS BROKERAGE HOUSE
            LLC (“Company,” “we,” “us,” or “our”), you agree to be bound by
            these Terms of Service and all applicable laws and regulations.
          </p>
        </Section>

        <Section title="2. Services Provided">
          <p>
            George Yachts Brokerage House LLC operates as a professional yacht
            charter brokerage. We facilitate communication and coordination
            between charterers and yacht owners or operators. The Company does
            not own, manage, or operate the vessels listed. All bookings are
            subject to formal charter agreements executed between the relevant
            parties during the booking process.
          </p>
        </Section>

        <Section title="3. Intellectual Property">
          <p>
            The content, branding, and proprietary information on this website
            are the property of George Yachts Brokerage House LLC. Any
            unauthorized use, reproduction, or distribution is strictly
            prohibited.
          </p>
        </Section>

        <Section title="4. Disclaimer & Limitation of Liability">
          <p>
            The information on this website is provided for general guidance.
            While we strive for accuracy, we make no warranties regarding the
            completeness or timeliness of the information. George Yachts
            Brokerage House LLC shall not be held liable for any damages arising
            from the use of this website or our services.
          </p>
        </Section>

        <Section title="5. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Wyoming, USA. Any legal action or
            proceeding relating to your access to, or use of, the website shall
            be instituted in the courts of Sheridan, Wyoming.
          </p>
        </Section>

        <Section title="6. Contact Information">
          <p>
            If you have any questions regarding these Terms of Service or our
            operations, please contact us:
          </p>
          <div className="mt-6 text-white space-y-2">
            <div>
              <strong>Legal Entity:</strong> GEORGE YACHTS BROKERAGE HOUSE LLC
            </div>
            <div>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:george@georgeyachts.com"
                className="hover:text-[#DAA520] transition-colors"
              >
                george@georgeyachts.com
              </a>
            </div>
            <div>
              <strong>Registered Office:</strong> 30 N Gould St Ste R, Sheridan,
              WY 82801, USA
            </div>
          </div>
        </Section>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest">
            Last Updated: February 2026
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
