"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={10 * 60} // Refetch session every 10 minutes (token expires in 15 min)
      refetchOnWindowFocus={true} // ✅ Critical: Refetch when window regains focus (handles inactive users)
      basePath="/api/auth" // Ensure correct base path
    >
      {children}
    </NextAuthSessionProvider>
  )
}

