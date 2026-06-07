"use client"

import { useState } from "react"
import { ChevronDown, BellRing } from "lucide-react"

function GuidelineItem({
  children,
  variant = "default",
  last,
}: {
  children: React.ReactNode
  variant?: "default" | "warning" | "danger"
  last?: boolean
}) {
  const dotColor =
    variant === "warning"
      ? "bg-amber-400"
      : variant === "danger"
      ? "bg-red-400"
      : "bg-gray-500"

  const textColor =
    variant === "warning"
      ? "text-amber-300"
      : variant === "danger"
      ? "text-red-400"
      : "text-gray-300"

  return (
    <div
      className={`flex items-start gap-3 py-3 ${
        !last ? "border-b border-white/[0.06]" : ""
      }`}
    >
      <span
        className={`mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
      />
      <p className={`text-[13px] leading-relaxed ${textColor}`}>{children}</p>
    </div>
  )
}

export function NoticeBoard() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2 mb-8 sm:mb-10">
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.04] transition-colors duration-150"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
              <BellRing className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[13px] font-medium text-white">
              Important guidelines
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              must read
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-600">
              {open ? "collapse" : "expand"}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        {/* Divider */}
        {open && <div className="h-px bg-white/[0.06] mx-4" />}

        {/* Body */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-3">
            <GuidelineItem variant="warning">
              Our extension has been updated! Please download and install the
              new version to continue accessing services.
            </GuidelineItem>

            <GuidelineItem>
              You can log in on any two devices, but{" "}
              <strong className="text-white font-medium">
                you can only access courses on one device at a time.
              </strong>{" "}
              If your access is{" "}
              <strong className="text-white font-medium">banned</strong>, you
              will not regain access.
            </GuidelineItem>

            <GuidelineItem variant="danger">
              If you share your account with anyone else, your access will be
              immediately terminated and your account will be permanently banned.
            </GuidelineItem>

            <GuidelineItem>
              If you have the extension installed, please remove any cookie
              editor or other cookie-related extensions.
            </GuidelineItem>

            <GuidelineItem last>
              Please read our{" "}
              <a
                href="/terms"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                Terms &amp; Conditions
              </a>{" "}
              carefully. For support, contact{" "}
              <strong className="text-white font-medium">
                01311844364 (WhatsApp)
              </strong>{" "}
              or send us an inbox message.
            </GuidelineItem>
          </div>
        </div>
      </div>
    </div>
  )
}