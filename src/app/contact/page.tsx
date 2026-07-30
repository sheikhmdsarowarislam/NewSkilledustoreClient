"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, CheckCircle, ArrowRight, Sparkles, Send, Phone, Facebook } from "lucide-react"

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: "WhatsApp Support",
    desc: "Chat with our support team on WhatsApp anytime.",
    action: "+880 1311-844364",
    color: "from-purple-500 to-fuchsia-500",
    text: "text-fuchsia-400",
    available: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "Send us a message and we'll reply within 24 hours.",
    action: "support@skilledustore.com",
    color: "from-violet-500 to-purple-500",
    text: "text-purple-300",
    available: true,
  },
  {
    icon: Clock,
    title: "Response Time",
    desc: "We typically reply within a few hours on business days.",
    action: "Available 18/7",
    color: "from-fuchsia-500 to-pink-500",
    text: "text-pink-400",
    available: true,
  },
]

const FAQS = [
  {
    q: "How do I get access to SkillEduStore courses?",
    a: "We provide comprehensive video tutorials with step-by-step instructions for accessing your Group Buy Tools. Additionally, our live chat support is available 18/7 to assist you at any time. Check our Device Management guide for setup instructions.",
  },
  {
    q: "What learning resources are included with courses?",
    a: "Our courses include comprehensive learning materials: HD video lectures, downloadable resources, practical exercises, quizzes, assignments, and community forums. Many courses also include source code, templates, checklists, and bonus materials.",
  },
  {
    q: "Do you provide shared or dedicated accounts?",
    a: "As a Group Buy service, SkillEduStore provides shared account access with custom access methods. This allows you to access premium design and marketing tools at significantly reduced costs.",
  },
  {
    q: "Can I use one account for both personal and business learning?",
    a: "SkillEduStore does not allow sharing access between multiple devices or locations. (Unless you have an additional IP) You cannot use one account from two different IPs or devices at a time; you can login on just 2 devices. To access SkillEduStore from both home and office at a time, you need to purchase additional IP. See our Terms of Service.",
  },
  {
    q: "Can I share my account or courses with others?",
    a: "No, you cannot share your account or access your account via proxies, VPNs, or RDPs. Account sharing or unauthorized access methods may result in a permanent ban on your SkillEduStore account. Review our Fair Usage Policy for details.",
  },
  {
    q: "Do you offer refunds?",
    a: "SkillEduStore will initiate a refund only when any primary service or tool does not work for three or more consecutive days. This ensures you receive reliable access to all Group Buy Tools you've subscribed to. View our complete Refund Policy.",
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setSending(false)
  }

  const setField = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-[#07040d]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-16 -right-32 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-3.5 py-1.5 mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-[11px] font-semibold text-purple-300 tracking-widest uppercase">Get in touch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            <span className="text-white">We're here</span><br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
              to help.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
            Have a question about pricing, tools, or your account? Our team typically responds within a few hours.
          </p>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://wa.me/8801311844364"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/30 hover:border-fuchsia-400/60 rounded-full px-4 py-2 text-fuchsia-300 text-xs font-semibold transition-all hover:bg-fuchsia-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp: 01311844364
            </a>
            <a
              href="https://facebook.com/skilledustore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 hover:border-purple-400/60 rounded-full px-4 py-2 text-purple-300 text-xs font-semibold transition-all hover:bg-purple-500/20"
            >
              <Facebook className="w-3.5 h-3.5" />
              @skilledustore
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT OPTIONS ── */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONTACT_OPTIONS.map(opt => (
              <Card key={opt.title} className="group relative overflow-hidden bg-[#120822]/50 border-purple-900/30 hover:border-fuchsia-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/40 hover:scale-[1.02]">
                <CardHeader className="relative z-10 space-y-4 p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-[#07040d] rounded-[9px] flex items-center justify-center">
                      <opt.icon className={`h-4 w-4 ${opt.text}`} />
                    </div>
                  </div>
                  <CardTitle className="text-base text-white font-bold">{opt.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-400">{opt.desc}</CardDescription>
                  <p className={`text-xs font-semibold ${opt.text}`}>{opt.action}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + FAQ ── */}
      <section className="py-12 border-t border-purple-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Contact Form */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Send a message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Drop us a <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">line</span>
                </h2>
              </div>

              {sent ? (
                <div className="bg-fuchsia-950/20 border border-fuchsia-500/30 rounded-2xl p-8 text-center shadow-xl shadow-purple-950/50">
                  <div className="w-14 h-14 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-7 w-7 text-fuchsia-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Message sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                    className="mt-5 text-xs text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-purple-200/70 mb-1 block">Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setField("name", e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full bg-[#120822]/60 border border-purple-900/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-purple-200/70 mb-1 block">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setField("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-[#120822]/60 border border-purple-900/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-purple-200/70 mb-1 block">Subject</label>
                    <input
                      value={form.subject}
                      onChange={e => setField("subject", e.target.value)}
                      placeholder="What's this about?"
                      className="w-full bg-[#120822]/60 border border-purple-900/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-purple-200/70 mb-1 block">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setField("message", e.target.value)}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      className="w-full bg-[#120822]/60 border border-purple-900/40 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-fuchsia-500 transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending || !form.name || !form.email || !form.message}
                    className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {sending ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
                      </>
                    )}
                  </Button>

                  {/* Quick contact links below form */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://wa.me/8801311844364"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 rounded-xl px-4 py-2.5 text-fuchsia-300 text-xs font-semibold transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp Us
                    </a>
                    <a
                      href="https://facebook.com/skilledustore"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 rounded-xl px-4 py-2.5 text-purple-300 text-xs font-semibold transition-all"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                      Facebook Page
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">Quick answers</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Common <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">questions</span>
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map(faq => (
                  <div key={faq.q} className="bg-[#120822]/50 border border-purple-900/30 rounded-xl p-4 hover:border-fuchsia-500/30 transition-all duration-300">
                    <h3 className="text-white font-medium text-sm mb-1.5">{faq.q}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t border-purple-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#180e2e]/80 via-[#120822]/60 to-[#180e2e]/80 border border-purple-800/40 rounded-2xl p-12 text-center shadow-2xl shadow-purple-950/50">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8">Access 100+ premium SEO tools at group-buy pricing. Available 18/7 support.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tools">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg shadow-purple-600/30 group px-8">
                  Browse all tools
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-purple-800/40 text-purple-200 hover:bg-purple-900/40 hover:text-white px-8">
                  Learn about us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}