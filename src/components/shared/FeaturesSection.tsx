"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Wallet,
  Users,
  Bell,
  BarChart3,
  ShieldCheck,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Subscription Tracking",
    description:
      "Track shared services like Spotify, Netflix, and ChatGPT. Know exactly who paid and who owes.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Member Management",
    description:
      "Add members with payment methods like bKash, Nagad, DBBL, or bank. Keep everyone organized.",
    color: "from-indigo-500 to-blue-600",
    glow: "rgba(99,102,241,0.15)",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Payment Reminders",
    description:
      "Send automatic email reminders before due dates. No more chasing people for payments.",
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Payment History",
    description:
      "Full history of all transactions. Filter by member, status, date range — everything at a glance.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.15)",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Role-Based Access",
    description:
      "Admin, manager, and member roles. Control who can see and do what across your group.",
    color: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.15)",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Settlements",
    description:
      "Settle debts quickly. Mark payments, track balances, and keep the group financially aligned.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.15)",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards stagger reveal
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "power3.out",
            delay: (i % 3) * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-28 px-4 relative overflow-hidden">
      {/* Subtle divider glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(139,92,246,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto">
        {/* Section title */}
        <div ref={titleRef} className="text-center mb-16 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-violet-500/30 bg-violet-500/10 text-violet-400">
            Everything you need
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Built for real groups,{" "}
            <span className="bg-linear-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">
              not just budgets
            </span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            Group Khata handles the messy parts of shared finances so your
            group can focus on what matters.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="group relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-border cursor-default"
              style={{
                boxShadow: `0 4px 24px 0 ${feature.glow}, 0 1px 4px 0 rgba(0,0,0,0.08)`,
              }}
            >
              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-linear-to-br ${feature.color} shadow-md`}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle bottom glow on hover */}
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-r ${feature.color}`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
