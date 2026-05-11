import type { Metadata } from "next";
import AuthPage from "@/components/shared/AuthPage";

export const metadata: Metadata = {
  title: "Sign In — Group Khata",
  description: "Sign in to your Group Khata account to manage your group finances.",
};

export default function LoginPage() {
  return <AuthPage defaultTab="login" />;
}
