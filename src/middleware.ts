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

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  // পুরনো next-auth v4 নাম রেখে দিলাম, কোনো ক্ষতি নেই যদি ব্যবহার না হয়
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
]

function redirectAndClearSession(req: any, path: string) {
  const res = NextResponse.redirect(new URL(path, req.url))
  // FIX: শুধু redirect করলেই হবে না — broken/stale session cookie
  // clear না করলে navbar/client state পুরনো (fake logged-in) session
  // নিয়ে থেকে যায়, আর ইউজার আবার Dashboard-এ ক্লিক করলে লুপে পড়ে।
  for (const name of SESSION_COOKIE_NAMES) {
    res.cookies.delete(name)
  }
  return res
}

export default auth((req) => {
  const session = req.auth

  if (session?.error === "RefreshAccessTokenError") {
    console.error("⚠️ Middleware: Token refresh failed, redirecting to signin")
    return redirectAndClearSession(req, "/signin?error=session_expired")
  }

  if (session?.error) {
    console.error("⚠️ Middleware: Session error detected:", session.error)
    return redirectAndClearSession(req, "/signin?error=SessionError")
  }

  if (!session && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  if (session && !session.accessToken && req.nextUrl.pathname.match(/^\/(dashboard|profile|instructor|admin|courses\/[^/]+\/learn)/)) {
    console.error("⚠️ Middleware: Session exists but access token missing")
    return redirectAndClearSession(req, "/signin?error=NoAccessToken")
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