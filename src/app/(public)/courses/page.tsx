import { CourseCard } from "@/components/course/course-card"
import { CourseFilters } from "@/components/course/course-filters"
import { getAllCoursesPublic } from "@/lib/server-api"
import { Suspense } from "react"
import { CoursesGridSkeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import type { Course } from "@/lib/types"
import { Search, BookOpen, TrendingUp, AlertCircle } from "lucide-react"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic' 
export const dynamicParams = true

// Server Action for filtering
async function applyFilters(formData: FormData) {
  'use server'
  
  const search = formData.get('search') as string
  const category = formData.get('category') as string
  const level = formData.get('level') as string
  
  const params = new URLSearchParams()
  if (search) params.set('search', search)
  if (category) params.set('category', category)
  if (level) params.set('level', level)
  
  redirect(`/courses?${params.toString()}`)
} 



interface CoursesPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    level?: string
    page?: string
  }>
}

async function CoursesList({ searchParams }: CoursesPageProps) {
  const { search, category, level, page } = await searchParams
  
  let courses: unknown[] = []
  let total = 0
  let error = null

  try {
    const data = await getAllCoursesPublic({
      search,
      category,
      level,
      page: page ? parseInt(page) : 1,
      limit: 12,
    })
    courses = data.courses || []
    total = data.total || 0
  } catch (err) {
    const errorObj = err as Error
    error = errorObj.message
    console.error("Failed to fetch courses:", err)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 mb-6 shadow-lg shadow-red-500/20">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Failed to Load Courses
        </h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-md text-center mb-2">{error}</p>
        <p className="text-xs sm:text-sm text-gray-500">Please try refreshing the page</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 mb-6 shadow-lg shadow-blue-500/20">
          <Search className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
          No Courses Found
        </h3>
        <p className="text-gray-400 text-sm sm:text-base max-w-md text-center mb-2">
          We couldn&apos;t find any courses matching your criteria.
        </p>
        <p className="text-xs sm:text-sm text-gray-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {courses.map((course, index) => (
          <div key={(course as { _id: string })._id} style={{ animationDelay: `${index * 30}ms` }}>
            <CourseCard course={course as unknown as Course} />
          </div>
        ))}
      </div>
      
      {total > 12 && (
        <div className="mt-12 sm:mt-16 flex items-center justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-sm border border-gray-800/50 rounded-2xl px-6 sm:px-8 py-4 sm:py-5 shadow-xl">
              <p className="text-sm sm:text-base font-medium text-gray-300">
                Showing{" "}
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {courses.length}
                </span>
                {" "}of{" "}
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {total}
                </span>
                {" "}courses
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-[#03050a]">
      {/* Header Section with Modern Gradients */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/20 border border-blue-500/30 rounded-full px-4 sm:px-5 py-2 mb-6 backdrop-blur-sm shadow-lg shadow-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent uppercase tracking-wider">
                Browse Our Library
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6">
              <span className="block mb-2 text-white">
                Explore All Courses
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Learn. Build. Succeed.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
              Discover world-class courses taught by industry experts and unlock your potential
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16">
        {/* Filters Card - Enhanced with Modern Design */}
        <div className="relative group mb-10 sm:mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-sm border border-gray-800/50 hover:border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl transition-all duration-300">
            <CourseFilters 
              search={params.search}
              category={params.category}
              level={params.level}
              applyFilters={applyFilters}
            />
          </div>
        </div>

        {/* Courses Grid Section */}
        <div className="pb-16 sm:pb-20">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#0a0d14] rounded-[6px] flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Available Courses
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Choose from our extensive collection
            </p>
          </div>

          {/* Courses Grid - Server Component with Suspense and Error Boundary */}
          <ErrorBoundary>
            <Suspense fallback={<CoursesGridSkeleton count={8} />}>
              <CoursesList searchParams={searchParams} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: "Browse All Courses | SkilleduStore - 5,000+ Expert Courses",
    description: "Explore 5,000+ expert-led coding courses. Learn programming, web development, data science, and more. Filter by category, level, and price.",
    keywords: ["coding courses", "programming courses", "web development courses", "online courses", "learn programming"],
    openGraph: {
      title: "Browse All Courses | SkilleduStore",
      description: "Explore 5,000+ expert-led coding courses. Learn programming, web development, data science, and more.",
    },
  }
}
