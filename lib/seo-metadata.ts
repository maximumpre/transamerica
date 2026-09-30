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
import { CANONICAL_HOST, SITE_DISPLAY_NAME } from "@/lib/site-url"

export const SITE_TITLE = `${SITE_DISPLAY_NAME} Retirement Account Login | ${SITE_DISPLAY_NAME}`

export const SITE_DESCRIPTION =
  "Sign in securely to access your Transamerica retirement account, view plan balances and statements, and manage your workplace benefits online."

export const SITE_KEYWORDS: string[] = buildSiteKeywords()

const VISIBLE_HOST_TOKENS = [
  CANONICAL_HOST.toLowerCase(),
  CANONICAL_HOST.replace(/^www\./, "").toLowerCase(),
]

/**
 * Body-safe keywords for the visible `Related searches: …` crawler body block.
 * Raw domain tokens stay in `<meta name="keywords">` only — Yandex still reads
 * meta keywords; a domain in visible body copy reads as stuffing to Google/Bing.
 */
export function buildVisibleKeywords(): string[] {
  return SITE_KEYWORDS.filter((k) => !VISIBLE_HOST_TOKENS.some((h) => k.toLowerCase().includes(h)))
}

export const SITE_VISIBLE_KEYWORDS = buildVisibleKeywords()
