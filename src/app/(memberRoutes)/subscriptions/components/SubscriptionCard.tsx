"use client";

import {
  Users,
  IndianRupee,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { requestToJoin } from "@/services/subscriptionService";
import { toast } from "sonner";
import { useAppContext } from "@/providers/ContextProvider";
import { Badge } from "@/components/ui/badge";
import { TSubscription } from "@/types/subscription.type";

interface SubscriptionCardProps {
  subscription: TSubscription;
  onJoinSuccess?: () => void;
}

export function SubscriptionCard({
  subscription,
  onJoinSuccess,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAppContext();

  const isMember = subscription.members.some((m) => m._id === user?._id);
  const isPending = subscription.joinRequests.some(
    (req) => req.user._id === user?._id && req.status === "pending",
  );
  const isFull = subscription.members.length >= subscription.maxMembers;
  const isManager = subscription.manager._id === user?._id;

  const handleJoin = async () => {
    if (!user) {
      toast.error("Please login to join.");
      return;
    }
    setLoading(true);
    const res = await requestToJoin(subscription._id);
    if (res?.success) {
      toast.success("Join request sent successfully!");
      onJoinSuccess?.();
    } else {
      toast.error(res?.message || "Failed to send request.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {subscription.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {subscription.description || "No description provided."}
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 bg-violet-500/10 text-violet-600 border-violet-500/20 capitalize"
          >
            {subscription.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IndianRupee className="w-4 h-4 text-violet-500" />
              Amount
            </div>
            <p className="font-semibold text-foreground">
              ৳{subscription.amount}{" "}
              <span className="text-xs text-muted-foreground capitalize">
                /{subscription.paymentType}
              </span>
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-violet-500" />
              Members
            </div>
            <p className="font-semibold text-foreground">
              {subscription.members.length}{" "}
              <span className="text-xs text-muted-foreground">
                / {subscription.maxMembers}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">Managed by</span>
            <span className="font-medium text-foreground">
              {subscription.manager?.name || "Unknown"}
            </span>
          </div>

          {isManager ? (
            <Button
              disabled
              variant="outline"
              className="border-violet-500/30 text-violet-600 bg-violet-500/5 cursor-not-allowed"
            >
              You are Manager
            </Button>
          ) : isMember ? (
            <Button
              disabled
              variant="outline"
              className="border-green-500/30 text-green-600 bg-green-500/5 cursor-not-allowed"
            >
              Already Joined
            </Button>
          ) : isPending ? (
            <Button
              disabled
              variant="outline"
              className="border-orange-500/30 text-orange-600 bg-orange-500/5 cursor-not-allowed"
            >
              Request Pending
            </Button>
          ) : isFull ? (
            <Button
              disabled
              variant="outline"
              className="border-destructive/30 text-destructive bg-destructive/5 cursor-not-allowed"
            >
              Group Full
            </Button>
          ) : (
            <Button
              onClick={handleJoin}
              disabled={loading}
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all group/btn"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Request to Join
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
