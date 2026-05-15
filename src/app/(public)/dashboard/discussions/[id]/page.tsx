import { redirect } from "next/navigation"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

// Redirect to discussions list since we handle replies inline now
export default async function DiscussionDetailPage() {
  const session = await auth()
  
  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  // Redirect to the discussions page - replies are now handled inline
  redirect("/dashboard/discussions?tab=my")
}

