/**
 * SEO keywords — preserved existing set (15 terms from the original layout.tsx)
 * plus high-value additions from competitive-intelligence research (Step 5).
 *
 * Kitchen-sink is correct for meta keywords (Google ignores them; Bing may
 * index them as non-weighted signals). This file feeds both:
 * - layout `<meta name="keywords">`   (lib/seo-metadata.ts)
 * - visible CrawlerSeoPage body block ("Related searches: …")
 *
 * @see SEO_CRAWLER_RULES.md
 */

import { SITE_DISPLAY_NAME } from "@/lib/site-url"

/** Heading format for CrawlerSeoPage `<h1>` (must lead with brand). */
export const PAGE_H1_HEADING = `${SITE_DISPLAY_NAME} Login`

/** Domain keywords (kit convention — Bing may associate the host). */
export const HOST_KEYWORDS = [
  "secure2.transamerica.com",
  "transamerica.com",
] as const

// ============= EXISTING KEYWORDS (preserved — NEVER deleted) =============

const EXISTING_KEYWORDS = [
  SITE_DISPLAY_NAME,                                // 1. Transamerica
  `${SITE_DISPLAY_NAME} login`,                     // 2. Transamerica login
  "secure2.transamerica.com",                       // 3. secure2.transamerica.com
  `${SITE_DISPLAY_NAME} account login`,             // 4. Transamerica account login
  `${SITE_DISPLAY_NAME} account access`,            // 5. Transamerica account access
  `${SITE_DISPLAY_NAME} insurance login`,            // 6. Transamerica insurance login
  `${SITE_DISPLAY_NAME} retirement login`,           // 7. Transamerica retirement login
  `${SITE_DISPLAY_NAME} benefits login`,             // 8. Transamerica benefits login
  `${SITE_DISPLAY_NAME} financial services`,         // 9. Transamerica financial services
  `${SITE_DISPLAY_NAME} customer login`,             // 10. Transamerica customer login
  `${SITE_DISPLAY_NAME} participant portal`,         // 11. Transamerica participant portal
  `${SITE_DISPLAY_NAME} create account`,             // 12. Transamerica create account
  `${SITE_DISPLAY_NAME} forgot username`,            // 13. Transamerica forgot username
  `${SITE_DISPLAY_NAME} forgot password`,            // 14. Transamerica forgot password
  `${SITE_DISPLAY_NAME} secure login`,               // 15. Transamerica secure login
] as const

// ============= NEW ADDITIONS (Step 5 research) =============

/** Branded long-tails (competitor/research). */
const NEW_BRAND_KEYWORDS = [
  `${SITE_DISPLAY_NAME} sign in`,
  `${SITE_DISPLAY_NAME} 401k login`,
  `${SITE_DISPLAY_NAME} retirement account`,
  `${SITE_DISPLAY_NAME} benefits center`,
  `${SITE_DISPLAY_NAME} security validation code`,
  `${SITE_DISPLAY_NAME} voice pass`,
  `${SITE_DISPLAY_NAME} login help`,
  `${SITE_DISPLAY_NAME} contract id`,
  `${SITE_DISPLAY_NAME} plan administrator contact`,
  `${SITE_DISPLAY_NAME} forgotten username`,
  `${SITE_DISPLAY_NAME} forgotten password`,
  `${SITE_DISPLAY_NAME} 401k login not working`,
] as const

/** Qualified intent keywords (competitive edge — no one in the set has
 *  an indexable page for the channel-choice step or MFA help). */
const INTENT_KEYWORDS = [
  "retirement account login",
  "participant portal login",
  "account access help",
  "security validation code help",
  "forgot password login timeout",
  "two step verification login code",
  "recover lost access retirement",
  "plan participant login portal",
] as const

/** Generic low-weight headers for Bing association (do not stuff in title). */
const GENERIC_HEADERS = [
  "login portal",
  "forgot username retirement",
  "forgot password retirement",
] as const

function mergeKeywords(...lists: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const list of lists) {
    for (const keyword of list) {
      const key = keyword.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      result.push(keyword)
    }
  }
  return result
}

/** EXISTING + NEW keywords. No keyword was deleted. */
export function buildSiteKeywords(): string[] {
  return mergeKeywords(
    HOST_KEYWORDS,
    EXISTING_KEYWORDS,
    NEW_BRAND_KEYWORDS,
    INTENT_KEYWORDS,
    GENERIC_HEADERS,
  )
}

const SITE_KEYWORDS_CACHE = buildSiteKeywords()

// Must export a runtime-evaluated array so CrawlerSeoPage can use it at render.
export const SITE_KEYWORDS: string[] = SITE_KEYWORDS_CACHE
