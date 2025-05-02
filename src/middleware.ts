import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/waitlist") return NextResponse.next()

  return NextResponse.redirect(new URL("/waitlist", request.url))
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
}
