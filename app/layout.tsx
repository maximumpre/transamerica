import type React from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const CANONICAL_LOGIN_URL = "https://secure2.transamerica.com/login";
const SITE_DOMAIN = "secure2.transamerica.com";
const SITE_BRAND = "Transamerica";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || CANONICAL_LOGIN_URL,
  ),
  title: {
    default: "Login | Transamerica",
    template: "%s | Transamerica",
  },
  keywords: [
    "Transamerica",
    "Transamerica login",
    "secure2.transamerica.com",
    "Transamerica account login",
    "Transamerica account access",
    "Transamerica insurance login",
    "Transamerica retirement login",
    "Transamerica benefits login",
    "Transamerica financial services",
    "Transamerica customer login",
    "Transamerica participant portal",
    "Transamerica create account",
    "Transamerica forgot username",
    "Transamerica forgot password",
    "Transamerica secure login",
  ],
  description: `${SITE_BRAND} – ${SITE_DOMAIN}. Access your account and sign in securely through Transamerica.`,

  authors: [{ name: "Transamerica" }],
  creator: "Transamerica",
  publisher: "Transamerica",
  applicationName: SITE_BRAND,
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Transamerica - Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your account and sign in securely through Transamerica.`,
    siteName: SITE_BRAND,
    url: CANONICAL_LOGIN_URL,
    images: [
      {
        url: "/1785580680466_image.webp",
        width: 32,
        height: 32,
        alt: `${SITE_BRAND}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Transamerica - Login",
    description: `${SITE_BRAND} at ${SITE_DOMAIN}. Access your account and sign in securely through Transamerica.`,
    images: ["1785580680466_image.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#254650",
  category: "Business",
  alternates: {
    canonical: CANONICAL_LOGIN_URL,
    languages: {
      "en-US": CANONICAL_LOGIN_URL,
    },
  },
  other: {
    "geo.region": "US",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_BRAND,
  url: CANONICAL_LOGIN_URL,
  description:
    "Transamerica secure account sign in portal. Access your Transamerica account and manage your account resources.",
  publisher: {
    "@type": "Organization",
    name: "Transamerica",
  },
  inLanguage: "en-US",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", url: CANONICAL_LOGIN_URL },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
