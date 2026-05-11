/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import { useState } from "react";
import { Bell, Settings2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  handleJoinRequest,
  sendReminders,
  deleteSubscription,
} from "@/services/subscriptionService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { TSubscription } from "@/types/subscription.type";
import { TUser } from "@/types/user.type";
import { JoinRequestsList } from "./JoinRequestsList";
import { MembersList } from "./MembersList";
import { KickMemberDialog } from "./KickMemberDialog";
import { EditSubscriptionDialog } from "./EditSubscriptionDialog";

interface ManagedSubscriptionCardProps {
  subscription: TSubscription;
  onUpdate: () => void;
}

export function ManagedSubscriptionCard({
  subscription,
  onUpdate,
}: ManagedSubscriptionCardProps) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [loadingReq, setLoadingReq] = useState<string | null>(null);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onHandleRequest = async (
    reqId: string,
    status: "accepted" | "rejected",
  ) => {
    setLoadingReq(reqId);
    try {
      const res = await handleJoinRequest(subscription._id, reqId, status);
      if (res.success) {
        toast.success(`Request ${status} successfully`);
        onUpdate();
      } else {
        toast.error(res.message || "Failed to handle request");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error processing request");
    } finally {
      setLoadingReq(null);
    }
  };

  const onSendReminders = async () => {
    setSendingReminders(true);
    try {
      const res = await sendReminders(subscription._id);
      if (res.success) {
        toast.success(res.message || "Reminders sent successfully");
      } else {
        toast.error(res.message || "Failed to send reminders");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error sending reminders");
    } finally {
      setSendingReminders(false);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteSubscription(subscription._id);
      if (res.success) {
        toast.success("Subscription deleted successfully");
        onUpdate();
      } else {
        toast.error(res.message || "Failed to delete subscription");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting subscription");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleKickMember = (user: TUser) => {
    setSelectedUser(user);
    setKickDialogOpen(true);
  };

  return (
    <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-lg space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {subscription.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {subscription.members.length} / {subscription.maxMembers} Members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-violet-500/10 text-violet-600 border-violet-500/20 capitalize"
          >
            {subscription.paymentType}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setEditDialogOpen(true)}
            className="w-8 h-8 rounded-full"
          >
            <Settings2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSendReminders}
          disabled={sendingReminders || subscription.members.length === 0}
          className="rounded-full gap-2 border-violet-500/20 hover:bg-violet-500/10 text-violet-600"
        >
          {sendingReminders ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Bell className="w-3 h-3" />
          )}
          Send Reminders
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          className="rounded-full gap-2 border-destructive/20 hover:bg-destructive/10 text-destructive"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </div>

      {/* Lists */}
      <JoinRequestsList
        requests={subscription.joinRequests || []}
        onHandle={onHandleRequest}
        loadingReq={loadingReq}
      />

      <MembersList
        members={subscription.members || []}
        onKick={handleKickMember}
      />

      {/* Dialogs */}
      <KickMemberDialog
        user={selectedUser}
        subscriptionId={subscription._id}
        open={kickDialogOpen}
        onOpenChange={setKickDialogOpen}
        onSuccess={onUpdate}
      />

      <EditSubscriptionDialog
        subscription={subscription}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={onUpdate}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Are you absolutely sure?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Deletion is only possible if no
              members have made payments yet.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={onDelete}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
