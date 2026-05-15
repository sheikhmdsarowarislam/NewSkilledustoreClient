import { redirect } from "next/navigation"
import Link from "next/link"
import { Award, Trophy, CheckCircle, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { CertificateCard } from "@/components/dashboard/CertificateCard"
import { EmptyState } from "@/components/ui"
import { getUserCertificatesServer } from "@/lib/server-api"

// Force dynamic rendering for personalized content
export const dynamic = "force-dynamic"

export default async function CertificatesPage() {
  const session = await auth()

  if (!session?.user || !session?.accessToken) {
    redirect("/signin")
  }

  const certificates = await getUserCertificatesServer()

  // Calculate latest month for stats (done on server)
  const latestMonth = certificates.length > 0 
    ? new Date(certificates[0].issueDate).toLocaleDateString('en-US', { month: 'short' })
    : 'N/A'

  return (
    <div className="w-full max-w-6xl py-6 sm:py-8 lg:py-10">
      {/* Header Section with Gradient */}
      <div className="relative mb-8 sm:mb-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/10 via-green-600/10 to-emerald-600/10 border border-emerald-500/20 p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Achievements</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              My <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Certificates</span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              View and download your course completion certificates
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-0.5">
                  {certificates.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Total Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-0.5">
                  {certificates.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Courses Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-violet-500/40 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="relative z-10 p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-violet-400" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-0.5">
                  {latestMonth}
                </p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Latest Achievement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Your Achievements</h2>
          <p className="text-xs sm:text-sm text-gray-400">Browse and download your earned certificates</p>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No Certificates Yet"
            description="Complete courses to earn certificates and showcase your achievements"
            action={
              <Link href="/courses">
                <Button>Browse Courses</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {certificates.map((cert, index) => (
              <div
                key={cert._id}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CertificateCard 
                  certificate={cert}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

