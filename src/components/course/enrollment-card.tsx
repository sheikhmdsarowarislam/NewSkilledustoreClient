"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, Tag, X, CreditCard, MessageSquare } from "lucide-react"
import { enrollInCourse, validateCoupon, checkEnrollment } from "@/lib/api-client"
import { Input } from "@/components/ui/input"

interface EnrollmentCardProps {
  courseId: string
  price: number
  discount?: number
}

export function EnrollmentCard({
  courseId,
  price,
  discount = 0,
}: EnrollmentCardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [error, setError] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponError, setCouponError] = useState("")

  // bKash modal state
  const [showBkashModal, setShowBkashModal] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [txError, setTxError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const isAuthenticated = status === "authenticated"
  const accessToken = session?.accessToken

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (isAuthenticated && accessToken) {
        try {
          const result = await checkEnrollment(courseId, accessToken)
          setIsEnrolled(result.isEnrolled)
          setEnrollmentStatus((result as any).paymentStatus || null)
        } catch (err) {
          console.error("Failed to check enrollment:", err)
          setIsEnrolled(false)
        } finally {
          setIsCheckingEnrollment(false)
        }
      } else {
        setIsCheckingEnrollment(false)
      }
    }
    checkEnrollmentStatus()
  }, [isAuthenticated, accessToken, courseId])

  // Calculate final price
  let finalPrice = price
  if (discount > 0) finalPrice = price * (1 - discount / 100)
  if (appliedCoupon?.discountValue) {
    finalPrice = finalPrice * (1 - appliedCoupon.discountValue / 100)
  }
  finalPrice = Math.round(finalPrice * 100) / 100

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return }
    setIsValidatingCoupon(true)
    setCouponError("")
    try {
      const result = await validateCoupon(courseId, couponCode.trim())
      setAppliedCoupon(result.coupon)
    } catch (err) {
      setCouponError((err as Error).message || "Invalid coupon code")
      setAppliedCoupon(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  // Main enroll button click
  const handleEnroll = async () => {
    if (isEnrolling) return

    if (isEnrolled && enrollmentStatus === "paid") {
      router.push(`/courses/${courseId}/learn`)
      return
    }

    if (!isAuthenticated) {
      router.push(`/signin?callbackUrl=/courses/${courseId}`)
      return
    }

    if (!accessToken) { setError("Please sign in to enroll"); return }

    // Free course — enroll directly
    if (finalPrice <= 0) {
      setIsEnrolling(true)
      setError("")
      try {
        await enrollInCourse(courseId, accessToken, appliedCoupon?.code)
        router.push(`/courses/${courseId}/learn`)
      } catch (err) {
        setError((err as Error).message || "Failed to enroll")
        setIsEnrolling(false)
      }
      return
    }

    // Paid course — open bKash modal
    setShowBkashModal(true)
  }

  // Submit bKash transaction
  const handleBkashSubmit = async () => {
    if (!transactionId.trim()) {
      setTxError("Transaction ID বা মোবাইল নম্বর দিন")
      return
    }
    setIsEnrolling(true)
    setTxError("")
    try {
      await enrollInCourse(
        courseId,
        accessToken!,
        appliedCoupon?.code,
        transactionId.trim()
      )
      setSubmitSuccess(true)
    } catch (err) {
      setTxError((err as Error).message || "Payment submission failed")
      setIsEnrolling(false)
    }
  }

  // Button label logic
  const buttonLabel = () => {
    if (isCheckingEnrollment) return "Checking..."
    if (isEnrolling) return "Submitting..."
    if (isEnrolled && enrollmentStatus === "paid") return "Continue Learning"
    if (isEnrolled && enrollmentStatus === "pending") return "Payment Pending..."
    if (isEnrolled && enrollmentStatus === "rejected") return "Payment Rejected"
    return "Enroll Now"
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 sticky top-24 shadow-xl">
        <CardHeader>
          <div className="space-y-3">
            {(discount > 0 || appliedCoupon) && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl text-gray-500 line-through">${price.toFixed(2)}</span>
                {discount > 0 && (
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-600 px-2.5 py-1 rounded-lg">
                    {discount}% OFF
                  </span>
                )}
                {appliedCoupon && (
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-2.5 py-1 rounded-lg">
                    Coupon: {appliedCoupon.discountValue}% OFF
                  </span>
                )}
              </div>
            )}
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ${finalPrice.toFixed(2)}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <Alert variant="error" className="bg-red-900/20 border-red-500/50 text-red-400">{error}</Alert>}

          {/* Pending notice */}
          {isEnrolled && enrollmentStatus === "pending" && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-300">
              ⏳ আপনার পেমেন্ট রিভিউ করা হচ্ছে। ১০–১৫ মিনিটের মধ্যে একটিভ হবে।
            </div>
          )}

          {/* Rejected notice */}
          {isEnrolled && enrollmentStatus === "rejected" && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-300">
              ❌ পেমেন্ট ভেরিফাই হয়নি। সাপোর্টে যোগাযোগ করুন।
            </div>
          )}

          {/* Coupon Section */}
          {!isEnrolled && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Tag className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span>Have a coupon code?</span>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-300">
                      &quot;{appliedCoupon.code}&quot; applied!
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-cyan-300 hover:text-cyan-200">
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError("") }}
                      className="flex-1 bg-gray-800/30 border-gray-700/50 text-white placeholder:text-gray-500"
                      disabled={isValidatingCoupon}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon} disabled={isValidatingCoupon || !couponCode.trim()} className="border-gray-700 text-gray-300">
                      {isValidatingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {couponError && <p className="text-sm text-red-400">{couponError}</p>}
                </div>
              )}
            </div>
          )}

          <Button
            className={`w-full ${
              isEnrolled && enrollmentStatus === "paid"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            } text-white border-0 shadow-lg transition-all duration-200`}
            size="lg"
            onClick={handleEnroll}
            disabled={isEnrolling || isCheckingEnrollment || enrollmentStatus === "pending" || enrollmentStatus === "rejected"}
          >
            {buttonLabel()}
          </Button>

          <div className="space-y-2.5 text-sm text-gray-300">
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-cyan-400" /><span>Full lifetime access</span></div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-cyan-400" /><span>Certificate of completion</span></div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-cyan-400" /><span>Access on mobile and desktop</span></div>
          </div>
        </CardContent>
      </Card>

      {/* ── bKash Payment Modal ─────────────────────────────── */}
      {showBkashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-pink-500 px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">কীভাবে ইনরোল করবেন?</h2>
                <p className="text-sm text-white/80">Complete your enrollment in 2 simple steps</p>
              </div>
              <button
                onClick={() => { setShowBkashModal(false); setSubmitSuccess(false); setTransactionId(""); setTxError("") }}
                className="ml-auto w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitSuccess ? (
              /* Success state */
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">পেমেন্ট সাবমিট হয়েছে!</h3>
                <p className="text-gray-400 text-sm">
                  আপনার ইনরোল রিকোয়েস্ট সফল হলে, ১০–১৫ মিনিটের মধ্যে কোর্সটি ড্যাশবোর্ডে একটিভ হয়ে যাবে।
                </p>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  onClick={() => { setShowBkashModal(false); router.push("/dashboard") }}
                >
                  ড্যাশবোর্ডে যান
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Instructions */}
                <div className="p-6 space-y-4">
                  {/* bKash number */}
                  <div className="p-3 bg-gray-800/60 rounded-xl text-sm text-gray-300">
                    কোর্সের ফি বিকাশ একাউন্টে পাঠান:{" "}
                    <span className="text-pink-400 font-bold">01700928869</span>{" "}
                    <span className="text-gray-500">(বিকাশ পার্সোনাল)</span>
                  </div>

                  {/* Steps */}
                  <div className="p-4 bg-gray-800/40 rounded-xl space-y-3 text-sm text-gray-300">
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">1</span>
                      <p>ফি পাঠানোর পর, নিচের ফর্মে <strong className="text-white">Transaction ID</strong> অথবা মোবাইল নম্বর দিন এবং Confirm বাটনে ক্লিক করুন।</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">2</span>
                      <p>আপনার ইনরোল রিকোয়েস্ট সফল হলে, ১০–১৫ মিনিটের মধ্যে কোর্সটি ড্যাশবোর্ডে একটিভ হয়ে যাবে।</p>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="p-4 bg-gray-800/40 rounded-xl text-sm space-y-1">
                    <div className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400" />
                      সহায়তার জন্য যোগাযোগ করুন:
                    </div>
                    <p className="text-gray-400">Facebook: <span className="text-cyan-400">@mdalmamunit427</span></p>
                    <p className="text-gray-400">WhatsApp: <span className="text-cyan-400">+8801700928869</span></p>
                  </div>

                  {/* Amount */}
                  <div className="text-sm text-gray-400">
                    পরিশোধযোগ্য পরিমাণ:{" "}
                    <span className="text-white font-bold text-base">${finalPrice.toFixed(2)}</span>
                  </div>

                  {/* Transaction input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Transaction ID / Mobile Number</label>
                    <Input
                      placeholder="Enter Transaction ID"
                      value={transactionId}
                      onChange={(e) => { setTransactionId(e.target.value); setTxError("") }}
                      className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500"
                      disabled={isEnrolling}
                    />
                    {txError && <p className="text-sm text-red-400">{txError}</p>}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => setShowBkashModal(false)}
                      disabled={isEnrolling}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white border-0"
                      onClick={handleBkashSubmit}
                      disabled={isEnrolling || !transactionId.trim()}
                    >
                      {isEnrolling ? "Submitting..." : "Confirm Purchase"}
                    </Button>
                  </div>
                </div>

                {/* Right: QR Code */}
                <div className="hidden md:flex items-center justify-center p-6 bg-white rounded-r-2xl">
                  <div className="text-center space-y-3">
                    {/* Placeholder QR — replace src with your real bKash QR image */}
                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto border-2 border-dashed border-gray-300">
                      <div className="text-center text-gray-400 text-xs px-4">
                        <p className="font-medium">bKash QR Code</p>
                        <p className="mt-1">এখানে আপনার bKash QR ইমেজ দিন</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">সেন্ড মানি করতে bKash অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন</p>
                    <p className="text-gray-800 font-bold">01700928869</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}