"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: innerRef.current,
            start: "top 88%",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div
          ref={innerRef}
          className="relative rounded-3xl border border-violet-500/20 overflow-hidden p-10 sm:p-16 text-center flex flex-col items-center gap-6"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 50%, rgba(59,130,246,0.10) 100%)",
            boxShadow:
              "0 0 80px 0 rgba(139,92,246,0.12), 0 2px 16px 0 rgba(0,0,0,0.10)",
          }}
        >
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />

          <span className="relative inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-violet-500/30 bg-violet-500/10 text-violet-400">
            Start now — it's free
          </span>

          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Ready to take control of{" "}
            <span className="bg-linear-to-r from-violet-500 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              your group finances?
            </span>
          </h2>

          <p className="relative text-muted-foreground text-sm sm:text-base max-w-md">
            Join Group Khata and stop losing track of who owes what. It takes
            less than a minute to get started.
          </p>

          <div className="relative flex flex-wrap items-center justify-center gap-3 mt-2">
            <Link
              href="/register"
              id="cta-register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              id="cta-login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-muted transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
