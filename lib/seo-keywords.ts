/**
 * SEO keywords — append-only 6-cluster architecture (Archetype 4: Retirement).
 * Never delete existing terms. Feeds meta keywords + visible Related searches.
 */

import { SITE_DISPLAY_NAME } from "@/lib/site-url"

/** Heading format for crawler twin `<h1>` (must lead with brand). */
export const PAGE_H1_HEADING = `${SITE_DISPLAY_NAME} Login`

/** Meta-only host tokens (Yandex) — never print in Related searches body. */
export const HOST_KEYWORDS = [
  "secure2.transamerica.com",
  "transamerica.com",
  "www.tran-america.com",
  "tran-america.com",
] as const

// ============= EXISTING KEYWORDS (preserved — NEVER deleted) =============

const EXISTING_KEYWORDS = [
  SITE_DISPLAY_NAME,
  `${SITE_DISPLAY_NAME} login`,
  "secure2.transamerica.com",
  `${SITE_DISPLAY_NAME} account login`,
  `${SITE_DISPLAY_NAME} account access`,
  `${SITE_DISPLAY_NAME} insurance login`,
  `${SITE_DISPLAY_NAME} retirement login`,
  `${SITE_DISPLAY_NAME} benefits login`,
  `${SITE_DISPLAY_NAME} financial services`,
  `${SITE_DISPLAY_NAME} customer login`,
  `${SITE_DISPLAY_NAME} participant portal`,
  `${SITE_DISPLAY_NAME} create account`,
  `${SITE_DISPLAY_NAME} forgot username`,
  `${SITE_DISPLAY_NAME} forgot password`,
  `${SITE_DISPLAY_NAME} secure login`,
] as const

/** Cluster 1 — Corporate entity & brand variants */
const CLUSTER_BRAND = [
  `${SITE_DISPLAY_NAME} sign in`,
  `${SITE_DISPLAY_NAME} Corporation`,
  `${SITE_DISPLAY_NAME} Life Insurance`,
  `${SITE_DISPLAY_NAME} Financial`,
  `${SITE_DISPLAY_NAME} Retirement Solutions`,
  "Aegon Transamerica",
  "MyTransamerica",
  "myta Transamerica",
  `${SITE_DISPLAY_NAME} Pyramid`,
] as const

/** Cluster 2 — Employee benefits & retirement offerings */
const CLUSTER_BENEFITS = [
  `${SITE_DISPLAY_NAME} 401k login`,
  `${SITE_DISPLAY_NAME} retirement account`,
  `${SITE_DISPLAY_NAME} benefits center`,
  `${SITE_DISPLAY_NAME} annuity login`,
  `${SITE_DISPLAY_NAME} life insurance login`,
  `${SITE_DISPLAY_NAME} pension login`,
  `${SITE_DISPLAY_NAME} 403b login`,
  `${SITE_DISPLAY_NAME} HSA login`,
  `${SITE_DISPLAY_NAME} employee benefits`,
  `${SITE_DISPLAY_NAME} workplace retirement`,
  "retirement account login",
  "401k participant login",
  "403b account access",
  "pension estimate login",
] as const

/** Cluster 3 — Authentication & action intents */
const CLUSTER_AUTH = [
  `${SITE_DISPLAY_NAME} security validation code`,
  `${SITE_DISPLAY_NAME} voice pass`,
  `${SITE_DISPLAY_NAME} login help`,
  `${SITE_DISPLAY_NAME} forgotten username`,
  `${SITE_DISPLAY_NAME} forgotten password`,
  `${SITE_DISPLAY_NAME} 401k login not working`,
  `${SITE_DISPLAY_NAME} login portal`,
  `${SITE_DISPLAY_NAME} login page`,
  `${SITE_DISPLAY_NAME} log in issues`,
  `${SITE_DISPLAY_NAME} sign in page`,
  `${SITE_DISPLAY_NAME} sign up`,
  "account access help",
  "security validation code help",
  "forgot password login timeout",
  "two step verification login code",
  "recover lost access retirement",
] as const

/** Cluster 4 — Workforce & participant roles */
const CLUSTER_ROLES = [
  `${SITE_DISPLAY_NAME} employee login`,
  `${SITE_DISPLAY_NAME} agent login`,
  `${SITE_DISPLAY_NAME} agent portal`,
  `${SITE_DISPLAY_NAME} individual login`,
  `${SITE_DISPLAY_NAME} provider portal`,
  `${SITE_DISPLAY_NAME} plan administrator contact`,
  `${SITE_DISPLAY_NAME} contract id`,
  `${SITE_DISPLAY_NAME} retiree login`,
  "plan participant login portal",
  "participant portal login",
] as const

/** Cluster 5 — Platform & vendor synergy (retirement recordkeeper) */
const CLUSTER_PLATFORM = [
  "participant login",
  "retirement plan portal",
  "401k account access",
  "plan sponsor login",
  "member retirement portal",
  `${SITE_DISPLAY_NAME} portal sign in`,
  `${SITE_DISPLAY_NAME} employee benefits portal`,
  "secure retirement login",
  "ta-retirement login",
] as const

/** Cluster 6 — Self-service & mobile support */
const CLUSTER_SUPPORT = [
  `${SITE_DISPLAY_NAME} login app`,
  `${SITE_DISPLAY_NAME} login app download`,
  `${SITE_DISPLAY_NAME} login phone number`,
  `${SITE_DISPLAY_NAME} employee login app`,
  `${SITE_DISPLAY_NAME} northwell sign in`,
  "forgot username retirement",
  "forgot password retirement",
  "login portal",
  "VoicePass Transamerica",
  "Transamerica participant support 800-755-5801",
] as const

/** Harvest append (2026-10-27 suggest engines) — deduped against above */
const HARVEST_APPEND = [
  `${SITE_DISPLAY_NAME} login retirement`,
  `${SITE_DISPLAY_NAME} login 401k`,
  `${SITE_DISPLAY_NAME} login portal sign up`,
  `${SITE_DISPLAY_NAME} login 401k sign in`,
  `${SITE_DISPLAY_NAME} log in 401k`,
  `${SITE_DISPLAY_NAME} log in retirement`,
  `${SITE_DISPLAY_NAME} log in agent`,
  `${SITE_DISPLAY_NAME} portal login employee`,
  `${SITE_DISPLAY_NAME} employee benefits provider portal`,
  "secure transamerica sign in",
] as const

/** Prior Step 5 NEW_BRAND + INTENT + GENERIC preserved via clusters above */

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

/** EXISTING + NEW clusters. No keyword was deleted. */
export function buildSiteKeywords(): string[] {
  return mergeKeywords(
    HOST_KEYWORDS,
    EXISTING_KEYWORDS,
    CLUSTER_BRAND,
    CLUSTER_BENEFITS,
    CLUSTER_AUTH,
    CLUSTER_ROLES,
    CLUSTER_PLATFORM,
    CLUSTER_SUPPORT,
    HARVEST_APPEND,
  )
}

const SITE_KEYWORDS_CACHE = buildSiteKeywords()

export const SITE_KEYWORDS: string[] = SITE_KEYWORDS_CACHE
