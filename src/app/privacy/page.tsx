import type { Metadata } from "next"
import { Shield, Mail, Phone, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy | SkillEduStore",
  description: "Learn how SkillEduStore collects, uses, and protects your personal information.",
}

const SECTIONS = [
  {
    number: "1",
    title: "Data We Gather",
    content: null as string | null,
    subsections: [
      {
        title: "a. Personal Details",
        desc: "To deliver and optimize our platform, we gather the following personal information:",
        items: ["Full Name", "Email Contact", "Contact Number", "Billing Information", "Postal Address"],
      },
      {
        title: "b. Platform Activity Data",
        desc: "To refine our services and user experience, we monitor non-identifiable activity information such as:",
        items: ["Network Address (IP)", "Web Browser Details", "Hardware Information", "Navigation History", "Session Duration and Timestamps"],
      },
      {
        title: "c. Digital Tracking Methods",
        desc: "We implement cookies and related technologies for:",
        items: ["Optimizing platform operations", "Evaluating user engagement patterns"],
      },
    ] as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
  {
    number: "2",
    title: "Purpose of Data Collection",
    content: "The information we obtain serves the following purposes:" as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: ["Facilitating orders and service provision", "Improving platform functionality and user satisfaction"] as string[] | null,
    note: null as string | null,
  },
  {
    number: "3",
    title: "Information Protection",
    content: "Securing your information is paramount to us. We implement advanced encryption protocols to shield your data from unauthorized entry, modification, or exposure. However, we acknowledge that absolute security cannot be guaranteed in any digital system. We encourage responsible use of our services with this understanding." as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
  {
    number: "4",
    title: "Third-Party Disclosure",
    content: "Your personal details remain confidential and are not distributed to external entities, except when essential for:" as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: ["Transaction processing through payment gateways", "Meeting regulatory and legal requirements"] as string[] | null,
    note: null as string | null,
  },
  {
    number: "5",
    title: "Your Data Rights",
    content: "As a user, you are entitled to:" as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: ["View and obtain your stored information"] as string[] | null,
    note: "To exercise these privileges, reach out to us through the contact details provided at the end of this document." as string | null,
  },
  {
    number: "6",
    title: "Cookie Management",
    content: "Our platform utilizes cookies to enhance your browsing experience. Currently, we do not offer built-in cookie preference controls. However, you can manage or disable cookies through your browser configuration settings at any time." as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
  {
    number: "7",
    title: "Information Retention Period",
    content: "We maintain personal information only for the duration required to fulfill our service obligations and comply with applicable regulations. When information is no longer necessary, we ensure its secure and permanent deletion." as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
  {
    number: "8",
    title: "Minors Privacy Protection",
    content: "SkilledUstore platform is accessible to individuals of all ages, including minors under 18 years. We do not intentionally gather information from young users. We encourage parents and legal guardians to supervise their children online activities on our platform." as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
  {
    number: "9",
    title: "Policy Modifications",
    content: "We maintain the authority to revise this Privacy Policy as needed. Any amendments will be published on our website along with the revised effective date. We recommend periodic review of this policy to stay informed of any updates." as string | null,
    subsections: null as { title: string; desc: string; items: string[] }[] | null,
    items: null as string[] | null,
    note: null as string | null,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#03050a]">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Privacy{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-4">
            Your trust and privacy are our top priorities at SkilledUstore
          </p>
          <p className="text-gray-500 text-sm">Last updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8 mb-8">
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            At <span className="text-white font-semibold">SkilledUstore</span>, safeguarding your privacy and managing your personal data with care and transparency is our priority. This Privacy Policy describes what information we gather, the ways we utilize it, and the control you have over your information. When you access our platform, you consent to the terms outlined herein.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section) => (
            <div key={section.number} className="bg-gray-900/50 border border-gray-800/50 hover:border-blue-500/20 rounded-2xl p-6 sm:p-8 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {section.number}
                </div>
                <h2 className="text-white font-bold text-lg">{section.title}</h2>
              </div>
              {section.content && (
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-2 mb-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                      <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="text-gray-500 text-xs mt-3 italic">{section.note}</p>
              )}
              {section.subsections && (
                <div className="space-y-5 mt-2">
                  {section.subsections.map((sub) => (
                    <div key={sub.title} className="bg-gray-800/30 rounded-xl p-4">
                      <h3 className="text-white font-semibold text-sm mb-2">{sub.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{sub.desc}</p>
                      <ul className="space-y-1.5">
                        {sub.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                            <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800/50 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">10</span>
            </div>
            <h2 className="text-white font-bold text-lg">Get in Touch</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            For inquiries, concerns, or questions regarding this Privacy Policy or our data management practices, please reach us at:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="mailto:skilledustore@gmail.com" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Email</p>
                <p className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">skilledustore@gmail.com</p>
              </div>
            </a>
            <a href="tel:+8801311844364" className="flex items-center gap-3 bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/30 rounded-xl p-4 transition-all duration-200 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 flex-shrink-0">
                <div className="w-full h-full bg-[#0a0d14] rounded-[7px] flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Phone and WhatsApp</p>
                <p className="text-white text-sm font-medium group-hover:text-emerald-400 transition-colors">+880 1311-844364</p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
            By accessing SkilledUstore website and utilizing our services, you confirm your understanding and acceptance of this Privacy Policy. We appreciate your confidence in{" "}
            <span className="text-white font-medium">SkilledUstore</span> for your digital requirements.
          </p>
        </div>
      </div>
    </div>
  )
}