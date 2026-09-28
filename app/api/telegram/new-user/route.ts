import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("new_user_flow", "1", {
    path: "/",
    maxAge: 10 * 60,
  })
  return response
}
