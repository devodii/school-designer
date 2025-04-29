import { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("middleware ran")
}

export const config = {
  matcher: "/",
}
