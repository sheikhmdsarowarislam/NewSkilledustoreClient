import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth

  // Check if session has a refresh error
  if (session?.error === "RefreshAccessTokenError") {
    console.error("⚠️ Middleware: Token refresh failed, redirecting to signin")
    return NextResponse.redirect(new URL("/signin?error=session_expired", req.url))
  }

  // Check if session has any error
  if (session?.error) {
    console.error("⚠️ Middleware: Session error detected:", session.error)
    return NextResponse.redirect(new URL("/signin?error=SessionError", req.url))
  }

  // Check if the user is trying to access a protected route without a session
  if (!session && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Check if session exists but access token is missing (for protected routes)
  if (session && !session.accessToken && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    console.error("⚠️ Middleware: Session exists but access token missing")
    return NextResponse.redirect(new URL("/signin?error=NoAccessToken", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/courses/:path*/learn/:path*",
    "/profile/:path*",
    "/instructor/:path*",
    "/admin/:path*",
  ],
}