"use client";

// A room to try three cursors in, section 8.
//
// A cursor cannot be judged from a screenshot; it has to be moved. So this is
// a page rather than a picture: George switches between the three, moves the
// mouse over real type, real links and a real photograph, and picks.
//
// Deliberately not in the sitemap and marked noindex. It is a workbench, not
// a page of the site, and it will come out once a choice is made.

import { useState } from "react";
import Link from "next/link";
import CursorProposals from "@/app/components/CursorProposals";

const OPTIONS = [
  { id: "sheer", name: "Η Καμπύλη", en: "The Sheer",
    note: "Η μπροστινή χρυσή κορδέλα του σήματος, ιχνηλατημένη από το ίδιο το έργο και ξαναχτισμένη σε vector: λεπτή στην πρύμνη, φουσκώνει στη μέση, λεπτή ξανά στην πλώρη. Είναι η χειρονομία πάνω στην οποία είναι χτισμένο όλο το λογότυπο, και το μόνο κομμάτι του που επιβιώνει στα 30 pixel επειδή είναι μία πινελιά, όχι σύνθεση." },
  { id: "yacht", name: "Το Σκάφος", en: "The Yacht",
    note: "Το πραγματικό έργο, όχι ξαναζωγραφισμένο, στα 42 pixel. Πιο φαρδύ από κανονικό κέρσορα, γιατί κάτω από αυτό το χρώμιο γίνεται γκρι μουτζούρα. Αυτό ζήτησες να δοκιμάσουμε, και το δείχνω στο μόνο μέγεθος που έχει ελπίδα." },
  { id: "bow", name: "Η Πλώρη", en: "The Bow",
    note: "Το κομμάτι όπου οι χρυσές κορδέλες συγκλίνουν σε αιχμή, κομμένο από το έργο. Το επιχείρημα είναι λειτουργικό, όχι διακοσμητικό: ο κέρσορας υπάρχει για να δείχνει, και αυτό το σήμα ήδη τελειώνει σε αιχμή." },
];

export default function CursorLab() {
  const [variant, setVariant] = useState("sheer");
  const current = OPTIONS.find((o) => o.id === variant);

  return (
    <main style={{ minHeight: "100vh", background: "#0D1B2A", color: "#F8F5F0",
                   fontFamily: "var(--gy-font-body)", padding: "clamp(150px,16vw,220px) clamp(20px,5vw,64px) clamp(48px,6vw,80px)" }}>
      <CursorProposals variant={variant} />

      <p style={{ fontFamily: "var(--gy-font-ui)", fontSize: 11, letterSpacing: "0.28em",
                  textTransform: "uppercase", color: "#DAA110", margin: "0 0 18px" }}>
        Εργασία 8 · δοκιμαστήριο
      </p>
      <h1 style={{ fontFamily: "var(--gy-font-display)", fontWeight: 250,
                   fontSize: "clamp(30px,4.4vw,52px)", letterSpacing: "0.03em",
                   lineHeight: 1.08, margin: "0 0 14px" }}>
        Τρεις κέρσορες. Κούνα το ποντίκι.
      </h1>
      <p style={{ maxWidth: 620, fontSize: 16, lineHeight: 1.75, color: "rgba(248,245,240,0.66)", margin: "0 0 34px" }}>
        Κανένας τους δεν έχει νερό, ουρά ή καθυστέρηση. Το σημάδι κάθεται πάνω
        στον δείκτη, όχι πίσω του. Διάλεξε και το κάνω το κανονικό.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 44 }}>
        {OPTIONS.map((o) => (
          <button key={o.id} onClick={() => setVariant(o.id)}
            style={{
              fontFamily: "var(--gy-font-ui)", fontSize: 11.5, letterSpacing: "0.2em",
              textTransform: "uppercase", padding: "14px 26px",
              color: variant === o.id ? "#0D1B2A" : "#DAA110",
              background: variant === o.id
                ? "linear-gradient(180deg, #B58A0A 0%, #F0C756 38%, #DAA110 62%, #B58A0A 100%)"
                : "transparent",
              border: "1px solid rgba(218,161,16,0.45)", cursor: "pointer",
            }}>
            {o.name}
          </button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid rgba(218,161,16,0.2)", paddingTop: 26, marginBottom: 48, maxWidth: 720 }}>
        <h2 style={{ fontFamily: "var(--gy-font-display)", fontWeight: 300, fontSize: 24,
                     letterSpacing: "0.03em", margin: "0 0 10px" }}>
          {current.name} <span style={{ color: "rgba(248,245,240,0.35)", fontSize: 16 }}>· {current.en}</span>
        </h2>
        <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "rgba(248,245,240,0.62)", margin: 0 }}>{current.note}</p>
      </div>

      {/* Something to move across: type, a link, a rule, and a dark field. A
          cursor that looks right on an empty page can disappear over a
          photograph or fight with body copy. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                    gap: 30, maxWidth: 1100 }}>
        <div>
          <h3 style={{ fontFamily: "var(--gy-font-display)", fontWeight: 300, fontSize: 21, margin: "0 0 10px" }}>
            Πάνω σε κείμενο
          </h3>
          <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "rgba(248,245,240,0.62)", margin: 0 }}>
            Πέρνα τον πάνω από αυτή την παράγραφο. Ένας κέρσορας που δουλεύει σε
            άδεια σελίδα μπορεί να παλεύει με το κείμενο, ή να χάνεται πάνω σε
            μια φωτογραφία. Και ένας{" "}
            <Link href="/charter-yacht-greece" style={{ color: "#DAA110" }}>σύνδεσμος</Link>{" "}
            πρέπει να φαίνεται ότι είναι σύνδεσμος.
          </p>
        </div>
        <div style={{ background: "linear-gradient(135deg,#12283d,#0a1622)", border: "1px solid rgba(218,161,16,0.15)",
                      minHeight: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10.5, letterSpacing: "0.24em",
                         textTransform: "uppercase", color: "rgba(248,245,240,0.3)" }}>
            σκούρο πεδίο
          </span>
        </div>
        <div style={{ background: "#F8F5F0", minHeight: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--gy-font-ui)", fontSize: 10.5, letterSpacing: "0.24em",
                         textTransform: "uppercase", color: "rgba(13,27,42,0.4)" }}>
            ανοιχτό πεδίο
          </span>
        </div>
      </div>
    </main>
  );
}
