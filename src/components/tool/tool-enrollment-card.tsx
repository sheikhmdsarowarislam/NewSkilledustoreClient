"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, Tag, X, CreditCard, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"

// ── API helpers ────────────────────────────────────────────────────────

async function checkToolEnrollment(toolId: string, accessToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/check-tool-enrollment/${toolId}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to check enrollment")
  return data.data ?? data
}

async function enrollInTool(
  toolId: string,
  accessToken: string,
  couponCode?: string,
  transactionId?: string,
  variationLabel?: string,
  variationDays?: number,
  paymentMethod?: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/submit-tool-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        toolId,
        ...(couponCode     && { couponCode }),
        ...(transactionId  && { transactionId }),
        ...(variationLabel && { variationLabel }),
        ...(variationDays  && { variationDays }),
        ...(paymentMethod  && { paymentMethod }),
      }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Enrollment failed")
  return data
}

async function validateToolCoupon(toolId: string, couponCode: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/coupon/validate/${toolId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Invalid coupon")
  return data
}

// ── Types ──────────────────────────────────────────────────────────────
interface ToolVariation {
  label: string
  days: number
  price: number
}

interface ToolEnrollmentCardProps {
  toolId: string
  price: number
  discount?: number
  variations?: ToolVariation[]
}

// ── Payment method config ──────────────────────────────────────────────
type PaymentTab = "bkash" | "nagad" | "rocket" | "binance"

const PAYMENT_METHODS: { id: PaymentTab; label: string; color: string; number: string; type: string }[] = [
  {
    id: "bkash",
    label: "bKash",
    color: "#E2136E",
    number: "01991386659",
    type: "পার্সোনাল",
  },
  {
    id: "nagad",
    label: "Nagad",
    color: "#F05829",
    number: "01991386659",
    type: "পার্সোনাল",
  },
  {
    id: "rocket",
    label: "Rocket",
    color: "#8B1FA9",
    number: "01311844364",
    type: "পার্সোনাল",
  },
]

// ── Component ──────────────────────────────────────────────────────────
export function ToolEnrollmentCard({
  toolId,
  price,
  discount = 0,
  variations = [],
}: ToolEnrollmentCardProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [isEnrolling, setIsEnrolling]               = useState(false)
  const [isEnrolled, setIsEnrolled]                 = useState(false)
  const [enrollmentStatus, setEnrollmentStatus]     = useState<string | null>(null)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(true)
  const [error, setError]                           = useState("")

  // Variation selection
  const [selectedVariation, setSelectedVariation]   = useState<ToolVariation | null>(
    variations.length > 0 ? variations[0] : null
  )

  // Coupon
  const [couponCode, setCouponCode]       = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [couponError, setCouponError]     = useState("")

  // Payment modal
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeTab, setActiveTab]               = useState<PaymentTab>("bkash")
  const [transactionId, setTransactionId]       = useState("")
  const [txError, setTxError]                   = useState("")
  const [submitSuccess, setSubmitSuccess]       = useState(false)

  const isAuthenticated = status === "authenticated"
  const accessToken     = session?.accessToken as string

  // ── Check enrollment on mount ────────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      if (isAuthenticated && accessToken) {
        try {
          const result = await checkToolEnrollment(toolId, accessToken)
          setIsEnrolled(result.isEnrolled)
          setEnrollmentStatus(result.paymentStatus || null)
        } catch {
          setIsEnrolled(false)
        } finally {
          setIsCheckingEnrollment(false)
        }
      } else {
        setIsCheckingEnrollment(false)
      }
    }
    check()
  }, [isAuthenticated, accessToken, toolId])

  // ── Price calculation ────────────────────────────────────────────────
  const basePrice = selectedVariation ? selectedVariation.price : price
  let finalPrice  = basePrice
  if (!selectedVariation && discount > 0) finalPrice = basePrice * (1 - discount / 100)
  if (appliedCoupon?.discountValue) finalPrice = finalPrice * (1 - appliedCoupon.discountValue / 100)
  finalPrice = Math.round(finalPrice * 100) / 100

  // ── Coupon handlers ──────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return }
    setIsValidatingCoupon(true); setCouponError("")
    try {
      const result = await validateToolCoupon(toolId, couponCode.trim())
      const coupon = result.data || result.coupon || result
      if (!coupon) throw new Error("Invalid coupon")
      setAppliedCoupon({ ...coupon, code: couponCode.trim() })
    } catch (err) {
      setCouponError((err as Error).message || "Invalid coupon code")
      setAppliedCoupon(null)
    } finally {
      setIsValidatingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null); setCouponCode(""); setCouponError("")
  }

  // ── Main enroll handler ──────────────────────────────────────────────
  // NOTE: Expired/previously enrolled users can re-enroll freely.
  // We only block if status is "pending" (awaiting review).
  const handleEnroll = async () => {
    if (isEnrolling) return

    // If active paid enrollment → go to dashboard
    if (isEnrolled && enrollmentStatus === "paid") {
      router.push("/dashboard")
      return
    }

    if (!isAuthenticated) {
      router.push(`/signin?callbackUrl=/tools/${toolId}`)
      return
    }

    if (!accessToken) { setError("Please sign in to enroll"); return }

    if (finalPrice <= 0) {
      setIsEnrolling(true); setError("")
      try {
        await enrollInTool(toolId, accessToken, appliedCoupon?.code, undefined, selectedVariation?.label, selectedVariation?.days)
        router.push("/dashboard")
      } catch (err) {
        setError((err as Error).message || "Failed to enroll")
        setIsEnrolling(false)
      }
      return
    }

    // Open payment modal (for new, expired, or rejected users)
    setShowPaymentModal(true)
  }

  // ── Payment submit ───────────────────────────────────────────────────
  const handlePaymentSubmit = async () => {
    if (!transactionId.trim()) { setTxError("Transaction ID বা মোবাইল নম্বর দিন"); return }
    setIsEnrolling(true); setTxError("")
    try {
      await enrollInTool(
        toolId,
        accessToken,
        appliedCoupon?.code,
        transactionId.trim(),
        selectedVariation?.label,
        selectedVariation?.days,
        activeTab
      )
      setSubmitSuccess(true)
    } catch (err) {
      setTxError((err as Error).message || "Payment submission failed")
      setIsEnrolling(false)
    }
  }

  const closeModal = () => {
    setShowPaymentModal(false); setSubmitSuccess(false)
    setTransactionId(""); setTxError("")
  }

  // ── Button label ─────────────────────────────────────────────────────
  const buttonLabel = () => {
    if (isCheckingEnrollment)                         return "Checking..."
    if (isEnrolling)                                  return "Submitting..."
    if (isEnrolled && enrollmentStatus === "paid")    return "Go to Dashboard"
    if (isEnrolled && enrollmentStatus === "pending") return "Payment Pending..."
    // expired / rejected / never enrolled → allow purchase / renew
    if (isEnrolled && enrollmentStatus === "rejected") return "Renew / Re-enroll"
    if (isEnrolled) return "Renew Access"
    return finalPrice <= 0 ? "Get Free Access" : "Enroll Now"
  }

  const activeMethod = PAYMENT_METHODS.find((m) => m.id === activeTab)!

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <Card className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border-gray-800/50 sticky top-24 shadow-xl">
        <CardHeader>
          <div className="space-y-3">
            {(discount > 0 || appliedCoupon || selectedVariation) && (
              <div className="flex items-center gap-2 flex-wrap">
                {!selectedVariation && discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">৳{price}</span>
                    <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 px-2.5 py-1 rounded-lg">
                      {discount}% OFF
                    </span>
                  </>
                )}
                {appliedCoupon && (
                  <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1 rounded-lg">
                    Coupon: {appliedCoupon.discountValue}% OFF
                  </span>
                )}
              </div>
            )}
            <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {finalPrice <= 0 ? "Free" : `৳${finalPrice}`}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="error" className="bg-red-900/20 border-red-500/50 text-red-400">{error}</Alert>
          )}

          {isEnrolled && enrollmentStatus === "pending" && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-300">
              ⏳ আপনার পেমেন্ট রিভিউ করা হচ্ছে। ১০–১৫ মিনিটের মধ্যে একটিভ হবে।
            </div>
          )}
          {isEnrolled && enrollmentStatus === "rejected" && (
            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-sm text-red-300">
              ❌ পেমেন্ট ভেরিফাই হয়নি। আবার পেমেন্ট করুন অথবা সাপোর্টে যোগাযোগ করুন।
            </div>
          )}

          {/* Variation selector */}
          {variations.length > 0 && !(isEnrolled && enrollmentStatus === "paid") && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-300">Subscription Plan</p>
              <div className="grid grid-cols-1 gap-2">
                {variations.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariation(v)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedVariation?.label === v.label
                        ? "border-purple-500 bg-purple-500/10 text-white"
                        : "border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span className="font-medium">{v.label}</span>
                    <span className={selectedVariation?.label === v.label ? "text-purple-400 font-bold" : "text-gray-500"}>
                      ৳{v.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Coupon section */}
          {!(isEnrolled && enrollmentStatus === "paid") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <div className="w-6 h-6 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Tag className="h-3.5 w-3.5 text-pink-400" />
                </div>
                <span>Have a coupon code?</span>
              </div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">
                      &quot;{appliedCoupon.code}&quot; applied!
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} className="text-purple-300 hover:text-purple-200">
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
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode.trim()}
                      className="border-gray-700 text-gray-300"
                    >
                      {isValidatingCoupon ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                  {couponError && <p className="text-sm text-red-400">{couponError}</p>}
                </div>
              )}
            </div>
          )}

          {/* Enroll button */}
          <Button
            className={`w-full ${
              isEnrolled && enrollmentStatus === "paid"
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            } text-white border-0 shadow-lg transition-all duration-200`}
            size="lg"
            onClick={handleEnroll}
            disabled={
              isEnrolling ||
              isCheckingEnrollment ||
              enrollmentStatus === "pending"
              // NOTE: "rejected" and expired users are NOT disabled — they can re-enroll
            }
          >
            {buttonLabel()}
          </Button>

          <div className="space-y-2.5 text-sm text-gray-300">
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /><span>Instant access after approval</span></div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /><span>Access on mobile and desktop</span></div>
            <div className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-purple-400" /><span>Priority support included</span></div>
          </div>
        </CardContent>
      </Card>

      {/* ── Payment Modal ──────────────────────────────────────────────── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-pink-500 px-6 py-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">কীভাবে এনরোল করবেন?</h2>
                <p className="text-sm text-white/80">Complete your enrollment in 2 simple steps</p>
              </div>
              <button
                onClick={closeModal}
                className="ml-auto w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">পেমেন্ট সাবমিট হয়েছে!</h3>
                <p className="text-gray-400 text-sm">
                  আপনার এনরোল রিকোয়েস্ট সফল হলে, ১০–১৫ মিনিটের মধ্যে টুলটি ড্যাশবোর্ডে একটিভ হয়ে যাবে।
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={() => { closeModal(); router.push("/dashboard") }}
                >
                  ড্যাশবোর্ডে যান
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Instructions */}
                <div className="p-6 space-y-4">

                  {/* ── Payment method tabs ── */}
                  <div className="flex rounded-xl overflow-hidden border border-gray-700 bg-gray-800/40">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => { setActiveTab(method.id); setTransactionId(""); setTxError("") }}
                        className={`flex-1 py-2 text-sm font-semibold transition-all ${
                          activeTab === method.id
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                        style={
                          activeTab === method.id
                            ? { background: method.color }
                            : {}
                        }
                      >
                        {method.label}
                      </button>
                    ))}
                    {/* Binance tab — hidden for now, uncomment when ready */}
                    {/* <button className="flex-1 py-2 text-sm font-semibold text-gray-600 cursor-not-allowed" disabled>
                      Binance
                    </button> */}
                  </div>

                  {/* Send to number */}
                  <div className="p-3 bg-gray-800/60 rounded-xl text-sm text-gray-300">
                    টুলের ফি{" "}
                    <span className="font-bold" style={{ color: activeMethod.color }}>
                      {activeMethod.label}
                    </span>{" "}
                    একাউন্টে পাঠান:{" "}
                    <span className="font-bold" style={{ color: activeMethod.color }}>
                      {activeMethod.number}
                    </span>{" "}
                    <span className="text-gray-500">({activeMethod.type})</span>
                  </div>

                  <div className="p-4 bg-gray-800/40 rounded-xl space-y-3 text-sm text-gray-300">
                    <div className="flex gap-3">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 font-bold"
                        style={{ background: activeMethod.color }}
                      >1</span>
                      <p>ফি পাঠানোর পর, নিচের ফর্মে <strong className="text-white">Transaction ID</strong> অথবা মোবাইল নম্বর দিন এবং Confirm বাটনে ক্লিক করুন।</p>
                    </div>
                    <div className="flex gap-3">
                      <span
                        className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 font-bold"
                        style={{ background: activeMethod.color }}
                      >2</span>
                      <p>আপনার এনরোল রিকোয়েস্ট সফল হলে, ১০–১৫ মিনিটের মধ্যে টুলটি ড্যাশবোর্ডে একটিভ হয়ে যাবে।</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/40 rounded-xl text-sm space-y-1">
                    <div className="flex items-center gap-2 text-gray-300 font-medium mb-2">
                      <MessageSquare className="h-4 w-4 text-pink-400" />
                      সহায়তার জন্য যোগাযোগ করুন:
                    </div>
                    <p className="text-gray-400">Facebook: <span className="text-pink-400">@SkillEduStore</span></p>
                    <p className="text-gray-400">WhatsApp: <span className="text-pink-400">+8801311844364</span></p>
                  </div>

                  <div className="text-sm text-gray-400">
                    পরিশোধযোগ্য পরিমাণ:{" "}
                    <span className="text-white font-bold text-base">৳{finalPrice}</span>
                    {selectedVariation && (
                      <span className="text-gray-500 text-xs ml-2">({selectedVariation.label})</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">
                      Transaction ID / Mobile Number
                    </label>
                    <Input
                      placeholder="Enter Transaction ID"
                      value={transactionId}
                      onChange={(e) => { setTransactionId(e.target.value); setTxError("") }}
                      className="bg-gray-800/60 border-gray-700 text-white placeholder:text-gray-500"
                      style={{ ["--tw-ring-color" as any]: activeMethod.color }}
                      disabled={isEnrolling}
                    />
                    {txError && <p className="text-sm text-red-400">{txError}</p>}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={closeModal}
                      disabled={isEnrolling}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 text-white border-0"
                      style={{
                        background: `linear-gradient(to right, ${activeMethod.color}, #9333ea)`,
                      }}
                      onClick={handlePaymentSubmit}
                      disabled={isEnrolling || !transactionId.trim()}
                    >
                      {isEnrolling ? "Submitting..." : "Confirm Purchase"}
                    </Button>
                  </div>
                </div>

                {/* Right: QR */}
                <div className="hidden md:flex items-center justify-center p-6 bg-white rounded-r-2xl">
                  <div className="text-center space-y-3">
                    <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mx-auto border-2 border-dashed border-gray-300">
                      <div className="text-center text-gray-400 text-xs px-4">
                        <p className="font-medium">{activeMethod.label} QR Code</p>
                        <p className="mt-1">এখানে আপনার {activeMethod.label} QR ইমেজ দিন</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm font-medium">
                      সেন্ড মানি করতে {activeMethod.label} অ্যাপ দিয়ে QR কোডটি স্ক্যান করুন
                    </p>
                    <p className="text-gray-800 font-bold" style={{ color: activeMethod.color }}>
                      {activeMethod.number}
                    </p>
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