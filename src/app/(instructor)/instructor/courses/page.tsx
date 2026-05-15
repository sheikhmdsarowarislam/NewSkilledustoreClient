import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { getCoursesByInstructorServer, getInstructorDashboardServer } from "@/lib/server-api"
import { CoursesList } from "@/components/instructor/courses-list"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, Users, TrendingUp, DollarSign } from "lucide-react"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function InstructorCoursesPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            My Courses
          </h1>
          <p className="text-gray-400">Manage and track your course performance</p>
        </div>
        <Link href="/instructor/courses/create">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Plus className="h-5 w-5 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Cards - Load in parallel with Suspense */}
      <Suspense fallback={<CoursesStatsSkeleton />}>
        <CoursesStatsWrapper instructorId={session.user.id} />
      </Suspense>

      {/* Courses List - Load in parallel with Suspense */}
      <Suspense fallback={<CoursesListSkeleton />}>
        <CoursesListWrapper instructorId={session.user.id} />
      </Suspense>
    </div>
  )
}

// ============================================================================
// Server Components for Data Fetching
// ============================================================================

async function CoursesStatsWrapper({ instructorId }: { instructorId: string }) {
  const dashboard = await getInstructorDashboardServer(instructorId)
  
  const stats = [
    {
      label: "Total Courses",
      value: dashboard.totalCourses || 0,
      icon: BookOpen,
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-600/20 to-cyan-600/20",
      borderColor: "border-blue-600/30"
    },
    {
      label: "Total Students",
      value: dashboard.totalStudents || 0,
      icon: Users,
      color: "from-violet-600 to-purple-600",
      bgColor: "from-violet-600/20 to-purple-600/20",
      borderColor: "border-violet-600/30"
    },
    {
      label: "Total Revenue",
      value: `$${(dashboard.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: "from-emerald-600 to-green-600",
      bgColor: "from-emerald-600/20 to-green-600/20",
      borderColor: "border-emerald-600/30"
    },
    {
      label: "Avg Rating",
      value: dashboard.averageRating ? dashboard.averageRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "from-orange-600 to-red-600",
      bgColor: "from-orange-600/20 to-red-600/20",
      borderColor: "border-orange-600/30"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card 
            key={index}
            className="relative overflow-hidden border-gray-800/50 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 hover:border-gray-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            {/* Decorative gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-0 hover:opacity-100 transition-opacity duration-500`}></div>
            
            <CardContent className="relative z-10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 shadow-lg`}>
                  <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    View Details
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

async function CoursesListWrapper({ instructorId }: { instructorId: string }) {
  const courses = await getCoursesByInstructorServer(instructorId)
  
  return (
    <div className="mt-8">
      <CoursesList courses={courses} />
    </div>
  )
}

// ============================================================================
// Loading Skeletons
// ============================================================================

function CoursesStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-gray-800/50 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-gray-800 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-800 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CoursesListSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-8 w-48 bg-gray-800 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-gray-800/50 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 animate-pulse">
            <div className="h-48 bg-gray-800" />
            <CardContent className="pt-6">
              <div className="h-6 w-3/4 bg-gray-800 rounded mb-3" />
              <div className="h-4 w-full bg-gray-800 rounded mb-3" />
              <div className="h-4 w-2/3 bg-gray-800 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
