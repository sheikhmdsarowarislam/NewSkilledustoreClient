import { redirect } from "next/navigation"
import { Alert } from "@/components/ui/alert"
import { CoursePlayer } from "@/components/course/CoursePlayer"
import { ErrorBoundary } from "@/components/error-boundary"
import { auth } from "@/auth"
import { getEnrolledCourseDetailsServer } from "@/lib/server-api"
import type { EnrolledCourseForPlayer } from "@/lib/types/course-player"

// Force dynamic rendering for personalized content
export const dynamic = "force-dynamic"

export default async function CourseLearningPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await params (Next.js 15+)
  const { id } = await params

  // Validate course ID
  if (!id) {
    redirect("/courses")
  }
  
  // Get session using NextAuth
  const session = await auth()

  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  // Fetch enrolled course details
  let course: EnrolledCourseForPlayer | null = null
  try {
    course = await getEnrolledCourseDetailsServer(id)
  } catch (error) {
    console.error("Failed to fetch enrolled course:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050a] p-4">
        <div className="max-w-md w-full">
          <Alert 
            variant="error" 
            title="Error Loading Course"
            className="bg-gradient-to-br from-red-950/40 to-orange-950/40 border-red-700/50 text-gray-200 backdrop-blur-sm shadow-lg shadow-red-900/20"
          >
            {error instanceof Error ? error.message : "Failed to load course. Please try again later."}
          </Alert>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050a] p-4">
        <div className="max-w-md w-full">
          <Alert 
            variant="error" 
            title="Course Not Found"
            className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border-blue-700/50 text-gray-200 backdrop-blur-sm shadow-lg shadow-blue-900/20"
          >
            Course not found or you are not enrolled in this course
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#03050a]">
      <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
        <CoursePlayer 
          course={course} 
          accessToken={session.accessToken}
          currentUserId={session.user.id}
        />
      </ErrorBoundary>
    </div>
  )
}
