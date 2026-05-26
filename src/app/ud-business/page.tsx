import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Zap, Shield, Clock, Star, ArrowRight } from "lucide-react"

const PLANS = [
  {
    duration: "৩ মাস",
    originalPrice: "১২০০",
    offerPrice: "৪৯৯",
    highlight: false,
    badge: "LIMITED TIME OFFER",
    features: ["আনলিমিটেড অ্যাক্সেস", "BONUS ACCOUNTS INCLUDED"],
  },
  {
    duration: "৭ মাস",
    originalPrice: "১৮০০",
    offerPrice: "৮০০",
    highlight: true,
    badge: "🔥 Popular 🔥",
    features: ["আনলিমিটেড অ্যাক্সেস", "BONUS ACCOUNTS INCLUDED"],
  },
  {
    duration: "১২ মাস",
    originalPrice: "৩০০০",
    offerPrice: "১২০০",
    highlight: false,
    badge: "BEST VALUE",
    features: ["আনলিমিটেড অ্যাক্সেস", "BONUS ACCOUNTS INCLUDED"],
  },
]

const WHY_US = [
  { icon: Zap,     title: "নিরবচ্ছিন্ন অ্যাক্সেস", desc: "কোনও হঠাৎ লগআউট নেই" },
  { icon: Clock,   title: "দ্রুত সাপোর্ট",          desc: "প্রশ্ন-পূরণে দ্রুত প্রতিক্রিয়া" },
  { icon: Star,    title: "পূর্ণ অভিজ্ঞতা",         desc: "দীর্ঘদিনের কাজের অভিজ্ঞতা" },
  { icon: Shield,  title: "বিশ্বস্ততা",              desc: "রিয়েল রিভিউ ও ফলাফল" },
]

export default function UdemyOfferPage() {
  return (
    <div className="min-h-screen bg-[#03050a]">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-[#03050a] to-pink-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Ude*my Business Offer</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Ude*my Business{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Group Buy Access
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            ৩০,০০০+ কোর্স অ্যাক্সেস করুন মাত্র একটি সাশ্রয়ী সাবস্ক্রিপশনে।
            ফোন ও পিসি — দুই জায়গায়ই ব্যবহার করুন।
          </p>

          {/* What's included */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto text-left space-y-3 mb-6">
            <h3 className="text-white font-bold text-lg mb-4">✅ যা যা পাবেন:</h3>
            {[
              "ইউডেমী বিজনেস (শেয়ার) — ৩০,০০০+ কোর্স অ্যাক্সেস",
              "আনলিমিটেড এনরোলমেন্ট — নো এক্সট্রা চার্জ",
              "ফোন এবং পিসি দুই জায়গায়ই ব্যবহার করা যাবে",
              "BONUS: Skillshare + LinkedIn Learning অ্যাক্সেস",
              "প্রায় ৩ বছর ধরে নিরবচ্ছিন্ন সার্ভিস",
              "আমাদের নিজস্ব ম্যানেজড অ্যাকাউন্ট — ফাস্ট সাপোর্ট",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ONE TIME OFFER ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/10 rounded-2xl" />
          <div className="absolute inset-0 border border-blue-500/40 rounded-2xl" />
          <div className="relative p-8 sm:p-10 text-center">
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4 text-xs font-bold text-blue-400 uppercase tracking-wider">
              One Time Payment Offer
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              One Time Payment{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">OFFER</span>
            </h2>
            <div className="flex items-baseline justify-center gap-3 my-4">
              <span className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ৳১৫৯৯
              </span>
              <span className="text-gray-400 text-sm">/ একবারই পেমেন্ট</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">( OFFER ENDS 29th Nov, 2025 )</p>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 max-w-lg mx-auto text-left space-y-2 my-6">
              <p className="text-gray-300 text-sm"><span className="text-white font-semibold">Note:</span> BONUS ACCOUNTS ARE NOT INCLUDED.</p>
              <p className="text-gray-400 text-sm">মেয়াদঃ যত দিন আমাদের সার্ভিস চলবে ততদিন আর কোন পেমেন্ট করা লাগবেনা।</p>
              <p className="text-gray-400 text-sm">2 Year এর মধ্যে যেকোনো সমস্যা হলে রিপ্লেসমেন্ট হিসেবে অন্য যেকোনো প্রোডাক্ট দিতে পারব।</p>
            </div>
            <Link href="/tools/6a148a1b718438f9d2311eaf">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white border-0 shadow-lg shadow-pink-500/20 px-10">
                <Zap className="mr-2 w-4 h-4" />
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── SUBSCRIPTION PLANS ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider mb-2">সীমিত সময়ের জন্য এই ডিসকাউন্ট চলবে</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            LIMITED{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TIME OFFER</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          {PLANS.map((plan) => (
            <div key={plan.duration} className={`relative rounded-2xl p-6 border transition-all duration-300
              ${plan.highlight
                ? "bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-500/50 shadow-xl shadow-blue-500/20 scale-105"
                : "bg-gray-900/50 border-gray-800/50 hover:border-gray-700"}`}>
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap
                  ${plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                    : plan.badge === "BEST VALUE"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600"
                      : "bg-gradient-to-r from-orange-600 to-amber-600"}`}>
                  {plan.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-4 mt-2">{plan.duration}</h3>
              <div className="mb-1">
                <span className="text-gray-500 text-sm line-through">৳{plan.originalPrice}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ৳{plan.offerPrice}
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/tools/6a13dc774348ff0985714352" className="block">
                <Button className={`w-full ${plan.highlight
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"}`}>
                  Buy Now
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm">
          উপরের ৩ টি অপশন থেকে যেকোনো একটিতে ক্লিক করে অর্ডার করুন
        </p>
      </div>

      {/* ── WHY US ── */}
      <div className="bg-[#0a0d14] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              কেন আমাদের থেকেই{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">কিনবেন?</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              ২০২৩ সাল থেকে আমরা ইউডেমী প্ল্যাটফর্মে নিরবচ্ছিন্ন সেবা প্রদান করে আসছি।
              মার্কেটে অন্যান্য সেবাদাতাদের থেকে যেসব জটিলতা হয় — ঘন ঘন লগআউট, অ্যাক্সেস না থাকা —
              সেগুলো আমরা আগে থেকেই সমাধান করে দিয়ে থাকি।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            {WHY_US.map((item) => (
              <div key={item.title} className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-300 text-center group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-blue-400" />
                  </div>
                </div>
                <p className="text-white font-semibold text-xs sm:text-sm">{item.title}</p>
                <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-2xl p-8 sm:p-10 text-center">
            <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              TOP SERVICE
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">বিশ্বস্ত ও দ্রুত সার্ভিস</h3>
            <p className="text-gray-400 text-sm mb-6">
              আপনি আমাদের সার্ভিসে বিশ্বাস রাখতে পারবেন — নিরাপদ, দ্রুত এবং সাশ্রয়ী।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tools/YOUR_TOOL_ID">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/20 group">
                  এখনই কিনুন
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-700 bg-gray-800/40 text-gray-300 hover:bg-gray-800 hover:text-white">
                  🔒 সাপোর্টে জানাতে চান?
                </Button>
              </Link>
            </div>
            <p className="text-gray-600 text-xs mt-4">🔒 Secure · 18/7 Support · Money-back Guarantee</p>
          </div>
        </div>
      </div>

    </div>
  )
}