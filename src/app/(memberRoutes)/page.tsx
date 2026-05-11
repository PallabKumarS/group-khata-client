import type { Metadata } from "next";
import HeroSection from "@/components/shared/HeroSection";
import FeaturesSection from "@/components/shared/FeaturesSection";
import CtaSection from "@/components/shared/CtaSection";

export const metadata: Metadata = {
  title: "Group Khata — Manage Your Group Finances",
  description:
    "Track subscriptions, split expenses, send payment reminders, and settle debts — all in one clean dashboard built for your group.",
  keywords: [
    "Group Khata",
    "Khata",
    "Group",
    "Subscription",
    "Expense Tracking",
  ],
  authors: [{ name: "Pallab Kumar Sarker" }],
  creator: "Pallab Kumar Sarker",
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <CtaSection />
      </div>
    </main>
  );
}
