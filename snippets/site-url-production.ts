/**
 * Production member-site template — copy into `lib/site-url.ts` (or `src/lib/site-url.ts`).
 *
 * Wire-up checklist:
 * 1. Replace `https://www.example.com` with your production hostname (no trailing slash).
 *    Hostname must match Vercel Domains **primary** (usually www). Absolute `og:image` is
 *    `${SITE_ORIGIN}/og-image.png` — scrapers often fail if that URL **308**s to the other host.
 *    Verify: `curl -sI "$SITE_ORIGIN/og-image.png"` → **200** (not 308) with `image/png`.
 * 2. Replace `your-indexnow-key-here` with your IndexNow key (32-char hex from Bing Webmaster / IndexNow).
 * 3. Create `public/{INDEXNOW_KEY}.txt` containing exactly one line: the key value.
 * 4. Copy `scripts/notify-indexnow.mjs` and `scripts/seo-telegram-notify.mjs` from this kit into your project.
 * 5. Add to `package.json` scripts: `"postbuild": "node scripts/notify-indexnow.mjs"`
 *    (see `snippets/package-indexnow-postbuild.json`).
 * 6. On Vercel production deploy, grep Build logs for `[IndexNow]` — expect `submitting`, `keyLocation`, `✓ success`, and `SEO admin Telegram notified` when Bundle 2 env is set on Build.
 *    Local test: `INDEXNOW_ON_BUILD=1 npm run build`
 *
 * Cloudflare WAF is optional operator tooling (not part of this kit). Origin gate in middleware remains required.
 *
 * Env vars `SITE_URL`, `NEXT_PUBLIC_SITE_URL` are NOT required when origin is hardcoded here.
 * `INDEXNOW_KEY` env is an optional override only.
 */

/** Display name for notifications and metadata — customize per project. */
export const SITE_DISPLAY_NAME = "Your Site Name" as const

/** Canonical origin (no trailing slash) — must match Vercel Domains primary host. */
export const SITE_ORIGIN = "https://www.example.com" as const

/** @deprecated Use SITE_ORIGIN — kept for middleware host redirect imports. */
export const SITE_URL = SITE_ORIGIN

/** Homepage canonical + sitemap entry (trailing slash). */
export const SITE_HOMEPAGE_CANONICAL = `${SITE_ORIGIN}/` as const

export const SITE_SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml` as const

export const CANONICAL_HOST = new URL(SITE_ORIGIN).hostname

/**
 * Bump when homepage SEO copy changes materially (title, description, keywords, CrawlerSeoPage).
 * Feeds `app/sitemap.ts` lastmod — keep in sync with real content updates.
 */
export const SITE_CONTENT_UPDATED_AT = "2026-08-03T00:00:00.000Z" as const

/** IndexNow verification key (hosted at /{INDEXNOW_KEY}.txt). */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() ?? "your-indexnow-key-here"

export function canonicalUrlForPath(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (path === "/") return SITE_HOMEPAGE_CANONICAL
  return `${SITE_ORIGIN}${path}`
}

/** Site name for visitor Telegram alerts. */
export function getTelegramVisitorSiteName(): string {
  return SITE_DISPLAY_NAME.trim()
}

/**
 * Social preview image — priority: (1) header/login logo, (2) dedicated og.png,
 * (3) favicon fallback (/icon-48x48.png) when no header logo exists.
 * Whitelist this path in middleware SEO_ALLOWED_PATHS.
 */
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
