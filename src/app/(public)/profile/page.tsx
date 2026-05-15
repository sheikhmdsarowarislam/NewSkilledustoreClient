import { ProfileForm } from "@/components/profile/profile-form"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

/**
 * Profile Page - Server Component with SSR
 * No caching for personalized user data
 */
export const dynamic = "force-dynamic" // Always SSR

export default async function ProfilePage() {
  // Get session
  const session = await auth()
  
  if (!session?.user) {
    redirect("/signin")
  }

  // Check for session errors
  if (session.error) {
    console.error("Session error detected:", session.error)
    redirect("/signin?error=SessionError")
  }

  // Check if access token is missing
  if (!session.accessToken) {
    console.error("Access token missing in session")
    redirect("/signin?error=NoAccessToken")
  }



  return (
    <div className="min-h-screen bg-[#03050a] pt-32">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          My <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Profile</span>
        </h1>
        <p className="text-gray-400 mb-8">Manage your account and track your learning progress</p>

        <div className="space-y-6">
          {/* Profile Info Card - Client Component for editing */}
          <ProfileForm user={session.user} accessToken={session.accessToken} />

        </div>
      </div>
    </div>
  )
}

// Generate metadata
export async function generateMetadata() {
  const session = await auth()
  
  return {
    title: `Profile - ${session?.user?.name || "User"} | LMS`,
    description: "Manage your profile and view your learning statistics",
  }
}
