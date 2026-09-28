#!/usr/bin/env node

/**
 * Fails the build if canonical URL infrastructure drifts (Step 6 Sector E):
 * - lib/site-url.ts missing / placeholder origin / trailing slash / non-https
 * - SITE_URL / SITE_HOMEPAGE_CANONICAL not derived from SITE_ORIGIN
 * - CANONICAL_HOST not derived from SITE_ORIGIN
 * - middleware contains a www/apex host redirect (Vercel Domains owns it — RULE 2)
 * - consumers (layout canonical, sitemap, robots) not wired to site-url constants
 */

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");

const PLACEHOLDER_HOSTS = [
  "example.com",
  "example.org",
  "yourdomain.com",
  "your-domain.com",
  "your_site.com",
  "yoursite.com",
  "localhost",
];

function fail(msg) {
  console.error(`Canonical domain check failed: ${msg}`);
  process.exit(1);
}

async function readIfExists(relPath) {
  const full = path.join(ROOT, relPath);
  try {
    await access(full);
    return await readFile(full, "utf8");
  } catch {
    return null;
  }
}

async function main() {
  const siteUrlFile =
    (await readIfExists("lib/site-url.ts")) ??
    (await readIfExists("src/lib/site-url.ts"));
  if (!siteUrlFile) fail("lib/site-url.ts not found.");

  // --- SITE_ORIGIN: https, no trailing slash, not a placeholder -------------
  const originMatch = siteUrlFile.match(
    /export const SITE_ORIGIN\s*=\s*["'](https?:\/\/[^"']+)["']/,
  );
  if (!originMatch) fail("SITE_ORIGIN not found in site-url.ts.");
  const origin = originMatch[1].trim();

  if (!origin.startsWith("https://")) {
    fail(`SITE_ORIGIN must use https:// (got ${origin}).`);
  }
  if (origin.endsWith("/")) {
    fail(`SITE_ORIGIN must not have a trailing slash (got ${origin}).`);
  }
  let originHost;
  try {
    originHost = new URL(origin).hostname;
  } catch {
    fail(`SITE_ORIGIN is not a valid URL (got ${origin}).`);
  }
  const lowerHost = originHost.toLowerCase();
  for (const placeholder of PLACEHOLDER_HOSTS) {
    if (lowerHost === placeholder || lowerHost.endsWith(`.${placeholder}`)) {
      fail(`SITE_ORIGIN is still a placeholder host: ${originHost}`);
    }
  }
  if (lowerHost.includes("your")) {
    fail(`SITE_ORIGIN looks like a placeholder: ${originHost}`);
  }

  // --- Derived exports must reference SITE_ORIGIN ---------------------------
  const siteUrlLine = siteUrlFile.match(/export const SITE_URL\s*=\s*(.+)$/m);
  if (!siteUrlLine || !siteUrlLine[1].includes("SITE_ORIGIN")) {
    fail("SITE_URL must be derived from SITE_ORIGIN (SITE_URL = SITE_ORIGIN).");
  }
  const canonicalLine = siteUrlFile.match(
    /export const SITE_HOMEPAGE_CANONICAL\s*=\s*(.+)$/m,
  );
  if (!canonicalLine || !canonicalLine[1].includes("SITE_ORIGIN")) {
    fail(
      "SITE_HOMEPAGE_CANONICAL must be derived from SITE_ORIGIN.",
    );
  }
  const hostLine = siteUrlFile.match(/export const CANONICAL_HOST\s*=\s*(.+)$/m);
  if (!hostLine || !hostLine[1].includes("SITE_ORIGIN")) {
    fail("CANONICAL_HOST must be derived from SITE_ORIGIN.");
  }

  // --- RULE 2: no middleware www/apex host redirect -------------------------
  const middleware =
    (await readIfExists("middleware.ts")) ?? (await readIfExists("src/middleware.ts"));
  if (middleware === null) {
    fail("middleware.ts not found.");
  }
  if (/handlePreferredHostRedirect/.test(middleware)) {
    fail(
      "middleware contains handlePreferredHostRedirect — remove it; Vercel Domains owns the primary-host redirect (RULE 2).",
    );
  }
  if (/nextUrl\.hostname/.test(middleware) || /hostname\s*[!=]==/.test(middleware)) {
    fail(
      "middleware compares request hostnames — a www/apex redirect there fights Vercel Domains and causes ERR_TOO_MANY_REDIRECTS (RULE 2).",
    );
  }

  // --- Consumers wired to site-url constants --------------------------------
  const layout =
    (await readIfExists("app/layout.tsx")) ?? (await readIfExists("src/app/layout.tsx"));
  if (layout === null) fail("app/layout.tsx not found.");
  if (!/canonical:\s*SITE_HOMEPAGE_CANONICAL/.test(layout)) {
    fail("app/layout.tsx metadata canonical must use SITE_HOMEPAGE_CANONICAL.");
  }
  if (/secure2\.transamerica\.com|example\.com/.test(layout)) {
    fail("app/layout.tsx contains a stale/placeholder origin string.");
  }

  const sitemap = await readIfExists("app/sitemap.ts");
  if (sitemap === null) fail("app/sitemap.ts not found.");
  if (!/SITE_HOMEPAGE_CANONICAL|SITE_ORIGIN/.test(sitemap)) {
    fail("app/sitemap.ts must derive URLs from site-url.ts constants.");
  }

  const robots =
    (await readIfExists("app/robots.txt/route.ts")) ??
    (await readIfExists("app/robots.ts"));
  if (robots === null) fail("app/robots.txt route not found.");
  if (!/SITE_ORIGIN/.test(robots)) {
    fail("robots.txt route must derive Host/Sitemap lines from SITE_ORIGIN.");
  }
  if (/secure2\.transamerica\.com|example\.com/.test(robots)) {
    fail("robots.txt route contains a stale/placeholder origin string.");
  }

  console.log(
    `Canonical domain check passed (${origin}, host ${lowerHost}, no host redirects in middleware).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
