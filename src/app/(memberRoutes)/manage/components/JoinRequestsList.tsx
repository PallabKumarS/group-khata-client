"use client";

import { Check, X, ShieldAlert, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { IJoinRequest } from "@/types/subscription.type";

interface JoinRequestsListProps {
  requests: IJoinRequest[];
  onHandle: (reqId: string, status: "accepted" | "rejected") => Promise<void>;
  loadingReq: string | null;
}

export function JoinRequestsList({
  requests,
  onHandle,
  loadingReq,
}: JoinRequestsListProps) {
  const pendingRequests = requests.filter((req) => req.status === "pending");

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-orange-500" />
        Pending Requests ({pendingRequests.length})
      </h4>

      {pendingRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground italic p-4 rounded-xl border border-dashed border-border/40 bg-muted/10 text-center">
          No pending requests.
        </p>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((req: IJoinRequest) => (
            <div
              key={req._id}
              className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50"
            >
              <div>
                <p className="font-medium text-sm text-foreground">
                  {req.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(req.requestedAt), "PPp")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 rounded-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                  onClick={() => onHandle(req._id, "accepted")}
                  disabled={loadingReq === req._id}
                >
                  {loadingReq === req._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={() => onHandle(req._id, "rejected")}
                  disabled={loadingReq === req._id}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
