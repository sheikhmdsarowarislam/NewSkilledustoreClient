"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)  // ← এটা যোগ হয়েছে

  useEffect(() => {
    // ── Client এ mount হওয়ার পরেই localStorage read করো ──
    try {
      const saved = localStorage.getItem("sidebar:collapsed")
      if (saved !== null) {
        setIsCollapsed(saved === "1")
      }
    } catch {}

    setMounted(true)  // ← mount হয়েছে mark করো

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("sidebar:collapsed")
        if (saved !== null) {
          setIsCollapsed(saved === "1")
        }
      } catch {}
    }

    window.addEventListener("storage", handleStorageChange)

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

  return (
    <div className="min-h-screen bg-[#03050a] pt-20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-24 left-4 z-40 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sidebar
        type="student"
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* mounted check — server আর client এ same class থাকবে */}
      <main className={`
        min-h-screen transition-all duration-300 ease-out
        ${mounted && isCollapsed ? "md:ml-20" : "md:ml-72"}
        p-4 sm:px-6 lg:px-16
      `}>
        {children}
      </main>
    </div>
  )
}