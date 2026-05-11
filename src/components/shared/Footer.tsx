import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        {/* Brand */}
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <span className="w-6 h-6 rounded-md bg-linear-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
            GK
          </span>
          Group Khata
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="hover:text-foreground transition-colors">
            Register
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs">
          © {new Date().getFullYear()} Group Khata. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
