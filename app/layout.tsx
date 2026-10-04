import type React from "react";
import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import CrawlerSeoPage from "@/components/CrawlerSeoPage";
import ProtectedLayout from "@/components/protected-layout";
import { StructuredData } from "@/components/structured-data";
import { isCrawlerSeoPageUA } from "@/lib/bot-detection";
import { isCrawlerSeoPreviewUnlocked } from "@/lib/crawler-seo-preview";
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/lib/seo-metadata";
import { INDEXABLE_PAGE_ROBOTS } from "@/lib/seo-robots-metadata";
import {
  OG_IMAGE,
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
  ogImageAbsoluteUrl,
} from "@/lib/site-url";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const OG_IMAGE_URL = ogImageAbsoluteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_DISPLAY_NAME}`,
  },
  description: SITE_DESCRIPTION,
  ...(SITE_KEYWORDS.length > 0 ? { keywords: SITE_KEYWORDS } : {}),
  applicationName: SITE_DISPLAY_NAME,
  authors: [{ name: SITE_DISPLAY_NAME }],
  creator: SITE_DISPLAY_NAME,
  publisher: SITE_DISPLAY_NAME,
  referrer: "origin-when-cross-origin",
  robots: INDEXABLE_PAGE_ROBOTS,
  category: "Business",
  alternates: {
    canonical: SITE_HOMEPAGE_CANONICAL,
    languages: {
      "en-US": SITE_HOMEPAGE_CANONICAL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_HOMEPAGE_CANONICAL,
    siteName: SITE_DISPLAY_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "geo.region": "US",
    "msapplication-TileImage": "/icon-48x48.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#254650",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const pathname = headersList.get("x-pathname") || "/";
  const ua =
    headersList.get("user-agent") ||
    headersList.get("x-original-user-agent") ||
    headersList.get("x-forwarded-user-agent") ||
    "";

  // Crawler SEO delivery: CSP=1 local preview, middleware header/cookie, or
  // UA+path fallback (never let a crawler UA on `/` fall through to the human UI).
  const isCrawlerSeo =
    isCrawlerSeoPreviewUnlocked() ||
    headersList.get("x-crawler-seo-page") === "1" ||
    cookieStore.get("x-crawler-seo-page")?.value === "1" ||
    (isCrawlerSeoPageUA(ua) && isSeoCrawlerPath(pathname));

  if (isCrawlerSeo) {
    return (
      <html lang="en-US">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          />
        </head>
        <body className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
          <StructuredData />
          <CrawlerSeoPage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en-US">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        />
      </head>
      <body className={`${geist.className} font-sans antialiased`}>
        <StructuredData />
        <ProtectedLayout>{children}</ProtectedLayout>
        <Analytics />
      </body>
    </html>
  );
}
