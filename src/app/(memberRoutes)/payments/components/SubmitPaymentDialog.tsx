"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import {
  createPaymentSchema,
  TCreatePaymentInput,
} from "@/server/modules/payment/payment.validation";
import { submitPayment } from "@/services/paymentService";
import { TSubscription } from "@/types/subscription.type";

interface SubmitPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptions: TSubscription[];
  onSuccess: () => void;
}

export function SubmitPaymentDialog({
  open,
  onOpenChange,
  subscriptions,
  onSuccess,
}: SubmitPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<TCreatePaymentInput>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      subscription: "",
      paymentMethod: "",
      amount: 0,
      month: format(new Date(), "MMMM"),
      year: new Date().getFullYear(),
      ss: "",
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const onSubmit = async (data: TCreatePaymentInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitPayment(data);
      if (res.success) {
        toast.success("Payment submitted successfully!");
        onOpenChange(false);
        reset();
        onSuccess();
      } else {
        toast.error(res.message || "Failed to submit payment");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(
        error?.message || "An error occurred while submitting payment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onGroupSelect = (val: string) => {
    setValue("subscription", val);
    const sub = subscriptions.find((s) => s._id === val);
    if (sub) {
      setValue("amount", sub.amount);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Submit Payment</DialogTitle>
          <DialogDescription>
            Enter payment details and upload your screenshot proof.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select
                    onValueChange={(v) => setValue("month", v)}
                    defaultValue={watch("month")}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.month && (
                    <p className="text-xs text-destructive">
                      {errors.month.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="bg-background/50"
                  />
                  {errors.year && (
                    <p className="text-xs text-destructive">
                      {errors.year.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Group / Subscription</Label>
                <Select onValueChange={onGroupSelect}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subscription && (
                  <p className="text-xs text-destructive">
                    {errors.subscription.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount (৳)</Label>
                  <Input
                    type="number"
                    {...register("amount", { valueAsNumber: true })}
                    className="bg-background/50"
                  />
                  {errors.amount && (
                    <p className="text-xs text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <Input
                    {...register("paymentMethod")}
                    placeholder="e.g. bKash, Bank"
                    className="bg-background/50"
                  />
                  {errors.paymentMethod && (
                    <p className="text-xs text-destructive">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Screenshot Proof</Label>
                <div className="p-4 border border-dashed border-border/60 rounded-xl bg-muted/10">
                  <DragNDropUploader name="ss" folder="group-khata/payments" />
                </div>
                {errors.ss && (
                  <p className="text-xs text-destructive">
                    {errors.ss.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-border/40">
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
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Submit Payment
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
