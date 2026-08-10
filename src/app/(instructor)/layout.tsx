"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

/**
 * Instructor Layout
 * For instructor pages with instructor sidebar
 */
export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // NextAuth session
  const { data: session, status } = useSession()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  /**
   * Instructor access check
   */
  useEffect(() => {
    // Wait for session load
    if (status === "loading") return

    // Not logged in
    if (!session) {
      router.replace("/")
      return
    }

    // Get role safely
    const role =
      (session.user as any)?.role ||
      (session.user as any)?.user?.role ||
      (session.user as any)?.data?.role

    // instructor এবং admin — দুজনেই instructor page দেখতে পারবে
    if (role !== "instructor" && role !== "admin") {
      router.replace("/")
    }
  }, [session, status, router])

  // Sync collapse state with sidebar
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("sidebar:collapsed")
        if (saved !== null) {
          setIsCollapsed(saved === "1")
        }
      } catch {}
    }

    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab updates
    const handleSidebarToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ collapsed: boolean }>
      setIsCollapsed(customEvent.detail.collapsed)
    }
    window.addEventListener('sidebar-toggle', handleSidebarToggle)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleSidebarToggle)
    }
  }, [])

  /**
   * Prevent UI flash while checking auth
   */
  if (status === "loading") {
    return null
  }

  // Get role again for render protection
  const role =
    (session?.user as any)?.role ||
    (session?.user as any)?.user?.role ||
    (session?.user as any)?.data?.role

  /**
   * Block non-instructor (and non-admin) rendering
   */
  if (!session || (role !== "instructor" && role !== "admin")) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#03050a] pt-16">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 p-3 bg-gradient-to-br from-violet-500/90 to-purple-500/90 backdrop-blur-sm border border-violet-600/50 rounded-lg text-white hover:from-violet-600 hover:to-purple-600 transition-all shadow-lg shadow-violet-500/20"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar 
        type="instructor" 
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className={`
        min-h-screen transition-all duration-300 ease-out
        ${isCollapsed ? 'md:ml-20' : 'md:ml-72'}
        p-4 sm:px-6 lg:px-16
      `}>
        {children}
      </main>
    </div>
  )
}