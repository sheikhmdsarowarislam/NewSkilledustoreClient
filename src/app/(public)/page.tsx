import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, BarChart2, Clock, ArrowRight, Star, CheckCircle, Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 172800

const TOOLS = [
  { abbr: "U",  name: "Udemy Business",    desc: "Access thousands of premium courses on programming, design, business & more", from: "৳450" },
  { abbr: "C",  name: "Coursera Plus",     desc: "Learn from top universities with certificates & specializations",              from: "৳450" },
  { abbr: "L",  name: "LinkedIn Learning", desc: "Professional skill-building courses with LinkedIn certificate integration",    from: "৳450" },
  { abbr: "Sk", name: "Skillshare",        desc: "Creative courses on design, illustration, photography & productivity",        from: "৳450" },
  { abbr: "Mx", name: "MasterClass",       desc: "Learn from world-class instructors across every field",                       from: "৳450" },
  { abbr: "Pl", name: "Pluralsight",       desc: "Tech & developer-focused courses with skill assessments & paths",             from: "৳450" },
]

const PLANS = [
  {
    name: "1 Month Access",
    price: "৳450",
    period: "/month",
    desc: "Most Popular",
    tools: [
      "Access To 11+ Shared Learning Premium Tools",
      "99.99% Uptime",
      "WhatsApp Support",
      "No Auto-renewal",
      "18/7 Customer Support",
    ],
    highlight: false,
  },
  {
    name: "3 Month Access",
    price: "৳999",
    period: "/3 months",
    desc: "Best Value — Save ৳298",
    tools: [
      "Access To 11+ Shared Learning Premium Tools",
      "99.99% Uptime",
      "WhatsApp Support",
      "18/7 Customer Support",
      "No Auto-renewal",
    ],
    highlight: true,
  },
  {
    name: "6 Month Access",
    price: "৳1499",
    period: "/6 months",
    desc: "Maximum Savings — Save ৳1295",
    tools: [
      "Access To 11+ Shared Learning Premium Tools",
      "99.99% Uptime",
      "WhatsApp Support",
      "18/7 Customer Support",
      "No Auto-renewal",
    ],
    highlight: false,
  },
]

const FEATURES = [
  { icon: Zap,       title: "1-Click Instant Access",    desc: "Access all tools instantly from a secure, lightning-fast cloud dashboard with one-click login and 24/7 support." },
  { icon: BarChart2, title: "Budget-Friendly Pricing",   desc: "Get 80+ premium learning tools at the lowest shared pricing and save up to 80% every month." },
  { icon: Clock,     title: "Single Tools & Packages",   desc: "Flexible access options including single tools and complete bundles for individuals and teams." },
  { icon: Shield,    title: "100% No-Risk Guarantee",    desc: "Try our service risk-free with a 3-Day Money-Back Guarantee. Not satisfied? Get a full refund instantly." },
]

const REVIEWS = [
  {
    stars: 5,
    text: '"এই কোর্স ও রিসোর্স দেওয়ার জন্য আন্তরিক ধন্যবাদ। আশা করি এগুলো থেকে অনেক কিছু শিখতে পারব। সবাই নিতে পারেন কোনো সমস্যা নেই।"',
    name: "Rokibul Hassan Rakib",
    role: "SkillEduStore Customer",
    abbr: "RH",
  },
  {
    stars: 5,
    text: '"Great service and support, always recommended. অর্ডার দেওয়ার পর খুব দ্রুত রেসপন্স পেয়েছি। পেমেন্ট করার পর দ্রুত অ্যাক্সেস দিয়েছে, কোনো ঝামেলা হয়নি।"',
    name: "M. Shah",
    role: "SkillEduStore Customer",
    abbr: "MS",
  },
  {
    stars: 5,
    text: '"Their service and customer support is satisfactory. I took their Udemy Business subscription recently and didn\'t face any problem. The access was instant and everything worked perfectly."',
    name: "Ariful Islam Roni",
    role: "SkillEduStore Customer",
    abbr: "AI",
  },
]

const FAQS = [
  {
    q: "How does shared access work?",
    a: "We purchase premium licenses and provide isolated, secure access to each subscriber. You get your own private session — no shared logins, no data leakage between users.",
  },
  {
    q: "Is my learning data private?",
    a: "Yes. Every session is fully isolated. Your course progress, certificates, and activity are never visible to other subscribers.",
  },
  {
    q: "What happens when my subscription expires?",
    a: "Access is automatically revoked when your plan ends. You'll receive reminders before expiry so you can renew without interruption.",
  },
  {
    q: "Can I switch plans or add individual tools?",
    a: "Absolutely. You can upgrade, downgrade, or add à la carte tools at any time from your dashboard.",
  },
  {
    q: "Do you offer refunds?",
    a: "SkillEduStore will initiate a refund only when any primary service or tool does not work for three or more consecutive days. Contact support and we'll process it immediately.",
  },
]

export default async function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#03050a] pt-28 pb-16 lg:pt-36 lg:pb-24">

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-cyan-600/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* ── LEFT ── */}
            <div className="space-y-7">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/20 rounded-full px-3.5 py-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                </span>
                <span className="text-[11px] font-semibold text-cyan-400 tracking-widest uppercase">
                  2,000+ happy learners trust SkillEduStore
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <h1 className="text-[2.4rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-extrabold leading-[1.1] tracking-tight">
                  <span className="text-white">Learn smarter today.</span>
                </h1>
                <h1 className="text-[2.4rem] sm:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-extrabold leading-[1.1] tracking-tight">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    One affordable plan.
                  </span>
                </h1>
              </div>

              {/* Sub */}
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-md">
                Access <span className="text-white font-medium">80+ premium learning tools</span> — Udemy, Coursera, LinkedIn Learning & more — at group-buy pricing. Up to <span className="text-cyan-400 font-medium">80% off retail</span>.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/tools">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20 transition-all duration-200 group text-sm px-6">
                    Get Started — ৳450/month
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/tools">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-700 bg-gray-800/40 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 text-sm px-6">
                    View Dashboard
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 pt-2 border-t border-gray-800/60">
                {[
                  { val: "80+",  label: "Learning tools", color: "text-blue-400" },
                  { val: "2K+",  label: "Happy users",    color: "text-emerald-400" },
                  { val: "99.9%",label: "Uptime SLA",     color: "text-violet-400" },
                  { val: "৳0",   label: "Setup fee",      color: "text-cyan-400" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={`text-lg sm:text-xl font-bold ${s.color}`}>{s.val}</p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5 whitespace-nowrap">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2">
                {["SSL secured", "Private sessions", "Instant access", "18/7 support"].map(b => (
                  <span key={b} className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 bg-gray-800/50 border border-gray-700/50 rounded-full px-3 py-1">
                    <CheckCircle className="h-3 w-3 text-cyan-400 flex-shrink-0" />{b}
                  </span>
                ))}
              </div>
            </div>

            {/* ── RIGHT — feature cards ── */}
            <div className="hidden lg:flex flex-col gap-3">

              {/* Top row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: BarChart2, label: "80+ Tools",    sub: "In one dashboard",  color: "from-blue-500 to-cyan-500",     text: "text-blue-400" },
                  { icon: Sparkles,  label: "80% Savings",  sub: "vs retail pricing", color: "from-violet-500 to-purple-500", text: "text-violet-400" },
                ].map(c => (
                  <div key={c.label} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 group">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.color} p-0.5 mb-3 shadow-lg`}>
                      <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                        <c.icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                    </div>
                    <p className="text-white font-semibold text-sm">{c.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.sub}</p>
                  </div>
                ))}
              </div>

              {/* Big card */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-semibold text-sm">Popular tools</p>
                  <span className="text-[10px] text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-2 py-0.5">Active</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { abbr: "U",  name: "Udemy Business",    price: "৳450/mo", color: "from-orange-500 to-amber-500" },
                    { abbr: "C",  name: "Coursera Plus",     price: "৳450/mo", color: "from-blue-500 to-indigo-500" },
                    { abbr: "L",  name: "LinkedIn Learning", price: "৳450/mo", color: "from-teal-500 to-emerald-500" },
                    { abbr: "Sk", name: "Skillshare",        price: "৳450/mo", color: "from-green-500 to-lime-500" },
                  ].map(t => (
                    <div key={t.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                        {t.abbr}
                      </div>
                      <span className="text-gray-200 text-xs font-medium flex-1">{t.name}</span>
                      <span className="text-cyan-400 text-xs font-semibold">From {t.price}</span>
                    </div>
                  ))}
                </div>
                <Link href="/tools" className="block mt-4">
                  <div className="text-center text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">
                    View all 80+ tools →
                  </div>
                </Link>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: "Private Sessions", sub: "No shared accounts", color: "from-emerald-500 to-green-500",  text: "text-emerald-400" },
                  { icon: Zap,    label: "Instant Access",   sub: "Active in seconds",  color: "from-yellow-500 to-orange-500", text: "text-yellow-400" },
                ].map(c => (
                  <div key={c.label} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-4 hover:border-gray-700 transition-all duration-300">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${c.color} p-0.5 mb-3 shadow-lg`}>
                      <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                        <c.icon className={`w-4 h-4 ${c.text}`} />
                      </div>
                    </div>
                    <p className="text-white font-semibold text-sm">{c.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.sub}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── TOOLS GRID ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">80+ Premium Learning Tools</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Every Platform Your <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Growth Needs</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
              Access industry-leading learning platforms at group-buy pricing — up to 80% off retail.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {TOOLS.map((tool) => (
              <Card key={tool.name} className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10 space-y-3 p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                      {tool.abbr}
                    </div>
                    <div>
                      <CardTitle className="text-base text-white font-bold">{tool.name}</CardTitle>
                      <span className="text-xs text-cyan-400 font-semibold">From {tool.from}/mo</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-400">{tool.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tools">
              <Button variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                View all 80+ tools →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Simple, <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400">Choose a package that fits your schedule. Save more by committing longer.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl p-6 border transition-all duration-300
                ${plan.highlight
                  ? "bg-gradient-to-br from-blue-900/40 to-cyan-900/30 border-blue-500/50 shadow-xl shadow-blue-500/20 scale-105"
                  : "bg-gray-900/50 border-gray-800/50 hover:border-gray-700"}`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{plan.desc}</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">
                  {plan.price}<span className="text-base text-gray-400 font-normal">{plan.period}</span>
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.tools.map(t => (
                    <li key={t} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />{t}
                    </li>
                  ))}
                </ul>
                <Link href="/tools" className="block">
                  <Button className={`w-full ${plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                    : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"}`}>
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get Started in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3 Simple Steps</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join our platform in seconds. Explore your personalized dashboard and instantly access all the tools you need to learn, create, and grow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Register Account", desc: "Create your free account on SkillEduStore in just a few clicks to unlock a world of learning." },
              { step: "02", title: "Visit Dashboard",  desc: "Log in to your dashboard where all your courses and powerful tools are neatly organized for you." },
              { step: "03", title: "Start Learning",   desc: "Click 'Access Now' on any course to start your journey instantly — no complex setup required." },
            ].map(s => (
              <div key={s.step} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">{s.step}</span>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SkillEduStore?</span>
            </h2>
            <p className="text-gray-400">Join 2,000+ learners who rely on SkillEduStore — the most trusted and affordable learning tools platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {FEATURES.map(f => (
              <Card key={f.title} className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <CardHeader className="relative z-10 space-y-4 p-5 sm:p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white font-bold">{f.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-400">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2,000+ Learners</span>
            </h2>
            <p className="text-gray-400">Real results from real learners using SkillEduStore every day.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {REVIEWS.map(r => (
              <div key={r.name} className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 space-y-4 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex gap-1">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    {r.abbr}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{r.name}</p>
                    <p className="text-gray-500 text-xs">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#0a0d14]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-gray-400">Everything you need to know before getting started.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map(faq => (
              <div key={faq.q} className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0a0d14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-2xl p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Start Learning <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Smarter Today</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Join 2,000+ learners saving thousands per year with SkillEduStore. 3-year proven experience, 100% no-risk guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-200 group">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                  See the Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://skilledustore.com"),
  title: "SkillEduStore — Learn Smarter Today | 80+ Premium Learning Tools",
  description: "Access 80+ premium learning platforms — Udemy, Coursera, LinkedIn Learning & more — at group-buy pricing. Up to 80% off retail. 2,000+ happy learners. Instant access.",
  keywords: ["udemy group buy", "coursera cheap", "linkedin learning access", "skillshare group buy", "online courses Bangladesh", "premium learning tools"],
  authors: [{ name: "SkillEduStore" }],
  creator: "SkillEduStore",
  publisher: "SkillEduStore",
  openGraph: {
    title: "SkillEduStore — Learn Smarter Today",
    description: "Access 80+ premium learning platforms at group-buy pricing. Up to 80% off retail.",
    url: "https://skilledustore.com",
    siteName: "SkillEduStore",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SkillEduStore" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillEduStore — Learn Smarter Today",
    description: "Access 80+ premium learning platforms at group-buy pricing. Up to 80% off retail.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
}