
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import {
  GraduationCap,
  Clock,
  User,
  BookOpen,
  Wrench,
  Hash,
  RefreshCw,
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

const statusColor: Record<PaymentStatus, string> = {
  pending:
    "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",

  paid:
    "bg-green-500/10 border-green-500/30 text-green-400",

  free:
    "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",

  rejected:
    "bg-red-500/10 border-red-500/30 text-red-400",

  canceled:
    "bg-gray-500/10 border-gray-500/30 text-gray-400",

  expired:
    "bg-orange-500/10 border-orange-500/30 text-orange-400",
}

export default function EnrollmentsPage() {
  const { data: session } = useSession()

  const accessToken = (session as any)?.accessToken

  const [pendingEnrollments, setPendingEnrollments] = useState<Enrollment[]>([])
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  const [page, setPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState("")

  const fetchEnrollments = async () => {
    if (!accessToken) return

    setLoading(true)

    setError("")

    try {
      // Pending
      const pendingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/pending`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const pendingData = await pendingRes.json()

      if (!pendingRes.ok) {
        throw new Error(pendingData.message || "Failed")
      }

      setPendingEnrollments(
        pendingData?.data?.enrollments || []
      )

      // All enrollments with pagination + search
      const allRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/all?page=${page}&limit=10&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const allData = await allRes.json()

      if (!allRes.ok) {
        throw new Error(allData.message || "Failed")
      }

      setAllEnrollments(
        allData?.data?.enrollments || []
      )

      setTotalPages(
        allData?.data?.pages || 1
      )
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnrollments()
  }, [accessToken, page, search])

  const handleCancel = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to cancel this enrollment?"
    )

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

      if (!res.ok) {
        throw new Error(data.message || "Failed")
      }

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

          <p className="text-gray-400">
            Manage all enrollments
          </p>
        </div>

        <button
          onClick={fetchEnrollments}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700
          border border-gray-700 text-gray-300 rounded-lg text-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />

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

          <p className="text-gray-400">
            Loading...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        pendingEnrollments.length === 0 &&
        allEnrollments.length === 0 && (
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />

            <h3 className="text-xl font-semibold text-white mb-2">
              No Enrollments Found
            </h3>

            <p className="text-gray-400">
              Everything is empty right now.
            </p>
          </div>
        )}

      {/* Pending Enrollments */}
      {!loading && pendingEnrollments.length > 0 && (
        <div className="space-y-4">

          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">
              Pending Enrollments
            </h2>

            <span className="px-3 py-1 rounded-full text-sm bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
              {pendingEnrollments.length}
            </span>
          </div>

          {pendingEnrollments.map((enrollment) => {
            const isTool =
              enrollment.itemType === "tool"

            const title = isTool
              ? enrollment.tool?.name
              : enrollment.course?.title

            const thumb = isTool
              ? enrollment.tool?.thumbnail
              : enrollment.course?.thumbnail

            return (
              <div
                key={enrollment._id}
                className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5
                flex flex-col lg:flex-row gap-4 lg:items-center"
              >
                {/* Thumbnail */}
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={title || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {isTool ? (
                        <Wrench className="w-6 h-6 text-gray-600" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border
                      ${
                        isTool
                          ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      }`}
                    >
                      {isTool ? "Tool" : "Course"}
                    </span>

                    <h3 className="text-white font-semibold">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4" />

                    <span>
                      {enrollment.student?.name}
                    </span>

                    <span>•</span>

                    <span>
                      {enrollment.student?.email}
                    </span>
                  </div>

                  {enrollment.transactionId && (
                    <div className="flex items-center gap-2 text-cyan-400 text-xs">
                      <Hash className="w-3 h-3" />

                      <span>
                        {enrollment.transactionId}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-400 font-semibold">
                      ৳{enrollment.amountPaid}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />

                      {new Date(
                        enrollment.createdAt
                      ).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                {/* Action */}
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

      {/* All Enrollments */}
      {!loading && allEnrollments.length > 0 && (
        <div className="mt-14">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">
              All Enrollments
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Courses + tools + validity
            </p>

            {/* Search */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => {
                  setPage(1)
                  setSearch(e.target.value)
                }}
                className="w-full md:w-80 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700
                text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-4">

            {allEnrollments.map((enrollment) => {
              const isTool =
                enrollment.itemType === "tool"

              const title = isTool
                ? enrollment.tool?.name
                : enrollment.course?.title

              const thumb = isTool
                ? enrollment.tool?.thumbnail
                : enrollment.course?.thumbnail

              return (
                <div
                  key={enrollment._id}
                  className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5
                  flex flex-col lg:flex-row gap-4 lg:items-center"
                >

                  {/* Thumbnail */}
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={title || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isTool ? (
                          <Wrench className="w-6 h-6 text-gray-600" />
                        ) : (
                          <BookOpen className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">

                    <div className="flex flex-wrap items-center gap-2">

                      <span
                        className={`text-xs px-2 py-1 rounded-full border
                        ${
                          isTool
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        }`}
                      >
                        {isTool ? "Tool" : "Course"}
                      </span>

                      <span
                        className={`text-xs px-2 py-1 rounded-full border
                        ${statusColor[enrollment.paymentStatus]}`}
                      >
                        {enrollment.paymentStatus}
                      </span>

                      <h3 className="text-white font-semibold">
                        {title}
                      </h3>
                    </div>

                    <div className="text-sm text-gray-400">
                      {enrollment.student?.name}
                      {" • "}
                      {enrollment.student?.email}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">

                      <span className="text-green-400 font-semibold">
                        ৳{enrollment.amountPaid}
                      </span>

                      <span>
                        Purchased:
                        {" "}
                        {new Date(
                          enrollment.createdAt
                        ).toLocaleDateString("en-BD")}
                      </span>

                      <span>
                        Valid Until:
                        {" "}
                        {enrollment.validUntil
                          ? new Date(
                              enrollment.validUntil
                            ).toLocaleDateString("en-BD")
                          : "Lifetime"}
                      </span>
                    </div>

                    {enrollment.transactionId && (
                      <div className="text-xs text-cyan-400">
                        TxID:
                        {" "}
                        {enrollment.transactionId}
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {!["canceled", "rejected"].includes(
                    enrollment.paymentStatus
                  ) && (
                    <button
                      onClick={() =>
                        handleCancel(enrollment._id)
                      }
                      className="px-4 py-2 rounded-lg bg-red-500/10 border
                      border-red-500/30 text-red-400 hover:bg-red-500/20"
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
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700
              text-gray-300 disabled:opacity-40"
            >
              Previous
            </button>

            <div className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700
              text-gray-300 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
