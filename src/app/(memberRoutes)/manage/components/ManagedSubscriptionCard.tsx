"use client";

import { useState } from "react";
import { Users, UserMinus, Check, X, ShieldAlert, Loader2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { handleJoinRequest, kickMember } from "@/services/subscriptionService";
import { FormProvider, useForm } from "react-hook-form";

export function ManagedSubscriptionCard({ subscription, onUpdate }: { subscription: any; onUpdate: () => void }) {
  const [kickDialogOpen, setKickDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loadingReq, setLoadingReq] = useState<string | null>(null);
  
  const methods = useForm({
    defaultValues: {
      reason: "",
      ss: "",
    }
  });

  const { register, handleSubmit, formState: { isSubmitting }, reset } = methods;

  const onHandleRequest = async (reqId: string, status: "accepted" | "rejected") => {
    setLoadingReq(reqId);
    const res = await handleJoinRequest(subscription._id, reqId, status);
    if (res?.success) {
      toast.success(`Request ${status} successfully`);
      onUpdate();
    } else {
      toast.error(res?.message || "Failed to handle request");
    }
    setLoadingReq(null);
  };

  const onKickSubmit = async (data: any) => {
    if (!selectedUser) return;
    
    const res = await kickMember(subscription._id, selectedUser._id, data.reason, data.ss);
    if (res?.success) {
      toast.success("Member kicked successfully");
      setKickDialogOpen(false);
      reset();
      onUpdate();
    } else {
      toast.error(res?.message || "Failed to kick member");
    }
  };

  const openKickDialog = (user: any) => {
    setSelectedUser(user);
    setKickDialogOpen(true);
  };

  const pendingRequests = subscription.joinRequests?.filter((req: any) => req.status === "pending") || [];

  return (
    <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl shadow-lg space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            {subscription.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {subscription.members.length} / {subscription.maxMembers} Members
          </p>
        </div>
        <Badge variant="outline" className="bg-violet-500/10 text-violet-600 border-violet-500/20 capitalize">
          {subscription.paymentType}
        </Badge>
      </div>

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
            {pendingRequests.map((req: any) => (
              <div key={req._id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                <div>
                  <p className="font-medium text-sm text-foreground">{req.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(req.requestedAt), "PPp")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="w-8 h-8 rounded-full border-green-500/30 text-green-600 hover:bg-green-500/10"
                    onClick={() => onHandleRequest(req._id, "accepted")}
                    disabled={loadingReq === req._id}
                  >
                    {loadingReq === req._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="w-8 h-8 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => onHandleRequest(req._id, "rejected")}
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

      <div className="space-y-4 pt-4 border-t border-border/40">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <Users className="w-4 h-4 text-violet-500" />
          Current Members
        </h4>

        {subscription.members.length === 0 ? (
          <p className="text-sm text-muted-foreground italic p-4 rounded-xl border border-dashed border-border/40 bg-muted/10 text-center">
            No members have joined yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {subscription.members.map((member: any) => (
              <div key={member._id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50 group">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{member.name}</span>
                  <span className="text-xs text-muted-foreground">{member.phone || member.email}</span>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => openKickDialog(member)}
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-full"
                >
                  <UserMinus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={kickDialogOpen} onOpenChange={setKickDialogOpen}>
        <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-destructive">Kick {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onKickSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Reason for removing</Label>
                <Input required placeholder="e.g. Did not pay for 2 months" {...register("reason")} className="bg-background/50" />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Camera className="w-4 h-4 text-muted-foreground" /> Proof / Screenshot (Optional)</Label>
                <div className="p-4 border border-dashed border-border/60 rounded-xl bg-muted/10">
                  <DragNDropUploader name="ss" folder="group-khata/kicks" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setKickDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} variant="destructive">
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Confirm Kick
                </Button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
