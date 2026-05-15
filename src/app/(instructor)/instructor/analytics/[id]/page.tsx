import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Star, DollarSign, CheckCircle } from "lucide-react"
import { getCourseAnalyticsServer } from "@/lib/server-api"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

interface CourseAnalyticsPageProps {
  params: Promise<{ id: string }>
}

export default async function CourseAnalyticsPage({ params }: CourseAnalyticsPageProps) {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  const { id } = await params

  let analytics = null
  let error = null

  try {
    analytics = await getCourseAnalyticsServer(id)
  } catch (err) {
    error = (err as Error).message
    console.error("Failed to fetch analytics:", err)
  }

  if (error || !analytics) {
    return (
      <div className="w-full max-w-7xl py-10">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">{error || "Failed to load analytics"}</p>
        </div>
      </div>
    )
  }

  const analyticsData = analytics as Record<string, number>
  const enrollments = analyticsData.enrollments || 0
  const reviews = analyticsData.reviews || 0
  const averageRating = analyticsData.averageRating || 0
  const completionRate = analyticsData.completionRate || 0
  const totalRevenue = analyticsData.totalRevenue || 0

  return (
    <div className="w-full max-w-7xl py-6 sm:py-8 lg:py-10">
      {/* Back Button */}
      <Link href="/instructor/analytics">
        <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Course Analytics</h1>
        <p className="text-gray-400">Detailed performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-blue-300">Enrollments</CardDescription>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">{enrollments}</CardTitle>
            <p className="text-xs text-blue-300/70 mt-2">Total students enrolled</p>
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
            <CardTitle className="text-3xl text-white">{averageRating.toFixed(1)}</CardTitle>
            <p className="text-xs text-yellow-300/70 mt-2">{reviews} reviews</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-green-300">Completion Rate</CardDescription>
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">{completionRate.toFixed(0)}%</CardTitle>
            <p className="text-xs text-green-300/70 mt-2">Students who finished</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-violet-300">Total Revenue</CardDescription>
              <DollarSign className="h-5 w-5 text-violet-400" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl text-white">${totalRevenue.toFixed(2)}</CardTitle>
            <p className="text-xs text-violet-300/70 mt-2">From this course</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
