"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import {
  User,
  LogOut,
  Settings,
  GraduationCap,
} from "lucide-react";
import { useSession } from "@/lib/hooks/use-session";
import { useState } from "react";
import { NotificationDropdown } from "@/components/shared/NotificationDropdown";

// Reusable NavLink Component
const NavLink = ({
  href,
  children,
  pathname,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
  className?: string;
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded-lg transition-all duration-300 text-base ${
        isActive
          ? "bg-purple-500/15 text-white font-semibold border border-purple-500/30"
          : "text-gray-300 hover:text-white hover:bg-purple-950/30 font-medium"
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

  return (
    <>
      <nav
        className="w-full fixed top-0 left-0 right-0 bg-[#07040d]/95 backdrop-blur-md border-b border-purple-900/30 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-fuchsia-600/5 to-pink-600/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between relative">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="group" aria-label="CodeTutor Home">
              <h1 className="font-bold w-auto h-9 flex items-center text-white justify-center gap-2.5 transition-all duration-300">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-[#07040d] rounded-[8px] flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-fuchsia-400" />
                  </div>
                </div>
                <div className="flex text-base items-center gap-0.5">
                  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent font-bold">
                    Skilledu
                  </span>
                  <span className="text-white font-bold">Store</span>
                </div>
              </h1>
            </Link>
          </div>

          {/* Middle: Main Navigation */}
          <div className="hidden lg:flex space-x-1">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/tools" pathname={pathname}>
              Tools
            </NavLink>
            <NavLink href="/about" pathname={pathname}>
              About
            </NavLink>
            <NavLink href="/contact" pathname={pathname}>
              Contact
            </NavLink>
          </div>

          {/* Right: Dashboard + Notifications + Avatar */}
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="h-9 w-24 bg-purple-950/40 rounded-lg animate-pulse" />
                <div className="h-9 w-9 bg-purple-950/40 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <NavLink href="/dashboard" pathname={pathname}>
                  Dashboard
                </NavLink>

                {user?.role === "instructor" && (
                  <NavLink href="/instructor" pathname={pathname}>
                    Instructor
                  </NavLink>
                )}

                {user?.role === "admin" && (
                  <NavLink href="/admin" pathname={pathname}>
                    Admin
                  </NavLink>
                )}

                <NotificationDropdown />

                <div className="relative flex items-center">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="p-1 rounded-lg hover:bg-purple-900/30 transition-colors flex items-center justify-center"
                    aria-label="User menu"
                  >
                    {user?.avatar && !avatarError ? (
                      <Image
                        src={user.avatar}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full border-2 border-purple-500 hover:border-fuchsia-400 transition-colors object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:scale-110 transition-transform">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#120822] border border-purple-800/40 rounded-lg shadow-xl shadow-purple-950/80 py-1 z-50">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/40 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2 text-purple-400" />
                        Profile
                      </Link>
                      <Link
                        href="/profile/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-purple-900/40 hover:text-white"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2 text-purple-400" />
                        Settings
                      </Link>
                      <hr className="my-1 border-purple-900/40" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/signin">
                  <button
                    className="px-6 py-2.5 rounded-xl border-2 text-white border-purple-800/40 hover:border-purple-600 hover:bg-purple-950/30 cursor-pointer transition-all duration-300 font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button
                    className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-105"
                    aria-label="Create a new account"
                  >
                    Register
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Auth & Menu Toggle */}
            <div className="md:hidden flex text-white items-center gap-3">
              {!isLoading && !isAuthenticated && (
                <Link href="/signin">
                  <button
                    className="border-2 cursor-pointer border-purple-800/40 hover:border-purple-600 hover:bg-purple-950/30 transition-all duration-300 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                    aria-label="Login to your account"
                  >
                    Login
                  </button>
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-900/30 transition-all duration-300 relative z-[60]"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span
                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 lg:hidden z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />

          {/* Mobile Menu Panel */}
          <div className="absolute top-[73px] left-0 right-0 bottom-0 overflow-y-auto">
            <div className="absolute inset-0 bg-[#07040d]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/30 via-transparent to-fuchsia-950/20" />

            {/* Content */}
            <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-1">
              <Link
                href="/"
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === "/"
                    ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                    : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                }`}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link
                href="/tools"
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === "/tools"
                    ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                    : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                }`}
                onClick={toggleMobileMenu}
              >
                Tools
              </Link>
              <Link
                href="/about"
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === "/about"
                    ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                    : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                }`}
                onClick={toggleMobileMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                  pathname === "/contact"
                    ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                    : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                }`}
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>

              {isAuthenticated && (
                <>
                  <div className="border-t border-purple-900/30 my-4 pt-4 space-y-1">
                    <Link
                      href="/dashboard"
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === "/dashboard"
                          ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                          : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Dashboard
                    </Link>
                    {user?.role === "instructor" && (
                      <Link
                        href="/instructor"
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === "/instructor"
                            ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                            : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Instructor
                      </Link>
                    )}
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                          pathname === "/admin"
                            ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                            : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className={`block px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border ${
                        pathname === "/profile"
                          ? "bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 text-white border-purple-500/40 shadow-lg shadow-purple-950/50"
                          : "text-gray-200 hover:text-white hover:bg-purple-950/30 border-purple-900/20 hover:border-purple-800/40"
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 border text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && !isLoading && (
                <div className="border-t border-purple-900/30 my-4 pt-4 flex flex-col gap-3">
                  <Link href="/signup" onClick={toggleMobileMenu}>
                    <button className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-3.5 rounded-xl cursor-pointer transition-all duration-300 font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] border border-purple-500/30">
                      Register
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}