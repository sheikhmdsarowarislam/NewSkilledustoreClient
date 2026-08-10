// "use client"

// import { useState, Suspense, useRef } from "react"
// import { signIn } from "next-auth/react"
// import { useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Alert } from "@/components/ui/alert"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { SocialButton } from "@/components/ui/social-button"

// function SignInForm() {
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
//   const urlError = searchParams.get("error")
//   const message = searchParams.get("message")

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [socialLoading, setSocialLoading] = useState<string | null>(null)
//   const formRef = useRef<HTMLFormElement>(null)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     // Prevent double submission
//     if (isLoading) {
//       return
//     }
    
//     // Additional protection using form ref
//     if (formRef.current?.dataset.submitting === 'true') {
//       return
//     }
    
//     if (formRef.current) {
//       formRef.current.dataset.submitting = 'true'
//     }
    
//     setError("")
//     setIsLoading(true)

//     try {
//       const result = await signIn("credentials", {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//       })

//       if (result?.error) {
//         const errorMessages: Record<string, string> = {
//           "Configuration": "Invalid email or password. Please try again.",
//           "CredentialsSignin": "Invalid email or password. Please try again.",
//           "AccessDenied": "Access denied. Please contact support.",
//           "Verification": "Verification failed. Please try again.",
//         }
//         setError(errorMessages[result.error] || "Invalid email or password. Please try again.")
//       } else if (result?.ok) {
//         // Use window.location for a hard redirect to ensure session is loaded
//         window.location.href = callbackUrl
//       }
//     } catch (error) {
//       console.error("Sign in exception:", error)
//       setError("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//       if (formRef.current) {
//         formRef.current.dataset.submitting = 'false'
//       }
//     }
//   }

//   const handleSocialLogin = async (provider: "google") => {
//     setError("")
//     setSocialLoading(provider)
//     try {
//       await signIn(provider, { 
//         callbackUrl,
//         redirect: true, // Let NextAuth handle redirect
//       })
//     } catch (error) {
//       console.error(`${provider} sign in exception:`, error)
//       setError(`Failed to sign in with ${provider}. Please try again.`)
//       setSocialLoading(null)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#07040d] px-4 py-12">
//       {/* Background orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
//         <div className="absolute bottom-20 right-10 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Card */}
//         <Card className="bg-[#120822]/60 backdrop-blur-xl border border-purple-900/40 shadow-2xl shadow-purple-950/50">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center text-white">
//               Welcome Back
//             </CardTitle>
//             <CardDescription className="text-center text-purple-300/60">
//               Sign in to continue learning
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             {/* Social Login */}
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <SocialButton 
//                 provider="google"
//                 onClick={() => handleSocialLogin("google")}
//                 isLoading={socialLoading === "google"}
//                 disabled={socialLoading !== null}
//                 iconOnly
//               />
//             </div>

//             {/* Divider */}
//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t border-purple-900/40" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-[#120822] px-2 text-purple-300/50">Or with email</span>
//               </div>
//             </div>

//             {/* Form */}
//             <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
//               {message === "profile-updated" && !error && (
//                 <Alert variant="success" title="Profile Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
//                   Your profile has been updated successfully. Please sign in again with your credentials.
//                 </Alert>
//               )}

//               {message === "password-updated" && !error && (
//                 <Alert variant="success" title="Password Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
//                   Your password has been changed successfully. Please sign in with your new password.
//                 </Alert>
//               )}
              
//               {urlError && !error && (
//                 <Alert variant="warning" className="bg-amber-500/10 border-amber-500/30 text-amber-400" title={
//                   urlError === "session_expired" ? "Session Expired" :
//                   urlError === "SessionError" ? "Session Error" :
//                   urlError === "NoAccessToken" ? "Authentication Failed" :
//                   "Authentication Error"
//                 }>
//                   {urlError === "session_expired" || urlError === "SessionError"
//                     ? "Your session has expired. Please sign in again to continue."
//                     : urlError === "NoAccessToken"
//                     ? "Authentication failed. Please sign in again."
//                     : "Please sign in to continue."}
//                 </Alert>
//               )}
              
//               {error && (
//                 <Alert variant="error" className="bg-rose-500/10 border-rose-500/30 text-rose-400">
//                   {error}
//                 </Alert>
//               )}

//               <Input
//                 label="Email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />

//               <Input
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 showPasswordToggle
//                 required
//               />

//               <div className="flex items-center justify-end">
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 size="lg"
//                 className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 cursor-pointer"
//                 isLoading={isLoading}
//                 disabled={isLoading || socialLoading !== null}
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>
//           </CardContent>
          
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-sm text-center text-purple-300/60">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/signup"
//                 className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
//               >
//                 Sign up for free
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default function SignInPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center bg-[#07040d]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-purple-300/60">Loading...</p>
//         </div>
//       </div>
//     }>
//       <SignInForm />
//     </Suspense>
//   )
// }



"use client"

import { useState, Suspense, useRef, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
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

  const { status } = useSession()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  // ইউজার আগে থেকে অলরেডি লগইন অবস্থায় থাকলে (এবং কোনো session error না থাকলে) ড্যাশবোর্ডে রিডাইরেক্ট করবে
  useEffect(() => {
    if (status === "authenticated" && !urlError) {
      window.location.href = callbackUrl
    }
  }, [status, urlError, callbackUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Double submission বন্ধ করার জন্য চেক
    if (isLoading) {
      return
    }
    
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
        const errorMessages: Record<string, string> = {
          "Configuration": "Invalid email or password. Please try again.",
          "CredentialsSignin": "Invalid email or password. Please try again.",
          "AccessDenied": "Access denied. Please contact support.",
          "Verification": "Verification failed. Please try again.",
        }
        setError(errorMessages[result.error] || "Invalid email or password. Please try again.")
      } else if (result?.ok) {
        // Hard redirect ব্যবহার করা হয়েছে যাতে ড্যাশবোর্ডে নতুন সেশন ফ্রেশ অবস্থায় লোড হয়
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

  const handleSocialLogin = async (provider: "google") => {
    setError("")
    setSocialLoading(provider)
    try {
      await signIn(provider, { 
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error(`${provider} sign in exception:`, error)
      setError(`Failed to sign in with ${provider}. Please try again.`)
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07040d] px-4 py-12">
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-purple-300/60">
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
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
              {message === "profile-updated" && !error && (
                <Alert variant="success" title="Profile Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
                  Your profile has been updated successfully. Please sign in again with your credentials.
                </Alert>
              )}

              {message === "password-updated" && !error && (
                <Alert variant="success" title="Password Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
                  Your password has been changed successfully. Please sign in with your new password.
                </Alert>
              )}
              
              {urlError && !error && (
                <Alert variant="warning" className="bg-amber-500/10 border-amber-500/30 text-amber-400" title={
                  urlError === "session_expired" ? "Session Expired" :
                  urlError === "SessionError" ? "Session Error" :
                  urlError === "NoAccessToken" ? "Authentication Failed" :
                  "Authentication Error"
                }>
                  {urlError === "session_expired" || urlError === "SessionError"
                    ? "Your session has expired. Please sign in again to continue."
                    : urlError === "NoAccessToken"
                    ? "Authentication failed. Please sign in again."
                    : "Please sign in to continue."}
                </Alert>
              )}
              
              {error && (
                <Alert variant="error" className="bg-rose-500/10 border-rose-500/30 text-rose-400">
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
                  className="text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 cursor-pointer"
                isLoading={isLoading}
                disabled={isLoading || socialLoading !== null}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-purple-300/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
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
      <div className="min-h-screen flex items-center justify-center bg-[#07040d]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-purple-300/60">Loading...</p>
        </div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  )
}

// "use client"

// import { useState, Suspense, useRef, useEffect } from "react"
// import { signIn, useSession } from "next-auth/react"
// import { useSearchParams } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Alert } from "@/components/ui/alert"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { SocialButton } from "@/components/ui/social-button"

// function SignInForm() {
//   const searchParams = useSearchParams()
//   const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
//   const urlError = searchParams.get("error")
//   const message = searchParams.get("message")

//   const { data: session, status } = useSession()

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [socialLoading, setSocialLoading] = useState<string | null>(null)
//   const formRef = useRef<HTMLFormElement>(null)

//   // সত্যিকারের authenticated session থাকলে (session.error না থাকলে) ড্যাশবোর্ডে
//   // পাঠিয়ে দেবে — URL এ পুরনো ?error=session_expired আটকে থাকলেও এটা কাজ করবে,
//   // কারণ login সফল হলে redirect আটকানোর কোনো কারণ নেই।
//   useEffect(() => {
//     if (status === "authenticated" && !session?.error) {
//       window.location.href = callbackUrl
//     }
//   }, [status, session, callbackUrl])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
    
//     // Double submission বন্ধ করার জন্য চেক
//     if (isLoading) {
//       return
//     }
    
//     if (formRef.current?.dataset.submitting === 'true') {
//       return
//     }
    
//     if (formRef.current) {
//       formRef.current.dataset.submitting = 'true'
//     }
    
//     setError("")
//     setIsLoading(true)

//     try {
//       const result = await signIn("credentials", {
//         email: formData.email,
//         password: formData.password,
//         redirect: false,
//       })

//       if (result?.ok) {
//         // Hard redirect ব্যবহার করা হয়েছে যাতে ড্যাশবোর্ডে নতুন সেশন ফ্রেশ অবস্থায় লোড হয়
//         window.location.href = callbackUrl
//       } else if (result?.error) {
//         const errorMessages: Record<string, string> = {
//           "Configuration": "Invalid email or password. Please try again.",
//           "CredentialsSignin": "Invalid email or password. Please try again.",
//           "AccessDenied": "Access denied. Please contact support.",
//           "Verification": "Verification failed. Please try again.",
//         }
//         setError(errorMessages[result.error] || "Invalid email or password. Please try again.")
//       }
//     } catch (error) {
//       console.error("Sign in exception:", error)
//       setError("An error occurred. Please try again.")
//     } finally {
//       setIsLoading(false)
//       if (formRef.current) {
//         formRef.current.dataset.submitting = 'false'
//       }
//     }
//   }

//   const handleSocialLogin = async (provider: "google") => {
//     setError("")
//     setSocialLoading(provider)
//     try {
//       await signIn(provider, { 
//         callbackUrl,
//         redirect: true,
//       })
//     } catch (error) {
//       console.error(`${provider} sign in exception:`, error)
//       setError(`Failed to sign in with ${provider}. Please try again.`)
//       setSocialLoading(null)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#07040d] px-4 py-12">
//       {/* Background orbs */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
//         <div className="absolute bottom-20 right-10 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Card */}
//         <Card className="bg-[#120822]/60 backdrop-blur-xl border border-purple-900/40 shadow-2xl shadow-purple-950/50">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center text-white">
//               Welcome Back
//             </CardTitle>
//             <CardDescription className="text-center text-purple-300/60">
//               Sign in to continue learning
//             </CardDescription>
//           </CardHeader>
          
//           <CardContent>
//             {/* Social Login */}
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <SocialButton 
//                 provider="google"
//                 onClick={() => handleSocialLogin("google")}
//                 isLoading={socialLoading === "google"}
//                 disabled={socialLoading !== null}
//                 iconOnly
//               />
//             </div>

//             {/* Divider */}
//             <div className="relative mb-6">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t border-purple-900/40" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-[#120822] px-2 text-purple-300/50">Or with email</span>
//               </div>
//             </div>

//             {/* Form */}
//             <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
//               {message === "profile-updated" && !error && (
//                 <Alert variant="success" title="Profile Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
//                   Your profile has been updated successfully. Please sign in again with your credentials.
//                 </Alert>
//               )}

//               {message === "password-updated" && !error && (
//                 <Alert variant="success" title="Password Updated" className="bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300">
//                   Your password has been changed successfully. Please sign in with your new password.
//                 </Alert>
//               )}
              
//               {urlError && !error && (
//                 <Alert variant="warning" className="bg-amber-500/10 border-amber-500/30 text-amber-400" title={
//                   urlError === "session_expired" ? "Session Expired" :
//                   urlError === "SessionError" ? "Session Error" :
//                   urlError === "NoAccessToken" ? "Authentication Failed" :
//                   "Authentication Error"
//                 }>
//                   {urlError === "session_expired" || urlError === "SessionError"
//                     ? "Your session has expired. Please sign in again to continue."
//                     : urlError === "NoAccessToken"
//                     ? "Authentication failed. Please sign in again."
//                     : "Please sign in to continue."}
//                 </Alert>
//               )}
              
//               {error && (
//                 <Alert variant="error" className="bg-rose-500/10 border-rose-500/30 text-rose-400">
//                   {error}
//                 </Alert>
//               )}

//               <Input
//                 label="Email"
//                 type="email"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />

//               <Input
//                 label="Password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 showPasswordToggle
//                 required
//               />

//               <div className="flex items-center justify-end">
//                 <Link
//                   href="/forgot-password"
//                   className="text-sm text-fuchsia-400 hover:text-fuchsia-300 font-medium transition-colors"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button
//                 type="submit"
//                 size="lg"
//                 className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 cursor-pointer"
//                 isLoading={isLoading}
//                 disabled={isLoading || socialLoading !== null}
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>
//           </CardContent>
          
//           <CardFooter className="flex flex-col space-y-4">
//             <div className="text-sm text-center text-purple-300/60">
//               Don&apos;t have an account?{" "}
//               <Link
//                 href="/signup"
//                 className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold transition-colors"
//               >
//                 Sign up for free
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

// export default function SignInPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center bg-[#07040d]">
//         <div className="text-center">
//           <div className="w-10 h-10 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="mt-4 text-purple-300/60">Loading...</p>
//         </div>
//       </div>
//     }>
//       <SignInForm />
//     </Suspense>
//   )
// }