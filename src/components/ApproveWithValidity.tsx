"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronDown, XCircle } from "lucide-react"

// ── Validity options 1 day → 5 years ─────────────────────────────────
const VALIDITY_OPTIONS = [
  { label: "Lifetime (No Expiry)", days: 0 },
  { label: "1 Day",    days: 1 },
  { label: "3 Days",   days: 3 },
  { label: "7 Days",   days: 7 },
  { label: "1 Month",  days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year",   days: 365 },
  { label: "2 Years",  days: 730 },
  { label: "3 Years",  days: 1095 },
  { label: "5 Years",  days: 1825 },
]

interface Props {
  enrollmentId: string
  accessToken: string
  onSuccess: () => void // call this to refetch the pending list after approve/reject
}

/**
 * Drop this anywhere you render a pending enrollment row.
 *
 * Example:
 *   <ApproveWithValidity
 *     enrollmentId={enrollment._id}
 *     accessToken={accessToken}
 *     onSuccess={refetchPendingList}
 *   />
 */
export function ApproveWithValidity({ enrollmentId, accessToken, onSuccess }: Props) {
  const [selectedDays, setSelectedDays] = useState(0) // 0 = lifetime
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [error, setError] = useState("")

  const selectedOption = VALIDITY_OPTIONS.find((o) => o.days === selectedDays)!

  // ── Approve ───────────────────────────────────────────────────────
  const handleApprove = async () => {
    setApproving(true)
    setError("")
    try {
      const body: Record<string, any> = {}
      if (selectedDays > 0) body.validityDays = selectedDays

      const res = await fetch(
       `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/${enrollmentId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Approval failed")
      onSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setApproving(false)
    }
  }

  // ── Reject ────────────────────────────────────────────────────────
  const handleReject = async () => {
    const reason = window.prompt("Rejection reason (optional):") ?? undefined
    setRejecting(true)
    setError("")
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/enrollment/${enrollmentId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reason }),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Rejection failed")
      onSuccess()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setRejecting(false)
    }
  }

  const busy = approving || rejecting

  return (
    <div className="flex flex-col gap-1">
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2 flex-wrap">

        {/* ── Validity Dropdown ───────────────────────────────────── */}
        <div className="relative">
          <button
            type="button"
            disabled={busy}
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
              bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200
              rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {selectedOption.label}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <>
              {/* backdrop to close on outside click */}
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />

              <div className="absolute left-0 mt-1 z-20 w-44 bg-gray-900 border border-gray-700
                rounded-xl shadow-xl overflow-hidden py-1">
                {VALIDITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => { setSelectedDays(opt.days); setDropdownOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-gray-800
                      ${selectedDays === opt.days ? "text-cyan-400 font-semibold bg-gray-800/60" : "text-gray-300"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── Approve Button ──────────────────────────────────────── */}
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={busy}
          className="bg-green-600 hover:bg-green-700 text-white border-0 text-xs px-3 h-7 gap-1"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          {approving ? "Approving..." : "Approve"}
        </Button>

        {/* ── Reject Button ───────────────────────────────────────── */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleReject}
          disabled={busy}
          className="border-red-800 text-red-400 hover:bg-red-900/20 text-xs px-3 h-7 gap-1"
        >
          <XCircle className="h-3.5 w-3.5" />
          {rejecting ? "Rejecting..." : "Reject"}
        </Button>

      </div>
    </div>
  )
}