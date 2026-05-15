"use client"

import { useState, Suspense, useRef } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialButton } from "@/components/ui/social-button"

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const urlError = searchParams.get("error")
  const message = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent double submission
    if (isLoading) {
      return
    }
    
    // Additional protection using form ref
    if (formRef.current?.dataset.submitting === 'true') {
      return
    }
    
    if (formRef.current) {
      formRef.current.dataset.submitting = 'true'
    }
    
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        // Use window.location for a hard redirect to ensure session is loaded
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error("Sign in exception:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
      if (formRef.current) {
        formRef.current.dataset.submitting = 'false'
      }
    }
  }

  const handleSocialLogin = async (provider: "google" | "github" | "facebook") => {
    setError("")
    setSocialLoading(provider)
    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true, // Let NextAuth handle redirect
      })
    } catch (error) {
      console.error(`${provider} sign in exception:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#03050a] px-4 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Sign in to continue learning
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
              <SocialButton 
                provider="github"
                onClick={() => handleSocialLogin("github")}
                isLoading={socialLoading === "github"}
                disabled={socialLoading !== null}
                iconOnly
              />
              <SocialButton 
                provider="facebook"
                onClick={() => handleSocialLogin("facebook")}
                isLoading={socialLoading === "facebook"}
                disabled={socialLoading !== null}
                iconOnly
              />
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-500">Or with email</span>
              </div>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
              {message === "profile-updated" && !error && (
                <Alert variant="success" title="Profile Updated">
                  Your profile has been updated successfully. Please sign in again with your credentials.
                </Alert>
              )}

              {message === "password-updated" && !error && (
                <Alert variant="success" title="Password Updated">
                  Your password has been changed successfully. Please sign in with your new password.
                </Alert>
              )}
              
              {urlError && !error && (
                <Alert variant="warning" title="Authentication Error">
                  {urlError}
                </Alert>
              )}
              
              {error && (
                <Alert variant="error">
                  {error}
                </Alert>
              )}

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                showPasswordToggle
                required
              />

              <div className="flex items-center justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading || socialLoading !== null}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign up for free
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#03050a]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}
