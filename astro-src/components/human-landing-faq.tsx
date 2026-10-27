/**
 * Below-fold FAQ for human Astro landing (cloaking parity with twin).
 * Questions aligned with crawler-seo.astro Archetype 4 FAQs.
 */
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

const FAQS = [
  {
    q: `How do I access my employer-sponsored ${SITE_DISPLAY_NAME} 401(k) or pension account?`,
    a: `Enter your registered username and password on this sign-in page. First-time participants create an account with identity verification, then complete any security validation code or VoicePass step.`,
  },
  {
    q: "How do I adjust my paycheck retirement contribution rates and company match?",
    a: "After signing in, open contribution settings for your workplace plan. Update pre-tax or Roth deferrals within plan limits. Employer match details appear on the plan summary when available.",
  },
  {
    q: "Where can I review fund investment options, asset allocations, and rate of return?",
    a: "Signed-in participants can open fund and fee information, target-date models, and allocation tools from the account menu.",
  },
  {
    q: "How do I initiate a rollover from a previous employer retirement plan or IRA?",
    a: `Start a direct rollover from the transfers area after authentication. Follow custodian instructions for trustee-to-trustee transfers into your ${SITE_DISPLAY_NAME} account.`,
  },
  {
    q: "What are the guidelines for requesting a retirement plan loan or hardship withdrawal?",
    a: "Loan and hardship rules are plan-specific. After sign-in, open loans or withdrawals to see eligibility. Call participant support at 800-755-5801 if the option is unavailable online.",
  },
  {
    q: "How do I update beneficiaries or contact participant support?",
    a: "Update beneficiaries under Home or Profile when your plan allows electronic designation. Participant care is available Monday–Friday 8 a.m.–8 p.m. ET at 800-755-5801.",
  },
] as const

export function HumanLandingFaq() {
  return (
    <section
      className="mt-10 mx-auto max-w-[1075px] px-5 pb-12 text-sm text-[#281805]/90"
      aria-labelledby="human-landing-faq-heading"
    >
      <h2
        id="human-landing-faq-heading"
        className="text-base font-semibold text-[#281805] mb-3"
      >
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="rounded-md border border-neutral-200 bg-neutral-50/50 p-3"
          >
            <summary className="cursor-pointer font-medium text-[#281805]">
              {item.q}
            </summary>
            <p className="mt-2 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
