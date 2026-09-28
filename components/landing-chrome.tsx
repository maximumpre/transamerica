import type { ReactNode } from "react";
import { LandingFooter } from "@/components/landing-footer";

const TRANAMERICA_HOME_URL = "https://www.transamerica.com";

/**
 * Shared landing chrome (nav + hero + main container + footer) used by the
 * landing page and both verification pages so all three render the exact
 * target-derived header/hero/footer design.
 */
export function LandingChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans text-[#281805]">
      <nav className="flex h-16 items-center bg-white px-5 lg:h-24 lg:px-12">
        <a
          href={TRANAMERICA_HOME_URL}
          rel="nofollow"
          aria-label="link to transamerica.com"
        >
          <img
            src="/Transamerica/images/Transamerica-Logo.png"
            alt="Transamerica"
            className="w-28 lg:w-44"
          />
        </a>
      </nav>

      <section className="relative h-[370px] overflow-hidden bg-[#63b6ff] lg:h-[280px]">
        <div className="px-5 pt-8 lg:absolute lg:left-0 lg:top-0 lg:z-10 lg:flex lg:h-full lg:w-1/2 lg:items-center lg:px-12 lg:pt-0 xl:px-[72px]">
          <h1 className="text-4xl font-semibold min-[600px]:text-5xl">Login</h1>
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
        <div className="mx-auto max-w-[1075px]">{children}</div>
      </main>

      <LandingFooter />
    </div>
  );
}
