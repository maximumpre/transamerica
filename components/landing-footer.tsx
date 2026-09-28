const CREATE_ACCOUNT_URL = "https://www.transamerica.com/create-account";

const footerMenus = [
  {
    title: "Overview",
    links: [
      { label: "Newsroom", href: "https://www.transamerica.com/about-us/newsroom" },
      { label: "Careers", href: "https://www.transamerica.com/about-us/careers" },
      {
        label: "Company overview",
        href: "https://www.transamerica.com/about-us/company-overview",
      },
      { label: "Leadership", href: "https://www.transamerica.com/about-us/leadership" },
    ],
  },
  {
    title: "About us",
    links: [
      {
        label: "Aegon Transamerica Foundation",
        href: "https://www.transamerica.com/about-us/aegon-transamerica-foundation",
      },
      {
        label: "Diversity and inclusion",
        href: "https://www.transamerica.com/about-us/diversity-inclusion",
      },
      {
        label: "Our commitments",
        href: "https://www.transamerica.com/about-us/commitments",
      },
      {
        label: "Partnerships",
        href: "https://www.transamerica.com/about-us/partnerships",
      },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", href: "https://www.transamerica.com/contact-us" },
      { label: "Create account", href: CREATE_ACCOUNT_URL },
      { label: "Fraud alert", href: "https://www.transamerica.com/fraud-alert" },
    ],
  },
  {
    title: "Privacy",
    links: [
      {
        label: "Do not sell or share my personal information",
        href: "https://www.transamerica.com/do-not-sell-my-info",
      },
      {
        label: "Online privacy statement",
        href: "https://www.transamerica.com/privacy-policy",
      },
    ],
  },
];

const auxFooterLinks = [
  { label: "Terms of use", href: "https://www.transamerica.com/terms-of-use" },
  {
    label: "Accessibility",
    href: "https://www.transamerica.com/accessibility-statement",
  },
  {
    label: "Transparency in coverage",
    href: "https://www.transamerica.com/transparency-in-coverage",
  },
  {
    label: "Business continuity plan summary",
    href: "https://cdn.brandfolder.io/86JM1UOD/at/qfmlu8-g7hp8w-g9xbbd/113169R1_1120_Business_Continuity_Final.pdf",
  },
  {
    label: "Code of conduct",
    href: "https://www.transamerica.com/code-of-conduct",
  },
  {
    label: "Compensation",
    href: "https://www.transamerica.com/compensation-disclosure",
  },
  {
    label: "NYDFS cyber security - agents",
    href: "https://www.transamerica.com/nydfs-cyber-security-agents",
  },
  {
    label: "Florida mental health coverage parity laws",
    href: "https://www.transamerica.com/sites/default/files/files/e070d/federal-mental-health-coverage-parity-laws.pdf",
  },
  {
    label:
      "Massachusetts mental health coverage - grandfathered major medical plans only",
    href: "https://www.transamerica.com/sites/default/files/files/e070d/massachusetts-mental-health-coverage.pdf",
  },
  {
    label: "CA health insurance plans only",
    href: "https://www.transamerica.com/sites/default/files/files/e070d/ca_health_insurance_plans_only.pdf",
  },
  { label: "Abuse victims", href: "https://www.transamerica.com/abuse-victims" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/Transamerica",
    icon: "fa-brands fa-facebook-f",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/transamerica",
    icon: "fa-brands fa-linkedin-in",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/transamerica/",
    icon: "fa-brands fa-instagram",
  },
  {
    label: "X",
    href: "https://x.com/transamerica",
    icon: "fa-brands fa-x-twitter",
  },
];

/**
 * Full Transamerica footer, shared by the human landing (LandingChrome) and
 * the crawler SEO twin (CrawlerSeoPage) so the crawler sees the same
 * internal-link structure and legal copy as the human page.
 */
export function LandingFooter() {
  return (
    <footer className="bg-[#281805] px-5 py-10 text-white lg:px-16 lg:py-14">
      <nav aria-label="footer primary navigation">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 min-[960px]:grid-cols-3 min-[960px]:gap-x-6 min-[1440px]:grid-cols-5 min-[1440px]:gap-x-8">
          {footerMenus.map((menu) => (
            <div key={menu.title}>
              <h3 className="text-3xl font-medium">{menu.title}</h3>
              <ul className="mt-2 space-y-7 text-xl">
                {menu.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-medium underline hover:text-white/60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div className="mt-6 text-md leading-5 lg:text-xl lg:leading-9">
        <p>
          {auxFooterLinks.map((link, index) => (
            <span key={link.label}>
              {index > 0 && "\u00A0 | \u00A0"}
              <a
                href={link.href}
                className="font-medium hover:text-white/60"
              >
                {link.label}
              </a>
            </span>
          ))}
        </p>
      </div>
      <div className="mt-6 lg:flex lg:justify-between">
        <div>
          <img
            src="/Transamerica/images/Transamerica-Logo.png"
            alt="Transamerica"
            className="w-44 brightness-0 invert"
          />
          <p className="text-xl">an Aegon company</p>
        </div>
        <div className="mt-6 flex gap-4 text-xl">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="hover:text-white/60"
            >
              <i className={link.icon} aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
      <div className="mt-6 text-md leading-6 lg:mt-8 lg:text-xl lg:leading-[1.35]">
        <p>
          Transamerica, the Transamerica Pyramid logo and the Transamerica
          Pyramid building are federally registered service marks owned by
          Transamerica Corporation. Any unauthorized use is expressly
          prohibited. Transamerica is the marketing name for Transamerica
          Corporation, Transamerica Financial Life Insurance Company,
          Transamerica Life Insurance Company, and Transamerica Retirement
          Solutions, LLC. Insurance products and services are offered or
          issued by Transamerica Life Insurance Company, Cedar Rapids, IA;
          Transamerica Financial Life Insurance Company, Harrison, NY
          (licensed in New York); and Transamerica Casualty Insurance
          Company, Cedar Rapids, IA. Securities offered through
          Transamerica Investors Securities, LLC, Harrison, NY.
        </p>
        <p>
          Variable products and mutual funds are underwritten and distributed
          by Transamerica Capital, LLC, and/or distributed by Transamerica
          Investors Securities, LLC, each a broker-dealer and member of{" "}
          <a
            href="https://www.finra.org/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            FINRA
          </a>
          . Securities and investment advisory services offered by
          Transamerica Financial Advisors, LLC, a broker-dealer, member of{" "}
          <a
            href="https://www.finra.org/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            FINRA
          </a>
          ,{" "}
          <a
            href="https://www.sipc.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            SIPC
          </a>{" "}
          and a Registered Investment Adviser. Investment advisory services
          focused on the unique needs of individual retirees, retirement
          plans, and their participants are offered by Transamerica
          Retirement Advisors, LLC, a Registered Investment Advisor.
        </p>
        <p>
          Health savings products and services offered through Transamerica
          Health Savings Solutions, LLC. This site may not yet be approved by
          the Departments of Insurance in all states at the time of
          publication.
        </p>
        <p>
          Transamerica companies are part of the Aegon Group. Copyright 2011
          - 2025 Transamerica Corporation. 6400 C Street SW, Cedar Rapids, IA
          52499 - All Rights Reserved.
        </p>
        <p className="mt-5">113555R31</p>
      </div>
    </footer>
  );
}
