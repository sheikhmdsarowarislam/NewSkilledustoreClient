import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Search, Wrench, TrendingUp, AlertCircle, Zap } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { CoursesGridSkeleton } from "@/components/ui/skeleton"
import { ToolCard } from "@/components/tool/tool-card"

export const dynamic = "force-dynamic"
export const dynamicParams = true

// ── Types ─────────────────────────────────────────────────────────────
export interface ToolVariation {
  label: string
  days: number
  price: number
}

export interface Tool {
  _id: string
  name: string
  shortDescription: string
  thumbnail?: { public_id: string | null; url: string }
  accessLink: string
  price: number
  discount: number
  variations: ToolVariation[]
  status: "draft" | "published" | "archived"
  enrollmentCount: number
  createdAt: string
}

// ── Server Action ──────────────────────────────────────────────────────
async function applyFilters(formData: FormData) {
  "use server"
  const search = formData.get("search") as string
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  redirect(`/tools?${params.toString()}`)
}

// ── Fetch helper ──────────────────────────────────────────────────────
async function getAllToolsPublic(params?: { search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams()
  if (params?.search) query.set("search", params.search)
  if (params?.page)   query.set("page",   String(params.page))
  if (params?.limit)  query.set("limit",  String(params.limit))

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools?${query.toString()}`,
    { cache: "no-store" }
  )
  if (!res.ok) throw new Error("Failed to fetch tools")
  const data = await res.json()
  return { tools: (data.data || []) as Tool[], total: data.total || data.data?.length || 0 }
}

// ── Page Props ─────────────────────────────────────────────────────────
interface ToolsPageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

// ── Tools List (Server Component) ─────────────────────────────────────
async function ToolsList({ searchParams }: ToolsPageProps) {
  const { search, page } = await searchParams

  let tools: Tool[] = []
  let total = 0
  let error = null

  try {
    const data = await getAllToolsPublic({ search, page: page ? parseInt(page) : 1, limit: 12 })
    tools = data.tools
    total = data.total
  } catch (err) {
    error = (err as Error).message
    console.error("Failed to fetch tools:", err)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 mb-6 shadow-lg shadow-red-500/20">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Failed to Load Tools</h3>
        <p className="text-gray-400 text-sm max-w-md text-center mb-2">{error}</p>
        <p className="text-xs text-gray-500">Please try refreshing the page</p>
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-6 shadow-lg shadow-purple-500/20">
          <Search className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">No Tools Found</h3>
        <p className="text-gray-400 text-sm max-w-md text-center mb-2">
          We couldn&apos;t find any tools matching your search.
        </p>
        <p className="text-xs text-gray-500">Try adjusting your search terms</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {tools.map((tool, index) => (
          <div key={tool._id} style={{ animationDelay: `${index * 30}ms` }}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>

      {total > 12 && (
        <div className="mt-12 sm:mt-16 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300" />
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl">
              <p className="text-sm sm:text-base font-medium text-gray-300">
                Showing{" "}
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {tools.length}
                </span>{" "}
                of{" "}
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {total}
                </span>{" "}
                tools
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────
export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-[#03050a]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-[#03050a] to-pink-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 border border-purple-500/30 rounded-full px-4 sm:px-5 py-2 mb-6 backdrop-blur-sm shadow-lg shadow-purple-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent uppercase tracking-wider">
                Premium Tools
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              <span className="block mb-2 text-white">Explore All Tools</span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Access. Build. Achieve.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
              Discover premium tools and subscriptions to supercharge your workflow
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
        {/* Search Filter */}
        <div className="relative group mb-10 sm:mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300" />
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-800/50 hover:border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl transition-all duration-300">
            <form action={applyFilters} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  name="search"
                  defaultValue={params.search || ""}
                  placeholder="Search tools..."
                  className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="pb-16 sm:pb-20">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0a0d14] rounded-[6px] flex items-center justify-center">
                  <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Available Tools</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Choose from our curated collection of tools
            </p>
          </div>

          <ErrorBoundary>
            <Suspense fallback={<CoursesGridSkeleton count={8} />}>
              <ToolsList searchParams={searchParams} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: "Browse All Tools | Premium Subscriptions",
    description: "Explore premium tools and subscriptions. Access powerful resources to supercharge your workflow.",
    keywords: ["tools", "subscriptions", "premium tools", "productivity"],
    openGraph: {
      title: "Browse All Tools | Premium Subscriptions",
      description: "Explore premium tools and subscriptions to supercharge your workflow.",
    },
  }
}