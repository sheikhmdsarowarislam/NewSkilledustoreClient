import { notFound } from "next/navigation"
import { Wrench, Users, ExternalLink, Calendar, Tag } from "lucide-react"
import { ToolEnrollmentCard } from "@/components/tool/tool-enrollment-card"

export const dynamic = "force-dynamic"

// ── Types ──────────────────────────────────────────────────────────────
interface ToolVariation {
  label: string
  days: number
  price: number
}

interface Tool {
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
  instructor?: { name: string; avatar?: { url: string } }
}

// ── Fetch ──────────────────────────────────────────────────────────────
async function getToolById(id: string): Promise<Tool> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools/${id}`,
    { cache: "no-store" }
  )
  if (res.status === 404) notFound()
  if (!res.ok) throw new Error("Failed to fetch tool")
  const data = await res.json()
  return data.data
}

// ── Page ───────────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { id } = await params
  const tool = await getToolById(id)

  const discountedPrice =
    tool.discount > 0
      ? Math.round(tool.price * (1 - tool.discount / 100) * 100) / 100
      : tool.price

  return (
    <div className="min-h-screen bg-[#03050a]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-[#03050a] to-pink-900/20 pt-28 sm:pt-32 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Left: Info */}
            <div className="lg:col-span-2 space-y-5">
              {/* Thumbnail */}
              <div className="rounded-2xl overflow-hidden border border-gray-800/50 h-56 sm:h-72 bg-gray-900">
                {tool.thumbnail?.url ? (
                  <img
                    src={tool.thumbnail.url}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                    <Wrench className="h-16 w-16 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {tool.name}
              </h1>

              <p className="text-gray-400 text-base leading-relaxed">
                {tool.shortDescription}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-purple-400" />
                  {tool.enrollmentCount} enrolled
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  Added {new Date(tool.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
                {tool.instructor && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-500">by</span>
                    <span className="text-purple-300">{tool.instructor.name}</span>
                  </span>
                )}
              </div>

              {/* Variations info */}
              {tool.variations?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-pink-400" />
                    Available Plans
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.variations.map((v) => (
                      <div
                        key={v.label}
                        className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm"
                      >
                        <span className="text-purple-300 font-medium">{v.label}</span>
                        <span className="text-gray-500 mx-1.5">•</span>
                        <span className="text-gray-400">{v.days} days</span>
                        <span className="text-gray-500 mx-1.5">•</span>
                        <span className="text-green-400 font-semibold">৳{v.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Access link preview */}
              <a
                href={tool.accessLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Preview Tool
              </a>
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:col-span-1">
              <ToolEnrollmentCard
                toolId={tool._id}
                price={tool.price}
                discount={tool.discount}
                variations={tool.variations || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Metadata ───────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  try {
    const tool = await getToolById(id)
    return {
      title: `${tool.name} | Premium Tools`,
      description: tool.shortDescription,
    }
  } catch {
    return { title: "Tool Details" }
  }
}