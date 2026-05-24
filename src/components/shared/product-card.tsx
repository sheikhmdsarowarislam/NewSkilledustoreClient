// src/components/shared/product-card.tsx

import Link from "next/link"

import {
  Wrench,
  Users,
  ExternalLink,
  Tag,
  Package,
} from "lucide-react"

export interface ProductVariation {
  label: string
  days: number | null
  price: number
}

export interface ProductTool {
  _id: string
  name: string
}

export interface ProductItem {
  _id: string

  type: "tool" | "package"

  name: string

  shortDescription: string

  thumbnail?: {
    url: string
  }

  price: number

  discount: number

  enrollmentCount: number

  variations?: ProductVariation[]

  tools?: ProductTool[]
}

interface ProductCardProps {
  item: ProductItem
}

export function ProductCard({
  item,
}: ProductCardProps) {

  const discountedPrice =
    item.discount > 0
      ? item.price -
        (item.price * item.discount) /
          100
      : item.price

  const isPackage =
    item.type === "package"

  return (
    <Link
      href={
        isPackage
          ? `/packages/${item._id}`
          : `/tools/${item._id}`
      }
      className="group block h-full"
    >
      <div className="h-full bg-gray-900/60 border border-gray-800/50 hover:border-purple-500/30 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5">

        {/* Thumbnail */}
        <div className="relative h-40 bg-gray-800 overflow-hidden">

          {item.thumbnail?.url ? (
            <img
              src={item.thumbnail.url}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">

              {isPackage ? (
                <Package className="h-12 w-12 text-gray-600" />
              ) : (
                <Wrench className="h-12 w-12 text-gray-600" />
              )}
            </div>
          )}

          {/* Discount badge */}
          {item.discount > 0 && (
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-pink-500/90 text-white text-xs font-bold rounded-full">
              -{item.discount}%
            </div>
          )}

          {/* Package tools count */}
          {isPackage &&
            item.tools && (
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1">

                <Wrench className="h-3 w-3" />

                {item.tools.length}
              </div>
            )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col gap-2">

          <div className="flex items-start justify-between gap-2">

            <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-purple-300 transition-colors">

              {item.name}
            </h3>

            {isPackage && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 whitespace-nowrap">
                PACKAGE
              </span>
            )}
          </div>

          <p className="text-gray-400 text-xs line-clamp-2 flex-1">
            {item.shortDescription}
          </p>

          {/* Package tools */}
          {isPackage &&
            item.tools &&
            item.tools.length > 0 && (
              <div className="flex flex-wrap gap-1">

                {item.tools
                  .slice(0, 3)
                  .map((tool) => (
                    <span
                      key={tool._id}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full"
                    >
                      <Wrench className="h-2.5 w-2.5" />

                      {tool.name}
                    </span>
                  ))}

                {item.tools.length >
                  3 && (
                  <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full">
                    +
                    {item.tools.length -
                      3}{" "}
                    more
                  </span>
                )}
              </div>
            )}

          {/* Variations */}
          {item.variations &&
            item.variations.length >
              0 && (
              <div className="flex flex-wrap gap-1">

                {item.variations
                  .slice(0, 3)
                  .map((v) => (
                    <span
                      key={v.label}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full"
                    >
                      <Tag className="h-2.5 w-2.5" />

                      {v.label}
                    </span>
                  ))}
              </div>
            )}

          {/* Price + enrollments */}
          <div className="flex items-center justify-between pt-1">

            <div className="flex items-center gap-2">

              <span className="text-green-400 font-bold text-sm">

                {discountedPrice === 0
                  ? "Free"
                  : `৳${discountedPrice}`}
              </span>

              {item.discount > 0 && (
                <span className="text-gray-500 text-xs line-through">
                  ৳{item.price}
                </span>
              )}
            </div>

            <span className="flex items-center gap-1 text-gray-500 text-xs">

              <Users className="h-3 w-3" />

              {item.enrollmentCount}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">

          <div className="w-full py-2 text-center text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors flex items-center justify-center gap-1.5">

            <ExternalLink className="h-3 w-3" />

            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}