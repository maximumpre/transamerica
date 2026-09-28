import { NextRequest, NextResponse } from "next/server"

/**
 * [LOGOUT_DESTINATION_URL] — resolved for Step 2 by tracing this route
 * (no pre-existing handler / env in the project), then deriving from
 * [PROVIDED_URL] = https://secure2.transamerica.com/login (same target
 * domain/path family). Matches the project's canonical login URL in
 * app/layout.tsx. Optional env override: LOGIN_OUT_URL.
 */
const LOGOUT_DESTINATION_URL =
  process.env.LOGIN_OUT_URL || "https://secure2.transamerica.com/login"

export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  return NextResponse.redirect(LOGOUT_DESTINATION_URL, {
    status: 307,
    headers: { "x-login-out-destination": LOGOUT_DESTINATION_URL },
  });
}

export function POST(request: NextRequest) {
  return GET(request)
}
