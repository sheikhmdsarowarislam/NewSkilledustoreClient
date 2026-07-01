"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"

import {
  GraduationCap,
  Clock,
  User,
  BookOpen,
  Wrench,
  Hash,
  RefreshCw,
  Search,
  UserPlus,
  ChevronDown,
} from "lucide-react"

import { ApproveWithValidity } from "@/components/ApproveWithValidity"

type PaymentStatus =
  | "pending"
  | "paid"
  | "free"
  | "rejected"
  | "canceled"
  | "expired"

interface Enrollment {
  _id: string
  itemType: "course" | "tool"
  transactionId?: string
  amountPaid: number
  createdAt: string
  paymentStatus: PaymentStatus
  validUntil?: string | null
  student: {
    _id: string
    name: string
    email: string
  }
  course?: {
    _id: string
    title: string
    thumbnail?: string
    price: number
  }
  tool?: {
    _id: string
    name: string
    thumbnail?: string
    price: number
  }
}

interface UserResult {
  _id: string
  name: string
  email: string
  role: string
  avatar?: { url: string }
}

interface ToolVariation {
  label: string
  days: number
  price: number
}

interface ToolResult {
  _id: string
  name: string
  price: number
  discount: number
  isPackage: boolean
  variations: ToolVariation[]
  thumbnail?: { public_id: string | null; url: string }
  status: string
}

const statusColor: Record<PaymentStatus, string> = {
  pending:  "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  paid:     "bg-green-500/10 border-green-500/30 text-green-400",
  free:     "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  rejected: "bg-red-500/10 border-red-500/30 text-red-400",
  canceled: "bg-gray-500/10 border-gray-500/30 text-gray-400",
  expired:  "bg-orange-500/10 border-orange-500/30 text-orange-400",
}

export default function EnrollmentsPage() {
  const { data: session } = useSession()
  const accessToken = (session as any)?.accessToken

  // ── Existing state ──
  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([])
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")

  // ── Manual Enrollment state ──
  const [manualUserSearch, setManualUserSearch] = useState("")
  const [manualUserResults, setManualUserResults] = useState<UserResult[]>([])
  const [latestUsers, setLatestUsers] = useState<UserResult[]>([])
  const [manualUserLoading, setManualUserLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)

  const [allTools, setAllTools] = useState<ToolResult[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)
  const [selectedTool, setSelectedTool] = useState<ToolResult | null>(null)
  const [selectedVariationDays, setSelectedVariationDays] = useState<number | null>(null)

  const [toolDropdownOpen, setToolDropdownOpen] = useState(false)
  const [validUntilDate, setValidUntilDate] = useState<string>("")
  const [manualEnrollLoading, setManualEnrollLoading] = useState(false)
  const [manualEnrollSuccess, setManualEnrollSuccess] = useState("")
  const [manualEnrollError, setManualEnrollError] = useState("")

  // ── Fetch enrollments (existing logic unchanged) ──
  const fetchEnrollments = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError("")
    try {
      const pendingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/pending`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const pendingData = await pendingRes.json()
      if (!pendingRes.ok) throw new Error(pendingData.message || "Failed")
      setPendingEnrollments(pendingData?.data?.enrollments || [])

      const allRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/all?page=${page}&limit=10&search=${search}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const allData = await allRes.json()
      if (!allRes.ok) throw new Error(allData.message || "Failed")
      setAllEnrollments(allData?.data?.enrollments || [])
      setTotalPages(allData?.data?.pages || 1)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, search])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  // ── Fetch all tools for manual enrollment ──
  useEffect(() => {
    if (!accessToken) return
    setToolsLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((r) => r.json())
      .then((data) => {
        // public endpoint থেকে published tools আসে directly array হিসেবে
        const raw = data?.data || []
        const tools: ToolResult[] = Array.isArray(raw) ? raw : []
        setAllTools(tools)
      })
      .catch(console.error)
      .finally(() => setToolsLoading(false))
  }, [accessToken])

  // ── Latest 5 users fetch on mount ──
  useEffect(() => {
    if (!accessToken) return
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/all?limit=5&page=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then((r) => r.json())
      .then((data) => setLatestUsers(data?.data?.users || []))
      .catch(console.error)
  }, [accessToken])

  // ── User search with debounce ──
  useEffect(() => {
    if (!manualUserSearch.trim() || !accessToken) {
      setManualUserResults([])
      return
    }
    setManualUserLoading(true)
    const timer = setTimeout(() => {
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/all?search=${encodeURIComponent(manualUserSearch)}&limit=5`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
        .then((r) => r.json())
        .then((data) => setManualUserResults(data?.data?.users || []))
        .catch(console.error)
        .finally(() => setManualUserLoading(false))
    }, 400)
    return () => clearTimeout(timer)
  }, [manualUserSearch, accessToken])

  // Tool select হলে variation + date reset
  const handleToolSelect = (tool: ToolResult) => {
    setSelectedTool(tool)
    setSelectedVariationDays(null)
    setValidUntilDate("")
    setToolDropdownOpen(false)
    setManualEnrollError("")
    setManualEnrollSuccess("")
  }

  // Price calculate
  const getDisplayPrice = (): number => {
    if (!selectedTool) return 0
    if (selectedVariationDays !== null && selectedTool.variations?.length > 0) {
      const v = selectedTool.variations.find((v) => v.days === selectedVariationDays)
      if (v) return v.price
    }
    const base = selectedTool.price
    if (selectedTool.discount > 0) {
      return Math.round((base - (base * selectedTool.discount) / 100) * 100) / 100
    }
    return base
  }

  // Variation select হলে date auto-calculate করো
  const handleVariationSelect = (days: number | null) => {
    setSelectedVariationDays(days)
    if (days !== null) {
      const d = new Date()
      d.setDate(d.getDate() + days)
      setValidUntilDate(d.toISOString().split("T")[0])
    } else {
      setValidUntilDate("")
    }
  }

  // ── Manual Enroll Submit ──
  const handleManualEnroll = async () => {
    if (!selectedUser || !selectedTool) {
      setManualEnrollError("User এবং Tool দুটোই select করতে হবে।")
      return
    }
    setManualEnrollLoading(true)
    setManualEnrollError("")
    setManualEnrollSuccess("")
    try {
      const body: any = {
        userId: selectedUser._id,
        toolId: selectedTool._id,
      }
      if (selectedVariationDays !== null) {
        body.variationDays = selectedVariationDays
      }
      // Custom date override — variationDays এর চেয়ে priority বেশি
      if (validUntilDate) {
        const diffMs = new Date(validUntilDate).getTime() - Date.now()
        const diffDays = Math.ceil(diffMs / 86_400_000)
        if (diffDays > 0) body.variationDays = diffDays
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/admin-enroll`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (!res.ok) {
        setManualEnrollError(data.message || "Enrollment failed.")
      } else {
        setManualEnrollSuccess(
          `✅ ${selectedUser.name} কে "${selectedTool.name}" এ সফলভাবে enroll করা হয়েছে!`
        )
        setSelectedUser(null)
        setSelectedTool(null)
        setSelectedVariationDays(null)
        setValidUntilDate("")
        setManualUserSearch("")
        setManualUserResults([])
        // Refresh enrollment list
        fetchEnrollments()
      }
    } catch (err: any) {
      setManualEnrollError(err.message || "Something went wrong.")
    } finally {
      setManualEnrollLoading(false)
    }
  }

  // ── Cancel (existing) ──
  const handleCancel = async (id: string) => {
    const confirmed = confirm("Are you sure you want to cancel this enrollment?")
    if (!confirmed) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/${id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed")
      fetchEnrollments()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
            Enrollment Management
          </h1>
          <p className="text-gray-400">Manage all enrollments</p>
        </div>
        <button
          onClick={fetchEnrollments}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700
          border border-gray-700 text-gray-300 rounded-lg text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ════════════════════════════════════════════
          MANUAL ENROLLMENT SECTION (নতুন)
      ════════════════════════════════════════════ */}
      <div className="mb-12 bg-gray-900/60 border border-gray-800/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <UserPlus className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Manual Enrollment</h2>
            <p className="text-sm text-gray-400">User search করে tool select করে directly enroll করো</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Step 1: User Search ── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Step 1 — User খোঁজো
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="নাম বা ইমেইল দিয়ে search করো..."
                value={manualUserSearch}
                onChange={(e) => {
                  setManualUserSearch(e.target.value)
                  setSelectedUser(null)
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700
                text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            {/* Search results / Latest users */}
            {manualUserLoading && (
              <p className="text-xs text-gray-500 mt-2 pl-1">খুঁজছি...</p>
            )}
            {!manualUserLoading && !selectedUser && (
              <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                {(manualUserSearch.trim() ? manualUserResults : latestUsers).length === 0 ? null : (
                  <>
                    {!manualUserSearch.trim() && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-700">
                        সর্বশেষ ৫ জন registered user
                      </div>
                    )}
                    {(manualUserSearch.trim() ? manualUserResults : latestUsers).map((u) => (
                      <button
                        key={u._id}
                        onClick={() => {
                          setSelectedUser(u)
                          setManualUserSearch(u.email)
                          setManualUserResults([])
                          setManualEnrollError("")
                          setManualEnrollSuccess("")
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-700
                        text-left border-b border-gray-700 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white font-semibold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{u.name}</p>
                          <p className="text-gray-400 text-xs truncate">{u.email}</p>
                        </div>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400 flex-shrink-0">
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Selected user badge */}
            {selectedUser && (
              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm text-white font-semibold flex-shrink-0">
                  {selectedUser.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">{selectedUser.name}</p>
                  <p className="text-cyan-400 text-xs">{selectedUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null)
                    setManualUserSearch("")
                  }}
                  className="ml-auto text-gray-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* ── Step 2: Tool Select ── */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Step 2 — Tool / Package select করো
            </label>

            {toolsLoading ? (
              <p className="text-xs text-gray-500">Tools লোড হচ্ছে...</p>
            ) : (
              <div className="relative">
                {/* Custom dropdown trigger */}
                <button
                  type="button"
                  onClick={() => setToolDropdownOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg
                  bg-gray-800 border border-gray-700 text-sm focus:outline-none
                  focus:border-cyan-500 hover:border-gray-600"
                >
                  <span className={selectedTool ? "text-white" : "text-gray-500"}>
                    {selectedTool ? selectedTool.name : "-- Tool বা Package বেছে নাও --"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${toolDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown list */}
                {toolDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700
                  rounded-lg shadow-xl overflow-hidden max-h-72 overflow-y-auto">

                    {/* Packages section */}
                    {allTools.filter((t) => t.isPackage).length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs text-purple-400 font-semibold bg-gray-900/60 border-b border-gray-700">
                          📦 Packages
                        </div>
                        {allTools.filter((t) => t.isPackage).map((t) => (
                          <button
                            key={t._id}
                            type="button"
                            onClick={() => handleToolSelect(t)}
                            className={`w-full flex items-center justify-between px-4 py-3
                            hover:bg-gray-700 text-left border-b border-gray-700/50 last:border-0
                            ${selectedTool?._id === t._id ? "bg-purple-500/10" : ""}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {t.thumbnail?.url && typeof t.thumbnail.url === "string" ? (
                                <img src={t.thumbnail.url} className="w-8 h-6 rounded object-cover flex-shrink-0" alt="" />
                              ) : (
                                <div className="w-8 h-6 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="w-3 h-3 text-gray-500" />
                                </div>
                              )}
                              <span className="text-white text-sm truncate">{t.name}</span>
                            </div>
                            <span className="text-green-400 text-xs font-medium ml-2 flex-shrink-0">৳{t.price}</span>
                          </button>
                        ))}
                      </>
                    )}

                    {/* Single Tools section */}
                    {allTools.filter((t) => !t.isPackage).length > 0 && (
                      <>
                        <div className="px-4 py-2 text-xs text-cyan-400 font-semibold bg-gray-900/60 border-b border-gray-700">
                          🔧 Single Tools
                        </div>
                        {allTools.filter((t) => !t.isPackage).map((t) => (
                          <button
                            key={t._id}
                            type="button"
                            onClick={() => handleToolSelect(t)}
                            className={`w-full flex items-center justify-between px-4 py-3
                            hover:bg-gray-700 text-left border-b border-gray-700/50 last:border-0
                            ${selectedTool?._id === t._id ? "bg-cyan-500/10" : ""}`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {t.thumbnail?.url && typeof t.thumbnail.url === "string" ? (
                                <img src={t.thumbnail.url} className="w-8 h-6 rounded object-cover flex-shrink-0" alt="" />
                              ) : (
                                <div className="w-8 h-6 rounded bg-gray-700 flex items-center justify-center flex-shrink-0">
                                  <Wrench className="w-3 h-3 text-gray-500" />
                                </div>
                              )}
                              <span className="text-white text-sm truncate">{t.name}</span>
                            </div>
                            <span className="text-green-400 text-xs font-medium ml-2 flex-shrink-0">৳{t.price}</span>
                          </button>
                        ))}
                      </>
                    )}

                    {allTools.length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        কোনো tool পাওয়া যায়নি
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Variation buttons */}
            {selectedTool && selectedTool.variations?.length > 0 && (
              <div className="mt-3">
                <label className="block text-xs text-gray-400 mb-1.5">Validity / Plan</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleVariationSelect(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      selectedVariationDays === null
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    Default (৳{selectedTool.discount > 0
                      ? Math.round((selectedTool.price - (selectedTool.price * selectedTool.discount) / 100) * 100) / 100
                      : selectedTool.price})
                  </button>
                  {selectedTool.variations.map((v) => (
                    <button
                      key={v.days}
                      type="button"
                      onClick={() => handleVariationSelect(v.days)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                        selectedVariationDays === v.days
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-300"
                          : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                      }`}
                    >
                      {v.label} — ৳{v.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date picker — সবসময় দেখাবে tool select হলে */}
            {selectedTool && (
              <div className="mt-3">
                <label className="block text-xs text-gray-400 mb-1.5">
                  Valid Until (Date) — খালি রাখলে Lifetime
                </label>
                <input
                  type="date"
                  value={validUntilDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setValidUntilDate(e.target.value)
                    setSelectedVariationDays(null)
                  }}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700
                  text-white focus:outline-none focus:border-cyan-500 text-sm
                  [color-scheme:dark]"
                />
              </div>
            )}

            {/* Selected summary */}
            {selectedTool && (
              <div className="mt-3 px-4 py-3 bg-gray-800/80 rounded-lg border border-gray-700 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Tool:</span>
                  <span className="text-white font-medium">{selectedTool.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-green-400 font-semibold">৳{getDisplayPrice()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Validity:</span>
                  <span className="text-cyan-400">
                    {validUntilDate
                      ? new Date(validUntilDate).toLocaleDateString("en-BD")
                      : selectedVariationDays
                      ? selectedTool.variations.find((v) => v.days === selectedVariationDays)?.label
                      : "Lifetime"}
                  </span>
                </div>
                {selectedTool.isPackage && (
                  <p className="text-xs text-purple-400 pt-1">📦 Package — included tools ও automatically enroll হবে</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Feedback messages ── */}
        {manualEnrollError && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {manualEnrollError}
          </div>
        )}
        {manualEnrollSuccess && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
            {manualEnrollSuccess}
          </div>
        )}

        {/* ── Enroll Button ── */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleManualEnroll}
            disabled={!selectedUser || !selectedTool || manualEnrollLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500
            disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium
            transition-colors"
          >
            {manualEnrollLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {manualEnrollLoading ? "Enrolling..." : "Enroll করো"}
          </button>
          {(selectedUser || selectedTool) && (
            <button
              onClick={() => {
                setSelectedUser(null)
                setSelectedTool(null)
                setSelectedVariationDays(null)
                setValidUntilDate("")
                setToolDropdownOpen(false)
                setManualUserSearch("")
                setManualUserResults([])
                setManualEnrollError("")
                setManualEnrollSuccess("")
              }}
              className="text-sm text-gray-500 hover:text-gray-300"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      {/* ════════════════════════════════════════════
          END MANUAL ENROLLMENT SECTION
      ════════════════════════════════════════════ */}

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <RefreshCw className="w-10 h-10 text-gray-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && pendingEnrollments.length === 0 && allEnrollments.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Enrollments Found</h3>
          <p className="text-gray-400">Everything is empty right now.</p>
        </div>
      )}

      {/* Pending Enrollments — existing, unchanged */}
      {!loading && pendingEnrollments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">Pending Enrollments</h2>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
              {pendingEnrollments.length}
            </span>
          </div>

          {pendingEnrollments.map((enrollment) => {
            const isTool = enrollment.itemType === "tool"
            const title = isTool ? enrollment.tool?.name : enrollment.course?.title
            const thumb = isTool ? enrollment.tool?.thumbnail : enrollment.course?.thumbnail

            return (
              <div
                key={enrollment._id}
                className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5
                flex flex-col lg:flex-row gap-4 lg:items-center"
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  {thumb ? (
                    <img src={thumb} alt={title || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isTool ? <Wrench className="w-6 h-6 text-gray-600" /> : <BookOpen className="w-6 h-6 text-gray-600" />}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full border ${isTool ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-blue-500/10 border-blue-500/30 text-blue-400"}`}>
                      {isTool ? "Tool" : "Course"}
                    </span>
                    <h3 className="text-white font-semibold">{title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{enrollment.student?.name}</span>
                    <span>•</span>
                    <span>{enrollment.student?.email}</span>
                  </div>
                  {enrollment.transactionId && (
                    <div className="flex items-center gap-2 text-cyan-400 text-xs">
                      <Hash className="w-3 h-3" />
                      <span>{enrollment.transactionId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-400 font-semibold">৳{enrollment.amountPaid}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(enrollment.createdAt).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                <ApproveWithValidity
                  enrollmentId={enrollment._id}
                  accessToken={accessToken}
                  onSuccess={fetchEnrollments}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* All Enrollments — existing, unchanged */}
      {!loading && allEnrollments.length > 0 && (
        <div className="mt-14">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">All Enrollments</h2>
            <p className="text-sm text-gray-400 mt-1">Courses + tools + validity</p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => { setPage(1); setSearch(e.target.value) }}
                className="w-full md:w-80 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700
                text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {allEnrollments.map((enrollment) => {
              const isTool = enrollment.itemType === "tool"
              const title = isTool ? enrollment.tool?.name : enrollment.course?.title
              const thumb = isTool ? enrollment.tool?.thumbnail : enrollment.course?.thumbnail

              return (
                <div
                  key={enrollment._id}
                  className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5
                  flex flex-col lg:flex-row gap-4 lg:items-center"
                >
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {thumb ? (
                      <img src={thumb} alt={title || ""} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isTool ? <Wrench className="w-6 h-6 text-gray-600" /> : <BookOpen className="w-6 h-6 text-gray-600" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${isTool ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-blue-500/10 border-blue-500/30 text-blue-400"}`}>
                        {isTool ? "Tool" : "Course"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${statusColor[enrollment.paymentStatus]}`}>
                        {enrollment.paymentStatus}
                      </span>
                      <h3 className="text-white font-semibold">{title}</h3>
                    </div>
                    <div className="text-sm text-gray-400">
                      {enrollment.student?.name} • {enrollment.student?.email}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="text-green-400 font-semibold">৳{enrollment.amountPaid}</span>
                      <span>Purchased: {new Date(enrollment.createdAt).toLocaleDateString("en-BD")}</span>
                      <span>Valid Until: {enrollment.validUntil ? new Date(enrollment.validUntil).toLocaleDateString("en-BD") : "Lifetime"}</span>
                    </div>
                    {enrollment.transactionId && (
                      <div className="text-xs text-cyan-400">TxID: {enrollment.transactionId}</div>
                    )}
                  </div>

                  {!["canceled", "rejected"].includes(enrollment.paymentStatus) && (
                    <button
                      onClick={() => handleCancel(enrollment._id)}
                      className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 disabled:opacity-40"
            >
              Previous
            </button>
            <div className="text-sm text-gray-400">Page {page} of {totalPages}</div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}