"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Loader2, Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import { kickMember } from "@/services/subscriptionService";
import { TUser } from "@/types/user.type";

interface KickMemberDialogProps {
  user: TUser | null;
  subscriptionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function KickMemberDialog({
  user,
  subscriptionId,
  open,
  onOpenChange,
  onSuccess,
}: KickMemberDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const methods = useForm({
    defaultValues: { reason: "", ss: "" },
  });

  const onSubmit = async (data: { reason: string; ss: string }) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const res = await kickMember(
        subscriptionId,
        user._id,
        data.reason,
        data.ss,
      );
      if (res.success) {
        toast.success("Member removed successfully");
        onOpenChange(false);
        methods.reset();
        onSuccess();
      } else {
        toast.error(res.message || "Failed to remove member");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-destructive">
            Remove {user?.name}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <Label>Reason for removal</Label>
              <Input
                required
                placeholder="e.g. Non-payment"
                {...methods.register("reason")}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-muted-foreground" /> Proof /
                Screenshot (Optional)
              </Label>
              <div className="p-4 border border-dashed border-border/60 rounded-xl bg-muted/10">
                <DragNDropUploader name="ss" folder="group-khata/kicks" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="destructive"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm Removal
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
