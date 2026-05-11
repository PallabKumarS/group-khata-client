"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "@/providers/ContextProvider";
import { PageLoader } from "@/components/shared/Loaders";
import Container from "@/components/shared/Container";
import { getFromLocalStorage } from "@/lib/localStorage";
import { TUser } from "@/types/user.type";
import { DashboardForm } from "./components/dashboard-form";

export default function DashboardPage() {
  const { setUser } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<TUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = getFromLocalStorage("user") as TUser;
        if (user) {
          setUser(user);
          setUserData(user);
        }
        // biome-ignore lint/suspicious/noExplicitAny: <>
      } catch (error: any) {
        toast.error(error?.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  if (loading) {
    return <PageLoader />;
  }

  if (!userData) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted-foreground">
          User data not found. Please log in again.
        </p>
      </Container>
    );
  }

  return (
    <Container className="py-12 max-w-5xl text-left">
      <div className="mb-10 relative">
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-violet-500/20 rounded-full blur-3xl" />
        <h1 className="text-4xl font-extrabold text-foreground relative z-10 tracking-tight">
          My{" "}
          <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Profile
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 text-lg relative z-10">
          Manage your personal information, payment methods, and profile
          picture.
        </p>
      </div>

      <DashboardForm initialData={userData} />
    </Container>
  );
}
