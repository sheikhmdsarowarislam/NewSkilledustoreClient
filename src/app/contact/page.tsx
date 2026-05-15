"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, Clock, CheckCircle, ArrowRight, Sparkles, Send } from "lucide-react"

const CONTACT_OPTIONS = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    desc: "Chat with our support team in real time.",
    action: "Start chat",
    color: "from-blue-500 to-cyan-500",
    text: "text-blue-400",
    available: true,
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "Send us a message and we'll reply within 24 hours.",
    action: "support@seovault.com",
    color: "from-violet-500 to-purple-500",
    text: "text-violet-400",
    available: true,
  },
  {
    icon: Clock,
    title: "Response Time",
    desc: "We typically reply within a few hours on business days.",
    action: "Mon–Sat, 9am–9pm",
    color: "from-emerald-500 to-green-500",
    text: "text-emerald-400",
    available: true,
  },
]

const FAQS = [
  { q: "How quickly will I get access after subscribing?",    a: "Instantly. Once payment is confirmed your session is activated within seconds — no manual steps needed." },
  { q: "Can I request a tool that's not listed?",             a: "Yes! Use the contact form below and mention which tool you need. We add tools based on user demand." },
  { q: "What if I have trouble accessing a tool?",            a: "Contact support via the form or live chat. We resolve access issues within 2 hours on average." },
  { q: "Do you offer refunds?",                               a: "We offer a 24-hour refund if you haven't accessed any tools. Contact us immediately after subscribing." },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Simulate send — replace with your actual API call
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setSending(false)
  }

  const setField = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-[#03050a]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-32 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/8 border border-blue-500/20 rounded-full px-3.5 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-cyan-400 tracking-widest uppercase">Get in touch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            <span className="text-white">We're here</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
              to help.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl mx-auto">
            Have a question about pricing, tools, or your account? Our team typically responds within a few hours.
          </p>
        </div>
      </section>

      {/* ── CONTACT OPTIONS ── */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CONTACT_OPTIONS.map(opt => (
              <Card key={opt.title} className="group relative overflow-hidden bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                <CardHeader className="relative z-10 space-y-4 p-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${opt.color} p-0.5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <div className="w-full h-full bg-[#0a0d14] rounded-[9px] flex items-center justify-center">
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
      <section className="py-12 border-t border-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Contact Form */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Send a message</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Drop us a <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">line</span>
                </h2>
              </div>

              {sent ? (
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Message sent!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                    className="mt-5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setField("name", e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setField("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Subject</label>
                    <input
                      value={form.subject}
                      onChange={e => setField("subject", e.target.value)}
                      placeholder="What's this about?"
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setField("message", e.target.value)}
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                      className="w-full bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending || !form.name || !form.email || !form.message}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20 gap-2 disabled:opacity-50"
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
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-3">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Quick answers</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Common <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">questions</span>
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map(faq => (
                  <div key={faq.q} className="bg-gray-900/60 border border-gray-800/50 rounded-xl p-4 hover:border-blue-500/20 transition-all duration-300">
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
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-400 mb-8">Access 40+ premium SEO tools starting at just $9/month.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/tools">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-0 shadow-lg shadow-blue-500/20 group px-8">
                  Browse all tools
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-gray-700 bg-gray-800/40 text-gray-300 hover:bg-gray-800 hover:text-white px-8">
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