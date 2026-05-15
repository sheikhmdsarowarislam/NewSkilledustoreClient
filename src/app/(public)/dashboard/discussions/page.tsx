import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DiscussionsList } from "@/components/dashboard/DiscussionsList"
import { getUserDiscussionsServer, getEnrolledCoursesDiscussionsServer } from "@/lib/server-api"
import type { Discussion } from "@/lib/types"

export const dynamic = "force-dynamic"

interface SearchParams {
  tab?: string
  page?: string
}

export default async function DiscussionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  const params = await searchParams
  const activeTab = (params.tab as "my" | "all") || "my"
  const page = parseInt(params.page || "1", 10)

  try {
    const result: {
      discussions: Discussion[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    } = activeTab === "my" 
      ? await getUserDiscussionsServer({ page, limit: 20 })
      : await getEnrolledCoursesDiscussionsServer({ page, limit: 20 })

    return (
      <DiscussionsList 
        initialDiscussions={result.discussions}
        initialPagination={result.pagination}
        initialTab={activeTab}
      />
    )
  } catch (error) {
    console.error("Error fetching discussions:", error)
    // Return empty state on error
    return (
      <DiscussionsList 
        initialDiscussions={[]}
        initialPagination={{ page: 1, limit: 20, total: 0, totalPages: 0 }}
        initialTab={activeTab}
      />
    )
  }
}
