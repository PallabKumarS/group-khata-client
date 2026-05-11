"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, Users, CreditCard, Bell } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      alpha: number;
    }[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(139,92,246,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9 }
    )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.4"
      )
      .fromTo(
        [card1Ref.current, card2Ref.current, card3Ref.current],
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.15 },
        "-=0.3"
      );

    // Floating animation for the stat cards
    gsap.to([card1Ref.current, card2Ref.current, card3Ref.current], {
      y: "-=10",
      repeat: -1,
      yoyo: true,
      duration: 2.8,
      ease: "sine.inOut",
      stagger: 0.5,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Radial glow blobs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-violet-500/30 bg-violet-500/10 text-violet-400">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Personal Group Finance
        </span>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-foreground"
        >
          Manage your{" "}
          <span className="bg-linear-to-r from-violet-500 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            group finances
          </span>{" "}
          effortlessly
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          Track subscriptions, split expenses, send payment reminders, and
          settle debts — all in one clean dashboard built for your group.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-wrap items-center gap-3 mt-2">
          <Link
            href="/dashboard"
            id="hero-cta-dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/members"
            id="hero-cta-members"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:bg-muted transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            View Members
          </Link>
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="relative z-10 mt-16 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
        <StatCard
          ref={card1Ref}
          icon={<Users className="w-5 h-5 text-violet-400" />}
          label="Active Members"
          value="12"
          trend="+2 this month"
          trendUp
        />
        <StatCard
          ref={card2Ref}
          icon={<CreditCard className="w-5 h-5 text-indigo-400" />}
          label="Subscriptions"
          value="5"
          trend="3 due soon"
        />
        <StatCard
          ref={card3Ref}
          icon={<Bell className="w-5 h-5 text-blue-400" />}
          label="Pending Payments"
          value="৳3,200"
          trend="2 overdue"
          danger
        />
      </div>
    </section>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  danger?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ icon, label, value, trend, trendUp, danger }, ref) => (
    <div
      ref={ref}
      className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-5 flex flex-col gap-3 shadow-lg"
      style={{
        boxShadow:
          "0 4px 32px 0 rgba(139,92,246,0.06), 0 1.5px 8px 0 rgba(0,0,0,0.10)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
          {label}
        </span>
        <span className="p-1.5 rounded-lg bg-muted">{icon}</span>
      </div>
      <span className="text-3xl font-bold tracking-tight text-foreground">
        {value}
      </span>
      <span
        className={`text-xs font-medium ${
          danger
            ? "text-red-400"
            : trendUp
              ? "text-emerald-400"
              : "text-muted-foreground"
        }`}
      >
        {trend}
      </span>
    </div>
  )
);
StatCard.displayName = "StatCard";
