import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Facebook from "next-auth/providers/facebook"
import type { JWT } from "next-auth/jwt"
import { jwtDecode } from "jwt-decode"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      avatar?: string
      isVerified: boolean
    }
    accessToken: string
    error?: string
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
    isVerified: boolean
    accessToken: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    avatar?: string
    isVerified: boolean
    accessToken: string
    refreshToken?: string
    accessTokenExpiry?: number
    error?: string
  }
}

/**
 * Backend JWT token থেকে exact expiry time বের করে
 * Fallback: 14 minutes (15min token এর জন্য safe margin)
 */
function getTokenExpiry(accessToken: string): number {
  try {
    const decoded = jwtDecode(accessToken) as { exp?: number }
    if (decoded.exp) {
      return decoded.exp * 1000 // seconds → milliseconds
    }
  } catch {
    console.warn("⚠️ Could not decode token expiry, using fallback")
  }
  // Fallback: 14 minutes from now
  return Date.now() + 14 * 60 * 1000
}

/**
 * Refresh token দিয়ে নতুন access token নেয়
 * Cookie loop বা infinite retry নেই
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  // refreshToken না থাকলে সাথে সাথে error return — loop নেই
  if (!token.refreshToken) {
    console.error("❌ No refresh token available")
    return { ...token, error: "RefreshAccessTokenError" }
  }

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    console.log("🔄 Attempting to refresh access token...")

    const response = await fetch(`${API_URL}/api/v1/user/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    })

    const data = await response.json()

    if (!response.ok || !data.success || !data.data?.accessToken) {
      console.error(`❌ Token refresh failed: HTTP ${response.status}`, data)
      return { ...token, error: "RefreshAccessTokenError" }
    }

    const { accessToken, refreshToken } = data.data
    console.log("✅ Token refreshed successfully")

    return {
      ...token,
      accessToken,
      refreshToken: refreshToken || token.refreshToken, // নতুন না এলে পুরনোটা রাখো
      accessTokenExpiry: getTokenExpiry(accessToken),   // backend এর exact expiry
      error: undefined,
    }
  } catch (error) {
    console.error("❌ Token refresh network error:", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

          const res = await fetch(`${API_URL}/api/v1/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          const response = await res.json()

          if (!res.ok || !response.success) {
            console.error("Login failed:", response.message)
            throw new Error(response.message || "Authentication failed")
          }

          const { user, accessToken, refreshToken } = response.data || {}

          if (user && accessToken) {
            return {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar?.url,
              isVerified: user.isVerified,
              accessToken,
              refreshToken,
            } as any
          }

          throw new Error("Invalid response from server")
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // ── ১. Initial sign in (credentials) ──
      if (user && account?.provider === "credentials") {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
        token.isVerified = user.isVerified
        token.accessToken = user.accessToken
        token.refreshToken = (user as any).refreshToken
        token.accessTokenExpiry = getTokenExpiry(user.accessToken) // backend expiry
        token.error = undefined
        return token
      }

      // ── ২. Social login (Google, GitHub, Facebook) ──
      if (user && account?.provider && account.provider !== "credentials") {
        let retries = 3
        let lastError: Error | null = null

        while (retries > 0) {
          try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(`${API_URL}/api/v1/user/social-auth`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email || "",
                name: user.name || "",
                avatar: user.image
                  ? {
                      public_id: `${account.provider}_${user.id}`,
                      url: user.image,
                    }
                  : undefined,
              }),
              signal: controller.signal,
            })

            clearTimeout(timeoutId)
            const result = await response.json()

            if (!response.ok || !result.success) {
              throw new Error(result.message || "Social authentication failed")
            }

            const { user: backendUser, accessToken, refreshToken } = result.data

            if (!backendUser || !accessToken) {
              throw new Error("Invalid response from authentication server")
            }

            token.id = backendUser._id
            token.name = backendUser.name
            token.email = backendUser.email
            token.role = backendUser.role
            token.avatar = backendUser.avatar?.url
            token.isVerified = backendUser.isVerified || true
            token.accessToken = accessToken
            token.refreshToken = refreshToken
            token.accessTokenExpiry = getTokenExpiry(accessToken) // backend expiry
            token.error = undefined

            return token
          } catch (error: any) {
            lastError = error
            retries--

            // Unrecoverable error হলে retry করো না
            if (
              error.message?.includes("email") ||
              error.message?.includes("Invalid")
            ) {
              break
            }

            if (retries > 0) {
              await new Promise((resolve) =>
                setTimeout(resolve, (4 - retries) * 1000)
              )
            }
          }
        }

        throw lastError || new Error("Social authentication failed")
      }

      // ── ৩. Subsequent requests — token check ──

      // FIX 1: Error থাকলে আর refresh করো না → loop বন্ধ
      if (token.error === "RefreshAccessTokenError") {
        return token
      }

      const now = Date.now()
      const timeUntilExpiry = token.accessTokenExpiry
        ? token.accessTokenExpiry - now
        : 0

      // FIX 2: Expiry নেই বা 5 মিনিটের কম বাকি → refresh
      if (!token.accessTokenExpiry || timeUntilExpiry <= 5 * 60 * 1000) {
        if (timeUntilExpiry > 0) {
          console.log(
            `⏰ Token expires in ${Math.round(timeUntilExpiry / 1000 / 60)} minutes, refreshing...`
          )
        } else {
          console.log("⏰ Token expired, refreshing...")
        }
        return await refreshAccessToken(token)
      }

      // Token এখনো valid
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.avatar = token.avatar
        session.user.isVerified = token.isVerified
        session.accessToken = token.accessToken
        session.error = token.error
      }
      return session
    },
  },

  pages: {
    signIn: "/signin",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  trustHost: true,
})