import { CheckCircle } from "lucide-react";
import Link from "next/link";

const TOOLS = [
  {
    abbr: "C",
    name: "Coursera Plus",
    desc: "Unlimited access to world-class university courses from top institutions like Stanford, Yale, and Google. Master's degrees in computer science, business, data analytics, and more with flexible learning schedules.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    abbr: "L",
    name: "LinkedIn Learning",
    desc: "Professional development platform with expert-led courses in business, technology, and creative skills. Build your career with personalized recommendations and earn certificates recognized by employers.",
    color: "from-teal-500 to-emerald-500",
  },
  {
    abbr: "U",
    name: "Udemy Business",
    desc: "Access thousands of premium courses in programming, design, marketing, and business. Learn from industry experts with hands-on projects and lifetime access to course materials.",
    color: "from-orange-500 to-amber-500",
  },
  {
    abbr: "S",
    name: "Skillshare",
    desc: "Creative learning community offering thousands of classes in design, photography, illustration, and entrepreneurship. Join project-based learning with unlimited content access.",
    color: "from-green-500 to-lime-500",
  },
  {
    abbr: "G",
    name: "Grammarly Premium",
    desc: "Professional writing assistant with advanced grammar checking, clarity improvements, and tone detection. Get real-time suggestions for better communication and plagiarism detection.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    abbr: "R",
    name: "GoRails",
    desc: "Comprehensive Ruby on Rails tutorials and screencasts for web developers. Build full-stack applications with practical video lessons and learn best practices for modern web development.",
    color: "from-red-500 to-rose-500",
  },
  {
    abbr: "E",
    name: "Educative.io",
    desc: "Interactive coding platform for software engineering and system design. Master algorithms, data structures, and technical interview preparation with hands-on coding environments.",
    color: "from-violet-500 to-purple-500",
  },
  {
    abbr: "B",
    name: "Blinkist",
    desc: "Read or listen to key insights from thousands of bestselling nonfiction books in just 15 minutes. Access curated summaries from business, self-help, and productivity books.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    abbr: "P",
    name: "Pluralsight",
    desc: "Technology skills platform for IT professionals and developers. Master cloud computing, cybersecurity, and data science with hands-on labs and personalized learning paths.",
    color: "from-pink-500 to-rose-500",
  },
  {
    abbr: "C",
    name: "ChatGPT Plus",
    desc: "Your personal AI learning and writing assistant. Get instant help with research, coding, content creation, and problem-solving with faster response times and priority access.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    abbr: "S",
    name: "Scribd Premium",
    desc: "Digital library with unlimited access to millions of books, audiobooks, magazines, and documents. Explore bestsellers, academic papers, and research materials all in one platform.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    abbr: "H",
    name: "HIX AI Writer",
    desc: "Professional AI-powered writing tool for creating articles, blog posts, and marketing content. Generate high-quality, SEO-optimized content with advanced writing features.",
    color: "from-sky-500 to-cyan-500",
  },
  {
    abbr: "G",
    name: "Gamma.app Pro",
    desc: "Smart AI tool for creating stunning presentations, documents, and portfolios in minutes. Design professional slides with AI-powered layouts and beautiful templates.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    abbr: "C",
    name: "Canva Pro",
    desc: "Professional graphic design platform with premium templates, stock photos, and design assets. Create stunning visuals and marketing materials with drag-and-drop interface.",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    abbr: "D",
    name: "DataCamp",
    desc: "Master data science and analytics through interactive coding challenges. Learn Python, R, SQL, machine learning, and data visualization with hands-on exercises and career tracks.",
    color: "from-lime-500 to-green-500",
  },
  {
    abbr: "Q",
    name: "QuillBot",
    desc: "Intelligent paraphrasing and writing enhancement tool. Rewrite sentences, improve clarity, check grammar, and maintain original meaning while creating unique content.",
    color: "from-amber-500 to-yellow-500",
  },
];

export default function LpToolListPage() {
  return (
    <div className="min-h-screen bg-[#03050a]">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 via-[#03050a] to-cyan-900/20 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Learning Package
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Learning Package{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Tools
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Enhance your skills with premium learning resources
          </p>

          <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-gray-800/60">
            {[
              { val: "16+", label: "Premium Tools", color: "text-blue-400" },
              { val: "80%", label: "Off Retail", color: "text-emerald-400" },
              { val: "18/7", label: "Support", color: "text-cyan-400" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>
                  {s.val}
                </p>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {TOOLS.map((tool, index) => (
            <div
              key={`${tool.name}-${index}`}
              className="group relative bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800/50 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}
                    >
                      {tool.abbr}
                    </div>
                    <h3 className="text-white font-bold text-sm leading-tight">
                      {tool.name}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                </div>

                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                  {tool.desc}
                </p>

                <div
                  className={`w-full text-center py-2 rounded-xl bg-gradient-to-r ${tool.color} text-white text-xs font-semibold opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Access Now
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 border border-gray-800/50 rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Get Started?
            </span>
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
            Access all 16+ premium learning tools at group-buy pricing. Save up
            to 80% off retail.
          </p>
          <Link href="/tools" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20">
  View All Packages
</Link>
        </div>
      </div>
    </div>
  );
}
