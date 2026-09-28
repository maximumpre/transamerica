import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter Verification Code",
};

export default function CodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
