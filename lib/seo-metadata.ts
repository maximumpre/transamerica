/**
 * Single source of truth for SEO copy (layout + CrawlerSeoPage).
 *
 * SEO_SITE_NAMES.md anti-degradation rules applied:
 * - title distinct, 30–70 chars
 * - description 25–170 chars, describes the portal value prop, NO raw domain,
 *   NO "sign in at <domain>", no URLs
 * - H1 leads with SITE_DISPLAY_NAME
 */

import { buildSiteKeywords } from "@/lib/seo-keywords"

export const SITE_TITLE = "Transamerica Retirement Account Login | Transamerica"

export const SITE_DESCRIPTION =
  "Sign in securely to access your Transamerica retirement account, view plan balances and statements, and manage your workplace benefits online."

export const SITE_KEYWORDS: string[] = buildSiteKeywords()
