"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

/**
 * Admin Layout
 * For admin pages with admin sidebar
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

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

      <Sidebar 
        type="admin" 
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
