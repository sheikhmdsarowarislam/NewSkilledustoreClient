import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, BarChart2, Users, ArrowRight, CheckCircle, Star, Globe, Lock, Sparkles } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About SEOVault — Premium Group-Buy SEO Tools",
  description: "Learn how SEOVault gives 12,400+ SEO professionals access to Ahrefs, SEMrush, Moz and 40+ premium tools at group-buy pricing.",
}

const STATS = [
  { val: "12,400+", label: "Active subscribers",  color: "from-blue-400 to-cyan-400" },
  { val: "40+",     label: "Premium SEO tools",   color: "from-violet-400 to-purple-400" },
  { val: "99.8%",   label: "Platform uptime",     color: "from-emerald-400 to-green-400" },
  { val: "90%",     label: "Savings vs retail",   color: "from-orange-400 to-amber-400" },
]

const TEAM = [
  { name: "Rafi Khan",    role: "Founder & CEO",          abbr: "RK", color: "from-blue-500 to-cyan-500",    bio: "10+ years in SEO & SaaS. Built SEOVault to make enterprise tools accessible to every marketer." },
  { name: "Sarah Lin",    role: "Head of Product",         abbr: "SL", color: "from-violet-500 to-purple-500", bio: "Former Moz engineer. Obsessed with building tools that actually make SEOs faster and smarter." },
  { name: "Alex Morales", role: "Head of Infrastructure",  abbr: "AM", color: "from-emerald-500 to-green-500", bio: "Built the isolated session architecture that keeps every user's data private and secure." },
]

const VALUES = [
  { icon: Shield,   title: "Privacy First",      desc: "Every user gets isolated, encrypted sessions. Your data is yours — always.",              color: "from-blue-500 to-cyan-500",    text: "text-blue-400" },
  { icon: Zap,      title: "Instant Everything",  desc: "No waiting lists. No manual setup. Subscribe and you're in within seconds.",              color: "from-yellow-500 to-orange-500", text: "text-yellow-400" },
  { icon: Globe,    title: "Always Available",    desc: "99.8% uptime SLA with redundant infrastructure so your work never stops.",               color: "from-emerald-500 to-green-500", text: "text-emerald-400" },
  { icon: BarChart2, title: "Radical Savings",   desc: "Group-buy model means you pay a fraction of what these tools cost individually.",         color: "from-violet-500 to-purple-500", text: "text-violet-400" },
  { icon: Lock,     title: "No Shared Logins",   desc: "Unlike other group-buy services, we never share credentials. Private sessions only.",     color: "from-rose-500 to-pink-500",    text: "text-rose-400" },
  { icon: Users,    title: "Community Driven",   desc: "Tool requests come from our users. If 50+ people want a tool, we add it.",                color: "from-cyan-500 to-teal-500",    text: "text-cyan-400" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#03050a]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/20 rounded-full px-3.5 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-cyan-400 tracking-widest uppercase">Our Story</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">Built by SEOs,</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              for SEOs.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
            SEOVault started with a simple frustration — premium SEO tools cost thousands per year, putting them out of reach for freelancers, small agencies, and growing teams. We built a better way.
          </p>

          <Link href="/tools">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20 group px-8">
              Explore our tools
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.val}</p>
                <p className="text-xs text-gray-500 font-medium mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Enterprise SEO power,<br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">startup pricing.</span>
              </h2>
              <p className="text-gray-400 leading-relaxed">
                The SEO industry has a pricing problem. The best tools — Ahrefs, SEMrush, Moz — charge hundreds per month. Solo SEOs and small agencies are forced to choose between capabilities or cost.
              </p>
              <p className="text-gray-400 leading-relaxed">
                SEOVault pools subscriptions so everyone pays less. You get full, private access to every tool you need — without the enterprise price tag.
              </p>
              <div className="space-y-2.5">
                {["No shared passwords or credentials", "Isolated sessions for every user", "Full tool access — not limited versions", "Cancel or change plans anytime"].map(item => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <CheckCircle className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-6 space-y-4">
              <p className="text-white font-semibold text-sm mb-2">What makes us different</p>
              {[
                { label: "Other group-buy services", items: ["Shared logins", "No privacy", "Unreliable access", "No support"], bad: true },
                { label: "SEOVault",                 items: ["Private sessions", "Encrypted access", "99.8% uptime", "24/7 support"], bad: false },
              ].map(col => (
                <div key={col.label} className={`rounded-xl p-4 border ${col.bad ? "bg-red-900/10 border-red-500/20" : "bg-blue-900/10 border-blue-500/20"}`}>
                  <p className={`text-xs font-semibold mb-3 ${col.bad ? "text-red-400" : "text-cyan-400"}`}>{col.label}</p>
                  <div className="space-y-2">
                    {col.items.map(item => (
                      <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
                        <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${col.bad ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                          {col.bad ? "✕" : "✓"}
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 sm:py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Our Values</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              What we stand <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">for</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(v => (
              <Card key={v.title} className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <CardHeader className="relative z-10 space-y-4 p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-[#0a0d14] rounded-[9px] flex items-center justify-center">
                      <v.icon className={`h-4 w-4 ${v.text}`} />
                    </div>
                  </div>
                  <CardTitle className="text-base text-white font-bold">{v.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-400">{v.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 sm:py-20 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">The Team</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              The people behind <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">SEOVault</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(t => (
              <div key={t.name} className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300 hover:scale-[1.02]">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg`}>
                  {t.abbr}
                </div>
                <h3 className="text-white font-semibold">{t.name}</h3>
                <p className="text-cyan-400 text-xs font-medium mt-0.5 mb-3">{t.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to save thousands<br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">on SEO tools?</span>
            </h2>
            <p className="text-gray-400 mb-8">Join 12,400+ professionals already using SEOVault.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tools">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20 group px-8">
                  Get started for $9/mo
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-gray-700 bg-gray-800/40 text-gray-300 hover:bg-gray-800 hover:text-white px-8">
                  Talk to us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}