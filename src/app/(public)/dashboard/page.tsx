import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DownloadExtensionButton } from "@/components/dashboard/DownloadExtensionButton"
import { getUserToolsServer } from "@/lib/server-api"
import { DashboardToolsList } from "@/components/dashboard/dashboard-tools-list"
import { ErrorBoundary } from "@/components/error-boundary"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Sparkles, TrendingUp, ArrowRight, Wrench, BookOpen, Download, Lock } from "lucide-react"
import { NoticeBoard } from "@/components/dashboard/NoticeBoard"
export const dynamic = "force-dynamic"
export const revalidate = 0

// ── Replace these with your actual values ─────────────────────────────
const TUTORIAL_LINK = "https://youtu.be/iAgG8P5i6MA"   // ← tutorial URL
const EXTENSION_ZIP = "https://skilledustore.shop/downloads/Skilledustoretoolz.zip"          // ← zip file path
// ──────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user)        redirect("/signin")
  if (session.error || !session.accessToken) redirect("/signin?error=session_expired")

  // Fetch tools to check if user has any active purchase
  const tools = await getUserToolsServer()
const hasPurchased = tools.some(tool => tool.paymentStatus === 'paid')

  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">

      {/* Welcome Section */}
      <div className="relative mb-8 sm:mb-10 lg:mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#150a28]/80 via-[#1a0d33]/60 to-[#0d0518]/80 border border-purple-500/20 p-5 sm:p-7 lg:p-9">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-fuchsia-500/20 to-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 p-0.5 shadow-lg shadow-fuchsia-500/20">
                    <div className="w-full h-full bg-[#0a0512] rounded-[9px] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-widest">User Portal</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-white mb-1.5 sm:mb-2.5">
                  Welcome back,{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {session.user.name}
                  </span>!
                </h1>
                <p className="text-purple-200/50 text-xs sm:text-sm lg:text-base max-w-2xl">
                  Access your premium tools and supercharge your workflow
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/tools">
                  <Button className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-sm font-medium border-0 rounded-xl shadow-lg shadow-fuchsia-950/40 hover:shadow-fuchsia-500/20 transition-all duration-200 group">
                    <Wrench className="mr-2 w-4 h-4" />
                    Browse Tools
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Access Section ──────────────────────────────────────── */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] font-bold text-fuchsia-400 uppercase tracking-widest">Quick Access</span>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent" />
          {!hasPurchased && (
            <span className="text-[10px] font-semibold text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Purchase a tool to unlock
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

          {/* Access Tutorial Button */}
          {hasPurchased ? (
            <a href={TUTORIAL_LINK} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#150a28]/80 via-[#170c2c]/50 to-[#0d0518]/80 border border-purple-800/30 hover:border-fuchsia-500/50 transition-all duration-300 p-4 sm:p-5 shadow-xl hover:shadow-fuchsia-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-4.5 h-4.5 text-fuchsia-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base tracking-tight leading-tight mb-0.5">
                      Access Tutorial
                    </h3>
                    <p className="text-purple-300/40 text-[11px] sm:text-xs truncate">
                      Step-by-step guide to get started
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-500/60 group-hover:text-fuchsia-400 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                </div>
              </div>
            </a>
          ) : (
            <div className="relative block cursor-not-allowed">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#120a20]/50 via-[#120a20]/30 to-[#0a0512]/50 border border-purple-900/20 p-4 sm:p-5 shadow-xl opacity-50 select-none">
                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-800/20 flex items-center justify-center shrink-0">
                    <Lock className="w-4.5 h-4.5 text-purple-500/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-purple-300/40 font-semibold text-sm sm:text-base tracking-tight leading-tight mb-0.5">
                      Access Tutorial
                    </h3>
                    <p className="text-purple-400/30 text-[11px] sm:text-xs truncate">
                      Purchase a tool to unlock
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-purple-700/50 shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* Download Extension Button */}
          {hasPurchased ? (
            <DownloadExtensionButton url={EXTENSION_ZIP} />
) : (
            <div className="relative block cursor-not-allowed">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#120a20]/50 via-[#120a20]/30 to-[#0a0512]/50 border border-purple-900/20 p-4 sm:p-5 shadow-xl opacity-50 select-none">
                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-950/40 border border-purple-800/20 flex items-center justify-center shrink-0">
                    <Lock className="w-4.5 h-4.5 text-purple-500/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-purple-300/40 font-semibold text-sm sm:text-base tracking-tight leading-tight mb-0.5">
                      Download Extension
                    </h3>
                    <p className="text-purple-400/30 text-[11px] sm:text-xs truncate">
                      Purchase a tool to unlock
                    </p>
                  </div>
                  <Lock className="w-4 h-4 text-purple-700/50 shrink-0" />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Notice Board */}
<div className="mb-8 sm:mb-10">
  <NoticeBoard/>
</div>

        {/* CTA when locked */}
        {!hasPurchased && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-[11px] text-purple-300/40">
              Get access to tutorials and the extension by purchasing any tool.
            </p>
            <Link href="/tools">
              <span className="text-[11px] font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition-colors underline underline-offset-2">
                Browse Tools →
              </span>
            </Link>
          </div>
        )}
      </div>
      {/* ── End Quick Access Section ─────────────────────────────────── */}

      {/* Tools Section */}
      <Suspense fallback={<DashboardToolsSkeleton />}>
        <ErrorBoundary>
          <DashboardToolsWrapper tools={tools} />
        </ErrorBoundary>
      </Suspense>

      {/* Explore More */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#150a28]/70 via-[#170c2c]/40 to-[#0a0512]/70 border-purple-800/30 hover:border-fuchsia-500/30 rounded-2xl transition-all duration-300 group shadow-2xl shadow-purple-950/30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-fuchsia-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div>
              <CardTitle className="text-white text-lg sm:text-xl font-bold tracking-tight mb-1.5">Explore More Tools</CardTitle>
              <CardDescription className="text-purple-300/50 text-sm">Discover premium tools to boost your productivity</CardDescription>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[11px] font-semibold text-fuchsia-400">Premium</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-7 sm:py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 mb-4 sm:mb-5 shadow-lg shadow-purple-950/40">
              <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-fuchsia-400" />
            </div>
            <p className="text-purple-200/50 mb-4 sm:mb-5 text-xs sm:text-sm max-w-md mx-auto px-4">
              Browse our collection of premium tools and find the perfect one for your needs
            </p>
            <Link href="/tools">
              <Button variant="outline" className="border-purple-500/30 bg-purple-500/10 text-sm text-fuchsia-300 hover:bg-purple-500/20 hover:text-fuchsia-200 rounded-xl transition-all duration-200 group/btn">
                Browse All Tools
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Server Component Wrappers ──────────────────────────────────────────

// Tools already fetched above — pass as prop to avoid double fetch
function DashboardToolsWrapper({ tools }: { tools: any[] }) {
  return (
    <div className="mb-8 sm:mb-10">
      <DashboardToolsList tools={tools} />
    </div>
  )
}

// ── Skeletons ──────────────────────────────────────────────────────────

function DashboardToolsSkeleton() {
  return (
    <div className="mb-8 sm:mb-10 animate-pulse">
      <div className="h-7 w-32 bg-purple-950/40 rounded-lg mb-4" />
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-24 bg-[#150a28]/40 border border-purple-900/30 rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export async function generateMetadata() {
  const session = await auth()
  return {
    title: `Dashboard - ${session?.user?.name || "Student"} | Tools Portal`,
    description: "Access your premium tools and manage your subscriptions.",
    robots: { index: false, follow: false },
  }
}