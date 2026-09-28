import { NextRequest, NextResponse } from "next/server"

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set("forgot_flow", "1", {
    path: "/",
    maxAge: 10 * 60,
  })
  return response
}
