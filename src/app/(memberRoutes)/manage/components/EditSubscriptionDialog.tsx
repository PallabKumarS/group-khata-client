"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updateSubscriptionSchema,
  TUpdateSubscriptionInput,
} from "@/server/modules/subscription/subscription.validation";
import { updateSubscription } from "@/services/subscriptionService";
import { TSubscription } from "@/types/subscription.type";

interface EditSubscriptionDialogProps {
  subscription: TSubscription;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
  onSuccess,
}: EditSubscriptionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<TUpdateSubscriptionInput>({
    resolver: zodResolver(updateSubscriptionSchema),
    defaultValues: {
      name: subscription.name,
      amount: subscription.amount,
      maxMembers: subscription.maxMembers,
      paymentType:
        subscription.paymentType as TUpdateSubscriptionInput["paymentType"],
    },
  });

  const onSubmit = async (data: TUpdateSubscriptionInput) => {
    setIsSubmitting(true);
    try {
      const res = await updateSubscription(subscription._id, data);
      if (res.success) {
        toast.success("Subscription updated successfully");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(res.message || "Failed to update subscription");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>
            Modify details for {subscription.name}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input
                {...methods.register("name")}
                className="bg-background/50"
              />
              {methods.formState.errors.name && (
                <p className="text-xs text-destructive">
                  {methods.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount (৳)</Label>
                <Input
                  type="number"
                  {...methods.register("amount", { valueAsNumber: true })}
                  className="bg-background/50"
                />
                {methods.formState.errors.amount && (
                  <p className="text-xs text-destructive">
                    {methods.formState.errors.amount.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Max Members</Label>
                <Input
                  type="number"
                  {...methods.register("maxMembers", { valueAsNumber: true })}
                  className="bg-background/50"
                />
                {methods.formState.errors.maxMembers && (
                  <p className="text-xs text-destructive">
                    {methods.formState.errors.maxMembers.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="pt-4">
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
                className="bg-violet-600 hover:bg-violet-700"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
