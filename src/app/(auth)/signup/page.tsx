"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialButton } from "@/components/ui/social-button"
import { apiClient } from "@/lib/api-client"

export default function SignUpPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      await apiClient.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      router.push(`/activate?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      const error = err as Error
      setError(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google") => {
    setError("")
    setSocialLoading(provider)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error(`${provider} sign in error:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07040d] px-4 pt-16">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-[#120822]/60 backdrop-blur-xl border border-purple-900/40 shadow-2xl shadow-purple-950/50">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-purple-300/60">
              Start your learning journey today
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Social Login */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <SocialButton 
                provider="google"
                onClick={() => handleSocialLogin("google")}
                isLoading={socialLoading === "google"}
                disabled={socialLoading !== null}
                iconOnly
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-purple-900/40" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#120822] px-2 text-purple-300/50">Or with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="error" className="bg-rose-500/10 border-rose-500/30 text-rose-400">
                  {error}
                </Alert>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                showPasswordToggle
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                showPasswordToggle
                required
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 cursor-pointer"
                isLoading={isLoading}
                disabled={socialLoading !== null}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-purple-300/60">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}