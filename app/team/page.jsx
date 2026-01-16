import React from "react";
import TeamPageClient from "./TeamPageClient";

export const metadata = {
  title: "Our Team | George Yachts | Athens Yacht Brokerage",
  description:
    "Meet the expert team at George Yachts. Our brokers, managers, and advisors are dedicated to providing bespoke, 360° luxury yachting services from Athens, Greece.",
  alternates: {
    canonical: "https://georgeyachts.com/team/valleria-karvouni",
  },
};

const TeamPage = () => {
  return <TeamPageClient />;
};

export default TeamPage;
