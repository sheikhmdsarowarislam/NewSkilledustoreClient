"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { GraduationCap, Clock, User, BookOpen, Wrench, Hash, RefreshCw } from "lucide-react"
import { ApproveWithValidity } from "@/components/ApproveWithValidity"

interface PendingEnrollment {
  _id: string
  itemType: "course" | "tool"
  transactionId?: string
  amountPaid: number
  createdAt: string
  student: { _id: string; name: string; email: string }
  course?: { _id: string; title: string; thumbnail?: string; price: number }
  tool?:   { _id: string; name: string;  thumbnail?: string; price: number }
}

export default function EnrollmentsPage() {
  const { data: session } = useSession()
  const accessToken = session?.accessToken as string

  const [enrollments, setEnrollments] = useState<PendingEnrollment[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")

  const fetchPending = async () => {
    setLoading(true); setError("")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/pending`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Failed to fetch")
      setEnrollments(data.data?.enrollments || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (accessToken) fetchPending() }, [accessToken])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-2">
            Enrollment Management
          </h1>
          <p className="text-gray-400">Pending bKash payments — courses & tools</p>
        </div>
        <button
          onClick={fetchPending}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700
            border border-gray-700 text-gray-300 rounded-lg text-sm transition-colors disabled:opacity-50"
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

      {/* Loading */}
      {loading && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <RefreshCw className="w-10 h-10 text-gray-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && enrollments.length === 0 && !error && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Pending Enrollments</h3>
          <p className="text-gray-400">All caught up!</p>
        </div>
      )}

      {/* List */}
      {!loading && enrollments.length > 0 && (
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/30
            text-yellow-400 text-sm rounded-full font-medium mb-2">
            {enrollments.length} pending
          </span>

          {enrollments.map((enrollment) => {
            const isTool   = enrollment.itemType === "tool"
            const title    = isTool ? enrollment.tool?.name    : enrollment.course?.title
            const thumb    = isTool ? enrollment.tool?.thumbnail : enrollment.course?.thumbnail

            return (
              <div
                key={enrollment._id}
                className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5
                  flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isTool
                        ? <Wrench className="h-6 w-6 text-gray-600" />
                        : <BookOpen className="h-6 w-6 text-gray-600" />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1.5">
                  {/* Type badge + title */}
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${isTool
                        ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                        : "bg-blue-500/10 border border-blue-500/30 text-blue-400"}`}>
                      {isTool ? "Tool" : "Course"}
                    </span>
                    <p className="text-white font-semibold text-sm">{title}</p>
                  </div>

                  {/* Student */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <User className="h-3.5 w-3.5" />
                    <span>{enrollment.student?.name}</span>
                    <span className="text-gray-600">•</span>
                    <span>{enrollment.student?.email}</span>
                  </div>

                  {/* TxID */}
                  {enrollment.transactionId && (
                    <div className="flex items-center gap-1.5 text-xs text-cyan-400">
                      <Hash className="h-3.5 w-3.5" />
                      <span>TxID: {enrollment.transactionId}</span>
                    </div>
                  )}

                  {/* Amount + Date */}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="text-green-400 font-semibold">৳{enrollment.amountPaid}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(enrollment.createdAt).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Approve / Reject */}
                <div className="flex-shrink-0">
                  <ApproveWithValidity
                    enrollmentId={enrollment._id}
                    accessToken={accessToken}
                    onSuccess={fetchPending}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}