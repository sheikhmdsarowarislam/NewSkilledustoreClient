"use client"

import { useSession as useNextAuthSession, signOut } from "next-auth/react"
import { useEffect } from "react"

export function useSession() {
  const { data: session, status, update } = useNextAuthSession()

  // Check for session error and sign out if refresh failed
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.error("Session expired. Signing out...")
      signOut({ callbackUrl: "/signin?error=session_expired" })
    }
  }, [session?.error])

  return {
    session,
    status,
    user: session?.user,
    accessToken: session?.accessToken,
    isAuthenticated: !!session?.user && !session?.error,
    isLoading: status === "loading",
    hasError: !!session?.error,
    update,
  }
}

