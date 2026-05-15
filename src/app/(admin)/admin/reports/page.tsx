"use client"

import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-400">
          View detailed reports and analytics
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 border border-gray-800/50 rounded-xl p-12 text-center">
        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Reports & Analytics Coming Soon</h3>
        <p className="text-gray-400">
          This feature is under development. You&apos;ll be able to view detailed platform analytics and generate reports here.
        </p>
      </div>
    </div>
  )
}

