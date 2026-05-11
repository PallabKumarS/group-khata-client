"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginUser, registerUser, setCookies } from "@/services/authService";
import { getMe } from "@/services/userService";
import { useAppContext } from "@/providers/ContextProvider";
import { saveToLocalStorage } from "@/lib/localStorage";

// ── Schemas ─────────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

// ── AnimatedBackground ─────────────────────────────────────────────────────────
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Orbs
    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 180 + Math.random() * 220,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      hue: 260 + i * 15,
      alpha: 0.06 + Math.random() * 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(0, `hsla(${orb.hue}, 80%, 60%, ${orb.alpha})`);
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r || orb.x > canvas.width + orb.r) orb.dx *= -1;
        if (orb.y < -orb.r || orb.y > canvas.height + orb.r) orb.dy *= -1;
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ── Form field helper ─────────────────────────────────────────────────────────
function Field({
  id,
  label,
  type = "text",
  placeholder,
  error,
  showToggle,
  onToggle,
  ...rest
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: react-hook-form register return
  [key: string]: any;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="h-10 pr-10 bg-background/60 border-border/60 focus-visible:ring-violet-500/40"
          {...rest}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {type === "password" ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm() {
  const [showPw, setShowPw] = useState(false);
  const { setUser, setIsLoading } = useAppContext();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await loginUser(data);
      if (!res?.success) {
        toast.error(res?.message ?? "Login failed");
        return;
      }

      await setCookies(res.data.accessToken, res.data.refreshToken);

      const meRes = await getMe();
      if (meRes?.success) {
        setUser(meRes.data);
        saveToLocalStorage("user", meRes.data);
      }

      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field
        id="login-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        id="login-password"
        label="Password"
        type={showPw ? "text" : "password"}
        placeholder="••••••••"
        error={errors.password?.message}
        showToggle
        onToggle={() => setShowPw((v) => !v)}
        {...register("password")}
      />

      <div className="flex items-center justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-muted-foreground hover:text-violet-400 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        id="login-submit"
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!res?.success) {
        toast.error(res?.message ?? "Registration failed");
        return;
      }

      toast.success("Account created! Please sign in.");
      onSuccess();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field
        id="register-name"
        label="Full Name"
        placeholder="Pallab Kumar Sarker"
        error={errors.name?.message}
        {...register("name")}
      />
      <Field
        id="register-email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        id="register-password"
        label="Password"
        type={showPw ? "text" : "password"}
        placeholder="••••••••"
        error={errors.password?.message}
        showToggle
        onToggle={() => setShowPw((v) => !v)}
        {...register("password")}
      />
      <Field
        id="register-confirm-password"
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        showToggle
        onToggle={() => setShowConfirm((v) => !v)}
        {...register("confirmPassword")}
      />

      <Button
        id="register-submit"
        type="submit"
        disabled={isSubmitting}
        className="w-full h-10 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-violet-500/20 transition-all"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

// ── Main Auth Page ─────────────────────────────────────────────────────────────
export default function AuthPage({
  defaultTab = "login",
}: {
  defaultTab?: "login" | "register";
}) {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.1,
      },
    );
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden bg-background">
      {/* Animated blob background */}
      <AnimatedBackground />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div ref={cardRef} className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-violet-500/30">
              GK
            </span>
            <span className="text-foreground">
              Group{" "}
              <span className="bg-linear-to-r from-violet-500 to-indigo-400 bg-clip-text text-transparent">
                Khata
              </span>
            </span>
          </Link>
        </div>

        {/* Glass card */}
        <div
          className="rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-8 shadow-2xl"
          style={{
            boxShadow:
              "0 8px 64px 0 rgba(139,92,246,0.12), 0 2px 16px 0 rgba(0,0,0,0.12)",
          }}
        >
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "login" | "register")}
          >
            <TabsList className="w-full mb-6 bg-muted/60 rounded-xl h-10">
              <TabsTrigger
                id="tab-login"
                value="login"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-violet-500 transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                id="tab-register"
                value="register"
                className="flex-1 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-violet-500 transition-all"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <div className="mb-5">
                <h1 className="text-xl font-bold text-foreground">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in to manage your group finances.
                </p>
              </div>
              <LoginForm />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <div className="mb-5">
                <h1 className="text-xl font-bold text-foreground">
                  Create an account
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Join Group Khata and take control of your shared expenses.
                </p>
              </div>
              <RegisterForm onSuccess={() => setTab("login")} />
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
