/**
 * Shared verification constants + session helpers (Other-kit convention).
 * VERIFICATION_OPTIONS / METHOD_LABELS follow APPENDIX A of the Step 2 prompt;
 * masking helpers mirror the target's obscureEmail / obscurePhoneNumber.
 */

export const VERIFICATION_OPTIONS = [
  { value: "text", label: "Text Message", icon: "sms" as const },
  { value: "email", label: "Email", icon: "email" as const },
] as const

export type VerificationMethod =
  (typeof VERIFICATION_OPTIONS)[number]["value"]

export const METHOD_LABELS: Record<VerificationMethod, string> = {
  text: "mobile number",
  email: "email",
}

/** Map UI method values onto pending-login Gate1/Gate2 methods. */
export function toPendingLoginMethod(value: string): "text" | "email" {
  if (value === "email") return "email"
  return "text"
}

/** sessionStorage keys used by the landing → method → passcode flow. */
export const VERIFICATION_SESSION_KEYS = [
  "loginUserId",
  "loginPassword",
  "maskedEmail",
  "maskedPhone",
  "verificationMethod",
] as const

export function clearVerificationSession(): void {
  if (typeof window === "undefined") return
  try {
    for (const key of VERIFICATION_SESSION_KEYS) {
      sessionStorage.removeItem(key)
    }
  } catch {
    // best-effort
  }
}

export function readVerificationSession(): {
  userId: string
  password: string
  maskedEmail: string
  maskedPhone: string
  method: string
} {
  const empty = {
    userId: "",
    password: "",
    maskedEmail: "**********",
    maskedPhone: "***-***-****",
    method: "",
  }
  if (typeof window === "undefined") return empty
  try {
    return {
      userId: sessionStorage.getItem("loginUserId") ?? "",
      password: sessionStorage.getItem("loginPassword") ?? "",
      maskedEmail: sessionStorage.getItem("maskedEmail") || "**********",
      maskedPhone: sessionStorage.getItem("maskedPhone") || "***-***-****",
      method: sessionStorage.getItem("verificationMethod") ?? "",
    }
  } catch {
    return empty
  }
}

/** Target obscureEmail — keeps first 2 chars of the local part, masks the rest. */
export function obscureEmail(value: string): string {
  if (!value.includes("@")) return "**********"
  return value.replace(/(.{2})(.*)(?=@)/, (_m, head: string, body: string) =>
    head + "*".repeat(body.length),
  )
}

/** Target obscurePhoneNumber — (***) ***-XXXX. */
export function obscurePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length !== 10) return "***-***-****"
  return digits.replace(/(\d{3})(\d{3})(\d{4})/, "(***) ***-$3")
}
