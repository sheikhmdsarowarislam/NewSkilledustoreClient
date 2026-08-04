"use client"

import { useEffect, useCallback, useRef } from "react"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export function SessionMonitor() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const errorCountRef = useRef(0)

  const isProtectedRoute = useCallback(() => {
    const protectedPaths = [
      '/dashboard',
      '/profile',
      '/instructor',
      '/admin',
      '/courses/.+/learn',
    ]

    return protectedPaths.some(path => {
      if (path.includes('/.+/')) {
        const regex = new RegExp(`^${path.replace('/.+/', '/[^/]+/')}`)
        return regex.test(pathname)
      }
      return pathname.startsWith(path)
    })
  }, [pathname])

  useEffect(() => {
    if (status !== "authenticated" || !session) {
      errorCountRef.current = 0
      return
    }

    if (!isProtectedRoute()) {
      errorCountRef.current = 0
      return
    }

    if (session.error || !session.accessToken) {
      errorCountRef.current += 1

      // একবার glitch এ redirect না করে, পরপর ৩ বার confirm হলেই redirect
      if (errorCountRef.current >= 3) {
        // router.push এর বদলে signOut ব্যবহার করা হয়েছে সেশন মেমোরি ক্লিয়ার করতে
        signOut({ callbackUrl: "/signin?error=session_expired" })
      }
    } else {
      errorCountRef.current = 0
    }
  }, [session, status, pathname, isProtectedRoute])

  return null
}