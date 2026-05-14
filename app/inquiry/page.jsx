import InquiryClient from "./InquiryClient";
import { pageMeta } from "@/lib/pageMeta";

export const metadata = pageMeta({
  title: "Start Your Charter — George Yachts",
  description:
    "Answer a handful of questions and George will come back to you personally within 24 hours with a tailored Greek charter shortlist.",
  path: "/inquiry",
});

export default function InquiryPage() {
  return <InquiryClient />;
}
