import { SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo-metadata"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"
import { LandingFooter } from "@/components/landing-footer"

const TRANAMERICA_HOME_URL = "https://www.transamerica.com"
const CREATE_ACCOUNT_URL = "https://www.transamerica.com/create-account"
const FORGOT_USERNAME_URL =
  "https://secure2.transamerica.com/login/user-role-select/forgotUsername"
const FORGOT_PASSWORD_URL =
  "https://secure2.transamerica.com/login/user-role-select/forgotPassword"

/**
 * SSR-only static twin of the Transamerica login page for search crawlers.
 *
 * Must visually match the human landing (LandingChrome: nav, #63b6ff hero,
 * 1075px container, #281805 footer) at both desktop and mobile viewports
 * so that a crawler rendering the page sees the same DOM structure.
 *
 * Constraints:
 * - Server component only — no "use client", no working submit handlers.
 * - H1 leads with the brand (SITE_DISPLAY_NAME).
 * - Related searches block appears AFTER the login form, BEFORE the footer.
 * - Disabled inputs/buttons signal to crawlers that this is a login surface.
 */
export default function CrawlerSeoPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#281805]">
      <nav className="flex h-16 items-center bg-white px-5 lg:h-24 lg:px-12">
        <a href={TRANAMERICA_HOME_URL} rel="nofollow" aria-label="link to transamerica.com">
          <img
            src="/Transamerica/images/Transamerica-Logo.png"
            alt="Transamerica"
            className="w-28 lg:w-44"
          />
        </a>
      </nav>

      <section className="relative h-[370px] overflow-hidden bg-[#63b6ff] lg:h-[280px]">
        <div className="px-5 pt-8 lg:absolute lg:left-0 lg:top-0 lg:z-10 lg:flex lg:h-full lg:w-1/2 lg:items-center lg:px-12 lg:pt-0 xl:px-[72px]">
          <h1 className="text-4xl font-semibold min-[600px]:text-5xl">
            {SITE_DISPLAY_NAME} Login
          </h1>
        </div>
        <div className="mt-8 w-full lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:h-full lg:w-1/2">
          <img
            src="/Transamerica/images/cityscape-hero.webp"
            alt="City skyline"
            className="h-[190px] w-full object-cover object-center [clip-path:polygon(30%_100%,70%_100%,100%_40%,100%_0%,0%_0%,0%_40%)] lg:h-full lg:[clip-path:polygon(60%_0%,100%_0%,100%_100%,60%_100%,0%_70%,0%_30%)]"
          />
        </div>
      </section>

      <main className="px-5 pt-12 pb-12 lg:pt-20 lg:pb-20">
        <div className="mx-auto max-w-[1075px]">
          <h2 className="text-2xl font-normal lg:text-5xl">Access your account</h2>
          <p className="mt-4 text-sm lg:text-xl">{SITE_DESCRIPTION}</p>

          {/* Login form — static twin of app/page.tsx; no "use client", no submit handler */}
          <form className="mt-7 grid gap-x-8 sm:grid-cols-2">
            <div className="mt-7 sm:mt-0">
              <label htmlFor="seo-username" className="block text-xl font-semibold">
                Username<span className="text-red-600">*</span>
              </label>
              <input id="seo-username" type="text" disabled readOnly
                className="mt-2 h-14 w-full border-2 border-gray-800 px-2 outline-none"
              />
              <a href={FORGOT_USERNAME_URL} className="mt-6 block text-xl font-semibold sm:hidden">
                Forgot your username?
              </a>
            </div>
            <div className="mt-4 sm:mt-0">
              <label htmlFor="seo-password" className="block text-xl font-semibold">
                Password<span className="text-red-600">*</span>
              </label>
              <input id="seo-password" type="password" disabled readOnly
                className="mt-2 h-14 w-full border-2 border-gray-800 px-2 outline-none"
              />
              <a href={FORGOT_PASSWORD_URL} className="mt-6 block text-xl font-semibold sm:hidden">
                Forgot your password?
              </a>
            </div>
            <div className="mt-4 hidden grid-cols-2 gap-x-8 sm:col-span-2 sm:grid">
              <a href={FORGOT_USERNAME_URL} className="mt-6 block text-xl font-semibold">
                Forgot your username?
              </a>
              <a href={FORGOT_PASSWORD_URL} className="mt-6 block text-xl font-semibold">
                Forgot your password?
              </a>
            </div>
            <div className="mt-8 sm:col-span-2">
              <button type="button" disabled
                className="rounded-full bg-[#281805] px-8 py-4 text-xl text-white">
                Log in <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-xl">
            <p>Need to Register?</p>
            <a href={CREATE_ACCOUNT_URL} className="mt-3 block font-bold">
              Create your account
            </a>
          </div>

          {/* Required: visible Related searches body block (after form, before footer) */}
          {SITE_KEYWORDS.length > 0 ? (
            <section className="mt-8 border-t border-neutral-200 pt-6">
              <p className="text-sm leading-relaxed text-neutral-600">
                Related searches: {SITE_KEYWORDS.join(", ")}
              </p>
            </section>
          ) : null}
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
