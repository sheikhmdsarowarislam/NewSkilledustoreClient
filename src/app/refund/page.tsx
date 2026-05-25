import type { Metadata } from "next"
import { Mail, Phone, MessageCircle, CheckCircle, XCircle, ChevronRight, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy | SkillEduStore",
  description: "Learn about SkillEduStore refund eligibility, processing procedures, and our commitment to customer satisfaction.",
}

const REFUND_ELIGIBLE = [
  {
    number: "1",
    title: "Account Performance Issues",
    desc: "If you encounter any functionality problems with your purchased account, our support team will work diligently to resolve the issue. However, if the account remains non-functional after 24 hours from the time you reported the issue to our support team, you become eligible for a refund request.",
  },
  {
    number: "2",
    title: "Main Account Coverage",
    desc: "For subscription packages that include multiple accounts, please note that refund eligibility applies exclusively to the primary account(s) included in your package. Additional bonus accounts or complimentary accounts provided with your purchase are not eligible for refund consideration.",
  },
  {
    number: "3",
    title: "Proportional Refund Calculation",
    desc: "When a refund is approved, we calculate the number of days you actively used the service. The cost corresponding to these utilized days will be deducted from your total payment, and the remaining balance will be refunded to you.",
    important: true,
  },
]

const NON_REFUNDABLE = [
  "Incorrect Product Selection: If you mistakenly purchase the wrong subscription plan or package, we cannot offer refunds or exchanges. Please carefully review your selection before completing your purchase.",
  "Bonus Account Issues: Problems or limitations related to bonus accounts that come bundled with your package are not covered under our refund policy.",
  "Unauthorized reselling or distribution of accounts purchased from SkilledUStore",
  "Accessing accounts from more devices than permitted by your subscription plan",
  "Account sharing with unauthorized users",
  "Any form of misuse or unauthorized activities",
]

const STEPS = [
  {
    step: "01",
    title: "Submit Your Request",
    desc: "Contact our support team through email or WhatsApp with detailed information about your issue, including your purchase details and account information.",
  },
  {
    step: "02",
    title: "Evaluation Period",
    desc: "Our team will review your request within 3 business days and communicate our decision promptly.",
  },
  {
    step: "03",
    title: "Refund Initiation",
    desc: "Once approved, refunds are processed using your original payment method within 3-7 business days.",
  },
]

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#03050a]">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Refund{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Your satisfaction is our priority. Please read our policy carefully.
          </p>
          <p className="text-gray-500 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">

        {/* Intro */}
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            At <span className="text-white font-semibold">SkilledUStore</span>, we are committed to delivering premium services and ensuring complete customer satisfaction. Due to the unique nature of our digital subscription services, we have developed a transparent refund policy to maintain fairness for all our valued customers.
          </p>
        </div>

        {/* Refund Eligibility */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <h2 className="text-white font-bold text-xl">Refund Eligibility</h2>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            We prioritize your satisfaction and have designed our refund system to be fair and transparent. Here is everything you need to know:
          </p>

          {/* Flexible timeline highlight */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-emerald-300 text-sm leading-relaxed">
              <span className="font-semibold">Flexible Refund Timeline:</span> Unlike many services, you can request a refund at any point during your active subscription period — not just within the first few days of purchase.
            </p>
          </div>

          <div className="space-y-4">
            {REFUND_ELIGIBLE.map((item) => (
              <div key={item.number} className={`rounded-xl p-5 border ${item.important ? "bg-amber-500/5 border-amber-500/20" : "bg-gray-800/30 border-gray-700/30"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {item.number}
                  </div>
                  <h3 className={`font-semibold text-sm ${item.important ? "text-amber-300" : "text-white"}`}>
                    {item.important && "Important: "}{item.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Refundable */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <h2 className="text-white font-bold text-xl">Non-Refundable Situations</h2>
          </div>
          <p className="text-gray-400 text-sm mb-5">
            To maintain service integrity and protect all our customers, refunds cannot be issued in the following circumstances:
          </p>
          <ul className="space-y-3">
            {NON_REFUNDABLE.map((item, index) => (
              <li key={index} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl p-3">
                <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Refund Steps */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <h2 className="text-white font-bold text-xl">Refund Processing Procedure</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STEPS.map((s) => (
              <div key={s.step} className="bg-gray-800/30 border border-gray-700/30 rounded-xl p-5 group hover:border-blue-500/30 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">{s.step}</span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-white font-semibold">Processing Time:</span> After initiation, it may take 5-7 business days for the refund amount to reflect in your bank account, depending on your financial institution.
            </p>
          </div>
        </div>

        {/* Service Downtime */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <h2 className="text-white font-bold text-xl">Service Downtime and Stability</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            We maintain high service availability standards. If you experience extended downtime with a stable service, you may qualify for compensation. Our technical team works around the clock to minimize any service interruptions and resolve issues swiftly.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            For tools or services marked as <span className="text-white font-medium">Stable</span>, if functionality is unavailable for more than <span className="text-white font-medium">72 consecutive hours</span> and our team cannot provide an immediate solution, you may be eligible for a refund or service credit.
          </p>
        </div>

        {/* Subscription Management */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5 flex-shrink-0">
              <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <h2 className="text-white font-bold text-xl">Subscription Management</h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            SkilledUStore does not operate on automatic renewal systems. When your subscription period ends, your access will be automatically discontinued. You can choose to renew by purchasing a new plan at any time, giving you complete control over your subscription.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-xl mb-2">Get In Touch</h2>
          <p className="text-gray-400 text-sm mb-6">Have questions about our refund policy or need assistance? We are here to help!</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="mailto:skilledustore@gmail.com" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email Support</p>
                <p className="text-white text-xs font-medium group-hover:text-blue-400 transition-colors">skilledustore@gmail.com</p>
              </div>
            </a>
            <a href="tel:+8801234567890" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl p-4 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">WhatsApp Support</p>
                <p className="text-white text-xs font-medium group-hover:text-emerald-400 transition-colors">+880 1234-567890</p>
                <p className="text-gray-600 text-[10px]">10 AM - 11 PM (GMT+6)</p>
              </div>
            </a>
            <div className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-violet-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Live Chat</p>
                <p className="text-white text-xs font-medium">Available on website</p>
                <p className="text-gray-600 text-[10px]">10 AM - 11 PM (GMT+6)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center">
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
            Thank you for choosing <span className="text-white font-medium">SkilledUStore</span>. We appreciate your trust and are committed to providing exceptional service. Please review your subscription details carefully before purchase to ensure the best experience.
          </p>
        </div>

      </div>
    </div>
  )
}