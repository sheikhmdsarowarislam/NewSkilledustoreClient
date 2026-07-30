import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#07040d] border-t border-purple-900/30">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#07040d] rounded-[9px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-fuchsia-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">SkilleduStore</h3>
                <p className="text-xs text-fuchsia-400 font-medium">
                  Learn & Grow
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              SkilledUStore is your trusted destination for premium digital products, tools, and online resources. We provide reliable solutions at competitive prices to help individuals, creators, and businesses succeed online.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-fuchsia-300 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-fuchsia-300 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-purple-950/30 border border-purple-800/30 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/40 text-gray-400 hover:text-fuchsia-300 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Learn Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-purple-500 to-fuchsia-500 rounded-full"></span>
              Learn
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/courses"
                  className="text-gray-400 hover:text-fuchsia-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-fuchsia-400 transition-colors"></span>
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-fuchsia-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-fuchsia-400 transition-colors"></span>
                  My Dashboard
                </Link>
              </li>
              
              <li>
                <Link
                  href="/dashboard/certificates"
                  className="text-gray-400 hover:text-fuchsia-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-fuchsia-400 transition-colors"></span>
                  Certificates
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-violet-400 transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-violet-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-violet-400 transition-colors"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-fuchsia-500 to-pink-500 rounded-full"></span>
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/refund"
                  className="text-gray-400 hover:text-pink-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-pink-400 transition-colors"></span>
                  Refund & Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-pink-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-pink-400 transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-pink-400 transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-purple-800 group-hover:bg-pink-400 transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-900/30 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © {currentYear} SkilleduStore. All Rights Reserved
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 hover:border-fuchsia-500/40 text-gray-300 hover:text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 group shadow-lg shadow-purple-950/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:-translate-y-0.5 transition-transform duration-300 text-fuchsia-400"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}