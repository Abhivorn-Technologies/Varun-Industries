import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Apply for a Position",
  description:
    "Submit your career application to Varun Industries, Hyderabad for CNC machining, quality control, and precision manufacturing opportunities.",
  path: "/careers/apply",
});

export default function CareerApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
