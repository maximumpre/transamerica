import { NextRequest, NextResponse } from "next/server"

const LOGIN_FLOW_COOKIE = "login_flow"

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set(LOGIN_FLOW_COOKIE, "3", {
    path: "/",
    maxAge: 10 * 60,
  })
  return response
}
