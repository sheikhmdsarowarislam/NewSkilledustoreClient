"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, ExternalLink, Clock, AlertTriangle, ShoppingCart, ArrowRight } from "lucide-react"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────────────
export interface DashboardToolItem {
  _id: string
  enrollmentId: string
  name: string
  thumbnail?: { url: string }
  accessLink: string
  price: number
  paymentStatus: "paid" | "free" | "pending" | "rejected" | "expired"
  validUntil: string | null
  amountPaid: number
}

interface DashboardToolsListProps {
  tools: DashboardToolItem[]
}

// ── Countdown Hook ─────────────────────────────────────────────────────
function useCountdown(validUntil: string | null) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number; hours: number; minutes: number; seconds: number; expired: boolean
  } | null>(null)

  useEffect(() => {
    if (!validUntil) return

    const calc = () => {
      const diff = new Date(validUntil).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true })
        return
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
        expired: false,
      })
    }

    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [validUntil])

  return timeLeft
}

// ── Single Tool Card ───────────────────────────────────────────────────
function ToolCard({ tool }: { tool: DashboardToolItem }) {
  const countdown  = useCountdown(tool.validUntil)
  const isExpired  = tool.paymentStatus === "expired" || countdown?.expired
  const isPending  = tool.paymentStatus === "pending"
  const isRejected = tool.paymentStatus === "rejected"
  const hasAccess  = (tool.paymentStatus === "paid" || tool.paymentStatus === "free") && !isExpired

  // Warning: less than 3 days left
  const isWarning = countdown && !countdown.expired && countdown.days < 3

  // Detect if accessLink is an HTML button or a plain URL
  const isHtmlButton = tool.accessLink?.trim().startsWith("<")

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 border border-purple-900/30 rounded-xl bg-[#120822]/40 hover:bg-[#180e2e]/60 hover:border-fuchsia-500/40 transition-all duration-300 group shadow-lg shadow-purple-950/20">

      {/* Left: Thumbnail + Info */}
      <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full mb-4 sm:mb-0">
        {/* Thumbnail */}
        <div className="h-16 w-20 sm:h-20 sm:w-28 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 rounded-xl flex-shrink-0 overflow-hidden relative border border-purple-500/30">
          {tool.thumbnail?.url ? (
            <Image
              src={tool.thumbnail.url}
              alt={tool.name}
              width={112} height={80}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#07040d]">
              <Wrench className="h-7 w-7 text-fuchsia-400/50" />
            </div>
          )}
          {/* Status overlay */}
          {isExpired && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm sm:text-base truncate group-hover:text-fuchsia-300 transition-colors">
            {tool.name}
          </h4>

          {/* Status badges */}
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            {isPending && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                ⏳ Payment Pending
              </span>
            )}
            {isRejected && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                ❌ Payment Rejected
              </span>
            )}
            {isExpired && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
                ⛔ Expired
              </span>
            )}
            {hasAccess && tool.validUntil && (
              <span className={`text-xs px-2 py-0.5 rounded-full border ${
                isWarning
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300"
              }`}>
                ✅ Active
              </span>
            )}
            {hasAccess && !tool.validUntil && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300">
                ✅ Lifetime Access
              </span>
            )}
          </div>

          {/* Countdown */}
          {hasAccess && tool.validUntil && countdown && !countdown.expired && (
            <div className={`mt-2 flex items-center gap-2 ${isWarning ? "text-amber-400" : "text-fuchsia-400"}`}>
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <div className="flex items-center gap-1 text-xs font-mono font-bold">
                <span className="bg-[#07040d] border border-purple-900/40 px-1.5 py-0.5 rounded text-purple-200">{String(countdown.days).padStart(2,"0")}d</span>
                <span>:</span>
                <span className="bg-[#07040d] border border-purple-900/40 px-1.5 py-0.5 rounded text-purple-200">{String(countdown.hours).padStart(2,"0")}h</span>
                <span>:</span>
                <span className="bg-[#07040d] border border-purple-900/40 px-1.5 py-0.5 rounded text-purple-200">{String(countdown.minutes).padStart(2,"0")}m</span>
                <span>:</span>
                <span className="bg-[#07040d] border border-purple-900/40 px-1.5 py-0.5 rounded text-purple-200">{String(countdown.seconds).padStart(2,"0")}s</span>
              </div>
              <span className="text-xs text-purple-300/50">remaining</span>
            </div>
          )}

          {/* Expired countdown done */}
          {tool.validUntil && (isExpired || countdown?.expired) && (
            <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Expired on {new Date(tool.validUntil).toLocaleDateString("en-BD")}
            </p>
          )}
        </div>
      </div>

      {/* Right: Action Button */}
      <div className="w-full sm:w-auto sm:ml-4 flex-shrink-0">
        {hasAccess ? (
          isHtmlButton ? (
            // ── HTML button code → render as raw HTML ──────────────────
            <div
              className="w-full sm:w-auto"
              dangerouslySetInnerHTML={{ __html: tool.accessLink }}
            />
          ) : (
            // ── Plain URL fallback → normal anchor button ──────────────
            <a href={tool.accessLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 transition-all duration-200 group/btn cursor-pointer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Access Now
              </Button>
            </a>
          )
        ) : isExpired || countdown?.expired ? (
          <Link href={`/tools/${tool._id}`}>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 hover:from-rose-500 hover:to-fuchsia-500 text-white border-0 shadow-lg shadow-rose-950/40 transition-all duration-200 group/btn cursor-pointer">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Again
            </Button>
          </Link>
        ) : isPending ? (
          <Button disabled className="w-full sm:w-auto bg-purple-950/40 text-purple-300/40 border border-purple-900/30 cursor-not-allowed">
            <Clock className="h-4 w-4 mr-2" />
            Pending...
          </Button>
        ) : isRejected ? (
          <Link href={`/tools/${tool._id}`}>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border-0 cursor-pointer">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────
export function DashboardToolsList({ tools }: DashboardToolsListProps) {
  if (tools.length === 0) {
    return (
      <Card className="relative overflow-hidden bg-[#120822]/50 border-purple-900/30 hover:border-fuchsia-500/30 transition-all duration-300 shadow-xl shadow-purple-950/30">
        <CardHeader className="relative z-10">
          <CardTitle className="text-white text-xl sm:text-2xl font-bold">Your Tools</CardTitle>
          <CardDescription className="text-purple-300/60">Access your subscribed tools</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 mb-6 shadow-lg shadow-purple-950/40">
              <Wrench className="h-10 w-10 text-fuchsia-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No tools yet</h3>
            <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto">
              Discover premium tools and supercharge your workflow
            </p>
            <Link href="/tools">
              <Button className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 transition-all duration-200 group cursor-pointer">
                Explore Tools
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const activeTools  = tools.filter(t => t.paymentStatus === "paid" || t.paymentStatus === "free")
  const expiredTools = tools.filter(t => t.paymentStatus === "expired")
  const pendingTools = tools.filter(t => t.paymentStatus === "pending" || t.paymentStatus === "rejected")

  return (
    <div className="space-y-6">
      {/* Active Tools */}
      {activeTools.length > 0 && (
        <Card className="relative overflow-hidden bg-[#120822]/50 border-purple-900/30 hover:border-fuchsia-500/40 transition-all duration-300 shadow-xl shadow-purple-950/30">
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl font-bold flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
                    <div className="w-full h-full bg-[#07040d] rounded-[7px] flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-fuchsia-400" />
                    </div>
                  </div>
                  My Tools
                </CardTitle>
                <CardDescription className="text-purple-300/60">Your active subscriptions</CardDescription>
              </div>
              <Badge className="bg-purple-500/10 text-fuchsia-300 border-purple-500/30 px-3 py-1.5 text-xs font-semibold">
                {activeTools.length} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            {activeTools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pending / Rejected */}
      {pendingTools.length > 0 && (
        <Card className="relative overflow-hidden bg-[#120822]/50 border-amber-500/30 shadow-xl shadow-amber-950/20">
          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Pending Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            {pendingTools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Expired */}
      {expiredTools.length > 0 && (
        <Card className="relative overflow-hidden bg-[#120822]/50 border-rose-500/30 shadow-xl shadow-rose-950/20">
          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-400" />
              Expired Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            {expiredTools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}