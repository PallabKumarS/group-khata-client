"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageLoader } from "@/components/shared/Loaders";
import Container from "@/components/shared/Container";
import { getAllSubscriptions } from "@/services/subscriptionService";
import { SubscriptionCard } from "./components/SubscriptionCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TSubscription } from "@/types/subscription.type";

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<TSubscription[]>([]);
  const [search, setSearch] = useState("");

  const fetchSubscriptions = async () => {
    try {
      const res = await getAllSubscriptions();

      if (res?.success) {
        setSubscriptions(res.data?.data);
      } else {
        toast.error(res?.message || "Failed to load subscriptions");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while fetching subscriptions",
      );
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubs = subscriptions?.filter((sub) =>
    sub?.name?.toLowerCase()?.includes(search?.toLowerCase()),
  );

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative">
        <div>
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-violet-500/20 rounded-full blur-3xl" />
          <h1 className="text-4xl font-extrabold text-foreground relative z-10 tracking-tight">
            Explore{" "}
            <span className="bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Subscriptions
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 text-lg relative z-10 max-w-xl">
            Browse available groups, check member limits, and send a request to
            join the ones that fit your needs.
          </p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            className="pl-9 bg-card/40 backdrop-blur-md border-border/40 focus-visible:ring-violet-500/50 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredSubs?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSubs?.map((sub) => (
            <SubscriptionCard
              key={sub?._id}
              subscription={sub}
              onJoinSuccess={fetchSubscriptions}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl bg-muted/10">
          <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-violet-500/50" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No Subscriptions Found
          </h3>
          <p className="text-muted-foreground mt-1">
            {search
              ? `No results for "${search}"`
              : "There are currently no active subscriptions to join."}
          </p>
        </div>
      )}
    </Container>
  );
}
