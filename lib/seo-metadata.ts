/**
 * Single source of truth for SEO copy (layout + Astro crawler twin).
 */

import { LAYOUT_DESCRIPTION } from "@/lib/meta-description"
import { HOST_KEYWORDS, buildSiteKeywords } from "@/lib/seo-keywords"
import { CANONICAL_HOST, SITE_DISPLAY_NAME } from "@/lib/site-url"

export { LAYOUT_DESCRIPTION }

export const SITE_TITLE = `${SITE_DISPLAY_NAME} Retirement Account Login | ${SITE_DISPLAY_NAME}`

export const SITE_DESCRIPTION = LAYOUT_DESCRIPTION

export const SITE_KEYWORDS: string[] = buildSiteKeywords()

const VISIBLE_HOST_TOKENS = new Set([
  CANONICAL_HOST.toLowerCase(),
  CANONICAL_HOST.replace(/^www\./, "").toLowerCase(),
  ...HOST_KEYWORDS.map((h) => h.toLowerCase()),
])

/**
 * Body-safe keywords for `Related searches: …`.
 * Raw domain / host tokens stay in `<meta name="keywords">` only.
 */
export function buildVisibleKeywords(): string[] {
  return SITE_KEYWORDS.filter((k) => {
    const lower = k.toLowerCase()
    if (VISIBLE_HOST_TOKENS.has(lower)) return false
    for (const host of VISIBLE_HOST_TOKENS) {
      if (lower.includes(host)) return false
    }
    return true
  })
}

export const SITE_VISIBLE_KEYWORDS = buildVisibleKeywords()
