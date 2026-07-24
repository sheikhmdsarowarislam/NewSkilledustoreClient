"use client"

import { Download } from "lucide-react"

export function DownloadExtensionButton({ url }: { url: string }) {
  const handleDownload = () => {
    // Dynamically create the <a> tag only at click time,
    // so no href is ever present on the rendered element
    // (which is what makes the browser show the URL on hover).
    const link = document.createElement("a")
    link.href = url
    link.download = ""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button onClick={handleDownload} className="group block w-full text-left">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-800/40 to-gray-900/80 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 p-5 sm:p-6 shadow-xl hover:shadow-pink-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600/5 via-transparent to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Download className="w-5 h-5 text-pink-400 group-hover:animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base sm:text-lg leading-tight mb-0.5">
              Download Extension
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm truncate">
              Get the latest version as .zip
            </p>
          </div>
          <Download className="w-4 h-4 text-gray-600 group-hover:text-pink-400 transition-all duration-300 shrink-0" />
        </div>
      </div>
    </button>
  )
}