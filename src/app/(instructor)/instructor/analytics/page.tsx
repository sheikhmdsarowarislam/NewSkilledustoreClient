import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, DollarSign, BookOpen, Star, ArrowRight } from "lucide-react"
import { getInstructorDashboardServer } from "@/lib/server-api"
import { auth } from "@/auth"
import type { Course } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function InstructorAnalyticsPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  let dashboard = null
  try {
    dashboard = await getInstructorDashboardServer(session.user.id)
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
  }

  // Stats are now directly on the dashboard object, not nested under 'stats'
  const courses = (dashboard?.courses || []) as Course[]
  const stats = {
    totalCourses: dashboard?.totalCourses || 0,
    totalStudents: dashboard?.totalStudents || 0,
    totalRevenue: dashboard?.totalRevenue || 0,
    avgRating: dashboard?.averageRating || 0,
    totalEnrollments: courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0),
    publishedCourses: courses.filter(c => c.status === 'published').length,
    draftCourses: courses.filter(c => c.status === 'draft').length,
  }

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Analytics Overview</h1>
        <p className="text-gray-400">Track your teaching performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-300">Total Courses</CardDescription>
              <BookOpen className="h-5 w-5 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">{stats.totalCourses}</CardTitle>
            <p className="text-xs text-violet-300/70 mt-2">
              {stats.publishedCourses} published, {stats.draftCourses} draft
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-300">Total Students</CardDescription>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">{stats.totalStudents}</CardTitle>
            <p className="text-xs text-blue-300/70 mt-2">Across all courses</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-300">Total Revenue</CardDescription>
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">${stats.totalRevenue.toFixed(2)}</CardTitle>
            <p className="text-xs text-green-300/70 mt-2">Lifetime earnings</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-yellow-300">Average Rating</CardDescription>
              <Star className="h-5 w-5 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">{stats.avgRating.toFixed(1)}</CardTitle>
            <p className="text-xs text-yellow-300/70 mt-2">Across all courses</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Performance */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Course Performance</CardTitle>
          <CardDescription className="text-gray-400">Detailed analytics for each course</CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No courses available
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course._id} className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:bg-gray-800/50 transition-all">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollmentCount || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {course.averageRating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/instructor/analytics/${course._id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                      View Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
