import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { getInstructorReviewsServer } from "@/lib/server-api"
import { InstructorReviewsClient } from "@/components/instructor/instructor-reviews-client"

export const dynamic = "force-dynamic"

export default async function InstructorReviewsPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  let reviewsData
  try {
    reviewsData = await getInstructorReviewsServer(session.user.id)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    reviewsData = {
      reviews: [],
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  return <InstructorReviewsClient reviewsData={reviewsData} />
}
