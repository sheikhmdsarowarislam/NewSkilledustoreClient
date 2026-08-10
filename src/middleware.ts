// import { auth } from "@/auth"
// import { NextResponse } from "next/server"

// export default auth((req) => {
//   const session = req.auth

//   // Check if session has a refresh error
//   if (session?.error === "RefreshAccessTokenError") {
//     console.error("⚠️ Middleware: Token refresh failed, redirecting to signin")
//     return NextResponse.redirect(new URL("/signin?error=session_expired", req.url))
//   }

//   // Check if session has any error
//   if (session?.error) {
//     console.error("⚠️ Middleware: Session error detected:", session.error)
//     return NextResponse.redirect(new URL("/signin?error=SessionError", req.url))
//   }

//   // Check if the user is trying to access a protected route without a session
//   if (!session && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
//     return NextResponse.redirect(new URL("/signin", req.url))
//   }

//   // Check if session exists but access token is missing (for protected routes)
//   if (session && !session.accessToken && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
//     console.error("⚠️ Middleware: Session exists but access token missing")
//     return NextResponse.redirect(new URL("/signin?error=NoAccessToken", req.url))
//   }

//   return NextResponse.next()
// })

// export const config = {
//   matcher: [
//     "/dashboard/:path*",
//     "/courses/:path*/learn/:path*",
//     "/profile/:path*",
//     "/instructor/:path*",
//     "/admin/:path*",
//   ],
// }







import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function clearAuthCookies(response: NextResponse, req: NextRequest) {
  req.cookies.getAll().forEach((cookie) => {
    if (cookie.name.includes("session-token") || cookie.name.includes("authjs")) {
      response.cookies.set(cookie.name, "", { maxAge: 0, path: "/" })
    }
  })
  return response
}

export default auth((req) => {
  const session = req.auth

  // Check if session has a refresh error
  if (session?.error === "RefreshAccessTokenError") {
    console.error("⚠️ Middleware: Token refresh failed, redirecting to signin")
    const response = NextResponse.redirect(new URL("/signin?error=session_expired", req.url))
    return clearAuthCookies(response, req)
  }

  // Check if session has any error
  if (session?.error) {
    console.error("⚠️ Middleware: Session error detected:", session.error)
    const response = NextResponse.redirect(new URL("/signin?error=SessionError", req.url))
    return clearAuthCookies(response, req)
  }

  // Check if the user is trying to access a protected route without a session
  if (!session && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  // Check if session exists but access token is missing (for protected routes)
  if (session && !session.accessToken && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    console.error("⚠️ Middleware: Session exists but access token missing")
    const response = NextResponse.redirect(new URL("/signin?error=NoAccessToken", req.url))
    return clearAuthCookies(response, req)
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