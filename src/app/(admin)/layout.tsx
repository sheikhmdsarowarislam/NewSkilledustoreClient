"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

/**
 * Admin Layout
 * Protected admin layout with sidebar
 */
export default function AdminLayout({
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
   * Admin access check
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

    console.log("SESSION:", session)
    console.log("ROLE:", role)

    // Not admin
    if (role !== "admin") {
      router.replace("/")
    }
  }, [session, status, router])

  /**
   * Sync sidebar collapse state
   */
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

    window.addEventListener("storage", handleStorageChange)

    // Same-tab custom event
    const handleSidebarToggle = (e: Event) => {
      const customEvent = e as CustomEvent<{ collapsed: boolean }>
      setIsCollapsed(customEvent.detail.collapsed)
    }

    window.addEventListener("sidebar-toggle", handleSidebarToggle)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sidebar-toggle", handleSidebarToggle)
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
   * Block non-admin rendering
   */
  if (!session || role !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-[#03050a] pt-16">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar */}
      <Sidebar
        type="admin"
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main
        className={`
          min-h-screen transition-all duration-300 ease-out
          ${isCollapsed ? "md:ml-20" : "md:ml-72"}
          p-4 sm:px-6 lg:px-16
        `}
      >
        {children}
      </main>
    </div>
  )
}