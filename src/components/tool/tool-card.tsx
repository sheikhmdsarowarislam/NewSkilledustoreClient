import Link from "next/link"
import { Wrench, Users, ExternalLink, Tag, Package } from "lucide-react"
import type { Tool } from "@/app/(main)/tools/page"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const discountedPrice =
    tool.discount > 0 ? tool.price - (tool.price * tool.discount) / 100 : tool.price

  const isPackage = tool.isPackage === true

  return (
    <Link href={`/tools/${tool._id}`} className="group block h-full">
      <div className={`h-full border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5
        ${isPackage
          ? "bg-gradient-to-br from-gray-900/80 via-blue-950/20 to-gray-900/80 border-blue-900/40 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
          : "bg-gray-900/60 border-gray-800/50 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10"
        }`}>

        {/* Thumbnail */}
        <div className="relative h-40 bg-gray-800 overflow-hidden">
          {tool.thumbnail?.url ? (
            <img
              src={tool.thumbnail.url}
              alt={tool.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center
              ${isPackage
                ? "bg-gradient-to-br from-blue-900/30 to-cyan-900/30"
                : "bg-gradient-to-br from-purple-900/30 to-pink-900/30"
              }`}>
              {isPackage
                ? <Package className="h-12 w-12 text-cyan-700" />
                : <Wrench className="h-12 w-12 text-gray-600" />
              }
            </div>
          )}

          {/* Package badge */}
          {isPackage && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-cyan-500/90 text-white text-xs font-bold rounded-full">
              <Package className="h-3 w-3" />
              Bundle
            </div>
          )}

          {/* Discount badge */}
          {!isPackage && tool.discount > 0 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500/90 text-white text-xs font-bold rounded-full">
              -{tool.discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-2">
          <h3 className={`font-semibold text-sm line-clamp-2 transition-colors
            ${isPackage
              ? "text-white group-hover:text-cyan-300"
              : "text-white group-hover:text-purple-300"
            }`}>
            {tool.name}
          </h3>

          <p className="text-gray-400 text-xs line-clamp-2 flex-1">
            {tool.shortDescription}
          </p>

          {/* Included tools count (for packages) */}
          {isPackage && tool.includedTools && tool.includedTools.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-cyan-400">
              <Package className="h-3 w-3" />
              <span>{tool.includedTools.length} tools included</span>
            </div>
          )}

          {/* Variations (for regular tools) */}
          {!isPackage && tool.variations?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.variations.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {v.label}
                </span>
              ))}
            </div>
          )}

          {/* Package variations */}
          {isPackage && tool.variations?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tool.variations.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {v.label}
                </span>
              ))}
            </div>
          )}

          {/* Price + Enrolled */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold text-sm">
                {discountedPrice === 0 ? "Free" : `৳${discountedPrice}`}
              </span>
              {tool.discount > 0 && (
                <span className="text-gray-500 text-xs line-through">৳{tool.price}</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Users className="h-3 w-3" />
              {tool.enrollmentCount}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <div className={`w-full py-2 text-center text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5
            ${isPackage
              ? "text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20"
              : "text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20"
            }`}>
            <ExternalLink className="h-3 w-3" />
            {isPackage ? "View Package" : "View Details"}
          </div>
        </div>
      </div>
    </Link>
  )
}