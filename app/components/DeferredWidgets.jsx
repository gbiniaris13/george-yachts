"use client";

// Καθυστερημένη φόρτωση των μη κρίσιμων widgets (2026-08-22, LCP).
//
// Το layout φόρτωνε 31 client components πριν από το πρώτο βάψιμο και κανένα
// δεν ήταν dynamic. Το Lighthouse το έδειχνε ακριβώς: το LCP resource (η
// εικόνα του hero) ήταν έτοιμο στα 230 ms και μετά περίμενε 2.114 ms για να
// ζωγραφιστεί, γιατί το main thread είχε 2,9 δευτερόλεπτα δουλειάς μπροστά
// του. Η εικόνα δεν ήταν αργή. Η σελίδα ήταν απασχολημένη.
//
// Ό,τι μπαίνει εδώ πληροί ΚΑΙ ΤΑ ΔΥΟ: δεν γράφει κείμενο που διαβάζει μηχανή
// αναζήτησης, και δεν φαίνεται στο πρώτο καρέ. Διακοσμητικά (κέρσορας,
// parallax, κουρτίνα, μεταβάσεις), όσα ξυπνούν με scroll, τα on-demand
// widgets και τα analytics.
//
// ΔΕΝ μπαίνουν εδώ, σκόπιμα: NavDrawerSystem (το μενού ΕΙΝΑΙ οι εσωτερικοί
// σύνδεσμοι που διαβάζει η Google), WhatsAppButton και StickyFleetCTA (ορατά
// στο πρώτο καρέ, φέρουν σύνδεσμο), Footer, CookieConsent (νομικό).
//
// ssr:false, όχι απλώς lazy: αυτά τα components δεν παράγουν τίποτα χρήσιμο
// στο HTML του server. Κρατώντας τα έξω, το έγγραφο που κατεβάζει ο
// επισκέπτης και ο crawler γίνεται μικρότερο ταυτόχρονα.

import dynamic from "next/dynamic";

const d = (loader) => dynamic(loader, { ssr: false });

const CustomCursor = d(() => import("./CustomCursor"));
const ScrollProgress = d(() => import("./ScrollProgress"));
const SoundFx = d(() => import("./SoundFx"));
const ScrollToTop = d(() => import("./ScrollToTop"));
const AmbientPlayer = d(() => import("./AmbientPlayer"));
const StickyInquiryBar = d(() => import("./StickyInquiryBar"));
const AskGeorgeWidget = d(() => import("./AskGeorgeWidget"));
const GoldCurtain = d(() => import("./GoldCurtain"));
const RouteTransition = d(() => import("./RouteTransition"));
const MouseParallax = d(() => import("./MouseParallax"));
const AmbientScroll = d(() => import("./AmbientScroll"));
const VisitorBeacon = d(() => import("./VisitorBeacon"));
const VisitorIntelligence = d(() => import("./VisitorIntelligence"));
const EnhancedAnalytics = d(() => import("./EnhancedAnalytics"));
const MicrosoftClarity = d(() => import("./MicrosoftClarity"));

export default function DeferredWidgets() {
  return (
    <>
      <GoldCurtain />
      <RouteTransition />
      <MouseParallax />
      <CustomCursor />
      <ScrollProgress />
      <SoundFx />
      <ScrollToTop />
      <AmbientScroll />
      <AmbientPlayer />
      <AskGeorgeWidget />
      <StickyInquiryBar />
      <VisitorBeacon />
      <VisitorIntelligence />
      <EnhancedAnalytics />
      <MicrosoftClarity />
    </>
  );
}
