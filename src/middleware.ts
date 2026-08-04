import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const session = req.auth

  // Helper function to clear authentication cookies securely
  const clearAuthCookies = (response: NextResponse) => {
    response.cookies.delete("next-auth.session-token")
    response.cookies.delete("__Secure-next-auth.session-token")
    return response
  }

  // Check if session has a refresh error
  if (session?.error === "RefreshAccessTokenError") {
    console.error("⚠️ Middleware: Token refresh failed, redirecting to signin")
    const response = NextResponse.redirect(new URL("/signin?error=session_expired", req.url))
    return clearAuthCookies(response)
  }

  // Check if session has any error
  if (session?.error) {
    console.error("⚠️ Middleware: Session error detected:", session.error)
    const response = NextResponse.redirect(new URL("/signin?error=SessionError", req.url))
    return clearAuthCookies(response)
  }

  // Check if the user is trying to access a protected route without a session
  if (!session && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Check if session exists but access token is missing (for protected routes)
  if (session && !session.accessToken && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    console.error("⚠️ Middleware: Session exists but access token missing")
    const response = NextResponse.redirect(new URL("/signin?error=NoAccessToken", req.url))
    return clearAuthCookies(response)
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