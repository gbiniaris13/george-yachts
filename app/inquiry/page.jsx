import InquiryClient from "./InquiryClient";
import { pageMeta } from "@/lib/pageMeta";

import PageBreadcrumb from "@/app/components/PageBreadcrumb";
export const metadata = pageMeta({
  title: "Start Your Charter - George Yachts",
  description:
    "Answer a handful of questions and George will come back to you personally within 24 hours with a tailored Greek charter shortlist.",
  path: "/inquiry",
});

export default function InquiryPage() {
  return (
    <>
      <PageBreadcrumb path="/inquiry" />
      <InquiryClient />
    </>
  );
}
