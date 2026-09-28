import { NextRequest, NextResponse } from "next/server";

const TURNSTILE_SECRET_KEY =
  process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAAC8q_jNSVySLlbqxP6g_lbEwWAk";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => ({}));
    const turnstileToken = data?.turnstileToken;
    if (turnstileToken) {
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

    // No harvesting or forwarding of credentials
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
