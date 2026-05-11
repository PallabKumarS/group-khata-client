"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageLoader } from "@/components/shared/Loaders";
import Container from "@/components/shared/Container";
import { getManagerSubscriptions } from "@/services/subscriptionService";
import { CreateSubscriptionDialog } from "./components/CreateSubscriptionDialog";
import { ManagedSubscriptionCard } from "./components/ManagedSubscriptionCard";
import { Settings, FolderKanban } from "lucide-react";
import { TSubscription } from "@/types/subscription.type";

export default function ManageSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<TSubscription[]>([]);

  const fetchSubscriptions = async () => {
    try {
      const res = await getManagerSubscriptions();
      if (res?.success) {
        setSubscriptions(res.data);
      } else {
        toast.error(res?.message || "Failed to load managed subscriptions");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="py-12 text-left min-h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative">
        <div>
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-violet-500/20 rounded-full blur-3xl" />
          <h1 className="text-4xl font-extrabold text-foreground relative z-10 tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-500" />
            Manage{" "}
            <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Groups
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg relative z-10 max-w-xl">
            Create new subscriptions, handle join requests, and manage your
            current members.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <CreateSubscriptionDialog onSuccess={fetchSubscriptions} />
        </div>
      </div>

      {subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {subscriptions.map((sub) => (
            <ManagedSubscriptionCard
              key={sub._id}
              subscription={sub}
              onUpdate={fetchSubscriptions}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl bg-muted/10">
          <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FolderKanban className="w-10 h-10 text-violet-500/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            No Managed Groups
          </h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            You are not managing any subscriptions right now. Click the button
            above to create your first group.
          </p>
        </div>
      )}
    </Container>
  );
}
