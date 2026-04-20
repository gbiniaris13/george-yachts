import InquiryClient from "./InquiryClient";

export const metadata = {
  title: "Start Your Charter — George Yachts",
  description:
    "Answer a handful of questions and George will come back to you personally within 24 hours with a tailored Greek charter shortlist.",
  alternates: { canonical: "https://georgeyachts.com/inquiry" },
  robots: { index: true, follow: true },
};

export default function InquiryPage() {
  return <InquiryClient />;
}
