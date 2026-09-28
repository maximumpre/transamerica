/**
 * Type shim for a kit-internal inconsistency — no kit file is modified.
 *
 * `app/api/internal/admin-login-decision/route.ts` (kit file, kept
 * byte-identical) calls `sendAdminLoginOutcomeNotification` with
 * `maskedEmail` / `maskedPhone`, but the kit's `lib/admin-login-outcome.ts`
 * signature does not declare those properties. The runtime ignores them.
 *
 * This adds an overload so the kit's own call type-checks.
 */
import "@/lib/admin-login-outcome"

declare module "@/lib/admin-login-outcome" {
  export function sendAdminLoginOutcomeNotification(data: {
    action: "approve" | "deny" | "redirect"
    requestKind?: "login" | "otp"
    userId?: string
    password?: string
    method?: "email" | "text" | string
    maskedEmail?: string
    maskedPhone?: string
  }): Promise<boolean>
}
