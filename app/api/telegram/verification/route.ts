import { NextRequest, NextResponse } from "next/server"

const LOGIN_FLOW_COOKIE = "login_flow"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json().catch(() => ({}))
    const response = NextResponse.json({ success: true })

    if (data.verificationType !== "Code (final)") {
      response.cookies.set(LOGIN_FLOW_COOKIE, "2", {
        path: "/",
        maxAge: 10 * 60,
      })
    }

    return response
  } catch {
    return NextResponse.json({ success: true })
  }
}
