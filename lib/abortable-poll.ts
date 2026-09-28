/**
 * PROJECT MODULE — not part of the Steins Gate kit.
 *
 * `lib/poll-pending-login.ts` is the kit file and stays byte-identical to it.
 * This module is the same poll contract plus an AbortSignal, used by the Gate 1 /
 * Gate 2 pages so that leaving a page mid-poll cannot fire a late redirect (for
 * example navigating away and then being pushed to `/api/login-out` up to 90s
 * later). Behaviour is otherwise identical to the kit helper.
 */
import { POLL_MS, approvalPollDelayMs } from "@/lib/approval-messages"

export type PendingLoginPollResult =
  | "approved"
  | "denied"
  | "redirected"
  | "timeout"
  | "error"

export async function pollPendingLoginAbortable(
  pendingId: string,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<PendingLoginPollResult> {
  const deadline = Date.now() + timeoutMs
  const waitStartedAt = Date.now()
  while (Date.now() < deadline) {
    if (signal?.aborted) return "error"
    try {
      const res = await fetch(
        `/api/pending-login/${encodeURIComponent(pendingId)}`,
        { cache: "no-store", signal },
      )
      if (res.ok) {
        const data = (await res.json()) as { status?: string }
        if (data.status === "approved") return "approved"
        if (data.status === "denied") return "denied"
        if (data.status === "redirected") return "redirected"
        if (data.status === "expired") return "timeout"
      }
    } catch {
      // keep polling (aborted requests land here too)
    }
    if (signal?.aborted) return "error"
    await new Promise((r) => setTimeout(r, approvalPollDelayMs(waitStartedAt)))
  }

  return "timeout"
}

export { POLL_MS }
