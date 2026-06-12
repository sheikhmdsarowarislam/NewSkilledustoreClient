"use client"

import { useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"

export function SessionMonitor() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

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
    if (status !== "authenticated" || !session || !isProtectedRoute()) {
      return
    }

    const intervalId = setInterval(() => {
      if (session.error || !session.accessToken) {
        router.push("/signin?error=session_expired")
        return
      }
    }, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [session, status, router, pathname, isProtectedRoute])

  useEffect(() => {
    if (status === "authenticated" && session && isProtectedRoute()) {
      if (session.error || !session.accessToken) {
        router.push("/signin?error=session_expired")
      }
    }
  }, [session, status, router, pathname, isProtectedRoute])

  return null
}