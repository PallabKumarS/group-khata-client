"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 text-center"
      >
        <Image
          src="/assets/not-found.webp"
          alt="Page Not Found"
          width={260}
          height={260}
          className="mx-auto opacity-90"
        />

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            The page you are looking for might have been removed, renamed, or is
            temporarily unavailable.
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-border hover:border-primary/40 hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <Link href="/">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>

          <Link href="/dashboard/staff/manage-stocks">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border hover:border-primary/40 hover:text-primary"
            >
              <Store className="w-4 h-4" />
              Main Store
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
