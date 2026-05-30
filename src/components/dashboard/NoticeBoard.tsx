"use client"

import { useState } from "react"
import { ChevronDown, Bell, ExternalLink } from "lucide-react"

export function NoticeBoard() {
  const [open, setOpen] = useState(true)

  return (
    <div className="mt-2 mb-8 sm:mb-10">
      <div className="rounded-2xl border border-red-500/20 bg-gray-900/60 overflow-hidden">
        
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/30 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-red-400" />
            <span className="text-sm font-bold text-white">Important Guidelines</span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400">
              must watch
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{open ? "collapse" : "expand"}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {/* Divider */}
        {open && <div className="h-px bg-red-500/20 mx-5" />}

        {/* Body */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-5 py-4 flex flex-col gap-0">

            <GuidelineItem highlight>
              Our extension has been updated! Please download and install the new version to continue accessing services.
            </GuidelineItem>

            <GuidelineItem>
              You can log in on any two devices, but{" "}
              <strong className="text-red-400 font-semibold">
                you can only access courses on one device at a time.
              </strong>{" "}
              If your access is{" "}
              <strong className="text-red-400 font-semibold">Banned</strong>
              , you will not regain access.
            </GuidelineItem>

            <GuidelineItem highlight>
              If you share your account with anyone else, your access will be immediately terminated and your account will be permanently banned.
            </GuidelineItem>

            <GuidelineItem>
              If you have the extension installed, please remove any cookie editor or other cookie-related extensions.
            </GuidelineItem>

            <GuidelineItem>
              Once logged in, simply visit{" "}
              
                href="https://gale.udemy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 underline underline-offset-2 inline-flex items-center gap-1"
              >
                gale.udemy.com <ExternalLink className="w-3 h-3" />
              </a>{" "}
              to access. If logged out, return to the dashboard to log in again.
            </GuidelineItem>

            <GuidelineItem last>
              Please read our{" "}
              
                href="/terms"
                className="text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Terms &amp; Conditions
              </a>{" "}
              carefully. For support, contact{" "}
              <strong className="text-red-400 font-semibold">01311844364 (WhatsApp)</strong>{" "}
              or send us an inbox message.
            </GuidelineItem>

          </div>
        </div>

      </div>
    </div>
  )
}

function GuidelineItem({
  children,
  highlight = false,
  last = false,
}: {
  children: React.ReactNode
  highlight?: boolean
  last?: boolean
}) {
  return (
    <div className={`flex items-start gap-3 py-3 ${!last ? "border-b border-gray-800/50" : ""}`}>
      <span className="text-red-500 mt-0.5 shrink-0 text-xs">▶</span>
      <p className={`text-sm leading-relaxed ${highlight ? "text-red-400 font-medium" : "text-gray-300"}`}>
        {children}
      </p>
    </div>
  )
}