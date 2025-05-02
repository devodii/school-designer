import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // todo: do stuff
}

export const config = {
  matcher: "/((?!_next|api|favicon.ico).*)",
}
