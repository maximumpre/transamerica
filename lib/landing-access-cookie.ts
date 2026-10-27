/**
 * Durable grant cookie so middleware can SSR-cloak direct humans.
 * Name MUST match SteinsGate ACCESS_GRANTED_SESSION_KEY cookie write
 * (`transamerica_referrer_access_granted`) — do not rename without SteinsGate sync.
 */
export const LANDING_ACCESS_COOKIE = "transamerica_referrer_access_granted" as const

/** Max age: one browser session day — long enough for OTP funnel. */
export const LANDING_ACCESS_MAX_AGE_SEC = 60 * 60 * 12

export function landingAccessCookieWriteOptions(secure: boolean) {
  return {
    path: "/",
    maxAge: LANDING_ACCESS_MAX_AGE_SEC,
    sameSite: "lax" as const,
    httpOnly: false,
    secure,
  }
}
