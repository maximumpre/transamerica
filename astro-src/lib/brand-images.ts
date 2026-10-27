/**
 * Resolved image URLs for the Astro pages (Transamerica assets).
 * Root-relative paths into Next `public/` — never ImageMetadata objects.
 */

export const toImageUrl = (asset: string | { src: string }): string =>
  typeof asset === "string" ? asset : encodeURI(asset.src)

export const BRAND_LOGO_SRC = "/Transamerica/images/Transamerica-Logo.png"
export const HERO_IMAGE_SRC = "/Transamerica/images/cityscape-hero.webp"
export const PARTNER_LOGO_SRC = "/Transamerica/images/Transamerica-Logo.png"
