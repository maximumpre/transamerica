/**
 * Production site-url — canonical URL infrastructure for this member site.
 * Shaped by Step 6 (Domain Origin & IndexNow) APPENDIX A template, keeping the
 * project-specific extras (OG image, platform detection, Telegram site name).
 *
 * Origin: operator-provided production domain. The live deployment serves
 * **`www.tran-america.com` with no redirect**; the apex 308-redirects to www at
 * the edge (Cloudflare), so the kit rule applies verbatim — BRAND_ICONS.md:156
 * and NEW_PROJECT_CHECKLIST.md:141 require `SITE_ORIGIN` to be the host that
 * answers **200 with no `location:`**, otherwise `og:image` 308s and social
 * cards come back blank. Flipped from apex to www on evidence:
 *   apex /og-image.png → HTTP/2 308 → www  |  www /og-image.png → HTTP/2 200 image/png
 * No www/apex redirect lives in middleware — the edge owns it (Step 6 RULE 2).
 */

/** Display name for notifications and metadata (existing brand kept). */
export const SITE_DISPLAY_NAME = "Transamerica" as const

/** Canonical origin — the Vercel/edge primary host, https, no trailing slash. */
export const SITE_ORIGIN = "https://www.tran-america.com" as const

/** Origin alias kept for legacy consumers. */
export const SITE_URL = SITE_ORIGIN

/**
 * Homepage canonical. Deliberately equals `SITE_ORIGIN` with NO trailing slash:
 * Next.js resolves absolute metadata URLs through `new URL()` and then, for a
 * root pathname ("/"), emits `result.origin` only (see
 * `next/dist/lib/metadata/resolvers/resolve-url.js` → `resolveAbsoluteUrlWithPathname`).
 * A `${SITE_ORIGIN}/` value would render as the slashless origin in the
 * <head> while `app/sitemap.ts` emitted the slash — a canonical/sitemap mismatch.
 * Slugless form keeps head canonical, og:url, hreflang, JSON-LD and sitemap byte-identical.
 */
export const SITE_HOMEPAGE_CANONICAL = SITE_ORIGIN

/** Sitemap absolute URL (APPENDIX A). */
export const SITE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml` as const

/** Hostname derived from the origin (APPENDIX A) — never a hardcoded string. */
export const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname

/** External sites allowed to link back when known — empty until researched. */
export const ALLOWED_BACKLINK_HOSTS: readonly string[] = []

/** Bump when homepage SEO copy changes materially — used as sitemap `lastmod`. */
export const SITE_CONTENT_UPDATED_AT = "2026-09-28T00:00:00.000Z" as const

/**
 * IndexNow key (APPENDIX A shape: env override, real 32-char hex default).
 * Must byte-match `public/{INDEXNOW_KEY}.txt` (enforced by
 * `scripts/check-indexnow-key.mjs` in prebuild).
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() ??
  "9447501f027d4b5687b4d21a907b4190"

/** Social preview image — generated from the header logo. Whitelisted in middleware. */
export const SOCIAL_PREVIEW_IMAGE = "/og-image.png" as const

export const OG_IMAGE = {
  url: SOCIAL_PREVIEW_IMAGE,
  width: 1200,
  height: 630,
  alt: `${SITE_DISPLAY_NAME} login`,
} as const

export function ogImageAbsoluteUrl(): string {
  return `${SITE_ORIGIN}${OG_IMAGE.url}`
}

/** @deprecated Prefer `CANONICAL_HOST`. Kept for existing importers. */
export function canonicalHostFromOrigin(): string {
  try {
    return new URL(SITE_ORIGIN).hostname
  } catch {
    return "localhost"
  }
}

export function canonicalUrlForPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (path === "/") return SITE_HOMEPAGE_CANONICAL
  return `${SITE_ORIGIN}${path}`
}

export type SitePlatform = "alight" | "wealthcare" | "other"

/** Override when auto-detect is wrong. */
export const SITE_PLATFORM: SitePlatform | undefined = undefined

export function detectSitePlatform(): SitePlatform {
  if (SITE_PLATFORM) return SITE_PLATFORM
  const host = new URL(SITE_ORIGIN).hostname.toLowerCase()
  const label = SITE_DISPLAY_NAME.toLowerCase()
  if (/wealthcare|aptia365|flores247|flores/i.test(host + label)) return "wealthcare"
  if (/alight|worklife|work-life|workife/i.test(host + label)) return "alight"
  return "other"
}

/** Site name for 🌐 New Visitor (…) */
export function getTelegramVisitorSiteName(): string {
  return SITE_DISPLAY_NAME.trim()
}
