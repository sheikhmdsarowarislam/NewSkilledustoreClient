"use client"

import { useState } from "react"
import { ChevronDown, Megaphone, Clock, Gift, Tag } from "lucide-react"

const notices = [
  {
    id: 1,
    type: "announcement",
    title: "নতুন টুল লঞ্চ হয়েছে!",
    message: "আমাদের নতুন AI Writing Assistant টুল এখন available। আজই try করুন।",
    time: "২ ঘণ্টা আগে",
    icon: Megaphone,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    titleColor: "text-emerald-300",
    timeColor: "text-emerald-500/70",
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Notice",
    message: "আগামীকাল রাত ১২টা থেকে ২টা পর্যন্ত সার্ভার maintenance চলবে।",
    time: "১ দিন আগে",
    icon: Clock,
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    titleColor: "text-purple-300",
    timeColor: "text-purple-500/70",
  },
  {
    id: 3,
    type: "offer",
    title: "Limited Time Offer",
    message: "এই সপ্তাহে সব tool এ ২০% discount। Coupon code: SAVE20",
    time: "৩ দিন আগে",
    icon: Gift,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
    titleColor: "text-amber-300",
    timeColor: "text-amber-500/70",
  },
]

const exclusiveOffers = [
  {
    id: 1,
    title: "🎯 Referral Bonus",
    message: "বন্ধুকে refer করুন এবং পান ৳৫০০ credit। প্রতিটি successful referral এ।",
    badge: "Hot",
    badgeBg: "bg-pink-500/20",
    badgeColor: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    titleColor: "text-pink-300",
    timeColor: "text-pink-500/70",
    time: "সীমিত সময়ের জন্য",
  },
  {
    id: 2,
    title: "⚡ Flash Sale",
    message: "আজ রাত ১২টার মধ্যে যেকোনো annual plan এ ৩০% off। সুযোগ হাতছাড়া করবেন না!",
    badge: "Ends Tonight",
    badgeBg: "bg-orange-500/20",
    badgeColor: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    titleColor: "text-orange-300",
    timeColor: "text-orange-500/70",
    time: "আজ শেষ",
  },
]

function NoticeSection({
  title,
  badge,
  badgeBg,
  badgeColor,
  dotColor,
  items,
  renderItem,
}: {
  title: string
  badge: string
  badgeBg: string
  badgeColor: string
  dotColor: string
  items: any[]
  renderItem: (item: any) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-gray-800/50 bg-gray-900/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/30 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeBg} ${badgeColor}`}>
            {badge}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{open ? "collapse" : "expand"}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 flex flex-col gap-3">
          {items.map(renderItem)}
        </div>
      </div>
    </div>
  )
}

export function NoticeBoard() {
  return (
    <div className="flex flex-col gap-4">
      {/* General Notices */}
      <NoticeSection
        title="Notice Board"
        badge="3 new"
        badgeBg="bg-purple-500/20"
        badgeColor="text-purple-400"
        dotColor="bg-emerald-400"
        items={notices}
        renderItem={(notice) => {
          const Icon = notice.icon
          return (
            <div
              key={notice.id}
              className={`flex items-start gap-3 p-4 rounded-xl border ${notice.bg} ${notice.border}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${notice.iconColor}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold mb-1 ${notice.titleColor}`}>{notice.title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{notice.message}</p>
                <span className={`text-[11px] mt-1.5 block ${notice.timeColor}`}>{notice.time}</span>
              </div>
            </div>
          )
        }}
      />

      {/* Exclusive Offers */}
      <NoticeSection
        title="Exclusive Offers"
        badge="2 active"
        badgeBg="bg-pink-500/20"
        badgeColor="text-pink-400"
        dotColor="bg-pink-400"
        items={exclusiveOffers}
        renderItem={(offer) => (
          <div
            key={offer.id}
            className={`flex items-start gap-3 p-4 rounded-xl border ${offer.bg} ${offer.border}`}
          >
            <Tag className={`w-5 h-5 mt-0.5 shrink-0 ${offer.titleColor}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className={`text-sm font-semibold ${offer.titleColor}`}>{offer.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${offer.badgeBg} ${offer.badgeColor}`}>
                  {offer.badge}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{offer.message}</p>
              <span className={`text-[11px] mt-1.5 block ${offer.timeColor}`}>{offer.time}</span>
            </div>
          </div>
        )}
      />
    </div>
  )
}