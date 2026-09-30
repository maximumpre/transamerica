import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: null },
  title: "Select Verification Method",
};

export default function MethodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
