"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAppContext } from "@/providers/ContextProvider";
import { ThemeToggle } from "./ThemeToggle";



export default function Navbar() {
  const { user, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const getDynamicNavLinks = () => {
    const links = [{ label: "Features", href: "/#features" }];

    if (user) {
      links.push({ label: "Dashboard", href: "/dashboard" });
      links.push({ label: "Subscriptions", href: "/subscriptions" });

      if (user.role === "manager" || user.role === "admin") {
        links.push({ label: "Manage", href: "/manage" });
      }

      if (user.role === "admin") {
        links.push({ label: "Users", href: "/users" });
      }
    }

    return links;
  };

  const navLinks = getDynamicNavLinks();

  // Animate in on mount
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.1 },
    );
  }, []);

  // Glass background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          id="nav-logo"
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
        >
          <span className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
            GK
          </span>
          <span className="text-foreground">
            Group{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">
              Khata
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth actions */}
        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                type="button"
                id="nav-logout"
                onClick={logout}
                className="px-4 py-1.5 rounded-lg text-sm border border-border hover:bg-muted transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                id="nav-login"
                className="px-4 py-1.5 rounded-lg text-sm border border-border hover:bg-muted transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                id="nav-register"
                className="px-4 py-1.5 rounded-lg text-sm text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-md shadow-violet-500/20"
              >
                Get Started
              </Link>
            </>
          )}
          <div className="p-2 rounded-lg hover:bg-muted transition-all cursor-pointer">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          id="nav-mobile-menu"
          className="sm:hidden p-2 rounded-lg hover:bg-muted transition-all"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-background/95 backdrop-blur-xl border-b border-border/60 px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-border/60">
            {user ? (
              <button
                type="button"
                id="nav-mobile-logout"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center h-10 flex items-center justify-center px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center h-10 flex items-center justify-center px-4 py-2 rounded-lg text-sm text-white bg-linear-to-r from-violet-600 to-indigo-600 transition-all"
                >
                  Get Started
                </Link>
                <div className="flex justify-center items-center h-10 px-4 py-2 rounded-lg hover:bg-muted transition-all cursor-pointer">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
