import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getMyEnrollmentsServer } from "@/lib/server-api"
import type { Enrollment, BackendEnrollmentItem } from "@/lib/types"
import { MyCoursesClient } from "@/components/dashboard/my-courses-client"

// User-specific content - must be dynamic
export const dynamic = "force-dynamic"
export const revalidate = 0 // No caching for user-specific data

export default async function MyCoursesPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  let enrollments: Enrollment[] = []
  try {
    const data = await getMyEnrollmentsServer(session.user.id)
    
    // Transform backend response - only extract what MyCoursesClient needs
    enrollments = (data.enrolledCourses || []).map((item: BackendEnrollmentItem): Enrollment => ({
      _id: item.enrollmentId,
      student: session.user.id,
      course: {
        _id: item._id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        totalDuration: item.totalDuration,
        instructor: item.instructor,
      } as any,
      enrollmentDate: item.enrollmentDate,
      paymentStatus: item.paymentStatus,
      amountPaid: item.amountPaid,
      progress: item.progress,
      createdAt: item.enrollmentDate,
      updatedAt: item.updatedAt || item.enrollmentDate,
    }))
  } catch (error) {
    console.error("Failed to fetch enrollments:", error)
  }

  return <MyCoursesClient enrollments={enrollments} />
}
